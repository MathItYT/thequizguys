import Image from "next/image";
import { LoginButton } from "./login-button";
import '@/envConfig';

export default function Home() {
  return (
    <div className="min-h-full flex flex-col items-center m-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#161616] rounded-full mr-5">
            <Image
              src="/TheMathGuysLogo.png"
              alt="The Math Guys Logo"
              width={180}
              height={38}
              priority
            />
          </div>
          <h1 className="text-6xl font-bold before:content-['The_Math_Guys'] hover:before:content-['The_Quiz_Guys']"></h1>
        </div>
        <div className="flex flex-col items-center justify-center mt-2">
          <h2 className="text-3xl font-bold text-center">¡Aprende con nosotros! 🚀</h2>
          <p className="text-lg text-center">
            Desde <b>matemáticas escolares</b> hasta <b>matemáticas universitarias</b>, ¡estamos aquí para ayudarte con <b>quizzes</b>, <b>clases interactivas</b>, y <b>mucho más!</b> 😎
          </p>
          <div className="flex p-5 justify-center">
            <LoginButton loginUrl={process.env.DISCORD_LOGIN_URL!} />
          </div>
        </div>
      </main>
    </div>
  );
}
