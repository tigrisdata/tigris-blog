---
slug: a16z-round-press-release
title: Announcing Tigris Seed Round led by Andreessen Horowitz
description: >
  Tigris is a globally distributed object storage service that provides low
  latency anywhere in the world, enabling developers like you to store and
  access any amount of data using the S3 libraries you're already using in
  production. Today, we're announcing our seed round led by Andreessen Horowitz.
image: ./tigris-river.jpeg
keywords:
  - object storage
  - blob storage
  - s3
  - funding
  - a16z
authors:
  - ot
tags:
  - object storage
  - blob storage
  - s3
  - funding
  - updates
---

# Announcing our Seed Round led by Andreessen Horowitz

<span align="center">
  ![Tigris globally distributed object
  storage](tigris-river.jpeg) [src: [playground.com](https://playground.com/feed)]
</span>

Eighteen years ago today, Amazon completely changed how developers work with
data storage by giving us Simple Storage Service (S3).

S3 rewrote the rules of storage and propelled us into a new era of cloud
computing. Traditional storage solutions were cumbersome and costly, and they
shackled developers to the limitations of the hardware. With S3, Amazon
introduced a shift towards Storage as a Service, liberating developers from the
burdensome tasks of purchasing, provisioning, and managing physical storage. No
longer were they bound by the precarious dance of capacity planning, where
overestimating meant wasted resources and underestimating spelled disaster for
uptime.

<!-- truncate -->

Accessibility was at the heart of S3's appeal. In an industry notorious for
labyrinthine sales processes and convoluted purchasing procedures, Amazon
disrupted the status quo by putting the power directly into the hands of
developers. Signing up for S3 was as effortless as a few clicks and typing in
your credit card. Gone were the days of tedious negotiations with enterprise
sales reps; in its place, a pay-as-you-go model that scaled seamlessly with
storage needs. Need less? Pay less. Need more? The solution was as simple as it
gets.

:::note[Did you know?]

"We knew that the largest consumers of infrastructure would be large enterprises
because they spend more absolute dollars. **But we also had a mental image of a
college kid in his dorm room having the same access, the same scalability and
same infrastructure costs as the largest businesses in the world.**" - Andy
Jassy

:::

Remember, S3 stands for "<ins>Simple</ins> Storage Service". Amazon understood
that developers craved a straightforward interface that allowed them to focus on
building, not wrestling with arcane rituals and byzantine configurations. In an
era where API access required you to use complex protocols (remember SOAP and
XML?), S3 delivered an intuitive platform where putting objects in and
retrieving them was as intuitive as an HTTP request.

Of course, none of this would have mattered if S3 wasn't so durable that people
stopped thinking about it as a failure point. It's hard to do better than Amazon
at storing files because of their multiple nines of uptime, unmatched
durability, and robust security features. S3 set the gold standard for what
cloud storage should be.

To AWS's credit, they've managed to keep the developer experience the exact same
for all 18 years of S3 being around. To everyone's horror, they've managed to
keep the developer experience the exact same for all 18 years of it being
around. The developer experience was intended for scenarios that simply don't
exist anymore. When you create an S3 bucket, you doom that bucket to live and
die in that single building. So if you set up your upload bucket in Northern
Virginia, everybody in the Eastern Seaboard of the United States has a good
experience. However, this means your users in Washington state have a really bad
experience. There are ways to work around this and to serve files with things
like CloudFront, but once you start doing that, everything gets really
complicated, and it's easy to have one small configuration mistake spiral into
thousands of dollars of cost per day.

This isn't the view of simplicity that we think S3 deserves. And developers
agree with us. The needs and desires of developers have changed a lot in that
time. If you look at the
[StackOverflow 2023 Developer Survey](https://survey.stackoverflow.co/2023/#most-popular-technologies-platform),
you'll see that while AWS reigns supreme, the adoption curve is growing for
platforms like DigitalOcean, Vercel, and Fly.io. They all provide mostly the
same core services as AWS, but they're made with the philosophy that developers
want to spend less time configuring infrastructure and more time building their
applications.

As time has passed, developers
[want to work with newer, more streamlined cloud platforms over the big three "traditional" cloud platforms](https://survey.stackoverflow.co/2023/#section-admired-and-desired-cloud-platforms)
(AWS, Azure, and Google Cloud).

By 2006 standards, AWS S3 is a technical marvel. However, it isn't 2006 anymore,
it's 2024. So we had to ask ourselves, what would S3 look like if launched
today? We think there would be vastly different design constraints, especially
for modern real-time applications.

## About our fundraise

This is why we're building Tigris. We believe that developers no longer have to
choose between powerful and easy. Our vision is simple: developers should
concentrate on crafting exceptional applications, not fret over serving media,
managing ML training data, or grappling with log ingestion complexities.
Developers shouldn't be bogged down by naming conflicts or configuring
additional services for latency optimization; we simply want blazing-fast
applications.

Getting all of this right is hard. Really hard. Heck,
[Amazon has hundreds of engineers working on S3](https://aws.amazon.com/blogs/storage/how-automated-reasoning-helps-us-innovate-at-s3-scale/).
Building large-scale distributed systems is hard - from managing and balancing
I/O demand within a datacenter across multiple datacenters and getting
redundancy schemes right to protect data from hardware failures. It's full of
the same problems the entire industry had to deal with before the cloud existed.

[But we've built large-scale infrastructure before at Uber](https://www.tigrisdata.com/docs/about/).
We're building the groundwork that we think developers want
[on top of Fly.io](https://fly.io/blog/tigris-public-beta/), and we're excited
to continue on this mission of making highly reliable, globally distributed
object storage dead simple for developers.

And we couldn't be more excited to announce that a16z has led our latest
fundraise to help our mission become a reality. We're thrilled to be working
with [Martin Casado](https://a16z.com/author/martin-casado/) - he's had a
profound impact on the engineering community with investments in
[Inngest](https://www.inngest.com/), [Clerk](https://clerk.com/),
[Tabular](https://tabular.io/), [Fly.io](https://fly.io/),
[Instabase](https://instabase.com/), and many others. He gets that developers
are looking to escape the headaches and clunky interfaces of the traditional
clouds, and he's putting his money where his mouth is. We couldn't be happier
having him on our journey.
