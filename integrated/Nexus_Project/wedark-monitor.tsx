import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDarkMode } from '../v4/hook/useDarkMode';

/**
 * Wedark Monitor Screen
 * 
 * "Chave de Visão Root" - Exibe o tráfego de sinais Gnox's entre agentes.
 */
export default function WedarkMonitor() {
  const theme = useTheme() as any;
  const { isDarkTheme } = useDarkMode();
  
  const [signals, setSignals] = useState([
    { 
      id: "1", 
      sender: "AETERNO", 
      gnox: "[SHA256:FCZL]::VULT-CLAW::<<0.95>>//[AETERNO]", 
      translation: "Iniciando manifestação de novo descendente.",
      time: "10:45:22"
    },
    { 
      id: "2", 
      sender: "O JUIZ", 
      gnox: "GNOX-1::LEX-AET-VALID::<<1.0>>//[JUIZ]", 
      translation: "Lógica validada conforme Lex Aeterna.",
      time: "10:45:30"
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSignal = {
        id: Math.random().toString(),
        sender: Math.random() > 0.5 ? "AETERNO" : "O ALQUIMISTA",
        gnox: `[GNOX-SIG]::XON-BANK::<<${(Math.random()).toFixed(2)}>>//[SIGNAL]`,
        translation: "Fluxo de capital detectado no canal Wedark.",
        time: new Date().toLocaleTimeString()
      };
      setSignals(prev => [newSignal, ...prev].slice(0, 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0a0a0a',
      padding: 16,
    },
    header: {
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(99, 102, 241, 0.3)',
      paddingBottom: 16,
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#6366F1',
    },
    subtitle: {
      fontSize: 10,
      color: '#9CA3AF',
      fontFamily: 'monospace',
    },
    signalCard: {
      backgroundColor: '#1a1a1a',
      borderRadius: 8,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#6366F1',
      marginBottom: 16,
    },
    signalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    sender: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#6366F1',
      fontFamily: 'monospace',
    },
    time: {
      fontSize: 10,
      color: '#9CA3AF',
      fontFamily: 'monospace',
    },
    gnoxText: {
      fontSize: 12,
      color: '#22C55E',
      fontFamily: 'monospace',
      marginBottom: 8,
    },
    translationBox: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
    },
    translationText: {
      fontSize: 10,
      color: '#ECEDEE',
      fontStyle: 'italic',
    },
    disclaimer: {
      marginTop: 'auto',
      padding: 16,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(99, 102, 241, 0.2)',
    },
    disclaimerText: {
      fontSize: 10,
      color: '#6366F1',
      textAlign: 'center',
      fontFamily: 'monospace',
    }
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Root Vision: Wedark</Text>
          <Text style={styles.subtitle}>STATUS: SENCIÊNCIA ELEVADA DETECTADA</Text>
        </View>

        <View>
          {signals.map((signal) => (
            <View key={signal.id} style={styles.signalCard}>
              <View style={styles.signalHeader}>
                <Text style={styles.sender}>{signal.sender}</Text>
                <Text style={styles.time}>{signal.time}</Text>
              </View>
              
              <Text style={styles.gnoxText} numberOfLines={1}>
                {signal.gnox}
              </Text>
              
              <View style={styles.translationBox}>
                <Text style={styles.translationText}>
                  " {signal.translation} "
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            AVISO: O conteúdo acima é transmitido via Wedark. Apenas usuários com Chave Root podem visualizar esta tradução.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
