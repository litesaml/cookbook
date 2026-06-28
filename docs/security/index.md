---
title: Security
sidebar_position: 1
---

litesaml/saml supports message signing, signature verification, assertion encryption, and assertion decryption. All security features are configured through descriptor classes (`Sp`, `Idp`) and are applied automatically by the wrappers.

- [Generate a key pair](./generate-key-pair.md) — create a certificate and private key with OpenSSL
- [Sign message](./sign-message.md) — automatically sign outgoing messages
- [Verify signature](./verify-signature.md) — validate signatures on incoming messages
- [Encrypt assertion](./encrypt-assertion.md) — send encrypted attributes from the IdP
- [Decrypt assertion](./decrypt-assertion.md) — receive and decrypt assertions on the SP
