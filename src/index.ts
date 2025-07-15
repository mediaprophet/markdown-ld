import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { ttl2jsonld } from '@frogcat/ttl2jsonld';

interface MarkdownLDNode {
  type: string;
  id: string;
  properties: { [key: string]: string | string[] };
}

export function markdownld(content: string): string {
  // Parse Markdown to AST
  const processor = unified().use(remarkParse);
  const ast = processor.parse(content);

  // Extract namespaces and entities
  const namespaces: { [key: string]: string } = {};
  const nodes: MarkdownLDNode[] = [];
  let currentNode: MarkdownLDNode | null = null;

  // Process AST nodes
  function processNode(node: any) {
    if (node.type === 'paragraph') {
      const text = node.children[0]?.value || '';
      // Handle namespace declarations: [prefix]: URI
      if (text.match(/^\[(\w+)\]:\s*(\S+)/)) {
        const [, prefix, uri] = text.match(/^\[(\w+)\]:\s*(\S+)/) || [];
        namespaces[prefix] = uri;
      }
      // Handle entity definitions: [Entity]{typeof=type property=value}
      else if (text.match(/^\[([^\]]+)\]\{(.+)\}/)) {
        const [, id, attributes] = text.match(/^\[([^\]]+)\]\{(.+)\}/) || [];
        const props: { [key: string]: string } = {};
        attributes.split(/\s+/).forEach((attr: string) => {
          const [key, value] = attr.split('=');
          props[key] = value.replace(/^"|"$/g, '');
        });
        currentNode = { type: props.typeof || 'rdfs:Resource', id, properties: props };
        nodes.push(currentNode);
      }
    }
    if (node.children) {
      node.children.forEach(processNode);
    }
  }

  processNode(ast);

  // Convert to JSON-LD
  const jsonld: any = {
    '@context': namespaces,
    '@graph': nodes.map(node => ({
      '@id': `${namespaces.ex || 'http://example.org/'}${node.id.replace(/\s+/g, '_')}`,
      '@type': node.properties.typeof,
      ...Object.fromEntries(
        Object.entries(node.properties).filter(([key]) => key !== 'typeof')
      )
    }))
  };

  // Convert to JSON-LD string
  return JSON.stringify(jsonld, null, 2);
}

export async function markdownldToTurtle(content: string): Promise<string> {
  const jsonld = markdownld(content);
  return ttl2jsonld(jsonld);
}