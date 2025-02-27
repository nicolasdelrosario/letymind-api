import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import { insertTalentSchema, patchTalentSchema, selectedTalentsSchema } from "@/db/schema/talents";
import { jsonContent } from "@/helpers/json-content";
import { jsonContentOneOf } from "@/helpers/json-content-one-of";
import { jsonContentRequired } from "@/helpers/json-content-required";
import { badRequestSchema, conflictSchema, notFoundSchema } from "@/lib/constants";
import { createErrorSchema } from "@/schemas/create-error-schema";
import { IdParamsSchema } from "@/schemas/id-params";

const tags = ["Talents"];

export const list = createRoute({
  method: "get",
  path: "/talents",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectedTalentsSchema),
      "List of talents",
    ),
  },
});

export const create = createRoute({
  method: "post",
  path: "/talents",
  tags,
  request: {
    body: jsonContentRequired(
      insertTalentSchema,
      "The talent to create",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectedTalentsSchema,
      "The created talent",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTalentSchema),
      "The validation error(s)",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      badRequestSchema,
      "Bad request error",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      conflictSchema,
      "User already has a talent record",
    ),
  },
});

export const getOne = createRoute({
  method: "get",
  path: "/talents/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedTalentsSchema,
      "The requested talent",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Talent not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID error",
    ),
  },
});

export const patch = createRoute({
  method: "patch",
  path: "/talents/{id}",
  tags,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchTalentSchema,
      "The updated talent",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedTalentsSchema,
      "The updated talent",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Talent not found",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      badRequestSchema,
      "Bad request error",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      conflictSchema,
      "User already has a talent record",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchTalentSchema),
        createErrorSchema(IdParamsSchema),
      ],
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  method: "delete",
  path: "/talents/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Talent deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Talent not found",
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
