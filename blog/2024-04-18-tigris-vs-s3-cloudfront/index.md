---
slug: tigris-vs-s3-cloudfront
title: Tigris vs. S3 & Cloudfront
description: >
  Tigris is a globally distributed S3-compatible object storage solution
  available that can easily be hosted on Fly.io. In this article, we'll explore
  how Tigris fits into the existing slate of object storage options and why you
  might choose one over the other.
keywords: [object storage, blob storage, s3, cloudfront, cdn]
authors: [as]
tags: [object storage, blob storage, s3, launch, cloudfront, cdn]
---

Tigris is a globally distributed S3-compatible object storage solution available
that can easily be hosted on Fly.io. In this article, we'll explore how Tigris
fits into the existing slate of object storage options and why you might choose
one over the other.

## You don't need a CDN

Probably the most exciting aspect of Tigris is its globally distributed nature.
But what does that actually mean?

First, consider a common setup: you want to quickly deliver assets to users from
your object storage, so typically you’d need to make use of a content delivery
network (CDN) to cache your data in multiple regions, which helps reduce
latency. When using Amazon S3, Cloudfront is the CDN most often used.

<!-- truncate -->

**With Tigris, you don’t need a CDN at all** because your data is available in
all regions from the start. Global distribution means that the same bucket can
store data in many different locations. You can effectively have a CDN-like
system for delivering data to any region in a matter of minutes. Unlike a CDN,
updates to data can occur in any region, allowing users in that region to see
changes faster.

## Streamlined developer experience

Getting started with Tigris is as simple as **running a single command to create
a bucket:**

```bash
fly storage create
```

When run in the directory of a deployed Fly App, it will create a new private
Tigris bucket and set the following secrets on your app:

```
BUCKET_NAME
AWS_ENDPOINT_URL_S3
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

If you were already using the S3 API in your app, there's no need to change your
code aside from updating the values of your environment variables/secrets.

## Streamlined authorization

Tigris buckets are private by default but can be made public to allow anyone to
read their content. Additionally, Tigris supports Role-Based-Access-Control
(RBAC), with a few predefined roles: Admin, Editor, and ReadOnly. A complete
list of the permitted operations for each of these roles can be found
[here](https://www.tigrisdata.com/docs/concepts/authnz/#role-based-access-control-rbac).
You can use the predefined roles mentioned above, or you can define your own
roles using custom IAM policies.

## Migrating is easy (without being locked in)

Migrating is made easier by the use of
[shadow buckets](https://www.tigrisdata.com/docs/migration/). Tigris shadow
buckets allow you to incrementally migrate the data from an existing S3 or a
compatible bucket without incurring egress costs or downtime. And if you
migrate, you won't be locked in – Tigris doesn't charge for egress. 😀 💸

## Conclusion

Tigris is revolutionizing object storage for global apps. For developers seeking
an efficient, scalable storage solution without the burden of extra costs or
technical overhead, Tigris offers a compelling alternative. Give it a try today
on your next app on Fly.io!
