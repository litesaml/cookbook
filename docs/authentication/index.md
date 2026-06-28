---
sidebar_position: 1
title: Overview
---

The SAML authentication flow involves two steps:

1. The SP sends an `AuthnRequest` to the IdP.
2. The IdP authenticates the user and sends an `AuthnResponse` back to the SP with user attributes.

## Pages

- [Authentication request](./authn-request.md) — SP sends a request; IdP receives it
- [Authentication response](./authn-response.md) — IdP sends a response with attributes; SP receives and reads it
