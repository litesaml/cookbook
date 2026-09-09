---
title: Decrypt assertion
sidebar_position: 5
---

When the IdP sends encrypted assertions, the SP decrypts them automatically in `handleAuthnResponse()` — provided the `Sp` descriptor is configured with an encryption `Certificate` that includes a `PrivateKey`.

## SP: configure decryption

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
    encryption: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/sp-enc-cert.pem')),
        privateKey: new PrivateKey(file_get_contents('/path/to/sp-enc-key.pem')),
    ),
);
```

## Receiving the decrypted attributes

No extra code is needed. Call `handleAuthnResponse()` as usual:

```php
$authnResponse = $spWrapper->handleAuthnResponse($request);

foreach ($authnResponse->attributes as $attribute) {
    echo $attribute->name;
    // $attribute->encrypted === true for attributes that were encrypted by the IdP
    print_r($attribute->values);
}
```

Encrypted attributes are decrypted transparently and merged into `$authnResponse->attributes` alongside any plaintext attributes. You can distinguish them by checking `$attribute->encrypted`.

## Error handling

If the response contains an encrypted assertion and `$sp->encryption` is not configured or has no `PrivateKey`, `handleAuthnResponse()` throws a `SamlException`:

```
No encryption certificate configured to decrypt assertion
```

Make sure the SP's encryption certificate public key is published in the SP's metadata so the IdP can use it to encrypt. See [Encrypt assertion](encrypt-assertion) and [Generate metadata](../metadata/generate).

If the key is configured but decryption itself fails — wrong key, corrupted ciphertext, or an unsupported key transport algorithm — `handleAuthnResponse()` throws a `SamlException` with the message:

```
Failed to decrypt assertion: ...
```

Since litesaml/saml `5.0`, assertions encrypted with RSA-1.5 key transport are rejected here by default (Bleichenbacher risk); the IdP must use RSA-OAEP. See [Upgrading to 5.0 from 4.x](../getting-started/upgrade-guide/5.0-from-4.x).
