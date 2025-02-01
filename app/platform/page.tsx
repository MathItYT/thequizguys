import MainComponent from "./main-component";
import type { Metadata } from "next";
import { request } from "undici";

export const metadata: Metadata = {
    title: 'Plataforma'
};

interface PageProps {
    searchParams: Promise<{ code?: string }>;
}

export default async function Page({
    searchParams
}: PageProps) {
    const { code } = await searchParams;
    if (code) {
        try {
            const tokenResponse = await request('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: process.env.DISCORD_CLIENT_ID!,
                    client_secret: process.env.DISCORD_CLIENT_SECRET!,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
                    scope: ['identify', 'guilds'].join(' '),
                }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const tokenData: any = await tokenResponse.body.json();
            const userResult = await request('https://discord.com/api/users/@me/guilds', {
                headers: {
                    authorization: `${tokenData.token_type} ${tokenData.access_token}`,
                },
            });
            const userData: any = await userResult.body.json();
            const discordGuildId = process.env.DISCORD_GUILD_ID!;
            const isDiscordGuildMember = userData.some((guild: any) => guild.id === discordGuildId);
            return <MainComponent isDiscordGuildMember={isDiscordGuildMember} messageToLog={userData} />;
        } catch (error) {
            console.error(error);
            return <MainComponent />;
        }
    }
    return <MainComponent />;
}