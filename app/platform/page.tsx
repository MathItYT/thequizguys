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
            if (isDiscordGuildMember) {
                const roles = await request(`https://discord.com/api/users/@me/guilds/${discordGuildId}/member`, {
                    headers: {
                        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
                    },
                });
                const rolesData: any = await roles.body.json();
                const isMathHelper = rolesData.roles.includes(process.env.DISCORD_MATH_HELPER_ROLE_ID!);
                const isPhysicsHelper = rolesData.roles.includes(process.env.DISCORD_PHYSICS_HELPER_ROLE_ID!);
                const isChemistryHelper = rolesData.roles.includes(process.env.DISCORD_CHEMISTRY_HELPER_ROLE_ID!);
                const isBiologyHelper = rolesData.roles.includes(process.env.DISCORD_BIOLOGY_HELPER_ROLE_ID!);
                const isComputerScienceHelper = rolesData.roles.includes(process.env.DISCORD_COMPUTER_SCIENCE_HELPER_ROLE_ID!);
                const userResponse = await request('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
                    },
                });
                const userData: any = await userResponse.body.json();
                const userId = userData.id;
                const isMathLikeUserId = userId === process.env.DISCORD_MATHLIKE_USER_ID;
                return <MainComponent isDiscordGuildMember={isDiscordGuildMember} isMathHelper={isMathHelper} isPhysicsHelper={isPhysicsHelper} isChemistryHelper={isChemistryHelper} isBiologyHelper={isBiologyHelper} isComputerScienceHelper={isComputerScienceHelper} isMathLikeUserId={isMathLikeUserId} />;
            }
            return <MainComponent isDiscordGuildMember={isDiscordGuildMember} />;
        } catch (error) {
            console.error(error);
            return <MainComponent />;
        }
    }
    return <MainComponent />;
}