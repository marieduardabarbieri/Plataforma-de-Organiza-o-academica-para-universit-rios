import { defineConfig } from "orval";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log(process.env.NEXT_PUBLIC_API_URL);

export default defineConfig({
  fetch: {
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
      filters: {
        mode: "exclude",
        tags: ["default"],
        paths: ["/api/auth/{*any}"],
      },
    },
    output: {
      target: "./_lib/api/fetch-generated/index.ts",
      client: "fetch",
      prettier: true,
      override: {
        mutator: {
          path: "./_lib/fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});
