interface EditorProps {
    htmlContent: string;
};

export function Editor({
    htmlContent
}: EditorProps) {
    return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
};