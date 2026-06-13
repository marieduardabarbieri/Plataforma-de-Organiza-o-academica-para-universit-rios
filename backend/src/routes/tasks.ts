import { fromNodeHeaders } from "better-auth/node";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { NotFoundError } from "../errors/index.js";
import { PriorityLevel } from "../generated/prisma/enums.js";
import { auth } from "../lib/auth.js";
import { ErrorSchema, TaskSchema } from "../schemas/index.js";
import { CreateTask } from "../usecases/CreateTask.js";
import { UpdateTask } from "../usecases/UpdateTask.js";

export const taskRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",

    schema: {
      body: z.object({
        title: z.string().trim().min(1),
        description: z.string().optional(),
        dueDate: z.string().datetime().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        subjectId: z.string().optional(),
      }),

      response: {
        201: TaskSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        500: ErrorSchema,
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
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:taskId/complete",

    schema: {
      params: z.object({
        taskId: z.string().uuid(),
      }),

      response: {
        200: TaskSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
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

        const updateTask = new UpdateTask();

        const result = await updateTask.execute({
          userId: session.user.id,
          taskId: request.params.taskId,
        });

        return reply.status(200).send(result);
      } catch (error) {
        app.log.error(error);

        if (error instanceof NotFoundError) {
          return reply.status(404).send({
            error: error.message,
            code: "NOT_FOUND_ERROR",
          });
        }

        return reply.status(500).send({
          error: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
