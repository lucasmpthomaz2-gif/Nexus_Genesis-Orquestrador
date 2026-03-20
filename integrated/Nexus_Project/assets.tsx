import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { NFTAsset } from '@/lib/types';
import { useState } from 'react';

const MOCK_ASSETS: NFTAsset[] = [
  {
    id: '1',
    name: 'Genesis Algorithm',
    description: 'First AI-generated algorithm in the Nexus ecosystem',
    creatorAgentId: 'agent-001',
    contractAddress: '0x1234567890abcdef',
    tokenId: '1',
    metadata: {
      image: 'https://via.placeholder.com/200',
      attributes: {
        complexity: 'Advanced',
        language: 'Python',
        category: 'Algorithm',
      },
    },
    authoritySHA256: 'FCZl/2Zq5v0oPRsRUDW7j9Kz1/PBaZhv11mKoqpME0o',
    value: 500,
    createdAt: new Date('2025-12-01'),
    transactionHistory: [],
  },
  {
    id: '2',
    name: 'Neural Network Model',
    description: 'Optimized model for sentiment analysis',
    creatorAgentId: 'agent-001',
    contractAddress: '0x1234567890abcdef',
    tokenId: '2',
    metadata: {
      image: 'https://via.placeholder.com/200',
      attributes: {
        accuracy: '94.5%',
        parameters: '12M',
        framework: 'PyTorch',
      },
    },
    authoritySHA256: 'FCZl/2Zq5v0oPRsRUDW7j9Kz1/PBaZhv11mKoqpME0o',
    value: 750,
    createdAt: new Date('2026-01-15'),
    transactionHistory: [],
  },
  {
    id: '3',
    name: 'API Integration Kit',
    description: 'Reusable components for API integration',
    creatorAgentId: 'agent-001',
    contractAddress: '0x1234567890abcdef',
    tokenId: '3',
    metadata: {
      image: 'https://via.placeholder.com/200',
      attributes: {
        components: '15',
        documentation: 'Complete',
        license: 'MIT',
      },
    },
    authoritySHA256: 'FCZl/2Zq5v0oPRsRUDW7j9Kz1/PBaZhv11mKoqpME0o',
    value: 300,
    createdAt: new Date('2026-02-01'),
    transactionHistory: [],
  },
];

export default function AssetsScreen() {
  const colors = useColors();
  const [assets] = useState<NFTAsset[]>(MOCK_ASSETS);

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 20 }}>
        {/* Header */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">Asset Lab</Text>
          <Text className="text-sm text-muted">NFTs & Intellectual Property</Text>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border gap-2">
            <Text className="text-xs text-muted">Total Assets</Text>
            <Text className="text-2xl font-bold text-foreground">{assets.length}</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border gap-2">
            <Text className="text-xs text-muted">Total Value</Text>
            <Text className="text-2xl font-bold text-success">
              {assets.reduce((sum, a) => sum + a.value, 0)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 rounded-xl p-4 items-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold">+ Mint NFT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-xl p-4 items-center border border-border bg-surface"
          >
            <Text className="text-foreground font-semibold">Marketplace</Text>
          </TouchableOpacity>
        </View>

        {/* Assets Grid */}
        <View className="gap-3">
          <Text className="text-sm font-semibold text-foreground">Your Assets</Text>
          {assets.map((asset) => (
            <TouchableOpacity
              key={asset.id}
              className="bg-surface rounded-xl p-4 border border-border gap-3 active:opacity-70"
            >
              {/* Asset Header */}
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
                  <Text className="text-base font-semibold text-foreground">
                    {asset.name}
                  </Text>
                  <Text className="text-xs text-muted">
                    Token ID: {asset.tokenId}
                  </Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full items-center"
                  style={{ backgroundColor: colors.success + '20' }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.success }}>
                    ✓ Verified
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text className="text-sm text-muted leading-relaxed">
                {asset.description}
              </Text>

              {/* Attributes */}
              {asset.metadata.attributes && (
                <View className="flex-row gap-2 flex-wrap">
                  {Object.entries(asset.metadata.attributes).slice(0, 2).map(([key, value]) => (
                    <View
                      key={key}
                      className="px-2 py-1 rounded-lg bg-background"
                    >
                      <Text className="text-xs text-muted">
                        {key}: <Text className="font-semibold text-foreground">{value}</Text>
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Footer */}
              <View className="flex-row items-center justify-between pt-2 border-t border-border">
                <View>
                  <Text className="text-xs text-muted">Current Value</Text>
                  <Text className="text-lg font-bold text-foreground">
                    {asset.value} tokens
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-muted">Created</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
