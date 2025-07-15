# Markdown-LD Specification

Markdown-LD is a syntax for defining RDF linked data in Markdown, used by the [Semantic Weaver](https://github.com/mediaprophet/obsidian-semantic-weaver) Obsidian plugin.

## Syntax

### Namespaces
- Format: `[prefix]: URI`
- Declared at the top of the file.
- Example:
  ```
  [schema]: http://schema.org
  [rdfs]: http://www.w3.org/2000/01/rdf-schema#
  ```

### Entities
- Format: `[Entity]{typeof=type property=value}`
- Attributes are space-separated key-value pairs.
- Example:
  ```
  [Person]{typeof=rdfs:Class rdfs:label="Person"}
  [name]{typeof=rdfs:Property schema:domainIncludes=[Person]; schema:rangeIncludes=[schema:Text]; rdfs:label="Name"}
  ```

### Rules
- Namespaces must be defined before entities.
- Entity IDs are enclosed in square brackets (e.g., `[Person]`).
- Attributes are in curly braces, with `typeof` specifying the RDF type.
- Properties use namespace prefixes (e.g., `rdfs:label`) or full URIs.
- Values are either URIs (in square brackets) or literals (in quotes for strings).

## Example

Input (`ontology.md`):
```
[schema]: http://schema.org
[rdfs]: http://www.w3.org/2000/01/rdf-schema#
[Person]{typeof=rdfs:Class rdfs:label="Person"}
[name]{typeof=rdfs:Property schema:domainIncludes=[Person]; schema:rangeIncludes=[schema:Text]; rdfs:label="Name"}
```

Output (JSON-LD):
```json
{
  "@context": {
    "schema": "http://schema.org",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#"
  },
  "@graph": [
    {
      "@id": "http://example.org/Person",
      "@type": "rdfs:Class",
      "rdfs:label": "Person"
    },
    {
      "@id": "http://example.org/name",
      "@type": "rdfs:Property",
      "schema:domainIncludes": "http://example.org/Person",
      "schema:rangeIncludes": "http://schema.org/Text",
      "rdfs:label": "Name"
    }
  ]
}
```

## Implementation

The `@mediaprophet/markdown-ld` package uses `unified` and `remark-parse` to parse Markdown-LD into a JSON-LD `@graph`. See `README.md` for usage.