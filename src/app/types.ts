export type Assignment = {
    id:string;
    taskName: string;
    activeDuration: ActiveDuration[];
    history:string[];
    isActive:boolean;
};

export type ActiveDuration = {
    startedAt: string;
    endedAt?:string;
};