interface AdminPanelProps {
    isMathHelper: boolean;
    isComputerScienceHelper: boolean;
    isPhysicsHelper: boolean;
    isChemistryHelper: boolean;
    isBiologyHelper: boolean;
    isMathLikeUserId: boolean;
}

export default function AdminPanel({
    isMathHelper,
    isComputerScienceHelper,
    isPhysicsHelper,
    isChemistryHelper,
    isBiologyHelper,
    isMathLikeUserId
}: AdminPanelProps) {
    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">¡Panel de administración!</h1>
        </div>
    );
}