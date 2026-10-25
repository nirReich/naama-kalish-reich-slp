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
- Map each information flow: purpose, data fields, people with access, hosting location, vendors/processors, retention, deletion, and any onward disclosure.
- Determine the legal classification and required security level of each database; assess registration/notice and DPO duties against current statutory thresholds rather than assuming an exemption.
- Define a privacy notice and patient-rights process covering collection notice, purpose, required/optional fields and consequences of not providing them, recipients, contact details for the data controller, access and correction requests, and applicable deletion requests.
- Define clinical record, confidentiality, minor/guardian authority, record access/disclosure, and retention rules for the actual practice setting; confirm uncertain requirements with Israeli counsel or the relevant regulator.
- Define vendor approval and written processor arrangements, including permitted processing, confidentiality, security controls, subcontractors, data location/transfers, incident notification, return/deletion, and audit cooperation.
- Create an incident response procedure, including assessment and reporting to the Privacy Protection Authority where required, and a process to notify affected people when legally required.
- Create the visual direction, content inventory, and initial site map.

**Deliverables:** approved requirements, site map, content plan, data-flow outline, architecture decision, and prioritized backlog.

### Backend architecture and stack

**Approved direction:** Build the backend in the existing repository under `nkr_slp_backend/`, as a standard-mode NestJS application with its own dependencies and configuration. The Next.js frontend will consume a versioned REST API over HTTPS.

| Layer | Choice | Guidance |
|---|---|---|
| Framework | NestJS (TypeScript) | Modular services/controllers with dependency injection; start as a focused standalone app. |
| Database | PostgreSQL | Relational storage for inquiries and, later, appointment and account data; use database constraints to prevent overlapping bookings. |
| Data layer | Prisma | Schema and migrations live in the backend. Generated Prisma models stay server-side; expose API DTOs/OpenAPI contracts to the frontend instead of sharing database models. |
| Validation | `class-validator` + `class-transformer` | Validate DTOs through a global Nest `ValidationPipe` with transformation, whitelisting, and rejection of unknown fields. |
| Authentication | Defer to Phase 3 | Phase 2 can accept a limited public inquiry. Any staff queue or inquiry-management endpoints must require authenticated, role-limited access. Choose the session/cookie or token design when the portal requirements are known. |

**Simple future patient and medical-record model (subject to the clinical-record review above):** Keep basic patient details and insurance information in `patients`; store each visit’s diagnosis and treatment details in `medical_records`, linked by `patient_id`. This is a starting point for discussion, not approval to collect clinical data in the public inquiry workflow.

```sql
CREATE TABLE patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(30),
    phone VARCHAR(30),
    email VARCHAR(255),
    address TEXT,
    insurance_info TEXT
);

CREATE TABLE medical_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    record_date DATE NOT NULL,
    doctor_name VARCHAR(200),
    diagnosis TEXT,
    treatment_description TEXT,
    treatment_summary TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);
```

**Initial data boundary:** Phase 2 should collect only the minimum contact and scheduling details needed to respond. Do not collect detailed clinical histories, diagnoses, therapy notes, or medical documents in the public form or generic inquiry database. Keep clinical records in an appropriate clinical record system unless a separate privacy, security, retention, access, and vendor review approves storing them in this application. Appointment reminders should avoid health details.

**Implementation sequence:** Establish hosting, database, secret management, backups, and privacy/security procedures before real client data is introduced. Start with a minimal inquiry endpoint; add appointment persistence and PostgreSQL overlap protection in Phase 4; introduce accounts and authorization in Phase 3 only after defining adult, minor, and guardian workflows.

