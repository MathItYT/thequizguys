import React from 'react';
import { MultipleChoicePollContent } from '@/lib/content-definition';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { DateTimePicker24h } from './datetime-picker';
import ReorderableList from './reorderable-list';
import Tiptap from './tiptap';

interface MultipleChoicePollEditorProps {
    content: MultipleChoicePollContent;
    updateContent: (newContent: MultipleChoicePollContent) => void;
}

export default function MultipleChoicePollEditor({ content, updateContent }: MultipleChoicePollEditorProps) {
    return (
        <div className="flex flex-col">
            <Tiptap initialHtml={content.question} onHtmlChange={(html) => {
                updateContent({
                    ...content,
                    question: html
                });
            }} />
            <ReorderableList items={content.choices.map((choice, index) => ({ id: choice.id, content: <div className="flex gap-4">
                <Checkbox checked={choice.correct} onClick={() => {
                    updateContent({
                        ...content,
                        choices: content.choices.map((choice, choiceIndex) => choiceIndex === index ? { ...choice, correct: !choice.correct } : choice)
                    });
                }} />
                <div className="flex flex-col gap-4">
                    <Tiptap initialHtml={choice.content} onHtmlChange={(html) => {
                        updateContent({
                            ...content,
                            choices: content.choices.map((choice, choiceIndex) => choiceIndex === index ? { ...choice, content: html } : choice)
                        });
                    }} />
                    <Tiptap initialHtml={choice.explanation} onHtmlChange={(html) => {
                        updateContent({
                            ...content,
                            choices: content.choices.map((choice, choiceIndex) => choiceIndex === index ? { ...choice, explanation: html } : choice)
                        });
                    }} />
                </div>
            </div>, data: choice }))} onReorder={(newItems) => {
                updateContent({
                    ...content,
                    choices: newItems.map((item) => item.data)
                });
            }} onDelete={(deleteIndex) => {
                updateContent({
                    ...content,
                    choices: content.choices.filter(content => content.id !== deleteIndex)
                });
            }} />
            <div className="flex justify-center gap-4 my-4">
                <Button onClick={() => {
                    updateContent({
                        ...content,
                        choices: [...content.choices, { content: '<p>Opción</p>', correct: false, explanation: '<p>Explicación</p>', id: Math.max(...content.choices.map(choice => choice.id), 0) + 1 }]
                    });
                }}>
                    <Plus />
                </Button>
            </div>
            <DateTimePicker24h initialDate={content.finishesAt ? new Date(content.finishesAt) : null} onDateChange={(newDate) => {
                updateContent({
                    ...content,
                    finishesAt: newDate ? newDate.getTime() : null
                });
            }} />
        </div>
    );
}