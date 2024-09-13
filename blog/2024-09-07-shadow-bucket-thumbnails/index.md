---
slug: shadow-bucket-thumbnails
title: Using Shadow Buckets for Fun and Thumbnails
description: >
  Exploring Tigris' shadow bucket feature for fun and thumbnails. In the blog
  post the feature will be used in an less conventional fashion. An additional
  elixir service will generate thumbnails, where source files as well as
  generated thumbnails are stored on Tigris, while making use of the included
  CDN features of Tigris.
keywords: [object storage, blob storage, s3, thumbnail, images, cloudfront, cdn]
authors: [bmi]
tags: [object storage, blob storage, s3, thumbnail, images, cloudfront, cdn]
---

# Using Shadow Buckets for Fun and Thumbnails

Generating thumbnails of images has historically been a problem that needed to
involve a number of infrastructure pieces working together - especially if it
was meant to happen on demand. You'd need:

- A URL format to define the expected operation and the source file to apply
  them to
- Storage where source files are kept
- A server running accepting requests, fetching sources and applying operations
- A cache to retain results and serve them for futher requests to the same URL
- Distribute caches to locations close to users for optimal latency serving them

A common approach for setting this up is having a CDN sit in front of a
thumbnailing server, which then further needs access to some storage holding
source files. More recently those thumbnailing servers are often implemented as
serverless components.

There's a bunch of existing tools, which could fill those various roles, but
Tigris has a feature called
[Shadow Buckets](https://www.tigrisdata.com/docs/migration/). With shadow
buckets configured Tigris will fetch files, which do not existing in a bucket,
from another S3-compatible source - which poses to be an interesting option for
a bit of a different approach to image thumbnail generation.

<span align="center">
  ![Tigris globally distributed object storage](a-pair-of-scissors-cutting-a-photograph.jpg)
</span>

## The Setup

The Shadow Buckets feature will be used to query for non-existant thumbnails
caching them for later requests. By storing thumbnails in a Tigris bucket we get
access to the [CDN features](https://www.tigrisdata.com/docs/objects/caching/)
of Tigris, which will not just cache thumbnails, but also distribute them to
regions close to users for fast access to those thumbnails.

Source files will also be stored on Tigis buckets. While source files might not
be accessible directly to end users they still benefit from the same
distribution across regions.

If a source file is already present in a nearby region then generating a
thumbnail can happen in a close, if not the same, region as well – especially if
the service to generate the thumbnail is also hosted on [Fly](https://fly.io)
like Tigris.

Where users can upload sources it's also likely they'd trigger the generation of
thumbnails on those sources, which would all happen close to their location,
reducing latency in many of the steps involved.

Using Tigris for both sources and thumbnails also means there's only a single
API to deal with. Be it uploading sources or expiring thumbnails on overwrites –
the S3 API would handle both.

## "S3-compatible" Thumbnail Generation

Given the Shadow Bucket feature is primarily meant to reach into another S3
based storage the target for it needs to be somewhat "S3-compatible". Luckily
that's not too difficult, given only a small subset of that API is actually used
for the feature to work.

`ListObject` is currently used to confirm that an endpoint configured as Shadow
Bucket is reachable and at least to a degree conforms to the expectation of
being S3-compatible. The thumbnailing service can return a static dummy response
and that should make the configuration succeed.

`GetObject` is the more interesting one, given that's the API call used to
retrive any non-existant files. That one is not that special though given it's
for the most part a plain http request for a file – but with some additional S3
specific headers, which can be ignored for this use-case :) These routes when
accessed would use the provided path to get details about the requested
thumbnail and return it once generated.

## The Implementation

So how would this look in practice?

To test this out I deployed an Elixir service using Phoenix on Fly together with
a fresh Tigris bucket. I also enabled the Shadow Bucket feature pointing it
towards that Elixir service.

For rendering the homepage the service uses a function component, which takes in
a source and various attributes around thumbnailing like `size`:

```elixir
<.image src="example.jpg" size={{640, 0}} />
```

Those attibutes are then turned into an URL pointing to the related Tigris
bucket, which the function component continues to use as the source on the
rendered `<img />` tag.

For this implementation I chose the format used by Thumbor. Thumbor is a python
tool for thumbnail generation - for which I happened to have a URL
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

If the file exists in the bucket it would be served by Tigris directly - so 🎉.

If not a `GetObject` would be made to the Elixir service requesting the file
using that thumbor-formatted path. Given there's a few steps to handling those
requests they're forwarded to a plug by the Phoenix router, which takes care of
those steps one by one. `Plug.Builder` does a great job composing individual
plugs per step to one module, which also implements the plug interface.

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

In the next step the source is fetch from the Tigris bucket:

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
cached for further requests of that thumbnail – again 🎉.

## Considerations

This experiment turned out to work quite well for the goal of making it work.
That however doesn't mean it's meant to go into a production system as is
though.

One concern with image processing is always CPU (or even GPU) resources. Having
an app server also do the thumbnailing is in my opinion a great setup to get
started. It runs locally with your app server and by skipping the caching - make
the app server be the host for images - you get quite a bit of "full stack"
capabilities just using your app.

But that setup isn't common for reasons. Once there's many thumbnails to be
generated that takes quite a bit of resources away from an app server. For
Elixir and Phoenix specifically however I might eventually look at FLAME to
scale that service. By pushing the thumbnail generation portion to additional
nodes the resource requirements might be fine in production, while retaining the
benefits of running everything "inline" for local development.

The other concern to talk about would be granular caching durations. Using the
Shadow Bucket feature means thumbnails will be cached for as long as their
[files stay on the bucket](https://www.tigrisdata.com/docs/buckets/objects-expiration/).
CDN services commonly deal with cache headers provided by the downstream
endpoint and expire cached files according to those headers. Having a better
answer to that concern is something that might also be explored more closely at
a later time. For now the implementation makes use of the common "immutable"
approach of "never delete a cached thumbnail unless asked for".

Repo:
[https://github.com/LostKobrakai/shade_scale](https://github.com/LostKobrakai/shade_scale)
