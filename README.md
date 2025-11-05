# NumaCare MVP

A prototype Expo + React Native application demonstrating the NumaCare workflow, built with expo-router and nativewind. The app simulates how the portal replaces the traditional "team member" role by routing documents, tracking insurance communication, and helping physicians and patients stay informed.

## Run it locally

```bash
npm install
npm run start
```

Launch the Expo app on iOS, Android, or the web to explore the workflow. The seed data preloads active cases across each stage so the UI surfaces every part of the process immediately.

## Screens & roles

- **Overview** – Control center summarising active cases, automation coverage, and unresolved notifications.
- **Doctor Workbench** – Upload prescriptions or reports, respond to insurance follow-ups, and mark alerts as handled.
- **Pre-Auth Command Center** – Forward packets to insurance, record inbound replies, upload EOBs, and log outreach that happened outside the portal.
- **Insurance Pipeline** – Snapshot of everything sitting with the carrier plus a quick communication log.
- **Patient Experience** – Send EOB notifications, share payment instructions, and mark fulfillment complete once pickup or delivery is scheduled.

## How the workflow addresses the requirements

1. **Document upload** – Doctors create cases from the Doctor tab; the portal immediately queues pre-auth and can auto-forward packets.
2. **Internal notification** – Every upload, response, or EOB triggers notifications scoped to the role that must respond next.
3. **Insurance communication** – Pre-auth can send emails outside the portal; every outbound or inbound touchpoint is logged for audit purposes.
4. **Insurance response handling** – The portal records carrier replies, flags follow-ups for doctors, and stores the response document.
5. **Physician update** – Insurance responses and EOB uploads automatically raise doctor notifications.
6. **Prescription upload** – Covered in the Doctor Workbench form, including contextual notes for the automation engine.
7. **Team notification (pre-auth)** – Pre-auth notifications fire whenever new docs or EOBs arrive.
8. **Insurance follow-up** – Quick actions let pre-auth email or call insurance while keeping the log inside the portal.
9. **EOB submission** – Uploading an EOB stores the document, validates patient responsibility, and queues notifications to doctor and patient.
10. **Patient notification** – Dedicated tooling to draft the patient email, highlight copay, and share payment links.
11. **Final patient action** – Track fulfillment outcomes so the portal can close the loop and alert the physician when everything is complete.

Travis' feedback is reflected by renaming the "team member" role to **pre-auth**, ensuring they can communicate outside the portal while the system still automates the forwarding and intake of every message.

## Testing & next steps

- `npm run lint` checks TypeScript, ESLint, and Prettier formatting.
- Replace the seed data in `src/data/seed.ts` with live API calls to connect real inventories, notifications, or document storage.
- Hook the action handlers in `src/context/WorkflowContext.tsx` to backend endpoints once authentication and storage are ready.

