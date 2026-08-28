import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { UnitDetailView } from "@/components/UnitDetailView";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AppShell } from "@/components/AppShell";
import {
    Scissors,
    LayoutDashboard,
    CheckCircle2,
    Upload,
    Camera,
    ChevronRight,
    BookOpen,
    Award,
    ShieldCheck,
    Sparkles,
    FileText,
    Send,
} from "lucide-react";
import { toast } from "sonner";
import { BOOK_PAGES_IMAGES } from "@/data/trainingData";

export default function Index() {
    const {
        user,
        coreUnits,
        electiveUnits,
        evidence,
        updateActivity,
        assessorSignOff,
        addEvidence,
    } = useApp();
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [uploadUnitCode, setUploadUnitCode] = useState("SHBHIND001");
    const [uploadActivityTitle, setUploadActivityTitle] = useState("");
    const [uploadNotes, setUploadNotes] = useState("");
    const [selectedBookImage, setSelectedBookImage] = useState<string | null>(
        null,
    );

    const allCoreUnits = coreUnits;
    const allElectiveUnits = electiveUnits;
    const evidenceList = evidence;
    const selectedUnit =
        [...allCoreUnits, ...allElectiveUnits].find(
            (u) => u.id === selectedUnitId,
        ) || null;

    const allActivities = [...allCoreUnits, ...allElectiveUnits].flatMap(
        (u) => u.activities,
    );
    const completedActivities = allActivities.filter((a) => a.completed).length;
    const totalActivitiesCount = allActivities.length;
    const overallProgressPercent = Math.round(
        (completedActivities / (totalActivitiesCount || 1)) * 100,
    );

    const handleQuickUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const unitObj = [...allCoreUnits, ...allElectiveUnits].find(
            (u) => u.code === uploadUnitCode,
        );
        addEvidence(
            uploadUnitCode,
            unitObj?.title || "Cert III Unit",
            uploadActivityTitle || "General Compliance Log",
            uploadNotes ||
            "Submitted workplace activity photos for trainer sign-off.",
            "https://vibe.filesafe.space/1785228059844322391/assets/8152e987-c2d6-4de4-a748-dadcf794d628.png",
        );
        toast.success("New evidence record uploaded successfully!");
        setUploadOpen(false);
        setUploadActivityTitle("");
        setUploadNotes("");
    };

    const sidebarExtra = (
        <>
            <Button
                variant={!selectedUnit ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 font-medium text-xs h-10"
                onClick={() => setSelectedUnitId(null)}
            >
                <LayoutDashboard className="h-4 w-4 text-primary" />
                Training Plan Dashboard
            </Button>
            <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-medium text-xs h-10 text-muted-foreground hover:text-foreground"
                onClick={() => {
                    const foundations = allCoreUnits.find((u) => u.code === "SHBHIND001");
                    if (foundations) setSelectedUnitId(foundations.id);
                }}
            >
                <BookOpen className="h-4 w-4 text-primary" />
                Foundations Module (SHBHIND001)
            </Button>
            <Button
                variant="ghost"
                className="w-full justify-start gap-3 font-medium text-xs h-10 text-muted-foreground hover:text-foreground"
                onClick={() =>
                    setSelectedBookImage(BOOK_PAGES_IMAGES.foundationsOverview)
                }
            >
                <FileText className="h-4 w-4 text-primary" />
                Training Plan Scans
            </Button>
        </>
    );

    return (
        <AppShell sidebarExtra={sidebarExtra}>
            <ScrollArea className="flex-1 p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {selectedUnit ? (
                        <UnitDetailView
                            unit={selectedUnit}
                            onBack={() => setSelectedUnitId(null)}
                            onUpdateActivity={updateActivity}
                            onUploadEvidence={addEvidence}
                            onAssessorSignOff={assessorSignOff}
                        />
                    ) : (
                        <>
                            {/* Header Banner */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] uppercase tracking-wider text-primary border-primary/30"
                                        >
                                            Certificate III in Hairdressing
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            SHB30416 / SHB30420
                                        </span>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                        Apprentice Competency & Compliance Dashboard
                                    </h1>
                                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                                        Log workplace activities, upload evidence photos, and track
                                        sign-offs across all 21 Core & 12 Elective units.
                                    </p>
                                </div>

                                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="gap-2 text-xs shadow-sm font-semibold">
                                            <Upload className="h-4 w-4" />
                                            Quick Upload Evidence
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[480px]">
                                        <form onSubmit={handleQuickUploadSubmit}>
                                            <DialogHeader>
                                                <DialogTitle className="text-base flex items-center gap-2">
                                                    <Camera className="h-5 w-5 text-primary" />
                                                    Log Workplace Activity Evidence
                                                </DialogTitle>
                                                <DialogDescription className="text-xs">
                                                    Select the unit and upload photo evidence for trainer
                                                    assessment.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4 text-xs">
                                                <div className="grid gap-1.5">
                                                    <Label
                                                        htmlFor="unitSel"
                                                        className="text-xs font-semibold"
                                                    >
                                                        Select Training Unit
                                                    </Label>
                                                    <Select
                                                        value={uploadUnitCode}
                                                        onValueChange={setUploadUnitCode}
                                                    >
                                                        <SelectTrigger id="unitSel" className="text-xs">
                                                            <SelectValue placeholder="Choose a unit..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-60">
                                                            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase">
                                                                Core Units
                                                            </div>
                                                            {allCoreUnits.map((u) => (
                                                                <SelectItem
                                                                    key={u.id}
                                                                    value={u.code}
                                                                    className="text-xs"
                                                                >
                                                                    {u.code} - {u.title}
                                                                </SelectItem>
                                                            ))}
                                                            <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase pt-2">
                                                                Elective Units
                                                            </div>
                                                            {allElectiveUnits.map((u) => (
                                                                <SelectItem
                                                                    key={u.id}
                                                                    value={u.code}
                                                                    className="text-xs"
                                                                >
                                                                    {u.code} - {u.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid gap-1.5">
                                                    <Label
                                                        htmlFor="actName"
                                                        className="text-xs font-semibold"
                                                    >
                                                        Activity Name / Task
                                                    </Label>
                                                    <Input
                                                        id="actName"
                                                        placeholder="e.g. Hairdressing Scissors Cleaning & Oiling"
                                                        value={uploadActivityTitle}
                                                        onChange={(e) =>
                                                            setUploadActivityTitle(e.target.value)
                                                        }
                                                        className="text-xs"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-1.5">
                                                    <Label className="text-xs font-semibold">
                                                        Attach Photo Evidence
                                                    </Label>
                                                    <div className="border-2 border-dashed border-border rounded-lg p-5 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                                                        <Camera className="h-8 w-8 text-primary/70 mb-2" />
                                                        <p className="text-xs font-medium">
                                                            Click to select photo or capture with mobile
                                                            camera
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                                            Supports PNG, JPG, GIF (Max 10MB)
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="grid gap-1.5">
                                                    <Label
                                                        htmlFor="notes"
                                                        className="text-xs font-semibold"
                                                    >
                                                        Apprentice Comments / Reflection
                                                    </Label>
                                                    <Textarea
                                                        id="notes"
                                                        placeholder="Notes on chemical application, sanitized tools, or safety steps taken..."
                                                        value={uploadNotes}
                                                        onChange={(e) => setUploadNotes(e.target.value)}
                                                        className="text-xs min-h-[70px]"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setUploadOpen(false)}
                                                    className="text-xs"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button type="submit" className="text-xs font-semibold">
                                                    Submit Evidence
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Overall Progress Widget */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="md:col-span-2 border-primary/20 bg-card shadow-xs">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                <Award className="h-5 w-5 text-primary" />
                                                Overall Certificate III Progress
                                            </CardTitle>
                                            <Badge
                                                variant="secondary"
                                                className="font-mono text-[11px]"
                                            >
                                                {completedActivities} / {totalActivitiesCount}{" "}
                                                Activities Done
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-xs">
                                            Overall compliance calculated across all 21 Core Units and
                                            12 Elective options.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-foreground font-semibold">
                                                    {overallProgressPercent}% Completed
                                                </span>
                                                <span className="text-muted-foreground">
                                                    Target Completion: Nov 2026
                                                </span>
                                            </div>
                                            <Progress
                                                value={overallProgressPercent}
                                                className="h-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                                            <div className="p-2 bg-muted/40 rounded border border-border">
                                                <p className="text-muted-foreground text-[10px] uppercase">
                                                    Core Units
                                                </p>
                                                <p className="font-bold text-sm text-foreground mt-0.5">
                                                    21 Units
                                                </p>
                                            </div>
                                            <div className="p-2 bg-muted/40 rounded border border-border">
                                                <p className="text-muted-foreground text-[10px] uppercase">
                                                    Electives Required
                                                </p>
                                                <p className="font-bold text-sm text-foreground mt-0.5">
                                                    7 Units
                                                </p>
                                            </div>
                                            <div className="p-2 bg-muted/40 rounded border border-border">
                                                <p className="text-muted-foreground text-[10px] uppercase">
                                                    Assessed Units
                                                </p>
                                                <p className="font-bold text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">
                                                    {
                                                        [...allCoreUnits, ...allElectiveUnits].filter(
                                                            (u) => u.assessed,
                                                        ).length
                                                    }{" "}
                                                    Signed Off
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-border bg-gradient-to-br from-card to-muted/50 flex flex-col justify-between">
                                    <CardHeader className="pb-2">
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg w-fit mb-1">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-sm font-bold">
                                            Featured Module: SHBHIND001
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Maintain and organise tools, equipment & work areas
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0 text-xs space-y-3">
                                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                                            Contains the exact 8 workplace activities from page 28 &
                                            29 of your training plan book.
                                        </p>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="w-full text-xs gap-2 font-medium"
                                            onClick={() => {
                                                const foundations = allCoreUnits.find(
                                                    (u) => u.code === "SHBHIND001",
                                                );
                                                if (foundations) setSelectedUnitId(foundations.id);
                                            }}
                                        >
                                            Open Foundations Module{" "}
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="core" className="space-y-6">
                                <div className="flex items-center justify-between border-b border-border pb-2">
                                    <TabsList className="bg-muted/50 p-1">
                                        <TabsTrigger value="core" className="text-xs">
                                            21 Core Units
                                        </TabsTrigger>
                                        <TabsTrigger value="electives" className="text-xs">
                                            Elective Options
                                        </TabsTrigger>
                                        <TabsTrigger value="evidence" className="text-xs">
                                            Recent Evidence Feed ({evidenceList.length})
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="core" className="space-y-4 outline-none">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {allCoreUnits.map((unit) => {
                                            const isFoundations = unit.code === "SHBHIND001";
                                            const percent =
                                                unit.activities.length > 0
                                                    ? Math.round(
                                                        (unit.activities.filter((a) => a.completed)
                                                            .length /
                                                            unit.activities.length) *
                                                        100,
                                                    )
                                                    : Math.round(
                                                        (unit.completedCount / unit.requiredCount) * 100,
                                                    );
                                            return (
                                                <Card
                                                    key={unit.id}
                                                    onClick={() => setSelectedUnitId(unit.id)}
                                                    className={`group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 relative overflow-hidden ${isFoundations ? "ring-2 ring-primary/40 bg-card" : "bg-card"}`}
                                                >
                                                    {isFoundations && (
                                                        <div className="bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 text-center">
                                                            Sample Book Module
                                                        </div>
                                                    )}
                                                    <CardHeader className="p-4 pb-2">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                                {unit.code}
                                                            </span>
                                                            <Badge variant="outline" className="text-[10px]">
                                                                {unit.moduleCategory}
                                                            </Badge>
                                                        </div>
                                                        {unit.assessed ? (
                                                            <Badge className="absolute top-2 right-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px] gap-0.5">
                                                                <ShieldCheck className="h-2.5 w-2.5" /> Assessed
                                                            </Badge>
                                                        ) : unit.readyForAssessment ? (
                                                            <Badge className="absolute top-2 right-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[9px] gap-0.5">
                                                                <Send className="h-2.5 w-2.5" /> Ready for RTO
                                                            </Badge>
                                                        ) : null}
                                                        <CardTitle className="text-sm font-semibold leading-snug line-clamp-2 pt-1 group-hover:text-primary transition-colors">
                                                            {unit.title}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-4 pt-1 space-y-3">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[11px]">
                                                                <span className="text-muted-foreground">
                                                                    {unit.activities.length > 0
                                                                        ? `${unit.activities.filter((a) => a.completed).length} / ${unit.activities.length} activities`
                                                                        : `${unit.completedCount} / ${unit.requiredCount} completed`}
                                                                </span>
                                                                <span className="font-semibold text-foreground">
                                                                    {percent}%
                                                                </span>
                                                            </div>
                                                            <Progress value={percent} className="h-1.5" />
                                                        </div>
                                                        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground border-t border-border/50">
                                                            <span className="flex items-center gap-1 text-primary font-medium">
                                                                View Checklist{" "}
                                                                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                                            </span>
                                                            {unit.activities.length > 0 && (
                                                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                                                                    {unit.activities.length} Tasks
                                                                </span>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="electives"
                                    className="space-y-4 outline-none"
                                >
                                    <div className="bg-muted/30 p-4 rounded-lg border border-border mb-4 text-xs">
                                        <p className="font-semibold text-foreground">
                                            Elective Selection Note:
                                        </p>
                                        <p className="text-muted-foreground">
                                            According to the Cert III Hairdressing Training Plan (Page
                                            13), electives can be made up of 7 units from the options
                                            below.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {allElectiveUnits.map((unit) => {
                                            const percent =
                                                unit.activities.length > 0
                                                    ? Math.round(
                                                        (unit.activities.filter((a) => a.completed)
                                                            .length /
                                                            unit.activities.length) *
                                                        100,
                                                    )
                                                    : Math.round(
                                                        (unit.completedCount / unit.requiredCount) * 100,
                                                    );
                                            return (
                                                <Card
                                                    key={unit.id}
                                                    onClick={() => setSelectedUnitId(unit.id)}
                                                    className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 bg-card relative overflow-hidden"
                                                >
                                                    {unit.assessed && (
                                                        <Badge className="absolute top-2 right-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9px] gap-0.5 z-10">
                                                            <ShieldCheck className="h-2.5 w-2.5" /> Assessed
                                                        </Badge>
                                                    )}
                                                    <CardHeader className="p-4 pb-2">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <span className="font-mono text-xs font-bold text-secondary-foreground bg-secondary px-2 py-0.5 rounded">
                                                                {unit.code}
                                                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-[10px]"
                                                            >
                                                                Elective
                                                            </Badge>
                                                        </div>
                                                        <CardTitle className="text-sm font-semibold leading-snug line-clamp-2 pt-1 group-hover:text-primary transition-colors">
                                                            {unit.title}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="p-4 pt-1 space-y-3">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[11px]">
                                                                <span className="text-muted-foreground">
                                                                    {unit.completedCount} / {unit.requiredCount}{" "}
                                                                    tasks
                                                                </span>
                                                                <span className="font-semibold text-foreground">
                                                                    {percent}%
                                                                </span>
                                                            </div>
                                                            <Progress value={percent} className="h-1.5" />
                                                        </div>
                                                        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground border-t border-border/50">
                                                            <span className="flex items-center gap-1 text-primary font-medium">
                                                                View Details{" "}
                                                                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                                            </span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="evidence"
                                    className="space-y-4 outline-none"
                                >
                                    <Card className="border-border">
                                        <CardHeader className="p-4">
                                            <CardTitle className="text-base font-bold flex items-center justify-between">
                                                <span>Evidence Portfolio Log</span>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setUploadOpen(true)}
                                                    className="text-xs gap-1"
                                                >
                                                    <Upload className="h-3.5 w-3.5" /> Add Photo
                                                </Button>
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Photos and notes submitted by the apprentice for salon
                                                trainer sign-off.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {evidenceList.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="p-3 border border-border rounded-xl bg-muted/20 flex gap-3"
                                                    >
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.activityTitle}
                                                            className="w-24 h-24 object-cover rounded-lg border border-border flex-shrink-0 cursor-pointer hover:opacity-90"
                                                            onClick={() =>
                                                                setSelectedBookImage(item.imageUrl)
                                                            }
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
                                                                    ✓ Trainer: {item.trainerFeedback}
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
                        </>
                    )}
                </div>
            </ScrollArea>

            {selectedBookImage && (
                <Dialog
                    open={!!selectedBookImage}
                    onOpenChange={() => setSelectedBookImage(null)}
                >
                    <DialogContent className="max-w-4xl p-2 sm:p-4">
                        <DialogHeader className="px-2 pt-2">
                            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                Training Plan Reference Scan
                            </DialogTitle>
                        </DialogHeader>
                        <div className="overflow-auto max-h-[85vh] flex items-center justify-center p-2 bg-slate-950 rounded-lg">
                            <img
                                src={selectedBookImage}
                                alt="Reference scan"
                                className="max-w-full h-auto object-contain rounded"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </AppShell>
    );
}
