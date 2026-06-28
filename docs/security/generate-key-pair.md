---
title: Generate a key pair
sidebar_position: 1
---

SAML security features (signing and encryption) require a key pair: a certificate (public key) and a private key. The certificate is shared with your SAML partners and published in your metadata. The private key must remain secret.

Certificates expire over time and must be renewed to keep signing and encryption working.

## Generating a key pair with OpenSSL

```shell
openssl req -new -x509 -days 365 -nodes -sha256 -out saml.crt -keyout saml.pem
```

This produces:

- `saml.crt` — the certificate (public key)
- `saml.pem` — the private key

**Note:** The `-sha256` flag sets the digest algorithm to SHA-256. Omitting it defaults to SHA-1, which is considered weak and should be avoided.

## Loading the key pair

Use the `Certificate`, `PublicKey`, and `PrivateKey` classes to load your key pair:

```php
use Litesaml\Models\Descriptors\Certificate;
use Litesaml\Models\Descriptors\PrivateKey;
use Litesaml\Models\Descriptors\PublicKey;

$certificate = new Certificate(
    publicKey: new PublicKey(file_get_contents('/path/to/saml.crt')),
    privateKey: new PrivateKey(file_get_contents('/path/to/saml.pem')),
);
```

`PublicKey` and `PrivateKey` accept either:
- A full PEM string (with `-----BEGIN ...-----` headers), or
- A raw base64-encoded DER value (without headers).

If your private key is passphrase-protected:

```php
$certificate = new Certificate(
    publicKey: new PublicKey(file_get_contents('/path/to/saml.crt')),
    privateKey: new PrivateKey(file_get_contents('/path/to/saml.pem'), passphrase: 'secret'),
);
```

Pass the `Certificate` as the `signing` or `encryption` property when building your `Sp` or `Idp` descriptor. See [Sign message](sign-message) and [Encrypt assertion](encrypt-assertion).

## Inspecting a certificate

```shell
openssl x509 -in saml.crt -text -noout
```

Key fields to check:

**Digest algorithm** (should be SHA-256):
```
Signature Algorithm: sha256WithRSAEncryption
```

**Issuer:**
```
Issuer: C=AU, ST=Some-State, O=Example Corp, CN=my-app.example.com
```

**Validity dates:**
```
Validity
    Not Before: Jan  1 00:00:00 2025 GMT
    Not After : Jan  1 00:00:00 2026 GMT
```
