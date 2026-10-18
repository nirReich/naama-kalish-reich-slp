# Speech-Language Pathology Practice Website Roadmap

## 1. Purpose

Build a clear, welcoming website for a speech-language pathology (SLP) practice that helps prospective clients understand the practice, contact the clinician, and—once the necessary workflows are ready—manage accounts and appointments. A later phase may add an AI assistant that uses information the practice has approved and, when appropriate, information belonging to the signed-in user to offer relevant recommendations and direct them to practice resources.

The site should be accessible, mobile-friendly, easy for the practice to maintain, and designed to protect sensitive health and personal information.

## 2. Product goals

- Explain the practice, services, clinician’s approach, and who the practice serves.
- Make it easy for visitors to ask questions or request a consultation.
- Give clients a secure way to manage their account and appointment requests.
- Give the practice a manageable way to review client information and appointment activity.
- In a later phase, help signed-in users find relevant practice information without presenting the AI as a clinician or replacing professional judgment.

## 3. Phased delivery plan

### Phase 0 — Discovery and foundations

**Purpose:** Agree on requirements, operating policies, and the technical foundation before collecting client information.

**Work:**
- Identify audiences, service areas, practice offerings, languages, age groups, and whether care is in-person, remote, or both.
- Define the appointment lifecycle: inquiry, requested, confirmed, rescheduled, canceled, completed, and no-show.
- Decide what information is necessary at each stage and what should not be collected through the public site.
- Select hosting, domain, email delivery, storage, authentication, and scheduling approach.
- Establish accessibility, privacy, security, backup, and retention requirements with appropriate professional advice.
- Create the visual direction, content inventory, and initial site map.

**Deliverables:** approved requirements, site map, content plan, data-flow outline, architecture decision, and prioritized backlog.

### Phase 1 — Public information website

**Purpose:** Launch a useful public presence without requiring an account.

**Pages and features:**
- Home page with a concise description of the practice and clear next steps.
- About page with the clinician’s background, credentials, approach, and practice values.
- Services page describing evaluations, therapy, consultation, and other actual offerings.
- “Who we help” or resource pages organized by age group or communication need, as appropriate.
- General information such as location/service area, hours, telepractice details, fees or insurance guidance, and frequently asked questions.
- Contact Us page with contact details and a short inquiry form.
- Privacy notice, accessibility statement, and emergency-care guidance appropriate to the practice.
- Mobile-friendly navigation, accessible forms, and basic search-engine metadata.

**Contact form safeguards:** Ask only for information needed to respond. Tell visitors not to submit urgent concerns or detailed health information through a general form. Provide a phone or other suitable contact route.

**Exit criteria:** Key content is approved; pages work on mobile and keyboard navigation; form delivery and spam protection are verified; privacy and contact notices are published.

### Phase 2 — Contact and intake workflow

**Purpose:** Help the practice receive and respond to inquiries consistently.

**Features:**
- Contact-form notifications to a practice-controlled mailbox or secure queue.
- Inquiry status tracking and response notes for authorized staff.
- Optional consultation request flow that collects only the minimum needed to arrange a response.
- Clear acknowledgment to the visitor, expected response time, and alternate contact option.
- A defined process for deleting or transferring inquiry records into the practice’s official record system when appropriate.

**Exit criteria:** The practice can receive, triage, and close inquiries; notification failures are visible; access to inquiries is restricted and documented.

### Phase 3 — User accounts and client portal

**Purpose:** Give clients a secure place to manage their own profile and relevant practice interactions.

**Features:**
- Account registration, sign-in, sign-out, password reset, and account recovery.
- Email verification and secure session management.
- User profile with only approved, necessary fields.
- Consent and privacy acknowledgments recorded with date and version.
- Account settings, notification preferences, and a way to request account closure or data access as applicable.
- Role-based access for clients, clinician, and authorized staff.
- Audit history for sensitive account and record actions.

**Design decisions:** Determine whether accounts are for adults only or include parent/guardian-managed accounts; define how guardians, minors, and multiple caregivers are represented; decide which records remain in a separate clinical record system.

**Exit criteria:** Registration and recovery work; users can see only their own information; staff access follows assigned roles; security review is complete before real client data is introduced.

### Phase 4 — Appointment scheduling and management

**Purpose:** Let clients request or manage appointments and let the practice control availability.

**Client features:**
- View eligible appointment types and available times.
- Request, confirm, reschedule, or cancel according to practice policy.
- Receive confirmation and reminder messages through chosen channels.
- View upcoming and past appointments with clear status.

**Practice features:**
- Set appointment types, durations, buffers, working hours, time zone, and booking rules.
- Approve requests when manual review is required.
- Manage cancellations, waitlists, closures, and exceptions.
- Review appointment history and communication status.

