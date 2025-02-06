'use client';

import { SingleChoicePollContent } from "@/lib/content-definition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import React from "react";
import renderKatexAndCodes from "@/lib/render-katex-and-codes";
import { Button } from "./ui/button";

interface SingleChoicePollProps {
    content: SingleChoicePollContent;
}

export default function SingleChoicePoll({ content }: SingleChoicePollProps) {
    const [answered, setAnswered] = React.useState(false);
    const questionRef = React.useRef<HTMLDivElement>(null);
    const choicesRef = React.useRef<HTMLDivElement>(null);
    const [selected, setSelected] = React.useState<number | null>(null);
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
                                setSelected(index);
                            }} className={!answered ? (selected === index ? "bg-sky-700 border-sky-500" : "") : (index === content.correctChoice ? "bg-emerald-600 border-emerald-500" : "bg-rose-600 border-rose-500")}>
                                <CardContent>
                                    <CardHeader>
                                        <CardTitle>Opción {index + 1}</CardTitle>
                                        <CardDescription className="text-slate-200" dangerouslySetInnerHTML={{ __html: choice.content }} />
                                    </CardHeader>
                                    {answered && selected === index && index === content.correctChoice && (
                                        <div className="flex justify-center">
                                            <CardDescription className="text-emerald-200"><p className="text-sm">¡Respuesta correcta!</p></CardDescription>
                                        </div>
                                    )}
                                    {answered && selected === index && index !== content.correctChoice && (
                                        <div className="flex justify-center">
                                            <CardDescription className="text-rose-200"><p className="text-sm">Incorrecto.</p><div dangerouslySetInnerHTML={ { __html: choice.explanation } } /></CardDescription>
                                        </div>
                                    )}
                                    {answered && selected !== index && index === content.correctChoice && (
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
                        }}>Enviar</Button>
                    </CardFooter>
                </CardContent>
            </CardContent>
        </Card>
    )
}