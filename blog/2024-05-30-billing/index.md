---
slug: enabling-billing-for-tigris-in-july
title: We're enabling billing for Tigris in July
description: >
  Since we launched our public beta three months ago, our usage has skyrocketed,
  and hundreds of early adopters have picked Tigris as their storage solution.
  We've implemented tons of requested features and invested heavily in Tigris'
  performance, security, and reliability. With that, we will start billing for
  Tigris usage in July because we're confident that Tigris is reliable enough
  for us to justify doing that.
image: ./tigris-enabling-billing-d2.png
keywords: [object storage, blob storage, billing]
authors: [ot]
tags: [object storage, blob storage, billing]
---

# We're enabling billing for Tigris in July

Since we launched our public beta three months ago, our usage has skyrocketed,
and hundreds of early adopters have picked Tigris as their storage solution.
We've implemented tons of requested features and invested heavily in Tigris'
performance, security, and reliability. We're grateful for your feedback and
confident that we are on track to make the most developer-friendly object
storage service.

<span align="center">
  ![Tigris globally distributed object
  storage](tigris-enabling-billing-d2.png) [Credits: Xe Iaso - https://xeiaso.net/]
</span>

With that, we will start billing for Tigris usage in July because we're
confident that Tigris is reliable enough for us to justify doing that. Check out
our [pricing page](https://www.tigrisdata.com/docs/pricing/) for details on the
pricing structure. The beta tag will stay, but we'll offer the same support
expected from a highly reliable production-ready platform. Check out our
[SLA page](https://www.tigrisdata.com/docs/legal/sla/) for details about our
uptime commitment.

TL;DR:

- Data storage is $0.02 per GB
  - Unless you elect to control the data distribution and store multiple copies
    of your data in different regions, if you create primary copies in two
    regions, you will be charged twice for the object.
  - Note that this doesn't apply to Tigris's default behavior of managing the
    data distribution for you. As always, that counts as a single copy. Neither
    does this apply to pull-through caching, which is free, as always.
- PUT, COPY, POST, and LIST requests are $0.005/1000 requests
- GET, SELECT, and all other requests are $0.0005/ 1000 requests
- Data egress: $0.00 per GB
- Unauthorized requests to your buckets: $0.00 per request

Despite all of this, if you suffer an attack and get an unexpectedly large bill,
please contact us at [help@tigrisdata.com](mailto:help@tigrisdata.com). We are
more than happy to discuss a refund.

Starting June 1st, 2024, you will see detailed usage and costs in your Fly.io
organization billing dashboard. The actual charge will be made on your July 1st
Fly.io invoice.

### Beta program in numbers

We thought you might also be interested in some stats to see how well we have
done in the last three months:

- ~1 PB of storage
- ~1 B objects
- ~250 M requests per day
- ~1 K buckets

### New features and enhancements

Supporting Tigris adoption and usage with feature work has been heartwarming.
Some of the new features added since our launch include:

- [Support for seamless migration of data from S3, GCS, and compatible object storage services](https://www.tigrisdata.com/docs/migration/)
  so you don't have to move all of your data at once. Only the data being used
  will be moved over, and any new objects will be copied over for you.
- [Enhancements to pre-signed URLs](https://www.tigrisdata.com/docs/objects/presigned/)
  so that you can share temporary links to your objects, such as having your app
  generate a temporary URL for an image.
- [Support for public buckets](https://www.tigrisdata.com/docs/buckets/public-bucket/)
  so that Tigris can directly serve your websites.
- [Support for custom domains](https://www.tigrisdata.com/docs/buckets/custom-domain/)
  so that you can use a Tigris bucket as a CDN under your domain.
- [Enhancements to caching](https://www.tigrisdata.com/docs/objects/caching/)
  including default cache control headers, caching on PUT, and prefetching
  objects on LIST.
- [Support for conditional operations](https://www.tigrisdata.com/docs/objects/conditionals/)
  so that you can use Tigris as an atomic key-value store in your applications.
  This also lets you ensure you don't overwrite objects in your buckets.
- [Support for signed cookies](https://www.tigrisdata.com/docs/objects/access-objects-via-cookies/)
  like CloudFront so that you can require an additional layer of security that
  you can't get with a pre-signed URL alone. URLs can be copied, but you can't
  copy a cookie with a URL.
- [Support restricting objects to specific regions](https://www.tigrisdata.com/docs/objects/object_regions/)
  so that you can ensure that data uploaded in the EU stays in the EU.
- [Support for filtering and sorting objects by metadata](https://www.tigrisdata.com/docs/objects/query-metadata/)
  so that you can do SQL-style selection of your objects.

And there's more to come!

We hope you have fun building with Tigris and would love to see what you build.
Reach out to us on [X (formerly Twitter)](https://x.com/TigrisData) or the
[Fly.io community forum](https://community.fly.io/tag/storage), and give us your
feedback. We can't wait to see what you all dream up.
