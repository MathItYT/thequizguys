'use server';

import openai from "./openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";


const ResponseFormat = z.object({
    correct: z.boolean(),
});


export default async function evaluateTextAnswer(question: string, correctAnswer: string, userAnswer: string) {
    const systemPrompt = `
Debes evaluar si el usuario respondió correctamente a la siguiente pregunta:

${question}

La clave de respuesta correcta es:

${correctAnswer}

Debes responder con un booleano que indica si la respuesta del usuario es correcta o no.
`
    const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-2024-11-20',
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userAnswer
            }
        ],
        store: true,
        response_format: zodResponseFormat(ResponseFormat, 'evaluation'),
    });
    const response = completion.choices[0].message.parsed;
    if (!response) {
        return null
    }
    return response.correct;
}