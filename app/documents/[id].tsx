import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useWorkflow } from '@/context/WorkflowContext';
import { formatRelativeTime } from '@/utils/dates';
import { stageCopy } from '@/utils/stage';

const documentLabels: Record<string, string> = {
  'clinical-report': 'Clinical report',
  prescription: 'Prescription',
  'insurance-response': 'Insurance response',
  eob: 'Explanation of Benefits',
  supporting: 'Supporting document',
};

export default function CaseDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const {
    state: { cases, notifications },
  } = useWorkflow();

  const caseItem = cases.find((item) => item.id === params.id);

  if (!caseItem) {
    return (
      <Screen>
        <Card title="Case not found" description="Return to overview to refresh." />
      </Screen>
    );
  }

  const stage = stageCopy[caseItem.stage];
  const caseNotifications = notifications.filter(
    (note) => note.caseId === caseItem.id && !note.read
  );

  return (
    <Screen>
      <View className="gap-6">
        <Card
          title={`${caseItem.patientName} • ${caseItem.product}`}
          description={`Insurance: ${caseItem.insuranceProvider}`}
          actions={
            <View className="flex-row gap-2">
              <Link href="/pre-auth" asChild>
                <Button variant="secondary">Pre-auth tools</Button>
              </Link>
              <Link href="/patient" asChild>
                <Button variant="secondary">Patient view</Button>
              </Link>
            </View>
          }>
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Badge tone={stage.tone}>{stage.label}</Badge>
              <Text className="text-xs text-slate-500">
                Updated {formatRelativeTime(caseItem.updatedAt)}
              </Text>
            </View>
            <Text className="text-sm text-slate-300">Diagnosis: {caseItem.diagnosis}</Text>
            {caseItem.paymentLink && (
              <Text className="text-xs text-sky-300">Payment link: {caseItem.paymentLink}</Text>
            )}
            {caseItem.estimatedCopay && (
              <Text className="text-xs text-slate-300">
                Estimated copay: {caseItem.estimatedCopay}
              </Text>
            )}
          </View>
        </Card>

        <View className="gap-4">
          <SectionHeader
            title="Documents"
            subtitle="Everything the portal has stored for this case."
          />
          {caseItem.documents.length === 0 ? (
            <Card
              title="No documents"
              description="Upload from the doctor tab to kick things off."
            />
          ) : (
            caseItem.documents.map((doc) => (
              <Card
                key={doc.id}
                title={`${documentLabels[doc.type] ?? doc.type} • ${formatRelativeTime(doc.createdAt)}`}
                description={doc.notes ?? 'No additional notes.'}>
                <Text className="text-xs text-slate-500">Uploaded by {doc.uploadedBy}</Text>
              </Card>
            ))
          )}
        </View>

        <View className="gap-4">
          <SectionHeader title="Timeline" subtitle="Chronological events captured by the portal." />
          {caseItem.events.length === 0 ? (
            <Card title="No activity" description="Actions will appear here automatically." />
          ) : (
            caseItem.events.map((event) => (
              <Card key={event.id} title={event.title} description={event.description}>
                <Text className="text-xs text-slate-500">
                  {event.actor.toUpperCase()} • {formatRelativeTime(event.timestamp)}
                </Text>
              </Card>
            ))
          )}
        </View>

        <View className="gap-4">
          <SectionHeader
            title="Communications"
            subtitle="Emails and calls that happened outside the portal."
          />
          {caseItem.communications.length === 0 ? (
            <Card
              title="No communications logged"
              description="Add notes from the pre-auth or insurance tabs."
            />
          ) : (
            caseItem.communications.map((entry) => (
              <Card
                key={entry.id}
                title={`${entry.actor} • ${entry.direction}`}
                description={entry.summary}>
                <Text className="text-xs text-slate-500">
                  {formatRelativeTime(entry.timestamp)}
                </Text>
              </Card>
            ))
          )}
        </View>

        {caseNotifications.length > 0 && (
          <View className="gap-4">
            <SectionHeader title="Open notifications" subtitle="Outstanding tasks for this case." />
            {caseNotifications.map((note) => (
              <Card key={note.id} title={note.title} description={note.message} tone="warning" />
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}
