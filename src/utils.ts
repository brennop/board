export const GRID_SIZE = 16;

export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

export const snapPositionToGrid = (x: number, y: number): { x: number; y: number } => {
  return {
    x: snapToGrid(x),
    y: snapToGrid(y)
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const renderMarkdown = async (content: string): Promise<string> => {
  const { unified } = await import('unified');
  const { default: remarkParse } = await import('remark-parse');
  const { default: remarkGfm } = await import('remark-gfm');
  const { default: remarkRehype } = await import('remark-rehype');
  const { default: rehypeStringify } = await import('rehype-stringify');
  const { default: rehypeSanitize } = await import('rehype-sanitize');

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify);

  const result = await processor.process(content);
  return String(result);
};
