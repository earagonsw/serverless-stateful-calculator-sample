<img src="../images/SOUTHWORKS_Logo.png" width="200">

# Serverless Extension

[PR#83](https://github.com/serverless/multicloud/pull/83) was created to support GCP as a new cloud provider within serverless multicloud repository, but it is not merged just yet.

In the meantime, the following folders and files can be copied into the [@multicloud framework](https://github.com/serverless/multicloud) code to support GCP within it.

## Core

This folder contains the minimal changes in @multicloud framework Core in order to support the new Google Cloud Provider (GCP) module.

## GCP

This module contains the necessary implementation to allow the @multicloud framework to support Google Cloud Provider (GCP).

## Samples

Two samples were added, [gcp-strorage](./samples/gcp-strorage) and [gcp-cloud-calls](./samples/gcp-cloud-calls), that invoke and test certain critical parts of the implementation.

The first one can be triggered as a background or HTTP function and reads/writes to a file in a bucket in the gcp cloud. It tests our implementation of the http middleware as well as the storage one, it has a readme, with the required steps in order to run it and test it.

The second one defines a function and invokes it using a call function service. It tests our implementation of the function cloud service.
