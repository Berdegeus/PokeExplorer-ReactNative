export function capitalize(value: string) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatPokemonNumber(id: number) {
  return `#${id.toString().padStart(3, "0")}`;
}
