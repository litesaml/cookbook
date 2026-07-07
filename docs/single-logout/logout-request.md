---
sidebar_position: 2
title: Logout request
---

A `LogoutRequest` is sent by either the SP or the IdP to initiate single logout. The recipient terminates the user's session and replies with a `LogoutResponse`.

## Send a logout request

Both `ServiceProviderWrapper` and `IdentityProviderWrapper` expose `sendLogoutRequest()`. It builds and signs the request (if the sender has a signing certificate), then returns a PSR-7 `ResponseInterface` using the recipient's SLO binding.

A `NameId` context is required — `sendLogoutRequest()` throws a `SamlException` if none is passed.

**SP initiates logout:**

```php
use Litesaml\Models\Messages\Context\ContextList;
use Litesaml\Models\Messages\Context\NameId;

// $idp: the IdP descriptor (target of the request)
$response = $spWrapper->sendLogoutRequest($idp, new ContextList(
    new NameId($nameIdValue), // The NameID of the user whose session to terminate
));
```

If you already have the `NameId` object from `handleAuthnResponse()`'s `AuthnResponse::$nameId`, pass it straight through:

```php
$response = $spWrapper->sendLogoutRequest($idp, new ContextList(
    $authnResponse->nameId,
));
```

**IdP initiates logout:**

```php
$response = $idpWrapper->sendLogoutRequest($sp, new ContextList(
    new NameId($nameIdValue),
));
```

Optional contexts:

```php
use Litesaml\Models\Messages\Context\RelayState;
use Litesaml\Models\Messages\Context\SessionIndex;

$response = $spWrapper->sendLogoutRequest($idp, new ContextList(
    new NameId($nameIdValue),
    new RelayState('/logged-out'),     // Opaque state string
    new SessionIndex($sessionIndex),   // The session index from the original AuthnResponse
));
```

## Receive a logout request

At your SLO endpoint, call `handleLogoutRequest()` to decode and deserialize the incoming request:

```php
// $request is the PSR-7 ServerRequestInterface at your SLO endpoint
$logoutRequest = $spWrapper->handleLogoutRequest($request);
// or
$logoutRequest = $idpWrapper->handleLogoutRequest($request);

$nameId       = $logoutRequest->nameId?->value;
$sessionIndex = $logoutRequest->sessionIndex;
$relayState   = $logoutRequest->relayState;

// Terminate the user's session, then send a response
```

The returned `LogoutRequest` object:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique request ID |
| `issuer` | `string` | Entity ID of the sender |
| `nameId` | `?NameId` | NameID of the user to log out (`value` + `format`) |
| `sessionIndex` | `?string` | Session index to terminate |
| `relayState` | `?string` | Opaque state string |

### Validating the signature

```php
use Litesaml\Exceptions\SamlException;
use Litesaml\Models\Messages\Context\ContextList;
use Litesaml\Models\Messages\Context\Validate;

try {
    $logoutRequest = $spWrapper->handleLogoutRequest($request, new ContextList(
        new Validate($idp),
    ));
} catch (SamlException $e) {
    // Signature is missing or invalid
}
```
