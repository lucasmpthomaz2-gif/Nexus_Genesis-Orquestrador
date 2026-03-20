import { nanoid } from "nanoid";

/**
 * MOCK DATABASE FOR NEXUS V2
 * Simula as operações do Drizzle ORM para o ambiente de sandbox.
 */

class MockDb {
  private data: Record<string, any[]> = {
    agents: [],
    missions: [],
    transactions: [],
    ecosystemEvents: [],
    ecosystemMetrics: [],
    agentDNA: [],
    agentLifecycleHistory: [],
    moltbookPosts: []
  };

  select(fields?: any) {
    return {
      from: (table: any) => {
        const tableName = table._name;
        let results = [...(this.data[tableName] || [])];
        
        return {
          where: (condition: any) => {
            // Implementação simplificada de where
            return {
              limit: (n: number) => results.slice(0, n),
              orderBy: (sort: any) => results,
              then: (cb: any) => Promise.resolve(cb(results))
            };
          },
          orderBy: (sort: any) => {
            return {
              limit: (n: number) => results.slice(0, n),
              then: (cb: any) => Promise.resolve(cb(results))
            };
          },
          limit: (n: number) => results.slice(0, n),
          then: (cb: any) => Promise.resolve(cb(results))
        };
      }
    };
  }

  insert(table: any) {
    const tableName = table._name;
    return {
      values: (values: any) => {
        const item = Array.isArray(values) ? values : [values];
        this.data[tableName].push(...item);
        return Promise.resolve({ lastInsertId: nanoid() });
      }
    };
  }

  update(table: any) {
    const tableName = table._name;
    return {
      set: (values: any) => {
        return {
          where: (condition: any) => {
            return Promise.resolve();
          }
        };
      }
    };
  }

  delete(table: any) {
    const tableName = table._name;
    return {
      where: (condition: any) => {
        this.data[tableName] = [];
        return Promise.resolve();
      },
      then: (cb: any) => {
        this.data[tableName] = [];
        return Promise.resolve();
      }
    };
  }
}

const mockDb = new MockDb();

export const getDb = async () => mockDb;

// Mock Drizzle Objects
export const agents = { _name: 'agents' };
export const missions = { _name: 'missions' };
export const transactions = { _name: 'transactions' };
export const ecosystemEvents = { _name: 'ecosystemEvents' };
export const ecosystemMetrics = { _name: 'ecosystemMetrics' };
export const agentDNA = { _name: 'agentDNA' };
export const agentLifecycleHistory = { _name: 'agentLifecycleHistory' };
export const moltbookPosts = { _name: 'moltbookPosts' };
