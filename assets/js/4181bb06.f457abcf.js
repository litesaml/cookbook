"use strict";(self.webpackChunklitesaml_docs=self.webpackChunklitesaml_docs||[]).push([[492],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>h});var s=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,s)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,s,a=function(e,t){if(null==e)return{};var n,s,a={},o=Object.keys(e);for(s=0;s<o.length;s++)n=o[s],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(s=0;s<o.length;s++)n=o[s],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=s.createContext({}),m=function(e){var t=s.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},u=function(e){var t=m(e.components);return s.createElement(l.Provider,{value:t},e.children)},c="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return s.createElement(s.Fragment,{},t)}},d=s.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),c=m(n),d=a,h=c["".concat(l,".").concat(d)]||c[d]||p[d]||o;return n?s.createElement(h,r(r({ref:t},u),{},{components:n})):s.createElement(h,r({ref:t},u))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,r=new Array(o);r[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[c]="string"==typeof e?e:a,r[1]=i;for(var m=2;m<o;m++)r[m]=n[m];return s.createElement.apply(null,r)}return s.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9980:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>r,default:()=>c,frontMatter:()=>o,metadata:()=>i,toc:()=>m});var s=n(7462),a=(n(7294),n(3905));const o={title:"Make Response",sidebar_position:2},r=void 0,i={unversionedId:"make-message/response",id:"make-message/response",title:"Make Response",description:"Response is a SAML message that IDP sends to SP with security assertions and other bearer information, as a response",source:"@site/docs/make-message/response.md",sourceDirName:"make-message",slug:"/make-message/response",permalink:"/cookbook/docs/make-message/response",draft:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Make Response",sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Make AuthnRequest",permalink:"/cookbook/docs/make-message/authn-request"},next:{title:"Make LogoutRequest",permalink:"/cookbook/docs/make-message/logout-request"}},l={},m=[],u={toc:m};function c(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,s.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Response is a SAML message that IDP sends to SP with security assertions and other bearer information, as a response\nto the AuthnRequest in case of SP initiated SSO, or ad hoc in case on IDP initiated SSO. If response is successful\nit will have success status and contain assertions, but in case of unsuccessful response, it's status will\nindicate the reason and will not contain any assertion."),(0,a.kt)("p",null,"Most important elements of a Response are:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"status"),(0,a.kt)("li",{parentName:"ul"},"issuer"),(0,a.kt)("li",{parentName:"ul"},"assertion")),(0,a.kt)("p",null,"Building of a Response can be done like this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-php"},"<?php\n// examples/how_to_make_response.php\n\n$response = new \\LightSaml\\Model\\Protocol\\Response();\n$response\n    ->addAssertion($assertion = new \\LightSaml\\Model\\Assertion\\Assertion())\n    ->setStatus(new \\LightSaml\\Model\\Protocol\\Status(\n        new \\LightSaml\\Model\\Protocol\\StatusCode(\n            \\LightSaml\\SamlConstants::STATUS_SUCCESS)\n        )\n    )\n    ->setID(\\LightSaml\\Helper::generateID())\n    ->setIssueInstant(new \\DateTime())\n    ->setDestination('https://sp.com/acs')\n    ->setIssuer(new \\LightSaml\\Model\\Assertion\\Issuer('https://idp.com'))\n;\n\n$assertion\n    ->setId(\\LightSaml\\Helper::generateID())\n    ->setIssueInstant(new \\DateTime())\n    ->setIssuer(new \\LightSaml\\Model\\Assertion\\Issuer('https://idp.com'))\n    ->setSubject(\n        (new \\LightSaml\\Model\\Assertion\\Subject())\n            ->setNameID(new \\LightSaml\\Model\\Assertion\\NameID(\n                'email.domain.com',\n                \\LightSaml\\SamlConstants::NAME_ID_FORMAT_EMAIL\n            ))\n            ->addSubjectConfirmation(\n                (new \\LightSaml\\Model\\Assertion\\SubjectConfirmation())\n                    ->setMethod(\\LightSaml\\SamlConstants::CONFIRMATION_METHOD_BEARER)\n                    ->setSubjectConfirmationData(\n                        (new \\LightSaml\\Model\\Assertion\\SubjectConfirmationData())\n                            ->setInResponseTo('id_of_the_authn_request')\n                            ->setNotOnOrAfter(new \\DateTime('+1 MINUTE'))\n                            ->setRecipient('https://sp.com/acs')\n                    )\n            )\n    )\n    ->setConditions(\n        (new \\LightSaml\\Model\\Assertion\\Conditions())\n            ->setNotBefore(new \\DateTime())\n            ->setNotOnOrAfter(new \\DateTime('+1 MINUTE'))\n            ->addItem(\n                new \\LightSaml\\Model\\Assertion\\AudienceRestriction(['https://sp.com/acs'])\n            )\n    )\n    ->addItem(\n        (new \\LightSaml\\Model\\Assertion\\AttributeStatement())\n            ->addAttribute(new \\LightSaml\\Model\\Assertion\\Attribute(\n                \\LightSaml\\ClaimTypes::EMAIL_ADDRESS,\n                'email@domain.com'\n            ))\n            ->addAttribute(new \\LightSaml\\Model\\Assertion\\Attribute(\n                \\LightSaml\\ClaimTypes::COMMON_NAME,\n                'x123'\n            ))\n    )\n    ->addItem(\n        (new \\LightSaml\\Model\\Assertion\\AuthnStatement())\n            ->setAuthnInstant(new \\DateTime('-10 MINUTE'))\n            ->setSessionIndex('_some_session_index')\n            ->setAuthnContext(\n                (new \\LightSaml\\Model\\Assertion\\AuthnContext())\n                    ->setAuthnContextClassRef(\\LightSaml\\SamlConstants::AUTHN_CONTEXT_PASSWORD_PROTECTED_TRANSPORT)\n            )\n    )\n;\n")),(0,a.kt)("p",null,"Serialization of such AuthnRequest would produce XML similar to one below."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-xml"},'<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="_8a3904146809db7b19d4eaaba9876baed805c216e5"\n        Version="2.0" IssueInstant="2015-10-18T20:02:55Z" Destination="https://sp.com/acs">\n    <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">https://idp.com</saml:Issuer>\n    <samlp:Status>\n        <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>\n    </samlp:Status>\n    <Assertion xmlns="urn:oasis:names:tc:SAML:2.0:assertion" ID="_4a9400f18f507a46339c622929c6795c6195bd2b1d"\n            Version="2.0" IssueInstant="2015-10-18T20:02:55Z">\n        <Issuer>https://idp.com</Issuer>\n        <Subject>\n            <NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">email.domain.com</NameID>\n            <SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">\n                <SubjectConfirmationData InResponseTo="id_of_the_authn_request"\n                    NotOnOrAfter="2015-10-18T20:03:55Z" Recipient="https://sp.com/acs"/>\n            </SubjectConfirmation>\n        </Subject>\n        <Conditions NotBefore="2015-10-18T20:02:55Z" NotOnOrAfter="2015-10-18T20:03:55Z">\n            <AudienceRestriction>\n                <Audience>https://sp.com/acs</Audience>\n            </AudienceRestriction>\n        </Conditions>\n        <AttributeStatement>\n            <Attribute Name="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress">\n                <AttributeValue>email@domain.com</AttributeValue>\n            </Attribute>\n            <Attribute Name="http://schemas.xmlsoap.org/claims/CommonName">\n                <AttributeValue>x123</AttributeValue>\n            </Attribute>\n        </AttributeStatement>\n        <AuthnStatement AuthnInstant="2015-10-18T19:52:55Z" SessionIndex="_some_session_index">\n            <AuthnContext>\n                <AuthnContextClassRef>\n                    urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport\n                </AuthnContextClassRef>\n            </AuthnContext>\n        </AuthnStatement>\n    </Assertion>\n</samlp:Response>\n')))}c.isMDXComponent=!0}}]);