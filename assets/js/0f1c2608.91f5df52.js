"use strict";(self.webpackChunklitesaml_docs=self.webpackChunklitesaml_docs||[]).push([[86],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),l=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(c.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},y=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=l(r),y=o,m=d["".concat(c,".").concat(y)]||d[y]||u[y]||i;return r?n.createElement(m,a(a({ref:t},p),{},{components:r})):n.createElement(m,a({ref:t},p))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=y;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[d]="string"==typeof e?e:o,a[1]=s;for(var l=2;l<i;l++)a[l]=r[l];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}y.displayName="MDXCreateElement"},7620:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var n=r(7462),o=(r(7294),r(3905));const i={title:"Decrypt Assertion",sidebar_position:5},a=void 0,s={unversionedId:"security/decrypt-assertion",id:"security/decrypt-assertion",title:"Decrypt Assertion",description:"To decrypt a SAML Assertion from the Response with encrypted Assertion you would need your key pair the Assertion",source:"@site/docs/security/decrypt-assertion.md",sourceDirName:"security",slug:"/security/decrypt-assertion",permalink:"/cookbook/docs/security/decrypt-assertion",draft:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{title:"Decrypt Assertion",sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Encrypt Assertion",permalink:"/cookbook/docs/security/encrypt-assertion"},next:{title:"Contributing",permalink:"/cookbook/docs/contributing"}},c={},l=[],p={toc:l};function d(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"To decrypt a SAML Assertion from the Response with encrypted Assertion you would need your key pair the Assertion\nwas encrypted for. The sender encrypted the SAML Assertion having your public key which you gave to then\ntrough certificate in your metadata XML."),(0,o.kt)("p",null,"First you deserialize the XML into the Response data model object. Then you create a Credential with your\nkey pair. Finally, you decrypt the SAML Assertion with that credential and get the decrypted Assertion."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-php"},"<?php\n$xml = '<samlp:Response><saml:EncryptedAssertion>...</saml:EncryptedAssertion></samlp:Response>';\n\n// deserialize XML into a Response data model object\n$deserializationContext = new \\LightSaml\\Model\\Context\\DeserializationContext();\n$deserializationContext->getDocument()->loadXML($xml);\n$response = new \\LightSaml\\Model\\Protocol\\Response();\n$response->deserialize(\n    $deserializationContext->getDocument()->firstChild,\n    $deserializationContext\n);\n\n// load you key par credential\n$credential = new \\LightSaml\\Credential\\X509Credential(\n    \\LightSaml\\Credential\\X509Certificate::fromFile('my.crt'),\n    \\LightSaml\\Credential\\KeyHelper::createPrivateKey('my.key', '', true)\n);\n\n// decrypt the Assertion with your credential\n$decryptDeserializeContext = new \\LightSaml\\Model\\Context\\DeserializationContext();\n/** @var \\LightSaml\\Model\\Assertion\\EncryptedAssertionReader $reader */\n$reader = $response->getFirstEncryptedAssertion();\n$assertion = $reader->decryptMultiAssertion([$credential], $decryptDeserializeContext);\n\n// use decrypted assertion\nforeach ($assertion->getFirstAttributeStatement()->getAllAttributes() as $attribute) {\n    print sprintf(\"%s: %s\\n\", $attribute->getName(), $attribute->getFirstAttributeValue());\n}\n")))}d.isMDXComponent=!0}}]);