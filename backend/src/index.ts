// src/index.ts
import "dotenv/config";

import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fromNodeHeaders } from "better-auth/node";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";

import { auth } from "./lib/auth.js";

const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Academic Organizer API",
      description:
        "API para gerenciamento de tarefas, disciplinas e rotina acadêmica",
      version: "1.0.0",
    },
    servers: [
      {
        description: "Local development server",
        url: "http://localhost:8080",
      },
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifyCors, {
  origin: ["http://localhost:3000"],
  credentials: true,
});

await app.register(ScalarApiReference, {
  routePrefix: "/docs",
  configuration: {
    theme: "elysiajs",
    sources: [
      {
        title: "Academic Organizer API",
        slug: "academic-ai-api",
        url: "/swagger.json",
      },
    ],
  },
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/swagger.json",
  schema: {
    hide: true,
  },
  handler: async () => {
    return app.swagger();
  },
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/",
  schema: {
    description: "Hello World",
    tags: ["Hello World"],
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  handler: () => {
    return {
      message: "Hello World",
    };
  },
});

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
