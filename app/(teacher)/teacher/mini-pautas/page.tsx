import { Suspense } from "react";

import { MiniPautaView } from "./_components/mini-pauta-view";

export default function TeacherMiniPautasPage() {
  return (
    <Suspense fallback={null}>
      <MiniPautaView />
    </Suspense>
  );
}
