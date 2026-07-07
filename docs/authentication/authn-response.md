---
sidebar_position: 3
title: Authentication response
---

After authenticating the user, the IdP sends an `AuthnResponse` to the SP's ACS endpoint. The SP then reads the response to retrieve the user's identity and attributes.

## IdP: send an AuthnResponse

Call `sendAuthnResponse()` with the target `Sp` descriptor and a `ContextList` of `Attribute` objects representing the user's identity:

```php
use Litesaml\Models\Messages\Context\Attribute;
use Litesaml\Models\Messages\Context\ContextList;

$response = $idpWrapper->sendAuthnResponse($sp, new ContextList(
    new Attribute('email',       ['user@example.com']),
    new Attribute('displayName', ['Jane Doe']),
    new Attribute('groups',      ['admins', 'editors']),
));
```

The response uses the SP's ACS binding (HTTP-POST). The IdP's assertion is signed automatically if `$idp->signing` is configured with a `PrivateKey`.

To send encrypted attributes (so only the SP with the matching private key can read them), see [Encrypt assertion](../security/encrypt-assertion).

### Setting the NameID

Add a `NameId` context to populate the assertion's `Subject`/`NameID` — useful to honor a format the SP requested via `NameIDPolicy` (see [Authentication request](./authn-request)):

```php
use Litesaml\Models\Messages\Context\NameId;

$response = $idpWrapper->sendAuthnResponse($sp, new ContextList(
    new NameId('user@example.com', 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'),
    new Attribute('displayName', ['Jane Doe']),
));
```

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
$nameId       = $authnResponse->nameId?->value;   // NameID value, if present
$nameIdFormat = $authnResponse->nameId?->format;  // NameID format, if present
$sessionIndex = $authnResponse->sessionIndex;     // SessionIndex, if present — keep it for logout

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
| `nameId` | `?NameId` | Subject NameID (`value` + `format`) — pass it directly to [`sendLogoutRequest()`](../single-logout/logout-request) later |
| `sessionIndex` | `?string` | Session index of the authenticated session — pass it to [`sendLogoutRequest()`](../single-logout/logout-request) later |
| `inResponseTo` | `?string` | ID of the original `AuthnRequest` |
| `attributes` | `Attribute[]` | User attributes |
| `relayState` | `?string` | RelayState forwarded from the request |

### Validating the IdP's signature

Pass a `Validate` context with the `$idp` descriptor to verify the response signature:

```php
use Litesaml\Exceptions\SamlException;
use Litesaml\Models\Messages\Context\ContextList;
use Litesaml\Models\Messages\Context\Validate;

try {
    $authnResponse = $spWrapper->handleAuthnResponse($request, new ContextList(
        new Validate($idp),
    ));
} catch (SamlException $e) {
    // Signature is missing or invalid
}
```

This requires `$idp->signing` to be configured with the IdP's public certificate.

### Encrypted assertions

If the IdP sent encrypted attributes, configure the SP's `encryption` certificate with a `PrivateKey`. The wrapper decrypts them automatically — no extra code is needed. See [Decrypt assertion](../security/decrypt-assertion).
