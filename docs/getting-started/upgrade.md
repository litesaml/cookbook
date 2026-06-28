---
sidebar_position: 4
title: Upgrade from lightsaml
---

`litesaml/saml` is a high-level rewrite of `litesaml/lightsaml`. The API is not backwards-compatible — this guide covers every breaking change and shows before/after examples for the most common patterns.

## What changed

| Area | lightsaml | saml |
|---|---|---|
| Package | `litesaml/lightsaml` | `litesaml/saml` |
| Namespace | `\LightSaml\*` | `\Litesaml\*` |
| PHP | ^7.4 | ^8.4 |
| API style | Low-level XML builders | High-level PSR-7 wrappers |
| Bindings | String constants (`SamlConstants::*`) | `BindingType` enum |
| Certificates | `X509Certificate::fromFile()` | `Certificate(PublicKey, PrivateKey)` |
| IDs / timestamps | Caller-managed (`Helper::generateID()`) | Managed internally |
| Output | Serialized XML string | PSR-7 `ResponseInterface` |

## 1. Package and namespace

```bash
composer remove litesaml/lightsaml
composer require litesaml/saml
```

Update all namespace imports from `\LightSaml\` to `\Litesaml\`.

## 2. PHP version

`litesaml/saml` requires PHP 8.4. Update your `composer.json` `require` constraint if needed.

## 3. No more manual message construction

The old API required you to build every SAML object by hand. The new API provides two wrappers — `ServiceProviderWrapper` and `IdentityProviderWrapper` — that handle message construction, binding encoding, and optional signing for you.

### Sending an AuthnRequest (SP)

**Before**

```php
use LightSaml\Model\Protocol\AuthnRequest;
use LightSaml\Model\Assertion\Issuer;
use LightSaml\SamlConstants;
use LightSaml\Helper;

$authnRequest = new AuthnRequest();
$authnRequest
    ->setAssertionConsumerServiceURL('https://my.site/saml/acs')
    ->setProtocolBinding(SamlConstants::BINDING_SAML2_HTTP_POST)
    ->setID(Helper::generateID())
    ->setIssueInstant(new \DateTime())
    ->setDestination('https://idp.com/sso')
    ->setIssuer(new Issuer('https://my.site'));

// Serialize and redirect manually...
```

**After**

```php
use Litesaml\ServiceProviderWrapper;
use Litesaml\Support\MessageHandler;
use Litesaml\Models\Descriptors\{Sp, Idp, Endpoint, Certificate, PublicKey, PrivateKey};
use Litesaml\Enums\BindingType;
use Nyholm\Psr7\Factory\Psr17Factory;

$factory = new Psr17Factory();
$handler = new MessageHandler($factory, $factory);

$sp = new Sp(
    entityId: 'https://my.site',
    acs: new Endpoint('https://my.site/saml/acs', BindingType::POST),
    slo: new Endpoint('https://my.site/saml/slo', BindingType::REDIRECT),
);

$idp = new Idp(
    entityId: 'https://idp.com',
    sso: new Endpoint('https://idp.com/sso', BindingType::REDIRECT),
    slo: new Endpoint('https://idp.com/slo', BindingType::REDIRECT),
    signing: new Certificate(publicKey: new PublicKey(file_get_contents('/path/to/idp-cert.pem'))),
);

$spWrapper = new ServiceProviderWrapper($sp, $handler);

// Returns a PSR-7 ResponseInterface (redirect or POST form)
$response = $spWrapper->sendAuthnRequest($idp);
```

### Sending an AuthnResponse (IdP)

**Before**

```php
use LightSaml\Model\Protocol\Response;
use LightSaml\Model\Assertion\{Assertion, Issuer, Subject, NameID, Conditions, AttributeStatement, Attribute, AuthnStatement, AuthnContext};
use LightSaml\Model\Protocol\{Status, StatusCode};
use LightSaml\SamlConstants;
use LightSaml\Helper;

$response = new Response();
$response
    ->addAssertion($assertion = new Assertion())
    ->setStatus(new Status(new StatusCode(SamlConstants::STATUS_SUCCESS)))
    ->setID(Helper::generateID())
    ->setIssueInstant(new \DateTime())
    ->setDestination('https://sp.com/acs')
    ->setIssuer(new Issuer('https://idp.com'));

