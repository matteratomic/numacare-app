import {
  CareCase,
  CaseDocument,
  CaseEvent,
  CommunicationLogEntry,
  PortalNotification,
  WorkflowState,
} from '@/types/workflow';

const now = new Date();

const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString();

const buildSeed = (): { cases: CareCase[]; notifications: PortalNotification[] } => {
  const caseIdOne = 'case-seed-001';
  const caseIdTwo = 'case-seed-002';
  const caseIdThree = 'case-seed-003';

  const caseOneDocuments: CaseDocument[] = [
    {
      id: 'doc-001',
      type: 'clinical-report',
      title: 'Lumbar MRI Report',
      uploadedBy: 'doctor',
      notes: 'Imaging indicates degenerative disc disease. Requires custom brace.',
      createdAt: minutesAgo(360),
    },
    {
      id: 'doc-002',
      type: 'prescription',
      title: 'Prescription – LSO Brace',
      uploadedBy: 'doctor',
      notes: 'Brace to be worn during daytime activity.',
      createdAt: minutesAgo(350),
    },
    {
      id: 'doc-003',
      type: 'insurance-response',
      title: 'Insurance additional info request',
      uploadedBy: 'pre-auth',
      notes: 'Need clarification on prior conservative therapy.',
      createdAt: minutesAgo(180),
    },
  ];

  const caseOneEvents: CaseEvent[] = [
    {
      id: 'evt-001',
      timestamp: minutesAgo(360),
      title: 'Doctor uploaded MRI report',
      description: 'Portal auto-notified pre-auth with case summary.',
      actor: 'doctor',
      category: 'document',
    },
    {
      id: 'evt-002',
      timestamp: minutesAgo(350),
      title: 'Prescription uploaded',
      description: 'Prescription forwarded to pre-auth queue automatically.',
      actor: 'doctor',
      category: 'document',
    },
    {
      id: 'evt-003',
      timestamp: minutesAgo(300),
      title: 'Pre-auth forwarded documents to insurance',
      description: 'Portal generated email package with docs and sent tracking link.',
      actor: 'pre-auth',
      category: 'workflow',
    },
    {
      id: 'evt-004',
      timestamp: minutesAgo(180),
      title: 'Insurance requested additional information',
      description: 'Email received from insurance requesting prior therapy notes.',
      actor: 'insurance',
      category: 'communication',
    },
    {
      id: 'evt-005',
      timestamp: minutesAgo(45),
      title: 'Portal drafted follow-up to doctor',
      description: 'Awaiting doctor confirmation on conservative therapy details.',
      actor: 'system',
      category: 'workflow',
    },
  ];

  const caseOneComms: CommunicationLogEntry[] = [
    {
      id: 'comm-001',
      timestamp: minutesAgo(300),
      direction: 'outbound',
      medium: 'email',
      actor: 'pre-auth',
      summary: 'Submitted pre-auth package to insurance via secure email.',
      caseId: caseIdOne,
    },
    {
      id: 'comm-002',
      timestamp: minutesAgo(180),
      direction: 'inbound',
      medium: 'email',
      actor: 'insurance',
      summary: 'Insurance reviewer requested proof of conservative therapy trial.',
      followUpRequired: true,
      caseId: caseIdOne,
    },
  ];

  const caseTwoDocuments: CaseDocument[] = [
    {
      id: 'doc-101',
      type: 'clinical-report',
      title: 'Sleep study results',
      uploadedBy: 'doctor',
      notes: 'Home sleep study confirms obstructive sleep apnea.',
      createdAt: minutesAgo(720),
    },
    {
      id: 'doc-102',
      type: 'prescription',
      title: 'Prescription – Auto CPAP',
      uploadedBy: 'doctor',
      notes: 'Auto set between 8-12 cmH₂O.',
      createdAt: minutesAgo(700),
    },
    {
      id: 'doc-103',
      type: 'insurance-response',
      title: 'Insurance approval letter',
      uploadedBy: 'pre-auth',
      notes: 'Approved contingent on patient copay collection.',
      createdAt: minutesAgo(120),
    },
    {
      id: 'doc-104',
      type: 'eob',
      title: 'EOB – Auto CPAP',
      uploadedBy: 'pre-auth',
      notes: 'Insurance pays $1,180. Patient responsibility $95.',
      createdAt: minutesAgo(60),
    },
  ];

  const caseTwoEvents: CaseEvent[] = [
    {
      id: 'evt-101',
      timestamp: minutesAgo(720),
      title: 'Doctor uploaded sleep study',
      description: 'Portal routed case to pre-auth.',
      actor: 'doctor',
      category: 'document',
    },
    {
      id: 'evt-102',
      timestamp: minutesAgo(650),
      title: 'Pre-auth auto-forwarded packet',
      description: 'Automation emailed insurer with required attachments.',
      actor: 'system',
      category: 'workflow',
    },
    {
      id: 'evt-103',
      timestamp: minutesAgo(120),
      title: 'Insurance approved device',
      description: 'Approval letter uploaded and doctor notified.',
      actor: 'insurance',
      category: 'communication',
    },
    {
      id: 'evt-104',
      timestamp: minutesAgo(60),
      title: 'EOB uploaded',
      description: 'Portal ready to notify patient with payment link.',
      actor: 'pre-auth',
      category: 'document',
    },
  ];

  const caseTwoComms: CommunicationLogEntry[] = [
    {
      id: 'comm-101',
      timestamp: minutesAgo(650),
      direction: 'outbound',
      medium: 'email',
      actor: 'system',
      summary: 'Portal sent pre-auth packet to ClearBlue Insurance.',
      caseId: caseIdTwo,
    },
    {
      id: 'comm-102',
      timestamp: minutesAgo(120),
      direction: 'inbound',
      medium: 'email',
      actor: 'insurance',
      summary: 'Approval letter received with EOB pending.',
      caseId: caseIdTwo,
    },
  ];

  const caseThreeDocuments: CaseDocument[] = [
    {
      id: 'doc-201',
      type: 'clinical-report',
      title: 'Ortho note – ACL repair',
      uploadedBy: 'doctor',
      createdAt: minutesAgo(1440),
    },
    {
      id: 'doc-202',
      type: 'prescription',
      title: 'Prescription – Hinged knee brace',
      uploadedBy: 'doctor',
      createdAt: minutesAgo(1430),
    },
    {
      id: 'doc-203',
      type: 'insurance-response',
      title: 'Insurance approval',
      uploadedBy: 'pre-auth',
      createdAt: minutesAgo(600),
      notes: 'Approved at 100% after appeal.',
    },
    {
      id: 'doc-204',
      type: 'eob',
      title: 'EOB – Hinged knee brace',
      uploadedBy: 'pre-auth',
      createdAt: minutesAgo(420),
      notes: 'Patient responsibility $0.',
    },
  ];

  const caseThreeEvents: CaseEvent[] = [
    {
      id: 'evt-201',
      timestamp: minutesAgo(1440),
      title: 'Case created',
      description: 'Portal packaged documents for pre-auth.',
      actor: 'doctor',
      category: 'document',
    },
    {
      id: 'evt-202',
      timestamp: minutesAgo(900),
      title: 'Appeal submitted by portal',
      description: 'Automation generated appeal letter after initial denial.',
      actor: 'system',
      category: 'workflow',
    },
    {
      id: 'evt-203',
      timestamp: minutesAgo(600),
      title: 'Insurance approved after appeal',
      description: 'Doctor notified automatically.',
      actor: 'insurance',
      category: 'communication',
    },
    {
      id: 'evt-204',
      timestamp: minutesAgo(300),
      title: 'Patient notified of $0 cost',
      description: 'Portal emailed scheduling link.',
      actor: 'system',
      category: 'notification',
    },
    {
      id: 'evt-205',
      timestamp: minutesAgo(60),
      title: 'Patient scheduled pickup',
      description: 'Portal confirmed final fulfillment.',
      actor: 'patient',
      category: 'workflow',
    },
  ];

  const caseThreeComms: CommunicationLogEntry[] = [
    {
      id: 'comm-201',
      timestamp: minutesAgo(900),
      direction: 'outbound',
      medium: 'email',
      actor: 'system',
      summary: 'Portal submitted appeal package with denial context.',
      caseId: caseIdThree,
    },
    {
      id: 'comm-202',
      timestamp: minutesAgo(420),
      direction: 'inbound',
      medium: 'email',
      actor: 'insurance',
      summary: 'Appeal accepted; approval letter attached.',
      caseId: caseIdThree,
    },
  ];

  const cases: CareCase[] = [
    {
      id: caseIdOne,
      patientName: 'Noah Carter',
      insuranceProvider: 'Blue Horizon Health',
      product: 'LSO Spinal Brace',
      diagnosis: 'Degenerative Disc Disease',
      stage: 'awaiting-doctor-ack',
      createdAt: minutesAgo(360),
      updatedAt: minutesAgo(45),
      doctorName: 'Dr. Patel',
      estimatedCopay: '$85.00',
      paymentLink: 'https://numacare.example/pay/CASE-001',
      documents: caseOneDocuments,
      events: caseOneEvents,
      communications: caseOneComms,
    },
    {
      id: caseIdTwo,
      patientName: 'Ava Martinez',
      insuranceProvider: 'ClearBlue Insurance',
      product: 'Auto CPAP',
      diagnosis: 'Obstructive Sleep Apnea',
      stage: 'awaiting-patient-action',
      createdAt: minutesAgo(720),
      updatedAt: minutesAgo(60),
      doctorName: 'Dr. Chen',
      estimatedCopay: '$95.00',
      paymentLink: 'https://numacare.example/pay/CASE-002',
      documents: caseTwoDocuments,
      events: caseTwoEvents,
      communications: caseTwoComms,
    },
    {
      id: caseIdThree,
      patientName: 'Liam Brooks',
      insuranceProvider: 'Summit Mutual',
      product: 'Hinged Knee Brace',
      diagnosis: 'Post-op stabilization',
      stage: 'completed',
      createdAt: minutesAgo(1440),
      updatedAt: minutesAgo(60),
      doctorName: 'Dr. Owens',
      estimatedCopay: '$0.00',
      paymentLink: 'https://numacare.example/pay/CASE-003',
      documents: caseThreeDocuments,
      events: caseThreeEvents,
      communications: caseThreeComms,
    },
  ];

  const notifications: PortalNotification[] = [
    {
      id: 'note-001',
      title: 'Insurance needs prior therapy notes',
      message: 'Upload chart notes summarizing physical therapy completed in the last 90 days.',
      audience: 'doctor',
      createdAt: minutesAgo(45),
      read: false,
      caseId: caseIdOne,
      relatedEventId: 'evt-005',
    },
    {
      id: 'note-002',
      title: 'Follow-up with insurance in 24 hours',
      message: 'Reminder set to check on outstanding request tomorrow morning.',
      audience: 'pre-auth',
      createdAt: minutesAgo(40),
      read: false,
      caseId: caseIdOne,
    },
    {
      id: 'note-101',
      title: 'Share EOB with patient',
      message:
        'Portal drafted patient email with payment link https://numacare.example/pay/CASE-002',
      audience: 'pre-auth',
      createdAt: minutesAgo(55),
      read: false,
      caseId: caseIdTwo,
    },
    {
      id: 'note-102',
      title: 'Patient notification pending',
      message: 'Email patient the approval with $95 copay details.',
      audience: 'patient',
      createdAt: minutesAgo(50),
      read: false,
      caseId: caseIdTwo,
    },
    {
      id: 'note-201',
      title: 'Case completed',
      message: 'Patient fulfilled order; archive case after quality check.',
      audience: 'doctor',
      createdAt: minutesAgo(30),
      read: true,
      caseId: caseIdThree,
    },
  ];

  return {
    cases,
    notifications,
  };
};

export const buildSeedState = (): WorkflowState => {
  const seed = buildSeed();

  return {
    cases: seed.cases,
    notifications: seed.notifications,
    autoPreAuthEnabled: true,
  };
};
