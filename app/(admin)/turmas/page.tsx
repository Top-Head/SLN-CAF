import { Suspense } from "react";

import { AcademicStructure } from "./_components/academic-structure";

export default function ClassesPage() {
  return (
    <Suspense fallback={null}>
      <AcademicStructure />
    </Suspense>
  );
}
