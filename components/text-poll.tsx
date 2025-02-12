'use client'

import { TextPollContent } from "@/lib/content-definition";
import Tiptap from "./tiptap";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import React from "react";
import { Button } from "./ui/button";
import evaluateTextAnswer from "@/lib/evaluate-text-answer";
import RenderKatexAndCodes from "./render-katex-and-codes";

interface TextPollProps {
    content: TextPollContent;
}

export default function TextPoll({ content }: TextPollProps) {
    const [answer, setAnswer] = React.useState("");
    const [answered, setAnswered] = React.useState<boolean>(false);
    const [correct, setCorrect] = React.useState<boolean | null>(null);
    const [error, setError] = React.useState<boolean>(false);
    return (
        <div className="flex flex-col gap-4 w-4/5 mx-auto">
            <Card>
                <CardContent>
                    <CardHeader>
                        <CardTitle>Pregunta de texto</CardTitle>
                        <CardDescription className="text-slate-800 dark:text-slate-200">
                            <RenderKatexAndCodes html={content.question} />
                        </CardDescription>
                    </CardHeader>
                </CardContent>
                <div className="flex flex-col px-16">
                    <Tiptap initialHtml={""} onHtmlChange={(html) => {
                        setAnswer(html);
                    }} noImages={true} noLinks={true} noYoutube={true} />
                    {answered && correct === null && (
                        <p className="text-slate-800 dark:text-slate-200">Evaluando...</p>
                    )}
                    {answered && error && (
                        <p className="text-rose-600">Hubo un error al evaluar tu respuesta.</p>
                    )}
                    {answered && correct !== null && (
                        <div className="flex flex-col gap-4">
                            <p className={correct ? "text-emerald-600" : "text-rose-600"}>{correct ? "¡Respuesta correcta!" : "Respuesta incorrecta."}</p>{!correct && <RenderKatexAndCodes className="text-slate-800 dark:text-slate-200" html={content.correctAnswer} />}
                        </div>
                    )}
                </div>
                <CardFooter>
                    <Button onClick={async () => {
                        setAnswered(true);
                        const isCorrect = await evaluateTextAnswer(content.question, content.correctAnswer, answer);
                        if (isCorrect === null) {
                            setError(true);
                            return;
                        }
                        setCorrect(isCorrect);
                    }} disabled={answered || !answer}>Enviar</Button>
                </CardFooter>
            </Card>
        </div>
    );
}