export interface IPlan {
    name: string;
    price: number;
    originalPrice?: number;
    hasQRIS: boolean;
    hasReports: boolean;
    duration: "MONTHLY" | "YEARLY";
    maxTables: number;
    maxMenuItems: number;
    maxStaffAccounts: number;
    durationInMonths: number;
}