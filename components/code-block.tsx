import { useToast } from "@/hooks/use-toast";
import highlight from "highlight.js";
import { Copy } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";


interface CodeBlockProps {
    children: string;
    language: string;
    className?: string;
    dontIncludeCopyButton?: boolean;
}


export default function CodeBlock({
    children,
    language,
    className,
    dontIncludeCopyButton
}: CodeBlockProps) {
    const ref = React.useRef<HTMLPreElement>(null);
    React.useEffect(() => {
        if (ref.current) {
            const result = highlight.highlight(children, { language });
            ref.current.innerHTML = result.value;
        }
    });
    const { toast } = useToast();
    return (
        <div className="relative w-fit h-fit mx-auto">
            {!dontIncludeCopyButton && <Button onClick={() => {
                navigator.clipboard.writeText(children);
                toast({
                    title: "Copiado",
                    description: "El código ha sido copiado al portapapeles.",
                });
            }} variant="ghost" className="absolute top-2 right-2 rounded-lg p-1 h-fit cursor-pointer text-white">
                <Copy size={24} className="w-fit" />
            </Button>}
            <pre ref={ref} className={className}></pre>
        </div>
    );
}
