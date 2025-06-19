declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.jpg" {
  const value: string;
  export default value;
}

declare interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // add other VITE_ variables here as needed
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}