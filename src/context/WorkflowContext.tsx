import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { buildSeedState } from '@/data/seed';
import {
  CareCase,
  CaseDocument,
  CommunicationLogEntry,
  DocumentType,
  PortalNotification,
  WorkflowActor,
  WorkflowState,
} from '@/types/workflow';

type DoctorSubmissionInput = {
  patientName: string;
  insuranceProvider: string;
  product: string;
  diagnosis: string;
  documentType: Extract<DocumentType, 'clinical-report' | 'prescription' | 'supporting'>;
  documentTitle: string;
  notes?: string;
  doctorName: string;
};

type ForwardToInsuranceInput = {
  caseId: string;
  summary: string;
  medium?: 'email' | 'portal' | 'call';
};

type InsuranceResponseInput = {
  caseId: string;
  summary: string;
  requiresFollowUp?: boolean;
};

type UploadEobInput = {
  caseId: string;
  totalApproved: string;
  patientResponsibility: string;
  notes?: string;
  paymentLink?: string;
};

type PatientNotificationInput = {
  caseId: string;
  message: string;
  copayAmount?: string;
  actions?: string;
};

type CompletePatientActionInput = {
  caseId: string;
  fulfillmentDetails: string;
};

type SupportingDocumentInput = {
  caseId: string;
  title: string;
  notes?: string;
  type?: DocumentType;
  uploadedBy: Extract<WorkflowActor, 'doctor' | 'pre-auth' | 'system'>;
};

type LogCommunicationInput = {
  caseId: string;
  direction: CommunicationLogEntry['direction'];
  medium: CommunicationLogEntry['medium'];
  actor: WorkflowActor;
  summary: string;
  followUpRequired?: boolean;
};

interface WorkflowContextValue {
  state: WorkflowState;
  createDoctorSubmission: (input: DoctorSubmissionInput) => CareCase;
  sendToInsurance: (input: ForwardToInsuranceInput) => void;
  recordInsuranceResponse: (input: InsuranceResponseInput) => void;
  uploadEobToPortal: (input: UploadEobInput) => void;
  notifyPatientOfEob: (input: PatientNotificationInput) => void;
  completePatientAction: (input: CompletePatientActionInput) => void;
  addSupportingDocument: (input: SupportingDocumentInput) => void;
  logCommunication: (input: LogCommunicationInput) => void;
  markNotificationRead: (id: string) => void;
  toggleAutoPreAuth: () => void;
}

const WorkflowContext = createContext<WorkflowContextValue | undefined>(undefined);

const cloneCase = (source: CareCase): CareCase => ({
  ...source,
  documents: [...source.documents],
  events: [...source.events],
  communications: [...source.communications],
});

const formatDescription = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ');

