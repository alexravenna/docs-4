---
title: Schedules
description: How Nitric deploys Schedules to Google Cloud
---

Nitric schedules are deployed to GCP using [Cloud Scheduler](https://cloud.google.com/scheduler).

## GCP Resources

The following resources are created when deploying Schedules to GCP:

- Cloud Schedule
- Cloud Run

## Deployment

During deployment, your schedules will be provisioned as follows:

- A cloud run schedule will be setup to trigger the cloud run application that hosts your schedule.