$assertion
    ->setId(Helper::generateID())
    ->setIssueInstant(new \DateTime())
    ->setIssuer(new Issuer('https://idp.com'))
    ->setSubject(
        (new Subject())
            ->setNameID(new NameID('user@example.com', SamlConstants::NAME_ID_FORMAT_EMAIL))
            // ...SubjectConfirmation, conditions, etc.
    )
    ->addItem(
        (new AttributeStatement())
            ->addAttribute(new Attribute(\LightSaml\ClaimTypes::EMAIL_ADDRESS, 'user@example.com'))
    );

// Serialize and POST manually...
```

**After**

```php
use Litesaml\IdentityProviderWrapper;
use Litesaml\Models\Messages\Attribute;

$idpWrapper = new IdentityProviderWrapper($idp, $handler);

// Returns a PSR-7 ResponseInterface (auto-submit POST form to the SP's ACS)
$response = $idpWrapper->sendAuthnResponse($sp, [
    new Attribute('email', ['user@example.com']),
    new Attribute('displayName', ['Jane Doe']),
]);
```

## 4. Certificates

**Before**

```php
use LightSaml\Credential\X509Certificate;

$cert = X509Certificate::fromFile('/path/to/cert.crt');
```

**After**

```php
use Litesaml\Models\Descriptors\{Certificate, PublicKey, PrivateKey};

// Public key only (for verifying inbound signatures)
$cert = new Certificate(publicKey: new PublicKey(file_get_contents('/path/to/cert.pem')));

// With private key (for signing outbound messages)
$cert = new Certificate(
    publicKey: new PublicKey(file_get_contents('/path/to/cert.pem')),
    privateKey: new PrivateKey(file_get_contents('/path/to/key.pem')),
);
```

`PublicKey` and `PrivateKey` accept either a full PEM string or a raw base64-encoded DER value.

Signing is **automatic**: attach a `Certificate` with a `PrivateKey` to your `Sp` or `Idp` descriptor and all outgoing messages are signed without any additional calls.

## 5. Bindings

**Before**

```php
use LightSaml\SamlConstants;

SamlConstants::BINDING_SAML2_HTTP_POST
SamlConstants::BINDING_SAML2_HTTP_REDIRECT
```

**After**

```php
use Litesaml\Enums\BindingType;

BindingType::POST
BindingType::REDIRECT
```

## 6. Metadata

Building and parsing metadata is now handled by dedicated classes. See [Generate metadata](../metadata/generate) and [Parse metadata](../metadata/parse) for full examples.

**Before**

```php
use LightSaml\Model\Metadata\{EntityDescriptor, SpSsoDescriptor, KeyDescriptor, AssertionConsumerService};
use LightSaml\Credential\X509Certificate;
use LightSaml\SamlConstants;

$entityDescriptor = new EntityDescriptor();
$entityDescriptor
    ->setID(\LightSaml\Helper::generateID())
    ->setEntityID('https://my.site');

$spSsoDescriptor = (new SpSsoDescriptor())->setWantAssertionsSigned(true);
$entityDescriptor->addItem($spSsoDescriptor);

$spSsoDescriptor->addKeyDescriptor(
    (new KeyDescriptor())
        ->setUse(KeyDescriptor::USE_SIGNING)
        ->setCertificate(X509Certificate::fromFile('/path/to/cert.crt'))
);

$spSsoDescriptor->addAssertionConsumerService(
    (new AssertionConsumerService())
        ->setBinding(SamlConstants::BINDING_SAML2_HTTP_POST)
        ->setLocation('https://my.site/saml/acs')
);
```

**After**

```php
use Litesaml\ServiceProviderWrapper;
use Litesaml\Support\MessageHandler;
use Litesaml\Models\Descriptors\{Sp, Endpoint, Certificate, PublicKey, PrivateKey};
use Litesaml\Enums\BindingType;
use Nyholm\Psr7\Factory\Psr17Factory;

$factory = new Psr17Factory();
$handler = new MessageHandler($factory, $factory);

$sp = new Sp(
    entityId: 'https://my.site',
    acs: new Endpoint('https://my.site/saml/acs', BindingType::POST),
    slo: new Endpoint('https://my.site/saml/slo', BindingType::REDIRECT),
    signing: new Certificate(
        publicKey: new PublicKey(file_get_contents('/path/to/cert.pem')),
        privateKey: new PrivateKey(file_get_contents('/path/to/key.pem')),
    ),
);

$spWrapper = new ServiceProviderWrapper($sp, $handler);
$xml = $spWrapper->generateMetadata();
```
