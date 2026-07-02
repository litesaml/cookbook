---
title: Verify signature
sidebar_position: 3
---

Signatures are verified inline, at the point of receiving a message. There is no way to verify a signature after the fact on an already-parsed message.

## Automatic verification on receive

All `handle*` methods accept two optional parameters: `validate` and `issuer`. When `validate: true` is passed with an `issuer` descriptor, the method verifies the signature and throws a `SamlException` if it is missing or invalid.

```php
use Litesaml\Exceptions\SamlException;

try {
    $authnResponse = $spWrapper->handleAuthnResponse(
        $request,
        validate: true,
        issuer: $idp,  // Must have $idp->signing configured with the IdP's public certificate
    );
} catch (SamlException $e) {
    // Signature validation failed
}
```

This pattern works for all handle methods on both wrappers:

```php
$spWrapper->handleAuthnResponse($request, validate: true, issuer: $idp);
$spWrapper->handleLogoutRequest($request, validate: true, issuer: $idp);
$spWrapper->handleLogoutResponse($request, validate: true, issuer: $idp);

$idpWrapper->handleAuthnRequest($request, validate: true, issuer: $sp);
$idpWrapper->handleLogoutRequest($request, validate: true, issuer: $sp);
$idpWrapper->handleLogoutResponse($request, validate: true, issuer: $sp);
```

## Requirement

The issuer descriptor must have its `signing` property set to a `Certificate` with at least a `PublicKey`:

```php
use Litesaml\Models\Descriptors\Certificate;
use Litesaml\Models\Descriptors\Idp;
use Litesaml\Models\Descriptors\PublicKey;

$idp = new Idp(
    ...,
    signing: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/idp-cert.pem')),
        // No PrivateKey needed — only the public key is required for verification
    ),
);
```
