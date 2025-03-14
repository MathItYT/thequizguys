import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { createClient } from "@/lib/supabase/server";
import { Pin } from "lucide-react";
import Link from "next/link";

interface QuizListProps {
    roles: {
        isDiscordGuildMember: boolean;
        isMathHelper?: boolean;
        isPhysicsHelper?: boolean;
        isChemistryHelper?: boolean;
        isBiologyHelper?: boolean;
        isComputerScienceHelper?: boolean;
        isMathLikeUserId?: boolean;
    }
}

export default async function QuizList({
    roles
}: QuizListProps) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("Lessons").select("*");
    if (error) {
        console.error(error);
        return;
    }
    const lessonFilter = (lesson: { public: boolean; subject: string; }) => {
        if (lesson.public) {
            return true;
        }
        if (lesson.subject === 'Matemáticas' && (roles.isMathHelper || roles.isMathLikeUserId)) {
            return true;
        }
        if (lesson.subject === 'Física' && (roles.isPhysicsHelper || roles.isMathLikeUserId)) {
            return true;
        }
        if (lesson.subject === 'Química' && (roles.isChemistryHelper || roles.isMathLikeUserId)) {
            return true;
        }
        if (lesson.subject === 'Biología' && (roles.isBiologyHelper || roles.isMathLikeUserId)) {
            return true;
        }
        if (lesson.subject === 'Ciencias de la computación' && (roles.isComputerScienceHelper || roles.isMathLikeUserId)) {
            return true;
        }
        return false;
    };
    const publicLessons = data!.filter(lessonFilter);
    publicLessons.sort((a, b) => {
        if (a.is_fixed && !b.is_fixed) return -1;
        if (!a.is_fixed && b.is_fixed) return 1;
        return a.id - b.id;
    });
    return (
        <div className="mt-8 flex items-center flex-col gap-4 w-full">
            <Carousel className="w-4/6">
                <CarouselContent>
                    {publicLessons.map((lesson) => (
                        <CarouselItem key={lesson.id}>
                            <Card>
                                <CardHeader>
                                    {lesson.is_fixed && <div className="flex items-center gap-2">
                                        <Pin size={24} />
                                    </div>}
                                    <CardTitle>{lesson.title}</CardTitle>
                                    <CardDescription>{lesson.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-start gap-4">
                                        <p className="text-sm"><b>Materia:</b> {lesson.subject}</p>
                                    </div>
                                    <div className="flex justify-end gap-4">
                                    {(
                                        ((roles.isMathHelper || roles.isMathLikeUserId) && lesson.subject === 'Matemáticas')
                                        || ((roles.isPhysicsHelper || roles.isMathLikeUserId) && lesson.subject === 'Física')
                                        || ((roles.isChemistryHelper || roles.isMathLikeUserId) && lesson.subject === 'Química')
                                        || ((roles.isBiologyHelper || roles.isMathLikeUserId) && lesson.subject === 'Biología')
                                        || ((roles.isComputerScienceHelper || roles.isMathLikeUserId) && lesson.subject === 'Ciencias de la computación')
                                    ) && <Button>
                                        <Link href={`/platform/quiz-editor/${lesson.id}`}>
                                            Editar
                                        </Link>
                                        </Button>}
                                        <Button>
                                            <Link href={`/platform/view/${lesson.id}/0`}>
                                                Ver
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}