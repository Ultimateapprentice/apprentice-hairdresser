export interface WorkplaceActivity {
    id: string;
    section: string;
    title: string;
    description: string;
    completed: boolean;
    completedDate?: string;
    evidenceImages: string[];
    notes?: string;
    signedOffByTrainer?: boolean;
    trainerName?: string;
    trainerNotes?: string;
}

export interface TrainingUnit {
    id: string;
    code: string;
    title: string;
    type: "core" | "elective";
    moduleCategory: string;
    overview?: string;
    keyFocusAreas?: { title: string; description: string }[];
    requiredCount: number;
    completedCount: number;
    activities: WorkplaceActivity[];
    // Workplace supervisor declaration — unit ready for RTO assessment
    readyForAssessment?: boolean;
    supervisorName?: string;
    supervisorComments?: string;
    readyDate?: string;
    // Assessor sign-off fields (visible to employer)
    assessed?: boolean;
    assessorName?: string;
    assessorComments?: string;
    assessmentDate?: string;
}

export interface EvidenceRecord {
    id: string;
    unitCode: string;
    unitTitle: string;
    activityTitle: string;
    date: string;
    description: string;
    imageUrl: string;
    status: "Approved" | "Pending Review" | "Needs Revision";
    trainerFeedback?: string;
}

export const BOOK_PAGES_IMAGES = {
    foundationsOverview:
        "https://vibe.filesafe.space/1785228059844322391/attachments/f8c52cc4-4c3c-4f31-892c-135569db6b59.png",
    activityTable1:
        "https://vibe.filesafe.space/1785228059844322391/attachments/f60e742f-554d-4662-a067-ea92de9052e9.png",
    activityTable2:
        "https://vibe.filesafe.space/1785228059844322391/attachments/99b7af76-5bce-46ad-96d1-7fc2e47b0a5b.png",
};

