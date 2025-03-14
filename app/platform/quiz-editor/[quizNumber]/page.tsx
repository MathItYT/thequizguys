import { createClient } from "@/lib/supabase/server";
import { Ban } from "lucide-react";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Editor } from "../../../../components/editor";
import { getSessionData } from "@/lib/session";
import { Content } from "@/lib/content-definition";

interface QuizPageProps {
    params: Promise<{
        quizNumber: string;
    }>;
};


interface QuizData {
    created_at: string;
    subject: string;
    title: string;
    contents: Content[];
    public: boolean;
    description: string;
    is_fixed: boolean;
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
    if (data!.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen gap-4">
                <Ban className="text-red-500 text-4xl" />
                <h1 className="text-4xl font-bold">No se encontró el quiz</h1>
            </div>
        );
    }
    const { title, contents, description, subject, public: isPublic, is_fixed } = data![0];
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
        <div className="flex flex-col items-center w-full mb-2">
            <Editor isFixed={is_fixed} contents={contents} title={title} description={description} subject={subject} id={id} isPublic={isPublic} />
        </div>
    )
}