---
title: Verify signature
sidebar_position: 3
---

Signatures are verified inline, at the point of receiving a message. There is no way to verify a signature after the fact on an already-parsed message.

## Automatic verification on receive

All `handle*` methods accept a `ContextList`. Pass a `Validate` context built with the expected sender's descriptor, and the method verifies the signature and throws a `SamlException` if it is missing or invalid.

```php
use Litesaml\Exceptions\SamlException;
use Litesaml\Models\Messages\Context\ContextList;
use Litesaml\Models\Messages\Context\Validate;

try {
    $authnResponse = $spWrapper->handleAuthnResponse(
        $request,
        new ContextList(
            new Validate($idp), // Must have $idp->signing configured with the IdP's public certificate
        ),
    );
} catch (SamlException $e) {
    // Signature validation failed
}
```

This pattern works for all handle methods on both wrappers:

```php
$spWrapper->handleAuthnResponse($request, new ContextList(new Validate($idp)));
$spWrapper->handleLogoutRequest($request, new ContextList(new Validate($idp)));
$spWrapper->handleLogoutResponse($request, new ContextList(new Validate($idp)));

$idpWrapper->handleAuthnRequest($request, new ContextList(new Validate($sp)));
$idpWrapper->handleLogoutRequest($request, new ContextList(new Validate($sp)));
$idpWrapper->handleLogoutResponse($request, new ContextList(new Validate($sp)));
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
