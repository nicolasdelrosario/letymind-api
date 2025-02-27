import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import { insertUserSchema, patchUserSchema, selectedUsersSchema } from "@/db/schema/users";
import { jsonContent } from "@/helpers/json-content";
import { jsonContentOneOf } from "@/helpers/json-content-one-of";
import { jsonContentRequired } from "@/helpers/json-content-required";
import { badRequestSchema, conflictSchema, notFoundSchema } from "@/lib/constants";
import { createErrorSchema } from "@/schemas/create-error-schema";
import { IdParamsSchema } from "@/schemas/id-params";

const tags = ["Users"];

export const list = createRoute({
  method: "get",
  path: "/users",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectedUsersSchema),
      "List of users",
    ),
  },
});

export const create = createRoute({
  method: "post",
  path: "/users",
  tags,
  request: {
    body: jsonContentRequired(
      insertUserSchema,
      "The user to create",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectedUsersSchema,
      "The created user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema),
      "The validation error(s)",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      conflictSchema,
      "Email already in use",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      badRequestSchema,
      "Bad request",
    ),
  },
});

export const getOne = createRoute({
  method: "get",
  path: "/users/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedUsersSchema,
      "The requested user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID error",
    ),
  },
});

export const patch = createRoute({
  method: "patch",
  path: "/users/{id}",
  tags,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchUserSchema,
      "The updated user",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedUsersSchema,
      "The updated user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      badRequestSchema,
      "Bad request error",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchUserSchema),
        createErrorSchema(IdParamsSchema),
      ],
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  method: "delete",
  path: "/users/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "User deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
