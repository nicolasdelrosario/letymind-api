import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import { insertSenioritySchema, patchSenioritySchema, selectedSenioritiesSchema } from "@/db/schema/seniorities";
import { jsonContent } from "@/helpers/json-content";
import { jsonContentOneOf } from "@/helpers/json-content-one-of";
import { jsonContentRequired } from "@/helpers/json-content-required";
import { badRequestSchema, notFoundSchema } from "@/lib/constants";
import { createErrorSchema } from "@/schemas/create-error-schema";
import { IdParamsSchema } from "@/schemas/id-params";

const tags = ["Seniorities"];

export const list = createRoute({
  method: "get",
  path: "/seniorities",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectedSenioritiesSchema),
      "List of seniorities",
    ),
  },
});

export const create = createRoute({
  method: "post",
  path: "/seniorities",
  tags,
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertSenioritySchema,
      "The seniority to create",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectedSenioritiesSchema,
      "The created seniority",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertSenioritySchema),
      "The validation error(s)",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      badRequestSchema,
      "Bad request error",
    ),
  },
});

export const getOne = createRoute({
  method: "get",
  path: "/seniorities/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedSenioritiesSchema,
      "The requested seniority",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Seniority not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID error",
    ),
  },
});

export const patch = createRoute({
  method: "patch",
  path: "/seniorities/{id}",
  tags,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchSenioritySchema,
      "The updated seniority",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedSenioritiesSchema,
      "The updated seniority",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Seniority not found",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      badRequestSchema,
      "Bad request error",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchSenioritySchema),
        createErrorSchema(IdParamsSchema),
      ],
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  method: "delete",
  path: "/seniorities/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Seniority deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Seniority not found",
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