export const coreUnits: TrainingUnit[] = [
    {
        id: "shbxind001",
        code: "SHBXIND001",
        title:
            "Comply with organisational requirements within a personal services environment",
        type: "core",
        moduleCategory: "Salon Practice",
        requiredCount: 5,
        completedCount: 4,
        activities: [
            {
                id: "c1-1",
                section: "1. Policy & Procedure Compliance",
                title: "Salon Code of Conduct",
                description:
                    "Review and comply with salon presentation, dress code, and workplace ethics standard operating procedures.",
                completed: true,
                completedDate: "2025-01-15",
                evidenceImages: [
                    "https://vibe.filesafe.space/1785228059844322391/assets/8152e987-c2d6-4de4-a748-dadcf794d628.png",
                ],
                notes: "Read and signed the salon handbook on day 1.",
                signedOffByTrainer: true,
                trainerName: "Sarah Jenkins (Salon Owner)",
            },
            {
                id: "c1-2",
                section: "1. Policy & Procedure Compliance",
                title: "Workplace Confidentiality",
                description:
                    "Maintain strict client privacy and records security in accordance with privacy laws and salon policy.",
                completed: true,
                completedDate: "2025-01-18",
                evidenceImages: [],
                signedOffByTrainer: true,
                trainerName: "Sarah Jenkins",
            },
        ],
    },
    {
        id: "shbxwhs001",
        code: "SHBXWHS001",
        title: "Apply safe hygiene, health and work practices",
        type: "core",
        moduleCategory: "Workplace Health & Safety",
        requiredCount: 6,
        completedCount: 5,
        activities: [
            {
                id: "c2-1",
                section: "1. Infection Control",
                title: "Hand Hygiene & Sanitisation Protocols",
                description:
                    "Demonstrate proper hand washing and disinfection techniques before and after client contact.",
                completed: true,
                completedDate: "2025-01-20",
                evidenceImages: [
                    "https://vibe.filesafe.space/1785228059844322391/assets/69c55131-8129-49b4-8d1b-b0f0bab38334.png",
                ],
                signedOffByTrainer: true,
                trainerName: "Marcus Vance",
            },
        ],
    },
    {
        id: "shbhbas001",
        code: "SHBHBAS001",
        title: "Provide shampoo and basin services",
        type: "core",
        moduleCategory: "Basin & Hair Care",
        requiredCount: 8,
        completedCount: 6,
        activities: [
            {
                id: "c3-1",
                section: "1. Basin Procedures",
                title: "Draping & Water Temperature Control",
                description:
                    "Drape client comfortably with towel and gown, test water temperature safely, and apply relaxing shampoo technique.",
                completed: true,
                completedDate: "2025-02-01",
                evidenceImages: [
                    "https://vibe.filesafe.space/1785228059844322391/assets/8152e987-c2d6-4de4-a748-dadcf794d628.png",
                ],
                signedOffByTrainer: true,
                trainerName: "Sarah Jenkins",
            },
        ],
    },
    {
        id: "shbhind001",
        code: "SHBHIND001",
        title: "Maintain and organise tools, equipment and work areas",
        type: "core",
        moduleCategory: "Foundations Module",
        overview:
            "In this topic, your apprentice will learn how to maintain a clean and safe working environment, ensuring all hairdressing tools, equipment and work surfaces are hygienic. This is essential for client safety and professional service delivery.",
        keyFocusAreas: [
            {
                title: "Tool and Equipment Maintenance",
                description:
                    "The apprentice must demonstrate how to properly clean and disinfect tools and equipment, including scissors, clippers, and work surfaces in line with health regulations.",
            },
            {
                title: "Workplace Products",
                description:
                    "They should also be familiar with all cleaning products used in the salon, their dilution rates, and application techniques based on salon procedures.",
            },
        ],
        requiredCount: 8,
        completedCount: 6,
        activities: [
            {
                id: "shbhind001-act-1",
                section: "1. Tools & Equipment Maintenance",
                title: "Hairdressing Scissors",
                description:
                    "Show your apprentice how to clean, oil, check scissors for bluntness and to store them according to salon procedures and health regulations.",
                completed: true,
                completedDate: "2025-02-10",
                evidenceImages: [
                    "https://vibe.filesafe.space/1785228059844322391/assets/8152e987-c2d6-4de4-a748-dadcf794d628.png",
                ],
                notes:
                    "Cleaned, oiled tension pivot, wiped down blade, stored in protective leather pouch.",
                signedOffByTrainer: true,
                trainerName: "Sarah Jenkins (Salon Owner)",
                trainerNotes:
                    "Excellent attention to tension and blade care. Proper storage verified.",
            },
            {
                id: "shbhind001-act-2",
                section: "1. Tools & Equipment Maintenance",
                title: "Clippers and Attachments",
                description:
                    "Have your apprentice take apart the clippers, clean each part, oil the blades, and check for bluntness or defects. Reminding them how to handle sharp blades carefully.",
                completed: true,
                completedDate: "2025-02-11",
                evidenceImages: [
                    "https://vibe.filesafe.space/1785228059844322391/assets/69c55131-8129-49b4-8d1b-b0f0bab38334.png",
                ],
                notes:
                    "Disassembled guard combs, brushed hair out of drive lever, applied clipper spray disinfectant and blade oil.",
                signedOffByTrainer: true,
                trainerName: "Sarah Jenkins",
                trainerNotes: "Good compliance with sharp blade handling guidelines.",
            },
            {
                id: "shbhind001-act-3",
                section: "1. Tools & Equipment Maintenance",
                title: "Tint Brushes and Combs",
                description:
                    "Have your apprentice wash and disinfect tint brushes and combs after every use. Discuss how different chemicals, like hair colour, can impact tools if not cleaned promptly.",
                completed: true,
                completedDate: "2025-02-12",
                evidenceImages: [
                    "https://vibe.filesafe.space/1785228059844322391/assets/8152e987-c2d6-4de4-a748-dadcf794d628.png",
                ],
                notes:
                    "Soaked brushes in Barbicide solution for 10 minutes following bleach application service.",
                signedOffByTrainer: true,
                trainerName: "Marcus Vance",
            },
            {
                id: "shbhind001-act-4",
                section: "1. Tools & Equipment Maintenance",
                title: "Client Chairs",
                description:
                    "Have your apprentice clean and disinfect the adjustable client chair, paying special attention to high-contact areas (handles, footrests). Show them how to check the mechanics for wear and tear, and demonstrate the process for tagging and reporting any issues.",
                completed: true,
                completedDate: "2025-02-14",
                evidenceImages: [
                    "https://vibe.filesafe.space/1785228059844322391/assets/69c55131-8129-49b4-8d1b-b0f0bab38334.png",
                ],
                notes:
                    "Disinfected leather, hydraulic foot pump, and armrests with hospital grade spray.",
                signedOffByTrainer: true,
                trainerName: "Sarah Jenkins",
            },
            {
                id: "shbhind001-act-5",
                section: "1. Tools & Equipment Maintenance",
                title: "Disposable Blade Safety Razors",
                description:
                    "Supervise your apprentice while they safely dispose of used razor blades and replace them. Discuss the importance of checking for issues and following health regulations to prevent injuries.",
                completed: true,
                completedDate: "2025-02-15",
                evidenceImages: [],
                notes:
                    "Disposed old blade directly into yellow Sharps Bin container as per health protocol.",
                signedOffByTrainer: true,
                trainerName: "Sarah Jenkins",
            },
            {
                id: "shbhind001-act-6",
                section: "2. Work Area Maintenance",
                title: "Basin Services",
                description:
                    "Guide your apprentice in cleaning and disinfecting the basin, chairs, surrounding surfaces and floors.",
                completed: true,
                completedDate: "2025-02-16",
                evidenceImages: [
                    "https://vibe.filesafe.space/1785228059844322391/assets/8152e987-c2d6-4de4-a748-dadcf794d628.png",
                ],
                notes:
                    "Removed hair trap debris, disinfected neck rest and polished basin porcelain.",
                signedOffByTrainer: true,
                trainerName: "Marcus Vance",
            },
            {
                id: "shbhind001-act-7",
                section: "2. Work Area Maintenance",
                title: "Workstation",
                description:
                    "Ask your apprentice to thoroughly clean work surfaces, equipment and floor at their workstation after a client. Preparing the area for the next client.",
                completed: false,
                evidenceImages: [],
                notes: "",
            },
            {
                id: "shbhind001-act-8",
                section: "2. Work Area Maintenance",
                title: "Reception Area",
                description:
                    "Show your apprentice how to wipe down surfaces (e.g. counters, chairs), and clean floors in the reception area.",
                completed: false,
                evidenceImages: [],
                notes: "",
            },
        ],
    },
    {
        id: "shbxind002",
        code: "SHBXIND002",
        title: "Communicate as part of a salon team",
        type: "core",
        moduleCategory: "Salon Practice",
        requiredCount: 4,
        completedCount: 3,
        activities: [
            {
                id: "c5-1",
                section: "1. Team Communication",
                title: "Morning Huddle & Handover",
                description:
                    "Active participation in daily salon briefing, allocating client schedules and assisting senior stylists.",
                completed: true,
                completedDate: "2025-02-05",
                evidenceImages: [],
                signedOffByTrainer: true,
                trainerName: "Sarah Jenkins",
            },
        ],
    },
    {
        id: "bsbsus201",
        code: "BSBSUS201",
        title: "Participate in environmentally sustainable work practices",
        type: "core",
        moduleCategory: "Salon Practice",
        requiredCount: 4,
        completedCount: 2,
        activities: [],
    },
    {
        id: "shbxccs002",
        code: "SHBXCCS002",
        title: "Provide salon services to clients",
        type: "core",
        moduleCategory: "Client Care",
        requiredCount: 10,
        completedCount: 7,
        activities: [],
    },
    {
        id: "shbhdes003",
        code: "SHBHDES003",
        title: "Create finished hair designs",
        type: "core",
        moduleCategory: "Styling",
        requiredCount: 8,
        completedCount: 4,
        activities: [],
    },
    {
        id: "shbhtri001",
        code: "SHBHTRI001",
        title: "Identify and treat hair and scalp conditions",
        type: "core",
        moduleCategory: "Scalp Science",
        requiredCount: 6,
        completedCount: 3,
        activities: [],
    },
    {
        id: "shbxccs001",
        code: "SHBXCCS001",
        title: "Conduct salon financial transactions",
        type: "core",
        moduleCategory: "Salon Operations",
        requiredCount: 5,
        completedCount: 2,
        activities: [],
    },
    {
        id: "shbhcut001",
        code: "SHBHCUT001",
        title: "Design haircut structures",
        type: "core",
        moduleCategory: "Cutting",
        requiredCount: 8,
        completedCount: 4,
        activities: [],
    },
    {
        id: "shbhcut002",
        code: "SHBHCUT002",
        title: "Create one length or solid haircut structures",
        type: "core",
        moduleCategory: "Cutting",
        requiredCount: 10,
        completedCount: 6,
        activities: [],
    },
    {
        id: "shbhcut003",
        code: "SHBHCUT003",
        title: "Create graduated haircut structures",
        type: "core",
        moduleCategory: "Cutting",
        requiredCount: 10,
        completedCount: 4,
        activities: [],
    },
    {
        id: "shbhcut004",
        code: "SHBHCUT004",
        title: "Create layered haircut structures",
        type: "core",
        moduleCategory: "Cutting",
        requiredCount: 10,
        completedCount: 3,
        activities: [],
    },
    {
        id: "shbhcut005",
        code: "SHBHCUT005",
        title: "Cut hair using over-comb techniques",
        type: "core",
        moduleCategory: "Cutting",
        requiredCount: 8,
        completedCount: 2,
        activities: [],
    },
    {
        id: "shbhcls002",
        code: "SHBHCLS002",
        title: "Colour and lighten hair",
        type: "core",
        moduleCategory: "Chemical Services",
        requiredCount: 12,
        completedCount: 7,
        activities: [],
    },
    {
        id: "shbhcls003",
        code: "SHBHCLS003",
        title: "Provide full and partial head highlighting treatments",
        type: "core",
        moduleCategory: "Chemical Services",
        requiredCount: 10,
        completedCount: 5,
        activities: [],
    },
    {
        id: "shbhcls004",
        code: "SHBHCLS004",
        title: "Neutralise unwanted colours and tones",
        type: "core",
        moduleCategory: "Chemical Services",
        requiredCount: 8,
        completedCount: 3,
        activities: [],
    },
    {
        id: "shbhcls005",
        code: "SHBHCLS005",
        title: "Provide on scalp full head and retouch bleach treatments",
        type: "core",
        moduleCategory: "Chemical Services",
        requiredCount: 8,
        completedCount: 2,
        activities: [],
    },
    {
        id: "shbhind003",
        code: "SHBHIND003",
        title: "Develop and expand a client base",
        type: "core",
        moduleCategory: "Salon Practice",
        requiredCount: 5,
        completedCount: 1,
        activities: [],
    },
    {
        id: "shbhref002",
        code: "SHBHREF002",
        title: "Straighten and relax hair with chemical treatments",
        type: "core",
        moduleCategory: "Chemical Services",
        requiredCount: 6,
        completedCount: 2,
        activities: [],
    },
];

