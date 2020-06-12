import remark from 'remark';

export type Node = any;

export interface ParsedIssue {
  sections: Section[];
}

export interface Section {
  title: string;
  nodes: Node[];
}

export const parseMarkdownIntoSections = (markdown: string): ParsedIssue => {
  const nodes = parseMarkdown(markdown);
  const sections: Section[] = [];

  for (const node of nodes) {
    if (node.type === 'heading') {
      sections.push({
        title: node.children[0].value,
        nodes: getSectionNodes(node, nodes),
      });
    }
  }

  return { sections };
};

export const findSectionByLooseTitle = (
  sections: Section[],
  title: string,
): Section | undefined => {
  return sections.find(section =>
    section.title.toLowerCase().includes(title.toLowerCase()),
  );
};

export const parseMarkdown = (markdown: string): Node[] => {
  const lexer = remark();
  const nodes = lexer.parse(markdown).children;

  return nodes;
};

const getSectionNodes = (header: Node, nodes: Node[]): Node[] => {
  const section: Node[] = [header];
  const idx = nodes.indexOf(header);

  for (let i = idx + 1; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === 'heading') {
      break;
    }

    section.push(node);
  }

  return section;
};
