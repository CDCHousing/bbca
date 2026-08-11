# BBCA — British Bangladeshi Construction Association Website

This document is the working context for building this project with **Claude Code**. It covers the tech stack, scope, data model, design reference, and a week-by-week task checklist. Read this fully before starting implementation.

---

## 1. Project Summary

We are building a website for **BBCA (British Bangladeshi Construction Association)**. The site includes public marketing pages, a news/insights system, a photo gallery, an executive/board directory, and an online **Membership Application** system with file uploads and email notifications.

The entire platform — frontend, backend, database, file storage — is hosted **entirely on Vercel** under a single subscription. There is no separate CMS (e.g. no Strapi) and no separate server host (e.g. no VPS/Railway). The admin panel is a **custom-built** section of the same Next.js app.

**Timeline:** 4 weeks (1 month) total.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | **Next.js** (App Router, React) | SSR/SSG for SEO on public pages |
| Backend | **Next.js API Routes / Route Handlers** | Serverless functions, no separate backend server |
| Admin Panel | **Custom-built within Next.js** | Protected routes under `/admin`, not a third-party CMS |
| Database | **Neon Postgres** (via Vercel integration) | Replaces deprecated @vercel/postgres — same DB, new SDK |
| ORM | **Prisma** (v7) | Type-safe queries, migrations via prisma.config.ts |
| File Storage | **Vercel Blob** | Stores gallery images, news images, membership document uploads |
| Auth (admin only) | **NextAuth.js** credentials provider | Public site has no user accounts — only the admin panel is protected |
| Email | **Resend** | Sends membership confirmation + admin notification emails |
| Form Validation | **React Hook Form + Zod** | Used for Membership Application form and Contact form |
| Styling | **Tailwind CSS** | Fast to build responsive layouts matching the design reference |
| Hosting | **Vercel (single subscription)** | Frontend + API + Postgres + Blob storage, one account/bill |

**Do not introduce:** Strapi, WordPress, a separate VPS, Railway, or any second hosting provider. Everything must run on Vercel.

---

## 3. Public-Facing Pages (Scope)

1. **Home** — hero section, key stats (e.g. "164+ Businesses Connected"), featured image/photo strip, intro section, secondary CTA banner (e.g. an upcoming event/festival), "Resource, Knowledge & Career" feature section, News & Events preview grid, footer
2. **About Us**
3. **Why Join Us**
4. **Membership Application Form** (see Section 5)
5. **Executive Committee** (profile grid: photo, name, title)
6. **Board of Directors** (profile grid: photo, name, title)
7. **News & Insights** — listing page + individual article detail pages
8. **Photo Gallery / Archive**
9. **Contact Us** — contact form + address/map + phone/email

Design reference: see `/design-reference/` — use `Website_Design.svg` (a single long-scrolling homepage mockup) as the primary reference; it's natively readable by Claude Code and Claude Design, unlike the original `.ai` file. Match the visual style: navy (`#1B2A4A`-ish) + gold/tan accent, rounded pill-style buttons with arrow icons, card-based sections, stat counters, alternating light-grey/white section backgrounds.

---

## 4. Admin Panel (Scope)

Path convention: `/admin` (protected — redirect to `/admin/login` if not authenticated).

**Screens needed:**
- `/admin/login` — simple email/password login
- `/admin/news` — list, create, edit, delete news articles (title, body, cover image, publish date, published/draft status)
- `/admin/leadership` — list, create, edit, delete Association Leadership profiles (name, title, photo, order/priority) — uses `Executive` model with category=EXECUTIVE
- `/admin/gallery` — upload/delete gallery images (image, caption, order)
- `/admin/membership-applications` — list all submissions, filter by status, view full submission detail, change status (Pending / Approved / Rejected), export to CSV

**Auth:** Only one role needed for MVP — "Admin". No multi-role permission system required unless requested later.

---

## 5. Membership Application System (Scope)

**Public form fields (adjust based on final design, but plan for):**
- Business/Organisation name
- Contact person name
- Email
- Phone
- Business type / industry (dropdown)
- Address
- Message / additional info (textarea)
- Document upload (e.g. trade licence, ID — PDF/JPG/PNG, stored via Vercel Blob)

**Behavior:**
- Client-side validation via Zod schema (required fields, email format, phone format, file type/size limits)
- Spam protection: honeypot field at minimum; consider hCaptcha/Turnstile if spam becomes an issue
- On submit:
  1. Store submission in Postgres (`MembershipApplication` table) with status `PENDING`
  2. Upload any attached file to Vercel Blob, store the resulting URL in the DB record
  3. Send confirmation email to the applicant via Resend
  4. Send notification email to admin via Resend
- Submissions appear immediately in `/admin/membership-applications`

---

## 6. Data Model (starting point — adjust as needed)

```
News
- id
- title
- slug
- body (rich text or markdown)
- coverImageUrl
- status (DRAFT | PUBLISHED)
- publishedAt
- createdAt / updatedAt

Executive
- id
- name
- title
- photoUrl
- order
- category (EXECUTIVE | DIRECTOR)
- createdAt / updatedAt

GalleryImage
- id
- imageUrl
- caption
- order
- createdAt

MembershipApplication
- id
- businessName
- contactName
- email
- phone
- businessType
- address
- message
- documentUrl (nullable)
- status (PENDING | APPROVED | REJECTED)
- createdAt / updatedAt

AdminUser
- id
- email
- passwordHash
- createdAt
```

---

## 7. Environment Variables Needed

