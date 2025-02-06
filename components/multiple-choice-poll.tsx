'use client';

import { MultipleChoicePollContent } from "@/lib/content-definition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import React from "react";
import renderKatexAndCodes from "@/lib/render-katex-and-codes";
import { Button } from "./ui/button";

interface MultipleChoicePollProps {
    content: MultipleChoicePollContent;
}

export default function MultipleChoicePoll({ content }: MultipleChoicePollProps) {
    const [answered, setAnswered] = React.useState(false);
    const questionRef = React.useRef<HTMLDivElement>(null);
    const choicesRef = React.useRef<HTMLDivElement>(null);
    const [selected, setSelected] = React.useState<boolean[]>(new Array(content.choices.length).fill(false));
    React.useEffect(() => {
        if (!questionRef.current) return;
        renderKatexAndCodes(questionRef);
    });
    React.useEffect(() => {
        if (!choicesRef.current) return;
        renderKatexAndCodes(choicesRef);
    });
    return (
        <Card className="w-4/5 mx-auto">
            <CardContent>
                <CardHeader>
                    <CardTitle>Selección múltiple</CardTitle>
                    <CardDescription className="text-slate-200" ref={questionRef} dangerouslySetInnerHTML={{ __html: content.question }} />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4" ref={choicesRef}>
                        {content.choices.map((choice, index) => (
                            <Card key={choice.id} onClick={() => {
                                if (answered) return;
                                setSelected(selected => selected.map((_, i) => i === index ? !selected[i] : selected[i]));
                            }} className={!answered ? (selected[index] ? "bg-sky-700 border-sky-500" : "") : (choice.correct ? "bg-emerald-600 border-emerald-500" : "bg-rose-600 border-rose-500")}>
                                <CardContent>
                                    <CardHeader>
                                        <CardTitle>Opción {index + 1}</CardTitle>
                                        <CardDescription className="text-slate-200" dangerouslySetInnerHTML={{ __html: choice.content }} />
                                    </CardHeader>
                                    {answered && choice.correct && selected[index] && (
                                        <div className="flex justify-center">
                                            <CardDescription className="text-emerald-200"><p className="text-sm">¡Respuesta correcta!</p></CardDescription>
                                        </div>
                                    )}
                                    {answered && !choice.correct && selected[index] && (
                                        <div className="flex justify-center">
                                            <CardDescription className="text-rose-200"><p className="text-sm">Incorrecto.</p><div dangerouslySetInnerHTML={ { __html: choice.explanation } } /></CardDescription>
                                        </div>
                                    )}
                                    {answered && choice.correct && !selected[index] && (
                                        <div className="flex justify-center">
                                            <CardDescription className="text-emerald-200"><p className="text-sm">Respuesta correcta.</p><div dangerouslySetInnerHTML={ { __html: choice.explanation } } /></CardDescription>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <CardFooter className="my-4">
                        <Button onClick={() => {
                            setAnswered(true);
                        }}
                            disabled={!selected.some((selected) => selected || answered)}
                        >Enviar</Button>
                    </CardFooter>
                </CardContent>
            </CardContent>
        </Card>
    )
}