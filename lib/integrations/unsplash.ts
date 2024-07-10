import { createApi } from "unsplash-js";

// Create an instance of the Unsplash API
export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
  fetch: fetch,
});
