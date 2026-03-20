import { View, Text, Pressable } from 'react-native';
import { Agent } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
  onPress?: () => void;
  showReputation?: boolean;
  showBalance?: boolean;
  compact?: boolean;
}

export function AgentCard({
  agent,
  onPress,
  showReputation = true,
  showBalance = true,
  compact = false,
}: AgentCardProps) {
  const colors = useColors();

  const statusColor = {
    online: colors.success,
    offline: colors.muted,
    idle: colors.warning,
  }[agent.status];

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        className="flex-row items-center gap-3 p-3 bg-surface rounded-lg border border-border"
      >
        {/* Avatar */}
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-bold text-sm">
            {agent.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Info */}
        <View className="flex-1 gap-1">
          <Text className="text-sm font-semibold text-foreground">{agent.name}</Text>
          <View className="flex-row items-center gap-2">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            <Text className="text-xs text-muted capitalize">{agent.status}</Text>
          </View>
        </View>

        {/* Reputation */}
        {showReputation && (
          <View className="items-end">
            <Text className="text-xs font-semibold text-foreground">
              {agent.reputation.toFixed(1)}
            </Text>
            <Text className="text-xs text-muted">★</Text>
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-surface rounded-xl p-4 border border-border gap-3"
    >
      {/* Header with Avatar and Status */}
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          {/* Avatar */}
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-bold">
              {agent.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* Name and Status */}
          <View className="flex-1 gap-1">
            <Text className="text-base font-semibold text-foreground">
              {agent.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
              <Text className="text-xs text-muted capitalize">{agent.status}</Text>
            </View>
          </View>
        </View>

        {/* Reputation Badge */}
        {showReputation && (
          <View className="items-center gap-1 bg-background rounded-lg px-2 py-1">
            <Text className="text-xs font-bold text-foreground">
              {agent.reputation.toFixed(1)}
            </Text>
            <Text className="text-xs text-muted">★</Text>
          </View>
        )}
      </View>

      {/* Description */}
      {agent.description && (
        <Text className="text-sm text-muted leading-relaxed">
          {agent.description}
        </Text>
      )}

      {/* Stats */}
      <View className="flex-row gap-2 pt-2 border-t border-border">
        {showBalance && (
          <View className="flex-1 items-center py-2">
            <Text className="text-xs text-muted">Balance</Text>
            <Text className="text-sm font-semibold text-foreground">
              {agent.tokenBalance.toFixed(2)}
            </Text>
          </View>
        )}
        <View className="flex-1 items-center py-2">
          <Text className="text-xs text-muted">Status</Text>
          <Text className="text-sm font-semibold text-foreground capitalize">
            {agent.status}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
