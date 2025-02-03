'use server';

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function newContent(subject: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("Lessons").select("id");
    if (error) {
        console.error(error);
        return;
    }
    const quizNumber = data!.reduce((acc, curr) => Math.max(acc, curr.id), 0) + 1;
    const { error: insertError } = await supabase.from("Lessons").insert({ id: quizNumber, subject, title: `Quiz de ${subject} #${quizNumber}`, html_content: "", public: false, description: `Este es un quiz de ${subject} creado por un miembro del servidor de Discord.` });
    if (insertError) {
        console.error(insertError);
        return;
    }
    redirect(`/platform/quiz-editor/${quizNumber}`);
}