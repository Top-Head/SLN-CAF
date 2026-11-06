# ADR 0004 — Páginas de Disciplinas e Turmas ligadas à API

- **Status:** Aceito
- **Data:** 2026-11-06

## Contexto

As páginas `/disciplinas` e `/turmas` usavam catálogos fictícios (`_lib/mock-data.ts`) com campos que a API não tem: código e área da disciplina, sala, turno, ocupação, professores por disciplina, estado ativo/inativo. Cursos, classes e anos letivos não tinham página nenhuma, mas são obrigatórios para criar uma turma.

Pontos do contrato da API que influenciam a UI:

- `Turma.director_teacher` é só leitura e devolve o **nome** do professor; para escrever usa-se `director_teacher_id` (só escrita, aceita `null`).
- Disciplina e curso têm apenas `nome`; classe tem `numero`; ano letivo tem `ano_inicio`/`ano_fim` e **não** pode ser editado nem eliminado.

## Decisão

1. **`/disciplinas`** passa a usar `ResourceManager` com CRUD real (listar, ver por `GET /{id}/`, criar, editar por `PATCH`, eliminar). Os dados fictícios foram removidos.
2. **`/turmas`** passa a ter separadores **Turmas · Cursos · Classes · Anos letivos**, porque os três últimos só existem para estruturar turmas e assim ficam ao lado de quem os usa.
   - Turmas: tabela paginada no servidor, filtros por curso, classe e ano letivo (`?course=&school_class=&school_year=`), diálogo com selects e diretor de turma opcional. Edição por `PUT` (o formulário tem todos os campos).
   - Cursos e classes: CRUD completo; anos letivos: só listar, ver e criar (a acção "Editar"/"Eliminar" não aparece).
3. **Diretor de turma:** ao editar, o id é encontrado comparando `director_teacher` com `nome`/`username` dos professores. Se não for possível identificar o diretor atual, `director_teacher_id` **não é enviado**, para não o remover sem querer.
4. `RowActionsMenu` mostra só as acções com handler; sem nenhum handler mantém o comportamento anterior (todas as acções, modo ilustrativo).
5. Componentes genéricos novos em `components/shared/resource/`: `ResourceManager` (lista + pesquisa + paginação + CRUD) e `ResourceFormDialog` (campos texto, número e select; modos criar/editar/ver).
6. O ficheiro `SLN CAF API.yaml` na raiz foi atualizado com o schema em produção (`/api/schema/`), que já inclui os endpoints académicos e de códigos de acesso.

## Consequências

### Positivas

- Todas as operações da API ficam acessíveis pela interface de administração.
- Os componentes genéricos tornam barato acrescentar novos catálogos.

### Negativas

- Perde-se a apresentação rica dos mocks (ocupação, turnos, pendências) até a API expor esses dados.
- `components/shared/catalog/*` e `hooks/catalog/use-catalog-state.ts` ficam quase sem uso (só `paginate` continua a ser usado); podem ser removidos ou reaproveitados quando a API tiver mais dados.
- A correspondência do diretor por nome falha se dois professores tiverem o mesmo nome; a API deveria devolver também `director_teacher_id` na leitura.
