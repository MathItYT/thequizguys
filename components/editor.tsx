'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateLesson } from "@/lib/update-lesson";
import React from "react";
import Tiptap from "./tiptap";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { deleteQuiz } from "@/lib/delete-quiz";

interface EditorProps {
    htmlContent: string;
    title: string;
    description: string;
    subject: string;
    id: number;
    isPublic: boolean;
};

export function Editor({
    htmlContent,
    title,
    description,
    subject,
    id,
    isPublic
}: EditorProps) {
    const titleRef = React.useRef<HTMLInputElement>(null);
    const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
    const [htmlContentState, setHtmlContentState] = React.useState<string>(htmlContent);
    const { toast } = useToast();
    return (
        <>
            <div className="flex flex-col gap-4 w-4/5 mb-5">
                <Input ref={titleRef} defaultValue={title} placeholder="Ponle un título a tu quiz" className="text-5xl font-bold" />
                <Textarea ref={descriptionRef} defaultValue={description} placeholder="Describe tu quiz" className="text-lg" />
            </div>
            <div className="w-4/5 mb-5">
                <Tiptap initialHtml={htmlContent} onHtmlChange={setHtmlContentState} />
            </div>
            <Separator className="w-4/5" />
            <div className="flex gap-4">
                <Button className="mt-5" onClick={async () => {
                    const title = titleRef.current!.value;
                    const description = descriptionRef.current!.value;
                    await updateLesson(id, subject, title, htmlContentState, isPublic, description);
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
                                const title = titleRef.current!.value;
                                const description = descriptionRef.current!.value;
                                await updateLesson(id, subject, title, htmlContentState, true, description);
                                toast({
                                    title: "Quiz actualizado",
                                    description: "Tu quiz ha sido actualizado exitosamente",
                                });
                                window.location.href = `/platform/view/${id}`;
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
        </>
    );
};