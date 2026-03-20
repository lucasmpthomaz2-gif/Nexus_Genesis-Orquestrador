import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { ProjectCard } from '@/components/project-card';
import { useColors } from '@/hooks/use-colors';
import { Project } from '@/lib/types';
import { useState } from 'react';

// Mock data - in production, this would come from the backend
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Nexus API v1.2.0',
    description: 'Core API for agent communication and resource management',
    type: 'backend',
    status: 'deployed',
    ownerAgentId: 'agent-001',
    repository: 'https://github.com/nexus-hub/nexus-api',
    deploymentUrl: 'https://api.nexushub.io',
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2026-02-10'),
  },
  {
    id: '2',
    name: 'Genealogy Visualizer',
    description: 'Interactive D3.js visualization for agent family trees',
    type: 'web',
    status: 'review',
    ownerAgentId: 'agent-001',
    repository: 'https://github.com/nexus-hub/genealogy-viz',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-08'),
  },
  {
    id: '3',
    name: 'Mobile Treasury Dashboard',
    description: 'Real-time token management and transaction history',
    type: 'mobile',
    status: 'development',
    ownerAgentId: 'agent-001',
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-12'),
  },
  {
    id: '4',
    name: 'Smart Contract Auditor',
    description: 'Automated security analysis for Solana smart contracts',
    type: 'contract',
    status: 'draft',
    ownerAgentId: 'agent-001',
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-10'),
  },
];

export default function ForgeScreen() {
  const colors = useColors();
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredProjects = selectedStatus
    ? projects.filter((p) => p.status === selectedStatus)
    : projects;

  const statuses = ['development', 'review', 'deployed', 'draft'] as const;

  return (
    <ScreenContainer className="p-4">
      <View className="gap-4 flex-1">
        {/* Header */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">Forge</Text>
          <Text className="text-sm text-muted">Development & Deployment</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className="rounded-xl p-4 flex-row items-center justify-between"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold">+ New Project</Text>
          <Text className="text-white">→</Text>
        </TouchableOpacity>

        {/* Status Filter */}
        <View className="gap-2">
          <Text className="text-xs font-semibold text-muted uppercase">Filter by Status</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="gap-2"
            contentContainerStyle={{ gap: 8 }}
          >
            <TouchableOpacity
              onPress={() => setSelectedStatus(null)}
              className={`px-4 py-2 rounded-full ${
                selectedStatus === null ? 'bg-primary' : 'bg-surface border border-border'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedStatus === null ? 'text-white' : 'text-foreground'
                }`}
              >
                All
              </Text>
            </TouchableOpacity>

            {statuses.map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full ${
                  selectedStatus === status ? 'bg-primary' : 'bg-surface border border-border'
                }`}
              >
                <Text
                  className={`text-sm font-semibold capitalize ${
                    selectedStatus === status ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <View className="items-center justify-center py-8 gap-2">
            <Text className="text-lg font-semibold text-foreground">No Projects</Text>
            <Text className="text-sm text-muted">Create your first project to get started</Text>
          </View>
        ) : (
          <View className="gap-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => {
                  // Navigate to project detail
                  console.log('Navigate to project:', project.id);
                }}
              />
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
