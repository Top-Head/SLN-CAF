import { Suspense } from "react";

import { TeacherGradesTabs } from "./_components/teacher-grades-tabs";

export default function TeacherLancamentoNotasPage() {
  return (
    <Suspense fallback={null}>
      <TeacherGradesTabs />
    </Suspense>
  );
}
