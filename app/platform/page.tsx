import { getSessionData } from "@/lib/session";
import { Ban } from "lucide-react";
import TMGLogo from "../../components/tmg-logo";
import CreateDropdown from "../../components/create-dropdown";
import LogOutButton from "../../components/log-out-button";
import QuizList from "../../components/quiz-list";

export default async function PlatformPage() {
    const { user, roles } = (await getSessionData())!;
    const { username } = user;
    const { isDiscordGuildMember, isMathLikeUserId, isMathHelper, isPhysicsHelper, isChemistryHelper, isBiologyHelper, isComputerScienceHelper } = roles;
    if (!isDiscordGuildMember) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">Debes ser miembro del servidor de Discord para acceder a la plataforma</h1>
            </div>
        );
    }
    return (
        <div className="flex items-center h-screen flex-col gap-4 pt-4 w-full">
            <div className="flex items-center">
                <TMGLogo size={90} />
                <h1 className="text-4xl font-bold">The Math Guys</h1>
            </div>
            <h2 className="text-2xl font-bold mt-4">¡Hola, {username}!</h2>
            <p className="text-lg text-center">¿Qué te gustaría hacer hoy?</p>
            <div className="flex gap-4 mt-4">
                {(isMathHelper || isComputerScienceHelper || isPhysicsHelper || isBiologyHelper || isChemistryHelper || isMathLikeUserId) && <CreateDropdown isMathHelper={isMathHelper!} isPhysicsHelper={isPhysicsHelper!} isChemistryHelper={isChemistryHelper!} isBiologyHelper={isBiologyHelper!} isComputerScienceHelper={isComputerScienceHelper!} isMathLikeUserId={isMathLikeUserId!} />}
                <LogOutButton />
            </div>
            <QuizList roles={roles} />
        </div>
    );
}