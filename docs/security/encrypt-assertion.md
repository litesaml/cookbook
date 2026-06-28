---
title: Encrypt assertion
sidebar_position: 4
---

The IdP can encrypt individual attributes so that only the intended SP can decrypt them. This is done at the attribute level: mark an `Attribute` as `encrypted: true` when calling `sendAuthnResponse()`.

## IdP: send encrypted attributes

```php
use Litesaml\Models\Messages\Attribute;

$response = $idpWrapper->sendAuthnResponse($sp, [
    new Attribute('email',       ['user@example.com']),               // Sent in plaintext
    new Attribute('ssn',         ['123-45-6789'], encrypted: true),   // Encrypted
    new Attribute('accessToken', ['tok_abc123'],  encrypted: true),   // Encrypted
]);
```

Encrypted attributes are bundled into a separate `EncryptedAssertion` element in the SAML response. The IdP encrypts them using the SP's public encryption key (RSA-1.5).

## Requirement: SP encryption certificate

For the IdP to encrypt attributes, the target `Sp` descriptor must have an `encryption` certificate configured with a `PublicKey`:

```php
use Litesaml\Models\Descriptors\Certificate;
use Litesaml\Models\Descriptors\Endpoint;
use Litesaml\Models\Descriptors\PublicKey;
use Litesaml\Models\Descriptors\Sp;
use Litesaml\Enums\BindingType;

$sp = new Sp(
    entityId: 'https://my-app.example.com',
    acs: new Endpoint('https://my-app.example.com/saml/acs', BindingType::POST),
    slo: new Endpoint('https://my-app.example.com/saml/slo', BindingType::REDIRECT),
    encryption: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/sp-enc-cert.pem')),
        // No PrivateKey needed on the IdP side — only the SP's public key is used to encrypt
    ),
);
```

If `$sp->encryption` is `null` and the response includes encrypted attributes, `sendAuthnResponse()` throws a `SamlException`.

## Publishing the encryption certificate

The SP's encryption certificate must be published in its metadata so the IdP can retrieve it. `ServiceProviderWrapper::generateMetadata()` includes the `encryption` certificate automatically under a `<KeyDescriptor use="encryption">` element — see [Generate metadata](../metadata/generate).

## Decryption on the SP side

The SP decrypts the assertion automatically in `handleAuthnResponse()` when `$sp->encryption` includes a `PrivateKey`. See [Decrypt assertion](decrypt-assertion).
