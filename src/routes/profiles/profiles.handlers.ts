import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "@/routes/profiles/profiles.routes";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import { createDB } from "@/db";
import { profiles } from "@/db/schema";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const profile = await db.query.profiles.findMany();

  return c.json(profile);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const profile = await c.req.json();

  const [inserted] = await db.insert(profiles).values(profile).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");
  const profile = await db.query.profiles.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!profile) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(profile, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const [profile] = await db.update(profiles)
    .set(updates)
    .where(eq(profiles.id, id))
    .returning();

  if (!profile) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(profile, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");
  const [deleted] = await db.delete(profiles)
    .where(eq(profiles.id, id))
    .returning();

  if (!deleted) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
