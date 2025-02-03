'use client'

import React from "react";
import katex from "katex";
import highlight from "highlight.js";

interface ViewQuizComponentProps {
    html: string;
}

function renderKatexAndCodes(ref: React.RefObject<HTMLDivElement | null>) {
    if (typeof window === "undefined") {
        return;
    }
    // Iterate over elements recursively. If the element is a span,
    // render the KaTeX math.
    function iterateOverElements(element: HTMLElement) {
        if (element.tagName === "SPAN") {
            // Check for data-latex and data-display
            const latex = element.getAttribute("data-latex");
            const display = element.getAttribute("data-display");
            if (latex) {
                element.innerHTML = katex.renderToString(latex, {
                    displayMode: display === "yes",
                    throwOnError: false
                });
            }
        }
        if (element.tagName === "PRE" && element.children.length === 1 && element.children[0].tagName === "CODE") {
            const codeElement = element.children[0] as HTMLElement;
            const language = codeElement.className.replace("language-", "");
            if (language) {
                const result = highlight.highlight(codeElement.textContent!, { language });
                element.innerHTML = result.value;
            }
        }
        for (let i = 0; i < element.children.length; i++) {
            iterateOverElements(element.children[i] as HTMLElement);
        }
    }
    iterateOverElements(ref.current!);
}

export default function ViewQuizComponent({
    html
}: ViewQuizComponentProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (ref.current) {
            renderKatexAndCodes(ref);
        }
    }, [ref]);
    return (
        <div ref={ref} className="flex justify-center h-screen mt-10">
            <div dangerouslySetInnerHTML={{ __html: html }} className="w-4/5" />
        </div>
    );
}