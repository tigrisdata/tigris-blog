---
slug: benchmark-small-objects
title:
  "Small Objects, Big Gains: Benchmarking Tigris Against AWS S3 and Cloudflare
  R2"
description: >
  We have spent a lot of time optimizing Tigris for small objects. This post
  shares the results of our benchmarks of comparing the performance of Tigris,
  AWS S3, and Cloudflare R2 when storing and retrieving small objects.
image: https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/total-time-load-comparison.png
keywords: [object storage, blob storage, s3, benchmarks]
authors: [ot]
tags: [benchmarks]
---

One of Tigris's standout capabilities is its performance when storing and
retrieving small objects. To quantify this advantage, we benchmarked Tigris
against two popular object stores—AWS S3 and Cloudflare R2—and found that Tigris
consistently delivers higher throughput and lower latency. These gains let you
use a single store for everything from tiny payloads to multi-gigabyte blobs
without sacrificing efficiency.

Under the hood, Tigris accelerates small-object workloads by (i) inlining very
small objects inside metadata records, (ii) coalescing adjacent keys to reduce
storage overhead, and (iii) caching hot items in an on-disk, LSM-backed cache.

## Summary

Our benchmarks reveal that Tigris significantly outperforms both AWS S3 and
Cloudflare R2 for small object workloads. Our benchmarks show Tigris achieves
**sub-10ms** read latency and **sub-20ms** write latency, while sustaining **4 x
throughput** than S3 and **20 x throughput** than R2 for both operations.

To ensure our findings are reproducible, we outline the full benchmarking
methodology and provide links to all artifacts.

## Benchmark Setup

