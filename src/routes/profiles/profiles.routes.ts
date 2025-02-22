import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import { insertProfileSchema, patchProfileSchema, selectedProfilesSchema } from "@/db/schema";
import { jsonContent } from "@/helpers/json-content";
import { jsonContentOneOf } from "@/helpers/json-content-one-of";
import { jsonContentRequired } from "@/helpers/json-content-required";
import { notFoundSchema } from "@/lib/constants";
import { createErrorSchema } from "@/schemas/create-error-schema";
import { IdParamsSchema } from "@/schemas/id-params";

const tags = ["Profiles"];

export const list = createRoute({
  method: "get",
  path: "/profiles",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectedProfilesSchema),
      "List of profiles",
    ),
  },
});

export const create = createRoute({
  method: "post",
  path: "/profiles",
  tags,
  request: {
    body: jsonContentRequired(
      insertProfileSchema,
      "The profile to create",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectedProfilesSchema,
      "The created profile",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertProfileSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  method: "get",
  path: "/profiles/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedProfilesSchema,
      "The requested profile",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Profile not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID error",
    ),
  },
});

export const patch = createRoute({
  method: "patch",
  path: "/profiles/{id}",
  tags,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchProfileSchema,
      "The updated profile",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedProfilesSchema,
      "The updated profile",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Profile not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchProfileSchema),
        createErrorSchema(IdParamsSchema),
      ],
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  method: "delete",
  path: "/profiles/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Profile deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Profile not found",
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
