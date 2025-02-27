import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "@/routes/talents/talents.routes";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import * as HttpStatusPhrases from "@/constants/http-status-phrases";
import { createDB } from "@/db";
import { talents } from "@/db/schema/talents";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const talent = await db.query.talents.findMany();

  return c.json(talent);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const talent = await c.req.json();
  const { userId } = talent;

  if (!(await doesUserExist(db, userId))) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  if (await isUserIdTaken(db, userId)) {
    return c.json({ message: HttpStatusPhrases.CONFLICT }, HttpStatusCodes.CONFLICT);
  }

  const [inserted] = await db.insert(talents).values(talent).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");

  const talent = await db.query.talents.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!talent) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(talent, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const { userId } = updates;

  if (userId && !(await doesUserExist(db, userId))) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  if (userId && (await isUserIdTaken(db, userId))) {
    return c.json({ message: HttpStatusPhrases.CONFLICT }, HttpStatusCodes.CONFLICT);
  }

  const [talent] = await db.update(talents)
    .set(updates)
    .where(eq(talents.id, id))
    .returning();

  if (!talent) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(talent, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const db = createDB(c.env.DB);
  const { id } = c.req.valid("param");
  const [deleted] = await db.delete(talents)
    .where(eq(talents.id, id))
    .returning();

  if (!deleted) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

async function isUserIdTaken(
  db: ReturnType<typeof createDB>,
  userId: number,
): Promise<boolean> {
  const talent = await db.query.talents.findFirst({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
  });
  return Boolean(talent);
}

async function doesUserExist(
  db: ReturnType<typeof createDB>,
  userId: number,
): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, userId);
    },
  });
  return Boolean(user);
}
