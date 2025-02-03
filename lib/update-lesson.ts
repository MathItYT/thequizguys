'use server';

import { createClient } from "./supabase/server";

export async function updateLesson(id: number, subject: string, title: string, html_content: string, isPublic: boolean, description: string) {
    const supabese = await createClient();
    const { error } = await supabese.from("Lessons").update({ subject, title, html_content, public: isPublic, description }).eq("id", id);
    if (error) {
        console.error(error);
    }
}