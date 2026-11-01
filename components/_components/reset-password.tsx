import Image from "next/image";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
};

function PasswordField({ id, name, label }: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>

      <div className="relative">
        <Image
          src="/auth/Password.png"
          alt=""
          width={15}
          height={15}
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2"
        />

        <Input
          id={id}
          name={name}
          type="password"
          placeholder="••••••••••••"
          className="h-11 pl-9 pr-10 text-[12px] text-[#999999]"
          required
        />

        <button
          type="button"
          aria-label="Mostrar senha"
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-zinc-600"
        >
          <Image src="/auth/Eyes.png" alt="" width={15} height={15} />
        </button>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <form>
      <h1 className="text-[28px] font-black">Redefinir a senha</h1>
      <p className="text-[#999999] text-[14px]">Crie uma nova senha para sua conta</p>

      <div className="flex flex-col gap-5 mt-[64px]">
        <PasswordField id="password" name="password" label="Nova senha" />
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar a senha"
        />
      </div>

      <Button size="lg" variant="ghost" className="text-white font-semibold mt-[22px]">Redefinir senha</Button>
    </form>
  );
}