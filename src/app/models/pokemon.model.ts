export interface PokemonResponse {
  id: number;
  name: string;
  weight: number;
  height: number;
  moves: {
    move: {
      name: string;
    };
  }[];
  species: {
    name: string;
    url: string;
  };
  base_experience: number;
  past_abilities: {
    generation: {
      name: string;
    };
  }[];
  abilities: {
    slot: number;
    ability: {
      name: string;
    };
  }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  forms: {
    name: string;
  }[];
}

export interface SpeciesResponse {
  evolution_chain: {
    url: string;
  };
}

export interface EvolutionChainResponse {
  chain: EvolutionNode;
}

export interface EvolutionNode {
  species: {
    name: string;
  };
  evolves_to: EvolutionNode[];
}
export interface PokemonListResponse {
  results: { name: string; url: string }[];
}

export interface PokemonSummary {
  name: string;
  image: string;
}
