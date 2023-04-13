---
title: Build EntityDescriptor
sidebar_position: 1
---

Entity Descriptor is a document that describes features of a SAML entity. It's a way through which a party reveals
its own ID (entityID), roles (SP and IDP features), exact locations it communicates through, its certificate
which other parties use to verify its message signatures and for encryption, as well as some other details.

The most important elements of an SP EntityDescriptor are:

* entityID
* certificate
* Assertion Consumer Service

The most important elements of an IDP EntityDescriptor are:

* entityID
* certificate
* Single SignOn Service

Building of an SP Entity Descriptor might look like this

```php
<?php

$entityDescriptor = new \LightSaml\Model\Metadata\EntityDescriptor();
$entityDescriptor
    ->setID(\LightSaml\Helper::generateID())
    ->setEntityID('http://some.entity.id')
;

$entityDescriptor->addItem(
    $spSsoDescriptor = (new \LightSaml\Model\Metadata\SpSsoDescriptor())
        ->setWantAssertionsSigned(true)
);

$spSsoDescriptor->addKeyDescriptor(
    $keyDescriptor = (new \LightSaml\Model\Metadata\KeyDescriptor())
        ->setUse(\LightSaml\Model\Metadata\KeyDescriptor::USE_SIGNING)
        ->setCertificate(\LightSaml\Credential\X509Certificate::fromFile('/path/to/file.crt'))
);

$spSsoDescriptor->addAssertionConsumerService(
    $acs = (new \LightSaml\Model\Metadata\AssertionConsumerService())
        ->setBinding(\LightSaml\SamlConstants::BINDING_SAML2_HTTP_POST)
        ->setLocation('https://my.site/saml/acs')
);
```

Serialization of such Entity Descriptor would produce XML similar to one below.

```xml
<EntityDescriptor ID="_2240bd9c-30c4-4d2a-ab3e-87a94ea334fd" entityID="http://some.entity.id"
        xmlns="urn:oasis:names:tc:SAML:2.0:metadata">
    <SPSSODescriptor WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <KeyDescriptor use="signing">
            <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
                <X509Data>
                    <X509Certificate>
                        MIIC0jCCAbqgAw.......
                    </X509Certificate>
                </X509Data>
            </KeyInfo>
        </KeyDescriptor>
        <AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                Location="https://my.site/saml/acs"/>
    </SPSSODescriptor>
</EntityDescriptor>
```

## Simple Entity Descriptor Builder

Light Saml implements a ``SimpleEntityDescriptorBuilder`` class which can simply make an EntityDescriptor,
both SP and IDP, based on few given arguments:

* entityID
* Assertion Consumer Service location
* Single SignOn location
* certificate

An EntityDescriptor built above, now using ``SimpleEntityDescriptorBuilder``, can be made with fewer lines
of code in the following way:

```php
<?php
$entityDescriptorBuilder = new \LightSaml\Builder\EntityDescriptor\SimpleEntityDescriptorBuilder(
    'http://some.entity.id',
    'https://my.site/saml/acs',
    \LightSaml\Credential\X509Certificate::fromFile('/path/to/file.crt')
);
$entityDescriptor = $entityDescriptorBuilder->get();
```

You can build your own EntityDescriptor builders by implementing the ``EntityDescriptorProviderInterface`` interface.
