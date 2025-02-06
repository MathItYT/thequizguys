import { createClient } from "@/lib/supabase/server";
import { Ban } from "lucide-react";
import { DiscordData } from "@/lib/discord-data";
import { getSessionData } from "@/lib/session";
import TextContent from "@/components/text-content";
import { Content } from "@/lib/content-definition";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MultipleChoicePoll from "@/components/multiple-choice-poll";
import SingleChoicePoll from "@/components/single-choice-poll";

interface ViewPageProps {
    params: Promise<{
        quizNumber: string;
        contentNumber: string;
    }>
}

function isAuthorized(isPublic: boolean, subject: string, roles: DiscordData["roles"]) {
    if (!isPublic && !roles.isMathHelper && !roles.isPhysicsHelper && !roles.isChemistryHelper && !roles.isBiologyHelper && !roles.isComputerScienceHelper && !roles.isMathLikeUserId) {
        return false;
    }
    if (subject === 'Matemáticas' && !roles.isMathHelper && !roles.isMathLikeUserId && !isPublic) {
        return false;
    }
    if (subject === 'Física' && !roles.isPhysicsHelper && !roles.isMathLikeUserId && !isPublic) {
        return false;
    }
    if (subject === 'Química' && !roles.isChemistryHelper && !roles.isMathLikeUserId && !isPublic) {
        return false;
    }
    if (subject === 'Biología' && !roles.isBiologyHelper && !roles.isMathLikeUserId && !isPublic) {
        return false;
    }
    if (subject === 'Ciencias de la Computación' && !roles.isComputerScienceHelper && !roles.isMathLikeUserId && !isPublic) {
        return false;
    }
    return true;
}

export default async function ViewPage({
    params,
}: ViewPageProps) {
    const { quizNumber, contentNumber } = await params;
    const roles = (await getSessionData())!.roles;
    const supabase = await createClient();
    const id = parseInt(quizNumber);
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
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No se encontró el quiz</h1>
            </div>
        );
    }
    const { public: isPublic, subject } = data![0];
    if (!isAuthorized(isPublic, subject, roles)) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No tienes permiso para ver este quiz</h1>
            </div>
        );
    }
    const contentLength = data![0].contents.length;
    if (parseInt(contentNumber) >= contentLength) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No se encontró el contenido</h1>
            </div>
        );
    }
    const content = data![0].contents[parseInt(contentNumber)] as Content;
    const i = parseInt(contentNumber);
    if (content.type === 'text') {
        return (
            <div>
                <div className="mt-8">
                    <TextContent content={content} /></div>
                <div className="flex justify-start py-8 px-20">
                    {i > 0 && <Button><Link href={`/platform/view/${quizNumber}/${i - 1}`}>Anterior</Link></Button>}
                </div>
                <div className="flex justify-end py-8 px-20">
                    {i < contentLength - 1 && <Button><Link href={`/platform/view/${quizNumber}/${i + 1}`}>Siguiente</Link></Button>}
                </div>
            </div>
        );
    }
    if (content.type === 'multiple-choice-poll') {
        return (
            <div>
                <div className="mt-8">
                    <MultipleChoicePoll content={content} /></div>
                <div className="flex justify-start py-8 px-20">
                    {i > 0 && <Button><Link href={`/platform/view/${quizNumber}/${i - 1}`}>Anterior</Link></Button>}
                </div>
                <div className="flex justify-end py-8 px-20">
                    {i < contentLength - 1 && <Button><Link href={`/platform/view/${quizNumber}/${i + 1}`}>Siguiente</Link></Button>}
                </div>
            </div>
        );
    }
    if (content.type === 'single-choice-poll') {
        return (
            <div>
                <div className="mt-8">
                    <SingleChoicePoll content={content} /></div>
                <div className="flex justify-start py-8 px-20">
                    {i > 0 && <Button><Link href={`/platform/view/${quizNumber}/${i - 1}`}>Anterior</Link></Button>}
                </div>
                <div className="flex justify-end py-8 px-20">
                    {i < contentLength - 1 && <Button><Link href={`/platform/view/${quizNumber}/${i + 1}`}>Siguiente</Link></Button>}
                </div>
            </div>
        );
    }
}