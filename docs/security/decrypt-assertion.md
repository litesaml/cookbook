---
title: Decrypt Assertion
sidebar_position: 5
---

To decrypt a SAML Assertion from the Response with encrypted Assertion you would need your key pair the Assertion
was encrypted for. The sender encrypted the SAML Assertion having your public key which you gave to them
through certificate in your metadata XML.

First you deserialize the XML into the Response data model object. Then you create a Credential with your
key pair. Finally, you decrypt the SAML Assertion with that credential and get the decrypted Assertion.

```php
<?php
$xml = '<samlp:Response><saml:EncryptedAssertion>...</saml:EncryptedAssertion></samlp:Response>';

// deserialize XML into a Response data model object
$deserializationContext = new \LightSaml\Model\Context\DeserializationContext();
$deserializationContext->getDocument()->loadXML($xml);
$response = new \LightSaml\Model\Protocol\Response();
$response->deserialize(
    $deserializationContext->getDocument()->firstChild,
    $deserializationContext
);

// load you key par credential
$credential = new \LightSaml\Credential\X509Credential(
    \LightSaml\Credential\X509Certificate::fromFile('my.crt'),
    \LightSaml\Credential\KeyHelper::createPrivateKey('my.key', '', true)
);

// decrypt the Assertion with your credential
$decryptDeserializeContext = new \LightSaml\Model\Context\DeserializationContext();
/** @var \LightSaml\Model\Assertion\EncryptedAssertionReader $reader */
$reader = $response->getFirstEncryptedAssertion();
$assertion = $reader->decryptMultiAssertion([$credential], $decryptDeserializeContext);

// use decrypted assertion
foreach ($assertion->getFirstAttributeStatement()->getAllAttributes() as $attribute) {
    print sprintf("%s: %s\n", $attribute->getName(), $attribute->getFirstAttributeValue());
}
```
