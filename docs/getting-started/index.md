---
sidebar_position: 1
title: Overview
---

litesaml/saml exposes two wrapper classes that map to the two SAML 2.0 roles:

| Class | Role | Use case |
|---|---|---|
| `ServiceProviderWrapper` | Service Provider (SP) | Your app delegates authentication to an IdP |
| `IdentityProviderWrapper` | Identity Provider (IdP) | Your app authenticates users for other apps |

Both wrappers require a `MessageHandler` instance, which handles HTTP binding encoding/decoding and optional message signing.

## Setting up MessageHandler

`MessageHandler` depends on two PSR-17 interfaces: `ResponseFactoryInterface` and `StreamFactoryInterface`. Any PSR-17 compatible package works. The examples throughout this documentation use [nyholm/psr7](https://github.com/Nyholm/psr7).

```bash
composer require nyholm/psr7
```

```php
use Nyholm\Psr7\Factory\Psr17Factory;
use Litesaml\Support\MessageHandler;

$factory = new Psr17Factory();
$handler = new MessageHandler($factory, $factory);
```

Instantiate the `MessageHandler` once and reuse it for the lifetime of your request.

## Next steps

- [Set up as a Service Provider](./service-provider.md)
- [Set up as an Identity Provider](./identity-provider.md)
