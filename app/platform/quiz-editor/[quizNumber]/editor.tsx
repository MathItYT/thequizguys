'use client';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditorProps {
    htmlContent: string;
    title: string;
    description: string;
};

export function Editor({
    htmlContent,
    title,
    description
}: EditorProps) {
    return (
        <div className="flex flex-col gap-4 w-4/5">
            <Input defaultValue={title} placeholder="Ponle un título a tu quiz" className="text-5xl font-bold" />
            <Textarea defaultValue={description} placeholder="Describe tu quiz" className="text-lg" />
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};