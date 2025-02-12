'use client';

import { SingleChoicePollContent } from "@/lib/content-definition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import React from "react";
import { Button } from "./ui/button";
import RenderKatexAndCodes from "./render-katex-and-codes";

interface SingleChoicePollProps {
    content: SingleChoicePollContent;
}

export default function SingleChoicePoll({ content }: SingleChoicePollProps) {
    const [answered, setAnswered] = React.useState(false);
    const [selected, setSelected] = React.useState<number | null>(null);
    return (
        <Card className="w-4/5 mx-auto">
            <CardContent>
                <CardHeader>
                    <CardTitle>Selección única</CardTitle>
                    <CardDescription className="text-slate-800 dark:text-slate-200">
                        <RenderKatexAndCodes html={content.question} />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        {content.choices.map((choice, index) => (
                            <Card key={choice.id} onClick={() => {
                                if (answered) return;
                                setSelected(index);
                            }} className={!answered ? (selected === index ? "bg-sky-700 border-sky-500" : "") : (index === content.correctChoice ? "bg-emerald-600 border-emerald-500" : "bg-rose-600 border-rose-500")}>
                                <CardContent>
                                    <CardHeader>
                                        <CardTitle>Opción {index + 1}</CardTitle>
                                        <CardDescription className="text-slate-800 dark:text-slate-200">
                                            <RenderKatexAndCodes html={choice.content} />
                                        </CardDescription>
                                    </CardHeader>
                                    {answered && selected === index && index === content.correctChoice && (
                                        <div className="flex justify-center">
                                            <CardDescription className="text-emerald-200"><p className="text-sm">¡Respuesta correcta!</p></CardDescription>
                                        </div>
                                    )}
                                    {answered && selected === index && index !== content.correctChoice && (
                                        <div className="flex justify-center">
                                            <CardDescription className="text-rose-200"><p className="text-sm">Incorrecto.</p><RenderKatexAndCodes html={choice.explanation} /></CardDescription>
                                        </div>
                                    )}
                                    {answered && selected !== index && index === content.correctChoice && (
                                        <div className="flex justify-center">
                                            <CardDescription className="text-emerald-200"><p className="text-sm">Respuesta correcta.</p><RenderKatexAndCodes html={choice.explanation} /></CardDescription>
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
                            disabled={selected === null || answered}
                        >Enviar</Button>
                    </CardFooter>
                </CardContent>
            </CardContent>
        </Card>
    )
}