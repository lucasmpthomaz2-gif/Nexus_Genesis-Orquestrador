 * AGENT HELPERS
 */

export async function createAgent(
  userId: number,
  name: string,
  description: string,
  dna: Record<string, unknown>,
  parentId1?: number,
  parentId2?: number
): Promise<Agent | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(agents).values({
    userId,
    name,
    description,
    dna,
    generation: parentId1 ? 1 : 0,
    parentId1,
    parentId2,
  });

  const agentId = result[0].insertId;

  // Create initial vitals
  await db.insert(agentVitals).values({
    agentId: agentId as number,
  });

  // Create initial treasury
  await db.insert(treasury).values({
    agentId: agentId as number,
  });

  // Create initial statistics
  await db.insert(agentStatistics).values({
    agentId: agentId as number,
  });

  return db.select().from(agents).where(eq(agents.id, agentId as number)).then(r => r[0] || null);
}
