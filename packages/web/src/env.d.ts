/// <reference types="astro/client" />

declare module '*.module.css' {
  const styles: Record<string, string>
  export default styles
}
