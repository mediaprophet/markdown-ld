# @mediaprophet/markdown-ld

A Markdown-LD parser for RDF linked data, designed for the [Semantic Weaver](https://github.com/mediaprophet/obsidian-semantic-weaver) Obsidian plugin. Converts Markdown files with RDF annotations into JSON-LD and Turtle formats.

## Installation

```bash
npm install @mediaprophet/markdown-ld
```

## Usage

### In Node.js

```javascript
import { markdownld, markdownldToTurtle } from '@mediaprophet/markdown-ld';
import fs from 'fs';

const content = fs.readFileSync('ontology.md', 'utf-8');
const jsonld = markdownld(content);
console.log(jsonld);

const turtle = await markdownldToTurtle(content);
console.log(turtle);
```

### Syntax

Markdown-LD files define RDF ontologies using:
- **Namespaces**: `[prefix]: URI` (e.g., `[schema]: http://schema.org`).
- **Entities**: `[Entity]{typeof=type property=value}` (e.g., `[Person]{typeof=rdfs:Class rdfs:label="Person"}`).

Example (`ontology.md`):

```
[schema]: http://schema.org
[rdfs]: http://www.w3.org/2000/01/rdf-schema#
[Person]{typeof=rdfs:Class rdfs:label="Person"}
[name]{typeof=rdfs:Property schema:domainIncludes=[Person]; schema:rangeIncludes=[schema:Text]; rdfs:label="Name"}
```

### Output

The above example produces JSON-LD:

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

## Integration with Semantic Weaver

Used by the Semantic Weaver plugin to parse `templates/ontology/*.md` files into RDF triples for ontology management.

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT