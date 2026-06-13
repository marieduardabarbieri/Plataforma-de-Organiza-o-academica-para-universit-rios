// src/schemas/index.ts

import z from "zod";

export const ErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  dueDate: z.date().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  subjectId: z.string().nullable(),
});

export const UpdateTaskBodySchema = z.object({
  completed: z.boolean(),
});

export const UpdateTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

export const GetTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().optional(),
});
