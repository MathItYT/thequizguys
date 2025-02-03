import highlight from "highlight.js";
import React from "react";


interface CodeBlockProps {
    children: string;
    language: string;
}


export default function CodeBlock({
    children,
    language
}: CodeBlockProps) {
    const ref = React.useRef<HTMLPreElement>(null);
    React.useEffect(() => {
        if (ref.current) {
            const result = highlight.highlight(children, { language });
            ref.current.innerHTML = result.value;
        }
    });
    return (
        <pre ref={ref}></pre>
    );
}
