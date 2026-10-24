function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Pesquisa sem distinguir maiúsculas nem acentos. */
export function matchesSearch(query: string, ...fields: string[]) {
  if (!query) return true;
  const q = normalize(query);
  return fields.some((field) => normalize(field).includes(q));
}
