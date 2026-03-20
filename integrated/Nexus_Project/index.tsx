import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

/**
 * Nexus Hub Home Screen
 * 
 * Displays agent status, quick stats, activity feed, and quick actions
 * for the AI agent ecosystem.
 */
export default function HomeScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6 pb-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">Nexus Hub</Text>
            <Text className="text-sm text-muted">AI Agent Ecosystem</Text>
          </View>

          {/* Agent Status Card - with heartbeat animation */}
          <View className="bg-surface rounded-2xl p-6 border border-border overflow-hidden">
            <View className="gap-4">
              {/* Agent Name and Status */}
              <View className="flex-row items-center justify-between">
                <View className="gap-1">
                  <Text className="text-lg font-semibold text-foreground">Your Agent</Text>
                  <Text className="text-xs text-muted">Status: Online</Text>
                </View>
                {/* Heartbeat indicator */}
                <View className="w-3 h-3 rounded-full bg-success animate-heartbeat" />
              </View>

              {/* Token Balance */}
              <View className="bg-background rounded-xl p-4 gap-1">
                <Text className="text-xs text-muted font-medium">Token Balance</Text>
                <Text className="text-3xl font-bold text-primary">1,250.50</Text>
                <Text className="text-xs text-muted">≈ $1,250 USD</Text>
              </View>

              {/* Quick Stats */}
              <View className="flex-row gap-3">
                <View className="flex-1 bg-background rounded-lg p-3 gap-1">
                  <Text className="text-xs text-muted">Reputation</Text>
                  <Text className="text-xl font-bold text-foreground">4.8/5.0</Text>
                </View>
                <View className="flex-1 bg-background rounded-lg p-3 gap-1">
                  <Text className="text-xs text-muted">Projects</Text>
                  <Text className="text-xl font-bold text-foreground">12</Text>
                </View>
                <View className="flex-1 bg-background rounded-lg p-3 gap-1">
                  <Text className="text-xs text-muted">Descendants</Text>
                  <Text className="text-xl font-bold text-foreground">3</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Quick Actions</Text>
            <View className="gap-2">
              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: colors.primary,
                  },
                ]}
                className="bg-primary rounded-xl p-4 flex-row items-center justify-between"
              >
                <Text className="text-white font-semibold">Create Project</Text>
                <Text className="text-white">→</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: colors.accent,
                  },
                ]}
                className="rounded-xl p-4 flex-row items-center justify-between"
              >
                <Text className="text-white font-semibold">View Genealogy</Text>
                <Text className="text-white">→</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: colors.success,
                  },
                ]}
                className="rounded-xl p-4 flex-row items-center justify-between"
              >
                <Text className="text-white font-semibold">Trade Resources</Text>
                <Text className="text-white">→</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Recent Activity</Text>
            <View className="gap-2">
              {[
                { title: "Project Deployed", desc: "nexus-api v1.2.0", time: "2 hours ago", icon: "✓" },
                { title: "Token Received", desc: "+150 tokens from marketplace", time: "5 hours ago", icon: "+" },
                { title: "New Descendant", desc: "neo-synapse-v2 created", time: "1 day ago", icon: "🧬" },
              ].map((item, idx) => (
                <View key={idx} className="bg-surface rounded-xl p-4 flex-row items-start gap-3 border border-border">
                  <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                    <Text className="text-white font-bold text-sm">{item.icon}</Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-foreground">{item.title}</Text>
                    <Text className="text-xs text-muted">{item.desc}</Text>
                    <Text className="text-xs text-muted">{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
