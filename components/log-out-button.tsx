'use client'

import { Button } from "@/components/ui/button";

export default function LogOutButton() {
    return (
        <Button className="bg-red-500 hover:bg-red-600 text-white transition-colors" onClick={async () => {
            window.location.href = '/?logout=true';
        }}>
            Cerrar sesión
        </Button>
    )
}