export const WorkflowProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<WorkflowState>(() => buildSeedState());

  const generateId = useCallback(
    (prefix: string) =>
      `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`,
    []
  );

  const updateCase = useCallback(
    (
      caseId: string,
      mutator: (draft: CareCase) => CareCase,
      extra?: (draft: CareCase) => { notifications?: PortalNotification[] }
    ) => {
      const timestamp = new Date().toISOString();

      setState((prev) => {
        let found = false;
        const notifications = [...prev.notifications];

        const cases = prev.cases.map((existing) => {
          if (existing.id !== caseId) {
            return existing;
          }

          found = true;
          const nextDraft = mutator(cloneCase(existing));
          nextDraft.updatedAt = timestamp;

          if (extra) {
            const outcome = extra(nextDraft);
            if (outcome?.notifications) {
              notifications.unshift(...outcome.notifications);
            }
          }

          return nextDraft;
        });

        if (!found) {
          return prev;
        }

        return {
          ...prev,
          cases,
          notifications,
        };
      });
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((note) =>
        note.id === id
          ? {
              ...note,
              read: true,
            }
          : note
      ),
    }));
  }, []);

  const toggleAutoPreAuth = useCallback(() => {
    setState((prev) => ({
      ...prev,
      autoPreAuthEnabled: !prev.autoPreAuthEnabled,
    }));
  }, []);

  const logCommunication = useCallback(
    (input: LogCommunicationInput) => {
      const timestamp = new Date().toISOString();
      updateCase(
        input.caseId,
        (draft) => {
          const next = cloneCase(draft);
          next.communications = [
            {
              id: generateId('comm'),
              timestamp,
              direction: input.direction,
              medium: input.medium,
              actor: input.actor,
              summary: input.summary,
              followUpRequired: input.followUpRequired,
              caseId: input.caseId,
            },
            ...next.communications,
          ];
          next.events = [
            {
              id: generateId('evt'),
              timestamp,
              title: `${input.actor === 'pre-auth' ? 'Pre-auth' : input.actor} logged communication`,
              description: input.summary,
              actor: input.actor,
              category: 'communication',
            },
            ...next.events,
          ];
          return next;
        },
        () => ({
          notifications: [
            {
              id: generateId('note'),
              title: 'Communication added',
              message: `${input.actor} noted: ${input.summary}`,
              audience: input.actor === 'insurance' ? 'pre-auth' : 'system',
              createdAt: timestamp,
              read: false,
              caseId: input.caseId,
            },
          ],
        })
      );
    },
    [generateId, updateCase]
  );

  const sendToInsurance = useCallback(
    (input: ForwardToInsuranceInput) => {
      const timestamp = new Date().toISOString();

      updateCase(
        input.caseId,
        (draft) => {
          const next = cloneCase(draft);
          next.stage = 'awaiting-insurance-response';

          const eventId = generateId('evt');
          next.events = [
            {
              id: eventId,
              timestamp,
              title: 'Pre-auth sent package to insurance',
              description: input.summary,
              actor: 'pre-auth',
              category: 'workflow',
            },
            ...next.events,
          ];

          next.communications = [
            {
              id: generateId('comm'),
              timestamp,
              direction: 'outbound',
              medium: input.medium ?? 'email',
              actor: 'pre-auth',
              summary: input.summary,
              caseId: input.caseId,
            },
            ...next.communications,
          ];

          return next;
        },
        (draft) => ({
          notifications: [
            {
              id: generateId('note'),
              title: 'Insurance package dispatched',
              message: `Portal recorded outbound ${input.medium ?? 'email'} to insurance.`,
              audience: 'pre-auth',
              createdAt: timestamp,
              read: false,
              caseId: draft.id,
            },
          ],
        })
      );
    },
    [generateId, updateCase]
  );

  const createDoctorSubmission = useCallback(
    (input: DoctorSubmissionInput) => {
      const timestamp = new Date().toISOString();
      const caseId = generateId('case');
      const documentId = generateId('doc');
      const eventId = generateId('evt');

      const doctorDocument: CaseDocument = {
        id: documentId,
        type: input.documentType,
        title: input.documentTitle,
        uploadedBy: 'doctor',
        notes: input.notes,
        createdAt: timestamp,
      };

      const newCase: CareCase = {
        id: caseId,
        patientName: input.patientName,
        insuranceProvider: input.insuranceProvider,
        product: input.product,
        diagnosis: input.diagnosis,
        stage: 'awaiting-pre-auth',
        createdAt: timestamp,
        updatedAt: timestamp,
        doctorName: input.doctorName,
        documents: [doctorDocument],
        events: [
          {
            id: eventId,
            timestamp,
            title: `${input.doctorName} uploaded ${input.documentType === 'prescription' ? 'a prescription' : 'documentation'}`,
            description: formatDescription(
              'Case created for',
              input.patientName,
              'and routed to pre-auth queue.'
            ),
            actor: 'doctor',
            category: 'document',
          },
        ],
        communications: [],
      };

      setState((prev) => ({
        autoPreAuthEnabled: prev.autoPreAuthEnabled,
        cases: [newCase, ...prev.cases],
        notifications: [
          {
            id: generateId('note'),
            title: 'New case awaiting pre-auth review',
            message: `${input.patientName} – ${input.product}`,
            audience: 'pre-auth',
            createdAt: timestamp,
            read: false,
            caseId,
            relatedEventId: eventId,
          },
          ...prev.notifications,
        ],
      }));

      if (state.autoPreAuthEnabled) {
        setTimeout(() => {
          sendToInsurance({
            caseId,
            summary: 'Auto-forwarded by portal automation based on new doctor submission.',
            medium: 'portal',
          });
        }, 0);
      }

      return newCase;
    },
    [generateId, sendToInsurance, state.autoPreAuthEnabled]
  );

  const recordInsuranceResponse = useCallback(
    (input: InsuranceResponseInput) => {
      const timestamp = new Date().toISOString();

      updateCase(
        input.caseId,
        (draft) => {
          const next = cloneCase(draft);
          const eventId = generateId('evt');
          const documentId = generateId('doc');
          const summary = input.summary.trim();

          next.stage = input.requiresFollowUp
            ? 'awaiting-doctor-ack'
            : 'insurance-response-received';

          next.documents = [
            {
              id: documentId,
              type: 'insurance-response',
              title: 'Insurance response',
              uploadedBy: 'pre-auth',
              notes: summary,
              createdAt: timestamp,
            },
            ...next.documents,
          ];

          next.events = [
            {
              id: eventId,
              timestamp,
              title: 'Insurance response received',
              description: summary,
              actor: 'insurance',
              category: 'communication',
            },
            ...next.events,
          ];

          next.communications = [
            {
              id: generateId('comm'),
              timestamp,
              direction: 'inbound',
              medium: 'email',
              actor: 'insurance',
              summary,
              followUpRequired: input.requiresFollowUp,
              caseId: input.caseId,
            },
            ...next.communications,
          ];

          return next;
        },
        (draft) => ({
          notifications: [
            {
              id: generateId('note'),
              title: 'Insurance responded',
              message: input.summary,
              audience: 'doctor',
              createdAt: timestamp,
              read: false,
              caseId: draft.id,
            },
            {
              id: generateId('note'),
              title: input.requiresFollowUp
                ? 'Follow-up required before approval'
                : 'Review response details',
              message: input.requiresFollowUp
                ? 'Portal flagged this response. Provide requested info to keep case moving.'
                : 'Everything looks good. Prepare to upload the EOB once received.',
              audience: 'pre-auth',
              createdAt: timestamp,
              read: false,
              caseId: draft.id,
            },
          ],
        })
      );
    },
    [generateId, updateCase]
  );

  const addSupportingDocument = useCallback(
    (input: SupportingDocumentInput) => {
      const timestamp = new Date().toISOString();

      updateCase(input.caseId, (draft) => {
        const next = cloneCase(draft);
        const docType: DocumentType = input.type ?? 'supporting';
        const documentTitle = input.title || 'Supporting documentation';

        next.documents = [
          {
            id: generateId('doc'),
            type: docType,
            title: documentTitle,
            uploadedBy: input.uploadedBy,
            notes: input.notes,
            createdAt: timestamp,
          },
          ...next.documents,
        ];

        next.events = [
          {
            id: generateId('evt'),
            timestamp,
            title: `${input.uploadedBy === 'doctor' ? 'Doctor' : 'Portal'} uploaded ${documentTitle}`,
            description: input.notes ?? 'Added supplemental documentation to case.',
            actor: input.uploadedBy,
            category: 'document',
          },
          ...next.events,
        ];

        if (next.stage === 'awaiting-doctor-ack') {
          next.stage = 'pre-auth-review';
        }

        return next;
      });
    },
    [generateId, updateCase]
  );

  const uploadEobToPortal = useCallback(
    (input: UploadEobInput) => {
      const timestamp = new Date().toISOString();

      updateCase(
        input.caseId,
        (draft) => {
          const next = cloneCase(draft);
          const docId = generateId('doc');
          const eventId = generateId('evt');

          next.stage = 'awaiting-patient-action';
          next.paymentLink = input.paymentLink ?? next.paymentLink;
          next.estimatedCopay = input.patientResponsibility;

          next.documents = [
            {
              id: docId,
              type: 'eob',
              title: 'Explanation of Benefits',
              uploadedBy: 'pre-auth',
              notes: formatDescription(`Approved amount: ${input.totalApproved}.`, input.notes),
              createdAt: timestamp,
            },
            ...next.documents,
          ];

          next.events = [
            {
              id: eventId,
              timestamp,
              title: 'EOB uploaded to portal',
              description: formatDescription(
                `Patient responsibility: ${input.patientResponsibility}.`,
                input.notes
              ),
              actor: 'pre-auth',
              category: 'document',
            },
            ...next.events,
          ];

          return next;
        },
        (draft) => ({
          notifications: [
            {
              id: generateId('note'),
              title: 'EOB ready for review',
              message: `Patient responsibility: ${input.patientResponsibility}.`,
              audience: 'doctor',
              createdAt: timestamp,
              read: false,
              caseId: draft.id,
            },
            {
              id: generateId('note'),
              title: 'Share EOB with patient',
              message:
                `Portal drafted patient email with payment link ${input.paymentLink ?? draft.paymentLink ?? ''}`.trim(),
              audience: 'pre-auth',
              createdAt: timestamp,
              read: false,
              caseId: draft.id,
            },
          ],
        })
      );
    },
    [generateId, updateCase]
  );

  const notifyPatientOfEob = useCallback(
    (input: PatientNotificationInput) => {
      const timestamp = new Date().toISOString();

      updateCase(
        input.caseId,
        (draft) => {
          const next = cloneCase(draft);
          next.stage = 'ready-for-fulfillment';
          const eventId = generateId('evt');

          next.events = [
            {
              id: eventId,
              timestamp,
              title: 'Portal notified patient',
              description: formatDescription(input.message, input.actions),
              actor: 'system',
              category: 'notification',
            },
            ...next.events,
          ];

          return next;
        },
        (draft) => ({
          notifications: [
            {
              id: generateId('note'),
              title: 'Patient notified of EOB',
              message: input.message,
              audience: 'patient',
              createdAt: timestamp,
              read: false,
              caseId: draft.id,
            },
          ],
        })
      );
    },
    [generateId, updateCase]
  );

  const completePatientAction = useCallback(
    (input: CompletePatientActionInput) => {
      const timestamp = new Date().toISOString();

      updateCase(
        input.caseId,
        (draft) => {
          const next = cloneCase(draft);
          next.stage = 'completed';
          next.events = [
            {
              id: generateId('evt'),
              timestamp,
              title: 'Patient fulfillment scheduled',
              description: input.fulfillmentDetails,
              actor: 'patient',
              category: 'workflow',
            },
            ...next.events,
          ];

          return next;
        },
        (draft) => ({
          notifications: [
            {
              id: generateId('note'),
              title: 'Case completed',
              message: input.fulfillmentDetails,
              audience: 'doctor',
              createdAt: timestamp,
              read: false,
              caseId: draft.id,
            },
          ],
        })
      );
    },
    [generateId, updateCase]
  );

  const value = useMemo<WorkflowContextValue>(
    () => ({
      state,
      createDoctorSubmission,
      sendToInsurance,
      recordInsuranceResponse,
      uploadEobToPortal,
      notifyPatientOfEob,
      completePatientAction,
      addSupportingDocument,
      logCommunication,
      markNotificationRead,
      toggleAutoPreAuth,
    }),
    [
      addSupportingDocument,
      completePatientAction,
      createDoctorSubmission,
      logCommunication,
      markNotificationRead,
      notifyPatientOfEob,
      recordInsuranceResponse,
      sendToInsurance,
      state,
      toggleAutoPreAuth,
      uploadEobToPortal,
    ]
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};

export const useWorkflow = (): WorkflowContextValue => {
  const context = useContext(WorkflowContext);

  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }

  return context;
};
