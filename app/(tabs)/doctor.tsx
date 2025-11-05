import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TabGroup } from '@/components/ui/TabGroup';
import { useWorkflow } from '@/context/WorkflowContext';
import { formatRelativeTime } from '@/utils/dates';
import { stageCopy } from '@/utils/stage';

export default function DoctorScreen() {
  const {
    state: { cases, notifications },
    createDoctorSubmission,
    addSupportingDocument,
    markNotificationRead,
  } = useWorkflow();

  const [patientName, setPatientName] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [product, setProduct] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [documentType, setDocumentType] = useState<'prescription' | 'clinical-report'>(
    'prescription'
  );
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [supportNote, setSupportNote] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  const doctorNotifications = useMemo(
    () => notifications.filter((note) => note.audience === 'doctor'),
    [notifications]
  );

  const followUpCases = useMemo(
    () =>
      cases.filter(
        (item) => item.stage === 'awaiting-doctor-ack' || item.stage === 'awaiting-pre-auth'
      ),
    [cases]
  );

  const handleSubmit = () => {
    if (
      !patientName ||
      !insuranceProvider ||
      !product ||
      !diagnosis ||
      !documentTitle ||
      !doctorName
    ) {
      setFormMessage('Fill in all required fields to create a new case.');
      return;
    }

    const created = createDoctorSubmission({
      patientName,
      insuranceProvider,
      product,
      diagnosis,
      documentType,
      documentTitle,
      notes,
      doctorName,
    });

    setFormMessage(`Portal queued ${created.patientName}'s case for pre-auth.`);

    setPatientName('');
    setInsuranceProvider('');
    setProduct('');
    setDiagnosis('');
    setDocumentTitle('');
    setNotes('');
    setDoctorName('');
    setDocumentType('prescription');
  };

  const handleSupportingUpload = () => {
    if (!selectedCaseId) {
      setSupportMessage('Choose a case that needs follow-up.');
      return;
    }

    if (!supportNote) {
      setSupportMessage('Add context so the portal can forward details.');
      return;
    }

    addSupportingDocument({
      caseId: selectedCaseId,
      title: 'Additional clinical notes',
      notes: supportNote,
      uploadedBy: 'doctor',
      type: 'supporting',
    });

    setSupportMessage('Notes uploaded. Portal notified pre-auth automatically.');
    setSupportNote('');
  };

  const createCaseTab = (
    <Card>
      <View
        className="gap-4">
        <SectionHeader title="Create case" subtitle="One upload notifies pre-auth instantly." />
        <View className="flex-row gap-2">
          <Button
            variant={documentType === 'prescription' ? 'primary' : 'outline'}
            onPress={() => setDocumentType('prescription')}
            className="flex-1">
            Prescription
          </Button>
          <Button
            variant={documentType === 'clinical-report' ? 'primary' : 'outline'}
            onPress={() => setDocumentType('clinical-report')}
            className="flex-1">
            Clinical note
          </Button>
        </View>
        <Input
          label="Doctor name"
          value={doctorName}
          onChangeText={setDoctorName}
          placeholder="Dr. Lee"
        />
        <Input
          label="Patient"
          value={patientName}
          onChangeText={setPatientName}
          placeholder="Jamie Rivera"
        />
        <Input
          label="Insurance"
          value={insuranceProvider}
          onChangeText={setInsuranceProvider}
          placeholder="Summit Health"
        />
        <Input
          label="Device / supply"
          value={product}
          onChangeText={setProduct}
          placeholder="Custom AFO brace"
        />
        <Input
          label="Diagnosis"
          value={diagnosis}
          onChangeText={setDiagnosis}
          placeholder="ICD-10 details"
        />
        <Input
          label="Document title"
          value={documentTitle}
          onChangeText={setDocumentTitle}
          placeholder="Prescription details"
        />
        <Input
          label="Notes for portal"
          value={notes}
          onChangeText={setNotes}
          placeholder="Instructions or context to include for insurance"
          multiline
        />
        {formMessage && (
          <Text className="text-sm text-sky-600 dark:text-sky-300">{formMessage}</Text>
        )}
        <Button onPress={handleSubmit}>Submit to NumaCare</Button>
      </View>
    </Card>
  );

  const requestsTab = (
    <View className="gap-4">
      <SectionHeader
        title="Requests from insurance"
        subtitle="Portal receives insurer emails and highlights anything the doctor must add."
      />
      {followUpCases.length === 0 ? (
        <Card
          title="No outstanding requests"
          description="Insurance is not waiting on doctor documentation."
        />
      ) : (
        <View className="gap-4">
          <Card
            title="Select a case"
            description="Portal forwards your upload back to pre-auth instantly.">
            <View className="gap-3">
              {followUpCases.map((item) => (
                <Button
                  key={item.id}
                  variant={selectedCaseId === item.id ? 'primary' : 'secondary'}
                  onPress={() => setSelectedCaseId(item.id)}>
                  {item.patientName} • {stageCopy[item.stage].label}
                </Button>
              ))}
            </View>
          </Card>
          <Card title="Upload follow-up">
            <View className="gap-4">
              <Input
                label="Summary"
                value={supportNote}
                onChangeText={setSupportNote}
                placeholder="e.g., Documenting six weeks of PT prior to brace order."
                multiline
              />
              {supportMessage && (
                <Text className="text-sm text-sky-600 dark:text-sky-300">{supportMessage}</Text>
              )}
              <Button onPress={handleSupportingUpload}>Send to portal</Button>
            </View>
          </Card>
        </View>
      )}
    </View>
  );

  const notificationsTab = (
    <View className="gap-4">
      <SectionHeader
        title="Doctor notifications"
        subtitle="Portal keeps physicians looped in automatically."
      />
      {doctorNotifications.length === 0 ? (
        <Card title="Nothing pending" description="The portal already relayed all updates." />
      ) : (
        doctorNotifications.map((note) => (
          <Card
            key={note.id}
            title={note.title}
            description={note.message}
            tone={note.read ? 'default' : 'warning'}>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {formatRelativeTime(note.createdAt)}
              </Text>
              {!note.read && (
                <Button variant="ghost" onPress={() => markNotificationRead(note.id)}>
                  Mark done
                </Button>
              )}
            </View>
          </Card>
        ))
      )}
    </View>
  );

  return (
    <Screen>
      <View
        style={{ marginTop: 32 }}
        className="gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Doctor Workbench
          </Text>
          <Text className="text-base text-slate-600 dark:text-slate-400">
            Upload prescriptions, respond to insurance follow-ups, and let the portal handle the
            pre-auth routing.
          </Text>
        </View>

        <TabGroup
          tabs={[
            { key: 'create', label: 'Create case', content: createCaseTab },
            { key: 'requests', label: 'Insurance requests', content: requestsTab },
            { key: 'notifications', label: 'Notifications', content: notificationsTab },
          ]}
        />
      </View>
    </Screen>
  );
}
