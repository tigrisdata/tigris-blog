---
slug: shadow-bucket-thumbnails
title: Using Shadow Buckets for Fun and Thumbnails
description: >
  Exploring Tigris' shadow bucket feature for fun and thumbnails. In the blog
  post the feature will be used in an less conventional fashion. An additional
  elixir service will generate thumbnails, where source files as well as
  generated thumbnails are stored on Tigris, while making use of the included
  CDN features of Tigris.
image: ./a-pair-of-scissors-cutting-a-photograph.jpg
keywords: [object storage, blob storage, s3, thumbnail, images, cloudfront, cdn]
authors: [bmi]
tags: [object storage, s3, thumbnail, images, cdn]
---

# Using Shadow Buckets for Fun and Thumbnails

_We’re Tigris, a globally distributed object storage platform built for
high-performance workloads. It’s designed to work seamlessly across clouds,
countries, and continents, making it simple and efficient for developers.
[Try it out, you’ll be up and running in a minute.](https://storage.new/)_

Making thumbnails load reasonably quickly is surprisingly complex for such a
common problem. With
[Shadow Buckets](https://www.tigrisdata.com/docs/migration/), Tigris can take
over much of the heavy lifting for you. Don't worry about who is reading your
sandwich review blog around the world - we'll make sure your thumbnails are
right there when you need them, from Chicago to Singapore.

<!-- truncate -->

Doing this the old way, you'd need:

- A URL format to define the expected operation and the source file to apply
  them to
- A storage solution to keep source files around
- A server running accepting requests, fetching sources and applying operations
- A cache to retain results and serve them for futher requests to the same URL
- Distribute caches to locations close to users for optimal latency serving them

In a common setup a CDN would be placed in front of a thumbnailing server, which
then further needs access to some storage holding source files. More recently,
developers tend to implement those thumbnailing servers as serverless
components.

There's a bunch of existing pieces, which could can be combined to fill those
various roles, but in this blog post we'll explore using Shadow Buckets to
simplify that setup.

<span align="center">
  ![Tigris globally distributed object storage](a-pair-of-scissors-cutting-a-photograph.jpg)
</span>

## The Setup

Let's see how Shadow Buckets can make your life easier! With Shadow Buckets
enabled Tigris will fetch files, which do not exist in a bucket, from another
S3-compatible source, caching them for later requests. By storing thumbnails in
a Tigris bucket we get access to the
[CDN features](https://www.tigrisdata.com/docs/objects/caching/) of Tigris,
which will not just cache thumbnails, but also distribute them to regions close
to users for fast access to those thumbnails.

Tigris buckets will also store source files. While end users might not directly
access source files they still benefit from the same distribution across
regions.

If a nearby region already has the source file then generating a thumbnail can
happen in a close, if not the same, region as well – especially if the service
to generate the thumbnail is also hosted on [Fly](https://fly.io) like Tigris.

Where users can upload sources it's also likely they'd trigger the generation of
thumbnails on those sources, which would all happen close to their location,
reducing latency in many of the steps involved.

Using Tigris for both sources and thumbnails also means there's only a single
API to deal with. Be it uploading sources or expiring thumbnails on overwrites –
the S3 API would handle both.

## "S3-compatible" Thumbnail Generation

Given the Shadow Bucket feature is primarily meant to reach into another S3
based storage the target for it needs to be somewhat "S3-compatible". Luckily
that's not too difficult, given the feature actually uses only a small subset of
that API to work.

`ListObject` is currently used to confirm Tigris can reach an endpoint
configured as Shadow Bucket and at least to a degree conforms to the expectation
of being S3-compatible. The thumbnailing service can return a static dummy
response and that should make the configuration succeed.

`GetObject` is the more interesting one, given that's the API call used to
retrive any non-existant files. That one is not that special though given it's
for the most part a plain http request for a file – but with some additional S3
specific headers, which you can ignore for this use-case :) When accessed, these
routes will use the provided path to get details about the requested thumbnail
and return it once generated.

## The Implementation

Ready to see how this magic works in practice? Don't worry, we'll walk you
through it step by step!

To test this out I deployed an Elixir service using Phoenix on Fly together with
a fresh Tigris bucket. I also enabled the Shadow Bucket feature pointing it
towards that Elixir service.

For rendering the homepage the service uses a function component, which takes in
a source and various attributes around thumbnailing like `size`:

```elixir
<.image src="example.jpg" size={{640, 0}} />
```

The function component then turns those attributes into a URL pointing to the
related Tigris bucket, which the function component continues to use as the
source on the rendered `<img />` tag.

For this implementation I chose the format defined by Thumbor. Thumbor is a
python tool for thumbnail generation - for which I happened to have a URL
builder/parser around from a project I maintain.

```elixir
path =
  %ThumborPath{
    source: assigns.src,
    size: assigns.size,
    filters: ["quality(85)"]
  }
  |> ThumborPath.build(ShadeScale.thumbor_secret())

Path.join(ShadeScale.thumbor_host(), path)
```

The resulting URL would look something like this:

```
https://shade-scale.fly.storage.tigris.dev
  /fqagdEceJb3wnaQs_2ZFPVxWz9s=
  /640x0
  /filters:quality(85)
  /example.jpg
```

A user visiting the homepage would then request that file from the host being
the Tigris bucket.

If the file exists in the bucket Tigris would serve it directly - so 🎉.

If not a `GetObject` would be made to the Elixir service requesting the file
using that thumbor-formatted path. Given there's a few steps to handling those
requests the Phoenix router forwards them to a plug, which takes care of those
steps one by one. `Plug.Builder` does a great job composing individual plugs per
step to one module, which also implements the plug interface.

The first step is a check that the path is a valid one, which has not been
tampered with and if so stores the parsed data on the `conn.assigns`:

```elixir
defp check_hmac(conn, _) do
  path = conn.path_info |> Path.join() |> URI.decode()

  if ThumborPath.valid?(path, conn.assigns.secret) do
    assign(conn, :thumbor_path, ThumborPath.parse(path))
  else
    conn
    |> send_resp(:forbidden, "")
    |> halt()
  end
end
```

In the next step the system fetches the source from the Tigris bucket:

```elixir
defp fetch_from_source(conn, _) do
  [bucket | _] = String.split(conn.host, ".")
  %ThumborPath{source: path} = conn.assigns.thumbor_path
  req = Req.new() |> ReqS3.attach()

  case Req.get(req, url: "s3://#{bucket_to_query}/#{path}", retry: false) do
    {:ok, %{status: 200, body: image}} when is_binary(image) ->
      assign(conn, :source, image)

    {:ok, %{status: status}} when status in [200, 404] ->
      conn |> send_resp(404, "") |> halt()

    {:ok, %{status: 500, body: body}} ->
      conn |> send_resp(500, body) |> halt()
  end
end
```

If both of those steps complete successfully the service applies the operations
provided on the URL. The path segments are translated to parameters and calls to
the `:image` library of elixir, which brings `libvips` image transformation
capabilities into elixir.

That code is a little too much for a blog posts, but it boils down to something
similar to this:

```elixir
defp apply_transformations(conn, _) do
  %ThumborPath{} = thumbor_path = conn.assigns.thumbor_path
  {:ok, image} = Image.from_binary(conn.assigns.source)
  {:ok, image} = Image.thumbnail(image, size(thumbor_path), opts(thumbor_path))
  {:ok, bin} = Image.write(image, :memory, opts(thumbor_path))

  conn
  |> put_resp_content_type(MIME.from_path(thumbor_path.source), nil)
  |> put_resp_header("content-length", bin |> byte_size() |> Integer.to_string())
  |> send_resp(200, bin)
end
```

The response is then forwarded to the initial requesting user by Tigris and
caches it for further requests of that thumbnail – again 🎉.

## Considerations

This experiment turned out to work quite well for the goal of making it work.
That however doesn't mean it's meant to go into a production system as is
though.

One concern with image processing is always CPU (or even GPU) resources. Having
an app server also do the thumbnailing is in my opinion a great setup to get
started. It runs locally with your app server and by skipping the caching - make
the app server be the host for images - you get quite a bit of "full stack"
capabilities just using your app.

But that setup isn't common for reasons. Once you need to generate many
thumbnails that takes quite a bit of resources away from an app server. For
Elixir and Phoenix specifically however I might eventually look at FLAME to
scale that service. By pushing the thumbnail generation portion to additional
nodes the resource requirements might be fine in production, while retaining the
benefits of running everything "inline" for local development.

The other concern to talk about would be granular caching durations. Using the
Shadow Bucket feature means the system will cache thumbnails for as long as
their
[files stay on the bucket](https://www.tigrisdata.com/docs/buckets/objects-expiration/).
CDN services commonly deal with cache headers provided by the downstream
endpoint and expire cached files according to those headers. We might also
explore a better answer to that concern more closely at a later time. For now
the implementation makes use of the common "immutable" approach of "never delete
a cached thumbnail unless asked for".

There you have it - a powerful, globally distributed thumbnail system that's
surprisingly easy to set up. Give it a try and watch those load times plummet!

Repo:
[https://github.com/LostKobrakai/shade_scale](https://github.com/LostKobrakai/shade_scale)
