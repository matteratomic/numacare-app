import { useMemo, useState } from 'react';
import { Image, ScrollView, Modal, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// @ts-ignore – library ships without TypeScript definitions
import SignaturePad from 'react-native-signature-canvas';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TabGroup } from '@/components/ui/TabGroup';
import { useWorkflow } from '@/context/WorkflowContext';
import { formatRelativeTime } from '@/utils/dates';
import { stageCopy } from '@/utils/stage';
import BraceCatalog from 'components/BraceCatalog';
import CreateCaseStepper from 'components/CreateCaseStepper';

const productCatalog = [
  {
    id: 'afo-carbon',
    name: 'Carbon Fiber AFO',
    sku: 'AFO-CF-200',
    description: 'Lightweight ankle-foot orthosis with customizable struts.',
    sides: ['left', 'right'],
  },
  {
    id: 'knee-hinged',
    name: 'Hinged Knee Brace',
    sku: 'KNEE-HG-110',
    description: 'Post-op stabilization brace with adjustable ROM stops.',
    sides: ['left', 'right'],
  },
  {
    id: 'lso-modular',
    name: 'Modular LSO Brace',
    sku: 'LSO-MD-310',
    description: 'Lumbar-sacral orthosis with anterior support panel.',
    sides: ['bilateral'],
  },
] as const;

type ProductSide = (typeof productCatalog)[number]['sides'][number];

type AiChecklist = {
  documentation: boolean;
  measurements: boolean;
  signature: boolean;
  codes: boolean;
};

