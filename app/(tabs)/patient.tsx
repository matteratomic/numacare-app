import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useWorkflow } from '@/context/WorkflowContext';
import { formatRelativeTime } from '@/utils/dates';
import { stageCopy } from '@/utils/stage';

export default function PatientScreen() {
  const {
    state: { cases, notifications },
    notifyPatientOfEob,
    completePatientAction,
    markNotificationRead,
  } = useWorkflow();

  const patientNotifications = useMemo(
    () => notifications.filter((note) => note.audience === 'patient'),
    [notifications]
  );

  const awaitingPatient = useMemo(
    () => cases.filter((item) => item.stage === 'awaiting-patient-action'),
    [cases]
  );

  const readyForFulfillment = useMemo(
    () => cases.filter((item) => item.stage === 'ready-for-fulfillment'),
    [cases]
  );

  const [selectedNotifyCase, setSelectedNotifyCase] = useState<string | null>(null);
  const [patientMessage, setPatientMessage] = useState(
    'Insurance approved your order. Review your cost breakdown and schedule delivery.'
  );
  const [patientActions, setPatientActions] = useState(
    'Tap the payment link to checkout and choose delivery.'
  );
  const [copay, setCopay] = useState('$85 copay');
  const [selectedCompletionCase, setSelectedCompletionCase] = useState<string | null>(null);
  const [fulfillmentDetails, setFulfillmentDetails] = useState(
    'Patient paid and scheduled in-clinic pickup for Friday.'
  );

  const handleNotify = () => {
    if (!selectedNotifyCase) {
      return;
    }

    notifyPatientOfEob({
      caseId: selectedNotifyCase,
      message: patientMessage,
      actions: patientActions,
      copayAmount: copay,
    });
  };

  const handleComplete = () => {
    if (!selectedCompletionCase) {
      return;
    }

    completePatientAction({
      caseId: selectedCompletionCase,
      fulfillmentDetails,
    });
  };

  return (
    <Screen>
      <View
        style={{ marginTop: 32 }}
        className="gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Patient Experience
          </Text>
          <Text className="text-base text-slate-600 dark:text-slate-400">
            Once insurance approves, the portal emails patients with the cost, payment link, and
            scheduling options.
          </Text>
        </View>

        <View className="gap-4">
          <SectionHeader
            title="Awaiting notification"
            subtitle="Portal packages the EOB and cost summary for each patient."
          />
          {awaitingPatient.length === 0 ? (
            <Card
              title="No patients waiting"
              description="Upload the EOB to queue the notification."
            />
          ) : (
            awaitingPatient.map((item) => (
              <Card
                key={item.id}
                title={`${item.patientName} • ${item.product}`}
                description={stageCopy[item.stage].hint}>
                <View className="flex-row items-center justify-between">
                  <Badge tone={stageCopy[item.stage].tone}>{stageCopy[item.stage].label}</Badge>
                  {/* <Text className="text-xs text-slate-500 dark:text-slate-400"> */}
                  {/*   Updated {formatRelativeTime(item.updatedAt)} */}
                  {/* </Text> */}
                </View>
                {/* {item.paymentLink && ( */}
                {/*   <Text className="mt-2 text-xs text-sky-600 dark:text-sky-300"> */}
                {/*     Payment link on file: {item.paymentLink} */}
                {/*   </Text> */}
                {/* )} */}
              </Card>
            ))
          )}
        </View>

        <View className="gap-4">
          <SectionHeader
            title="Send patient notification"
            subtitle="Portal emails and tracks the outreach."
          />
          <Card>
            <View className="gap-4">
              <View className="flex-row flex-wrap gap-2">
                {awaitingPatient.map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedNotifyCase === item.id ? 'primary' : 'secondary'}
                    className="min-w-[140px]"
                    onPress={() => setSelectedNotifyCase(item.id)}>
                    {item.patientName}
                  </Button>
                ))}
              </View>
              <Input label="Cost summary" value={copay} onChangeText={setCopay} />
              <Input
                label="Message"
                value={patientMessage}
                onChangeText={setPatientMessage}
                multiline
              />
              <Input
                label="Next steps"
                value={patientActions}
                onChangeText={setPatientActions}
                multiline
              />
              <Button onPress={handleNotify} disabled={!selectedNotifyCase}>
                Email patient via portal
              </Button>
            </View>
          </Card>
        </View>

        <View className="gap-4">
          <SectionHeader
            title="Fulfillment"
            subtitle="Confirm when the patient purchases and schedules."
          />
          <Card>
            <View className="gap-4">
              <View className="flex-row flex-wrap gap-2">
                {readyForFulfillment.map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedCompletionCase === item.id ? 'primary' : 'secondary'}
                    className="min-w-[140px]"
                    onPress={() => setSelectedCompletionCase(item.id)}>
                    {item.patientName}
                  </Button>
                ))}
              </View>
              <Input
                label="Outcome"
                value={fulfillmentDetails}
                onChangeText={setFulfillmentDetails}
                multiline
              />
              <Button onPress={handleComplete} disabled={!selectedCompletionCase}>
                Mark as fulfilled
              </Button>
            </View>
          </Card>
        </View>

        <View className="gap-4">
          <SectionHeader
            title="Patient notifications"
            subtitle="Audit of what was emailed to the patient."
          />
          {patientNotifications.length === 0 ? (
            <Card
              title="No patient notifications"
              description="They will appear as soon as the portal sends them."
            />
          ) : (
            patientNotifications.map((note) => (
              <Card
                key={note.id}
                title={note.title}
                description={note.message}
                tone={note.read ? 'default' : 'success'}>
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
      </View>
    </Screen>
  );
}
