import React, { useState } from "react";
import {
    TrainingUnit,
    WorkplaceActivity,
    BOOK_PAGES_IMAGES,
} from "@/data/trainingData";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Check,
    CheckCircle2,
    FileText,
    Camera,
    Upload,
    ArrowLeft,
    ShieldCheck,
    UserCheck,
    Sparkles,
    BookOpen,
    AlertCircle,
    Info,
    ClipboardCheck,
    Send,
    Clock,
} from "lucide-react";
import { toast } from "sonner";

interface UnitDetailViewProps {
    unit: TrainingUnit;
    onBack: () => void;
    onUpdateActivity: (
        unitId: string,
        activityId: string,
        updated: Partial<WorkplaceActivity>,
    ) => void;
    onUploadEvidence: (
        unitCode: string,
        unitTitle: string,
        activityTitle: string,
        description: string,
        photoUrl: string,
    ) => void;
    onAssessorSignOff?: (
        unitId: string,
        signOff: {
            assessed: boolean;
            assessorName: string;
            assessorComments: string;
        },
    ) => void;
    onMarkReadyForAssessment?: (
        unitId: string,
        ready: {
            readyForAssessment: boolean;
            supervisorName: string;
            supervisorComments: string;
        },
    ) => void;
    // Disables all editing (pure viewer)
    readOnly?: boolean;
    // Allows marking activities complete + uploading evidence (employer/supervisor)
    canMarkActivities?: boolean;
    // Allows declaring a unit ready for RTO assessment (employer/supervisor)
    canDeclareReady?: boolean;
    // Allows the formal RTO assessment sign-off (assessor only)
    canAssess?: boolean;
}

