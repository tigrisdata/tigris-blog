---
slug: availability-and-performance-public
title: We're making our reliability & performance metrics public
description: >
  We're Tigris, a globally distributed object storage platform built for
  high-performance workloads. We're making our reliability and performance
  metrics public! Check out our live dashboard and see how we're providing
  99.99% global availability. We're pretty sure we're the first to share this
  type of live production data publicly.
image: ./strong-oak-tree.jpeg
keywords:
  [
    object storage,
    blob storage,
    s3,
    ai,
    reliability,
    availability,
    performance,
    cost,
  ]
authors: [ks]
tags: [object storage, reliability, performance]
---

# We're making our reliability & performance metrics public

_We're Tigris, a globally distributed object storage platform built for
high-performance workloads. It's designed to work seamlessly across clouds,
countries, and continents, making it simple and efficient for developers.
[Try it out, you'll be up and running in a minute.](https://storage.new/)_

We're trying something a little different— we're making our reliability and
performance metrics public!

We are _serious_ about providing 99.99% global availability. Check out our
[live dashboard](https://public-metrics.storage.tigris.dev/pgrafana/d/bdy2ujij13fuod/availability?orgId=1)
(embedded below). We're pretty sure we're the first to share this type of live
production data publicly.

<!-- truncate -->

<iframe 
  src="https://public-metrics.storage.tigris.dev/pgrafana/d-solo/bdy2ujij13fuod/availability?orgId=1&from=now-24h&to=now&panelId=3" 
  width="450" 
  height="200" 
  frameborder="0"></iframe>

A cool thing happened when we looked at this data. We observed that a temporary
failure in our metadata service within a region was affecting write availability
for users in that region, which wasn't acceptable for a service built on global
high availability. To address this, we utilized our multi-region architecture.
In the event of a metadata service failure in one region, requests are now
seamlessly rerouted to the nearest available region's metadata service, ensuring
uninterrupted processing for all user requests.

Another unique part of this data is that we aren't playing around with our
definition of _"available"_ by pulling tricks like _"if 50% of the requests
succeed then the service is available”_ nor basing the metric on a simple binary
up/down. Instead, our availability metric is based on real requests to our
production system: it's calculated as the number of successful requests
(anything that's not a 5xx) divided by the total number of requests.

## How fast is Tigris?

Every application needs fast performance: latency for small objects and time to
first byte (TTFB) for larger objects are the key metrics to demonstrate how fast
reads are for various object sizes.

For small objects, latency is the primary focus, as it directly impacts the
speed at which data is delivered to end-users.

Small object performance is crucial for applications that frequently access or
manipulate numerous small files, such as AI training workloads on images and
documents. This is where Tigris shines, offering low latency for small object
workloads.

| Object Size | P50  | P95  |
| ----------- | ---- | ---- |
| 1KiB        | 2ms  | 8ms  |
| 16KiB       | 11ms | 22ms |

When it comes to larger objects, TTFB becomes a critical indicator of
performance. It measures the time taken to start receiving data, which is
crucial for large file transfers where initial responsiveness can greatly impact
user experience. Quickly loading large objects is especially important for
loading large, 60GB+ models, particularly if these models run in multiple
regions. Unlike other object storage services that are region-local and show
performance degradation for cross country/continent data transfer, Tigris offers
consistent performance across the globe. This means users experience the same
TTFB and throughput no matter where they are located.

| Object Size | P50   | P95   |
| ----------- | ----- | ----- |
| 1MiB        | 12ms  | 60ms  |
| 64MiB       | 20ms  | 115ms |
| 4GiB        | 100ms | 155ms |

## Maximizing Throughput

Tigris operates across 11 regions and offers high throughput across countries,
and continents, without any additional ingress and egress costs. Throughput can
vary significantly depending on factors like object size, chunking or multi-part
uploads, and concurrency levels. By tuning read and write concurrency, it's
possible to fully utilize a 10Gbps link. For large file uploads and downloads,
we've found that using a chunk size of 4MB with a concurrency level of 16
generally provides the best per-object throughput.

## Why these metrics matter

It's easy to be reliable when no one uses your service. There's a
chicken-and-egg problem with startups offering highly performant services. High
scale use cases demand performance, and demonstrating performance requires high
scale usage. Making our live production data public is us going all-in to prove
our performance at scale.
