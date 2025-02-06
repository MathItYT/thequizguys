'use client';

import { TextContent } from "@/lib/content-definition";
import renderKatexAndCodes from "@/lib/render-katex-and-codes";
import React from "react";

interface ViewQuizComponentProps {
    content: TextContent;
}

export default function ViewQuizComponent({ content }: ViewQuizComponentProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (!ref.current) return;
        renderKatexAndCodes(ref);
    });
    return (
        <div ref={ref} dangerouslySetInnerHTML={{ __html: content.content }} className="flex flex-col gap-4 w-4/5 mx-auto" />
    );
}