# ADR 0010 — Matrículas, disciplinas por turma, plano curricular, regras, códigos emitidos e utilizadores

- **Status:** Aceito
- **Data:** 2026-11-16

## Contexto

O backend publicou 17 caminhos novos (o schema passou de 44 para 61 caminhos). As etapas do `fluxo-academico.md` que só existiam no Django admin passam a ter API:

| Recurso | Endpoints | Operações |
| --- | --- | --- |
| Matrículas | `/api/academico/enrollments/`, `/{id}/` | CRUD |
| Plano curricular | `/api/academico/curriculum-subjects/`, `/{id}/` | CRUD |
| Disciplinas por turma | `/api/avaliacoes/turma-disciplinas/`, `/{id}/` | CRUD |
| Escalas | `/api/avaliacoes/grading-scales/`, `/{id}/` | CRUD |
| Regras por classe | `/api/avaliacoes/class-rules/`, `/{id}/` | CRUD |
| Exame por disciplina | `/api/avaliacoes/subject-exam-rules/`, `/{id}/` | CRUD |
| Códigos emitidos | `/api/acess-code/codes/`, `/{id}/`, `/{id}/revoke/` | listar, detalhar, revogar |
| Utilizadores | `/api/auth/users/`, `/{id}/` | listar, detalhar, PUT, PATCH |

Outras mudanças no schema:
- `SchoolClass.is_initiation` passa a ser editável;
- endpoints que eram públicos passaram a exigir sessão. A lista de professores deixou de estar aberta, a falha apontada no fluxo académico.

O `SLN CAF API.yaml` foi atualizado a partir de `/api/schema/` em produção.

## Decisão

1. **Services** (ADR 0001):
   - novas pastas: `services/enrollments`, `curriculum-subjects`, `turma-disciplinas`, `grading-scales`, `class-rules`, `subject-exam-rules` e `users`;
   - em `services/access-codes`: `getAccessCodes`, `getAccessCodeById` e `revokeAccessCode`.
   - Os filtros documentados são só `page`. As listas carregam todas as páginas e filtram no cliente.
2. **Stores e hooks** (ADR 0002) para cada recurso. Inclui `studentOptionsStore`, com todos os estudantes, para os selects.
3. **`ResourceManager`:**
   - `onCreate` é opcional: sem ele não há botão de adicionar (usado nos códigos emitidos e nos utilizadores);
   - `rowActions` acrescenta ações por linha, como "Revogar";
   - `toolbar` mostra conteúdo entre o cabeçalho e a pesquisa.
4. **Turmas:** novos separadores **Matrículas**, **Disciplinas por turma** e **Plano curricular**. `?tab=` abre um separador direto.
   - **Matrículas:**
     - o ano letivo é sempre o da turma;
     - o estado pode ser ativa, transferida, concluída ou anulada;
     - **Matricular vários numa turma** lista só os alunos sem matrícula ativa e faz um pedido por aluno.
   - **Disciplinas por turma:**
     - curso, classe e ano letivo vêm da turma;
     - quando o curso/classe tem plano curricular, só aceita disciplinas desse plano.
   - **Classes:** campo "Classe de iniciação" (`is_initiation`) e colunas de escala e notas.
5. **Nova página Regras de avaliação** (`/regras-de-avaliacao`, menu Avaliação), com separadores:
   - **Regras por classe:** transição, PT, exame e pesos. Os pesos têm de somar 1 quando há exame;
   - **Escalas:** limites, positiva e arredondamento;
   - **Exame por disciplina:** simples, MEC ou isenta.

   Todas usam `effective_from` (ano de início).
6. **Códigos de acesso:** separador **Códigos emitidos**:
   - mostra o estado (ativo, expirado ou revogado), o último uso e quem emitiu;
   - tem o botão **Revogar**;
   - a lista atualiza-se quando se geram códigos novos.
7. **Nova página Utilizadores** (`/utilizadores`, menu Gestão):
   - edita o nome, o email, o papel e o estado (ativa/inativa);
   - o admin não pode desativar nem tirar o papel de administrador à própria conta;
   - a criação continua em Professores.
8. **Formulários de notas, exames e decisões:** as opções de estudante e disciplina vêm das matrículas e das disciplinas por turma reais. Deixa de ser preciso escrever UUIDs.
9. **Folha "Lançar por turma":**
   - a regra do PT e a escala (máximo e positiva) vêm das regras em vigor para o ano letivo: o `effective_from` mais alto que não ultrapassa o ano de início;
   - o seed (6.ª/9.ª, 3.º trimestre) fica só como recurso quando não há regras carregadas.
10. **Fluxo académico:** todas as etapas passam a ter estado real e ligação para o ecrã do painel. O botão "Abrir Django admin" sai.

## Consequências

### Positivas

- O fluxo completo, da estrutura ao lançamento de notas, faz-se no painel sem o Django admin.
- O professor passa a ter turmas e alunos assim que o admin cria as matrículas e as disciplinas por turma.
- As regras de avaliação deixam de estar escritas no frontend.

### Negativas

- **Pedidos em série:** a matrícula em lote e a folha de notas fazem um pedido por registo, porque a API não tem operações em lote.
- **Filtros no cliente:** sem filtros documentados nas listagens (`turma`, `teacher`, etc.), as listas carregam tudo e filtram no navegador. Com muitos alunos isto pode ficar lento.
- **Utilizadores:** não há endpoint para criar nem eliminar contas genéricas. Os administradores continuam a ser criados por `/api/auth/register/`.

## Teste com a conta de professor (2026-11-16)

Fluxo testado de ponta a ponta:
- **Admin:**
  - adicionou Matemática ao plano de Informática da 10.ª;
  - matriculou Gelson Luís na turma ID;
  - atribuiu Matemática da ID a Omar Rodrigues;
  - lançou MAC 14,4, que a API guardou como 14.
- **Professor (Omar Rodrigues):** lançou PP 13 e PT 15 na folha "Lançar por turma" (201 + 201).
- **Resultado:** a mini-pauta da API mostra MT 14, Positiva, e a mini-pauta como Concluído.

Erros do backend encontrados e contornados no frontend:

| Endpoint | Problema | Contorno |
| --- | --- | --- |
| `GET /api/teacher/minhas-turmas/` | Responde **500** | `useTeacherClasses` usa o quadro `/dashboard/mini-pautas-data/`, que devolve as mesmas turmas-disciplina |
| `GET /api/teacher/mini-pautas/` sem `trimestre` | Responde **500** (com `trimestre=1` responde 200) | A página calcula o trimestre aberto e envia-o sempre. Se a mini-pauta continuar a falhar, `useMiniPauta` monta a lista a partir das matrículas, da turma-disciplina e das notas, sem MT nem resultado, e avisa |
| Erros 5xx | O Django devolve uma página HTML | `services/data.ts` deixa de mostrar HTML cru e mostra "O servidor teve um erro (500)…" |

A corrigir no backend:
- o erro 500 de `minhas-turmas`;
- o erro 500 da mini-pauta sem `trimestre`;
- `por_completar` no dashboard do professor conta notas em falta (2 para 1 aluno), embora o texto diga "estudantes".