export const electiveUnits: TrainingUnit[] = [
    {
        id: "shbhbas002",
        code: "SHBHBAS002",
        title: "Provide head, neck and shoulder massages for relaxation",
        type: "elective",
        moduleCategory: "Basin & Wellness",
        requiredCount: 5,
        completedCount: 3,
        activities: [],
    },
    {
        id: "shbhdes002",
        code: "SHBHDES002",
        title: "Braid hair",
        type: "elective",
        moduleCategory: "Styling",
        requiredCount: 6,
        completedCount: 4,
        activities: [],
    },
    {
        id: "sirrinv001",
        code: "SIRRINV001",
        title: "Receive and handle retail stock",
        type: "elective",
        moduleCategory: "Retail Operations",
        requiredCount: 4,
        completedCount: 2,
        activities: [],
    },
    {
        id: "shbhref003",
        code: "SHBHREF003",
        title: "Straighten and relax hair with protein treatments",
        type: "elective",
        moduleCategory: "Treatments",
        requiredCount: 5,
        completedCount: 1,
        activities: [],
    },
    {
        id: "shbhref001",
        code: "SHBHREF001",
        title: "Curl and volumise hair with chemical treatments",
        type: "elective",
        moduleCategory: "Perming",
        requiredCount: 5,
        completedCount: 0,
        activities: [],
    },
    {
        id: "shbhcut011",
        code: "SHBHCUT011",
        title: "Design and maintain beards and moustaches",
        type: "elective",
        moduleCategory: "Barbering",
        requiredCount: 6,
        completedCount: 2,
        activities: [],
    },
    {
        id: "shbhind002",
        code: "SHBHIND002",
        title: "Research and use hairdressing industry information",
        type: "elective",
        moduleCategory: "Industry Research",
        requiredCount: 3,
        completedCount: 3,
        activities: [],
    },
    {
        id: "shbhcut006",
        code: "SHBHCUT006",
        title: "Create combined haircut structures",
        type: "elective",
        moduleCategory: "Cutting",
        requiredCount: 8,
        completedCount: 1,
        activities: [],
    },
    {
        id: "shbhcut007",
        code: "SHBHCUT007",
        title: "Create combined traditional and classic men's haircut structures",
        type: "elective",
        moduleCategory: "Barbering",
        requiredCount: 6,
        completedCount: 0,
        activities: [],
    },
    {
        id: "shbhdes004",
        code: "SHBHDES004",
        title: "Create classic long hair up-styles",
        type: "elective",
        moduleCategory: "Styling",
        requiredCount: 6,
        completedCount: 5,
        activities: [],
    },
    {
        id: "shbhccs001",
        code: "SHBHCCS001",
        title: "Plan hair services for special events",
        type: "elective",
        moduleCategory: "Client Care",
        requiredCount: 4,
        completedCount: 1,
        activities: [],
    },
    {
        id: "shbhind004",
        code: "SHBHIND004",
        title: "Participate in session styling teams",
        type: "elective",
        moduleCategory: "Fashion & Events",
        requiredCount: 4,
        completedCount: 0,
        activities: [],
    },
];

