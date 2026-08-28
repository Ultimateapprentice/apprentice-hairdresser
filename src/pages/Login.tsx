import { useState } from "react";
import { useApp, UserRole } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Scissors,
    GraduationCap,
    Building2,
    User,
    ArrowRight,
} from "lucide-react";

const roles: {
    id: UserRole;
    label: string;
    desc: string;
    icon: React.ElementType;
    placeholder: string;
    orgPlaceholder?: string;
}[] = [
        {
            id: "apprentice",
            label: "Apprentice",
            desc: "Log workplace activities, upload photo evidence, and track your own progress.",
            icon: User,
            placeholder: "e.g. Jane Doe",
        },
        {
            id: "assessor",
            label: "RTO / Assessor",
            desc: "Review evidence, assess competency, and sign off units for compliance.",
            icon: GraduationCap,
            placeholder: "e.g. Sarah Jenkins",
            orgPlaceholder: "e.g. TAFE NSW (RTO)",
        },
        {
            id: "employer",
            label: "Employer / Salon",
            desc: "View your apprentice's progress, assessed units, and assessor comments.",
            icon: Building2,
            placeholder: "e.g. Salon 101",
            orgPlaceholder: "e.g. Salon 101 Pty Ltd",
        },
    ];

export default function Login() {
    const { login } = useApp();
    const [selectedRole, setSelectedRole] = useState<UserRole>("apprentice");
    const [name, setName] = useState("");
    const [org, setOrg] = useState("");

    const activeRole = roles.find((r) => r.id === selectedRole)!;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        login({
            role: selectedRole,
            name: name.trim(),
            org: org.trim() || undefined,
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-2xl space-y-6">
                {/* Brand header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                        <Scissors className="h-7 w-7" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Apprentice Hub</h1>
                    <p className="text-sm text-muted-foreground">
                        Cert III Hairdressing — Competency & Compliance Portal
                    </p>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Sign in to your account</CardTitle>
                        <CardDescription className="text-xs">
                            Select your role and enter your details to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Role selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                const active = selectedRole === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`text-left p-4 rounded-xl border transition-all ${active
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                                                : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                                            }`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`}
                                        />
                                        <p className="font-semibold text-sm">{role.label}</p>
                                        <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                                            {role.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Login form */}
                        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                            <div className="grid gap-1.5">
                                <Label className="text-xs font-semibold">
                                    {activeRole.label} Name
                                </Label>
                                <Input
                                    placeholder={activeRole.placeholder}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-sm"
                                    required
                                />
                            </div>
                            {activeRole.orgPlaceholder && (
                                <div className="grid gap-1.5">
                                    <Label className="text-xs font-semibold">
                                        Organisation{" "}
                                        {activeRole.id === "assessor" ? "(RTO)" : "(Salon)"}
                                    </Label>
                                    <Input
                                        placeholder={activeRole.orgPlaceholder}
                                        value={org}
                                        onChange={(e) => setOrg(e.target.value)}
                                        className="text-sm"
                                    />
                                </div>
                            )}
                            <Button type="submit" className="w-full gap-2 font-semibold">
                                Continue as {activeRole.label}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-[11px] text-muted-foreground">
                    Prototype demo — no password required. Data is stored locally for this
                    session only.
                </p>
            </div>
        </div>
    );
}
