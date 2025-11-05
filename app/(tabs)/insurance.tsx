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

export default function InsuranceScreen() {
  const {
    state: { cases },
    logCommunication,
  } = useWorkflow();

  const insuranceCases = useMemo(
    () =>
      cases
        .filter((item) =>
          ['awaiting-insurance-response', 'awaiting-doctor-ack'].includes(item.stage)
        )
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    [cases]
  );

  const recentComms = useMemo(() => {
    const comms = cases.flatMap((item) =>
      item.communications.map((entry) => ({ ...entry, patientName: item.patientName }))
    );
    return comms.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)).slice(0, 8);
  }, [cases]);

  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [communicationSummary, setCommunicationSummary] = useState(
    'Insurance confirmed review window is 48 hours.'
  );
  const [direction, setDirection] = useState<'inbound' | 'outbound'>('inbound');

  const handleLog = () => {
    if (!selectedCase) {
      return;
    }

    logCommunication({
      caseId: selectedCase,
      actor: direction === 'inbound' ? 'insurance' : 'pre-auth',
      direction,
      medium: 'email',
      summary: communicationSummary,
      followUpRequired: direction === 'inbound',
    });
  };

  return (
    <Screen>
      <View
        style={{ marginTop: 32 }}
        className="gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            Insurance Pipeline
          </Text>
          <Text className="text-base text-slate-600 dark:text-slate-400">
            Track which cases are with insurance, log emailed responses, and create reminders for
            follow-ups.
          </Text>
        </View>

        <View className="gap-4">
          <SectionHeader
            title="Cases with insurance"
            subtitle="Portal forwards packets and tracks replies automatically."
          />
          {insuranceCases.length === 0 ? (
            <Card
              title="No active insurance reviews"
              description="Everything is either upstream or awaiting patient action."
            />
          ) : (
            insuranceCases.map((item) => (
              <Card
                key={item.id}
                title={`${item.patientName} • ${item.product}`}
                description={stageCopy[item.stage].hint}>
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Badge tone={stageCopy[item.stage].tone}>{stageCopy[item.stage].label}</Badge>
                  </View>
                  {/* <Text className="mt-2 text-xs text-slate-500 dark:text-slate-400"> */}
                  {/*   Updated {formatRelativeTime(item.updatedAt)} */}
                  {/* </Text> */}

                  {item.communications[0] && (
                    <Text className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Last touchpoint: {item.communications[0].summary}
                    </Text>
                  )}
                </View>
              </Card>
            ))
          )}
        </View>

        <View className="gap-4">
          <SectionHeader
            title="Log insurance communication"
            subtitle="Emails happen off-portal but we still keep the audit trail."
          />
          <Card>
            <View className="gap-4">
              <Text className="text-sm font-semibold text-slate-600">Patient</Text>
              <View className="flex-row flex-wrap gap-2">
                {cases.map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedCase === item.id ? 'primary' : 'secondary'}
                    // className="min-w-[140px]"
                    onPress={() => setSelectedCase(item.id)}>
                    {item.patientName}
                  </Button>
                ))}
              </View>
              <Text className="text-sm font-semibold text-slate-600">Trail</Text>
              <View className="flex-row gap-2">
                <Button
                  variant={direction === 'inbound' ? 'primary' : 'outline'}
                  onPress={() => setDirection('inbound')}>
                  Insurance → Portal
                </Button>
                <Button
                  variant={direction === 'outbound' ? 'primary' : 'outline'}
                  onPress={() => setDirection('outbound')}>
                  Portal → Insurance
                </Button>
              </View>
              <Input
                label="Summary"
                value={communicationSummary}
                onChangeText={setCommunicationSummary}
                multiline
              />
              <Button onPress={handleLog} disabled={!selectedCase}>
                Log communication
              </Button>
            </View>
          </Card>
        </View>

        <View className="gap-4">
          <SectionHeader title="Recent activity" subtitle="Mirror of the insurance inbox." />
          {recentComms.length === 0 ? (
            <Card title="Quiet inbox" description="No email activity recorded yet." />
          ) : (
            recentComms.map((entry) => (
              <Card
                key={entry.id}
                title={`${entry.patientName} • ${entry.actor === 'insurance' ? 'Inbound' : 'Outbound'}`}
                description={entry.summary}
                tone={entry.actor === 'insurance' ? 'warning' : 'default'}>
                <Text className="text-xs text-slate-500 dark:text-slate-400">
                  {formatRelativeTime(entry.timestamp)}
                </Text>
              </Card>
            ))
          )}
        </View>
      </View>
    </Screen>
  );
}