export const initialEvidenceFeed: EvidenceRecord[] = [
    {
        id: "ev-1",
        unitCode: "SHBHIND001",
        unitTitle: "Maintain and organise tools, equipment and work areas",
        activityTitle: "Hairdressing Scissors Maintenance & Oiling",
        date: "2025-02-10",
        description:
            "Cleaned, sanitized, oiled tension pivots, tested blade sharpness on wet tissues, and stored scissors safely in leather pouch.",
        imageUrl:
            "https://vibe.filesafe.space/1785228059844322391/assets/8152e987-c2d6-4de4-a748-dadcf794d628.png",
        status: "Approved",
        trainerFeedback:
            "Great job! Scissors clean, tension checked, and safely cased.",
    },
    {
        id: "ev-2",
        unitCode: "SHBHIND001",
        unitTitle: "Maintain and organise tools, equipment and work areas",
        activityTitle: "Clippers & Attachment Hygiene",
        date: "2025-02-11",
        description:
            "Took apart clipper blade mechanism, removed stray hair, sprayed with disinfectant, oiled blades, and reassembled.",
        imageUrl:
            "https://vibe.filesafe.space/1785228059844322391/assets/69c55131-8129-49b4-8d1b-b0f0bab38334.png",
        status: "Approved",
        trainerFeedback: "Verified clean blades and proper oil application.",
    },
    {
        id: "ev-3",
        unitCode: "SHBHCLS003",
        unitTitle: "Provide full and partial head highlighting treatments",
        activityTitle: "Foil Highlighting Application",
        date: "2025-02-13",
        description:
            "Completed half-head weave foils with 20vol developer on fine hair texture. Sectioning was precise and neat.",
        imageUrl:
            "https://vibe.filesafe.space/1785228059844322391/assets/8152e987-c2d6-4de4-a748-dadcf794d628.png",
        status: "Pending Review",
    },
    {
        id: "ev-4",
        unitCode: "SHBHCUT002",
        unitTitle: "Create one length or solid haircut structures",
        activityTitle: "Solid Form Perimeter Cut",
        date: "2025-02-14",
        description:
            "Executed solid form horizontal line cut on client with zero degree elevation. Checked baseline balance.",
        imageUrl:
            "https://vibe.filesafe.space/1785228059844322391/assets/69c55131-8129-49b4-8d1b-b0f0bab38334.png",
        status: "Approved",
        trainerFeedback: "Solid line crisp and even. Good body positioning.",
    },
];
