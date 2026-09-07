import { z } from "zod";
import { RECIPIENT_SOURCES } from "@/lib/campaign-recipients";

/**
 * A single blast is capped well above BBCA's realistic membership size. It
 * exists to stop a runaway request, not to model a real limit.
 */
export const MAX_RECIPIENTS = 5000;

export const campaignSchema = z.object({
  subject: z.string().trim().min(2, "Subject is required").max(300),
  body: z.string().trim().min(1, "Message body is required"),
  sources: z
    .array(z.enum(RECIPIENT_SOURCES))
    .min(1, "Pick at least one recipient source"),
  /**
   * The ticked addresses. Resolved against the sources server-side, so this is
   * a filter over an allowed pool rather than a trusted recipient list.
   */
  emails: z
    .array(z.string().trim().toLowerCase())
    .min(1, "Pick at least one recipient")
    .max(MAX_RECIPIENTS, `A campaign cannot exceed ${MAX_RECIPIENTS} recipients`),
});

export type CampaignValues = z.infer<typeof campaignSchema>;

/** "Send test to me" works on unsaved compose state, so it takes no campaign id. */
export const testEmailSchema = z.object({
  subject: z.string().trim().min(2, "Subject is required").max(300),
  body: z.string().trim().min(1, "Message body is required"),
});
