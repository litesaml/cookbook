---
sidebar_position: 2
title: Authentication request
---

An `AuthnRequest` is sent by the SP to the IdP to initiate the authentication flow. The IdP receives and processes it, then authenticates the user.

## SP: send an AuthnRequest

Call `sendAuthnRequest()` on your `ServiceProviderWrapper`. It builds the request, signs it if your SP has a signing certificate, and returns a PSR-7 `ResponseInterface` using the IdP's SSO binding (HTTP-Redirect or HTTP-POST).

```php
// $idp is an Idp descriptor — built manually or via MetadataParser::parse()
$response = $spWrapper->sendAuthnRequest($idp);
```

Pass a `relayState` string to carry application state across the redirect (e.g. the URL the user was trying to reach):

```php
$response = $spWrapper->sendAuthnRequest($idp, relayState: '/dashboard');
```

The returned `$response` is a PSR-7 response. Emit it using your framework's response emitter:

- **HTTP-Redirect binding**: the response is a `302` redirect with the encoded `SAMLRequest` in the query string.
- **HTTP-POST binding**: the response contains an HTML form that auto-submits to the IdP's SSO endpoint.

## IdP: receive an AuthnRequest

At your SSO endpoint, call `handleAuthnRequest()` to decode and deserialize the incoming request:

```php
// $request is the PSR-7 ServerRequestInterface at your SSO endpoint
$authnRequest = $idpWrapper->handleAuthnRequest($request);

$spEntityId = $authnRequest->issuer;    // The SP's entity ID
$requestId  = $authnRequest->id;        // Unique request ID (store it to match the response)
$relayState = $authnRequest->relayState;
```

The method returns an `AuthnRequest` object with the following properties:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique request ID |
| `issuer` | `string` | The SP's entity ID |
| `relayState` | `?string` | Opaque state string passed by the SP |
| `signature` | `?Signature` | Signature present on the request, if any |

### Validating the SP's signature

Pass `validate: true` and the `$sp` descriptor to verify the request signature:

```php
use Litesaml\Exceptions\SamlException;

try {
    $authnRequest = $idpWrapper->handleAuthnRequest($request, validate: true, issuer: $sp);
} catch (SamlException $e) {
    // Signature is missing or invalid
}
```

This requires `$sp->signing` to be configured with the SP's public certificate.
