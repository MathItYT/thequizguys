import katex from 'katex';


export default function KaTeX({ children, inline }: { children: string, inline?: boolean }) {
    return (
        <span
            dangerouslySetInnerHTML={{
                __html: katex.renderToString(children, {
                    throwOnError: false,
                    displayMode: !inline || false,
                }),
            }}
        />
    );
}