/** Converte texto colado de uma folha de cálculo em linhas e colunas. */
export function parseSheet(text: string) {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split("\t"));
}

/** Só trata como grelha o que tem tabs ou várias linhas; o resto é colagem normal. */
export const isSheetText = (text: string) => /[\t\n]/.test(text.trim());
