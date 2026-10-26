/** Maiúsculas e números, sem 0, O, 1 e I (fáceis de confundir ao ditar o código). */
export const ACCESS_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function format(chars: string[]) {
  return `${chars.slice(0, 4).join("")}-${chars.slice(4).join("")}`;
}

/** Novo código aleatório no formato XXXX-XXXX. */
export function generateAccessCode() {
  const values = crypto.getRandomValues(new Uint32Array(8));
  return format(Array.from(values, (v) => ACCESS_CODE_ALPHABET[v % ACCESS_CODE_ALPHABET.length]));
}

/** Código determinístico para dados de exemplo, ex.: "K7QM-4X2P". */
export function seededAccessCode(seed: number) {
  return format(
    Array.from(
      { length: 8 },
      (_, k) => ACCESS_CODE_ALPHABET[(seed * 7 + k * 11 + seed * k * 3) % ACCESS_CODE_ALPHABET.length],
    ),
  );
}
