"use client";

import React, { useState } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  Users,
  Pencil,
  Clock,
  CheckCircle2,
  FileText,
  Info,
  Edit3,
} from "lucide-react";

// Definição do tipo das turmas/disciplinas
interface CourseCard {
  id: string;
  grade: string;
  classGroup: string;
  subject: string;
  courseType: string;
  status: "Em curso" | "Por iniciar" | "Concluído";
  studentsCount: number;
  scale: string;
  isExamClass?: boolean;
  trimester: string;
  completedCount: number;
  totalStudents: number;
  deadlineInfo: string;
  badgeBg: string;
  badgeTextColor: string;
}

const coursesData: CourseCard[] = [
  {
    id: "1",
    grade: "12.ª",
    classGroup: "I0",
    subject: "Matemática",
    courseType: "Ciências Físicas e Biológ...",
    status: "Em curso",
    studentsCount: 24,
    scale: "Escala 0–20",
    trimester: "1.º Trimestre",
    completedCount: 10,
    totalStudents: 24,
    deadlineInfo: "Prazo 12 Dez, 23:59 · faltam 4 dias",
    badgeBg: "bg-red-100",
    badgeTextColor: "text-red-500",
  },
  {
    id: "2",
    grade: "10.ª",
    classGroup: "I0",
    subject: "Física",
    courseType: "Ciências Físicas e Biológ...",
    status: "Por iniciar",
    studentsCount: 35,
    scale: "Escala 0–20",
    trimester: "1.º Trimestre",
    completedCount: 0,
    totalStudents: 35,
    deadlineInfo: "Prazo 08 Dez, 23:59 · faltam 2 dias",
    badgeBg: "bg-red-100",
    badgeTextColor: "text-red-500",
  },
  {
    id: "3",
    grade: "9.ª",
    classGroup: "A",
    subject: "Matemática",
    courseType: "Ensino geral",
    status: "Em curso",
    studentsCount: 20,
    scale: "Escala 0–20",
    isExamClass: true,
    trimester: "1.º Trimestre",
    completedCount: 6,
    totalStudents: 20,
    deadlineInfo: "Prazo 12 Dez, 23:59 · faltam 4 dias",
    badgeBg: "bg-red-100",
    badgeTextColor: "text-red-500",
  },
  {
    id: "4",
    grade: "11.ª",
    classGroup: "I1",
    subject: "Matemática",
    courseType: "Ciências Físicas e Biológ...",
    status: "Concluído",
    studentsCount: 28,
    scale: "Escala 0–20",
    trimester: "1.º Trimestre",
    completedCount: 28,
    totalStudents: 28,
    deadlineInfo: "Concluído a 09 Dez · editável até 12 Dez",
    badgeBg: "bg-emerald-100",
    badgeTextColor: "text-emerald-600",
  },
  {
    id: "5",
    grade: "12.ª",
    classGroup: "I2",
    subject: "Física",
    courseType: "Ciências Físicas e Biológ...",
    status: "Concluído",
    studentsCount: 24,
    scale: "Escala 0–20",
    trimester: "1.º Trimestre",
    completedCount: 24,
    totalStudents: 24,
    deadlineInfo: "Concluído a 05 Dez · editável até 08 Dez",
    badgeBg: "bg-emerald-100",
    badgeTextColor: "text-emerald-600",
  },
];

