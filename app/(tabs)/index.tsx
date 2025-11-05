import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TabGroup } from '@/components/ui/TabGroup';
import { CaseCard } from '@/components/CaseCard';
import { useAuth } from '@/context/AuthContext';
import { useWorkflow } from '@/context/WorkflowContext';
import { formatRelativeTime } from '@/utils/dates';
import { StatusBar } from 'expo-status-bar';

export default function OverviewScreen() {
  const {
    state: { cases, notifications, autoPreAuthEnabled },
    toggleAutoPreAuth,
  } = useWorkflow();
  const {
    state: { userEmail },
  } = useAuth();

  const activeCases = cases.filter((item) => item.stage !== 'completed');
  const completedCases = cases.filter((item) => item.stage === 'completed');
  const doctorAlerts = notifications.filter((note) => note.audience === 'doctor' && !note.read);
  const preAuthAlerts = notifications.filter((note) => note.audience === 'pre-auth' && !note.read);

  const snapshot = (
    <View className="gap-4">
      <View className="flex-wrap gap-4">
        <Card
          tone="default"
          icon="clock"
          title={`${activeCases.length}`}
          description="Active cases in motion"
          className="w-full min-w-[150px] flex-1"
        />
        <Card
          icon="check-circle"
          tone="default"
          title={`${completedCases.length}`}
          description="Completed in the last window"
          className="w-full min-w-[150px] flex-1"
        />
        <Card
          tone="default"
          title={autoPreAuthEnabled ? 'Automation on' : 'Manual review'}
          description={
            autoPreAuthEnabled
              ? 'Portal forwarding cases automatically.'
              : 'Portal waiting for pre-auth review.'
          }
          className="w-full min-w-[150px] flex-1"
          actions={
            <Button variant={autoPreAuthEnabled ? "primary" : "outline"} onPress={toggleAutoPreAuth}>
              {autoPreAuthEnabled ? 'Pause auto pre-auth' : 'Enable auto pre-auth'}
            </Button>
          }
        />
      </View>
      <View className="flex-wrap gap-4">
        <Card
          title={`${doctorAlerts.length}`}
          tone="default"
          icon="stethoscope"
          description="Doctor items awaiting action"
          className="w-full min-w-[160px] flex-1"
        />
        <Card
          tone="default"
          icon="comment"
          title={`${preAuthAlerts.length}`}
          description="Portal tasks pending pre-auth team"
          className="w-full min-w-[160px] flex-1"
        />
      </View>
    </View>
  );

  const casesPanel = (
    <View className="gap-4">
      <SectionHeader title="In-flight cases" subtitle="Track progress and open follow-ups." />
      {cases.length === 0 ? (
        <Card
          title="No cases yet"
          description="Start by uploading a prescription or clinical note."
        />
      ) : (
        cases.map((item) => <CaseCard key={item.id} caseItem={item} />)
      )}
    </View>
  );

  const notificationsPanel = (
    <View className="gap-4">
      <SectionHeader
        title="Unresolved notifications"
        subtitle="Portal tasks queued for stakeholders."
      />
      {notifications.length === 0 ? (
        <Card title="Everyone is up to date" description="No active notifications across roles." />
      ) : (
        notifications.slice(0, 6).map((note) => (
          <Card
            key={note.id}
            title={`${note.title} • ${note.audience.toUpperCase()}`}
            description={note.message}>
            <Text className="text-xs text-slate-500 dark:text-slate-400">
              Created {formatRelativeTime(note.createdAt)}
            </Text>
          </Card>
        ))
      )}
    </View>
  );

  return (
    <Screen>
      <StatusBar backgroundColor="#0ea5e9" />
      <View style={{ marginTop: 32 }}
        className="gap-6">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 pr-4">
            <Text className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              Dashboard
            </Text>
            <Text className="mt-2 text-base text-slate-600 dark:text-slate-400">
              Monitor the end-to-end workflow, automate pre-auth, and keep physicians and patients
              in the loop.
            </Text>
          </View>
        </View>
        <TabGroup
          tabs={[
            { key: 'snapshot', label: 'Snapshot', content: snapshot },
            { key: 'cases', label: 'Cases', content: casesPanel },
            { key: 'notifications', label: 'Notifications', content: notificationsPanel },
          ]}
        />
      </View>
    </Screen>
  );
}
