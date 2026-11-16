# ADR 0009 — Alinhamento com o fluxo académico

- **Status:** Aceito
- **Data:** 2026-11-13

## Contexto

O documento `fluxo-academico.md` descreve o percurso dos dados até ao lançamento de notas: ano letivo, classes, cursos e disciplinas, depois plano curricular, turma, aluno, matrícula, turma-disciplina, regras, trimestre, notas e por fim resultados.

O documento confirma que **matrícula (`Enrollment`), plano curricular (`CurriculumSubject`), turma-disciplina (`TurmaDisciplina`) e regras de avaliação** não têm API. Só se gerem no Django admin (`/admin/`). Por isso a plataforma, sozinha, não consegue levar os dados até ao lançamento: sem matrícula e sem turma-disciplina, o professor não vê turmas nem alunos.

Também define regras que o frontend não seguia:

| Regra do fluxo | Situação anterior |
| --- | --- |
| `Turma.director_teacher` é devolvido como UUID | A lista mostrava-o como nome e procurava o diretor pelo nome |
| `SchoolYear.ano_fim = ano_inicio + 1` | Aceitava qualquer ano de fim posterior |
| PT não se aplica no 3.º trimestre da 6.ª e da 9.ª classe | A folha permitia lançar PT e a API rejeitava |
| A nota é arredondada pela API (`14.4` → `14`) | Não era explicado |
| O tipo de exame é opcional: a API usa o configurado (`SubjectExamRule`); `SPECIAL` é sempre permitido | O formulário obrigava a escolher o tipo |
| Fechar um trimestre exige todas as notas obrigatórias das matrículas ativas | Não era explicado; o erro da API aparecia sem contexto |

## Decisão

1. **Nova página "Fluxo académico"** (`/fluxo-academico`, no grupo Geral do menu do admin):
   - mostra as etapas do documento por fases (estrutura; turmas, professores e alunos; avaliação; resultados);
   - cada etapa da plataforma tem o estado real, com contagens da API, e a ligação para o ecrã onde se faz;
   - as etapas sem API (plano curricular, matrícula, turma-disciplina, regras) aparecem como **Django admin**, com o nome do modelo e a ligação para `NEXT_PUBLIC_API_URL/admin/`;
   - indica o próximo passo em falta.
2. **Turmas:** o diretor é procurado pelo id (com o nome como alternativa, para compatibilidade) e a lista mostra o nome do professor. A lista de professores carrega sempre que alguma turma tem diretor.
3. **Ano letivo:** a validação exige `ano_fim = ano_inicio + 1`.
4. **Folha "Lançar por turma" do professor:**
   - o PT fica desativado no 3.º trimestre da 6.ª e da 9.ª classe;
   - o cabeçalho explica que a API arredonda;
   - os estados vazios explicam qual etapa do fluxo falta (turma-disciplina ou matrícula ativa). As mesmas mensagens aparecem em Minhas turmas e Mini-pautas.
5. **Exames:**
   - "Tipo configurado para a disciplina" é a opção por omissão e não envia `exam_type`; aceita a nota única ou NEE + NEO;
   - o formulário lembra que só há exame em classes com exame final e em disciplinas não isentas;
   - `ExamGradePayload.exam_type` passou a opcional.
6. **Trimestres:** o diálogo de edição explica a regra de fecho. A mensagem da API, com os alunos em falta, continua a aparecer no diálogo.

## Consequências

### Positivas

- O admin vê por onde começar, o que falta e o que tem de ser feito fora da plataforma.
- Menos pedidos rejeitados pela API (PT indevido, ano letivo inválido, tipo de exame).
- O diretor de turma aparece com o nome certo.

### Negativas

- As regras de PT seguem o seed atual (6.ª e 9.ª, 3.º trimestre). Se `ClassRule` mudar no Django admin, a folha tem de acompanhar: a API não expõe as regras.
- As etapas do Django admin não podem ser verificadas pela plataforma. A página só as indica.
- Continua a ser preciso no backend: endpoints de matrícula, plano curricular, turma-disciplina e regras (ver ADR 0007 e 0008).
