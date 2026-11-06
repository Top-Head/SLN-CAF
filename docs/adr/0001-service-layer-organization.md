# ADR 0001 — Organização da camada de services por operação

- **Status:** Aceito
- **Data:** 2026-11-04

## Contexto

A camada de `services` já estava dividida por domínio (`auth`, `teachers`), mas cada domínio concentrava todas as operações num único ficheiro (`auth.service.ts`, `teachers.service.ts`). Isso dificultava:

- localizar rapidamente uma operação específica;
- revisar alterações de forma isolada;
- testar ou substituir uma operação sem tocar no ficheiro inteiro;
- perceber que responsabilidades pertencem a cada domínio.

## Decisão

Adotar **um ficheiro por operação** dentro de cada categoria de `services`.

Estrutura atual:

```txt
services/
├── data.ts
├── auth/
│   ├── confirm-password.ts
│   ├── enrich-teacher-user.ts
│   ├── index.ts
│   ├── jwt.ts
│   ├── login.ts
│   ├── logout.ts
│   ├── normalize-session.ts
│   ├── refresh.ts
│   ├── register-teacher.ts
│   ├── register.ts
│   ├── request-password-reset.ts
│   └── type.ts
└── teachers/
    ├── create-teacher.ts
    ├── delete-teacher.ts
    ├── get-all-teachers.ts
    ├── get-teacher-by-id.ts
    ├── index.ts
    ├── patch-teacher.ts
    ├── type.ts
    └── update-teacher.ts
```

Regras:

1. Cada operação exporta uma única função nomeada, com o mesmo nome do ficheiro em kebab-case.
   Exemplo: `get-teacher-by-id.ts` exporta `getTeacherById`.
2. Ficheiros de operação não exportam objetos agrupados (`authService`, `teachersService`).
3. Cada categoria tem um `index.ts` que funciona apenas como barril público, reexportando operações e tipos.
4. Tipos partilhados do domínio ficam em `type.ts` dentro da categoria.
5. Helpers internos sem chamada HTTP ficam em ficheiros próprios (`jwt.ts`, `normalize-session.ts`).
6. Importações entre categorias são feitas por ficheiros específicos ou pelo barril da categoria de destino.
7. O consumidor importa do barril da categoria, por exemplo:
   ```ts
   import { getTeacherById } from "@/services/teachers";
   ```

## Consequências

### Positivas

- Cada ficheiro tem uma responsabilidade clara e pequena.
- Revisões e testes ficam mais focados.
- É mais simples localizar, mover ou remover uma operação.
- O barril mantém os imports dos consumidores estáveis.
- A separação de tipos e helpers reduz acoplamento dentro da categoria.

### Negativas

- Aumenta o número de ficheiros.
- Exige disciplina para evitar dependências circulares entre categorias.
- O barril deve ser mantido atualizado ao adicionar novas operações.

## Como adicionar uma nova operação

1. Criar o ficheiro em kebab-case dentro da categoria correta.
2. Exportar uma função nomeada que representa a operação.
3. Adicionar a reexportação no `index.ts` da categoria.
4. Consumir através do barril da categoria.
