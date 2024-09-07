---
slug: shadow-bucket-thumbnails
title: Using Shadow Buckets for Fun and Thumbnails
description: >
  Exploring Tigris' shadow bucket feature for fun and thumbnails. In the blog
  post the feature will be used in an less conventional fashion to generate
  thumbnails, where source files as well as generated thumbnails are stored on
  Tigris, to also make use of the included CDN feature.
keywords: [object storage, blob storage, s3, thumbnail, images, cloudfront, cdn]
authors: [bmi]
tags: [object storage, blob storage, s3, thumbnail, images, cloudfront, cdn]
---

# Using Shadow Buckets for Fun and Thumbnails

Generating thumbnails of images has historically been a problem that needed to
involve a number of infrastructure pieces working together, especially if it was
meant to happen on demand. You need:

- A URL format to define the expected operation and the source file to apply
  them to
- Storage where source files are kept
- A server running accepting requests, fetching sources and applying operations
- A cache to retain results and serve them for futher requests to the same URL
- Distribute caches close to users for optimal latency serving them

A common approach for setting this up is having a CDN sit in front of a
thumbnailing server, which then further needs to access some storage of source
files. More recently those thumbnailing servers also became more and more
serverless resources.

There's a bunch of existing tools, which could fill those various roles, but on
Tigris there's a feature called
[Shadow Buckets](https://www.tigrisdata.com/docs/migration/) – which allows you
to make Tigris fetch files from an external S3 source if they don't already
exist in a bucket. This sounds like an interesting way to experiment with a bit
of a different setup to image thumbnail generation.

## The Setup

The idea here is to use Tigris for a few parts related to this image
thumbnailing problem. Tigris storage already provides
[CDN features](https://www.tigrisdata.com/docs/objects/caching/) to all the data
stored within buckets. So we want to request data from a Tigris bucket, which
will be the thumbnail cache, including distributing those thumbnails to regions
close to users.

Source files would also be stored on Trigis. Those source files might or might
not be accessible to endusers, but even if not storing them on Tigris has the
benefit that the source storage – especially for user uploaded content – might
already be available in the region close to the user.

With the thumbnailing service at best running in the same region as well, e.g.
on fly, latency is reduced in a lot of the steps involved in serving those
thumbnails, especially if multiple distinct thumbnails are to be generated from
a single source. It's not just storage and thumbnailing server close to each
other, but both are close to the user as well.

Using Tigris for both sources and thumbnails also means there's just a single
API – the S3 API – to use for managing sources or managing thumbnails, e.g. for
force expiring thumbnails when a user overwrote a source file.

The Shadow Bucket feature of Tigris is the remaining piece, which forwards
requests to any none existing files on the bucket to the thumbnailing service.

## "S3 compatible" Thumbnail Generation

Given the Shadow Bucket feature is meant to reach into another S3 bucket the
target for it needs to be "S3 compatible". Luckily that's not too difficult,
given only a small subset of that API is actually used by Tigris here:

`ListObjects` and `GetObject`

`ListObject` is currently used to confirm that the endpoint configured as Shadow
Bucket is reachable and is indeed some form of an S3 bucket. The thumbnailing
service can return a blank dummy response and that should make the configuration
succeed.

`GetObject` is the more intersting one, given that's the API call used to
retrive a none existing file. That one is not that special though given it's a
plain http request for a file with some additional S3 specific headers, which
can be ignored for this usecase :) Those routes take the requested file and
return a thumbnail to serve.

## The Implementation

So how would this look like in practise?

To test this out I deployed an Elixir service using Phoenix using fly.io
together with a Tigris bucket. I also enabled the Shadow Bucket feature to point
to that Elixir service.

On the homepage the service uses a heex component, which takes in a source and
various attributes around thumbnailing like `size`:

```elixir
<.image src="example.jpg" size={{640, 0}} />
```

Those attibutes are then turning into a URL pointing to the related Tigris
bucket. This is using the format used by thumbor – a python tool doing
thumbnailing – which I happened to have a URL builder/parser around from a
project I maintain using it.

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

The result would look something like this:

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

If not a `GetObject` would be made to the elixir service requesting the file
using that thumbor formatted path. Given there's a few steps to handling those
requests this is forwarded to a plug from the Phoenix router, which then does a
few things in order:

It first checks that the details listed on the path are valid and have not been
tampered with:

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

And if both of those worked out fine the service applies the operations provided
on the URL. They're translated to parameters and calls to the `:image` library
of elixir, which brings `vips` image transformation capabilities into elixir.

This is a little too much code for a blog posts, but it boils down to something
similar to this:

```elixir
%ThumborPath{} = thumbor_path = conn.assigns.thumbor_path
{:ok, image} = Image.from_binary(conn.assigns.source)
{:ok, image} = Image.thumbnail(image, size(thumbor_path), opts(thumbor_path))
{:ok, bin} = Image.write(image, :memory, opts(thumbor_path))

conn
|> put_resp_content_type(MIME.from_path(thumbor_path.source), nil)
|> put_resp_header("content-length", bin |> byte_size() |> Integer.to_string())
|> send_resp(200, bin)
```

The response is then forwarded to the initial requesting user by Tigris and
cached for further requests of that thumbnail – again 🎉.

## Considerations

This experiment turned out to work quite well for the goal of "make it work".
That doesn't mean it's meant to go into a production system as is though.

One concern with image processing is always CPU (or even GPU) resources. Having
an app server also do the thumbnailing is in my opinion a great setup to get
started. It runs locally with your app server and by skipping the caching (make
the app server the host for images) you get quite a bit of "full stack"
capabilities. But that setup isn't common for reasons and those are that once
there's many thumbnails to be generated that takes quite a bit of resources away
from an app server. For elixir specifically I might eventually be looking at
FLAME to scale that service by pushing the thumbnail generation portion to
additional nodes, while retaining the benefits for local development.

The other concern to talk about would be granular caching durations. Using the
Shadow Bucket feature means thumbnails will be cached for as long as their
[files stay on the bucket](https://www.tigrisdata.com/docs/buckets/objects-expiration/).
CDN services commonly can deal with cache headers provided by the downstream
endpoint and expire cached files according to those cache headers. This is
something that might also be explored further later. For many the "immutable"
approach of "never delete a cached thumbnail unless asked for" worked well
enough though.

Repo:
[https://github.com/LostKobrakai/shade_scale](https://github.com/LostKobrakai/shade_scale)
