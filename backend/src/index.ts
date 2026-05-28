// src/index.ts
import "dotenv/config";

import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/", async function handler() {
  return { hello: "world" };
});

try {
  await app.listen({
    port: Number(process.env.PORT),
  });

  console.log(`Server is running on port ${process.env.PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
