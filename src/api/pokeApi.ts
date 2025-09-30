const API_BASE_URL = "https://pokeapi.co/api/v2";

export const PAGE_SIZE = 24;

export type PokemonListItem = {
  id: number;
  name: string;
  image: string;
};

export type PokemonListPage = {
  items: PokemonListItem[];
  hasMore: boolean;
};

export type PokemonDetail = {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  height: number;
  weight: number;
};

const OFFICIAL_ARTWORK_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export function getPokemonImageUrl(id: number) {
  return `${OFFICIAL_ARTWORK_BASE}/${id}.png`;
}

function extractPokemonId(url: string) {
  const segments = url.split("/").filter(Boolean);
  const numericId = segments[segments.length - 1];
  return Number.parseInt(numericId, 10);
}

export async function fetchPokemonPage(offset = 0, limit = PAGE_SIZE): Promise<PokemonListPage> {
  const response = await fetch(`${API_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os Pokemons.");
  }

  const json = await response.json();

  const items: PokemonListItem[] = json.results.map((item: { name: string; url: string }) => {
    const id = extractPokemonId(item.url);

    return {
      id,
      name: item.name,
      image: getPokemonImageUrl(id),
    };
  });

  const hasMore = offset + limit < json.count;

  return { items, hasMore };
}

export async function fetchPokemonDetail(identifier: number | string): Promise<PokemonDetail> {
  const response = await fetch(`${API_BASE_URL}/pokemon/${identifier}`);

  if (!response.ok) {
    throw new Error("Pokémon não encontrado.");
  }

  const json = await response.json();

  const types: string[] = json.types.map((item: { type: { name: string } }) => item.type.name);
  const abilities: string[] = json.abilities.map(
    (item: { ability: { name: string } }) => item.ability.name
  );

  return {
    id: json.id,
    name: json.name,
    image: getPokemonImageUrl(json.id),
    types,
    abilities,
    height: json.height,
    weight: json.weight,
  };
}
