---
sidebar_position: 2
title: Service Provider
---

A Service Provider (SP) delegates user authentication to an Identity Provider (IdP). This page shows how to configure a `ServiceProviderWrapper` and use it to authenticate users.

## 1. Configure your SP descriptor

The `Sp` class describes your SP: its entity ID, its Assertion Consumer Service (ACS) endpoint, its Single Logout (SLO) endpoint, and optionally its signing and encryption certificates.

```php
use Litesaml\Models\Descriptors\Certificate;
use Litesaml\Models\Descriptors\Endpoint;
use Litesaml\Models\Descriptors\PrivateKey;
use Litesaml\Models\Descriptors\PublicKey;
use Litesaml\Models\Descriptors\Sp;
use Litesaml\Enums\BindingType;

$sp = new Sp(
    entityId: 'https://my-app.example.com',
    acs: new Endpoint('https://my-app.example.com/saml/acs', BindingType::POST),
    slo: new Endpoint('https://my-app.example.com/saml/slo', BindingType::REDIRECT),
    signing: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/sp-cert.pem')),
        privateKey: new PrivateKey(file_get_contents('/path/to/sp-key.pem')),
    ),
);
```

`PublicKey` and `PrivateKey` accept either a full PEM string or a raw base64-encoded DER value.

The `signing` certificate is optional. When provided, all outgoing messages will be signed automatically. See [Sign message](../security/sign-message) for details.

## 2. Configure the IdP descriptor

```php
use Litesaml\Models\Descriptors\Certificate;
use Litesaml\Models\Descriptors\Endpoint;
use Litesaml\Models\Descriptors\Idp;
use Litesaml\Models\Descriptors\PublicKey;
use Litesaml\Enums\BindingType;

$idp = new Idp(
    entityId: 'https://idp.example.com',
    sso: new Endpoint('https://idp.example.com/sso', BindingType::REDIRECT),
    slo: new Endpoint('https://idp.example.com/slo', BindingType::REDIRECT),
    signing: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/idp-cert.pem')),
    ),
);
```

To build an `Idp` from a metadata XML document instead, see [Parse metadata](../metadata/parse.md).

## 3. Instantiate the wrapper

```php
use Nyholm\Psr7\Factory\Psr17Factory;
use Litesaml\ServiceProviderWrapper;
use Litesaml\Support\MessageHandler;

$factory = new Psr17Factory();
$handler = new MessageHandler($factory, $factory);

$spWrapper = new ServiceProviderWrapper($sp, $handler);
```

## 4. Send an authentication request

Call `sendAuthnRequest()` to initiate the SAML flow. The method returns a PSR-7 `ResponseInterface` — either an HTTP redirect or an HTML auto-submit form, depending on the IdP's SSO binding.

```php
// $request is a PSR-7 ServerRequestInterface from your framework
$response = $spWrapper->sendAuthnRequest($idp);

// Send the PSR-7 response to the browser using your framework's response emitter
```

An optional `$relayState` string can be passed to carry state across the redirect (e.g. the original URL the user was trying to reach).

```php
$response = $spWrapper->sendAuthnRequest($idp, relayState: '/dashboard');
```

## 5. Handle the authentication response

When the IdP redirects the user back to your ACS endpoint, call `handleAuthnResponse()`:

```php
// $request is the PSR-7 ServerRequestInterface at your ACS endpoint
$authnResponse = $spWrapper->handleAuthnResponse($request);

if ($authnResponse->isSuccess()) {
    $nameId = $authnResponse->nameId;
    $email  = $authnResponse->getAttributeByName('email')?->values[0];

    // Log the user in
}
```

To also validate the IdP's signature on the response, pass `validate: true` and the IdP descriptor:

```php
$authnResponse = $spWrapper->handleAuthnResponse($request, validate: true, issuer: $idp);
```

This throws a `SamlException` if the signature is absent or invalid.
