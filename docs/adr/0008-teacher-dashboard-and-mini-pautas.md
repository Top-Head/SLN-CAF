# ADR 0008 — Dashboard do professor, minhas turmas e mini-pautas

- **Status:** Aceito
- **Data:** 2026-11-10

## Contexto

O `SLN CAF API.yaml` (igual ao schema em produção) ganhou seis endpoints para o professor. Todos são só de leitura e paginados (`{count, next, previous, results}`).

| Endpoint | Conteúdo |
| --- | --- |
| `GET /api/teacher/dashboard/` | Cartões: turmas, mini-pautas, concluídas (`"2/5"`), alunos por completar, trimestre |
| `GET /api/teacher/dashboard/actividade/` | Notas lançadas recentemente (aluno, turma, disciplina, componente, valor, data) |
| `GET /api/teacher/dashboard/mini-pautas-data/` | Progresso por turma-disciplina (notas lançadas / esperadas) |
| `GET /api/teacher/minhas-turmas/` | Turmas-disciplina do professor, com progresso, estado e se é classe de exame |
| `GET /api/teacher/mini-pautas/` | Mini-pauta de uma turma-disciplina: alunos com `enrollment_id`, MAC, PP, PT, MT e resultado |
| `GET /api/teacher/mini-pautas/pdf/` | A mesma mini-pauta em PDF (filtros `turma_disciplina_id`, `trimestre`, `resultado`, `search`) |

Estes endpoints resolvem para o professor a lacuna do ADR 0007. A mini-pauta devolve o `enrollment_id` de cada aluno e o ID da turma-disciplina, que antes não havia forma de obter.

## Decisão

1. **Services** (ADR 0001):
   - `services/teacher-dashboard`: `getTeacherDashboard`, `getTeacherActivity`, `getTeacherMiniPautasBoard`, `getTeacherClasses`.
   - `services/mini-pautas`: `getMiniPautas`, `downloadMiniPautaPdf`.
2. **Formato real das respostas.** O teste em produção mostrou que o schema não corresponde ao que a API devolve:
   - `actividade/`, `mini-pautas-data/` e `minhas-turmas/` devolvem uma **lista simples**, não `{count, results}`;
   - `dashboard/` devolve 200 com `{"detail": "Nenhum trimestre aberto"}` quando não há trimestre aberto.

   Os services passam a usar `toPaginated()` (em `services/data.ts`), que aceita lista, objeto único ou resposta paginada. O `getTeacherDashboard` converte o `{detail}` num erro, e o dashboard mostra essa mensagem como aviso.
3. **Respostas binárias:** o cliente HTTP (`services/data.ts`) aceita `responseType: "blob"`, usado no PDF. Mantém a renovação do token e as mensagens de erro da API.
4. **Stores e hooks** (fábrica do ADR 0002):
   - stores: `use-teacher-dashboard.store.ts` e `use-mini-pautas.store.ts`;
   - hooks: `hooks/teacher-dashboard/*`.
   - A mini-pauta usa a listagem com parâmetros. O schema só documenta `page`, mas o endpoint do PDF aceita os mesmos filtros, por isso a listagem também os envia.
5. **Cache por utilizador:** as stores de recurso descartam a cache quando a sessão termina ou o utilizador muda. Antes, um professor podia ver as turmas do utilizador anterior no mesmo separador.
6. **Páginas do professor:**

   | Página | O que passa a vir da API | O que continua com dados de exemplo |
   | --- | --- | --- |
   | Dashboard | Cartões, mini-pautas, actividade recente; o banner usa o nome da sessão e os totais da API | Prazos por disciplina e próximo prazo (sem endpoint) |
   | Minhas turmas | Os cartões das turmas-disciplina, com links para o lançamento e a mini-pauta dessa turma | — |
   | Mini-pautas | A tabela, os filtros de resultado, a pesquisa (no servidor), o trimestre e o "Exportar PDF" (descarrega o PDF da API) | "Ver histórico" (sem endpoint) |
   | Lançamento de notas | Novo separador **Lançar por turma**: folha com os alunos da mini-pauta; grava em `/api/avaliacoes/grades/` (cria, corrige por PATCH ou elimina se a célula ficar vazia) | Separador **Mini-pauta (exemplo)** |

7. **Mapeamentos** (`app/(teacher)/teacher/_lib/teacher-api.ts`):
   - os textos de `estado` da API passam a em curso, concluído ou por iniciar; quando o texto não é reconhecido, decide o progresso;
   - a escala é 0–10 até à 6.ª classe e 0–20 a partir da 7.ª.
8. **Folha de lançamento por turma:**
   - o trimestre é o aberto do ano letivo da turma (`/api/avaliacoes/trimesters/`);
   - num trimestre fechado a folha fica só de leitura;
   - sem trimestres criados, a folha pede à direcção que os crie.

## Consequências

### Positivas

- O professor lança notas sem conhecer UUIDs: os alunos e a turma-disciplina vêm da mini-pauta.
- O dashboard, as turmas e a mini-pauta mostram os dados reais.
- O PDF é o gerado pela API.

### Negativas

- A folha de lançamento grava nota a nota (um pedido por célula alterada). Não existe endpoint de gravação em lote.
- A API não devolve prazos por disciplina. O dashboard continua a mostrar prazos de exemplo, e a coluna "Prazo" das mini-pautas mostra o ano letivo e a percentagem lançada.
- Os valores de `estado` e `resultado` são texto livre no schema. Se a API mudar os textos, os mapeamentos têm de acompanhar.
- O administrador continua sem lista de matrículas (ADR 0007). Estes endpoints são só do professor.
