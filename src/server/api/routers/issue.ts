import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const issueRouter = createTRPCRouter({
  // Only product owner can create an issue
  // if (session?.user.role !== "productOwner") {
  //   res.status(401);
  // }
  create: protectedProcedure
    .input(
      z.object({
        status: z.string(),
        summary: z.string(),
        backlog: z.string(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const issue = await prisma.issue.create({ data: input });
      return issue;
    }),

  // Only product owner should be able to change the backlog
  // if (backlog && session?.user.role !== "productOwner") {
  //   res.status(401);
  // }
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string().optional(),
        summary: z.string().optional(),
        backlog: z.string().optional(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const issue = await prisma.issue.update({
        data: input,
        where: { id: input.id, teamId: input.teamId },
      });
      return issue;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const issue = await prisma.issue.delete({ where: { id: input.id } });
      return issue;
    }),
});
