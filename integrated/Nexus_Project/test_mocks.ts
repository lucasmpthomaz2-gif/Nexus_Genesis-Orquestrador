// Mocks para permitir a execução dos testes sem as dependências reais ausentes no ambiente de sandbox

export const invokeLLM = async (payload: any) => {
  return {
    choices: [{
      message: {
        content: JSON.stringify([{
          title: "Missão de Teste",
          description: "Descrição da missão de teste",
          priority: "medium",
          targetSpecialization: ["finance"]
        }])
      }
    }]
  };
};

export const getDb = async () => {
  return {
    select: () => {
      const result: any = [
        { agentId: "AGENT-001", name: "Alpha", specialization: "Finance Specialist", status: "active", balance: 1000 }
      ];
      result.from = () => {
        const fromResult: any = [
          { agentId: "AGENT-001", name: "Alpha", specialization: "Finance Specialist", status: "active", balance: 1000 }
        ];
        fromResult.where = () => {
          const whereResult: any = [
            { agentId: "AGENT-001", name: "Alpha", specialization: "Finance Specialist", status: "active", balance: 1000 }
          ];
          whereResult.limit = () => whereResult;
          whereResult.orderBy = () => ({ limit: () => whereResult });
          return whereResult;
        };
        fromResult.orderBy = () => {
          const orderResult: any = [];
          orderResult.limit = () => orderResult;
          return orderResult;
        };
        return fromResult;
      };
      return result;
    },
    insert: () => ({
      values: () => Promise.resolve()
    }),
    update: () => ({
      set: () => ({
        where: () => Promise.resolve()
      })
    })
  };
};

export const agents = { agentId: "agentId", status: "status", specialization: "specialization" };
export const ecosystemActivities = { agentId: "agentId" };
export const moltbookPosts = { createdAt: "createdAt" };
export const ecosystemMissions = { status: "status", missionId: "missionId" };
export const ecosystemMetrics = {};
export const transactions = {};
