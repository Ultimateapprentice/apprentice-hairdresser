import React, {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import {
    coreUnits,
    electiveUnits,
    initialEvidenceFeed,
    type TrainingUnit,
    type WorkplaceActivity,
    type EvidenceRecord,
} from "@/data/trainingData";

export type UserRole = "apprentice" | "assessor" | "employer";

export interface User {
    role: UserRole;
    name: string;
    org?: string;
}

interface AppContextType {
    user: User | null;

    login: (user: User) => void;
    logout: () => void;

    coreUnits: TrainingUnit[];
    electiveUnits: TrainingUnit[];
    evidence: EvidenceRecord[];

    updateActivity: (
        unitId: string,
        activityId: string,
        updated: Partial<WorkplaceActivity>,
    ) => void;

    markReadyForAssessment: (
        unitId: string,
        ready: {
            readyForAssessment: boolean;
            supervisorName: string;
            supervisorComments: string;
        },
    ) => void;

    assessorSignOff: (
        unitId: string,
        signOff: {
            assessed: boolean;
            assessorName: string;
            assessorComments: string;
        },
    ) => void;

    addEvidence: (
        unitCode: string,
        unitTitle: string,
        activityTitle: string,
        description: string,
        photoUrl: string,
    ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    const [allCoreUnits, setCoreUnits] =
        useState<TrainingUnit[]>(coreUnits);

    const [allElectiveUnits, setElectiveUnits] =
        useState<TrainingUnit[]>(electiveUnits);

    const [evidenceList, setEvidence] =
        useState<EvidenceRecord[]>(initialEvidenceFeed);

    const login = useCallback((nextUser: User) => {
        setUser(nextUser);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const updateActivity = useCallback(
        (
            unitId: string,
            activityId: string,
            updatedFields: Partial<WorkplaceActivity>,
        ) => {
            const updateUnitList = (units: TrainingUnit[]) =>
                units.map((unit) => {
                    if (unit.id !== unitId) {
                        return unit;
                    }

                    const updatedActivities = unit.activities.map((activity) =>
                        activity.id === activityId
                            ? {
                                ...activity,
                                ...updatedFields,
                            }
                            : activity,
                    );

                    return {
                        ...unit,
                        activities: updatedActivities,
                        completedCount: updatedActivities.filter(
                            (activity) => activity.completed,
                        ).length,
                    };
                });

            setCoreUnits((previous) => updateUnitList(previous));
            setElectiveUnits((previous) => updateUnitList(previous));
        },
        [],
    );

    const markReadyForAssessment = useCallback(
        (
            unitId: string,
            ready: {
                readyForAssessment: boolean;
                supervisorName: string;
                supervisorComments: string;
            },
        ) => {
            const updateUnitList = (units: TrainingUnit[]) =>
                units.map((unit) =>
                    unit.id === unitId
                        ? {
                            ...unit,
                            readyForAssessment: ready.readyForAssessment,
                            supervisorName: ready.readyForAssessment
                                ? ready.supervisorName
                                : "",
                            supervisorComments: ready.readyForAssessment
                                ? ready.supervisorComments
                                : "",
                            readyDate: ready.readyForAssessment
                                ? new Date().toISOString().split("T")[0]
                                : undefined,
                        }
                        : unit,
                );

            setCoreUnits((previous) => updateUnitList(previous));
            setElectiveUnits((previous) => updateUnitList(previous));
        },
        [],
    );

    const assessorSignOff = useCallback(
        (
            unitId: string,
            signOff: {
                assessed: boolean;
                assessorName: string;
                assessorComments: string;
            },
        ) => {
            const updateUnitList = (units: TrainingUnit[]) =>
                units.map((unit) =>
                    unit.id === unitId
                        ? {
                            ...unit,
                            assessed: signOff.assessed,
                            assessorName: signOff.assessorName,
                            assessorComments: signOff.assessorComments,
                            assessmentDate: signOff.assessed
                                ? new Date().toISOString().split("T")[0]
                                : undefined,
                        }
                        : unit,
                );

            setCoreUnits((previous) => updateUnitList(previous));
            setElectiveUnits((previous) => updateUnitList(previous));
        },
        [],
    );

    const addEvidence = useCallback(
        (
            unitCode: string,
            unitTitle: string,
            activityTitle: string,
            description: string,
            photoUrl: string,
        ) => {
            const newRecord: EvidenceRecord = {
                id: `ev-${Date.now()}`,
                unitCode,
                unitTitle,
                activityTitle,
                date: new Date().toISOString().split("T")[0],
                description,
                imageUrl: photoUrl || "/placeholder.svg",
                status: "Pending Review",
            };

            setEvidence((previous) => [
                newRecord,
                ...previous,
            ]);
        },
        [],
    );

    const value: AppContextType = {
        user,
        login,
        logout,
        coreUnits: allCoreUnits,
        electiveUnits: allElectiveUnits,
        evidence: evidenceList,
        updateActivity,
        markReadyForAssessment,
        assessorSignOff,
        addEvidence,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp(): AppContextType {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error(
            "useApp must be used within an AppProvider",
        );
    }

    return context;
}