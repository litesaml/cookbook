---
title: Verify signature
sidebar_position: 3
---

Signatures can be verified either automatically at the point of receiving a message, or manually after the fact.

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

## Manual verification

You can also verify a signature on a message you have already received, using `validateSignature()`:

```php
$authnResponse = $spWrapper->handleAuthnResponse($request); // No validation yet

// Later, once you know which IdP sent it:
$isValid = $spWrapper->validateSignature($authnResponse, $idp);

if (!$isValid) {
    // Signature is missing or does not verify against $idp->signing
}
```

`validateSignature()` returns `false` if the message has no signature or if the issuer has no `signing` certificate configured. It does not throw.

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
