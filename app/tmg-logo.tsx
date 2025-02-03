import Image from "next/image";

interface TMGLogoProps {
    size: number;
};

export default function TMGLogo({
    size
}: TMGLogoProps) {
    return (
        <div className="flex items-center gap-2 bg-[#161616] rounded-full mr-5">
            <Image
              src="/TheMathGuysLogo.png"
              alt="The Math Guys Logo"
              width={size}
              height={size}
              priority
            />
        </div>
    );
};