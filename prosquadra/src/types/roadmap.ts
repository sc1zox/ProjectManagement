export interface Roadmap {
    milestones: Milestone[];
}

export interface Milestone {
    title: string;
    description: string;
    dueDate: Date;
}
