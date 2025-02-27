import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import { insertWorkspaceSchema, patchWorkspaceSchema, selectedWorkspacesSchema } from "@/db/schema/workspaces";
import { jsonContent } from "@/helpers/json-content";
import { jsonContentOneOf } from "@/helpers/json-content-one-of";
import { jsonContentRequired } from "@/helpers/json-content-required";
import { notFoundSchema } from "@/lib/constants";
import { createErrorSchema } from "@/schemas/create-error-schema";
import { IdParamsSchema } from "@/schemas/id-params";

const tags = ["Workspaces"];

export const list = createRoute({
  method: "get",
  path: "/workspaces",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectedWorkspacesSchema),
      "List of workspaces",
    ),
  },
});

export const create = createRoute({
  method: "post",
  path: "/workspaces",
  tags,
  request: {
    body: jsonContentRequired(
      insertWorkspaceSchema,
      "The workspace to create",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectedWorkspacesSchema,
      "The created workspace",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertWorkspaceSchema),
      "The validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  method: "get",
  path: "/workspaces/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedWorkspacesSchema,
      "The requested workspace",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workspace not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID error",
    ),
  },
});

export const patch = createRoute({
  method: "patch",
  path: "/workspaces/{id}",
  tags,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchWorkspaceSchema,
      "The updated workspace",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectedWorkspacesSchema,
      "The updated workspace",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workspace not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchWorkspaceSchema),
        createErrorSchema(IdParamsSchema),
      ],
      "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  method: "delete",
  path: "/workspaces/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Workspace deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workspace not found",
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
