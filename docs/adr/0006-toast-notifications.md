# ADR 0006 — Notificações (toasts) com react-hot-toast

- **Status:** Aceito
- **Data:** 2026-11-07

## Contexto

As ações (criar, editar, eliminar, gerar códigos, terminar sessão, ...) não davam retorno quando corriam bem. Quando falhavam, o erro aparecia num bloco vermelho fixo no topo da lista, que ficava visível até à ação seguinte.

## Decisão

1. Usar o **react-hot-toast**, com um único `<Toaster />` (`components/ui/toaster.tsx`) montado no layout raiz. O estilo usa as variáveis do tema (`--card`, `--border`, `--success`, `--destructive`).
2. Os componentes não chamam o `toast` diretamente: usam `notify` de `lib/notify.tsx`.
   - `notify.success(msg)`: a ação terminou bem.
   - `notify.error(cause, fallback)`: a ação falhou. Aceita o erro apanhado e mostra a mensagem da API, se existir.
   - `notify.info(msg)` / `notify.warning(msg)`: informação sobre a ação (sem alterações, ação ainda indisponível, aviso de segurança).
3. Onde se aplica:
   - **CRUD** (disciplinas, cursos, classes, anos letivos, turmas, professores e estudantes): sucesso ao criar, editar e eliminar. Erro ao eliminar, em vez do bloco vermelho. O `ResourceManager` aceita `messages` para os textos de cada recurso.
   - **Formulários em diálogo:** os erros de validação e da API continuam dentro do diálogo, junto aos campos. O toast só confirma o sucesso.
   - **Códigos de acesso:**
     - sucesso ao gerar, copiar e exportar;
     - info quando a turma não tem alunos e um lembrete para partilhar os códigos;
     - info quando a cópia automática falha.
   - **Boletim:** erro com código inválido, sucesso ou info, conforme haja notas.
   - **Perfil:**
     - sucesso ao guardar e ao enviar o link de redefinição;
     - info quando não há alterações;
     - info no "Editar perfil" do administrador, que não tem endpoint.
   - **Autenticação:**
     - boas-vindas no login, conta criada, email de redefinição enviado e palavra-passe redefinida;
     - "Sessão terminada" ao sair, ou um aviso se a API não confirmar o logout;
     - os erros dos formulários de autenticação continuam inline.
4. Os erros de carregamento das listas continuam inline, porque descrevem o estado da página e não uma ação.

## Consequências

- O retorno das ações é igual em toda a aplicação, e os textos ficam junto ao código de cada ação.
- Nova dependência: `react-hot-toast`.
