---
title: Sign message
sidebar_position: 2
---

Message signing is automatic in litesaml/saml. When a `Certificate` with a `PrivateKey` is configured as the `signing` property on your `Sp` or `Idp` descriptor, all outgoing messages are signed without any extra code.

## Configuring signing for an SP

```php
use Litesaml\Models\Descriptors\Certificate;
use Litesaml\Models\Descriptors\Endpoint;
use Litesaml\Models\Descriptors\PrivateKey;
use Litesaml\Models\Descriptors\PublicKey;
use Litesaml\Models\Descriptors\Sp;
use Litesaml\Enums\BindingType;

$sp = new Sp(
    entityId: 'https://my-app.example.com',
    acs: new Endpoint('https://my-app.example.com/saml/acs', BindingType::POST),
    slo: new Endpoint('https://my-app.example.com/saml/slo', BindingType::REDIRECT),
    signing: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/sp-cert.pem')),
        privateKey: new PrivateKey(file_get_contents('/path/to/sp-key.pem')),
    ),
);
```

Every message sent by `ServiceProviderWrapper` (`sendAuthnRequest`, `sendLogoutRequest`, `sendLogoutResponse`) will be signed using this certificate and private key.

## Configuring signing for an IdP

```php
use Litesaml\Models\Descriptors\Certificate;
use Litesaml\Models\Descriptors\Endpoint;
use Litesaml\Models\Descriptors\Idp;
use Litesaml\Models\Descriptors\PrivateKey;
use Litesaml\Models\Descriptors\PublicKey;
use Litesaml\Enums\BindingType;

$idp = new Idp(
    entityId: 'https://my-idp.example.com',
    sso: new Endpoint('https://my-idp.example.com/saml/sso', BindingType::REDIRECT),
    slo: new Endpoint('https://my-idp.example.com/saml/slo', BindingType::REDIRECT),
    signing: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/idp-cert.pem')),
        privateKey: new PrivateKey(file_get_contents('/path/to/idp-key.pem')),
    ),
);
```

Every message sent by `IdentityProviderWrapper` (`sendAuthnResponse`, `sendLogoutRequest`, `sendLogoutResponse`) will be signed.

## How it works

Internally, `MessageHandler::send()` checks whether the issuer's `signing` property includes a `PrivateKey`. If it does, it attaches a `SignatureWriter` to the message before serialization using the RSA-SHA256 algorithm. The certificate's public key is embedded in the XML signature's `KeyInfo` block so the recipient can verify it.

## Publishing your certificate

Include your signing certificate in your metadata so partners can verify your signatures. `generateMetadata()` does this automatically — see [Generate metadata](../metadata/generate).
