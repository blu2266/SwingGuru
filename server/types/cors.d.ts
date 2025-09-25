declare module "cors" {
  import type { RequestHandler } from "express";

  export type CorsOriginCallback = (err: Error | null, allow?: boolean) => void;

  export type CorsOrigin =
    | boolean
    | string
    | RegExp
    | (string | RegExp)[]
    | ((origin: string | undefined, callback: CorsOriginCallback) => void);

  export interface CorsOptions {
    origin?: CorsOrigin;
    credentials?: boolean;
  }

  function cors(options?: CorsOptions): RequestHandler;

  export default cors;
}
