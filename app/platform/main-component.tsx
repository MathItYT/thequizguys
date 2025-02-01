'use client';

import React from "react";
import PleaseLogIn from "./please-log-in";
import Welcome from "./welcome";
import NotInGuild from "./not-in-guild";

interface MainComponentProps {
  isDiscordGuildMember?: boolean;
  messageToLog?: any;
}

export default function MainComponent({ isDiscordGuildMember }: MainComponentProps) {
  return ( 
    isDiscordGuildMember === undefined ? (
      <PleaseLogIn />
    ) : (
      isDiscordGuildMember ? (
        <Welcome />
      ) : (
        <NotInGuild />
      )
    )
  );
}