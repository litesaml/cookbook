---
sidebar_position: 1
title: Overview
---

Single Logout (SLO) allows either the SP or the IdP to terminate all active sessions across the federation. The flow consists of a logout request followed by a logout response.

Either party can initiate the logout. The other party receives the request, terminates its session, and replies with a response.

## Pages

- [Logout request](./logout-request.md) — send or receive a `LogoutRequest`
- [Logout response](./logout-response.md) — send or receive a `LogoutResponse`
