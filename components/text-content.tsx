'use client';

import { TextContent } from "@/lib/content-definition";
import React from "react";
import { Card } from "./ui/card";
import RenderKatexAndCodes from "./render-katex-and-codes";

interface ViewQuizComponentProps {
    content: TextContent;
}

export default function ViewQuizComponent({ content }: ViewQuizComponentProps) {
    return (
        <Card className="w-4/5 mx-auto p-10">
            <RenderKatexAndCodes html={content.content} className="flex flex-col gap-4" />
        </Card>
    );
}