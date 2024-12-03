---
slug: case-study-beam
title: How Beam runs GPUs anywhere
description: >
  Learn how Beam offers serverless GPUs optimized for developer productivity,
  across many clouds. By moving object storage to a separate managed service,
  Beam no longer needed to worry about it as another variable when designing for
  consistency across clouds.
image: ./beam.png
keywords:
  [
    object storage,
    blob storage,
    s3,
    ai,
    generative ai,
    serverless,
    GPUs,
    inference,
    performance,
    cost,
  ]
authors: [ks]
tags: [object storage, s3, ai, case study]
---

import InlineCta from "@site/src/components/InlineCta"; import PullQuote from
"@site/src/components/PullQuote";

# How Beam runs GPUs anywhere

Where do you go when you need to serve arbitrary AI models in only 10 seconds notice? Especially without writing a Dockerfile yourself. It sounds impossible, but [Beam](https://beam.cloud)'s
serverless GPU platform provides performant, scalable AI infrastructure with
minimal configuration. Your code already does the AI inference in a function. Just add a decorator to get that function running somewhere in the cloud with whatever GPU you specify. It turns on when you need it, it turns off when you don't. This can save you orders of magnitude over running a persistent GPU in the cloud.

![Tigris tiger watching a beam from a ground satellite. Image generated with Flux [dev] from Black Forest Labs on fal.ai](./beam.png)

<center>
  <small>
    <em>
      Tigris tiger watching a beam from a ground satellite. Image generated with Flux [dev] from Black Forest
      Labs on fal.ai.
    </em>
  </small>
</center>
<!-- truncate -->

## Fast iteration loops for hyper productive developers

Beam was founded to reduce cost and iteration time when developing AI / ML
applications. Using \$bigCloud and Docker directly is too slow for iterative
development, and waiting for a new image to build and redeploy to a dev
environment just takes too long. Let alone requiring the time to set all that up
and manage it. Beam hot reloads your code to a live inference server for
testing. And they integrate with workflow tools like ComfyUI so development is
even easier.

With AI development, the infrastructure gets complicated quickly. GPUs run one
process at a time, so most use cases will almost immediately require a warm pool
of many GPUs. AI / LLM development happens at the bleeding edge, so those GPUs
require bleeding edge features. Which can mean a lot of break-fix at the
infrastructure layer. Serverless GPUs offload that management and enable you to
handle bursty and unpredictable load without additional configuration or latency
ridden scale-up.

Ultimately, the big trade-off with serverless GPUs is between cost and latency:
if you want to use the cheapest GPU available, it’s almost never where you want
it to be, i.e. near your data. And the time to send a beefy 50GB model where it
needs to be, for each serverless function call, adds to cold start times,
expensive GPU minutes, and egress costs across clouds.

## Challenge

The challenge? Beam’s serverless GPU platform ran largely on one cloud, and they
needed a cost-efficient way to more flexibly spread their compute across many
clouds. All while offering consistent developer experience: \<10s cold starts,
as fast as 50ms warm starts, and limitless horizontal scale. Luke Lombardi, CTO
& Co-Founder of Beam, shares, “We’re a distributed GPU cloud: one of the core
things we need is cross region consistency. We don’t need to think about when we
move to another region. It’s critical that everything is just there and the
latency is predictable.”

Another notable challenge was strategic: Beam wanted to reduce lock-in to the
major cloud providers so they could run their compute anywhere. And they wanted
to open source much of their codebase so their platform interface could be used
by anyone, anywhere, on any bare metal server. Flexibility was key. They needed
decouple compute from storage and build a highly flexible storage layer with
cross region replication and global distribution.

## Solution

Luke knew the architectural importance of separating the storage layer, and he
knew egress costs were a non-starter. Of all the zero egress fee storage
solutions, Tigris prioritized performance and reliability.

:::info[Quote]

Before finding Tigris, we were planning on implementing our own data
distribution and replication for our training and inference workloads. Now we
just point our code to a single endpoint and Tigris handles it all. We've saved
months of work, not to mention the maintenance cost & peace of mind. —Luke
Lombardi, Co-founder & CTO, Beam

:::

## Choosing Flexibility

Tigris provided a reliable and performant storage layer to complement Beam’s
compute layer, enabling them to spread their workloads across many public clouds
to take advantage of cost and GPU availability. Luke shared, “We're mostly
benefiting from moving our object storage outside of the major cloud providers
and having it as a separate managed service. The egress costs are important, but
even just the fact that we're not locked into S3 is a good thing for us too.“

As a result of re-platforming and separating their storage and compute, Beam was
able to open source their platform,
[beta9](https://github.com/beam-cloud/beta9). Now users can install the beta9
server on bare metal and have the same interface across Beam and any other
compute they choose. This flexibility is a key difference between Beam and other
serverless GPU providers: traditionally serverless has been a high lock-in
architecture, but with beta9, your workloads are portable.

## Designing the Storage Layer to be Object Storage Native

After using another filesystem solution that wasn’t backed by object storage,
Luke said, “When we were switching to another filesystem, we knew it had to be
backed by object storage.” For AI workloads especially, data expands rapidly,
sometimes beyond the available ram or even the available volume. Beam handles
very large models and training data sets with ease, using Tigris to dynamically
move the data based on access patterns. Since the objects are already in the
region where you need them, it’s quick to load models and hydrate training data
sets to fast-access volumes as needed.

## Do One Thing, and Do It Right

When designing their storage layer, Luke didn’t want to worry about
troubleshooting intermittent 500s or hunting down unexpected bottlenecks.
Storage should just work :tm: and be consistent across clouds. He said, “I felt
much more comfortable knowing that we’re using a product where the team just
does object storage all day.”

<InlineCta
  title={"Want to try it out?"}
  subtitle={"Make a global bucket with no egress fees"}
  button={"Get Started"}
/>