type CapturedAsset = {
  id: string;
  uri: string;
  label: string;
};

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

  const [chartUploads, setChartUploads] = useState<CapturedAsset[]>([]);
  const [measurementUploads, setMeasurementUploads] = useState<CapturedAsset[]>([]);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [aiReviewed, setAiReviewed] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<ProductSide | null>(null);

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

  const aiChecklist: AiChecklist = useMemo(
    () => ({
      documentation: chartUploads.length > 0,
      measurements: measurementUploads.length > 0,
      signature: Boolean(signatureData),
      codes: Boolean(diagnosis.trim()),
    }),
    [chartUploads.length, diagnosis, measurementUploads.length, signatureData]
  );

  const mockUpload = (type: 'chart' | 'measurement', asset?: CapturedAsset) => {
    if (asset) {
      if (type === 'chart') {
        setChartUploads((prev) => [asset, ...prev]);
      } else {
        setMeasurementUploads((prev) => [asset, ...prev]);
      }
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    const generated: CapturedAsset = {
      id: `${type}-${Date.now()}`,
      uri: '',
      label: `${type === 'chart' ? 'Chart note' : 'Measurement'} • ${timestamp}`,
    };

    if (type === 'chart') {
      setChartUploads((prev) => [generated, ...prev]);
    } else {
      setMeasurementUploads((prev) => [generated, ...prev]);
    }
  };

  const handleCaptureChartNote = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setFormMessage('Camera permission is required to capture chart notes.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      mockUpload('chart', {
        id: `chart-${Date.now()}`,
        uri: asset.uri,
        label: `Chart note • ${new Date().toLocaleTimeString()}`,
      });
    }
  };

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureData(dataUrl);
    setIsSignatureOpen(false);
  };

  const handleClearSignature = () => {
    setSignatureData(null);
  };

  const handleAiReview = () => {
    setAiReviewed(true);
    const missing = Object.entries(aiChecklist)
      .filter(([, value]) => !value)
      .map(([key]) => key.replace(/^[a-z]/, (letter) => letter.toUpperCase()));

    setAiSummary(
      missing.length === 0
        ? 'Everything looks complete. Portal will forward to pre-auth with high confidence.'
        : `Portal flagged: ${missing.join(', ')}. Add the remaining details before submitting.`
    );
  };

  const handleSelectProduct = (productId: string, side: ProductSide) => {
    const productRecord = productCatalog.find((entry) => entry.id === productId);
    if (!productRecord) {
      return;
    }

    setSelectedProductId(productId);
    setSelectedSide(side);

    const sideLabel =
      side === 'bilateral' ? 'Both sides' : side === 'left' ? 'Left leg' : 'Right leg';
    setProduct(`${productRecord.name} – ${sideLabel}`);
  };

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
    setChartUploads([]);
    setMeasurementUploads([]);
    setSignatureData(null);
    setAiReviewed(false);
    setAiSummary(null);
    setSelectedProductId(null);
    setSelectedSide(null);
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
    <View className="gap-6">
      <Card>
        <View className="gap-4">
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
        </View>
      </Card>

      <Card
        title="Documentation intake"
        description="Capture chart notes or measurements before submission.">
        <View className="gap-3">
          <View className="flex-row gap-2">
            <Button variant="secondary" onPress={handleCaptureChartNote} className="flex-1">
              Capture demographic & insurance (camera)
            </Button>
            <Button
              variant="secondary"
              onPress={() => mockUpload('measurement')}
              className="flex-1">
              Capture demographic & insurance (manual)
            </Button>
          </View>
          <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Chart notes
            </Text>
            {chartUploads.length === 0 ? (
              <Text className="text-sm text-slate-600 dark:text-slate-400">
                No chart notes added yet. Use the camera to capture documentation.
              </Text>
            ) : (
              chartUploads.map((item) => (
                <View key={item.id} className="flex-row items-center gap-3">
                  {item.uri ? (
                    <Image
                      source={{ uri: item.uri }}
                      className="h-16 w-16 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700"
                    />
                  ) : (
                    <View className="h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                      <Text className="text-xs text-slate-500 dark:text-slate-400">Mock</Text>
                    </View>
                  )}
                  <Text className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                    {item.label}
                  </Text>
                </View>
              ))
            )}
          </View>
          <View className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Measurements
            </Text>
            {measurementUploads.length === 0 ? (
              <Text className="text-sm text-slate-600 dark:text-slate-400">
                No measurement files yet. Mock a scan to populate this list.
              </Text>
            ) : (
              measurementUploads.map((item) => (
                <View key={item.id} className="flex-row items-center gap-3">
                  {item.uri ? (
                    <Image
                      source={{ uri: item.uri }}
                      className="h-16 w-16 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700"
                    />
                  ) : (
                    <View className="h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                      <Text className="text-xs text-slate-500 dark:text-slate-400">Mock</Text>
                    </View>
                  )}
                  <Text className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                    {item.label}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </Card>

      <Card
        title="E-sign documents"
        description="Capture the your signature before forwarding.">
        <View className="gap-3">
          <Button variant="secondary" onPress={() => setIsSignatureOpen(true)}>
            {signatureData ? 'Retake signature' : 'Sign document'}
          </Button>
          {signatureData && (
            <View className="items-start gap-2">
              <Text className="text-xs text-slate-500 dark:text-slate-400">Signature preview</Text>
              <Image
                source={{ uri: signatureData }}
                className="h-24 w-48 rounded-xl border border-slate-200 bg-white dark:border-slate-700"
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </Card>

      <Card
        title="AI completeness check"
        description="Mock portal AI that confirms the packet is ready.">
        <View className="gap-3">
          <View className="gap-2">
            {(
              [
                { label: 'Chart notes uploaded', value: aiChecklist.documentation },
                { label: 'Measurements captured', value: aiChecklist.measurements },
                { label: 'Signature present', value: aiChecklist.signature },
                { label: 'Diagnosis / codes added', value: aiChecklist.codes },
              ] as const
            ).map((item) => (
              <View key={item.label} className="flex-row items-center gap-2">
                <View
                  className={`h-2.5 w-2.5 rounded-full ${item.value ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                />
                <Text className="text-sm text-slate-700 dark:text-slate-300">{item.label}</Text>
              </View>
            ))}
          </View>
          <Button variant="secondary" onPress={handleAiReview}>
            Run AI completeness check
          </Button>
          {aiReviewed && aiSummary && (
            <Text
              className={`text-sm ${aiSummary.includes('Everything')
                ? 'text-emerald-600 dark:text-emerald-300'
                : 'text-amber-600 dark:text-amber-300'
                }`}>
              {aiSummary}
            </Text>
          )}
        </View>
      </Card>
      <Card
        title="Select product"
        description="Choose the appropriate device and limb configuration.">
        <BraceCatalog />
      </Card>

      {formMessage && <Text className="text-sm text-sky-600 dark:text-sky-300">{formMessage}</Text>}
      <Button onPress={handleSubmit}>Submit to NumaCare</Button>
    </View>
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
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        padding: 1 ? 24 : 0,
        paddingTop: 64,
        paddingBottom: 1 ? 40 : 24,
      }}
    >
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Provider Workbench
          </Text>
          <Text className="text-base text-slate-600 dark:text-slate-400">
            Upload prescriptions, respond to insurance follow-ups, and let the portal handle the
            pre-auth routing.
          </Text>
        </View>

        <TabGroup
          tabs={[
            // { key: 'create', label: 'Create case', content: createCaseTab },
            { key: 'create', label: 'Create case', content: CreateCaseStepper() },
            { key: 'requests', label: 'Insurance requests', content: requestsTab },
            { key: 'notifications', label: 'Notifications', content: notificationsTab },
          ]}
        />
      </View>

      <Modal visible={isSignatureOpen} animationType="slide" presentationStyle="fullScreen">
        <View className="flex-1 bg-slate-50 px-4 py-6 dark:bg-slate-900">
          <Text className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Sign prescription
          </Text>
          <Text className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Draw your signature below. Tap done to attach it to this case.
          </Text>
          <View className="mt-6 flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-700">
            <SignaturePad
              onOK={handleSignatureSave}
              onEmpty={() => { }}
              style={{ flex: 1 }}
              webStyle=".m-signature-pad--footer {display:none;} body,html {background-color: white;}"
            />
          </View>
          <View className="mt-4 flex-row gap-3">
            <Button variant="outline" className="flex-1" onPress={handleClearSignature}>
              Clear
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onPress={() => setIsSignatureOpen(false)}>
              Done
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
