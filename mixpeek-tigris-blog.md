---
slug: mixpeek-tigris-object-notifications
title: Event-Driven Multimodal Ingestion with Tigris and Mixpeek
description: >
  Learn how Mixpeek uses Tigris Object Notifications to build a fully
  event-driven ingestion pipeline for multimodal data, replacing fragile
  polling loops with push-based webhooks and production-grade reliability.
image: ./image1.webp
keywords:
  - Tigris
  - Mixpeek
  - object notifications
  - multimodal indexing
  - S3
  - webhooks
  - event-driven
  - RAG
authors:
  - davidmyriel
tags:
  - Build with Tigris
  - AI Infrastructure
  - Object Notifications
  - Multimodal
---

import heroimage from "./image1.webp";
import InlineCta from "@site/src/components/InlineCta";

import styles from "!!raw-loader!./styles.css";

<style>{styles}</style>

<img
  src={heroimage}
  className="hero-image"
  alt="Event-Driven Multimodal Ingestion with Tigris and Mixpeek"
/>

Most AI search tools handle text well. The moment you throw a video, an audio recording, or a scanned PDF at them, they fall apart.

[Mixpeek](https://mixpeek.com/) is built specifically for that gap. It's a multimodal intelligence layer that sits on top of your object storage, turning raw unstructured media into searchable, classifiable, and retrievable features — without you having to build the pipeline yourself.

![Tigris and Mixpeek overview](./image-overview.webp)

### Your files, broken into searchable layers

When a file lands in a Mixpeek-connected bucket, it gets broken into independent layers: transcripts, visual embeddings, scene descriptions, and detected entities. Each layer is queryable on its own.

For video, that means frame-accurate retrieval. Search for "person writing on whiteboard" and you get back the exact timestamp, not just the file name. The same pipeline handles images, audio files, and PDFs through a single unified API.

![Mixpeek extraction pipeline](./image-extraction.webp)

### What you can actually build with this

Search is one access pattern, but Mixpeek is designed for several more. Once your media is indexed, you can run classification to automatically tag and filter objects, clustering to group similar assets and surface duplicates, and anomaly detection to flag items that don't fit expected patterns.

A media company might use this to pull all footage from a specific location across thousands of hours of video. A compliance team can flag documents the moment they're uploaded if they contain certain entities or phrases. An ML team can cluster training images to find gaps in their dataset before burning compute on a bad training run.

| Access Pattern | What it means |
|---|---|
| **Retrieval** | Semantic search across video frames, audio segments, PDF pages |
| **Classification** | Auto-tag objects by content, entity, or visual category |
| **Clustering** | Group similar assets, surface duplicates, find dataset gaps |
| **Anomaly detection** | Flag out-of-distribution objects as they arrive |

All of these run against the same indexed representation Mixpeek builds from your bucket. You don't maintain separate pipelines per access pattern.

### The problem Mixpeek solves at the ingestion layer

Building this kind of pipeline yourself means solving a lot of boring, hard problems before you get to the interesting ones. How do you know when a new file arrives? How do you avoid processing the same file twice? What happens when a job fails mid-extraction?

Most teams fall back to periodic polling: scan the bucket on a schedule, diff against what you've already processed, queue the new ones. It works until it doesn't. Polling introduces lag, wastes API calls on unchanged objects, and gets expensive as your bucket grows.

### Why Mixpeek chose Tigris as the storage layer

[Tigris](https://www.tigrisdata.com/) is a globally distributed, S3-compatible object storage service. Because it speaks the S3 API natively, connecting Mixpeek is straightforward — standard IAM-style credentials, same SDKs you're already using, just a different endpoint.

```python
import boto3

# Point your existing S3 client at Tigris — nothing else changes
s3 = boto3.client(
    "s3",
    endpoint_url="https://fly.storage.tigris.dev",
    aws_access_key_id="your_tigris_access_key",
    aws_secret_access_key="your_tigris_secret_key",
    region_name="auto",
)

s3.upload_file("interview.mp4", "my-media-bucket", "videos/interview.mp4")
```

But S3 compatibility is just the baseline. The reason Mixpeek runs on Tigris specifically comes down to two things: where your data lives, and what it costs to read it repeatedly.

### Tigris performance vs S3

Tigris distributes your objects across 11 regions automatically, based on where they're accessed. There's no replication config to manage. When Mixpeek's extraction jobs run, they read from the region closest to the processing node — which keeps latency low regardless of where your users are uploading from.

The numbers back this up. In [published benchmarks](https://www.tigrisdata.com/blog/benchmark-small-objects/), Tigris keeps p90 read latency under 8ms. S3 sits at around 42ms. Cloudflare R2 stretches beyond 199ms at p90.

| Storage | p90 Read Latency | Throughput (ops/s) |
|---|---|---|
| **Tigris** | ~8ms | ~3,300 |
| AWS S3 | ~42ms | ~892 |
| Cloudflare R2 | ~199ms | ~170 |

Mixpeek doesn't read each file once during extraction. It makes repeated requests: reading video in segments, pulling document pages, fetching image data at different resolutions. With S3, each of those reads adds up in both latency and cost. Tigris has no egress fees, so repeated reads don't accumulate transfer costs the way they do on AWS.

### Object Notifications replace the polling loop

The other reason Mixpeek chose Tigris is [Object Notifications](https://www.tigrisdata.com/docs/buckets/object-notifications/). Instead of scanning the bucket on a schedule, Tigris pushes an event to a configured webhook the moment an object is created, updated, or deleted.

You set this up once in the Tigris Dashboard. From that point, every new upload triggers Mixpeek's ingestion endpoint directly — no polling, no scheduled scans, no lag.

```json
// Tigris fires this payload the moment an object is created
{
  "eventType": "OBJECT_CREATED_PUT",
  "bucket": "my-media-bucket",
  "key": "videos/interview-2025.mp4",
  "size": 104857600,
  "lastModified": "2025-03-02T10:45:00Z",
  "etag": "abc123def456"
}
```

You can also filter which events reach the webhook using Tigris's SQL-like metadata querying, so the pipeline only processes the object types it actually needs.

### Built to survive bursty uploads

Event-driven pipelines need failure handling baked in. Mixpeek covers the operational pieces that most teams have to build themselves.

| Reliability Feature | What it does |
|---|---|
| **Dead Letter Queue** | Retries failed objects up to 3 times, then quarantines them instead of blocking the pipeline |
| **Idempotent ingestion** | Deduplicates by bucket + source + object identity, so retries never double-process |
| **Distributed locking** | Prevents concurrent sync runs from colliding during bursty event storms |
| **Rate-limit backoff** | Automatic 429 handling to smooth spikes without dropping events |
| **Metrics** | Duration, batch counts, failure rates, and DLQ depth all exposed for ops visibility |

A burst of uploads shouldn't cause your pipeline to process the same file four times or deadlock on concurrent runs. These safeguards make sure it doesn't.

### Your bucket is the record, not just the storage

Treat your Tigris bucket as the authoritative record of your dataset. Mixpeek writes structured outputs (JSON metadata, derived segments, embeddings) that map back to a stable object identity: bucket + key + ETag. If you need to reproduce a result, the lineage is right there.

```json
// Every Mixpeek result ties back to a specific Tigris object version
{
  "source": {
    "bucket": "my-media-bucket",
    "key": "videos/interview-2025.mp4",
    "etag": "abc123def456"
  },
  "segments": [
    { "timestamp": "00:02:14", "text": "person writing on whiteboard", "score": 0.94 },
    { "timestamp": "00:05:41", "text": "diagram of system architecture", "score": 0.87 }
  ]
}
```

Pair this with [Tigris snapshots](https://www.tigrisdata.com/blog/fork-buckets-like-code/) and you get point-in-time reproducibility without a separate versioning system. Fork from a known-good snapshot and replay processing against that state if something goes wrong.

![Dataset lineage diagram](./image3.webp)

### Set it up in three steps

Connect your Tigris bucket to Mixpeek using the [Mixpeek integrations guide](https://docs.mixpeek.com/docs/integrations/object-storage/tigris). Configure Object Notifications in your [Tigris Dashboard](https://www.tigrisdata.com/docs/buckets/object-notifications/), point the webhook at Mixpeek's ingestion endpoint, and your pipeline is live.

```bash
# 1. Create a bucket in the Tigris Dashboard
# 2. Generate IAM-style credentials for Mixpeek (read + list)
# 3. Add an Object Notification webhook pointing to Mixpeek's endpoint

TIGRIS_ENDPOINT=https://fly.storage.tigris.dev
MIXPEEK_WEBHOOK=https://api.mixpeek.com/ingest/tigris
```

No polling. No stale indexes. Just push-based processing from the moment your media hits storage.

<InlineCta
  title="Unlimited storage; no egress fees"
  subtitle={
    "Need to store terabytes of multimodal data everywhere? Tigris has you covered without any pesky egress fees. Try it today and get the first 5 gigabytes on us."
  }
  button="Get started"
/>
