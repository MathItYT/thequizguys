import { TextPollContent } from "@/lib/content-definition";
import Tiptap from "./tiptap";
import { DateTimePicker24h } from "./datetime-picker";

interface TextPollEditorProps {
    content: TextPollContent;
    updateContent: (newContent: TextPollContent) => void;
}

export default function TextPollEditor({ content, updateContent }: TextPollEditorProps) {
    return (
        <div className="flex flex-col gap-4">
            <Tiptap initialHtml={content.question} onHtmlChange={(html) => {
                updateContent({
                    ...content,
                    question: html
                });
            }} noImages={true} noLinks={true} />
            <Tiptap initialHtml={content.correctAnswer} onHtmlChange={(html) => {
                updateContent({
                    ...content,
                    correctAnswer: html
                });
            }} noImages={true} noLinks={true} />
            <DateTimePicker24h initialDate={content.finishesAt ? new Date(content.finishesAt) : null} onDateChange={(date) => {
                updateContent({
                    ...content,
                    finishesAt: date ? date.getTime() : null
                });
            }} />
        </div>
    );
}
