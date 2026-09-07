# Bulk Email System — Implementation Plan

Admin-side feature: compose an email in `/admin`, pick recipients, send to all in one click.

Status: **built**. Migration `20260907071052_add_email_campaigns` is applied; the screens live at
`/admin/email`. Sending is still skipped until `RESEND_API_KEY` is set (§6) — drafts, recipient
snapshots and the whole admin flow work regardless.

### Built as

| Piece | File |
|---|---|
| Models | `prisma/schema.prisma` — `EmailCampaign`, `EmailRecipient` |
| Audience pools | `src/lib/campaign-recipients.ts` |
| Send engine | `src/lib/campaign-email.ts` |
| Validation | `src/lib/validation/campaign.ts` |
| API | `src/app/api/admin/email/**` |
| Screens | `src/app/admin/email/{page,new/page,[id]/page}.tsx` |

### Where the build differs from this plan

1. **`EmailRecipient.organization`** was added (the plan's model carried only `email` + `name`).
   `{{businessName}}` has nowhere to resolve from otherwise.
2. **Test send is `POST /api/admin/email/test`**, not `/[id]/test`. It takes the composed
   subject/body so "Send test to me" works before a draft is saved; the detail screen posts the
   saved campaign's own subject/body to the same route.
3. **Chunk delay is 550ms, not 200ms.** Resend's 2 requests/second limit needs ≥500ms between
   calls; 200ms is 5/s and earns 429s that would mark healthy recipients FAILED.
4. **Create takes `{ sources, emails }`, not a recipient list.** The server rebuilds the pool from
   the requested sources and intersects the ticked addresses with it, so names/organisations are
   always snapshotted from the DB and an off-pool address in a crafted request is simply dropped.
   This is what enforces "REJECTED is never selectable" rather than trusting the client.
5. **A stale-lock guard on send:** a campaign in `SENDING` refuses a second send for 5 minutes
   (its `updatedAt` is refreshed after every chunk). Past that the previous run is presumed dead
   and the campaign resumes.

---

## 0. What already exists

| Piece | Location | Reuse |
|---|---|---|
| Resend client wrapper | `src/lib/email.ts` | Lazy client, `FROM` const, `escapeHtml`, `renderTokens`, `wrap()` HTML shell |
| Rich-text editor | `src/components/RichTextEditor.tsx` | TipTap — already used by news + resources admin |
| HTML sanitiser | `src/lib/sanitize.ts` | `sanitizeHtml()` — pure JS, no jsdom |
| Admin auth | `src/lib/auth.ts` → `getServerSession()` | Gate every new route the same way |
| Admin nav | `src/app/admin/layout.tsx` | Add "Email Members" link |
| Toasts / confirm dialog | `src/app/admin/components/` | `ToastStack`, `useToasts`, `ConfirmDialog` |

There is deliberately **no `Member` model** — members are `MembershipApplication` rows with
`status = APPROVED`. See §1.

---

## 1. Recipient pool

**Decided:** a member is a `MembershipApplication` row with `status = APPROVED`. No separate `Member`
model is introduced — approved applications *are* the membership list.

```ts
// the canonical member query
prisma.membershipApplication.findMany({
  where: { status: "APPROVED" },
  orderBy: SERIAL_ORDER_BY,   // same order as the admin list + CSV
})
```

Name token comes from `contactName`, organisation token from `businessName`.

Consequence: approving an application in `/admin/membership-applications` is what adds someone to the
mailing list. Rejecting or deleting removes them. Worth telling the client — status is no longer just a
label, it now controls who receives mail.

### Other audiences (secondary tabs)

| Source | Table | Use |
|---|---|---|
| **Members** (default tab) | `MembershipApplication` where `status = APPROVED` | The membership list |
| Pending applicants | `MembershipApplication` where `status = PENDING` | Chase-ups, "we need more info" |
| Seat bookings | `SeatBooking` (per `Resource`) | Event follow-ups |
| Stall bookings | `StallBooking` | Event audience |
| Visitors | `VisitorRegistration` | Event audience |

`REJECTED` applications are **never** selectable — not offered in the UI, and rejected on the server if a
crafted request asks for them.

Members tab is preselected on load. Dedupe on lowercased email across sources.

---

## 2. Data model (new Prisma migration)

```prisma
model EmailCampaign {
  id            String              @id @default(cuid())
  subject       String
  body          String              // TipTap HTML
  audienceLabel String              // human string, e.g. "Approved members (142)"
  status        CampaignStatus      @default(DRAFT)
  totalCount    Int                 @default(0)
  sentCount     Int                 @default(0)
  failedCount   Int                 @default(0)
  sentAt        DateTime?
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
  recipients    EmailRecipient[]
}

enum CampaignStatus {
  DRAFT
  SENDING
  SENT
  FAILED
}

model EmailRecipient {
  id         String          @id @default(cuid())
  campaignId String
  campaign   EmailCampaign   @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  email      String
  name       String
  status     RecipientStatus @default(PENDING)
  error      String?         // Resend error text
  providerId String?         // Resend message id
  sentAt     DateTime?

  @@unique([campaignId, email])
  @@index([campaignId, status])
}

enum RecipientStatus {
  PENDING
  SENT
  FAILED
}
```

Recipients are **snapshotted** into `EmailRecipient` when the campaign is created, not resolved at send
time. Campaign history stays accurate even after the source application is edited or deleted.

---

## 3. Admin screens

### `/admin/email` — campaign list

Table: subject, audience label, status badge, `sent / total` counts, failed count, date. "New Email" button.
Delete via `ConfirmDialog`.

### `/admin/email/new` — compose

- Recipient picker: source tabs, checkboxes, live count badge
- Subject field — supports `{{name}}` / `{{businessName}}` tokens
- Body: `RichTextEditor` (TipTap)
- Preview pane rendering through the `wrap()` shell from `src/lib/email.ts`
- **Send test to me** — single send to the logged-in admin's email, does not touch campaign counters
- Save Draft / Send buttons

### `/admin/email/[id]` — campaign detail

Per-recipient table (email, status, error text), "Retry failed" button, CSV export of recipient statuses.

### Nav

Add `{ href: "/admin/email", label: "Email Members" }` to `navLinks` in `src/app/admin/layout.tsx`.

---

## 4. API routes

All gated by `getServerSession()`, matching existing `/api/admin/*` routes.

```
GET    /api/admin/email/recipients?source=members&status=APPROVED   list for the picker
POST   /api/admin/email                    create campaign (DRAFT) + snapshot recipients
GET    /api/admin/email                    list campaigns (paginated)
POST   /api/admin/email/[id]/send          perform the send
POST   /api/admin/email/[id]/test          single test send to the admin
POST   /api/admin/email/[id]/retry         re-send only FAILED recipients
GET    /api/admin/email/[id]/export        CSV of recipient statuses
DELETE /api/admin/email/[id]
```

Every route is admin-only. No public endpoint is added by this feature.

---

## 5. Send mechanics

New module `src/lib/campaign-email.ts`, built on the existing `src/lib/email.ts` helpers.

- Use **`resend.batch.send()`** — max **100 emails per call**. Chunk the recipient list into 100s.
- Resend default rate limit is **2 requests/sec** → ~200ms delay between chunks.
- Per-recipient personalisation: each array entry carries its own `renderTokens()`-rendered subject and
  HTML, so `{{name}}` resolves per member.
- Route sets `export const maxDuration = 300`. 100-per-call + 200ms gap handles ~3,000 recipients inside
  the budget. Beyond that, the route marks the campaign `SENDING` and returns; calling send again resumes
  from the remaining `PENDING` rows.
- Mark each recipient `SENT` / `FAILED` per chunk and update campaign counters as it goes, so a timeout
  mid-run leaves accurate state instead of an all-or-nothing loss.
- **Never throw.** Same rule as `sendBookingConfirmation` — a failed send must not take down the request.
  Errors land in `EmailRecipient.error`.
- Body HTML runs through `sanitizeHtml()` before sending.
- No `Reply-To` for now (deferred). Replies land on whatever `RESEND_FROM_EMAIL` is — pick a real,
  monitored address there rather than a dead `noreply@`. A `Reply-To` can be added later in one line.

---

## 6. Deliverability

- **`RESEND_API_KEY` is currently blank**, so nothing sends today (by design — sends are skipped, records
  still save).
- `RESEND_FROM_EMAIL` must be on a **verified domain**. The `onboarding@resend.dev` fallback only delivers
  to the address that owns the Resend account — useless for member mail. See §8. This is the single
  biggest factor in whether mail reaches inboxes rather than spam.

### No unsubscribe system — decided

This is not a public newsletter with a subscribe flow. Recipients are members who joined the association
by application, so mail to them is member correspondence, not marketing to a bought list. UK PECR soft
opt-in covers it, and Gmail's mandatory one-click-unsubscribe rule applies to bulk senders above
5,000 messages/day — far above BBCA's volume.

No `EmailOptOut` table, no `List-Unsubscribe` header, no public unsubscribe route.

**Revisit if** volume approaches 5,000/day, mail is sent to non-members, or a member asks in writing to
stop receiving it — that last one is handled today by changing their application status away from
`APPROVED`, which drops them from the Members tab.

---

## 7. Environment variables

```
RESEND_API_KEY=            # required — currently blank, nothing sends until set
RESEND_FROM_EMAIL=         # must be an address on a verified domain
```

Both already listed in `CLAUDE.md` §7. No new variables are introduced by this feature.

Set in `.env.local` for local dev and in Vercel → Project → Settings → Environment Variables for production.

---

## 8. How to obtain each value

### `RESEND_API_KEY`

1. Sign up at <https://resend.com>.
2. Sidebar → **API Keys** → **Create API Key**.
3. Name `bbca-production`, permission **Sending access**.
4. Copy the value (`re_...`). It is shown **once**.

Free tier: 3,000 emails/month but only **100/day** — a single blast to 150 members exceeds it. Paid tier
($20/mo) gives 50k/month with no daily cap. Check the member count before relying on free.

### `RESEND_FROM_EMAIL` — verified domain

Anyone can type `noreply@bbca.org.uk` into a From field. Gmail and Outlook will not trust it unless the
domain owner has cryptographically authorised the sender. Verification is how Resend proves that.

1. Resend dashboard → **Domains** → **Add Domain** → `bbca.org.uk` → region **eu-west-1 (Ireland)**
   (UK members, GDPR).
2. Resend lists DNS records to add, roughly:

   | Type | Name | Value |
   |---|---|---|
   | MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` (priority 10) |
   | TXT | `send` | `v=spf1 include:amazonses.com ~all` |
   | TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEB...` (long DKIM key) |
   | TXT | `_dmarc` | `v=DMARC1; p=none;` |

3. Add them wherever **bbca.org.uk DNS** is managed — the registrar (GoDaddy, Namecheap, 123-reg,
   Cloudflare...), not Vercel unless the nameservers point there. Some panels want `send`, others
   `send.bbca.org.uk`; match how existing records in that panel are written.
4. Back in Resend → **Verify**. Minutes to a few hours for DNS propagation.
5. Then set:

   ```
   RESEND_FROM_EMAIL="BBCA <noreply@bbca.org.uk>"
   ```

   Format is `Display Name <address@domain>`. The address must be on the verified domain.
   Other valid examples:

   ```
   RESEND_FROM_EMAIL="BBCA <info@bbca.org.uk>"
   RESEND_FROM_EMAIL="British Bangladeshi Construction Association <members@bbca.org.uk>"
   ```

If the client controls the domain, send them the record table from step 2 — that is all they need.

---

## 9. Build order

1. Prisma schema + migration (§2)
2. `src/lib/campaign-email.ts` — chunking, batch send, per-recipient token render (§5)
3. API routes (§4)
4. Compose UI + recipient picker (§3)
5. Campaign list + detail + retry + CSV (§3)
6. Admin nav link

Rough size: ~9 files, 1 migration.

Domain verification (§8) is the long pole — DNS changes plus possibly waiting on the client. It does **not**
block the build: `src/lib/email.ts` already skips sending when the API key is blank, so the whole campaign
system can be built and exercised against draft + test-send paths while DNS propagates.

---

## 10. Decisions

1. **Recipient pool** — members = `MembershipApplication` with `status = APPROVED`. No `Member` model. §1
2. **No unsubscribe system** — not a subscribe-based newsletter; member correspondence only. §6
3. **No `Reply-To`** for now — deferred. Replies go to `RESEND_FROM_EMAIL`, so make that a real inbox. §5

Nothing outstanding — ready to build.
