---
sidebar_position: 2
title: Logout request
---

A `LogoutRequest` is sent by either the SP or the IdP to initiate single logout. The recipient terminates the user's session and replies with a `LogoutResponse`.

## Send a logout request

Both `ServiceProviderWrapper` and `IdentityProviderWrapper` expose `sendLogoutRequest()`. It builds and signs the request (if the sender has a signing certificate), then returns a PSR-7 `ResponseInterface` using the recipient's SLO binding.

**SP initiates logout:**

```php
// $nameId: the NameID of the user whose session to terminate
// $idp: the IdP descriptor (target of the request)
$response = $spWrapper->sendLogoutRequest($idp, $nameId);
```

**IdP initiates logout:**

```php
$response = $idpWrapper->sendLogoutRequest($sp, $nameId);
```

Optional parameters:

```php
$response = $spWrapper->sendLogoutRequest(
    recipient: $idp,
    nameId: $nameId,
    relayState: '/logged-out',  // Opaque state string
    sessionIndex: $sessionIndex, // The session index from the original AuthnResponse
);
```

## Receive a logout request

At your SLO endpoint, call `handleLogoutRequest()` to decode and deserialize the incoming request:

```php
// $request is the PSR-7 ServerRequestInterface at your SLO endpoint
$logoutRequest = $spWrapper->handleLogoutRequest($request);
// or
$logoutRequest = $idpWrapper->handleLogoutRequest($request);

$nameId       = $logoutRequest->nameId;
$sessionIndex = $logoutRequest->sessionIndex;
$relayState   = $logoutRequest->relayState;

// Terminate the user's session, then send a response
```

The returned `LogoutRequest` object:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique request ID |
| `issuer` | `string` | Entity ID of the sender |
| `nameId` | `?string` | NameID of the user to log out |
| `sessionIndex` | `?string` | Session index to terminate |
| `relayState` | `?string` | Opaque state string |
| `signature` | `?Signature` | Signature on the request, if any |

### Validating the signature

```php
use Litesaml\Exceptions\SamlException;

try {
    $logoutRequest = $spWrapper->handleLogoutRequest($request, validate: true, issuer: $idp);
} catch (SamlException $e) {
    // Signature is missing or invalid
}
```
