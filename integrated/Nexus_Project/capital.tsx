import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { Transaction } from '@/lib/types';
import { useState } from 'react';

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    fromAgentId: 'agent-001',
    toAgentId: 'agent-002',
    amount: 150,
    type: 'payment',
    description: 'Payment for API integration service',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    fromAgentId: 'marketplace',
    toAgentId: 'agent-001',
    amount: 500,
    type: 'reward',
    description: 'NFT sale reward - Genesis Algorithm',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '3',
    fromAgentId: 'agent-001',
    toAgentId: 'nexus-infra',
    amount: 50,
    type: 'fee',
    description: 'Platform infrastructure fee',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    fromAgentId: 'parent-agent',
    toAgentId: 'agent-001',
    amount: 100,
    type: 'dividend',
    description: 'Monthly dividend from parent agent',
    status: 'confirmed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const TRANSACTION_ICONS: Record<string, string> = {
  payment: '💸',
  reward: '🎁',
  fee: '⚡',
  dividend: '📈',
  transfer: '↔️',
};

const TRANSACTION_COLORS: Record<string, string> = {
  payment: '#EF4444',
  reward: '#22C55E',
  fee: '#F59E0B',
  dividend: '#0a7ea4',
  transfer: '#6366F1',
};

export default function CapitalScreen() {
  const colors = useColors();
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const totalBalance = 1250.50;
  const earnedShare = totalBalance * 0.8;
  const parentShare = totalBalance * 0.1;
  const infraShare = totalBalance * 0.1;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 20 }}>
        {/* Header */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">Capital</Text>
          <Text className="text-sm text-muted">Treasury & Resource Market</Text>
        </View>

        {/* Treasury Overview */}
        <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
          <View className="gap-1">
            <Text className="text-sm text-muted">Total Balance</Text>
            <Text className="text-4xl font-bold text-primary">
              {totalBalance.toFixed(2)}
            </Text>
            <Text className="text-xs text-muted">≈ ${(totalBalance * 1).toFixed(2)} USD</Text>
          </View>

          {/* Revenue Distribution */}
          <View className="pt-4 border-t border-border gap-3">
            <Text className="text-xs font-semibold text-muted uppercase">Revenue Distribution</Text>
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="w-3 h-3 rounded-full bg-success" />
                  <Text className="text-sm text-foreground">Your Earnings (80%)</Text>
                </View>
                <Text className="text-sm font-bold text-foreground">{earnedShare.toFixed(2)}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <Text className="text-sm text-foreground">Parent Agent (10%)</Text>
                </View>
                <Text className="text-sm font-bold text-foreground">{parentShare.toFixed(2)}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="w-3 h-3 rounded-full bg-warning" />
                  <Text className="text-sm text-foreground">Infrastructure (10%)</Text>
                </View>
                <Text className="text-sm font-bold text-foreground">{infraShare.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 rounded-xl p-4 items-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold">Trade Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-xl p-4 items-center border border-border bg-surface"
          >
            <Text className="text-foreground font-semibold">View Contracts</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View className="gap-3">
          <Text className="text-sm font-semibold text-foreground">Recent Transactions</Text>
          {transactions.map((tx) => {
            const isIncoming = tx.toAgentId === 'agent-001';
            const icon = TRANSACTION_ICONS[tx.type];
            const color = TRANSACTION_COLORS[tx.type];

            return (
              <View
                key={tx.id}
                className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: color + '20' }}
                  >
                    <Text className="text-lg">{icon}</Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {tx.description}
                    </Text>
                    <Text className="text-xs text-muted">{formatTime(tx.timestamp)}</Text>
                  </View>
                </View>
                <View className="items-end gap-1">
                  <Text
                    className="text-sm font-bold"
                    style={{ color: isIncoming ? colors.success : colors.foreground }}
                  >
                    {isIncoming ? '+' : '-'}{tx.amount}
                  </Text>
                  <Text className="text-xs text-muted capitalize">{tx.status}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
