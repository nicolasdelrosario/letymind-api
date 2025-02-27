import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "@/routes/seniorities/seniorities.routes";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import { createDB } from "@/db";
import { seniorities } from "@/db/schema/seniorities";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const seniority = await db.query.seniorities.findMany();

  return c.json(seniority);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const seniority = await c.req.json();
  const { name } = seniority;

  if (await isNameTaken(db, name)) {
    return c.json({ message: HttpStatusPhrases.CONFLICT }, HttpStatusCodes.CONFLICT);
  }

  const [inserted] = await db.insert(seniorities).values(seniority).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");
  const seniority = await db.query.seniorities.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!seniority) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(seniority, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const { name } = updates;

  if (name && await isNameTaken(db, name)) {
    return c.json({ message: HttpStatusPhrases.CONFLICT }, HttpStatusCodes.CONFLICT);
  }

  const [seniority] = await db.update(seniorities)
    .set(updates)
    .where(eq(seniorities.id, id))
    .returning();

  if (!seniority) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(seniority, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");
  const [deleted] = await db.delete(seniorities)
    .where(eq(seniorities.id, id))
    .returning();

  if (!deleted) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export async function isNameTaken(db: ReturnType<typeof createDB>, name: string): Promise<boolean> {
  const seniority = await db.query.seniorities.findFirst({
    where(fields, operators) {
      return operators.eq(fields.name, name);
    },
  });

  return Boolean(seniority);
}
