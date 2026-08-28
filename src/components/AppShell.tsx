import React from "react";
import { useApp, UserRole } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Scissors,
    LogOut,
    ShieldCheck,
    GraduationCap,
    Building2,
    User,
} from "lucide-react";

const roleConfig: Record<
    UserRole,
    { label: string; icon: React.ElementType; color: string }
> = {
    apprentice: { label: "Apprentice", icon: User, color: "text-primary" },
    assessor: {
        label: "RTO / Assessor",
        icon: GraduationCap,
        color: "text-primary",
    },
    employer: {
        label: "Employer / Salon",
        icon: Building2,
        color: "text-primary",
    },
};

interface AppShellProps {
    children: React.ReactNode;
    onNavigateUnit?: (unitId: string) => void;
    onBackToDashboard?: () => void;
    sidebarExtra?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
    children,
    sidebarExtra,
}) => {
    const { user, logout } = useApp();
    if (!user) return null;

    const cfg = roleConfig[user.role];
    const RoleIcon = cfg.icon;
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="hidden md:flex w-72 flex-col border-r border-border bg-card">
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                            <Scissors className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none tracking-tight">
                                Apprentice Hub
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                                Cert III Hairdressing
                            </p>
                        </div>
                    </div>
                </div>

                {/* User card */}
                <div className="p-4 mx-3 my-3 bg-muted/40 rounded-xl border border-border/60">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/30">
                            <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate text-foreground">
                                {user.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                                <RoleIcon className="h-3 w-3" />
                                {cfg.label}
                            </p>
                        </div>
                    </div>
                    {user.org && (
                        <p className="text-[10px] text-muted-foreground mt-2 pl-1">
                            {user.org}
                        </p>
                    )}
                </div>

                {/* Extra sidebar content */}
                <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {sidebarExtra}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="w-full gap-2 text-xs text-muted-foreground"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile header */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                    <div className="flex items-center gap-2">
                        <Scissors className="h-5 w-5 text-primary" />
                        <span className="font-bold text-sm">Apprentice Hub</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-primary" />
                            {cfg.label}
                        </span>
                        <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px]">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};
