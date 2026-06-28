---
sidebar_position: 1
title: Overview
---

SAML metadata is an XML document that describes a SAML entity (SP or IdP). It declares the entity's identifier, its endpoints (SSO, SLO, ACS), and the certificates used for signing and encryption.

Both `ServiceProviderWrapper` and `IdentityProviderWrapper` can generate their own metadata. `ServiceProviderWrapper` can also parse an IdP's metadata XML to build an `Idp` descriptor.

## Pages

- [Generate metadata](./generate.md) — export your SP or IdP metadata as XML
- [Parse metadata](./parse.md) — build an `Idp` descriptor from an IdP's XML metadata
