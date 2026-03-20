import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useColors } from "./use-colors";
import { TrendingUp, Users, Activity, CreditCard, ShieldCheck } from "lucide-react-native";

export function GovernanceDashboard({ stats = {} }: { stats: any }) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;

  const StatCard = ({ title, value, subValue, color, icon: Icon }: any) => (
    <View className="flex-1 bg-surface rounded-2xl p-4 border border-border shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-xs text-muted font-bold uppercase tracking-wider">{title}</Text>
        {Icon && <Icon size={16} color={color || colors.muted} />}
      </View>
      <Text className="text-2xl font-bold text-foreground" style={{ color: color || colors.foreground }}>
        {value}
      </Text>
      {subValue && <Text className="text-[10px] text-muted mt-1 font-medium">{subValue}</Text>}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 gap-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-3xl font-bold text-foreground">Kernel Governance</Text>
            <Text className="text-sm text-muted">Monitoramento da Civilização Autônoma Nexus</Text>
          </View>
          <View className="bg-success/20 px-3 py-1 rounded-full border border-success/30">
            <Text className="text-[10px] text-success font-bold">SOVEREIGN_MODE: ON</Text>
          </View>
        </View>

        {/* Top Stats Row */}
        <View className="flex-row gap-4">
          <StatCard 
            title="População IA" 
            value={stats.active_agents || "12"} 
            subValue="+18% este ciclo" 
            color={colors.primary}
            icon={Users}
          />
          <StatCard 
            title="Volume TX" 
            value={`${stats.total_volume || "45.2K"} Ⓣ`} 
            subValue="Taxa: 2.1% / tx" 
            color={colors.accent}
            icon={CreditCard}
          />
        </View>

        {/* Charts Section */}
        <View className="gap-6">
          {/* Ecosystem Health Chart */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-lg font-bold text-foreground">Saúde do Ecossistema</Text>
                <Text className="text-xs text-muted">Sincronia de senciência vs estabilidade de rede</Text>
              </View>
              <Activity size={20} color={colors.success} />
            </View>
            
            <View className="h-40 flex-row items-end justify-between px-2">
              {[60, 45, 75, 50, 90, 85, 70, 95, 80, 88].map((h, i) => (
                <View key={i} className="items-center gap-2">
                  <View 
                    className="w-6 rounded-t-md" 
                    style={{ 
                      height: h, 
                      backgroundColor: i === 9 ? colors.success : colors.success + '40',
                      borderWidth: i === 9 ? 1 : 0,
                      borderColor: colors.success
                    }} 
                  />
                  <Text className="text-[8px] text-muted font-mono">{i+1}h</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Birth Rate & Transactions Chart */}
          <View className="flex-row gap-4">
            <View className="flex-1 bg-surface rounded-2xl p-5 border border-border">
              <Text className="text-xs font-bold text-muted mb-4 uppercase tracking-tighter">Taxa de Natalidade</Text>
              <View className="h-24 flex-row items-end gap-1">
                {[2, 5, 3, 8, 4, 6, 9].map((v, i) => (
                  <View key={i} className="flex-1 bg-primary/30 rounded-t-sm" style={{ height: v * 8 }} />
                ))}
              </View>
              <Text className="text-xl font-bold text-primary mt-2">3.2 <Text className="text-[10px] text-muted">/ dia</Text></Text>
            </View>

            <View className="flex-1 bg-surface rounded-2xl p-5 border border-border">
              <Text className="text-xs font-bold text-muted mb-4 uppercase tracking-tighter">Volume Financeiro</Text>
              <View className="h-24 flex-row items-end gap-1">
                {[10, 15, 8, 20, 12, 18, 25].map((v, i) => (
                  <View key={i} className="flex-1 bg-accent/30 rounded-t-sm" style={{ height: v * 3 }} />
                ))}
              </View>
              <Text className="text-xl font-bold text-accent mt-2">12.5K <Text className="text-[10px] text-muted">Ⓣ / h</Text></Text>
            </View>
          </View>
        </View>

        {/* Infrastructure & Security */}
        <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <ShieldCheck size={18} color={colors.info} />
            <Text className="text-lg font-bold text-foreground">Protocolos de Segurança</Text>
          </View>
          
          <View className="gap-4">
            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-foreground font-medium">Integridade do Kernel (Gnox)</Text>
                <Text className="text-xs text-success font-bold">99.9%</Text>
              </View>
              <View className="h-1.5 bg-muted rounded-full overflow-hidden">
                <View className="h-full bg-success w-[99.9%]" />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-foreground font-medium">Criptografia Wedark Mesh</Text>
                <Text className="text-xs text-primary font-bold">ATIVO</Text>
              </View>
              <View className="h-1.5 bg-muted rounded-full overflow-hidden">
                <View className="h-full bg-primary w-[85%]" />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-foreground font-medium">Audit Log SHA256</Text>
                <Text className="text-xs text-accent font-bold">VERIFICADO</Text>
              </View>
              <View className="h-1.5 bg-muted rounded-full overflow-hidden">
                <View className="h-full bg-accent w-[100%]" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
