import { getDiscordData } from "@/lib/discord-data";
import { redirect } from "next/navigation";

export interface PageProps {
    searchParams: Promise<{ code?: string }>;
}


export default async function Page({
    searchParams
}: PageProps) {
    const { code } = await searchParams;
    if (!code) {
        redirect("/login");
    }
    const { user, roles } = await getDiscordData(code);
    const { username } = user;
    return (
        <div>
            <h1>¡Hola, {username}!</h1>
            <p>¡Bienvenido a la plataforma!</p>
            {roles.isMathHelper && <p>¡Eres un ayudante de matemáticas!</p>}
            {roles.isPhysicsHelper && <p>¡Eres un ayudante de física!</p>}
            {roles.isChemistryHelper && <p>¡Eres un ayudante de química!</p>}
            {roles.isBiologyHelper && <p>¡Eres un ayudante de biología!</p>}
            {roles.isComputerScienceHelper && <p>¡Eres un ayudante de ciencias de la computación!</p>}
            {roles.isMathLikeUserId && <p>¡Eres MathLike!</p>}
        </div>
    );
}