## LinkedIn

For years, Tigris had a delete-protection flag — flip it on and the bucket couldn't be deleted at all. Useful as a wall, but a wall is only one of two answers to "what happens when something goes wrong?"

Today, we're introducing **Soft Delete** for Tigris buckets and objects.

Enable it on a bucket and every delete — of an object, a version, or the bucket itself — moves into a recoverable state for a retention window you set (7–90 days, default 7) before it's permanently removed. Restore from the dashboard, or enable from the S3 API with a single header on `CreateBucket`.

The model is intentionally close to how GCS does soft delete:

- **Per-version restore.** The same key can have multiple soft-deleted versions stacked up, each independently restorable.
- **No extra charge.** Soft-deleted data is billed at the same per-GB rate as live data while it's inside the retention window.
- **One toggle.** Bucket Settings → Data Management, or `X-Tigris-Soft-Delete` on `CreateBucket`.

The right default for production data, CI/CD-touched buckets, and anything an agent has write access to.

Full announcement: https://www.tigrisdata.com/blog/soft-delete

#Tigris #ObjectStorage #DataProtection #S3Compatible

---

## Twitter/X

Tigris had a delete-protection flag that worked as a hard wall.
Useful, but a wall is only one of two answers.

Today we launched **Soft Delete** for buckets and objects.

Every delete moves into a recoverable state for a retention window you pick (7–90 days). Restore from the dashboard, or set `X-Tigris-Soft-Delete` on `CreateBucket`.

Same per-GB price while it's recoverable. No add-on fee.

Read more: https://www.tigrisdata.com/blog/soft-delete

#ObjectStorage #S3 #DataProtection
