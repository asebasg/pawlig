/**
 * Declaración de tipos para módulos CSS
 * Permite a TypeScript reconocer importaciones de archivos .css
 */

declare module '*.css' {
  const content: {};
  export default content;
}

declare module '*.scss' {
  const content: {};
  export default content;
}

declare module '*.sass' {
  const content: {};
  export default content;
}
