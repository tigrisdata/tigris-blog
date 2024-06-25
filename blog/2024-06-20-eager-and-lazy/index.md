---
slug: eager-and-lazy-caching
title: Eager & Lazy Caching feat. Elixir
description: >
  At Tigris we offer a number of novel and practical improvements beyond what
  your typical Object Storage does. We fit these within the existing common APIs
  or as graceful extensions when necessary. In this post we look at how you can
  take control of the Tigris caching mechanism if you feel the need.
keywords: [object storage, blob storage, caching, elixir]
authors: [lw]
tags: [object storage, blob storage, caching, elixir]
---

# Lazy & Eager Caching feat. Elixir

At Tigris we offer a number of novel and practical improvements beyond what your
typical Object Storage does. We fit these within the existing common APIs or as
graceful extensions when necessary. In this post we look at how you can take
control of the Tigris caching mechanism if you feel the need.

To try the examples and follow along you can install the flyctl CLI tool and
then run `flyctl storage create` to get credentials. If you use Livebook, the
collaborative coding notebook for Elixir, this entire post can be used from
Livebook by
[going here](https://livebook.dev/run/?url=https://github.com/lawik/tigris-blogs/blob/main/1-eager-lazy/post.livemd).
Or you can copy and paste the examples into a .exs file to run Elixir as a
script.

You need to install: `ex_aws, ex_aws_s3, hackney, poison and sweet_xml`

And you need the following config, similar setup will be needed in your
preferred language if you don't do Elixir:

```elixir
Mix.install([
  {:ex_aws, "~> 2.5"},
  {:ex_aws_s3, "~> 2.5"},
  {:hackney, "~> 1.20"},
  {:poison, "~> 3.0"},
  {:sweet_xml, "~> 0.6"}
])

Application.put_env(:ex_aws, :s3,
  scheme: "https://",
  host: "fly.storage.tigris.dev",
  port: 443
)

# Livebook prefixes env vars with LB_ and
# we strip that out for ex_aws_s3
[
  "AWS_ACCESS_KEY_ID",
  "AWS_ENDPOINT_URL_S3",
  "AWS_REGION",
  "AWS_SECRET_ACCESS_KEY",
  "BUCKET_NAME"
]
|> Enum.each(fn key ->
  val = System.fetch_env!("LB_#{key}")
  System.put_env(key, val)
end)

alias ExAws.S3

bucket = System.fetch_env!("BUCKET_NAME")
```

## Regular PUT and GET

With Tigris we can do the usual things for object storage. PUT things in the
bucket and then GET them out of the bucket.

```elixir
# The PUT
bucket
|> S3.put_object("myfile.txt", "mycontents")
|> ExAws.request!()
|> Map.fetch!(:status_code)
```

```elixir
# The GET
bucket
|> S3.get_object("myfile.txt")
|> ExAws.request!()
|> Map.fetch!(:body)
```

Not quite so usual is that we offer a whole CDN experience along with your
bucket. And as with any reasonable CDN we will do adaptive caching based on
where requests originate from and try to offer your users the best low-latency
experience in that way. The automatic way is very often the best way. As
outlined in [the caching docs](https://www.tigrisdata.com/docs/objects/caching/)
there are also some sound defaults in place for file types that are typically
static assets.

Of course you deserve more control for when that is desirable. So you can upload
with a particular cache header set which will then be honored by Tigris.

```elixir
# The PUT with cache headers
bucket
|> S3.put_object("myfile-2.txt", "mycontents")
# a minor kludge to set the custom header, will see if we can PR the library :)
|> then(fn op ->
  headers = Map.put(op.headers, "Cache-Control", "public, max-age=30")
  %{op | headers: headers}
end)
|> ExAws.request!()

# The GET, now with cache headers
bucket
|> S3.get_object("myfile-2.txt")
|> ExAws.request!()
|> Map.fetch!(:headers)
```

But in many cases you may know your access patterns or have particular plans.
You may want to ensure eager caching of uploaded files, where every file
uploaded gets spread across a decent chunk of the world. This is possible by
setting the bucket accelerate configuration. I would try this for bucket
intended to do HTTP Live Streaming (HLS) where latency can really matter or for
podcast recordings where you might expect a lot of geographically distributed
clients will request the thing at once.

With AWS CLI it looks like this, unfortunately ExAws doesn't expose a way to do
this so far:

```
aws s3api put-bucket-accelerate-configuration \
	--bucket foo-bucket \
	--accelerate-configuration Status=Enabled
```

## Pre-fetching object listings

Another cool way to control the flow of caching and replication is via Eager
caching when listing objects. This allows you to tell Tigris that you'd like all
the files you are listing to move to your region and be ready and nearby for
subsequent fetching. With one header.

```elixir
bucket
|> S3.list_objects_v2(headers: %{"X-Tigris-Prefetch" => "true"})
|> ExAws.request!()
|> Map.fetch!(:body)
|> Map.fetch!(:contents)
|> Enum.map(& &1.key)
```

With that all the object data behind the keys you have listed immediately start
moving to you across the network. This is incredibly convenient when traversing
a large number of files stored and wanting to make fetching efficient for many
small files where latency can otherwise ruin your throughput.

Now we've covered how to wrangle eager and lazy caching on Tigris with Elixir.
This is just the beginning, we have a lot more to cover.

Check back soon :)
