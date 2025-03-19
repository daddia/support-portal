export default {
  name: 'code',
  title: 'Code',
  type: 'object',
  fields: [
    {
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 10,
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'JSON', value: 'json' },
          { title: 'Bash', value: 'bash' },
          { title: 'Python', value: 'python' },
          { title: 'Java', value: 'java' },
          { title: 'Plain text', value: 'text' },
        ],
      },
    },
    {
      name: 'filename',
      title: 'Filename',
      type: 'string',
    },
    {
      name: 'highlightedLines',
      title: 'Highlighted Lines',
      type: 'string',
      description: 'Comma-separated line numbers to highlight (e.g., "1,3-5,7")',
    },
  ],
  preview: {
    select: {
      language: 'language',
      code: 'code',
      filename: 'filename',
    },
    prepare(selection: any) {
      const { language, code, filename } = selection;
      return {
        title: filename || language || 'Code block',
        subtitle: code ? `${code.substring(0, 30)}...` : '',
      };
    },
  },
}; 