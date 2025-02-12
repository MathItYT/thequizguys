// import React from "react";
// import highlight from "highlight.js";
// import katex from "katex";

// export default function renderKatexAndCodes(ref: React.RefObject<HTMLDivElement | null>) {
//     if (typeof window === "undefined") {
//         return;
//     }
//     // Iterate over elements recursively. If the element is a span,
//     // render the KaTeX math.
//     function iterateOverElements(element: HTMLElement) {
//         if (element.tagName === "SPAN") {
//             // Check for data-latex and data-display
//             const latex = element.getAttribute("data-latex");
//             const display = element.getAttribute("data-display");
//             if (latex) {
//                 element.innerHTML = katex.renderToString(latex, {
//                     displayMode: display === "yes",
//                     throwOnError: false
//                 });
//             }
//         }
//         if (element.tagName === "PRE" && element.children.length === 1 && element.children[0].tagName === "CODE") {
//             const codeElement = element.children[0] as HTMLElement;
//             const language = codeElement.className.replace("language-", "");
//             if (language) {
//                 const result = highlight.highlight(codeElement.textContent!, { language });
//                 element.innerHTML = result.value;
//             }
//         }
//         for (let i = 0; i < element.children.length; i++) {
//             iterateOverElements(element.children[i] as HTMLElement);
//         }
//     }
//     iterateOverElements(ref.current!);
// }
// Above, but as a React component

import React from "react";
import KaTeX from "@/components/katex";
import CodeBlock from "@/components/code-block";
import parse from "html-react-parser";

interface RenderKatexAndCodesProps extends React.ComponentProps<"div"> {
    html: string;
}

export default function RenderKatexAndCodes({
    html
}: RenderKatexAndCodesProps) {
    return parse(html, {
        replace: (node) => {
            if (node.type === "tag" && node.name === "span" && node.attribs["data-latex"]) {
                return <KaTeX inline={node.attribs["data-display"] === "no"}>
                    {node.attribs["data-latex"]}
                </KaTeX>
            }
            if (node.type === "tag" && node.name === "pre") {
                const firstChild = node.children[0];
                if (firstChild && firstChild.type === "tag" && firstChild.name === "code") {
                    if (firstChild.attribs.class && firstChild.attribs.class.startsWith("language-")) {
                        const language = firstChild.attribs.class.replace("language-", "");
                        const text = firstChild.children[0];
                        if (text.type === "text") {
                            return <CodeBlock language={language}>
                                {text.data}
                            </CodeBlock>
                        }
                    }
                }
            }
        },
    })
}