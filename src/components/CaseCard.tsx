import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CareCase } from '@/types/workflow';
import { formatRelativeTime } from '@/utils/dates';
import { stageCopy } from '@/utils/stage';

interface CaseCardProps {
  caseItem: CareCase;
}

export function CaseCard({ caseItem }: CaseCardProps) {
  const stage = stageCopy[caseItem.stage];
  const latestEvent = caseItem.events[0];

  return (
    <Card
      title={`${caseItem.patientName} • ${caseItem.product}`}
      description={`Insurance · ${caseItem.insuranceProvider}`}
      actions={
        <Link href={{ pathname: '/documents/[id]', params: { id: caseItem.id } }} asChild>
          <Button variant="primary">View case</Button>
        </Link>
      }>
      <View className="gap-3">
        <View className="flex-row flex-wrap items-center justify-between gap-2">
          <Badge tone={stage.tone}>{stage.label}</Badge>
          {/* <Text className="text-xs text-slate-400"> */}
          {/*   Updated {formatRelativeTime(caseItem.updatedAt)} */}
          {/* </Text> */}
        </View>
        {latestEvent && (
          <View className="gap-1">
            <Text className="text-sm font-semibold text-slate-600">Latest activity</Text>
            <Text className="text-sm text-slate-400">
              {latestEvent.title} · {formatRelativeTime(latestEvent.timestamp)}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}
