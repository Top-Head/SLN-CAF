# ADR 0007 — Avaliações (trimestres, notas, exames, resultados, decisões) e auditoria

- **Status:** Aceito
- **Data:** 2026-11-07

## Contexto

A API ganhou dois módulos novos (14 caminhos):

| Recurso | Endpoints | Operações |
| --- | --- | --- |
| Trimestres | `/api/avaliacoes/trimesters/`, `/{id}/` | listar, detalhar, criar, PUT, PATCH, eliminar |
| Notas (MAC/PP/PT) | `/api/avaliacoes/grades/`, `/{id}/` | listar, detalhar, criar, PUT, PATCH, eliminar |
| Exames | `/api/avaliacoes/exams/`, `/{id}/` | listar, detalhar, criar, PUT, PATCH, eliminar |
| Decisões de promoção | `/api/avaliacoes/promotion-decisions/`, `/{id}/` | listar, detalhar, criar |
| Resultados | `/api/avaliacoes/results/`, `/trimester/`, `/annual/`, `/promotion/` | cálculo (GET) por matrícula + trimestre ou ano letivo |
| Auditoria | `/api/audit/logs/`, `/{id}/` | listar com filtros (`action`, `entity`, `entity_id`, `user`, `status_code`, `search`, `date_from`, `date_to`), detalhar |

Também mudou o schema `StudentGrade` (notas devolvidas na validação do código de acesso): `assessment_number` passou a `component` (`MAC`, `PP` ou `PT`).

**Lacuna da API:** as notas, os exames, as decisões e os resultados pedem o identificador da **matrícula** (`enrollment`) e da **disciplina da turma** (`turma_disciplina`). A API ainda não tem endpoints para listar matrículas nem disciplinas de turma.

## Decisão

1. **Services** (padrão do ADR 0001, um ficheiro por operação):
   - `services/trimesters`, `services/grades`, `services/exams`, `services/promotion-decisions`, `services/audit-logs`;
   - `services/results`, com `getResults`, `getTrimesterResult`, `getAnnualResult` e `getPromotionResult`;
   - o `SLN CAF API.yaml` foi atualizado a partir de `/api/schema/`.
2. **Stores e hooks**:
   - usam a fábrica genérica do ADR 0002;
   - stores: `use-trimesters`, `use-grades`, `use-exams`, `use-promotion-decisions` e `use-audit-logs`;
   - hooks: `hooks/assessments/*` e `hooks/audit/use-audit-logs`.
3. **Componentes partilhados** em `components/shared/assessments/`:
   - `TrimestersManager`, `GradesManager`, `ExamsManager` e `PromotionDecisionsManager` usam o `ResourceManager`;
   - `StudentResults` mostra os resultados calculados do trimestre e do ano, a situação de transição e, para o admin, permite registar a decisão;
   - os valores decimais vão para a API como texto com ponto (`"14.5"`). O formulário aceita vírgula;
   - nos exames do tipo MEC envia-se `nee`/`neo`; nos outros tipos envia-se `exam_value`.
4. **Contorno da lacuna das matrículas** (`use-assessment-options.ts` + `id-field.ts`):
   - as opções de estudante e de disciplina são as que aparecem nas notas, exames e decisões já registados;
   - sem nenhuma, o formulário pede o identificador (UUID) e valida o formato antes de enviar.
5. **Páginas**. Cada página tem separadores: primeiro os ecrãs ligados à API, e o ecrã antigo com dados de exemplo no fim, sem nada removido.

   | Página | Separadores da API | Separador com dados de exemplo |
   | --- | --- | --- |
   | Períodos de lançamento (admin) | Trimestres | Prazos por disciplina |
   | Lançamento de notas (admin) | Notas lançadas, Exames | Folha de lançamento |
   | Lançamento de notas (professor) | Notas lançadas, Exames | Mini-pauta |
   | Pautas (admin) | Resultados por aluno (com decisão), Decisões de promoção | Pauta trimestral |
   | Pauta trimestral (diretor de turma) | Resultados por aluno (só consulta) | Pauta da turma |

   O componente `components/shared/page-tabs.tsx` fornece os separadores.
6. **Histórico de alterações** (`/historico-de-alteracoes`): o link já estava no menu e dava 404, por isso foi criada a página.
   - Lista paginada no servidor.
   - Filtros: ação, resultado HTTP, pesquisa e intervalo de datas.
   - O detalhe (`GET /{id}/`) mostra o pedido, o IP, o navegador e as alterações.
7. **Boletim:** as notas mostram o componente (MAC/PP/PT) e são ordenadas por ele.

## Consequências

### Positivas

- Os 14 caminhos novos têm service; as páginas usam todos exceto `GET /api/avaliacoes/results/`. Esse devolve a mesma informação que `results/trimester/`, em lista, e fica disponível no service.
- O histórico de alterações deixa de dar 404.
- Os toasts do ADR 0006 cobrem as novas ações.

### Negativas

- Enquanto a API não listar matrículas e disciplinas de turma, a primeira nota de cada estudante tem de ser lançada com os UUIDs. Fica pedido à API: `GET /api/academico/enrollments/?turma=` e `GET /api/academico/turmas/{id}/disciplinas/`.
- Os separadores com dados de exemplo continuam visíveis e devem ser substituídos quando houver endpoints para eles.
- A escala da nota (`scale`) só é conhecida depois de criar a nota. Antes disso, o formulário valida apenas o formato (até duas casas decimais) e a API valida os limites.
