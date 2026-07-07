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

Pass a `RelayState` context to carry application state across the redirect (e.g. the URL the user was trying to reach):

```php
use Litesaml\Models\Messages\Context\ContextList;
use Litesaml\Models\Messages\Context\RelayState;

$response = $spWrapper->sendAuthnRequest($idp, new ContextList(
    new RelayState('/dashboard'),
));
```

The returned `$response` is a PSR-7 response. Emit it using your framework's response emitter:

- **HTTP-Redirect binding**: the response is a `302` redirect with the encoded `SAMLRequest` in the query string.
- **HTTP-POST binding**: the response contains an HTML form that auto-submits to the IdP's SSO endpoint.

### Requesting a NameID Format

Pass a `NameIdPolicyFormat` context to ask the IdP for a specific identifier format. The IdP reads it back from `AuthnRequest::$nameIdPolicyFormat` in `handleAuthnRequest()`.

```php
use Litesaml\Models\Messages\Context\ContextList;
use Litesaml\Models\Messages\Context\NameIdPolicyFormat;

$response = $spWrapper->sendAuthnRequest($idp, new ContextList(
    new NameIdPolicyFormat('urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'),
));
```

## IdP: receive an AuthnRequest

At your SSO endpoint, call `handleAuthnRequest()` to decode and deserialize the incoming request:

```php
// $request is the PSR-7 ServerRequestInterface at your SSO endpoint
$authnRequest = $idpWrapper->handleAuthnRequest($request);

$spEntityId         = $authnRequest->issuer;             // The SP's entity ID
$requestId          = $authnRequest->id;                 // Unique request ID (store it to match the response)
$relayState         = $authnRequest->relayState;
$nameIdPolicyFormat = $authnRequest->nameIdPolicyFormat;  // Format requested by the SP, if any
```

The method returns an `AuthnRequest` object with the following properties:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique request ID |
| `issuer` | `string` | The SP's entity ID |
| `relayState` | `?string` | Opaque state string passed by the SP |
| `nameIdPolicyFormat` | `?string` | NameID format requested via `NameIDPolicy`, if any |

### Validating the SP's signature

Pass a `Validate` context with the `$sp` descriptor to verify the request signature:

```php
use Litesaml\Exceptions\SamlException;
use Litesaml\Models\Messages\Context\ContextList;
use Litesaml\Models\Messages\Context\Validate;

try {
    $authnRequest = $idpWrapper->handleAuthnRequest($request, new ContextList(
        new Validate($sp),
    ));
} catch (SamlException $e) {
    // Signature is missing or invalid
}
```

This requires `$sp->signing` to be configured with the SP's public certificate.