**Operational requirements:** Prevent double booking; handle time zones and daylight-saving changes; minimize health details in email/SMS; define cancellation, late-arrival, and no-show policies; provide an accessible way to request help.

**Exit criteria:** Booking rules match practice policy; reminders and changes are tested; calendar conflicts and failed notifications are handled; staff can manage the schedule reliably.

### Phase 5 — AI information and recommendation assistant

**Purpose:** Help signed-in users find relevant, practice-approved information and next steps.

**Initial capabilities:**
- Answer questions using a curated, versioned library of the practice’s public information, FAQs, service descriptions, and approved educational resources.
- Direct users to relevant pages, contact options, or appointment types.
- Offer low-risk suggestions based on a user’s stated goal or explicitly selected profile information, with a clear explanation of what information was used.
- Escalate unanswered, sensitive, or potentially urgent questions to the practice or to appropriate emergency guidance.

**Access and safety boundaries:**
- Use only the signed-in user’s own data, and only after clear notice and consent for that specific purpose.
- Enforce authorization on the server for every data request; never rely on the model to decide who may access a record.
- Do not expose one user’s information in another user’s conversation, search result, logs, analytics, or generated response.
- Keep the assistant informational; it must not diagnose, prescribe treatment, or replace evaluation and care by an SLP.
- Do not use clinical notes or sensitive records as model context by default. Any future use requires a separate review of necessity, consent, security, retention, and applicable requirements.
- Show when a response is AI-generated, cite the practice resources it used, and provide a route to contact the clinician.
- Minimize stored prompts and responses; define retention, deletion, access, incident, and human-review procedures.
- Evaluate accuracy, unsafe advice, privacy leakage, accessibility, and bias before launch and after material changes.

**Rollout:** Start with a limited pilot using public practice content only. Add user-specific recommendations only after privacy, security, clinical, and operational review, explicit consent, and successful testing.

**Exit criteria:** The assistant is grounded in approved content; authorization boundaries are verified; the user-facing limitations are clear; monitoring and escalation are in place; the practice can disable it quickly.

### Phase 6 — Ongoing improvement

**Purpose:** Maintain quality as the practice and its needs change.

**Work:**
- Review site usage and inquiry/booking completion using privacy-conscious analytics.
- Keep service descriptions, policies, credentials, and resources current.
- Monitor accessibility, performance, security updates, backups, and recovery procedures.
- Review client and staff feedback and prioritize improvements.
- Reassess AI content, permissions, quality, and retention whenever capabilities or data sources change.

## 4. Suggested navigation

- Home
- About
- Services
- Who We Help / Resources
- General Information / FAQs
- Contact Us
- Client Portal (introduced in Phase 3)
- Appointments (introduced in Phase 4)

## 5. Core roles

| Role | Typical access |
|---|---|
| Visitor | Public pages and inquiry form |
| Client | Own profile, consent settings, and own appointments |
| Parent/guardian | Only the dependent information explicitly assigned to them under the practice’s policy |
| Clinician | Practice inquiries, schedule, and authorized client information needed for care |
| Practice administrator | Account, content, and scheduling administration; access to clinical information only when required by role |

## 6. Cross-cutting requirements

- **Privacy:** Collect the minimum information needed, explain why it is collected, and define retention and deletion.
- **Security:** Use encrypted connections, secure authentication, least-privilege access, protected backups, and audit logging for sensitive actions.
- **Accessibility:** Design for screen readers, keyboard use, readable contrast, clear language, and accessible error messages.
- **Reliability:** Monitor forms, notifications, bookings, backups, and service availability.
- **Maintainability:** Keep content editable by the practice and document operational procedures.
- **Clinical boundaries:** Make clear that website content and AI support do not replace an SLP assessment or individualized professional advice.

## 7. Key decisions to resolve

1. What populations, services, languages, and locations should the site describe?
2. Should visitors book directly, or submit requests for staff approval?
3. Which calendar or practice-management system should be the source of truth for appointments?
4. Will accounts support caregivers booking or managing appointments for minors?
5. What client information, if any, belongs in this website rather than an existing clinical record system?
6. Which privacy, health-information, accessibility, and record-retention requirements apply to the practice’s location and clients?
7. What should the AI assistant be allowed to use, and what should always require clinician involvement?

## 8. Recommended first release

Start with Phase 0 and Phase 1: agree on the practice content and policies, then publish the public site and a carefully limited contact path. Add accounts and scheduling only after the practice has chosen how client information and appointment records will be handled. Treat the AI assistant as a later, separately reviewed capability.
