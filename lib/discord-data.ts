interface HasId {
    id: string;
}


export interface DiscordData {
    user: {
        id: string;
        username: string;
        discriminator: string;
        avatar: string;
        locale: string;
        verified: boolean;
        email: string;
        flags: number;
        premium_type: number;
        public_flags: number;
    };
    roles: {
        isDiscordGuildMember: boolean;
        isMathHelper?: boolean;
        isPhysicsHelper?: boolean;
        isChemistryHelper?: boolean;
        isBiologyHelper?: boolean;
        isComputerScienceHelper?: boolean;
        isMathLikeUserId?: boolean;
    };
}


export async function getDiscordData(code: string): Promise<DiscordData> {
    const response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
            client_secret: process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET!,
            code,
            grant_type: "authorization_code",
            redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
            scope: ["identify", "guilds"].join(" "),
        }).toString(),
    });
    const data = await response.json();
    console.log(data);
    const token = data.access_token;
    const tokenType = data.token_type;
    console.log(token, tokenType);
    const userResponse = await fetch("https://discord.com/api/users/@me", {
        headers: {
            authorization: `${tokenType} ${token}`,
        },
    });
    const userData = await userResponse.json();
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
            authorization: `${tokenType} ${token}`,
        },
    });
    const guildsData = await guildsResponse.json();
    const discordGuildId = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID!;
    console.log(guildsData);
    const isDiscordGuildMember = guildsData.some((guild: HasId) => guild.id === discordGuildId);
    if (isDiscordGuildMember) {
        const rolesResponse = await fetch(`https://discord.com/api/users/@me/guilds/${discordGuildId}/member`, {
            headers: {
                authorization: `${tokenType} ${token}`,
            },
        });
        const rolesData = await rolesResponse.json();
        const isMathHelper = rolesData.roles.includes(process.env.NEXT_PUBLIC_DISCORD_MATH_HELPER_ROLE_ID!);
        const isPhysicsHelper = rolesData.roles.includes(process.env.NEXT_PUBLIC_DISCORD_PHYSICS_HELPER_ROLE_ID!);
        const isChemistryHelper = rolesData.roles.includes(process.env.NEXT_PUBLIC_DISCORD_CHEMISTRY_HELPER_ROLE_ID!);
        const isBiologyHelper = rolesData.roles.includes(process.env.NEXT_PUBLIC_DISCORD_BIOLOGY_HELPER_ROLE_ID!);
        const isComputerScienceHelper = rolesData.roles.includes(process.env.NEXT_PUBLIC_DISCORD_COMPUTER_SCIENCE_HELPER_ROLE_ID!);
        const userId = userData.id;
        const isMathLikeUserId = userId === process.env.NEXT_PUBLIC_DISCORD_MATHLIKE_USER_ID;
        return {
            user: userData,
            roles: {
                isDiscordGuildMember,
                isMathHelper,
                isPhysicsHelper,
                isChemistryHelper,
                isBiologyHelper,
                isComputerScienceHelper,
                isMathLikeUserId,
            },
        };
    }
    return {
        user: userData,
        roles: {
            isDiscordGuildMember,
        },
    };
}