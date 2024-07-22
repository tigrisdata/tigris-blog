---
slug: metadata-quering-with-elixir
title: Metadata Querying for Object Storage feat. Elixir
description: >
  Now we get to the significantly more disruptive stuff. The things that while
  Tigris is an S3-compatible API it also provides features that enable entirely
  new use-cases and push the boundaries of what you can do with object storage.
  Let's see if we can't set your internal constraint-solver aflame with
  possibilities.
image: ./little-cute-mouse-sitting-on-the-ground.jpeg
keywords: [object storage, querying, elixir, distributed systems]
authors: [lw]
tags: [object storage, querying, elixir, distributed systems]
---

# Metadata Querying for Object Storage

## Introduction

I admit it. My first Tigris blog post about Eager and Lazy caching was kind of
basic. It was important to cover the ground-work. The CDN aspect is important
and I do like the summon-your-data pre-fetch header a lot. Now we get to the
significantly more disruptive stuff. The things that while Tigris is an
S3-compatible API it also provides features that enable entirely new use-cases
and push the boundaries of what you can do with object storage. Let's see if we
can't set your internal constraint-solver aflame with possibilities.

<span align="center">
  ![Tigris globally distributed object
  storage](little-cute-mouse-sitting-on-the-ground.jpeg)
</span>

