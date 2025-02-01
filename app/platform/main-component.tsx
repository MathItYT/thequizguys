'use client';

import React from "react";
import PleaseLogIn from "./please-log-in";
import Welcome from "./welcome";
import NotInGuild from "./not-in-guild";
import AdminPanel from "./admin-panel";

interface MainComponentProps {
  isDiscordGuildMember?: boolean;
  isMathHelper?: boolean;
  isComputerScienceHelper?: boolean;
  isPhysicsHelper?: boolean;
  isChemistryHelper?: boolean;
  isBiologyHelper?: boolean;
  isMathLikeUserId?: boolean;
}

export default function MainComponent({
  isDiscordGuildMember,
  isMathHelper,
  isComputerScienceHelper,
  isPhysicsHelper,
  isChemistryHelper,
  isBiologyHelper,
  isMathLikeUserId
}: MainComponentProps) {
  return ( 
    isDiscordGuildMember === undefined ? (
      <PleaseLogIn />
    ) : (
      isDiscordGuildMember ? (
        (isMathHelper || isComputerScienceHelper || isPhysicsHelper || isChemistryHelper || isBiologyHelper || isMathLikeUserId) ? (
          <AdminPanel isMathHelper={isMathHelper!} isComputerScienceHelper={isComputerScienceHelper!} isPhysicsHelper={isPhysicsHelper!} isChemistryHelper={isChemistryHelper!} isBiologyHelper={isBiologyHelper!} isMathLikeUserId={isMathLikeUserId!} />
        ) : (
          <Welcome />
        )
      ) : (
        <NotInGuild />
      )
    )
  );
}