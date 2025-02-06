'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateLesson } from "@/lib/update-lesson";
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { deleteQuiz } from "@/lib/delete-quiz";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Plus } from "lucide-react";
import { Content } from "@/lib/content-definition";
import ReorderableList, { ReorderableItem } from "./reorderable-list";
import Tiptap from "./tiptap";
import MultipleChoicePollEditor from "./multiple-choice-poll-editor";
import SingleChoicePollEditor from "./single-choice-poll-editor";

interface EditorProps {
    contents: Content[];
    title: string;
    description: string;
    subject: string;
    id: number;
    isPublic: boolean;
};

export function Editor({
    contents,
    title,
    description,
    subject,
    id,
    isPublic,
}: EditorProps) {
    const [newContents, setNewContents] = React.useState(contents);
    function autoSizeDescription() {
        descriptionRef.current!.style.height = descriptionRef.current!.scrollHeight + 'px';
    }
    const titleRef = React.useRef<HTMLInputElement>(null);
    const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
    const { toast } = useToast();
    React.useLayoutEffect(autoSizeDescription, [description]);
    const onReorder = React.useCallback((newItems: ReorderableItem<Content>[]) => {
        setNewContents(newItems.map(item => item.data));
    }, []);
    const onDelete = React.useCallback((deleteIndex: number) => {
        setNewContents(newContents => newContents.filter((content) => content.id !== deleteIndex));
    }, []);
    const addText = React.useCallback(() => {
        setNewContents(newContents => [...newContents, { type: 'text', content: '<p>Texto</p>', id: Math.max(...newContents.map(content => content.id), 0) + 1 }]);
    }, []);
    const addMultipleChoicePoll = React.useCallback(() => {
        setNewContents(newContents => [...newContents, { type: 'multiple-choice-poll', question: '<p>Pregunta</p>', choices: [{content: '<p>Opción 1</p>', correct: false, id: 0, explanation: '<p>Explicación</p>'}, {content: '<p>Opción 2</p>', correct: false, id: 1, explanation: '<p>Explicación</p>'}], finishesAt: null, id: Math.max(...newContents.map(content => content.id), 0) + 1 }]);
    }, []);
    const addSingleChoicePoll = React.useCallback(() => {
        setNewContents(newContents => [...newContents, { type: 'single-choice-poll', question: '<p>Pregunta</p>', choices: [{content: '<p>Opción 1</p>', id: 0, explanation: '<p>Explicación</p>'}, {content: '<p>Opción 2</p>', id: 1, explanation: '<p>Explicación</p>'}], correctChoice: 0, finishesAt: null, id: Math.max(...newContents.map(content => content.id), 0) + 1 }]);
    }, []);
    const [items, setItems] = React.useState(newContents.map((content, index) => ({ id: content.id, content: content.type === 'text' ? <Tiptap initialHtml={content.content} onHtmlChange={(html) => {
        setNewContents(newContents => newContents.map((item, itemIndex) => itemIndex === index ? { ...item, content: html } : item));
    }} /> : content.type === 'multiple-choice-poll' ? <MultipleChoicePollEditor content={content} updateContent={(newContent) => {
        setNewContents(newContents => newContents.map((item, itemIndex) => itemIndex === index ? newContent : item));
    }} /> : content.type === 'single-choice-poll' ? <SingleChoicePollEditor content={content} updateContent={(newContent) => {
        setNewContents(newContents => newContents.map((item, itemIndex) => itemIndex === index ? newContent : item));
    }} /> : null, data: content })));
    React.useEffect(() => {
        setItems(newContents.map((content, index) => ({ id: content.id, content: content.type === 'text' ? <Tiptap initialHtml={content.content} onHtmlChange={(html) => {
            setNewContents(newContents => newContents.map((item, itemIndex) => itemIndex === index ? { ...item, content: html } : item));
        }} /> : content.type === 'multiple-choice-poll' ? <MultipleChoicePollEditor content={content} updateContent={(newContent) => {
            setNewContents(newContents => newContents.map((item, itemIndex) => itemIndex === index ? newContent : item));
        }} /> : content.type === 'single-choice-poll' ? <SingleChoicePollEditor content={content} updateContent={(newContent) => {
            setNewContents(newContents => newContents.map((item, itemIndex) => itemIndex === index ? newContent : item));
        }} /> : null, data: content })));
    }, [newContents]);
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex flex-col gap-4 w-4/5 mt-4">
                <Input ref={titleRef} defaultValue={title} placeholder="Ponle un título a tu quiz" className="text-2xl md:text-2xl font-bold w-full" />
                <Textarea ref={descriptionRef} defaultValue={description} placeholder="Describe tu quiz" className="w-full text-lg md:text-lg" />
                <ReorderableList onReorder={onReorder} items={items} onDelete={onDelete} />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <Plus />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={addText}>Texto simple</DropdownMenuItem>
                    <DropdownMenuItem onClick={addMultipleChoicePoll}>Encuesta de opción múltiple</DropdownMenuItem>
                    <DropdownMenuItem onClick={addSingleChoicePoll}>Encuesta de opción única</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Separator className="w-4/5" />
            <div className="flex gap-4">
                <Button className="mt-5" onClick={async () => {
                    if (newContents.length === 0) {
                        toast({
                            title: "Quiz vacío",
                            description: "Tu quiz no puede estar vacío",
                            variant: "destructive",
                        });
                        return;
                    }
                    const title = titleRef.current!.value;
                    const description = descriptionRef.current!.value;
                    await updateLesson(id, subject, title, newContents, isPublic, description);
                    toast({
                        title: "Quiz actualizado",
                        description: "Tu quiz ha sido actualizado exitosamente",
                    });
                }}>
                    Guardar
                </Button>
                {
                    !isPublic &&
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="mt-5" variant="secondary">
                                Guardar y publicar
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no podrá deshacerse. Este quiz será visible para todos los usuarios.
                                ¿Realmente deseas publicar este quiz?
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={async () => {
                                if (newContents.length === 0) {
                                    toast({
                                        title: "Quiz vacío",
                                        description: "Tu quiz no puede estar vacío",
                                        variant: "destructive",
                                    });
                                    return;
                                }
                                const title = titleRef.current!.value;
                                const description = descriptionRef.current!.value;
                                await updateLesson(id, subject, title, newContents, true, description);
                                toast({
                                    title: "Quiz actualizado",
                                    description: "Tu quiz ha sido actualizado exitosamente",
                                });
                                window.location.href = `/platform/view/${id}/0`;
                            }}>Publicar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                }
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="mt-5" variant="destructive">
                            Eliminar
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no podrá deshacerse. Este quiz será eliminado permanentemente.
                            ¿Realmente deseas eliminar este quiz?
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteQuiz(id);
                            toast({
                                title: "Quiz eliminado",
                                description: "Tu quiz ha sido eliminado exitosamente",
                            });
                            window.location.href = '/platform';
                        }}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};