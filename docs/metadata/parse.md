---
sidebar_position: 3
title: Parse metadata
---

`MetadataParser::parse()` parses any SAML metadata XML and returns an `Entity` (either `Idp` or `Sp`) or an `EntityList` when the document is a federation `EntitiesDescriptor`.

```php
use Litesaml\Support\MetadataParser;

$xml = file_get_contents('https://idp.example.com/saml/metadata');
$result = MetadataParser::parse($xml);
```

## Single entity

When the XML contains a single `<EntityDescriptor>`, `parse()` returns an `Idp` or `Sp` depending on the descriptor type found inside.

```php
use Litesaml\Models\Descriptors\Idp;
use Litesaml\Models\Descriptors\Sp;
use Litesaml\Support\MetadataParser;

$entity = MetadataParser::parse($xml);

if ($entity instanceof Idp) {
    // Use as IdP descriptor
    $spWrapper->sendAuthnRequest($entity);
}

if ($entity instanceof Sp) {
    // Use as SP descriptor
    $idpWrapper->sendAuthnResponse($entity, $attributes);
}
```

### What is extracted

**For an IdP entity:**

| `Idp` property | Source in XML |
|---|---|
| `entityId` | `<EntityDescriptor entityID="...">` |
| `sso` | First `<SingleSignOnService>` in `<IDPSSODescriptor>` |
| `slo` | First `<SingleLogoutService>` in `<IDPSSODescriptor>` |
| `signing` | First `<KeyDescriptor use="signing">` certificate |

**For an SP entity:**

| `Sp` property | Source in XML |
|---|---|
| `entityId` | `<EntityDescriptor entityID="...">` |
| `acs` | First `<AssertionConsumerService>` in `<SPSSODescriptor>` |
| `slo` | First `<SingleLogoutService>` in `<SPSSODescriptor>` |
| `signing` | First `<KeyDescriptor use="signing">` certificate |
| `encryption` | First `<KeyDescriptor use="encryption">` certificate |

## Federation metadata (EntitiesDescriptor)

When the XML root is `<EntitiesDescriptor>` (a federation metadata document), `parse()` returns an `EntityList`:

```php
use Litesaml\Models\Descriptors\EntityList;
use Litesaml\Models\Descriptors\Idp;
use Litesaml\Support\MetadataParser;

$result = MetadataParser::parse($federationXml);

if ($result instanceof EntityList) {
    foreach ($result->entities as $entity) {
        if ($entity instanceof Idp) {
            // Register this IdP
        }
    }
}
```

`EntityList::$entities` is an `Entity[]` array that can contain a mix of `Idp` and `Sp` objects.

## Error handling

`MetadataParser::parse()` throws a `SamlException` when:

- An `<EntityDescriptor>` contains neither an `<IDPSSODescriptor>` nor an `<SPSSODescriptor>`
- A required endpoint (SSO, SLO, or ACS) is missing a location or binding

```php
use Litesaml\Exceptions\SamlException;
use Litesaml\Support\MetadataParser;

try {
    $entity = MetadataParser::parse($xml);
} catch (SamlException $e) {
    // Invalid or incomplete metadata
}
```

## Caching

Metadata documents change rarely. Cache the parsed result or the raw XML and re-parse only when needed.
