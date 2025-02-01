'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LoginButtonProps {
  loginUrl: string;
};

export function LoginButton({ loginUrl }: LoginButtonProps) {
    return (
      <Button className="bg-[#5865f2] text-[#ffffff] hover:bg-[#6e7ff2]">
        <a href={loginUrl} className="flex items-center gap-2">
          <Image src="/discord-mark-white.svg" alt="Discord Logo" width={30} height={30} className=""></Image>
          Iniciar sesión
        </a>
      </Button>
    );
};