import { useMemo, useState } from 'react';
import { Switch, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TabGroup } from '@/components/ui/TabGroup';
import { useWorkflow } from '@/context/WorkflowContext';
import { formatRelativeTime } from '@/utils/dates';
import { stageCopy } from '@/utils/stage';

export default function PreAuthScreen() {
  const {
    state: { cases, notifications, autoPreAuthEnabled },
    sendToInsurance,
    recordInsuranceResponse,
    uploadEobToPortal,
    logCommunication,
    markNotificationRead,
    toggleAutoPreAuth,
  } = useWorkflow();

  const [forwardSummary, setForwardSummary] = useState(
    'Package sent with prescription and clinical notes.'
  );
  const [responseSummary, setResponseSummary] = useState('Insurance approved pending EOB.');
  const [requiresFollowUp, setRequiresFollowUp] = useState(false);
  const [eobTotal, setEobTotal] = useState('$1,260 approved');
  const [eobResponsibility, setEobResponsibility] = useState('$85 patient responsibility');
  const [eobNotes, setEobNotes] = useState('EOB attached from insurance portal.');
  const [paymentLink, setPaymentLink] = useState('https://numacare.example/pay');
  const [selectedForwardCase, setSelectedForwardCase] = useState<string | null>(null);
  const [selectedResponseCase, setSelectedResponseCase] = useState<string | null>(null);
  const [selectedEobCase, setSelectedEobCase] = useState<string | null>(null);
  const [commSummary, setCommSummary] = useState(
    'Left voicemail with benefits specialist to confirm receipt.'
  );
  const [commCase, setCommCase] = useState<string | null>(null);

  const preAuthNotifications = useMemo(
    () => notifications.filter((note) => note.audience === 'pre-auth'),
    [notifications]
  );

  const queueCases = useMemo(
    () =>
      cases.filter((item) =>
        [
          'awaiting-pre-auth',
          'pre-auth-review',
          'awaiting-insurance-response',
          'awaiting-doctor-ack',
        ].includes(item.stage)
      ),
    [cases]
  );

  const responseCandidates = useMemo(
    () => cases.filter((item) => item.stage === 'awaiting-insurance-response'),
    [cases]
  );

  const eobCandidates = useMemo(
    () => cases.filter((item) => item.stage === 'insurance-response-received'),
    [cases]
  );

  const handleForward = () => {
    if (!selectedForwardCase) {
      return;
    }

    sendToInsurance({
      caseId: selectedForwardCase,
      summary: forwardSummary,
      medium: 'email',
    });
  };

  const handleResponse = () => {
    if (!selectedResponseCase) {
      return;
    }

    recordInsuranceResponse({
      caseId: selectedResponseCase,
      summary: responseSummary,
      requiresFollowUp,
    });
  };

  const handleEob = () => {
    if (!selectedEobCase) {
      return;
    }

    uploadEobToPortal({
      caseId: selectedEobCase,
      totalApproved: eobTotal,
      patientResponsibility: eobResponsibility,
      notes: eobNotes,
      paymentLink,
    });
  };

  const handleCommunication = () => {
    if (!commCase) {
      return;
    }

    logCommunication({
      caseId: commCase,
      actor: 'pre-auth',
      direction: 'outbound',
      medium: 'call',
      summary: commSummary,
    });
  };

  const overviewTab = (
    <View className="gap-4">
      <Card
        title="Automation coverage"
        description="Toggle this to shadow the assistant role."
        actions={
          <Button
            variant={autoPreAuthEnabled ? "primary" : "outline"}
            onPress={toggleAutoPreAuth}>
            {autoPreAuthEnabled ? 'Disable automation' : 'Enable automation'}
          </Button>
        }>
        <View className="flex-row items-center justify-between">
        </View>
      </Card>

      <SectionHeader
        title="Pre-auth queue"
        subtitle="Portal forwards docs, but you can still send emails outside when needed."
      />
      {queueCases.length === 0 ? (
        <Card
          title="No cases in queue"
          description="New doctor uploads will appear here automatically."
        />
      ) : (
        queueCases.map((item) => (
          <Card
            key={item.id}
            title={`${item.patientName} • ${item.product}`}
            description={stageCopy[item.stage].hint}>
            <View className="flex-row items-center justify-between">
              <Badge tone={stageCopy[item.stage].tone}>{stageCopy[item.stage].label}</Badge>
            </View>
          </Card>
        ))
      )}
    </View>
  );

  const insuranceTab = (
    <View className="gap-4">
      <SectionHeader
        title="Forward package to insurance"
        subtitle="Portal emails the insurer and tracks the log."
      />
      <Card>
        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Select case
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {queueCases.map((item) => (
                <Button
                  key={item.id}
                  variant={selectedForwardCase === item.id ? 'primary' : 'secondary'}
                  className="min-w-[140px]"
                  onPress={() => setSelectedForwardCase(item.id)}>
                  {item.patientName}
                </Button>
              ))}
            </View>
          </View>
          <Input
            label="Email summary"
            value={forwardSummary}
            onChangeText={setForwardSummary}
            multiline
          />
          <Button onPress={handleForward} disabled={!selectedForwardCase}>
            Send packet via portal
          </Button>
        </View>
      </Card>

      <SectionHeader
        title="Record insurance response"
        subtitle="Insurance replies land in the portal inbox and can trigger doctor notices."
      />
      <Card>
        <View className="gap-4">
          <View className="flex-row flex-wrap gap-2">
            {responseCandidates.map((item) => (
              <Button
                key={item.id}
                variant={selectedResponseCase === item.id ? 'primary' : 'secondary'}
                className="min-w-[140px]"
                onPress={() => setSelectedResponseCase(item.id)}>
                {item.patientName}
              </Button>
            ))}
          </View>
          <Input
            label="Response details"
            value={responseSummary}
            onChangeText={setResponseSummary}
            multiline
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-slate-600 dark:text-slate-300">
              Needs extra info from doctor
            </Text>
            <Switch value={requiresFollowUp} onValueChange={setRequiresFollowUp} />
          </View>
          <Button onPress={handleResponse} disabled={!selectedResponseCase}>
            Log response and notify doctor
          </Button>
        </View>
      </Card>

      <SectionHeader
        title="Upload EOB"
        subtitle="Portal distributes the explanation to doctor and patient."
      />
      <Card>
        <View className="gap-4">
          <View className="flex-row flex-wrap gap-2">
            {eobCandidates.map((item) => (
              <Button
                key={item.id}
                variant={selectedEobCase === item.id ? 'primary' : 'secondary'}
                className="min-w-[140px]"
                onPress={() => setSelectedEobCase(item.id)}>
                {item.patientName}
              </Button>
            ))}
          </View>
          <Input label="Total approved" value={eobTotal} onChangeText={setEobTotal} />
          <Input
            label="Patient responsibility"
            value={eobResponsibility}
            onChangeText={setEobResponsibility}
          />
          <Input label="Notes" value={eobNotes} onChangeText={setEobNotes} multiline />
          <Input label="Payment link" value={paymentLink} onChangeText={setPaymentLink} />
          <Button onPress={handleEob} disabled={!selectedEobCase}>
            Upload EOB to portal
          </Button>
        </View>
      </Card>
    </View>
  );

  const collaborationTab = (
    <View className="gap-4">
      <SectionHeader
        title="Log outreach"
        subtitle="Even off-portal emails and calls are captured for audit."
      />
      <Card>
        <View className="gap-4">
          <View className="flex-row flex-wrap gap-2">
            {cases.map((item) => (
              <Button
                key={item.id}
                variant={commCase === item.id ? 'primary' : 'secondary'}
                className="min-w-[140px]"
                onPress={() => setCommCase(item.id)}>
                {item.patientName}
              </Button>
            ))}
          </View>
          <Input label="Summary" value={commSummary} onChangeText={setCommSummary} multiline />
          <Button onPress={handleCommunication} disabled={!commCase}>
            Save outreach log
          </Button>
        </View>
      </Card>

      <SectionHeader
        title="Portal notifications"
        subtitle="Alerts routed to the pre-auth assistant"
      />
      {preAuthNotifications.length === 0 ? (
        <Card
          title="No pending notifications"
          description="Portal has no outstanding tasks for pre-auth."
        />
      ) : (
        preAuthNotifications.map((note) => (
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
            Pre-Auth Command Center
          </Text>
          <Text className="text-base text-slate-600 dark:text-slate-400">
            The portal receives doctor uploads, packages them for insurance, and relays responses
            back automatically.
          </Text>
        </View>

        <TabGroup
          tabs={[
            { key: 'overview', label: 'Overview', content: overviewTab },
            { key: 'insurance', label: 'Insurance', content: insuranceTab },
            { key: 'collaboration', label: 'Collaboration', content: collaborationTab },
          ]}
        />
      </View>
    </Screen>
  );
}
