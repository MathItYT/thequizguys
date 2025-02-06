'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { newContent } from "@/lib/new-content";

interface PageProps {
    isMathHelper: boolean;
    isPhysicsHelper: boolean;
    isChemistryHelper: boolean;
    isBiologyHelper: boolean;
    isComputerScienceHelper: boolean;
    isMathLikeUserId: boolean;
}

export default function CreateDropdown({
    isMathHelper,
    isPhysicsHelper,
    isChemistryHelper,
    isBiologyHelper,
    isComputerScienceHelper,
    isMathLikeUserId,
}: PageProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white transition-colors">Crear</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {(isMathHelper || isMathLikeUserId) && <DropdownMenuItem onClick={
                    async () => {
                        await newContent('Matemáticas');
                    }
                }>Quiz de matemáticas</DropdownMenuItem>}
                {(isPhysicsHelper || isMathLikeUserId) && <DropdownMenuItem onClick={
                    async () => {
                        await newContent('Física');
                    }
                }>Quiz de física</DropdownMenuItem>}
                {(isChemistryHelper || isMathLikeUserId) && <DropdownMenuItem onClick={
                    async () => {
                        await newContent('Química');
                    }
                }>Quiz de química</DropdownMenuItem>}
                {(isBiologyHelper || isMathLikeUserId) && <DropdownMenuItem onClick={
                    async () => {
                        await newContent('Biología');
                    }
                }>Quiz de biología</DropdownMenuItem>}
                {(isComputerScienceHelper || isMathLikeUserId) && <DropdownMenuItem onClick={
                    async () => {
                        await newContent('Ciencias de la computación');
                    }
                }>Quiz de ciencias de la computación</DropdownMenuItem>}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}