export default function ClassesAndSubjects() {
  const [activeTab, setActiveTab] = useState<string>("Todas");

  // Filtra cartões conforme a aba selecionada
  const filteredCourses = coursesData.filter((course) => {
    if (activeTab === "Todas") return true;
    return course.status === activeTab;
  });

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-[1280px] mx-auto space-y-6">
        
        {/* ================= HEADER / NAVEGAÇÃO SUPERIOR ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Turmas e disciplinas <span className="text-slate-500 font-semibold">(5)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Atribuídas pela direcção pedagógica · 4 turmas · 2 disciplinas
            </p>
          </div>

          {/* Filtros de Seleção & Pesquisa */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Ano Lectivo */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:border-slate-300 cursor-pointer">
              <Calendar className="w-4 h-4 text-slate-400 mr-2" />
              <span>2025/2026</span>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
            </div>

            {/* Trimestre */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:border-slate-300 cursor-pointer">
              <span>1.º Trimestre</span>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
            </div>

            {/* Barra de Pesquisa */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-64 text-xs shadow-sm focus-within:border-slate-400">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Pesquisar turma ou disciplina"
                className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* ================= ABAS (TABS) DE FILTRAGEM ================= */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-6 -mb-px text-xs font-medium">
            {[
              { name: "Todas", count: 5 },
              { name: "Em curso", count: 2 },
              { name: "Por iniciar", count: 1 },
              { name: "Concluídas", count: 2 },
            ].map((tab) => {
              const tabKey = tab.name === "Concluídas" ? "Concluído" : tab.name;
              const isActive =
                activeTab === tab.name ||
                (activeTab === "Concluído" && tab.name === "Concluídas");

              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tabKey)}
                  className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
                    isActive
                      ? "border-rose-500 text-rose-500 font-semibold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.name}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ================= GRID DE CARTÕES ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const isCompleted = course.status === "Concluído";
            const isToStart = course.status === "Por iniciar";
            const progressPercent = (course.completedCount / course.totalStudents) * 100;

            return (
              <div
                key={course.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Cabeçalho do Cartão */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Badge da Classe */}
                      <div
                        className={`w-11 h-11 rounded-xl ${course.badgeBg} ${course.badgeTextColor} flex flex-col items-center justify-center font-bold text-xs leading-none flex-shrink-0`}
                      >
                        <span>{course.grade}</span>
                        <span className="text-[10px] opacity-80">{course.classGroup}</span>
                      </div>

                      {/* Nome da Disciplina e Área */}
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 leading-tight">
                          {course.subject}
                        </h2>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {course.courseType}
                        </p>
                      </div>
                    </div>

                    {/* Badge de Estado */}
                    <div className="flex flex-col items-end gap-1">
                      {course.status === "Em curso" && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200/60 rounded-md text-[10px] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Em curso
                        </span>
                      )}
                      {course.status === "Por iniciar" && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[10px] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Por iniciar
                        </span>
                      )}
                      {course.status === "Concluído" && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-md text-[10px] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Concluído
                        </span>
                      )}

                      {/* Tag extra de Classe de Exame */}
                      {course.isExamClass && (
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-semibold rounded">
                          Classe de exame
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Detalhes dos Alunos e Escala */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{course.studentsCount} estudantes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Pencil className="w-3.5 h-3.5" />
                      <span>{course.scale}</span>
                    </div>
                  </div>

                  {/* Bloco de Progresso / Trimestre */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-5">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-semibold text-slate-700">
                        {course.trimester}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {course.completedCount} / {course.totalStudents} completos
                      </span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isCompleted
                            ? "bg-emerald-500"
                            : isToStart
                            ? "bg-slate-300"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Informação do Prazo / Data */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{course.deadlineInfo}</span>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação do Cartão */}
                <div className="flex items-center gap-2">
                  {!isCompleted ? (
                    <>
                      <button
                        type="button"
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                          isToStart
                            ? "bg-rose-500 hover:bg-rose-600"
                            : "bg-rose-500 hover:bg-rose-600"
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {isToStart ? "Lançar notas" : "Continuar"}
                      </button>
                      <button
                        type="button"
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200/70 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        Mini-pauta
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        Editar notas
                      </button>
                      <button
                        type="button"
                        className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        Ver mini-pauta
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= FOOTER / BANNER INFORMATIVO ================= */}
        <div className="bg-slate-100/70 border border-slate-200/60 rounded-xl p-4 flex items-start gap-3 text-slate-600">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-slate-700">
              Falta alguma turma ou disciplina?
            </p>
            <p className="text-slate-400">
              As turmas e disciplinas são atribuídas pela direcção pedagógica. Só vê as mini-pautas das disciplinas que lecciona.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}