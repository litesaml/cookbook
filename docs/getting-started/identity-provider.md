---
sidebar_position: 3
title: Identity Provider
---

An Identity Provider (IdP) authenticates users on behalf of Service Providers. This page shows how to configure an `IdentityProviderWrapper` and use it to respond to authentication requests.

## 1. Configure your IdP descriptor

The `Idp` class describes your IdP: its entity ID, its Single Sign-On (SSO) endpoint, its Single Logout (SLO) endpoint, and optionally its signing certificate.

```php
use Litesaml\Models\Descriptors\Certificate;
use Litesaml\Models\Descriptors\Endpoint;
use Litesaml\Models\Descriptors\Idp;
use Litesaml\Models\Descriptors\PrivateKey;
use Litesaml\Models\Descriptors\PublicKey;
use Litesaml\Enums\BindingType;

$idp = new Idp(
    entityId: 'https://my-idp.example.com',
    sso: new Endpoint('https://my-idp.example.com/saml/sso', BindingType::REDIRECT),
    slo: new Endpoint('https://my-idp.example.com/saml/slo', BindingType::REDIRECT),
    signing: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/idp-cert.pem')),
        privateKey: new PrivateKey(file_get_contents('/path/to/idp-key.pem')),
    ),
);
```

When a `signing` certificate with a `PrivateKey` is provided, all outgoing responses are signed automatically.

## 2. Configure the SP descriptor

You need an `Sp` descriptor for each Service Provider you trust. Build it from their metadata or manually.

```php
use Litesaml\Models\Descriptors\Certificate;
use Litesaml\Models\Descriptors\Endpoint;
use Litesaml\Models\Descriptors\PublicKey;
use Litesaml\Models\Descriptors\Sp;
use Litesaml\Enums\BindingType;

$sp = new Sp(
    entityId: 'https://my-app.example.com',
    acs: new Endpoint('https://my-app.example.com/saml/acs', BindingType::POST),
    slo: new Endpoint('https://my-app.example.com/saml/slo', BindingType::REDIRECT),
    signing: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/sp-cert.pem')),
    ),
);
```

## 3. Instantiate the wrapper

```php
use Nyholm\Psr7\Factory\Psr17Factory;
use Litesaml\IdentityProviderWrapper;
use Litesaml\Support\MessageHandler;

$factory = new Psr17Factory();
$handler = new MessageHandler($factory, $factory);

$idpWrapper = new IdentityProviderWrapper($idp, $handler);
```

## 4. Handle an authentication request

When a Service Provider sends an `AuthnRequest` to your SSO endpoint, call `handleAuthnRequest()`:

```php
// $request is the PSR-7 ServerRequestInterface at your SSO endpoint
$authnRequest = $idpWrapper->handleAuthnRequest($request);

$spEntityId  = $authnRequest->issuer;
$requestId   = $authnRequest->id;
$relayState  = $authnRequest->relayState;
```

To validate the SP's signature on the request:

```php
$authnRequest = $idpWrapper->handleAuthnRequest($request, validate: true, issuer: $sp);
```

## 5. Send an authentication response

After authenticating the user, call `sendAuthnResponse()` with the SP descriptor and the user's attributes:

```php
use Litesaml\Models\Messages\Attribute;

$response = $idpWrapper->sendAuthnResponse($sp, [
    new Attribute('email',       ['user@example.com']),
    new Attribute('displayName', ['Jane Doe']),
    new Attribute('role',        ['admin', 'editor']),
]);

// Emit the PSR-7 response — it auto-submits a POST form to the SP's ACS
```

The response is always sent to the SP's ACS endpoint using the HTTP-POST binding. The IdP's assertion is signed automatically if `$idp->signing` is configured with a `PrivateKey`.

To send encrypted attributes instead, see [Encrypt assertion](../security/encrypt-assertion).
