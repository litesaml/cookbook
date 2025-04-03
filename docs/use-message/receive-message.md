---
title: Receive Message
sidebar_position: 2
---

Receiving a SAML message from the HTTP request with the SAML HTTP POST or Redirect binding, in Light Saml is done with the Binding set
of classes. The ``BindingFactory`` can detect the binding type for the given HTTP request and instantiate corresponding Binding class,
``HttpPostBinding`` or ``HttpRedirectBinding``, capable of receiving the SAML message (AuthnRequest, Response...).

First you create Symfony's HttpFoundation Request, instantiate ``BindingFactory`` with that request and get the actual binding,
and finally call the binding ``receive()`` method, that will return deserialized SAML document from the HTTP Request.

```php
<?php
$request = \Symfony\Component\HttpFoundation\Request::createFromGlobals();

$bindingFactory = new \LightSaml\Binding\BindingFactory();
$binding = $bindingFactory->getBindingByRequest($request);

$messageContext = new \LightSaml\Context\Profile\MessageContext();
/** @var \LightSaml\Model\Protocol\Response $response */
$binding->receive($request, $messageContext);

/**
 * Traverse through all the response objects and display them
 * to the screen.
 */
foreach ($messageContext->asResponse()->getAllAssertions() as $assertion) {
    foreach ($assertion->getAllAttributeStatements() as $attributeStatement) {
        foreach ($attributeStatement->getAllAttributes() as $attribute) {
            print '<pre>';print_r($attribute);print '</pre>';
        }
    }
}
```

Receiving of other SAML documents/messages, like Response is done in the same way. Return value of the ``Binding::receive()`` depends
on the actual message being sent, and so far AuthnRequest, Response, LogoutResponse, and LogoutRequest are supported and implemented.

