import Image from "next/image";
import Link from "next/link";

export default function SendingEmailForm() {
  return (
    <section className="flex flex-col items-center justify-center">
      <Image
        src="/auth/Sending e-mail.png"
        alt=""
        width={300}
        height={300}
        priority
        className="block shrink-0"
      />

      <div className="flex flex-col items-center justify-center gap-7">
        <h1 className="text-[28px] font-black">Verifique seu email</h1>
        <p className="max-w-xl text-center text-[16px]">
          Se o endereço estiver associado a uma conta, enviaremos um link para
          redefinir sua senha.
        </p>
      </div>

      <Link
        href="/forgot-password"
        className="mt-7 font-semibold text-[#E73959] hover:underline"
      >
        Solicitar outro link
      </Link>
    </section>
  );
}