export const UnitDetailView: React.FC<UnitDetailViewProps> = ({
    unit,
    onBack,
    onUpdateActivity,
    onUploadEvidence,
    onAssessorSignOff,
    onMarkReadyForAssessment,
    readOnly = false,
    canMarkActivities = false,
    canDeclareReady = false,
    canAssess = false,
}) => {
    const canEdit = canMarkActivities || canAssess || canDeclareReady;
    const [selectedActivity, setSelectedActivity] =
        useState<WorkplaceActivity | null>(null);
    const [showBookPageModal, setShowBookPageModal] = useState<string | null>(
        null,
    );
    const [notesText, setNotesText] = useState("");
    const [photoPreview, setPhotoPreview] = useState<string>(
        "https://vibe.filesafe.space/1785228059844322391/assets/8152e987-c2d6-4de4-a748-dadcf794d628.png",
    );
    const [isUploading, setIsUploading] = useState(false);

    // Assessor sign-off state
    const [assessorName, setAssessorName] = useState(unit.assessorName || "");
    const [assessorComments, setAssessorComments] = useState(
        unit.assessorComments || "",
    );
    const [isAssessed, setIsAssessed] = useState(unit.assessed || false);
    const [showAssessorForm, setShowAssessorForm] = useState(false);

    // Supervisor "ready for assessment" declaration state
    const [supervisorName, setSupervisorName] = useState(
        unit.supervisorName || "",
    );
    const [supervisorComments, setSupervisorComments] = useState(
        unit.supervisorComments || "",
    );
    const [isReadyForAssessment, setIsReadyForAssessment] = useState(
        unit.readyForAssessment || false,
    );
    const [showReadyForm, setShowReadyForm] = useState(false);

    const completedActivitiesCount = unit.activities.filter(
        (a) => a.completed,
    ).length;
    const totalActivities = unit.activities.length;
    const unitPercent =
        totalActivities > 0
            ? Math.round((completedActivitiesCount / totalActivities) * 100)
            : 0;

    // Group activities by section
    const sections = Array.from(new Set(unit.activities.map((a) => a.section)));

    const handleOpenUpload = (activity: WorkplaceActivity) => {
        setSelectedActivity(activity);
        setNotesText(activity.notes || "");
    };

    const handleSaveActivityEvidence = () => {
        if (!selectedActivity) return;

        setIsUploading(true);
        setTimeout(() => {
            onUpdateActivity(unit.id, selectedActivity.id, {
                completed: true,
                completedDate: new Date().toISOString().split("T")[0],
                notes: notesText,
                evidenceImages: photoPreview
                    ? [...selectedActivity.evidenceImages, photoPreview]
                    : selectedActivity.evidenceImages,
            });

            onUploadEvidence(
                unit.code,
                unit.title,
                selectedActivity.title,
                notesText || selectedActivity.description,
                photoPreview,
            );

            toast.success(
                `Activity "${selectedActivity.title}" updated and evidence logged!`,
            );
            setIsUploading(false);
            setSelectedActivity(null);
        }, 600);
    };

    const handleToggleCheck = (act: WorkplaceActivity) => {
        const newStatus = !act.completed;
        onUpdateActivity(unit.id, act.id, {
            completed: newStatus,
            completedDate: newStatus
                ? new Date().toISOString().split("T")[0]
                : undefined,
        });
        if (newStatus) {
            toast.success(`Marked "${act.title}" as completed`);
        } else {
            toast.info(`Marked "${act.title}" as incomplete`);
        }
    };

    const handleAssessorSignOff = () => {
        if (!assessorName.trim()) {
            toast.error("Please enter the assessor name before signing off.");
            return;
        }
        if (!assessorComments.trim()) {
            toast.error("Please add assessment comments before signing off.");
            return;
        }
        setIsAssessed(true);
        setShowAssessorForm(false);
        if (onAssessorSignOff) {
            onAssessorSignOff(unit.id, {
                assessed: true,
                assessorName,
                assessorComments,
            });
        }
        toast.success(
            `Unit ${unit.code} assessed and signed off by ${assessorName}. Employer can now view progress.`,
        );
    };

    const handleRevokeSignOff = () => {
        setIsAssessed(false);
        if (onAssessorSignOff) {
            onAssessorSignOff(unit.id, {
                assessed: false,
                assessorName: "",
                assessorComments: "",
            });
        }
        toast.info(`Assessment sign-off removed for ${unit.code}.`);
    };

    const handleDeclareReady = () => {
        if (!supervisorName.trim()) {
            toast.error("Please enter the supervisor name before declaring ready.");
            return;
        }
        if (!supervisorComments.trim()) {
            toast.error(
                "Please add a brief comment confirming the apprentice is ready before submitting to the RTO.",
            );
            return;
        }
        setIsReadyForAssessment(true);
        setShowReadyForm(false);
        if (onMarkReadyForAssessment) {
            onMarkReadyForAssessment(unit.id, {
                readyForAssessment: true,
                supervisorName,
                supervisorComments,
            });
        }
        toast.success(
            `${unit.code} declared ready for RTO assessment. The assessor has been notified.`,
        );
    };

    const handleRevokeReady = () => {
        setIsReadyForAssessment(false);
        if (onMarkReadyForAssessment) {
            onMarkReadyForAssessment(unit.id, {
                readyForAssessment: false,
                supervisorName: "",
                supervisorComments: "",
            });
        }
        toast.info(`Ready-for-assessment declaration removed for ${unit.code}.`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBack}
                        className="gap-1 text-xs"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Units
                    </Button>
                    <Badge
                        variant={unit.type === "core" ? "default" : "secondary"}
                        className="uppercase tracking-wider text-[10px]"
                    >
                        {unit.type} UNIT
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                        {unit.code}
                    </span>
                </div>

                {/* View Original Textbook Module Scans */}
                {unit.code === "SHBHIND001" && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setShowBookPageModal(BOOK_PAGES_IMAGES.foundationsOverview)
                            }
                            className="gap-2 text-xs border-primary/30 text-primary hover:bg-primary/10"
                        >
                            <BookOpen className="h-3.5 w-3.5" />
                            View Book Module Page
                        </Button>
                    </div>
                )}
            </div>

            {/* Unit Title Banner */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        {unit.moduleCategory}
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                        {unit.code} - {unit.title}
                    </h1>
                </div>

                {/* Unit Overview if present (from textbook) */}
                {unit.overview && (
                    <div className="bg-muted/40 p-4 rounded-lg border border-border/50 text-sm space-y-2">
                        <div className="font-semibold text-foreground flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                            <Info className="h-4 w-4 text-primary" />
                            Overview
                        </div>
                        <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                            {unit.overview}
                        </p>
                    </div>
                )}

                {/* Key Focus Areas */}
                {unit.keyFocusAreas && unit.keyFocusAreas.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {unit.keyFocusAreas.map((area, idx) => (
                            <div
                                key={idx}
                                className="p-3 bg-secondary/20 rounded-lg border border-border/40 text-xs"
                            >
                                <span className="font-semibold text-foreground block mb-1">
                                    {area.title}:
                                </span>
                                <span className="text-muted-foreground leading-normal">
                                    {area.description}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Unit Completion Progress Bar */}
                <div className="pt-2 border-t border-border/60">
                    <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                        <span className="text-foreground">Activity Progress</span>
                        <span className="text-primary font-semibold">
                            {completedActivitiesCount} of {totalActivities} Completed (
                            {unitPercent}%)
                        </span>
                    </div>
                    <Progress value={unitPercent} className="h-2.5" />
                </div>
            </div>

            {/* Activity Table Checklists (Matches Image 3 & 4 structure) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Workplace Activities Checklist
                    </h2>
                    <span className="text-xs text-muted-foreground">
                        Tap checkmark or add photo evidence to log compliance
                    </span>
                </div>

                {sections.map((sectionTitle) => {
                    const sectionActivities = unit.activities.filter(
                        (a) => a.section === sectionTitle,
                    );
                    return (
                        <Card
                            key={sectionTitle}
                            className="overflow-hidden border border-border"
                        >
                            <CardHeader className="bg-muted/30 py-3 px-4 border-b border-border">
                                <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                                    <span>{sectionTitle}</span>
                                    <Badge variant="outline" className="text-[10px] font-normal">
                                        {sectionActivities.filter((a) => a.completed).length}/
                                        {sectionActivities.length} Done
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 divide-y divide-border">
                                {sectionActivities.map((act) => (
                                    <div
                                        key={act.id}
                                        className={`p-4 transition-colors ${act.completed ? "bg-primary/5" : "hover:bg-muted/20"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Checkbox status indicator */}
                                            {!canEdit ? (
                                                <div
                                                    className={`flex-shrink-0 mt-0.5 h-6 w-6 rounded border flex items-center justify-center ${act.completed
                                                            ? "bg-primary border-primary text-primary-foreground"
                                                            : "border-muted-foreground/40 bg-background"
                                                        }`}
                                                >
                                                    {act.completed && (
                                                        <Check className="h-4 w-4 stroke-[3]" />
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleCheck(act)}
                                                    className={`flex-shrink-0 mt-0.5 h-6 w-6 rounded border flex items-center justify-center transition-all ${act.completed
                                                            ? "bg-primary border-primary text-primary-foreground shadow-sm"
                                                            : "border-muted-foreground/40 hover:border-primary bg-background"
                                                        }`}
                                                    title={
                                                        act.completed ? "Mark incomplete" : "Mark complete"
                                                    }
                                                >
                                                    {act.completed && (
                                                        <Check className="h-4 w-4 stroke-[3]" />
                                                    )}
                                                </button>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <h3
                                                        className={`font-semibold text-sm ${act.completed ? "text-foreground" : "text-foreground"}`}
                                                    >
                                                        {act.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        {act.completedDate && (
                                                            <span className="text-[11px] text-muted-foreground font-mono">
                                                                Completed: {act.completedDate}
                                                            </span>
                                                        )}
                                                        {act.signedOffByTrainer && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1"
                                                            >
                                                                <ShieldCheck className="h-3 w-3" />
                                                                Trainer Signed Off
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {act.description}
                                                </p>

                                                {/* Existing Notes or Evidence */}
                                                {act.notes && (
                                                    <div className="mt-2 text-xs bg-muted/50 p-2.5 rounded border border-border/50 text-foreground/90">
                                                        <span className="font-medium text-primary block text-[10px] uppercase tracking-wide">
                                                            Apprentice Notes:
                                                        </span>
                                                        {act.notes}
                                                    </div>
                                                )}

                                                {act.trainerNotes && (
                                                    <div className="mt-1 text-xs bg-accent p-2.5 rounded border border-border text-foreground">
                                                        <span className="font-medium block text-[10px] uppercase tracking-wide flex items-center gap-1 text-primary">
                                                            <UserCheck className="h-3 w-3" />
                                                            Trainer Feedback ({act.trainerName}):
                                                        </span>
                                                        {act.trainerNotes}
                                                    </div>
                                                )}

                                                {/* Attached Evidence Thumbnails */}
                                                {act.evidenceImages &&
                                                    act.evidenceImages.length > 0 && (
                                                        <div className="flex items-center gap-2 pt-1">
                                                            <span className="text-[11px] text-muted-foreground">
                                                                Evidence:
                                                            </span>
                                                            {act.evidenceImages.map((img, i) => (
                                                                <img
                                                                    key={i}
                                                                    src={img}
                                                                    alt="Evidence thumbnail"
                                                                    className="h-10 w-10 object-cover rounded border border-border shadow-xs hover:scale-105 transition-transform cursor-pointer"
                                                                    onClick={() => setShowBookPageModal(img)}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex flex-col gap-1.5">
                                                {canEdit && (
                                                    <Button
                                                        size="sm"
                                                        variant={act.completed ? "outline" : "default"}
                                                        onClick={() => handleOpenUpload(act)}
                                                        className="text-xs gap-1.5 shadow-xs"
                                                    >
                                                        <Camera className="h-3.5 w-3.5" />
                                                        <span className="hidden sm:inline">
                                                            {act.evidenceImages.length > 0
                                                                ? "Add Photo"
                                                                : "Attach Photo"}
                                                        </span>
                                                        <span className="sm:hidden">Photo</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Workplace Supervisor "Ready for Assessment" Declaration */}
            <Card className="border-2 border-primary/20 bg-card shadow-sm">
                <CardHeader className="bg-primary/5 border-b border-primary/15 py-3 px-4">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-primary" />
                            Workplace Supervisor Declaration
                        </span>
                        {isReadyForAssessment ? (
                            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] gap-1">
                                <Send className="h-3 w-3" />
                                Ready for RTO
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="text-[10px] text-muted-foreground gap-1"
                            >
                                <Clock className="h-3 w-3" />
                                Not Yet Declared
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription className="text-xs">
                        The supervisor confirms all workplace activities are complete and
                        submits this unit to the RTO assessor for formal assessment.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {isReadyForAssessment && !showReadyForm ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-foreground">
                                        Declared ready by {unit.supervisorName || supervisorName}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {unit.readyDate || new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                {canDeclareReady && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowReadyForm(true)}
                                            className="text-xs"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRevokeReady}
                                            className="text-xs text-destructive hover:text-destructive"
                                        >
                                            Withdraw
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
                                <span className="font-medium text-primary block text-[10px] uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    Supervisor Comments:
                                </span>
                                <p className="text-xs text-foreground/90 leading-relaxed">
                                    {unit.supervisorComments || supervisorComments}
                                </p>
                            </div>
                        </div>
                    ) : !canDeclareReady ? (
                        isReadyForAssessment ? null : (
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-foreground">
                                        Awaiting Supervisor Declaration
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        The workplace supervisor has not yet declared this unit
                                        ready for RTO assessment.
                                    </p>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label className="text-xs font-semibold mb-1.5 block">
                                        Supervisor Name
                                    </Label>
                                    <Input
                                        placeholder="e.g. Sarah Jenkins, Salon Owner"
                                        value={supervisorName}
                                        onChange={(e) => setSupervisorName(e.target.value)}
                                        className="text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold mb-1.5 block">
                                        Declaration Comments
                                    </Label>
                                    <Textarea
                                        placeholder="Confirm the apprentice has completed all workplace activities to a satisfactory standard and is ready for RTO assessment. Note the workplace context and any observations..."
                                        value={supervisorComments}
                                        onChange={(e) => setSupervisorComments(e.target.value)}
                                        className="text-xs min-h-[100px]"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <Button
                                    onClick={handleDeclareReady}
                                    size="sm"
                                    className="text-xs gap-1.5 font-semibold"
                                >
                                    <Send className="h-4 w-4" />
                                    Declare Ready for RTO Assessment
                                </Button>
                                {isReadyForAssessment && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowReadyForm(false)}
                                        className="text-xs"
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assessor Sign-Off Section */}
            <Card className="border-2 border-primary/30 bg-card shadow-sm">
                <CardHeader className="bg-primary/5 border-b border-primary/20 py-3 px-4">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Assessor Sign-Off & Employer Visibility
                        </span>
                        {isAssessed ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Assessed
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/40 gap-1"
                            >
                                <AlertCircle className="h-3 w-3" />
                                Pending Assessment
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Assessor confirms competency. Comments are visible to the employer
                        for progress tracking.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {isAssessed && !showAssessorForm ? (
                        /* Display the completed assessment */
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-foreground">
                                        Assessed by {unit.assessorName || assessorName}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {unit.assessmentDate || new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                {canAssess && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAssessorForm(true)}
                                            className="text-xs"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRevokeSignOff}
                                            className="text-xs text-destructive hover:text-destructive"
                                        >
                                            Revoke
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
                                <span className="font-medium text-primary block text-[10px] uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    Assessor Comments:
                                </span>
                                <p className="text-xs text-foreground/90 leading-relaxed">
                                    {unit.assessorComments || assessorComments}
                                </p>
                            </div>
                        </div>
                    ) : !canAssess ? (
                        /* Read-only pending notice (employer / apprentice) */
                        <div className="flex items-center gap-3 p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
                            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-foreground">
                                    Awaiting RTO Assessment
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                    This unit has not yet been signed off by the assessor.
                                    Comments will appear here once assessed.
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Assessment form */
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label className="text-xs font-semibold mb-1.5 block">
                                        Assessor Name
                                    </Label>
                                    <Input
                                        placeholder="e.g. Sarah Jenkins, RTO Assessor"
                                        value={assessorName}
                                        onChange={(e) => setAssessorName(e.target.value)}
                                        className="text-xs"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold mb-1.5 block">
                                        Assessment Comments
                                    </Label>
                                    <Textarea
                                        placeholder="Confirm the apprentice has demonstrated competency in all workplace activities for this unit. Note strengths, areas of improvement, and compliance with training package requirements..."
                                        value={assessorComments}
                                        onChange={(e) => setAssessorComments(e.target.value)}
                                        className="text-xs min-h-[100px]"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <Button
                                    onClick={handleAssessorSignOff}
                                    size="sm"
                                    className="text-xs gap-1.5 font-semibold"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Sign Off Assessment
                                </Button>
                                {isAssessed && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowAssessorForm(false)}
                                        className="text-xs"
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal for Uploading Evidence for Selected Activity */}
            {selectedActivity && (
                <Dialog
                    open={!!selectedActivity}
                    onOpenChange={(open) => !open && setSelectedActivity(null)}
                >
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base">
                                <Camera className="h-5 w-5 text-primary" />
                                Upload Evidence: {selectedActivity.title}
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Attach a photo showing completion of this task to submit for
                                trainer verification.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <div className="bg-muted/40 p-3 rounded text-xs border border-border">
                                <span className="font-semibold block mb-0.5 text-foreground">
                                    Task Requirement:
                                </span>
                                <p className="text-muted-foreground">
                                    {selectedActivity.description}
                                </p>
                            </div>

                            {/* Upload Drop Zone / Mock Photo Selector */}
                            <div>
                                <Label className="text-xs font-semibold mb-1.5 block">
                                    Photo Evidence
                                </Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center text-center bg-card hover:bg-muted/30 transition-colors">
                                    {photoPreview ? (
                                        <div className="relative w-full aspect-video rounded-md overflow-hidden border border-border group">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        setPhotoPreview(
                                                            "https://vibe.filesafe.space/1785228059844322391/assets/69c55131-8129-49b4-8d1b-b0f0bab38334.png",
                                                        )
                                                    }
                                                    className="text-xs"
                                                >
                                                    Switch Sample Photo
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-4 flex flex-col items-center">
                                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-xs font-medium text-foreground">
                                                Tap to take photo or choose from camera roll
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                High resolution clear photo of completed work
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label
                                    htmlFor="actNotes"
                                    className="text-xs font-semibold mb-1.5 block"
                                >
                                    Apprentice Reflection / Technique Notes
                                </Label>
                                <Textarea
                                    id="actNotes"
                                    placeholder="Describe tools used, health and safety procedures followed, or observations..."
                                    value={notesText}
                                    onChange={(e) => setNotesText(e.target.value)}
                                    className="text-xs min-h-[80px]"
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedActivity(null)}
                                className="text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveActivityEvidence}
                                disabled={isUploading}
                                className="text-xs gap-1.5"
                            >
                                {isUploading ? (
                                    <span>Saving...</span>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Save & Mark Complete
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Book Scan Image Preview Modal */}
            {showBookPageModal && (
                <Dialog
                    open={!!showBookPageModal}
                    onOpenChange={() => setShowBookPageModal(null)}
                >
                    <DialogContent className="max-w-3xl p-2 sm:p-4">
                        <DialogHeader className="px-2 pt-2">
                            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                Certificate III Hairdressing Training Plan Reference
                            </DialogTitle>
                        </DialogHeader>
                        <div className="overflow-auto max-h-[80vh] flex items-center justify-center p-2 bg-slate-900 rounded-lg">
                            <img
                                src={showBookPageModal}
                                alt="Textbook module scan"
                                className="max-w-full h-auto object-contain rounded"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};
