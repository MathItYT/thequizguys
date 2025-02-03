import { createClient } from "@/lib/supabase/server";
import { Ban } from "lucide-react";
import { DiscordData } from "@/lib/discord-data";
import { getSessionData } from "@/lib/session";
import ViewQuizComponent from "@/components/view-quiz-component";

interface ViewPageProps {
    params: Promise<{
        quizNumber: string;
    }>
}

function isAuthorized(isPublic: boolean, subject: string, roles: DiscordData["roles"]) {
    if (!isPublic && !roles.isMathHelper && !roles.isPhysicsHelper && !roles.isChemistryHelper && !roles.isBiologyHelper && !roles.isComputerScienceHelper && !roles.isMathLikeUserId) {
        return false;
    }
    if (subject === 'Matemáticas' && !roles.isMathHelper && !roles.isMathLikeUserId) {
        return false;
    }
    if (subject === 'Física' && !roles.isPhysicsHelper && !roles.isMathLikeUserId) {
        return false;
    }
    if (subject === 'Química' && !roles.isChemistryHelper && !roles.isMathLikeUserId) {
        return false;
    }
    if (subject === 'Biología' && !roles.isBiologyHelper && !roles.isMathLikeUserId) {
        return false;
    }
    if (subject === 'Ciencias de la Computación' && !roles.isComputerScienceHelper && !roles.isMathLikeUserId) {
        return false;
    }
    return true;
}

export default async function ViewPage({
    params,
}: ViewPageProps) {
    const roles = (await getSessionData())!.roles;
    const supabase = await createClient();
    const id = parseInt((await params).quizNumber);
    const { data, error } = await supabase.from("Lessons").select("*").eq("id", id);
    if (error) {
        console.error(error);
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No se encontró el quiz</h1>
            </div>
        );
    }
    const { html_content, public: isPublic, subject } = data![0];
    if (!isAuthorized(isPublic, subject, roles)) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No tienes permiso para ver este quiz</h1>
            </div>
        );
    }
    return (
        <ViewQuizComponent html={html_content} />
    );
}