# ADR 0002 — Store genérica para recursos académicos paginados

- **Status:** Aceito
- **Data:** 2026-11-06

## Contexto

A API (`https://sln-caf.onrender.com/api/docs/`) expõe, além de autenticação, professores e alunos, cinco recursos académicos novos:

| Recurso        | Endpoint                         | Operações                      |
| -------------- | -------------------------------- | ------------------------------ |
| Cursos         | `/api/academico/courses/`        | list, retrieve, create, put, patch, delete |
| Classes        | `/api/academico/school-classes/` | list, retrieve, create, put, patch, delete |
| Anos letivos   | `/api/academico/school-years/`   | list, retrieve, create         |
| Disciplinas    | `/api/academico/subjects/`       | list, retrieve, create, put, patch, delete |
| Turmas         | `/api/academico/turmas/`         | list (filtros `course`, `school_class`, `school_year`), retrieve, create, put, patch, delete |

Todos usam a paginação padrão do DRF (`count`, `next`, `previous`, `results`) e exigem `Bearer` token.

As stores existentes (`use-students.store.ts`, `use-teachers.store.ts`) têm ~200 linhas cada, quase idênticas. Repetir esse código mais cinco vezes multiplicaria a manutenção e os bugs.

Além disso:

- Cursos, classes, anos letivos e disciplinas **não suportam `?search=`** e são listas pequenas.
- O formulário de turma precisa de **todas** as opções de cursos, classes, anos letivos e professores (não só a primeira página).
- O tamanho de página do servidor não está documentado no schema.

## Decisão

1. **Services** seguem o ADR 0001 (um ficheiro por operação), em `services/courses`, `services/school-classes`, `services/school-years`, `services/subjects` e `services/turmas`.
2. `services/data.ts` passa a exportar utilitários partilhados:
   - `Paginated<T>` — tipo da resposta paginada;
   - `withQuery(path, params)` — monta a query string ignorando valores vazios;
   - `fetchAllPages(fetchPage)` — percorre `next` até ao fim (limite de 50 páginas).
3. **`stores/create-resource-store.ts`** — fábrica que cria uma store externa (`useSyncExternalStore`) por recurso com:
   - `fetchList(params)` — página atual + filtros, com descarte de respostas obsoletas (`requestId`);
   - `fetchAll()` — todas as páginas, com cache e deduplicação de pedidos;
   - `invalidate()` — recarrega a lista e a cache de "todos" depois de uma mutação;
   - `pageSize` — inferido da primeira página que tem `next`.
4. Cada recurso tem uma store de 10 linhas (`use-courses.store.ts`, …, `use-teacher-options.store.ts`) e hooks finos em `hooks/academic/*` sobre `hooks/resources/use-resource.ts`.
5. **Recursos pequenos** (cursos, classes, anos letivos, disciplinas) carregam todas as páginas e fazem pesquisa/paginação no cliente, através do componente `components/shared/resource/resource-manager.tsx`.
6. **Turmas** usam paginação e filtros no servidor (`fetchList`), porque podem crescer e a API já suporta os filtros.
7. As stores de estudantes e professores **não foram migradas** nesta alteração, para não mexer em código que já funciona; podem migrar para a fábrica mais tarde.

## Consequências

### Positivas

- Um novo recurso paginado precisa só dos services, de uma store de 10 linhas e de um hook.
- Selects (curso, classe, ano letivo, diretor de turma) partilham a mesma cache entre páginas.
- Mutações invalidam a cache, por isso listas e selects ficam coerentes.

### Negativas

- Pesquisa no cliente deixa de escalar se os catálogos pequenos crescerem muito; nesse caso a API deve expor `?search=` e o recurso deve passar a usar `fetchList`.
- `fetchAllPages` faz N pedidos sequenciais para catálogos grandes.
- Duas abordagens de store convivem (dedicadas e genérica) até à migração de estudantes/professores.
