import { JsonData } from "./types.ts";

export type Body = JsonData | FormData | string;
export interface GraphApiRequest<R extends Body = Body> {
  method?: "GET" | "POST";
  id?: string;
  endpoint?: string;
  body?: R;
}
