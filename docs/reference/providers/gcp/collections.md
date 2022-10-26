---
title: Collections
description: How Nitric deploys Collections to Google Cloud
---

Nitric Collections are deployed to GCP using [Firestore](https://cloud.google.com/firestore).

## GCP Resources

No resources are provisioned at deploy time, collections will be created as needed at runtime.

## Deployment

During deployment, nitric may deploy an App Engine application to your project if one does not already exist, this ensures the App Engine region of your GCP project is set.

> Note: This is required for firestore to operate.