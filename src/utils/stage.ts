import { CareCaseStage } from '@/types/workflow';

export const stageCopy: Record<
  CareCaseStage,
  { label: string; hint: string; tone: 'default' | 'success' | 'warning' | 'danger' }
> = {
  'doctor-submitted': {
    label: 'Doctor Submitted',
    hint: 'New case logged by physician.',
    tone: 'default',
  },
  'awaiting-pre-auth': {
    label: 'Awaiting Pre-Auth',
    hint: 'Pre-auth queue review needed.',
    tone: 'warning',
  },
  'pre-auth-review': {
    label: 'Pre-Auth Review',
    hint: 'Portal preparing insurance package.',
    tone: 'default',
  },
  'awaiting-insurance-response': {
    label: 'With Insurance',
    hint: 'Insurance review in progress.',
    tone: 'warning',
  },
  'insurance-response-received': {
    label: 'Insurance Responded',
    hint: 'Verify response and upload EOB.',
    tone: 'default',
  },
  'awaiting-doctor-ack': {
    label: 'Follow-up Needed',
    hint: 'Insurance needs more information.',
    tone: 'danger',
  },
  'awaiting-patient-action': {
    label: 'Prepare Patient Notification',
    hint: 'Confirm billing, share EOB.',
    tone: 'warning',
  },
  'ready-for-fulfillment': {
    label: 'Ready for Fulfillment',
    hint: 'Patient has details and can schedule.',
    tone: 'success',
  },
  completed: {
    label: 'Completed',
    hint: 'Case closed and archived.',
    tone: 'success',
  },
  'attention-needed': {
    label: 'Attention Needed',
    hint: 'Portal flagged an issue.',
    tone: 'danger',
  },
};
