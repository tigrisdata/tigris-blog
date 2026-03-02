---
title: "Multi-region buckets – simpler locations, clearer consistency"
draft: false
short_description:
  "Tigris introduces multi-region, dual-region, single-region, and global bucket
  locations with built-in consistency semantics."
description:
  "Tigris now offers a unified bucket location model—multi-region, dual-region,
  single-region, and global—so you choose where your data lives and get clear,
  predictable consistency by location type."
preview_image: /blog/multi-region-buckets/social_preview.png
social_preview_image: /blog/multi-region-buckets/social_preview.png
date: 2026-02-18T00:00:00-08:00
author: Tigris Team
featured: true
tags:
  - object storage
  - multi-region
  - consistency
  - s3
  - distributed systems
  - release notes
---

[**Multi-region buckets are now available in Tigris.**](/docs/buckets/locations/)
You can now choose exactly how your data is replicated across regions using four
bucket location types—multi-region, dual-region, single-region, and global—each
with built‑in availability and consistency guarantees. Instead of tuning
low-level flags, you decide where your data should live and how resilient it
needs to be, and Tigris does the rest.

This change is driven by a simple observation from real workloads: when teams
design an object storage strategy, they start with geography and failure
domains, not consistency headers. They ask “What happens if an entire region is
down?” or “How do I keep data close to users in two specific regions?” The new
location types are designed around those questions and give you a
straightforward way to match your buckets to the kind of application you’re
running.

```text
Architecture at a glance

Single-region bucket
--------------------
  [ bucket ]
      |
   [ region A ]

Dual-region bucket
------------------
        [ bucket ]
        /       \
 [ region A ]  [ region B ]

Multi-region bucket (region group)
----------------------------------
          [ bucket ]
        /     |     \
 [ region A ][ region B ][ region C ]
   (same geo / group, e.g. "us")

Global bucket
-------------
      [ bucket ]
          |
   [ globally distributed copies ]
    (reads served close to users)
```

## Always-on applications in a region group

Multi-region buckets are for applications that must keep serving traffic even
when a region has a bad day. When you create a multi-region bucket, Tigris keeps
multiple regional copies of your data inside a chosen geography, such as `us` or
`europe`. Reads and writes see strong, predictable behavior across that
geography, so you can run stateless services in multiple regions, point them all
at the same bucket, and know that users will see the same objects regardless of
which regional deployment they hit.

This is a good fit for front-end assets, critical configuration, and user data
that needs both low latency and resilience to regional failures. Instead of
hand‑wiring replication jobs between single-region buckets, you create one
multi-region bucket and let the platform handle the replication and consistency.

## Regional control and residency with dual-region

Some workloads need finer control. Maybe compliance requires you to keep data in
two specific regions, or your latency model is built around two data centers on
opposite coasts. Dual-region buckets are designed for that. You choose the pair
of regions, and Tigris stores copies of your objects in both.

Within a given region, reads and writes behave strongly consistently, which
makes it easy to reason about local operations. When you read from the other
region, the system trades a bit of global immediacy for the ability to keep data
in the exact pair of locations you’ve chosen. The result is a storage layer that
matches the topology of your compute layer without additional replication
services or glue code.

## Cost-optimized, regional workloads with single-region

Not everything needs to span multiple regions. Single-region buckets keep data
in one region of your choice and are the most cost‑effective option. They’re
ideal for staging environments, regional APIs, batch jobs, and any workload
where you deploy compute and storage side by side.

With single-region buckets, you still get clear consistency semantics—you don’t
have to worry about reads lagging writes inside that region—but you don’t pay
for replication you don’t need. If you later decide that a bucket should be more
resilient, the location model gives you a way to move to dual-region or
multi-region without rewriting how your application talks to storage.

## Simple global distribution

Global buckets are for read‑heavy workloads with users all over the world.
Instead of thinking about individual regions, you think about your dataset as a
whole: one logical bucket, accessed from many places. Tigris handles global
distribution so that users can fetch content with good latency from wherever
they are, while still giving you clear expectations around how quickly updates
propagate.

This is especially useful for assets like models, media, and documentation that
are written relatively infrequently but read from many geographies. You get a
simple configuration and a single bucket name, without having to constantly
reason about which region is closest to which user.

## How it looks in code

Although the conceptual model has changed, the way you work with buckets from
code stays familiar. You still create a bucket, point your S3‑compatible client
or SDK at Tigris, and start reading and writing objects. The only difference is
that you now specify a location type instead of a low‑level consistency flag.

> **TODO:** Insert final CLI example for creating a multi-region bucket once the
> command syntax is finalized.
>
> **TODO:** Insert final Terraform `tigris_bucket` example once the resource
> type and fields are finalized.

## Console experience

> **TODO:** Replace this section with actual console copy and screenshots once
> the new UI is live.
>
> - Screenshot 1: Location type step (Single‑region, Dual‑region, Multi‑region,
>   Global)
> - Screenshot 2: Region / region‑group selector
> - Screenshot 3: Summary screen showing replication locations and consistency
>   guarantees

## What’s next

If you are already using Tigris, you don’t need to change anything
immediately—your existing buckets continue to function as before. For new
workloads, the recommended path is to read the
[Bucket locations guide](/docs/buckets/locations/), pick the location type that
fits your needs, and create buckets using that model going forward. The goal of
this release is not just to add another feature, but to make the way Tigris
handles geography and consistency feel intuitive and industry‑standard.

We’d love to hear how the new model works for your workloads. If you have a
pattern that doesn’t fit neatly into the four location types, or if you’re
migrating from a more bespoke setup, your feedback will help shape the next
round of improvements.
