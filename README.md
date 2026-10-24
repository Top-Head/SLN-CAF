# Sistema de lançamento de notas - CAF

## Arquitetura e Organização de Pastas

Este projeto utiliza **Next.js 16** com **App Router** e segue as convenções oficiais do Next.js. A estrutura foi organizada de forma simples e escalável, mantendo o diretório `app/` na raiz.

### Estrutura atual

```text
sln-caf/
├── app/                        # App Router (rotas, layouts e route handlers)
│   ├── (admin)/               # Route group - Área administrativa (sem afetar a URL)
│   ├── (auth)/                # Route group - Autenticação (sem afetar a URL)
│   ├── api/                   # Route Handlers (endpoints da API)
│   ├── favicon.ico            # Ícone da aplicação
│   ├── globals.css            # Estilos globais (Tailwind CSS v4)
│   ├── layout.tsx             # Layout raiz
│   └── page.tsx               # Página inicial
│
├── components/                 # Componentes reutilizáveis globais
│   ├── shared/                # Componentes compostos partilhados entre páginas
│   └── ui/                    # Componentes UI atómicos/primitivos
│
├── lib/                        # Lógica e utilitários globais
│   ├── config/                # Configurações da aplicação
│   └── utils/                 # Funções utilitárias puras (ex.: cn, helpers)
│
├── hooks/                      # Hooks React reutilizáveis globais
├── types/                      # Tipos, interfaces e type aliases globais
├── constants/                  # Constantes globais da aplicação
├── styles/                     # Estilos adicionais ou variáveis CSS
├── public/                     # Assets estáticos (imagens, ícones, etc.)
│
├── .husky/                     # Hooks Git (commitlint)
├── eslint.config.mjs           # Configuração ESLint
├── next.config.ts              # Configuração Next.js
├── tsconfig.json               # Configuração TypeScript (com paths aliases)
└── package.json                # Dependências e scripts
```

### Convenções adotadas

| Convenção | Descrição |
|---|---|
| **Route Groups `(nome)`** | Pastas entre parênteses são usadas para organizar rotas sem alterar o caminho da URL. Ex.: `(admin)`, `(auth)`. |
| **Pastas privadas `_nome`** | Caso seja necessário, pastas com underscore não são consideradas pelo sistema de rotas e servem para colocalizar componentes/hooks/utilitários exclusivos de um segmento. |
| **`components/ui/`** | Componentes atómicos e reutilizáveis (botões, inputs, cards, etc.), geralmente sem lógica de negócio. |
| **`components/shared/`** | Componentes compostos ou partilhados entre diferentes rotas/grupos. |
| **`lib/utils/`** | Funções puras e helpers reutilizáveis. Ex.: `cn()` para merge de classes Tailwind. |
| **`lib/config/`** | Configurações centralizadas da aplicação. |
| **`hooks/`** | Hooks customizados globais, reutilizáveis em qualquer parte da aplicação. |
| **`types/`** | Definições de tipos TypeScript globais para manter tipagem consistente. |
| **`constants/`** | Valores constantes reutilizáveis (rotas, chaves, enums, etc.). |
| **`app/api/`** | Route Handlers para criação de endpoints REST/JSON dentro do App Router. |

### Path Aliases

O projeto utiliza aliases configurados no `tsconfig.json` para simplificar imports:

```json
{
  "@/*": ["./*"],
  "@/app/*": ["./app/*"],
  "@/components/*": ["./components/*"],
  "@/lib/*": ["./lib/*"],
  "@/hooks/*": ["./hooks/*"],
  "@/utils/*": ["./lib/utils/*"],
  "@/types/*": ["./types/*"],
  "@/constants/*": ["./constants/*"],
  "@/styles/*": ["./styles/*"]
}
```

### Scripts disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Cria build de produção
npm run start    # Inicia o servidor em modo produção
npm run lint     # Executa linting com ESLint
```

### Tecnologias

- [Next.js 16](https://nextjs.org/) - Framework React com App Router
- [React 19](https://react.dev/) - Biblioteca UI
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS v4](https://tailwindcss.com/) - Estilização
- [Husky](https://typicode.github.io/husky/) + [Commitlint](https://commitlint.js.org/) - Padronização de commits
