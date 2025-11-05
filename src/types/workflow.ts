export type CareCaseStage =
  | 'doctor-submitted'
  | 'awaiting-pre-auth'
  | 'pre-auth-review'
  | 'awaiting-insurance-response'
  | 'insurance-response-received'
  | 'awaiting-doctor-ack'
  | 'awaiting-patient-action'
  | 'ready-for-fulfillment'
  | 'completed'
  | 'attention-needed';

export type DocumentType =
  | 'clinical-report'
  | 'prescription'
  | 'insurance-response'
  | 'eob'
  | 'supporting';

export type WorkflowActor = 'doctor' | 'pre-auth' | 'insurance' | 'patient' | 'system';

export interface CaseEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: WorkflowActor;
  category: 'document' | 'communication' | 'notification' | 'workflow';
}

export interface CaseDocument {
  id: string;
  type: DocumentType;
  title: string;
  uploadedBy: WorkflowActor;
  notes?: string;
  createdAt: string;
}

export interface CommunicationLogEntry {
  id: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  medium: 'email' | 'call' | 'portal';
  actor: WorkflowActor;
  summary: string;
  followUpRequired?: boolean;
  caseId: string;
}

export type NotificationAudience = 'doctor' | 'pre-auth' | 'patient' | 'system';

export interface PortalNotification {
  id: string;
  title: string;
  message: string;
  audience: NotificationAudience;
  createdAt: string;
  read: boolean;
  caseId: string;
  relatedEventId?: string;
}

export interface CareCase {
  id: string;
  patientName: string;
  insuranceProvider: string;
  product: string;
  diagnosis: string;
  stage: CareCaseStage;
  createdAt: string;
  updatedAt: string;
  doctorName: string;
  autoPreAuth?: boolean;
  estimatedCopay?: string;
  paymentLink?: string;
  documents: CaseDocument[];
  events: CaseEvent[];
  communications: CommunicationLogEntry[];
}

export interface WorkflowState {
  cases: CareCase[];
  notifications: PortalNotification[];
  autoPreAuthEnabled: boolean;
}
