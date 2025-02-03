import { redirect } from "next/navigation";

interface LoginPageProps {
    searchParams: Promise<{ code: string }>;
};

export default async function LoginPage({
    searchParams,
}: LoginPageProps) {
    const { code } = await searchParams;
    if (!code) {
        return redirect('/platform');
    }
    redirect(`/platform?code=${code}`);
}