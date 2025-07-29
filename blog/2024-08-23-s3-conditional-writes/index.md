---
slug: s3-conditional-writes
title: What’s the Big Deal with Conditional Writes Support in S3?
description: >
  There has been a lot of enthusiasm about the recent announcement by AWS about
  support for Conditional Writes in S3. We will dive into why this is a big deal
  and what it means for developers. We will also explore CAS operations and how
  they relate to S3 Conditional Writes feature. Finally, we will discuss whether
  developers can now avoid client-side consensus mechanisms completely when
  using S3.
image: >-
  ./twin-formula-1-race-car-drivers-navigating-a-sharp-turn-on-a-track-that-weaves-through-the-bustling--58786778.jpeg
keywords:
  - object storage
  - conditional writes
  - cas
  - distributed systems
authors:
  - ot
tags:
  - engineering
  - object storage
  - conditional writes
  - distributed systems
---

# What’s the Big Deal with Conditional Writes Support in S3?

Twitter has been lit (well, not exactly lit, but let’s say there is a lot of
enthusiasm) with posts about the recent announcement by AWS about support for
[Conditional Writes in S3](https://aws.amazon.com/about-aws/whats-new/2024/08/amazon-s3-conditional-writes/).
So I thought I would write something about it as well.

## It’s all about concurrency and races.

<span align="center">
  ![Tigris globally distributed object
  storage](twin-formula-1-race-car-drivers-navigating-a-sharp-turn-on-a-track-that-weaves-through-the-bustling--58786778.jpeg)
</span>

<!-- truncate -->

In distributed environments, it’s common for multiple clients to attempt to
update or write to the same object or dataset simultaneously. This creates a
challenge: ensuring that these concurrent operations do not interfere with each
other or lead to data inconsistencies. For instance, in collaborative
environments where users are simultaneously editing shared documents or
uploading files to a common storage, there is risk of one user’s actions
overwriting another’s. Without a robust mechanism to manage these concurrent
writes, you can end up with inconsistent data or lost updates, leading to
potential failures in the application. Managing this concurrency requires
careful coordination to ensure that all operations are correctly sequenced and
that no data is lost or incorrectly overwritten.

## Generally, concurrent writes are handled by employing mechanisms like Compare and Swap (CAS) to ensure data consistency.

CAS is an atomic operation that allows a system to update a value only if it
matches an expected current value, effectively preventing race conditions where
multiple transactions or threads might try to modify the same data
simultaneously. For example, in a scenario where multiple users attempt to
update a row in a database table, CAS ensures that each update is applied only
if the row hasn’t been altered by another operation in the meantime. This
approach enables systems to manage high levels of concurrency without resorting
to locking mechanisms, which can be less efficient.

## But without support for CAS in S3, developers have to do the heavy lifting.

Traditionally, developers using S3 have had to employ strategies with varying
levels of complexity to manage challenges that come with concurrent writes. Some
of the most common strategies include:

### Client-Side Locking or Coordination Mechanisms

Devs sometimes implement client-side locking mechanisms or coordination
protocols to ensure that only one client could write to a particular object at a
time. This involves using a centralized lock manager or employing distributed
systems like Zookeeper, etcd, or DynamoDB.

### Versioning

Another popular choice is utilizing S3’s object versioning feature, which allows
multiple versions of the same object to exist. This approach helps prevent data
loss but requires additional logic to resolve conflicts, such as merging changes
or selecting the correct version manually.

### Creating Middleware or API Wrappers

Yet another popular choice is creating custom middleware or API wrappers that
encapsulate the S3 operations with logic for handling concurrency using one of
the above-mentioned strategies. This additional layer manages concurrency
guards, pre-checks, retries, and error handling in a standardized way across
many services. While this helps centralize the conflict resolution logic, it
still requires custom development and adds complexity.

_These methods, while functional, result in increased code complexity, higher
latencies, and bugs due to potential race conditions, making the management of
concurrent operations with S3 a non-trivial task._

## Hence, the reason for enthusiasm with the recently announced support for conditional writes in S3.

Now that it is clear that handling concurrent writes at the application level is
non-trivial, there is good reason to be pleased with the recently announced
support for
[conditional writes in S3](https://aws.amazon.com/about-aws/whats-new/2024/08/amazon-s3-conditional-writes/).

This new feature allows you to conditionally write or upload objects, using
PutObject or CompleteMultipartUpload API requests, based on whether the object
already exists or not. This pushes the complexity of handling concurrency to S3
in scenarios where multiple clients are writing to the same storage bucket, and
you want to avoid overwriting existing data.

_Devs can throw out a lot of the concurrency related complexity now!_

## Do I really not need any client-side consensus mechanisms now?

The Conditional Writes feature in S3 is primarily designed to prevent the
overwriting of objects, ensuring that an object is only written if it doesn’t
already exist.

While S3 Conditional Writes feature and CAS operations share a similar purpose,
but they are not fully equivalent, and S3 Conditional Writes do not cover all
the cases supported by CAS. CAS provides a broader scope, enabling you to
compare and update based on the actual value of the data, not just its presence.
This can include complex conditions, such as:

- matching object content using etags,
- performing object “modified date” based comparisons,
- comparing object tag values, and
- a combination of the above.

So, depending on the requirements, concurrency handling on the application side
using one of the above-mentioned approaches may still be needed when using S3.

There are also other object storage services that provide more comprehensive CAS
support such as [ABS](https://azure.microsoft.com/en-us/products/storage/blobs),
[GCS](https://cloud.google.com/storage), [MinIO](https://min.io/),
[R2](https://developers.cloudflare.com/r2/), and
[Tigris](https://www.tigrisdata.com/docs/objects/conditionals/).
