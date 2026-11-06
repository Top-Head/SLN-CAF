# ADR 0003 — Integração dos códigos de acesso e boletim público

- **Status:** Aceito
- **Data:** 2026-11-06

## Contexto

A API expõe três endpoints de códigos de acesso (note-se a grafia `acess-code` no caminho):

| Endpoint | Auth | Descrição |
| --- | --- | --- |
| `POST /api/acess-code/students/{student_id}/generate-code/` | Bearer | Gera um código para um aluno, válido 2 dias, e revoga os anteriores. |
| `POST /api/acess-code/turmas/{turma_id}/generate-codes/` | Bearer | Gera códigos para todos os alunos com matrícula ativa na turma. |
| `POST /api/acess-code/validate/` | Público | Valida `{ codigo }` e devolve o aluno, a validade e as notas. Pode responder `429`. |

Não existe endpoint para **listar** códigos já gerados nem alunos por turma: o código só é conhecido na resposta da geração. A página `/codigos-de-acesso` usava dados fictícios com encarregado, telefone e último acesso, campos que a API não fornece.

## Decisão

1. Services em `services/access-codes/` (ADR 0001): `generateStudentAccessCode`, `generateTurmaAccessCodes`, `validateAccessCode`.
2. `stores/use-access-codes.store.ts` guarda os códigos gerados **apenas em memória**, agrupados por turma, durante a sessão do separador. Nunca vão para `localStorage`. A store é limpa quando o token de acesso desaparece (logout).
3. A página `/codigos-de-acesso`:
   - escolhe a turma a partir de `GET /api/academico/turmas/` (todas as páginas);
   - "Gerar códigos da turma" chama o endpoint da turma; os códigos aparecem revelados;
   - "Regenerar" numa linha chama o endpoint do aluno e substitui só essa linha;
   - o estado (Activo/Expirado) é calculado a partir de `expires_at`;
   - a exportação CSV continua **sem os códigos**, só processo, nome, estado e validade;
   - os indicadores (turma, gerados, activos, expirados) são calculados dos dados reais;
   - colunas sem suporte na API (encarregado, telefone, último acesso) foram removidas.
4. Nova página pública **`/boletim`** (grupo `(auth)`, sem sessão) para o encarregado validar o código e ver as notas agrupadas por disciplina e trimestre. O formulário (`components/shared/report-card/validate-code-form.tsx`) também aparece em `/codigos-de-acesso` para a secretaria confirmar um código. O login ganhou a ligação "Consultar boletim".
5. O código é enviado tal como foi escrito (só sem espaços nas pontas); a normalização de maiúsculas fica a cargo da API.

## Consequências

### Positivas

- Fluxo real de ponta a ponta: gerar → partilhar → encarregado consulta.
- Códigos (dados sensíveis) não persistem no dispositivo.

### Negativas

- Ao recarregar a página, os códigos gerados deixam de estar visíveis; é preciso regenerar (o que invalida os anteriores). Uma API de listagem (`GET /acess-code/turmas/{id}/`) resolveria isto.
- Não é possível mostrar alunos **sem** código, porque a API não lista matrículas por turma.
- Validar um código pela página de administração conta para o limite de tentativas (`429`).