```
DATABASE_URL=              # Neon Postgres connection string
BLOB_READ_WRITE_TOKEN=     # Vercel Blob token
RESEND_API_KEY=            # Resend email API key (currently BLANK — emails are skipped until set)
RESEND_FROM_EMAIL=         # verified sender, e.g. "BBCA <noreply@bbca.org.uk>"; defaults to onboarding@resend.dev
NEXTAUTH_SECRET=           # NextAuth secret
NEXTAUTH_URL=              # local/prod URL for NextAuth
ADMIN_NOTIFICATION_EMAIL=  # where new membership submissions get sent
```

---

## 8. 4-Week Task Checklist

### Week 1 — Discovery, Design & Setup
- [x] Initialise Next.js project (App Router, TypeScript, Tailwind)
- [x] Set up Vercel project + Neon Postgres + Prisma connection
- [x] Define Prisma schema for all models in Section 6, run initial migration
- [x] Set up base layout: header/nav, footer, color/typography tokens
- [ ] Wireframe/confirm all 9 public pages + admin screens

### Week 2 — Core Pages & Admin Foundations
- [x] Build Home page (hero, stats, intro, festival banner, resource/knowledge, news preview)
- [x] Build About Us, Why Join Us, Contact Us pages (static + contact form)
- [x] Build Executive Committee & Board of Directors pages (placeholder — DB wiring Week 3)
- [x] Build News listing + article detail pages (static placeholder content)
- [x] Build Photo Gallery page (masonry placeholder layout)
- [x] Build Membership Application form UI (client form, file upload, validation pending)
- [x] Build admin authentication (login, protected `/admin` layout)
- [x] Build `/admin/news`, `/admin/leadership` CRUD screens

### Week 3 — Membership Form, News, Gallery & Admin Completion
- [ ] Build Membership Application form UI + Zod validation
- [ ] Build API route for membership submission (DB write + Blob upload)
- [ ] Integrate Resend for confirmation + admin notification emails
- [ ] Build News listing + article detail pages
- [ ] Build Photo Gallery page
- [x] Build `/admin/gallery` and `/admin/membership-applications` (with status update + CSV export)
- [x] Build Resource & Knowledge system — `Resource` + `SeatBooking` models, TipTap rich-text admin editor
      (`/admin/resources`), public card grid + detail page, seat booking form, per-resource CSV export
- [x] Build `src/lib/email.ts` (Resend) + per-resource custom confirmation email with `{{token}}` substitution
      — NOTE: `RESEND_API_KEY` is still blank, so sending is skipped (bookings save regardless)
- [ ] Wire Resend into the membership application flow (§5 steps 3 & 4 — still not sending)

### Week 4 — Testing, Content, Launch
- [ ] Cross-browser/cross-device testing
- [ ] Performance pass (image optimization, Lighthouse check)
- [ ] SEO basics: meta tags, sitemap.xml, robots.txt, Open Graph tags
- [ ] Populate real content via admin panel
- [ ] Client feedback round + revisions
- [ ] Production deployment, custom domain + SSL on Vercel

---

## 9. Design Reference Notes

Design file (claude design handoff): `design-reference/BBCA Website.dc.html`

Colors from claude design component-handoff (use these, not the SVG source):
- Navy: `#1B2A52`, Navy deep: `#14203D`
- Red accent: `#D0202F`
- Gold: `#DA9028`
- Green: `#0A7D3E`
- Section alt bg: `#E4F0F2` / `#EDF5F6`
- Alt card bg: `#F5F7FA`
- Body text: `#414C60`, Muted: `#6E7A8C`, Lines: `#E3E7ED`

- Font: **Poppins** (400, 500, 600, 700, 800)
- Buttons: pill-shaped (`rounded-full`), navy fill, white text, red circle arrow right
- Section rhythm: alternate white and `#E4F0F2`
- Imagery: real photos of people/events, not stock illustration

Navbar (from screenshot — NOT the claude design dropdown nav):
- Top utility bar: `#14203D` bg, address + email + Facebook
- Floating white nav card below: logo | flat nav links (8 items) | search | divider | Free Call + phone
- Collapses utility bar on scroll; nav card shrinks
- Nav links: Home, About Us, Why Join BBCA, Membership Form, Executive Committee, Board of Directors, News & Insights, Photo Archive

---

## 10. Out of Scope (unless requested later)

- Multi-language support (beyond any bilingual text blocks already in content)
- Payment processing for membership fees (this phase is application-only, not payment)
- Multi-role admin permissions
- Native mobile app
- Advanced analytics dashboards beyond basic page views

---

## 11. Notes for Claude Code

- Keep all backend logic inside Next.js API routes / route handlers — do not scaffold a separate Express/Node server.
- Use Prisma migrations for all schema changes; do not hand-edit the database.
- Keep the admin panel minimal and purpose-built — do not add a general plugin system or attempt to replicate a full CMS.
- File uploads (gallery, news cover images, membership documents) always go through Vercel Blob — do not write to local disk (Vercel's serverless filesystem is not persistent).
- Favor server components for public pages where possible; use client components only where interactivity is required (forms, admin CRUD tables).
- **Always update this checklist** when a task is completed or partially completed.
- @vercel/postgres is deprecated — use @neondatabase/serverless with Prisma instead.
- **Never pull jsdom into a server component.** `isomorphic-dompurify` depends on it and added ~770 files to
  the `/resources/[slug]` serverless bundle, which 500'd on Vercel while passing both `next dev` and
  `next start` locally. Use `sanitize-html` (pure JS) for HTML sanitisation. To check a route's bundle:
  `.next/server/app/<route>/page.js.nft.json` — a healthy route traces ~120 files, not 1300.
- Prisma v7 uses prisma.config.ts for datasource URL (not schema.prisma).
