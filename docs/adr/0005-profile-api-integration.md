# ADR 0005 — Perfil do utilizador ligado à sessão e à API

- **Status:** Aceito
- **Data:** 2026-11-06

## Contexto

As páginas de perfil (`/perfil`, `/teacher/perfil`, `/diretor-de-turma/perfil`) e o cabeçalho mostravam dados fictícios. O botão "Terminar sessão" era só um link para `/login`: não chamava `POST /api/auth/logout/` nem limpava os tokens, por isso a sessão continuava ativa.

O que a API oferece para o perfil:

| Necessidade | Endpoint |
| --- | --- |
| Dados do professor/diretor | `GET /api/auth/teachers/{id}/` |
| Editar dados do professor/diretor | `PATCH /api/auth/teachers/{id}/` |
| Terminar sessão | `POST /api/auth/logout/` |
| Alterar palavra-passe | Só existe o fluxo por email: `POST /api/auth/password-reset` + `POST /api/auth/confirm-password/` |
| Perfil de administrador, 2FA, sessões ativas, morada, data de nascimento | **Não existe** |

Durante o teste verificou-se que o `user_id` do JWT **não coincide** com o id do registo em `/api/auth/teachers/` (o pedido por id devolve 404).

## Decisão

1. **`services/auth/find-teacher-for-user.ts`**: tenta `GET /teachers/{user_id}/`; se der 404, percorre `GET /teachers/` e associa por email ou username. É usado pelo enriquecimento da sessão (`enrichTeacherUser`) e pelo perfil.
2. **`hooks/auth/use-current-profile.ts`**: junta os dados da sessão (nome, email, perfil) com o registo de professor quando o perfil é de professor ou diretor. Edita por `PATCH`, enviando só os campos alterados, e atualiza o nome no `authStore` (novo `authStore.updateUser`), para o cabeçalho ficar coerente.
3. **`components/shared/profile/profile-view.tsx`**: vista única usada nas três páginas.
   - Substitui pelos dados reais: nome, email, telefone, BI, género e cargo.
   - Mantém os valores de demonstração do que a API não tem: morada, data de nascimento, instituição, "membro desde", 2FA, sessões ativas e fotografia.
   - "Editar perfil" e "Editar" abrem o formulário só para professores e diretores; para o administrador continuam sem ação, porque não há endpoint.
   - "Alterar" a palavra-passe envia o link de redefinição para o email da conta.
4. **Terminar sessão** chama `authStore.logout()`, que faz `POST /api/auth/logout/` e limpa a sessão local mesmo que o pedido falhe, e depois redireciona para `/login`. "Terminar em todos os dispositivos" mantém-se como estava (sem endpoint).
5. **Cabeçalho**: o `Header` usa o utilizador da sessão; o utilizador fixo dos layouts só aparece sem sessão.
6. Os cartões de perfil ganharam handlers opcionais (`onEdit`, `onChangePassword`); sem handler mantêm o comportamento visual anterior. Nada foi removido.

## Consequências

### Positivas

- Terminar sessão passa a revogar o refresh token e a limpar o dispositivo.
- O perfil e o cabeçalho mostram o utilizador real.

### Negativas

- A associação por email obriga a carregar a lista de professores quando o id não coincide. A API devia devolver o id do professor no token ou expor `GET /api/auth/me/`.
- Os campos de demonstração continuam visíveis e podem confundir até haver endpoints para eles.
