import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import * as ImagePicker from 'expo-image-picker';
import SignaturePad from 'react-native-signature-canvas';
import { SectionHeader } from "@/components/ui/SectionHeader";
import React, { useMemo, useState } from "react";
import { Dimensions, View, Text, ScrollView, Image, Modal } from "react-native";
import BraceCatalog from "./BraceCatalog";

// PRIMARY color for accents
const PRIMARY = "#0ea5e9";

const width = Dimensions.get('window')
function DocumentIntake() {

  type CapturedAsset = {
    id: string;
    uri: string;
    label: string;
  };
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [chartUploads, setChartUploads] = useState<CapturedAsset[]>([]);
  const [measurementUploads, setMeasurementUploads] = useState<CapturedAsset[]>([]);
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
    console.log('hellll')
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

  return <Card title="Documentation intake" description="Capture chart notes or measurements before submission.">
    <View className="gap-3">
      <View className="flex-row gap-2">
        <Button variant="secondary" onPress={handleCaptureChartNote} className="flex-1">
          Capture chart notes (camera)
        </Button>
        <Button variant="secondary" onPress={() => mockUpload("measurement")} className="flex-1">
          Scan measurements (mock)
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
              <View className="h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                <Text className="text-xs text-slate-500 dark:text-slate-400">Mock</Text>
              </View>
              <Text className="flex-1 text-sm text-slate-700 dark:text-slate-300">{item.label}</Text>
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
            <>
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
              {/* <View key={item.id} className="flex-row items-center gap-3"> */}
              {/*   <View className="h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600"> */}
              {/*     <Text className="text-xs text-slate-500 dark:text-slate-400">Mock</Text> */}
              {/*   </View> */}
              {/*   <Text className="flex-1 text-sm text-slate-700 dark:text-slate-300">{item.label}</Text> */}
              {/* </View> */}
              {/**/}
            </>
          ))
        )}
      </View>
    </View>
  </Card>
}

function ESign() {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);

  const handleClearSignature = () => {
    setSignatureData(null);
  };

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureData(dataUrl);
    setIsSignatureOpen(false);
  };

  return <>
    <Card title="E-sign documents" description="Capture your signature before forwarding.">
      <View className="gap-3">
        <Button variant="secondary" onPress={() => setIsSignatureOpen(true)}>
          {signatureData ? "Retake signature" : "Sign document"}
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
    <Modal
      visible={isSignatureOpen}
      animationType="slide" presentationStyle="fullScreen">
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
  </>
}


