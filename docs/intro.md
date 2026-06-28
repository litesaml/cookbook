---
sidebar_position: 1
title: Introduction
---

**litesaml/saml** is a PHP library for implementing the [SAML 2.0](http://saml.xml.org/saml-specifications) protocol. It provides high-level wrappers for both Service Provider (SP) and Identity Provider (IdP) roles, handling authentication requests, responses, single logout, metadata, and message security.

## Requirements

- PHP ^8.4
- A PSR-17 HTTP factory implementation (e.g. `nyholm/psr7`)

## Installation

```bash
composer require litesaml/saml
```

For PSR-7/17 support, install a compatible factory:

```bash
composer require nyholm/psr7
```

## How it works

The library is built around two wrapper classes that cover the two SAML roles:

- **`ServiceProviderWrapper`** — for applications acting as Service Providers (SP): sending authentication requests, handling authentication responses, and initiating or receiving single logout.
- **`IdentityProviderWrapper`** — for applications acting as Identity Providers (IdP): handling authentication requests, sending authentication responses with user attributes, and managing single logout.

Both wrappers accept PSR-7 `ServerRequestInterface` as input and return PSR-7 `ResponseInterface`, making them framework-agnostic.

## Features

- [Getting Started](getting-started) — configure your SP or IdP and make your first request
- [Metadata](metadata) — generate and parse SAML metadata
- [Authentication](authentication) — send and receive authentication requests and responses
- [Single Logout](single-logout) — initiate and handle logout flows
- [Security](security) — sign messages, verify signatures, encrypt and decrypt assertions

---

## About the project

litesaml/saml builds on [litesaml/lightsaml](https://github.com/litesaml/lightsaml), originally developed by [Milos Tomic](https://github.com/tmilos/) and maintained since 2021.

### Contributing

Contributions are welcome. [Read the guide](contributing) and open an issue first to discuss your proposal.
