"use client";

import { BookOpen } from "lucide-react";

import { ResourceManager } from "@/components/shared/resource/resource-manager";
import {
  createSubject,
  deleteSubject,
  getSubjectById,
  patchSubject,
  type Subject,
} from "@/services/subjects";
import { subjectsStore } from "@/stores/use-subjects.store";

export function SubjectsList() {
  return (
    <ResourceManager<Subject>
      title="Lista de disciplinas"
      noun="disciplinas"
      addLabel="Nova disciplina"
      icon={BookOpen}
      searchPlaceholder="Pesquise por disciplina aqui!"
      emptyMessage="Ainda não existem disciplinas cadastradas."
      store={subjectsStore}
      columns={[
        {
          label: "Disciplina",
          render: (subject) => (
            <span className="font-medium">{subject.nome}</span>
          ),
        },
      ]}
      getLabel={(subject) => subject.nome}
      searchText={(subject) => [subject.nome]}
      compare={(a, b) => a.nome.localeCompare(b.nome, "pt")}
      dialog={{
        titles: {
          create: "Nova disciplina",
          edit: "Editar disciplina",
          view: "Dados da disciplina",
        },
        descriptions: {
          create: "Indique o nome da nova disciplina.",
          edit: "Atualize o nome da disciplina.",
          view: "Consulte a disciplina registada.",
        },
        submitLabel: "Cadastrar disciplina",
        fields: [
          {
            name: "nome",
            label: "Nome da disciplina",
            icon: BookOpen,
            maxLength: 100,
            required: true,
            wide: true,
            placeholder: "Ex.: Matemática",
          },
        ],
        emptyValues: { nome: "" },
        toValues: (subject) => ({ nome: subject.nome }),
      }}
      messages={{
        created: (values) => `Disciplina "${values.nome}" criada com sucesso.`,
        updated: (_, values) => `Disciplina "${values.nome}" atualizada.`,
        deleted: (subject) => `Disciplina "${subject.nome}" eliminada.`,
      }}
      fetchOne={getSubjectById}
      onCreate={(values, token) => createSubject({ nome: values.nome }, token)}
      onUpdate={(subject, values, token) =>
        patchSubject(subject.id, { nome: values.nome }, token)
      }
      onDelete={(subject, token) => deleteSubject(subject.id, token)}
    />
  );
}
