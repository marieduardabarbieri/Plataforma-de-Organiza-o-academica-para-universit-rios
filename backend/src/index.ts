// src/index.ts
import "dotenv/config";

import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { fromNodeHeaders } from "better-auth/node";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";

import { PriorityLevel } from "./generated/prisma/enums.js";
import { auth } from "./lib/auth.js";
import { CreateTask } from "./usecases/CreateTask.js";

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
      {
        title: "Auth API",
        slug: "auth-api",
        url: "/api/auth/open-api/generate-schema",
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

app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);

      const headers = fromNodeHeaders(request.headers);

      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });

      const response = await auth.handler(req);

      reply.status(response.status);

      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });

      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      app.log.error(error);

      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
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

app.withTypeProvider<ZodTypeProvider>().route({
  method: "POST",
  url: "/tasks",
  schema: {
    body: z.object({
      title: z.string().trim().min(1, "Título é obrigatório"),
      description: z.string().optional(),
      dueDate: z.string().datetime().optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
      subjectId: z.string().optional(),
    }),

    response: {
      201: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        completed: z.boolean(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
      }),

      400: z.object({
        error: z.string(),
        code: z.string(),
      }),

      401: z.object({
        error: z.string(),
        code: z.string(),
      }),

      500: z.object({
        error: z.string(),
        code: z.string(),
      }),
    },
  },

  handler: async (request, reply) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session) {
        return reply.status(401).send({
          error: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const createTask = new CreateTask();

      const result = await createTask.execute({
        userId: session.user.id,
        title: request.body.title,
        description: request.body.description,
        dueDate: request.body.dueDate
          ? new Date(request.body.dueDate)
          : undefined,
        priority: request.body.priority as PriorityLevel,
        subjectId: request.body.subjectId,
      });

      return reply.status(201).send(result);
    } catch (error) {
      app.log.error(error);

      return reply.status(500).send({
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
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
