import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";


export default function ForgotPasswordForm (){
    return(
        <form className="">
            <h1 className="text-[28px] text-[#1C1C1C] font-black">Recuperar senha</h1>
            <p className="text-[14px] text-[#999999] ">
                Informe seu email para recuperar a senha, será enviado <br /> 
                um email com um link para redifinir a senha.
            </p>

            <div className="space-y-4">
                <div>
                    <Label className="mt-10.5">
                        Seu email
                    </Label>
                     <div className="relative mt-3 ">
                       <img src="/auth/Email.png" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                       <Input
                         id="email"
                         name="email"
                         type="email"
                         placeholder="Informe o seu email"
                         className="h-11 pl-9 text-[12px] text-[#999999]"
                         required
                       />
                     </div>
                </div>
            <Link href="/sending-email">
                 <Button
                   size="lg"
                   variant="ghost"
                   className="mt-5.5 cursor-pointer text-white text-[14px] font-bold"
                >
                    Continuar
                </Button>
            </Link>

            </div>
        </form>
    )
}