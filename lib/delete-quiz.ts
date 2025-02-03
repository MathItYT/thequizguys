'use server';

import { createClient } from "./supabase/server";

export async function deleteQuiz(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from("Lessons").delete().eq("id", id);
    if (error) {
        console.error(error);
    }
}