import { useState } from 'react';
import type { Desk, Collaborator, Patient, Call } from '../types';

export const useAppState = () => {
    // --- State ---
    const [desks, setDesks] = useState<Desk[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([
        { id: 101, firstName: 'João', lastName: 'Silva', registration: 'atd001', profile: 'atendente', password: '123' },
        { id: 102, firstName: 'Maria', lastName: 'Souza', registration: 'atd002', profile: 'atendente', password: '123' },
    ]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [queue, setQueue] = useState<(number | string)[]>([]);
    const [priorityQueue, setPriorityQueue] = useState<(number | string)[]>([]);
    const [nextTicket, setNextTicket] = useState(1);
    const [currentlyServing, setCurrentlyServing] = useState<{ [key: string]: string | null }>({});
    const [currentCall, setCurrentCall] = useState<Call | null>(null);
    const [callHistory, setCallHistory] = useState<Call[]>([]);
    const [ticketDetails, setTicketDetails] = useState<{ [key: string]: { patient: Patient | null, isPriority: boolean } }>({});

    // --- Handlers / Actions ---
    const handleAddDesk = (desk: Desk) => setDesks(prev => [...prev, desk]);
    const handleRemoveDesk = (name: string) => setDesks(prev => prev.filter(d => d.name !== name));

    const handleAddCollaborator = (c: Omit<Collaborator, 'id'>) => setCollaborators(prev => [...prev, { ...c, id: Date.now() }]);
    const handleRemoveCollaborator = (id: number) => setCollaborators(prev => prev.filter(c => c.id !== id));

    const handleAddPatient = (p: Omit<Patient, 'id'>) => setPatients(prev => [...prev, { ...p, id: Date.now() }]);
    const handleRemovePatient = (id: number) => setPatients(prev => prev.filter(p => p.id !== id));

    const handleGenerateTicket = (patient: Patient | null) => {
        const ticketId = nextTicket;
        setQueue(prev => [...prev, ticketId]);
        setTicketDetails(prev => ({ ...prev, [ticketId]: { patient, isPriority: false } }));
        setNextTicket(prev => prev + 1);
        return ticketId;
    };
    
    const handleGeneratePriorityTicket = (patient: Patient | null) => {
        const ticketId = nextTicket;
        setPriorityQueue(prev => [...prev, ticketId]);
        setTicketDetails(prev => ({ ...prev, [ticketId]: { patient, isPriority: true } }));
        setNextTicket(prev => prev + 1);
        return ticketId;
    };

    const handleCallForDesk = (deskName: string) => {
        let ticketToCall: string | number | undefined;
        let isPriority = false;

        if (priorityQueue.length > 0) {
            ticketToCall = priorityQueue[0];
            setPriorityQueue(prev => prev.slice(1));
            isPriority = true;
        } else if (queue.length > 0) {
            ticketToCall = queue[0];
            setQueue(prev => prev.slice(1));
        }

        if (ticketToCall !== undefined) {
            const desk = desks.find(d => d.name === deskName);
            if (!desk) return;
            
            const call: Call = {
                ticket: String(ticketToCall),
                desk: desk.name,
                attendant: desk.attendant,
                isPriority,
                timestamp: new Date()
            };
            
            setCurrentCall(call);
            setCallHistory(prev => [call, ...prev].slice(0, 10));
            setCurrentlyServing(prev => ({ ...prev, [deskName]: String(ticketToCall) }));
        }
    };
    
    const handleFinishServing = (deskName: string) => {
        setCurrentlyServing(prev => ({ ...prev, [deskName]: null }));
    };

    return {
        desks,
        collaborators,
        patients,
        queue,
        priorityQueue,
        currentlyServing,
        currentCall,
        callHistory,
        handleAddDesk,
        handleRemoveDesk,
        handleAddCollaborator,
        handleRemoveCollaborator,
        handleAddPatient,
        handleRemovePatient,
        handleGenerateTicket,
        handleGeneratePriorityTicket,
        handleCallForDesk,
        handleFinishServing,
        ticketDetails,
    };
};