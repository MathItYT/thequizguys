export interface TextContent {
    type: 'text';
    content: string;
    id: number;
}

export interface MultipleChoicePollContent {
    type: 'multiple-choice-poll';
    question: string;
    choices: { content: string, correct: boolean, explanation: string, id: number }[];
    finishesAt: number | null;
    id: number;
}

export interface SingleChoicePollContent {
    type: 'single-choice-poll';
    question: string;
    choices: { content: string, id: number, explanation: string }[];
    correctChoice: number;
    finishesAt: number | null;
    id: number;
}

export interface TextPollContent {
    type: 'text-poll';
    question: string;
    correctAnswer: string;
    finishesAt: number | null;
    id: number;
}

export type Content = TextContent | MultipleChoicePollContent | SingleChoicePollContent | TextPollContent;