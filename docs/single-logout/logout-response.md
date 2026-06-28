---
sidebar_position: 3
title: Logout response
---

A `LogoutResponse` is sent in reply to a `LogoutRequest`. It confirms that the session has been terminated.

## Send a logout response

After receiving and processing a `LogoutRequest`, send a response back to the initiator using `sendLogoutResponse()`:

```php
// $recipient: the party that sent the LogoutRequest (their SLO endpoint is used)
$response = $spWrapper->sendLogoutResponse($idp);
// or
$response = $idpWrapper->sendLogoutResponse($sp);
```

The response always carries a `Success` status. It is signed if the sender has a signing certificate configured.

## Receive a logout response

At your SLO endpoint (when you initiated the logout), call `handleLogoutResponse()` to decode the response:

```php
$logoutResponse = $spWrapper->handleLogoutResponse($request);
// or
$logoutResponse = $idpWrapper->handleLogoutResponse($request);

$id         = $logoutResponse->id;
$relayState = $logoutResponse->relayState;
```

The returned `LogoutResponse` object:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique response ID |
| `issuer` | `string` | Entity ID of the sender |
| `relayState` | `?string` | Opaque state string forwarded from the request |
| `signature` | `?Signature` | Signature on the response, if any |

### Validating the signature

```php
use Litesaml\Exceptions\SamlException;

try {
    $logoutResponse = $spWrapper->handleLogoutResponse($request, validate: true, issuer: $idp);
} catch (SamlException $e) {
    // Signature is missing or invalid
}
```

## Typical SLO flow

```
SP                        IdP
 |                          |
 |--- LogoutRequest ------->|  (SP initiates)
 |                          |  (IdP terminates session)
 |<-- LogoutResponse -------|
 |                          |
```

```php
// Route: POST /saml/slo (SP side — receiving response after SP initiated)
$logoutResponse = $spWrapper->handleLogoutResponse($request, validate: true, issuer: $idp);
// Redirect to the logged-out page

// Route: GET /saml/slo (SP side — receiving a request initiated by IdP)
$logoutRequest = $spWrapper->handleLogoutRequest($request, validate: true, issuer: $idp);
// Terminate session
$response = $spWrapper->sendLogoutResponse($idp);
// Emit $response
```