export default function CreateCaseStepper() {
  const [documentType, setDocumentType] = useState<"prescription" | "clinical-report">("prescription");
  const [doctorName, setDoctorName] = useState("Dr. Travis Davenport");
  const [patientName, setPatientName] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [notes, setNotes] = useState("");

  const [chartUploads, setChartUploads] = useState<any[]>([]);
  const [measurementUploads, setMeasurementUploads] = useState<any[]>([]);

  // const [signatureData, setSignatureData] = useState<string | null>(null);
  // const [isSignatureOpen, setIsSignatureOpen] = useState(false);

  const [aiChecklist, setAiChecklist] = useState({
    documentation: false,
    measurements: false,
    signature: false,
    codes: false,
  });
  const [aiReviewed, setAiReviewed] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const [formMessage, setFormMessage] = useState<string | null>(null);

  // Mock handlers (wire yours here)
  const handleCaptureChartNote = () => setChartUploads((p) => [...p, { id: Date.now(), label: "Chart note (mock)" }]);
  const mockUpload = (type: "measurement") =>
    setMeasurementUploads((p) => [...p, { id: Date.now(), label: "Measurement (mock)" }]);
  const handleAiReview = () => {
    const result = {
      documentation: chartUploads.length > 0,
      measurements: measurementUploads.length > 0,
      // signature: !!signatureData,
      signature: null,
      codes: diagnosis.trim().length > 0,
    };
    setAiChecklist(result);
    setAiReviewed(true);
    const pass = Object.values(result).every(Boolean);
    setAiSummary(pass ? "Everything looks good ✅" : "Missing items — please review.");
  };
  const handleSubmit = () => setFormMessage("Submitted to NumaCare ✔");
  // ── Steps config: title + render + optional validate() ───────────────────────
  const steps = useMemo(
    () => [
      {
        key: "create",
        title: "Create case",
        validate: () => {
          // if (!doctorName || !patientName || !documentTitle) {
          // if (!doctorName || !patientName) {
          //   setFormMessage("Please fill Doctor, Patient and Document title.");
          //   return false;
          // }
          setFormMessage(null);
          return true;
        },
        render: () => (
          <Card>
            <View className="relative gap-4">
              <SectionHeader title="Create case" subtitle="One upload notifies pre-auth instantly." />
              <View className="flex-row gap-2">
                <Button
                  variant={documentType === "prescription" ? "primary" : "outline"}
                  onPress={() => setDocumentType("prescription")}
                  // className="flex-1 w-1/2"
                  >
                  New Case
                </Button>
                <Button
                  variant={documentType === "clinical-report" ? "primary" : "outline"}
                  onPress={() => setDocumentType("clinical-report")}
                  // className="flex-1 w-64"
                  >
                  Select Patient
                </Button>
              </View>
              <Input label="Doctor name" value={doctorName} onChangeText={setDoctorName} placeholder="Dr. Lee" />
              <Input label="Patient" value={patientName} onChangeText={setPatientName} placeholder="Jamie Rivera" />
              {/*
<Input
                label="Insurance"
                value={insuranceProvider}
                onChangeText={setInsuranceProvider}
                placeholder="Summit Health"
              />

              <Input label="Diagnosis" value={diagnosis} onChangeText={setDiagnosis} placeholder="ICD-10 details" />
                */}
              {/*
<Input
                label="Document title"
                value={documentTitle}
                onChangeText={setDocumentTitle}
                placeholder="Prescription details"
              />

                */}
              </View>
          </Card>
        ),
      },
      {
        key: "docs",
        title: "Documentation intake",
        validate: () => true,
        render: () => <DocumentIntake />
        // render: () => (
        //   <Card title="Documentation intake" description="Capture chart notes or measurements before submission.">
        //     <View className="gap-3">
        //       <View className="flex-row gap-2">
        //         <Button variant="secondary" onPress={handleCaptureChartNote} className="flex-1">
        //           Capture chart notes (camera)
        //         </Button>
        //         <Button variant="secondary" onPress={() => mockUpload("measurement")} className="flex-1">
        //           Scan measurements (mock)
        //         </Button>
        //       </View>
        //
        //       <View className="gap-2">
        //         <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        //           Chart notes
        //         </Text>
        //         {chartUploads.length === 0 ? (
        //           <Text className="text-sm text-slate-600 dark:text-slate-400">
        //             No chart notes added yet. Use the camera to capture documentation.
        //           </Text>
        //         ) : (
        //           chartUploads.map((item) => (
        //             <View key={item.id} className="flex-row items-center gap-3">
        //               <View className="h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
        //                 <Text className="text-xs text-slate-500 dark:text-slate-400">Mock</Text>
        //               </View>
        //               <Text className="flex-1 text-sm text-slate-700 dark:text-slate-300">{item.label}</Text>
        //             </View>
        //           ))
        //         )}
        //       </View>
        //
        //       <View className="gap-2">
        //         <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        //           Measurements
        //         </Text>
        //         {measurementUploads.length === 0 ? (
        //           <Text className="text-sm text-slate-600 dark:text-slate-400">
        //             No measurement files yet. Mock a scan to populate this list.
        //           </Text>
        //         ) : (
        //           measurementUploads.map((item) => (
        //             <View key={item.id} className="flex-row items-center gap-3">
        //               <View className="h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
        //                 <Text className="text-xs text-slate-500 dark:text-slate-400">Mock</Text>
        //               </View>
        //               <Text className="flex-1 text-sm text-slate-700 dark:text-slate-300">{item.label}</Text>
        //             </View>
        //           ))
        //         )}
        //       </View>
        //     </View>
        //   </Card>
        // ),
      },
      {
        key: "esign",
        title: "E-sign documents",
        validate: () => true,
        render: () => <ESign />,
      },
      {
        key: "ai",
        title: "AI completeness",
        validate: () => true,
        render: () => (
          <Card title="AI completeness check" description="Mock portal AI that confirms the packet is ready.">
            <View className="gap-3">
              <View className="gap-2">
                {([
                  { label: "Chart notes uploaded", value: aiChecklist.documentation },
                  { label: "Measurements captured", value: aiChecklist.measurements },
                  { label: "Signature present", value: aiChecklist.signature },
                  { label: "Diagnosis / codes added", value: aiChecklist.codes },
                ] as const).map((item) => (
                  <View key={item.label} className="flex-row items-center gap-2">
                    <View
                      className={`h-2.5 w-2.5 rounded-full ${item.value ? "bg-emerald-500" : "bg-amber-400"
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
                  className={`text-sm ${aiSummary.includes("Everything")
                    ? "text-emerald-600 dark:text-emerald-300"
                    : "text-amber-600 dark:text-amber-300"
                    }`}
                >
                  {aiSummary}
                </Text>
              )}
            </View>
          </Card>
        ),
      },
      {
        key: "product",
        title: "Select product",
        validate: () => true,
        render: () => (
          <Card title="Select product" description="Choose device and limb configuration.">
            <BraceCatalog
              onAddToCart={({ product, side, size }) =>
                setFormMessage(`Selected ${product.name}${side ? ` (${side})` : ""}${size ? ` • ${size}` : ""}`)
              }
            />
          </Card>
        ),
      },
    ],
    [
      documentType,
      doctorName,
      patientName,
      insuranceProvider,
      diagnosis,
      documentTitle,
      notes,
      chartUploads,
      measurementUploads,
      // signatureData,
      aiChecklist,
      aiReviewed,
      aiSummary,
    ]
  );

  // ── Step state + controls ────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const total = steps.length;
  const current = steps[step];

  const goNext = () => {
    if (current.validate && !current.validate()) return;
    setStep((i) => Math.min(i + 1, total - 1));
  };
  const goBack = () => setStep((i) => Math.max(i - 1, 0));

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <View className="gap-4">
      {/* Progress header */}
      <View className="px-1">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-semibold">{current.title}</Text>
          <Text className="text-xs text-slate-500">
            {step + 1} / {total}
          </Text>
        </View>

        {/* progress bar */}
        <View className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <View
            style={{ width: `${((step + 1) / total) * 100}%`, backgroundColor: PRIMARY }}
            className="h-2 rounded-full"
          />
        </View>

        {/* step dots */}
        <View className="flex-row items-center justify-between mt-2">
          {steps.map((_, i) => (
            <View
              key={i}
              className={`h-2 w-2 rounded-full ${i <= step ? "" : "bg-slate-300"}`}
              style={{ backgroundColor: i <= step ? PRIMARY : undefined }}
            />
          ))}
        </View>
      </View>

      {/* Current step content */}
      <ScrollView
        className="max-h-[720px]"
        contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {current.render()}
        {formMessage ? (
          <Text className="text-sm text-sky-600 dark:text-sky-300 px-1">{formMessage}</Text>
        ) : null}
      </ScrollView>

      {/* Navigation buttons */}
      <View className="flex-row gap-2">
        <Button variant="outline" onPress={goBack} disabled={step === 0} className="flex-1">
          Back
        </Button>

        {step < total - 1 ? (
          <Button onPress={goNext} className="flex-1">
            Next
          </Button>
        ) : (
          <Button onPress={handleSubmit} className="flex-1">
            Submit to NumaCare
          </Button>
        )}
      </View>
    </View>
  );
}
