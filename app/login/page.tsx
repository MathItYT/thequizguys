import { redirect } from "next/navigation";

export default async function Page() {
    redirect(process.env.NEXT_PUBLIC_DISCORD_LOGIN_URL!);
}