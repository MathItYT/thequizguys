import { LoginButton } from "./login-button";
import TMGLogo from "./tmg-logo";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col items-center m-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-2">
          <TMGLogo size={90} />
          <h1 className="text-6xl font-bold before:content-['The_Math_Guys'] hover:before:content-['The_Quiz_Guys']"></h1>
        </div>
        <div className="flex flex-col items-center justify-center mt-28">
          <h2 className="text-3xl font-bold text-center">¡Aprende con nosotros! 🚀</h2>
          <p className="text-lg text-center">
            Desde <b>matemáticas escolares</b> hasta <b>matemáticas universitarias</b>, ¡estamos aquí para ayudarte con <b>quizzes</b>, <b>clases interactivas</b>, y <b>mucho más!</b> 😎
          </p>
          <div className="flex p-5 justify-center">
            <LoginButton loginUrl="/login" />
          </div>
        </div>
      </main>
    </div>
  );
}
