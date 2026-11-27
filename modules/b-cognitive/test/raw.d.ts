/** Lets tests import a file's text with `import x from './file.html?raw'` (supported by Vitest/Vite). */
declare module '*?raw' {
  const content: string;
  export default content;
}