We used the Yahoo Cloud Serving Benchmark (YCSB) to evaluate the three systems.
A fork of the Go implementation, available at
[github.com/tigrisdata/go-ycsb](https://github.com/tigrisdata/go-ycsb), adds
native clients for S3-compatible APIs. A pull request to upstream
[pingcap/go-ycsb, PR #307](https://github.com/pingcap/go-ycsb/pull/307) is
pending review.

All experiments ran on a neutral cloud provider to avoid vendor-specific
optimizations. Table 1 summarizes the test instance:

_Table 1: Benchmark host configuration._

| Component         | Quantity                           |
| ----------------- | ---------------------------------- |
| Instance type     | VM.Standard.A1.Flex (Oracle Cloud) |
| Region            | us-sanjose-1 (West Coast)          |
| vCPU cores        | 32                                 |
| Memory            | 32 GiB                             |
| Network bandwidth | 32 Gbps                            |

### YCSB Configuration

We benchmarked a dataset of 10 million objects, each 1 KB in size. YCSB issued
requests from 32 client threads using the workload file hosted at:
https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/workloads3

The Tigris bucket is globally replicated and thus needs no region flag. The AWS
S3 bucket resided in _us-west-1_, and Cloudflare R2 automatically selected the
_Western North America (WNAM)_ location.

## Results

Using YCSB we evaluated two distinct phases: (i) a bulk load of 10 million 1 KB
objects and (ii) a mixed workload of one million operations composed of 80%
reads and 20% writes.

### Loading 10 million objects

Figure&nbsp;1 (below) plots the end-to-end ingestion time. Tigris finishes the
load in **6711 s**, which is roughly **31 % faster than S3 (8826 s)** and **an
order of magnitude faster than R2 (72063 s)**.

Latency drives this gap. As shown in Figure&nbsp;2, R2's p90 PUT latency tops
**340 ms** whereas Tigris stays below **36 ms** and S3 below **38 ms**.
Table&nbsp;2 summarises the key statistics.

_Table 2: Load-phase latency and throughput metrics._

| Service | P50 Latency (ms) | P90 Latency (ms) | Runtime (sec) | Throughput (ops/sec) |
| ------- | ---------------- | ---------------- | ------------- | -------------------- |
| Tigris  | 16.799           | 35.871           | 6710.7        | 1490.2               |
| S3      | 25.743           | 37.791           | 8826.4        | 1133.0               |
| R2      | 197.119          | 340.223          | 72063         | 138.8                |

![Figure 1 – Total load time – Tigris vs S3 vs R2](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/total-time-load-comparison.png "Total load time – Tigris vs S3 vs R2")

_Figure 1: Total load time for loading 10 M 1 KB objects._

R2 takes more than 300ms to write a single object which explains the slowness of
the data load.

While comparing Tigris latency to S3, it is still better but not the same margin
as compared to R2.

![Figure 2 – PUT p90 latency – Tigris vs S3](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/load-sjc-s3-tigris-insert-latency_p90_ms.png "PUT p90 latency – Tigris vs S3")

_Figure 2: PUT p90 latency during load phase._

### 1 million operations (20% write, 80% read)

This is the _run_ phase of the YCSB benchmark. As a reminder, it is a 20% write
and 80% read workload totaling 1 million operations.

#### Read throughput

![Figure 3 – Read throughput – Tigris vs R2](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/run-sjc-r2-tigris-read-throughput_ops.png "Read throughput – Tigris vs R2")

_Figure 3: Read throughput during mixed workload (Tigris vs R2)._

![Figure 4 – Read throughput – Tigris vs S3](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/run-sjc-s3-tigris-read-throughput_ops.png "Read throughput – Tigris vs S3")

_Figure 4: Read throughput during mixed workload (Tigris vs S3)._

Throughput traces for all three providers remain stable—useful for capacity
planning—but the absolute rates diverge sharply. Tigris sustains **≈3.3 k
ops/s**, nearly **4 × S3 (≈ 892 ops/s)** and **20 × R2 (≈ 170 ops/s)**. This
headroom lets applications serve real-time workloads directly from Tigris.

#### Read latency

![Figure 5 – Read p90 latency – Tigris vs R2](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/run-sjc-r2-tigris-read-latency_p90_ms.png "Read p90 latency – Tigris vs R2")

_Figure 5: Read p90 latency during mixed workload (Tigris vs R2)._

![Figure 6 – Read p90 latency – Tigris vs S3](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/run-sjc-s3-tigris-read-latency_p90_ms.png "Read p90 latency – Tigris vs S3")

_Figure 6: Read p90 latency during mixed workload (Tigris vs S3)._

Latency follows the same pattern. Tigris keeps p90 below **8 ms**; S3 settles
around **42 ms**, and R2 stretches beyond **199 ms**. At sub-10 ms, reads feel
closer to a key-value store than a traditional object store.

#### Write throughput

![Figure 7 – Write throughput – Tigris vs R2](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/run-sjc-r2-tigris-update-throughput_ops.png "Write throughput – Tigris vs R2")

_Figure 7: Write throughput during mixed workload (Tigris vs R2)._

![Figure 8 – Write throughput – Tigris vs S3](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/run-sjc-s3-tigris-update-throughput_ops.png "Write throughput – Tigris vs S3")

_Figure 8: Write throughput during mixed workload (Tigris vs S3)._

Write throughput shows the same spread. Tigris delivers **≈ 828 ops/s**, close
to **4 × S3 (224 ops/s)** and **20 × R2 (43 ops/s)**, giving plenty of margin
for bursty ingest pipelines.

#### Write latency

![Figure 9 – Write p90 latency – Tigris vs R2](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/run-sjc-r2-tigris-update-latency_p90_ms.png "Write p90 latency – Tigris vs R2")

_Figure 9: Write p90 latency during mixed workload (Tigris vs R2)._

![Figure 10 – Write p90 latency – Tigris vs S3](https://raw.githubusercontent.com/tigrisdata-community/ycsb-benchmarks/refs/heads/main/results/10m-1kb/processed/plots/run-sjc-s3-tigris-update-latency_p90_ms.png "Write p90 latency – Tigris vs S3")

_Figure 10: Write p90 latency during mixed workload (Tigris vs S3)._

Write-side tail latency tracks proportionally: **< 17 ms** for Tigris, **≈ 41
ms** for S3, and **> 680 ms** for R2—an order-of-magnitude gap that can make or
break user-facing workloads.

To summarize:

_Table 3: Mixed-workload latency and throughput metrics._

| Service       | P50 Latency (ms) | P90 Latency (ms) | Runtime (sec) | Throughput (ops/sec) |
| ------------- | ---------------- | ---------------- | ------------- | -------------------- |
| Tigris Read   | 5.399            | 7.867            | 241.7         | 3309.8               |
| Tigris Update | 12.855           | 16.543           | 241.6         | 828.1                |
| S3 Read       | 22.415           | 42.047           | 896.8         | 891.5                |
| S3 Update     | 26.975           | 41.215           | 896.8         | 223.6                |
| R2 Read       | 118.591          | 198.911          | 4705.5        | 170.0                |
| R2 Update     | 605.695          | 680.959          | 4705.3        | 42.6                 |

## Conclusion

Tigris outperforms S3 and comprehensively outperforms R2 for small object
workloads. The performance advantage stems from Tigris's optimized architecture
for small objects. While S3 and R2 struggle with high latency on small payloads
(R2's p90 PUT latency reaches 340ms), Tigris maintains consistent low latency
through intelligent object inlining, key coalescing, and LSM-backed caching.

These results demonstrate that Tigris can serve as a unified storage solution
for mixed workloads, eliminating the need to maintain separate systems for small
and large objects. Whether you're storing billions of tiny metadata files or
streaming gigabytes of video data, Tigris delivers optimal performance across
the entire object size spectrum.

You can find the full benchmark results in the
[ycsb-benchmarks](https://github.com/tigrisdata-community/ycsb-benchmarks)
repository.
