import { createClient } from "@/lib/supabase/server";
import { Ban } from "lucide-react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Editor } from "../../../../components/editor";
import { getSessionData } from "@/lib/session";

interface QuizPageProps {
    params: Promise<{
        quizNumber: string;
    }>;
};


interface QuizData {
    created_at: string;
    subject: string;
    title: string;
    html_content: string;
    public: boolean;
    description: string;
}


export default async function Page({
    params,
}: QuizPageProps) {
    const session = (await getSessionData())!;
    const supabase = await createClient();
    const id = parseInt((await params).quizNumber);
    const { data, error }: PostgrestSingleResponse<QuizData[]> = await supabase.from("Lessons").select("*").eq("id", id);
    if (error) {
        console.error(error);
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No se encontró el quiz</h1>
            </div>
        );
    }
    const { title, html_content, description, subject, public: isPublic } = data![0];
    if (!session.roles.isMathHelper && !session.roles.isPhysicsHelper && !session.roles.isChemistryHelper && !session.roles.isBiologyHelper && !session.roles.isComputerScienceHelper && !session.roles.isMathLikeUserId) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No tienes permiso para editar este quiz</h1>
            </div>
        );
    }
    if (subject === 'Matemáticas' && !session.roles.isMathHelper && !session.roles.isMathLikeUserId) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No tienes permiso para editar este quiz</h1>
            </div>
        );
    }
    if (subject === 'Física' && !session.roles.isPhysicsHelper && !session.roles.isMathLikeUserId) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No tienes permiso para editar este quiz</h1>
            </div>
        );
    }
    if (subject === 'Química' && !session.roles.isChemistryHelper && !session.roles.isMathLikeUserId) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No tienes permiso para editar este quiz</h1>
            </div>
        );
    }
    if (subject === 'Biología' && !session.roles.isBiologyHelper && !session.roles.isMathLikeUserId) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No tienes permiso para editar este quiz</h1>
            </div>
        );
    }
    if (subject === 'Ciencias de la computación' && !session.roles.isComputerScienceHelper && !session.roles.isMathLikeUserId) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No tienes permiso para editar este quiz</h1>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center w-full">
            <Editor htmlContent={html_content} title={title} description={description} subject={subject} id={id} isPublic={isPublic} />
        </div>
    )
}