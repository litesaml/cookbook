---
sidebar_position: 3
title: Authentication response
---

After authenticating the user, the IdP sends an `AuthnResponse` to the SP's ACS endpoint. The SP then reads the response to retrieve the user's identity and attributes.

## IdP: send an AuthnResponse

Call `sendAuthnResponse()` with the target `Sp` descriptor and an array of `Attribute` objects representing the user's identity:

```php
use Litesaml\Models\Messages\Attribute;

$response = $idpWrapper->sendAuthnResponse($sp, [
    new Attribute('email',       ['user@example.com']),
    new Attribute('displayName', ['Jane Doe']),
    new Attribute('groups',      ['admins', 'editors']),
]);
```

The response uses the SP's ACS binding (HTTP-POST). The IdP's assertion is signed automatically if `$idp->signing` is configured with a `PrivateKey`.

To send encrypted attributes (so only the SP with the matching private key can read them), see [Encrypt assertion](../security/encrypt-assertion).

## SP: receive an AuthnResponse

At your ACS endpoint, call `handleAuthnResponse()` to decode and deserialize the response:

```php
// $request is the PSR-7 ServerRequestInterface at your ACS endpoint
$authnResponse = $spWrapper->handleAuthnResponse($request);
```

### Checking the status

```php
if (!$authnResponse->isSuccess()) {
    // Authentication failed — inspect $authnResponse->status
}
```

The `status` property is a `Litesaml\Enums\Status` enum:

| Case | SAML status code | Meaning |
|---|---|---|
| `SUCCESS` | `urn:oasis:names:tc:SAML:2.0:status:Success` | Authentication succeeded |
| `REQUESTER` | `urn:oasis:names:tc:SAML:2.0:status:Requester` | Error on the SP side |
| `RESPONDER` | `urn:oasis:names:tc:SAML:2.0:status:Responder` | Error on the IdP side |
| `VERSION_MISMATCH` | `urn:oasis:names:tc:SAML:2.0:status:VersionMismatch` | Protocol version mismatch |

### Reading attributes

```php
$nameId = $authnResponse->nameId;  // NameID value, if present

// Get a specific attribute
$email = $authnResponse->getAttributeByName('email')?->values[0];

// Iterate over all attributes
foreach ($authnResponse->attributes as $attribute) {
    $name   = $attribute->name;
    $values = $attribute->values; // string[]
}
```

The `AuthnResponse` object properties:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Response ID |
| `issuer` | `string` | The IdP's entity ID |
| `status` | `?Status` | Authentication result |
| `nameId` | `?string` | Subject NameID |
| `inResponseTo` | `?string` | ID of the original `AuthnRequest` |
| `attributes` | `Attribute[]` | User attributes |
| `relayState` | `?string` | RelayState forwarded from the request |
| `signature` | `?Signature` | Signature present on the response |

### Validating the IdP's signature

Pass `validate: true` and the `$idp` descriptor to verify the response signature:

```php
use Litesaml\Exceptions\SamlException;

try {
    $authnResponse = $spWrapper->handleAuthnResponse($request, validate: true, issuer: $idp);
} catch (SamlException $e) {
    // Signature is missing or invalid
}
```

This requires `$idp->signing` to be configured with the IdP's public certificate.

### Encrypted assertions

If the IdP sent encrypted attributes, configure the SP's `encryption` certificate with a `PrivateKey`. The wrapper decrypts them automatically — no extra code is needed. See [Decrypt assertion](../security/decrypt-assertion).
