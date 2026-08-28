import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Award,
    ShieldCheck,
    CheckCircle2,
    Clock,
    ChevronRight,
    Eye,
    Lock,
    FileText,
    Send,
} from "lucide-react";
import { UnitDetailView } from "@/components/UnitDetailView";
import { TrainingUnit } from "@/data/trainingData";

export default function EmployerDashboard() {
    const {
        coreUnits,
        electiveUnits,
        evidence,
        updateActivity,
        addEvidence,
        markReadyForAssessment,
    } = useApp();
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
    const [viewImage, setViewImage] = useState<string | null>(null);

    const allUnits = [...coreUnits, ...electiveUnits];
    const selectedUnit = allUnits.find((u) => u.id === selectedUnitId) || null;

    const allActivities = allUnits.flatMap((u) => u.activities);
    const completedActivities = allActivities.filter((a) => a.completed).length;
    const totalActivities = allActivities.length;
    const overallPercent = Math.round(
        (completedActivities / (totalActivities || 1)) * 100,
    );

    const assessedUnits = allUnits.filter((u) => u.assessed).length;
    const readyForRtoUnits = allUnits.filter(
        (u) => u.readyForAssessment && !u.assessed,
    ).length;
    const pendingUnits = allUnits.filter(
        (u) => u.activities.length > 0 && !u.assessed && !u.readyForAssessment,
    ).length;

    if (selectedUnit) {
        return (
            <AppShell
                sidebarExtra={
                    <EmployerSidebar onHome={() => setSelectedUnitId(null)} />
                }
            >
                <ScrollArea className="flex-1 p-4 md:p-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-4 flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUnitId(null)}
                                className="gap-1 text-xs"
                            >
                                <ChevronRight className="h-4 w-4 rotate-180" />
                                Back to Overview
                            </Button>
                            <Badge
                                variant="outline"
                                className="text-[10px] gap-1 text-primary border-primary/30"
                            >
                                <ShieldCheck className="h-3 w-3" /> Workplace Supervisor
                            </Badge>
                        </div>
                        <UnitDetailView
                            unit={selectedUnit}
                            onBack={() => setSelectedUnitId(null)}
                            onUpdateActivity={updateActivity}
                            onUploadEvidence={addEvidence}
                            onAssessorSignOff={() => { }}
                            onMarkReadyForAssessment={markReadyForAssessment}
                            canMarkActivities
                            canDeclareReady
                        />
                    </div>
                </ScrollArea>
            </AppShell>
        );
    }

    return (
        <AppShell
            sidebarExtra={<EmployerSidebar onHome={() => setSelectedUnitId(null)} />}
        >
            <ScrollArea className="flex-1 p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge
                                variant="outline"
                                className="text-[10px] uppercase tracking-wider text-primary border-primary/30 gap-1"
                            >
                                <Eye className="h-3 w-3" />
                                Employer / Workplace Supervisor View
                            </Badge>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                            Apprentice Progress Overview
                        </h1>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            Mark off workplace activities as the apprentice completes them in
                            the salon, and track RTO assessor sign-offs for compliance.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="md:col-span-2 border-primary/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    Overall Certificate III Progress
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Compliance summary across all training units.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-foreground font-semibold">
                                            {overallPercent}% Completed
                                        </span>
                                        <span className="text-muted-foreground">
                                            {completedActivities} / {totalActivities} activities
                                        </span>
                                    </div>
                                    <Progress value={overallPercent} className="h-3" />
                                </div>
                                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                                    <div className="p-2 bg-muted/40 rounded border border-border">
                                        <p className="text-muted-foreground text-[10px] uppercase">
                                            Assessed
                                        </p>
                                        <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                                            {assessedUnits} Signed Off
                                        </p>
                                    </div>
                                    <div className="p-2 bg-blue-500/5 rounded border border-blue-500/20">
                                        <p className="text-muted-foreground text-[10px] uppercase">
                                            Ready for RTO
                                        </p>
                                        <p className="font-bold text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                                            {readyForRtoUnits} Submitted
                                        </p>
                                    </div>
                                    <div className="p-2 bg-muted/40 rounded border border-border">
                                        <p className="text-muted-foreground text-[10px] uppercase">
                                            In Progress
                                        </p>
                                        <p className="font-bold text-sm text-amber-600 dark:text-amber-400 mt-0.5">
                                            {pendingUnits} Units
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-card to-muted/50">
                            <CardHeader className="pb-2">
                                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg w-fit mb-1">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm font-bold">
                                    Compliance Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Units assessed by RTO
                                    </span>
                                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                                        {assessedUnits}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Awaiting assessment
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-amber-600 dark:text-amber-400 border-amber-500/40 text-[10px]"
                                    >
                                        {pendingUnits}
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-muted-foreground pt-1 leading-relaxed">
                                    Assessor comments and sign-offs are visible below each unit.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="ready" className="space-y-6">
                        <TabsList className="bg-muted/50 p-1">
                            <TabsTrigger value="ready" className="text-xs">
                                Ready for RTO ({readyForRtoUnits})
                            </TabsTrigger>
                            <TabsTrigger value="assessed" className="text-xs">
                                Assessed Units ({assessedUnits})
                            </TabsTrigger>
                            <TabsTrigger value="progress" className="text-xs">
                                In Progress ({pendingUnits})
                            </TabsTrigger>
                            <TabsTrigger value="evidence" className="text-xs">
                                Evidence Log ({evidence.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="ready" className="space-y-4">
                            {readyForRtoUnits === 0 ? (
                                <EmptyState
                                    icon={Send}
                                    title="No units submitted to RTO yet"
                                    desc="Open a unit, complete the activities, then declare it ready for RTO assessment."
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allUnits
                                        .filter((u) => u.readyForAssessment && !u.assessed)
                                        .map((unit) => (
                                            <UnitCard
                                                key={unit.id}
                                                unit={unit}
                                                onView={() => setSelectedUnitId(unit.id)}
                                                ready
                                            />
                                        ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="assessed" className="space-y-4">
                            {assessedUnits === 0 ? (
                                <EmptyState
                                    icon={ShieldCheck}
                                    title="No units assessed yet"
                                    desc="Assessed units with RTO sign-off will appear here."
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allUnits
                                        .filter((u) => u.assessed)
                                        .map((unit) => (
                                            <UnitCard
                                                key={unit.id}
                                                unit={unit}
                                                onView={() => setSelectedUnitId(unit.id)}
                                                assessed
                                            />
                                        ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="progress" className="space-y-4">
                            {pendingUnits === 0 ? (
                                <EmptyState
                                    icon={CheckCircle2}
                                    title="All units assessed"
                                    desc="There are no units currently awaiting assessment."
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allUnits
                                        .filter((u) => u.activities.length > 0 && !u.assessed)
                                        .map((unit) => (
                                            <UnitCard
                                                key={unit.id}
                                                unit={unit}
                                                onView={() => setSelectedUnitId(unit.id)}
                                            />
                                        ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="evidence" className="space-y-4">
                            <Card>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Evidence Portfolio Log
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Photo evidence submitted by the apprentice for compliance
                                        records.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {evidence.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-3 border border-border rounded-xl bg-muted/20 flex gap-3"
                                            >
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.activityTitle}
                                                    className="w-24 h-24 object-cover rounded-lg border border-border flex-shrink-0 cursor-pointer hover:opacity-90"
                                                    onClick={() => setViewImage(item.imageUrl)}
                                                />
                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <span className="font-mono text-[10px] text-primary font-bold">
                                                            {item.unitCode}
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                item.status === "Approved"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className={`text-[9px] ${item.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : ""}`}
                                                        >
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                    <h4 className="font-semibold text-xs text-foreground truncate">
                                                        {item.activityTitle}
                                                    </h4>
                                                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                    {item.trainerFeedback && (
                                                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
                                                            ✓ {item.trainerFeedback}
                                                        </p>
                                                    )}
                                                    <span className="text-[9px] text-muted-foreground block pt-1">
                                                        {item.date}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>

            {viewImage && (
                <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
                    <DialogContent className="max-w-3xl p-2">
                        <DialogHeader>
                            <DialogTitle className="text-sm">Evidence Photo</DialogTitle>
                        </DialogHeader>
                        <img
                            src={viewImage}
                            alt="Evidence"
                            className="max-w-full h-auto rounded-lg"
                        />
                    </DialogContent>
                </Dialog>
            )}
        </AppShell>
    );
}

const EmployerSidebar: React.FC<{ onHome: () => void }> = ({ onHome }) => (
    <Button
        variant="secondary"
        className="w-full justify-start gap-3 font-medium text-xs h-10"
        onClick={onHome}
    >
        <Award className="h-4 w-4 text-primary" />
        Progress Overview
    </Button>
);
const UnitCard: React.FC<{
    unit: TrainingUnit;
    onView: () => void;
    assessed?: boolean;
    ready?: boolean;
}> = ({ unit, onView, assessed, ready }) => {
    const completed = unit.activities.filter((a) => a.completed).length;
    const total = unit.activities.length || unit.requiredCount;
    const percent =
        unit.activities.length > 0
            ? Math.round((completed / unit.activities.length) * 100)
            : Math.round((unit.completedCount / unit.requiredCount) * 100);

    return (
        <Card
            className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={onView}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {unit.code}
                    </span>
                    {assessed ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
                            <ShieldCheck className="h-3 w-3" /> Assessed
                        </Badge>
                    ) : ready ? (
                        <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] gap-1">
                            <Send className="h-3 w-3" /> Ready for RTO
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="text-amber-600 dark:text-amber-400 border-amber-500/40 text-[10px] gap-1"
                        >
                            <Clock className="h-3 w-3" /> In Progress
                        </Badge>
                    )}
                </div>
                <CardTitle className="text-sm font-semibold leading-snug line-clamp-2 pt-1 group-hover:text-primary transition-colors">
                    {unit.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2">
                <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">
                        {completed} / {total} activities
                    </span>
                    <span className="font-semibold text-foreground">{percent}%</span>
                </div>
                <Progress value={percent} className="h-1.5" />
                {assessed && unit.assessorName && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
                        <ShieldCheck className="h-3 w-3" /> Signed off by{" "}
                        {unit.assessorName}
                    </p>
                )}
                <span className="flex items-center gap-1 text-primary font-medium text-[11px] pt-1 border-t border-border/50">
                    View Details <ChevronRight className="h-3 w-3" />
                </span>
            </CardContent>
        </Card>
    );
};

const EmptyState: React.FC<{
    icon: React.ElementType;
    title: string;
    desc: string;
}> = ({ icon: Icon, title, desc }) => (
    <Card className="border-dashed">
        <CardContent className="p-10 text-center">
            <Icon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        </CardContent>
    </Card>
);