**Privacy reference point:** Under Israel’s Privacy Protection Law as amended by Amendment 13, health information is “information of special sensitivity.” The Patient Rights Law explicitly includes SLPs in its definition of a care provider and imposes confidentiality duties. Apply data minimization, purpose limitation, confidentiality, restricted access, secure transfer, retention/deletion rules, and documented vendor review from the first phase that collects identifiable information. Classify each database under the Data Security Regulations before production use; a solo practitioner’s clinical database may not qualify for the “database managed by an individual” category because professional-secrecy obligations are an express exception. Confirm the clinic-specific duties and record-retention periods with qualified Israeli counsel before storing clinical records. References: [Privacy Protection Authority Amendment 13 FAQ](https://www.gov.il/he/pages/tikun13_qa?chapterIndex=6), [Patient Rights Law](https://www.btl.gov.il/Laws1/00_0037_000000.pdf), and [Privacy Protection (Data Security) Regulations](https://www.gov.il/BlobFolder/generalpage/1files/he/IT2017.pdf).

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

**Contact form safeguards:** Before collection, show a clear privacy notice identifying the practice/controller, why each field is requested, whether it is required, the consequences of not providing it, who may receive the information, and how to contact the practice. Ask only for information needed to respond. Tell visitors not to submit urgent concerns or detailed health information through a general form. Provide a phone or other suitable contact route. Do not treat form submission as consent to unrelated use or disclosure.

**Exit criteria:** Key content is approved; pages work on mobile and keyboard navigation; form delivery and spam protection are verified; privacy and contact notices are published; collected fields, recipients, storage, and deletion behavior match the approved data-flow and privacy decisions.

### Phase 2 — Contact and intake workflow

**Purpose:** Help the practice receive and respond to inquiries consistently.

**Features:**
- Contact-form notifications to a practice-controlled mailbox or secure queue.
- Inquiry status tracking and response notes for authorized staff.
- Optional consultation request flow that collects only the minimum needed to arrange a response.
- Clear acknowledgment to the visitor, expected response time, and alternate contact option.
- A defined process for deleting or transferring inquiry records into the practice’s official record system when appropriate.
- A documented response process for requests to access or correct personal information and, where applicable, delete it.
- Vendor and email-delivery arrangements reviewed before real personal information is sent to them; avoid putting clinical details in email, SMS, or other general-purpose messages.

**Exit criteria:** The practice can receive, triage, and close inquiries; notification failures are visible; access to inquiries is restricted and documented; the retention/deletion, rights-request, vendor, and incident procedures are operational.

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

- **Privacy:** Collect the minimum information needed for a defined purpose; provide the required collection notice; honor applicable access, correction, and deletion rights; define retention and secure deletion; document disclosures and vendor processing. Health information is information of special sensitivity. The Patient Rights Law’s confidentiality duties apply to SLPs.
- **Data security:** Classify each database under the Data Security Regulations, document the applicable security level and required controls, and reassess when purpose, sensitivity, scale, access population, or vendors change. A solo-practice clinical database may be outside the “database managed by an individual” category because professional-secrecy obligations are an express exception; do not assume the small-practice category applies.
- **Regulatory administration:** At launch and after material changes, assess whether each database requires registration or notice to the Privacy Protection Authority and whether the practice must appoint a DPO. Amendment 13 changed registration rules but does not remove other privacy and security duties.
- **Vendors and transfers:** Before a processor receives personal information, document the permitted purpose, access, safeguards, subcontracting, location/transfer, incident reporting, and return/deletion terms. Assess any transfer outside Israel under the applicable transfer rules.
- **Incident response:** Maintain a documented procedure to contain, assess, record, and report security incidents, including immediate reporting to the Authority for severe incidents where required by the regulations.
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
6. Which privacy, health-information, accessibility, and record-retention requirements apply to the practice’s location and clients, and what database security level, registration/notice, DPO, vendor, and incident-reporting duties follow from the actual setup?
7. What should the AI assistant be allowed to use, and what should always require clinician involvement?

## 8. Recommended first release

Start with Phase 0 and Phase 1: agree on the practice content and policies, then publish the public site and a carefully limited contact path. Add accounts and scheduling only after the practice has chosen how client information and appointment records will be handled. Treat the AI assistant as a later, separately reviewed capability.
