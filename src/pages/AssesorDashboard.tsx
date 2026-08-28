import { useState } from "react";
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
    GraduationCap,
    ShieldCheck,
    Clock,
    ChevronRight,
    FileText,
    CheckCircle2,
    AlertCircle,
    Send,
} from "lucide-react";
import { UnitDetailView } from "@/components/UnitDetailView";
import { TrainingUnit } from "@/data/trainingData";

export default function AssessorDashboard() {
    const { coreUnits, electiveUnits, evidence, user, assessorSignOff } =
        useApp();
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

    const allUnits = [...coreUnits, ...electiveUnits];
    const selectedUnit = allUnits.find((u) => u.id === selectedUnitId) || null;

    const assessedUnits = allUnits.filter((u) => u.assessed).length;
    const readyUnits = allUnits.filter(
        (u) => u.readyForAssessment && !u.assessed,
    ).length;
    const pendingUnits = allUnits.filter(
        (u) => u.activities.length > 0 && !u.assessed && !u.readyForAssessment,
    ).length;
    const pendingEvidence = evidence.filter(
        (e) => e.status === "Pending Review",
    ).length;

    if (selectedUnit) {
        return (
            <AppShell
                sidebarExtra={
                    <AssessorSidebar onHome={() => setSelectedUnitId(null)} />
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
                                Back to Assessment Queue
                            </Button>
                            <Badge
                                variant="outline"
                                className="text-[10px] gap-1 text-primary border-primary/30"
                            >
                                <ShieldCheck className="h-3 w-3" /> Assessment Mode
                            </Badge>
                        </div>
                        <UnitDetailView
                            unit={selectedUnit}
                            onBack={() => setSelectedUnitId(null)}
                            onUpdateActivity={() => { }}
                            onUploadEvidence={() => { }}
                            onAssessorSignOff={(unitId, signOff) => {
                                assessorSignOff(unitId, {
                                    ...signOff,
                                    assessorName: signOff.assessorName || user?.name || "",
                                });
                            }}
                            canAssess
                        />
                    </div>
                </ScrollArea>
            </AppShell>
        );
    }

    return (
        <AppShell
            sidebarExtra={<AssessorSidebar onHome={() => setSelectedUnitId(null)} />}
        >
            <ScrollArea className="flex-1 p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge
                                variant="outline"
                                className="text-[10px] uppercase tracking-wider text-primary border-primary/30 gap-1"
                            >
                                <GraduationCap className="h-3 w-3" />
                                RTO Assessor View
                            </Badge>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                            Assessment & Sign-Off Queue
                        </h1>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            Review apprentice evidence, assess competency, and sign off units
                            for compliance. Sign-offs are visible to the employer.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-emerald-500/20">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{assessedUnits}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Units Signed Off
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-blue-500/20 ring-1 ring-blue-500/10">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                                    <Send className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{readyUnits}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Ready for Assessment
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-amber-500/20">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{pendingUnits}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Not Yet Submitted
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-primary/20">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{pendingEvidence}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Evidence Pending Review
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="ready" className="space-y-6">
                        <TabsList className="bg-muted/50 p-1">
                            <TabsTrigger value="ready" className="text-xs">
                                Ready for Assessment ({readyUnits})
                            </TabsTrigger>
                            <TabsTrigger value="pending" className="text-xs">
                                Not Submitted ({pendingUnits})
                            </TabsTrigger>
                            <TabsTrigger value="assessed" className="text-xs">
                                Signed Off ({assessedUnits})
                            </TabsTrigger>
                            <TabsTrigger value="evidence" className="text-xs">
                                Evidence Review ({evidence.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="ready" className="space-y-4">
                            {readyUnits === 0 ? (
                                <EmptyState
                                    icon={Send}
                                    title="No units ready for assessment"
                                    desc="Units declared ready by the workplace supervisor will appear here for your sign-off."
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allUnits
                                        .filter((u) => u.readyForAssessment && !u.assessed)
                                        .map((unit) => (
                                            <AssessorUnitCard
                                                key={unit.id}
                                                unit={unit}
                                                onView={() => setSelectedUnitId(unit.id)}
                                                ready
                                            />
                                        ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4">
                            {pendingUnits === 0 ? (
                                <EmptyState
                                    icon={CheckCircle2}
                                    title="Nothing pending"
                                    desc="All units with activities have been submitted or assessed."
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allUnits
                                        .filter(
                                            (u) =>
                                                u.activities.length > 0 &&
                                                !u.assessed &&
                                                !u.readyForAssessment,
                                        )
                                        .map((unit) => (
                                            <AssessorUnitCard
                                                key={unit.id}
                                                unit={unit}
                                                onView={() => setSelectedUnitId(unit.id)}
                                            />
                                        ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="assessed" className="space-y-4">
                            {assessedUnits === 0 ? (
                                <EmptyState
                                    icon={ShieldCheck}
                                    title="No units signed off yet"
                                    desc="Signed off units will appear here."
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allUnits
                                        .filter((u) => u.assessed)
                                        .map((unit) => (
                                            <AssessorUnitCard
                                                key={unit.id}
                                                unit={unit}
                                                onView={() => setSelectedUnitId(unit.id)}
                                                assessed
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
                                        Evidence for Review
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Photo evidence submitted by the apprentice awaiting your
                                        assessment.
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
                                                    className="w-24 h-24 object-cover rounded-lg border border-border flex-shrink-0"
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
        </AppShell>
    );
}

const AssessorSidebar: React.FC<{ onHome: () => void }> = ({ onHome }) => (
    <Button
        variant="secondary"
        className="w-full justify-start gap-3 font-medium text-xs h-10"
        onClick={onHome}
    >
        <GraduationCap className="h-4 w-4 text-primary" />
        Assessment Queue
    </Button>
);

const AssessorUnitCard: React.FC<{
    unit: TrainingUnit;
    onView: () => void;
    assessed?: boolean;
    ready?: boolean;
}> = ({ unit, onView, assessed, ready }) => {
    const completed = unit.activities.filter((a) => a.completed).length;
    const total = unit.activities.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const allDone = completed === total && total > 0;

    return (
        <Card
            className={`group cursor-pointer transition-all hover:shadow-md ${assessed ? "border-emerald-500/30" : ready ? "border-blue-500/40 ring-1 ring-blue-500/20" : allDone ? "border-primary/40 ring-1 ring-primary/20" : "hover:border-primary/50"}`}
            onClick={onView}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {unit.code}
                    </span>
                    {assessed ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
                            <ShieldCheck className="h-3 w-3" /> Signed Off
                        </Badge>
                    ) : ready ? (
                        <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] gap-1">
                            <Send className="h-3 w-3" /> Ready to Assess
                        </Badge>
                    ) : allDone ? (
                        <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] gap-1">
                            <AlertCircle className="h-3 w-3" /> All Activities Done
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
                {ready && unit.supervisorName && (
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-1">
                        <Send className="h-3 w-3" /> Declared ready by {unit.supervisorName}
                    </p>
                )}
                <span className="flex items-center gap-1 text-primary font-medium text-[11px] pt-1 border-t border-border/50">
                    {assessed ? "Review / Edit Sign-Off" : "Open & Assess"}{" "}
                    <ChevronRight className="h-3 w-3" />
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
