import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"

export default function SendingEmailForm () {
    return(
        <section className="">
            <div className="flex flex-col  items-center justify-center">

             <Image
                    src="/auth/Sending e-mail.png"
                    alt="Sending email"
                    width={300}
                    height={300}
                    priority
                    className="block shrink-0"
               />

               <div className="flex flex-col gap-7 items-center justify-center">
                  <h1 className="text-[28px] font-black ">Verificar email</h1>
                  <p className="text-[16px] text-center ">Foi enviado um link para o seu email, <br />
                    <span className="text-[#E73959] font-semibold">“antoniocamposgabriel@gmail.com”</span> , acesse e <br />
                     clique o link para redefinir as tuas credenciais.
                  </p>
               </div>
               <Link href="/resetpassword">

               <Button
                size="lg"
                variant="secondary"
                className="mt-7 cursor-pointer"
                >
                  Reenviar um email
                </Button>
               </Link>
            </div>
        </section>
    )
}