First a bit of setup. Again, this post is also
[a Livebook](https://livebook.dev/run/?url=https://github.com/lawik/tigris-blogs/blob/main/2-metadata-querying.livemd)
which means that you can run all of it either locally with Livebook Desktop or
on Fly.

```elixir
Mix.install(
  [
    {:ex_aws, "~> 2.5"},
    {:ex_aws_s3, "~> 2.5"},
    {:hackney, "~> 1.20"},
    {:poison, "~> 3.0"},
    {:sweet_xml, "~> 0.6"},
    :jason,
    :req
  ],
  config: [
    ex_aws: [
      access_key_id: [{:system, "LB_AWS_ACCESS_KEY_ID"}],
      secret_access_key: [{:system, "LB_AWS_SECRET_ACCESS_KEY"}],
      endpoint_url_s3: [{:system, "LB_AWS_ENDPOINT_URL_S3"}],
      region: [{:system, "LB_AWS_REGION"}],
      s3: [scheme: "https://", host: "fly.storage.tigris.dev", port: 443]
    ]
  ]
)
```

```elixir
alias ExAws.S3

bucket = System.fetch_env!("LB_BUCKET_NAME")

# Get some files, upload some files
# If you run this many times github might get cranky

%{
  "manifesto.txt" =>
    "https://ia800408.us.archive.org/26/items/HackersManifesto/Hackers-manafesto.txt",
  "sample.jpg" => "https://underjord.io/assets/images/lawik-square.jpg",
  "lawik.json" => "https://api.github.com/users/lawik",
  "underjord.svg" => "https://underjord.io/img/logo2.svg",
  "globe.webp" =>
    "https://cdn.prod.website-files.com/657988158c7fb30f4d9ef37b/6582a4f8d777a7f9c79bee68_Globally%20Distributed%20S3-compatible.webp"
}
|> Enum.map(fn {name, url} ->
  %{body: body, headers: headers} = Req.get!(url, decode_body: false)
  type = headers["content-type"] |> hd() |> String.split(";") |> hd()
  # Spacing in time for demo purposes
  :timer.sleep(1000)
  S3.put_object(bucket, name, body, content_type: type) |> ExAws.request!()
end)
```

## What is Metadata Querying?

If you read back on the blog the engineering team at Tigris are very excited
about Foundation DB and that is the underpinning for the entire metadata system
and particularly for this feature. A fast and scalable metadata system lets
Tigris find and fetch data with much lower latency than is typical of object
storage. A highly capable metadata system allows Tigris to do more with
metadata.

Let's talk metadata querying. It allows us to perform SQL-style queries on our
object metadata and importantly sort it based on metadata. Currently three
fields are supported:

- `Content-Type` meaning the mimetype, so "image/jpeg", "text/html" or
  "application/json".
- `Content-Length` which holds the number of bytes the object takes up on disk.
- `Last-Modified` a timestamp for when the object last changed.

It is all done via a custom header to fit within the bounds of the S3 API. You
can do a lot with this. Some of it is straight up practical.

## Fetching a range of mime types

Fetching a set of content types. Not just specific ones but even based on a
prefix. The comparisons specified here are a little bit unusual as they are
range queries. Anything between "image/" and "image0" indicates essentially
everything that starts with "image/".

This is incredibly awkward to do in many object storage providers.

```elixir
bucket
|> S3.list_objects_v2(
  headers: %{
    "X-Tigris-Query" => ~s(`Content-Type` > "image/" and `Content-Type` < "image0")
  }
)
|> ExAws.request!()
|> Map.fetch!(:body)
|> Map.fetch!(:contents)
```

Others are very flexible and quite the "we can't wait to see what you do with
it" such as:

## Ordering/sorting

You can query three values at this point. `Content-Type`, `Content-Length` (file
size) and `Last-Modified`. All of these are practical but combined with the
`ORDER BY` feature which lets you sort the result of a query on on of these
fields you suddenly get something wildly powerful. You get ordering.

```elixir
bucket
|> S3.list_objects_v2(
  headers: %{
    "X-Tigris-Query" => ~s(`Content-Length` >= 0 ORDER BY `Last-Modified` DESC)
  }
)
|> ExAws.request!()
|> Map.fetch!(:body)
|> Map.fetch!(:contents)
```

Ordering gives us the fundamentals for a lot of interesting stuff. It is a
building block for many types of data stores and most object storage don't make
this an easy question to answer without the risk of paging through thousands of
items to find the most recent one.

You can build a Write-Ahead Log. You can do Event Sourcing. These require
consistent ordering and a source that will serialize incoming data for you and
determine the order. Tigris will.

Write at local speed, anywhere, globally. Read out locally as if talking to a
CDN. But use it for complex and interesting functionality. Use it as the source
of truth, the coordinating layer, a super simple cloud sync for your local-first
application. Along with presigned URLs or even
[signed prefix uploads](https://www.tigrisdata.com/docs/objects/upload-via-html-form/)
that you can have some very interesting stuff where you very rarely talk to your
application server. Very .. dare I say serverless? Oh, right, no, that was
taken.

[Check the docs](https://www.tigrisdata.com/docs/objects/query-metadata/) to see
what operators you have available to you. I'm sure you can come up with more
neat tricks to pull with this.

I see the content types, file sizes and timestamp all matter in various ways
depending on what type product you are building. What could it enable for yours?

Fundamentally this functionality can remove the need for a separate metadata
store to track typical things, like the order of files or mimetypes for later
filtering. And if you've tried to lean on object storage for file storage
without also writing a metadata record in some traditional database you've
regretted it the moment you want to provide some sortable headers for a file
list. Or want to show the 3 most recent uploads among thousands.

Because of how I'm wired it makes me want to try absolutely filthy cheap ideas
about how to implement a microblog with a chronological timeline. Your servers
only job would be
[providing presigned URLs](https://www.tigrisdata.com/docs/objects/presigned/)
or
[even sign for public uploads for a whole prefix](https://www.tigrisdata.com/docs/objects/upload-via-html-form/)
for creating new entries and
[presigned cookies for fetching entries](https://www.tigrisdata.com/docs/objects/access-objects-via-cookies/)
if the bucket isn't public. By making a very particular design you can really
make something quite remarakble in terms of pricing and efficiencies.

It reminds me of the first time I heard of the potential latency advantages of
satellite Internet. Shoot up. Shoot straight across. Shoot down. In this case.
Upload to the closest bit of cloud, spread all across, download where needed.
You don't need the roundtrips. You can answer simple queries by only speaking S3
API with some Tigris special sauce. CDN-speed reads, CDN-speed writes and no
in-between application server.

<!-- livebook:{"offset":7287,"stamp":{"token":"XCP.L3dZI_ThJA48ptvCLrGjLVQIH27Qc9TvWU-59i-0sly-DZdUO9Ke-2_rJ3J0cZbtpwa3AEGlBMz4SCI9L_rd9tAlfEZSDcv5euXdRsaLM2K_PAOfsTCtfJaN6-lpiUqds3jD_pBHsqTY7MiTV-uSIE6vZVGiSnOCgVrW4O0mDKLsDSL1kFkKczvuwHyXUpOmLqBkI0Ph-3AWUieOWG2BWFNVEsj9ybC9DiRqaI4","version":2}} -->
