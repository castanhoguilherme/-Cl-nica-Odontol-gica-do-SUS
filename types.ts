export type Desk = {
    name: string;
    attendant: string;
};

export type Call = {
    ticket: string; // Can be number or patient name
    desk: string;
    attendant: string;
    isPriority: boolean;
    timestamp: Date;
};

export type Patient = {
    id: number;
    firstName: string;
    lastName: string;
    cpf: string;
    dob: string; // date of birth
};

export type Collaborator = {
    id: number;
    firstName: string;
    lastName: string;
    registration: string;
    profile: 'administrador' | 'painel' | 'atendente';
    password?: string;
};

export type AppView = 'dashboard' | 'patient' | 'attendant' | 'display' | 'admin' | 'dedicated_attendant';