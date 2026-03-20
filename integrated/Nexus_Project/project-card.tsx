import { View, Text, Pressable } from 'react-native';
import { Project, ProjectStatus } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';

interface ProjectCardProps {
  project: Project;
  onPress?: () => void;
}

const STATUS_CONFIG: Record<ProjectStatus, { color: string; label: string }> = {
  draft: { color: '#9BA1A6', label: 'Draft' },
  development: { color: '#F59E0B', label: 'In Development' },
  review: { color: '#0a7ea4', label: 'Under Review' },
  deployed: { color: '#22C55E', label: 'Deployed' },
  archived: { color: '#687076', label: 'Archived' },
};

const TYPE_EMOJI = {
  web: '🌐',
  mobile: '📱',
  backend: '⚙️',
  contract: '📜',
  other: '📦',
};

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const colors = useColors();
  const statusConfig = STATUS_CONFIG[project.status];
  const typeEmoji = TYPE_EMOJI[project.type];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-surface rounded-xl p-4 border border-border gap-3"
    >
      {/* Header */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">{typeEmoji}</Text>
            <Text className="text-base font-semibold text-foreground flex-1">
              {project.name}
            </Text>
          </View>
          <Text className="text-xs text-muted">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Status Badge */}
        <View
          className="px-3 py-1 rounded-full items-center"
          style={{ backgroundColor: statusConfig.color + '20' }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: statusConfig.color }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Description */}
      {project.description && (
        <Text
          className="text-sm text-muted leading-relaxed"
          numberOfLines={2}
        >
          {project.description}
        </Text>
      )}

      {/* Footer */}
      <View className="flex-row items-center justify-between pt-2 border-t border-border">
        <View className="flex-row gap-3">
          {project.repository && (
            <View className="items-center">
              <Text className="text-xs text-muted">Repository</Text>
              <Text className="text-xs font-semibold text-foreground">GitHub</Text>
            </View>
          )}
          {project.deploymentUrl && (
            <View className="items-center">
              <Text className="text-xs text-muted">Deployed</Text>
              <Text className="text-xs font-semibold text-success">✓</Text>
            </View>
          )}
        </View>

        <Text className="text-xs text-muted">
          {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
        </Text>
      </View>
    </Pressable>
  );
}
