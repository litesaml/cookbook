---
sidebar_position: 2
title: Generate metadata
---

Both `ServiceProviderWrapper` and `IdentityProviderWrapper` can generate an XML metadata document for their respective entity. Share this metadata with the other party so they can configure the trust relationship.

## SP metadata

```php
$xml = $spWrapper->generateMetadata();
```

The generated document includes:

- The SP's `entityID`
- The Assertion Consumer Service (ACS) endpoint with its binding
- The Single Logout Service (SLO) endpoint with its binding
- The signing certificate (`USE_SIGNING`), if `$sp->signing` is configured
- The encryption certificate (`USE_ENCRYPTION`), if `$sp->encryption` is configured

**Example output:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     entityID="https://my-app.example.com">
  <md:SPSSODescriptor>
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIID...</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                            Location="https://my-app.example.com/saml/slo"/>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                                 Location="https://my-app.example.com/saml/acs"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>
```

## IdP metadata

```php
$xml = $idpWrapper->generateMetadata();
```

The generated document includes:

- The IdP's `entityID`
- The Single Sign-On (SSO) endpoint with its binding
- The Single Logout Service (SLO) endpoint with its binding
- The signing certificate (`USE_SIGNING`), if `$idp->signing` is configured

**Example output:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     entityID="https://my-idp.example.com">
  <md:IDPSSODescriptor>
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIID...</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                            Location="https://my-idp.example.com/saml/slo"/>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                            Location="https://my-idp.example.com/saml/sso"/>
  </md:IDPSSODescriptor>
</md:EntityDescriptor>
```

## Serving metadata over HTTP

A common pattern is to expose the metadata at a well-known URL:

```php
// Route: GET /saml/metadata
$xml = $spWrapper->generateMetadata();

$response = $responseFactory->createResponse(200)
    ->withHeader('Content-Type', 'application/xml')
    ->withBody($streamFactory->createStream($xml));
```
