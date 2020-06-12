import remark from 'remark';

export type Node = any;

export const parseMarkdown = (markdown: string): Node[] => {
  const lexer = remark();
  const nodes = lexer.parse(markdown).children;

  return nodes;
};
