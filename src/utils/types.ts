import { z } from "zod";

export type Points = {
  donePoints: string;
  totalPoints: string;
};

export type PointsDict = Record<string, Points>;

export type onClose = () => void;

export const issueFormSchema = z.object({
  summary: z.string(),
  status: z.string(),
  backlog: z.string(),
  userId: z.string(),
  type: z.string(),
  estimate: z.string(),
});

export type IssueFormSchema = z.infer<typeof issueFormSchema>;

export type UpdateIssueInputs = {
  id: string;
  summary?: string;
  status?: string;
  backlog?: string;
  estimate?: string;
  type?: string;
  userId?: string;
};

export type UpdateIssue = (data: UpdateIssueInputs) => void;

export const inviteMemberSchema = z.object({
  toEmail: z.string(),
});

export type InviteMemberSchema = z.infer<typeof inviteMemberSchema>;

export const teamDetailsFormSchema = z.object({
  name: z.string().min(3),
  projectName: z.string().min(3),
});

export type TeamDetailsFormSchema = z.infer<typeof teamDetailsFormSchema>;
