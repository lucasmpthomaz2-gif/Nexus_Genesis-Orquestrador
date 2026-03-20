import { Agent, InsertAgentDNA } from "../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * DNA FUSER
 * Sistema de herança genética e mutação algorítmica para criação de descendentes
 */

export interface Trait {
  name: string;
  value: number | string;
  dominance: "dominant" | "recessive";
}

export interface DNAProfile {
  traits: Trait[];
  mutations: Array<{
    type: string;
    impact: number;
    timestamp: Date;
  }>;
  generation: number;
}

export class DNAFuser {
  private readonly MUTATION_CHANCE = 0.15; // 15% de chance de mutação

  /**
   * Extrai traits do DNA hash
   */
  extractTraits(dnaHash: string): Trait[] {
    const traits: Trait[] = [];

    // Dividir DNA em segmentos de 8 caracteres
    for (let i = 0; i < dnaHash.length; i += 8) {
      const segment = dnaHash.substring(i, i + 8);
      const value = parseInt(segment, 16);

      traits.push({
        name: `trait_${i / 8}`,
        value: value % 100, // Normalizar para 0-100
        dominance: value % 2 === 0 ? "dominant" : "recessive",
      });
    }

    return traits;
  }

  /**
   * Funde DNA de dois agentes
   */
  fuseParentDNA(parent1: Agent, parent2: Agent): string {
    // Combinar DNA dos pais
    const combined = parent1.dnaHash + parent2.dnaHash;

    // Criar novo DNA através de hash
    let newDNA = "";
    for (let i = 0; i < combined.length; i += 2) {
      const char1 = combined.charCodeAt(i);
      const char2 = combined.charCodeAt(i + 1);
      const xor = (char1 ^ char2).toString(16).padStart(2, "0");
      newDNA += xor;
    }

    console.log(`[DNAFuser] DNA fundido de ${parent1.name} + ${parent2.name}`);
    return newDNA.substring(0, 64); // Manter 64 caracteres
  }

  /**
   * Aplica mutações aleatórias
   */
  mutateDNA(dnaHash: string): { newDNA: string; mutations: Array<any> } {
    let newDNA = dnaHash;
    const mutations: Array<any> = [];

    // Verificar chance de mutação
    if (Math.random() < this.MUTATION_CHANCE) {
      // Selecionar posição aleatória para mutar
      const mutationPos = Math.floor(Math.random() * dnaHash.length);
      const originalChar = dnaHash[mutationPos];

      // Gerar novo caractere aleatório
      const newChar = Math.floor(Math.random() * 16).toString(16);

      // Aplicar mutação
      newDNA = dnaHash.substring(0, mutationPos) + newChar + dnaHash.substring(mutationPos + 1);

      mutations.push({
        type: "point_mutation",
        position: mutationPos,
        from: originalChar,
        to: newChar,
        impact: Math.random() * 10, // 0-10% de impacto
        timestamp: new Date(),
      });

      console.log(
        `[DNAFuser] Mutação detectada em posição ${mutationPos}: ${originalChar} → ${newChar}`
      );
    }

    return { newDNA, mutations };
  }

  /**
   * Herda traits dos pais
   */
  inheritTraits(parent1Traits: Trait[], parent2Traits: Trait[]): Trait[] {
    const inheritedTraits: Trait[] = [];

    for (let i = 0; i < Math.max(parent1Traits.length, parent2Traits.length); i++) {
      const p1Trait = parent1Traits[i];
      const p2Trait = parent2Traits[i];

      if (!p1Trait && p2Trait) {
        inheritedTraits.push(p2Trait);
      } else if (p1Trait && !p2Trait) {
        inheritedTraits.push(p1Trait);
      } else if (p1Trait && p2Trait) {
        // Selecionar trait dominante
        if (p1Trait.dominance === "dominant" || Math.random() > 0.5) {
          inheritedTraits.push({
            ...p1Trait,
            value:
              typeof p1Trait.value === "number" && typeof p2Trait.value === "number"
                ? (p1Trait.value + p2Trait.value) / 2
                : p1Trait.value,
          });
        } else {
          inheritedTraits.push(p2Trait);
        }
      }
    }

    return inheritedTraits;
  }

  /**
   * Cria descendente com DNA fundido
   */
  createOffspring(
    parent1: Agent,
    parent2: Agent,
    offspringName: string
  ): {
    dnaHash: string;
    traits: Trait[];
    mutations: Array<any>;
    generation: number;
  } {
    // Fundir DNA dos pais
    const fusedDNA = this.fuseParentDNA(parent1, parent2);

    // Aplicar mutações
    const { newDNA, mutations } = this.mutateDNA(fusedDNA);

    // Extrair traits
    const parent1Traits = this.extractTraits(parent1.dnaHash);
    const parent2Traits = this.extractTraits(parent2.dnaHash);
    const inheritedTraits = this.inheritTraits(parent1Traits, parent2Traits);

    const generation = Math.max(parent1.generation || 0, parent2.generation || 0) + 1;

    console.log(
      `[DNAFuser] ✓ Descendente ${offspringName} criado (Geração ${generation})`
    );

    return {
      dnaHash: newDNA,
      traits: inheritedTraits,
      mutations,
      generation,
    };
  }

  /**
   * Calcula compatibilidade entre agentes para reprodução
   */
  calculateCompatibility(agent1: Agent, agent2: Agent): number {
    // Quanto mais diferentes as especializações, melhor a compatibilidade
    const spec1 = agent1.specialization.toLowerCase();
    const spec2 = agent2.specialization.toLowerCase();

    let similarity = 0;
    for (let i = 0; i < Math.min(spec1.length, spec2.length); i++) {
      if (spec1[i] === spec2[i]) similarity++;
    }

    const compatibility = 100 - (similarity / Math.max(spec1.length, spec2.length)) * 100;

    console.log(
      `[DNAFuser] Compatibilidade ${agent1.name} + ${agent2.name}: ${compatibility.toFixed(2)}%`
    );

    return compatibility;
  }

  /**
   * Gera especialização híbrida para descendente
   */
  generateHybridSpecialization(parent1Spec: string, parent2Spec: string): string {
    const specs = [parent1Spec, parent2Spec];
    const hybrid = specs.join("/");
    console.log(`[DNAFuser] Especialização híbrida: ${hybrid}`);
    return hybrid;
  }

  /**
   * Cria perfil DNA completo
   */
  createDNAProfile(agent: Agent): DNAProfile {
    const traits = this.extractTraits(agent.dnaHash);

    return {
      traits,
      mutations: [],
      generation: agent.generation || 0,
    };
  }

  /**
   * Calcula força genética (0-100)
   */
  calculateGeneticStrength(dnaHash: string): number {
    let strength = 0;

    // Contar bits ativados
    for (let i = 0; i < dnaHash.length; i++) {
      const charCode = parseInt(dnaHash[i], 16);
      strength += (charCode.toString(2).match(/1/g) || []).length;
    }

    // Normalizar para 0-100
    return (strength / (dnaHash.length * 4)) * 100;
  }

  /**
   * Retorna descrição legível de traits
   */
  describeTraits(traits: Trait[]): string {
    return traits
      .map((t) => `${t.name}: ${t.value} (${t.dominance})`)
      .join(", ");
  }
}

export const dnaFuser = new DNAFuser();
