---
slug: fly-tigris-juicefs
title: Sharing your Ollama models between Fly Machines using JuiceFS and Tigris
description: >
  Tigris offers pretty great object storage, but the S3 API has its limits. Here
  I show how you can use JuiceFS to turn your bottomless Tigris storage into a
  FUSE mounted filesystem where we persist model data for more efficiently
  running production-scale Ollama on Fly.io
keywords:
  - blob storage
  - caching
  - juicefs
  - ollama
  - ai
  - llm
  - filesystem
authors:
  - jt
tags:
  - build-with-tigris
  - blob storage
  - caching
  - ai
  - filesystem
---

If you've been toying around in the AI space over the past few months, you've
probably heard of [Ollama](https://ollama.com/). Ollama is a tool for running
various LLMs locally on your own hardware, and currently supports a bunch of
open models from Google, Facebook and independent sources.

Besides the basic terminal chat function, Ollama has an
[API](https://github.com/ollama/ollama/blob/main/docs/api.md) for use from
within your favourite programming languages. This means you can build your very
own LLM-powered apps!

Let's say we've built the next killer LLM app: ChatWich (which allows you to
chat with your sandwich) and people are loving it when you show it off on your
laptop, but personally visiting all your customers with your computer in hand is
getting tiring, and the travel bills are starting to outweigh the (awesome)
frequent flyer miles you're getting.

It's time to move to the cloud.

<!-- truncate -->

# Getting Ollama up and running on Fly.io

Getting up and running on Fly.io isn't very complex, we have
[GPUs](https://fly.io/gpu) available to accelerate AI workloads on Fly Machines.

We can start with the official
[Ollama Docker image](https://hub.docker.com/r/ollama/ollama) which comes with
everything you need to run GPU accelerated Ollama on a Machine. The `fly launch`
command has a few parameters:

- `-i` to start with an existing image.
- `--vm-size` to set the `vm.size` property to `a100-40gb`.
- `-r ord` to set the primary region to Chicago; GPUs are only available in
  [specific regions](https://fly.io/docs/gpus/#regions-with-gpus) for more info.
- `--no-deploy` to let us make a quick edit to the `fly.toml` before deploying.

```bash
$ fly launch -i ollama/ollama:latest -r ord --vm-size a100-40gb --no-deploy
```

We also need to make an edit to the `fly.toml`: Ollama stores its models in
`~/.ollama` by default, so to avoid downloading them every time a machine spins
up we can persist this directory using a
[Fly Volume](https://fly.io/docs/volumes/overview/).

In your `fly.toml`, make the following changes:

```
...
[build]
image = 'ollama/ollama:latest'

# Add this mount
[mounts]
source = "ollama_data"
destination = "/root/.ollama"
# ^^^

[http_service]
internal_port = 11434 # change this
force_https = false # change this
...
```

With that done, we can now `fly deploy`, and our Machine should come up pretty
quickly.

As a first order of business, we also need to release all our public IPs, so
only you have access to the Ollama API from within your 6pn network.

Firstly `fly ips allocate-v6 --private`, then `fly ips list` and run
`fly ips release <ip>` for everything except the one with type "private". When
you're done, it should look like this:

```bash
$ fly ips list
VERSION	IP                	TYPE   	REGION	CREATED AT
v6     	fdaa:0:d400:0:1::6	private	global	1m15s ago
```

Your Ollama API is now private and only accessible from within your private
network.

# The real problem

Now that we have the Ollama API up and running on a Machine, we can skip forward
a bit into our pretend company's future. It's now 4 days later and we have
become the largest AI company in the world by an order of magnitude.

There's one problem: every time we create a new Machine while scaling to follow
demand, we have to download the model we're using from scratch from Ollama's
repository. This is becoming the largest problem for our app, since our
thousands of machines all pulling the models down is wasting precious GPU
Machine time.

If only there was a way to _share_ our stored models between Machines...

# Using JuiceFS to _share_ our stored models between Machines

Getting started using JuiceFS on Fly.io is actually pretty easy. JuiceFS needs
two things to function:

- A metadata database, which is a "normal" DB like Redis, MariaDB, PostgreSQL,
  etc.
- A place to put all of your data, usually using object storage.

We're going to use [Supabase Postgres](https://fly.io/docs/reference/supabase/)
for our metadata engine, and [Tigris](https://fly.io/docs/reference/tigris/) for
our data storage.

Let's attach these to our app:

```bash
# Make sure to set region to `ord` here for low latency
$ fly ext supabase create
...

$ fly ext storage create
...
```

If these two commands worked properly, you should see the following secrets set
for your app:

```bash
$ fly secrets list
NAME                  ...
AWS_ACCESS_KEY_ID     ...
AWS_ENDPOINT_URL_S3   ...
AWS_REGION            ...
AWS_SECRET_ACCESS_KEY ...
BUCKET_NAME           ...
DATABASE_POOLER_URL   ...
DATABASE_URL          ...
```

Next, install JuiceFS in your docker image. In order to do this, you'll need to
build your own Ollama docker image that includes JuiceFS.

In `fly.toml`, remove the `[build]` section:

```
...
[build] # erase this line
image = 'ollama/ollama:latest' # erase this line
...
```

We also have to change our volume mount from before. Delete the previous mount
and volumes (`fly vol delete`) and add a new one:

```
...
[mounts]
source = "juicefs_cache"
destination = "/var/jfsCache"
...
```

And add a `Dockerfile` to your project that grabs the stock `ollama/ollama`
image and installs JuiceFS and our setup script:

```docker
FROM ollama/ollama:latest

# Install dependencies and clean up
RUN apt-get -y update && apt-get -y install ca-certificates curl && apt-get -y clean && rm -rf /var/lib/apt/lists/*

# Install JuiceFS
RUN curl -sSL https://d.juicefs.com/install | sh -

# Copy setup script into the image, see below
COPY setup.sh ./
RUN chmod +x ./setup.sh

ENTRYPOINT ["/setup.sh"]
```

`setup.sh` is a bit of glue to get this all working together, it has the
following contents:

```bash
#!/bin/bash

juicefs format \
    --storage s3 \
    --bucket $AWS_ENDPOINT_URL_S3/$BUCKET_NAME \
    --access-key $AWS_ACCESS_KEY_ID \
    --secret-key $AWS_SECRET_ACCESS_KEY \
    $DATABASE_URL \
    juicefs-fly

echo "Mounting JuiceFS to /root/.ollama"
juicefs mount --prefetch=256 --buffer-size=12288 -d $DATABASE_URL /root/.ollama

/bin/ollama serve
```

It does a few things:

- `juicefs format` which is helpfully idempotent, sets up the metadata and data
  stores for JuiceFS.
- `juicefs mount`, which mounts the new storage to the machine at
  `/root/.ollama`. It has some parameters to increase model download
  performance.

With that, we're ready to roll! Run `fly deploy` and make sure to clean up any
unused volumes.

We can test if our install is working using an ephemeral Fly Machine:

```
$ fly m run -e OLLAMA_HOST=http://<your app name>.flycast --shell ollama/ollama
...
$ ollama run llama3 "hello ollama!"
...
Hello there! I'm OLLAMA, your friendly AI companion! It's great to meet you! What brings you here today? Do you have a specific topic or question in mind, or are you just looking for some fun
conversation? Let me know, and I'll do my best to help!
```

You should see normal or slightly slower than normal download time the first
time you pull your model (JuiceFS has less I/O performance than a raw volume),
but on n>1 starts you should see it pulling the model from JuiceFS instead of
the registry, which gives increased performance and also doesn't have rate
limits or shared bandwidth like Ollama's registry does.

You can find the full code for this example
[here](https://github.com/tigrisdata-community/juicefs-ollama).

What are some of the things you've been using object storage for in your
projects? What AI models are you using? Are you storing video or pictures? Tell
us about it on [X (Twitter)](https://twitter.com/TigrisData) or chat us up on
[the Fly.io community forum](https://community.fly.io/tag/storage)!
