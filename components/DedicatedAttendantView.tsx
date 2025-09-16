import React, { useState, useEffect, CSSProperties } from 'react';
import type { Collaborator, Desk, Call, Patient } from '../types';

const PatientServiceForm = ({ patient, onSave, ticketId }: { patient: Patient | null; onSave: (p: Omit<Patient, 'id'>) => void; ticketId: string | number; }) => {
    const initialFormState = { firstName: '', lastName: '', cpf: '', dob: '' };
    const [formData, setFormData] = useState<Omit<Patient, 'id'>>(initialFormState);
    const [notes, setNotes] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (patient) {
            setFormData({
                firstName: patient.firstName,
                lastName: patient.lastName,
                cpf: patient.cpf,
                dob: patient.dob
            });
        } else {
            setFormData(initialFormState);
        }
        setNotes(''); // Always reset notes
        setIsSaved(false); // Reset save status
    }, [patient, ticketId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (formData.firstName && formData.cpf && formData.dob) {
            onSave(formData);
            setIsSaved(true);
        } else {
            alert('Por favor, preencha nome, CPF e data de nascimento.');
        }
    };

    const isNewPatient = !patient;

    const styles: { [key: string]: CSSProperties } = {
        formContainer: { backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '25px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' },
        formTitle: { margin: '0 0 25px 0', fontSize: '1.8em', color: '#A3B18A', borderBottom: '2px solid #A3B18A', paddingBottom: '10px', fontWeight: 600 },
        form: { display: 'flex', flexDirection: 'column', gap: '18px', flexGrow: 1 },
        inputGroup: { display: 'flex', gap: '15px' },
        input: { flexGrow: 1, padding: '12px', fontSize: '1em', backgroundColor: '#FDFCFB', border: '1px solid #E0E0E0', borderRadius: '10px', color: '#3D405B', opacity: isNewPatient ? 1 : 0.7 },
        textarea: { minHeight: '100px', resize: 'vertical' },
        saveButton: { border: 'none', borderRadius: '10px', padding: '15px', fontSize: '1.1em', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#A8DADC', color: '#3D405B', transition: 'background-color 0.3s ease', marginTop: 'auto' },
        disabledMessage: { textAlign: 'center', color: '#8D99AE', marginTop: '20px', fontStyle: 'italic' }
    };

    return (
        <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Atendimento: Senha {ticketId}</h2>
            <div style={styles.form}>
                <div style={styles.inputGroup}>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nome" style={styles.input} disabled={!isNewPatient} />
                    <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Sobrenome" style={styles.input} disabled={!isNewPatient} />
                </div>
                <div style={styles.inputGroup}>
                    <input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" style={styles.input} disabled={!isNewPatient} />
                    <input name="dob" type="date" value={formData.dob} onChange={handleChange} style={styles.input} disabled={!isNewPatient} />
                </div>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anotações do atendimento..." style={{...styles.input, ...styles.textarea}} />
                {isNewPatient ? (
                    isSaved ? <p style={{color: '#A3B18A', textAlign: 'center'}}>Paciente salvo com sucesso!</p> : <button onClick={handleSave} style={styles.saveButton}>Salvar Cadastro</button>
                ) : <p style={styles.disabledMessage}>Paciente já possui cadastro.</p>}
            </div>
        </div>
    );
};

interface DedicatedAttendantViewProps {
    attendant: Collaborator;
    desk?: Desk;
    queue: (string | number)[];
    priorityQueue: (string | number)[];
    history: Call[];
    onCallNext: () => void;
    onLogout: () => void;
    currentTicketId: string | null;
    ticketDetails: { [key: string]: { patient: Patient | null; isPriority: boolean; } };
    onAddPatient: (p: Omit<Patient, 'id'>) => void;
    onFinishServing: () => void;
}

export const DedicatedAttendantView = (props: DedicatedAttendantViewProps) => {
    const { attendant, desk, queue, priorityQueue, history, onCallNext, onLogout, currentTicketId, ticketDetails, onAddPatient, onFinishServing } = props;
    const hasTickets = queue.length > 0 || priorityQueue.length > 0;
    const currentPatient = currentTicketId ? ticketDetails[currentTicketId]?.patient : null;

    const isFinishingMode = !!currentTicketId && !hasTickets;

    const unifiedQueue = [
        ...priorityQueue.map(ticket => ({ ticket, isPriority: true })),
        ...queue.map(ticket => ({ ticket, isPriority: false }))
    ];
    
    const placeholderMessage = hasTickets ? "Aguardando chamada..." : "Não há mais pacientes na fila.";
    const buttonLabel = isFinishingMode ? "Finalizar Atendimento" : "Chamar Próximo";
    const handleActionClick = isFinishingMode ? onFinishServing : onCallNext;
    const isButtonDisabled = !desk || (!hasTickets && !currentTicketId);

    const styles: { [key: string]: CSSProperties } = {
        container: { width: '100vw', height: '100vh', backgroundColor: '#E9ECEF', color: '#3D405B', display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #E0E0E0' },
        title: { margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: '#A3B18A', fontWeight: 600 },
        logoutButton: { backgroundColor: '#E07A5F', border: 'none', borderRadius: '10px', color: 'white', padding: '10px 20px', fontSize: '1em', cursor: 'pointer', fontWeight: 'bold' },
        contentWrapper: { flex: 1, display: 'flex', gap: '20px', marginTop: '20px', overflow: 'hidden' },
        leftPanel: { flex: '1 1 300px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' },
        rightPanel: { flex: '2 1 600px', display: 'flex', flexDirection: 'column' },
        panelSection: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        sectionTitle: { margin: '0 0 15px 0', fontSize: '1.5em', borderBottom: '2px solid', paddingBottom: '10px', fontWeight: 600 },
        ticketList: { listStyle: 'none', padding: 0, margin: 0, flexGrow: 1, overflowY: 'auto' },
        ticketItem: { backgroundColor: '#F7F7F7', padding: '12px', borderRadius: '10px', marginBottom: '10px', fontSize: '1.1em', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
        priorityIndicator: { color: '#F2CC8F', fontWeight: 'bold', fontSize: '1.2em' },
        historyItem: { display: 'flex', justifyContent: 'space-between', backgroundColor: '#F7F7F7', padding: '12px', borderRadius: '10px', marginBottom: '10px', fontSize: '1.1em' },
        placeholder: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '1.5em', color: 'rgba(61, 64, 91, 0.5)', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' },
        footer: { paddingTop: '20px' },
        callButton: { width: '100%', padding: '20px', fontSize: '1.6em', fontWeight: 'bold', backgroundColor: '#A3B18A', color: '#FFFFFF', border: 'none', borderRadius: '12px', transition: 'background-color 0.3s, opacity 0.3s' },
    };

    const greeting = `Olá, ${attendant.firstName}! ${desk ? `Seu guichê é o ${desk.name}.` : 'Nenhum guichê alocado.'}`;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{greeting}</h1>
                <button onClick={onLogout} style={styles.logoutButton}>Sair</button>
            </header>
            <div style={styles.contentWrapper}>
                <aside style={styles.leftPanel}>
                    <section style={styles.panelSection}>
                        <h2 style={{...styles.sectionTitle, color: '#A8DADC', borderBottomColor: '#A8DADC'}}>Fila de Espera ({unifiedQueue.length})</h2>
                        <ul style={styles.ticketList}>
                            {unifiedQueue.length > 0 ? unifiedQueue.map(({ticket, isPriority}, i) => 
                                <li key={`q-${i}`} style={styles.ticketItem}>
                                    {isPriority && <span style={styles.priorityIndicator}>★</span>} {ticket}
                                </li>
                            ) : <li style={{...styles.ticketItem, opacity: 0.5}}>Fila vazia</li>}
                        </ul>
                    </section>
                    <section style={styles.panelSection}>
                        <h2 style={{...styles.sectionTitle, color: '#3D405B', borderBottomColor: '#3D405B'}}>Seu Histórico ({history.length})</h2>
                        <ul style={styles.ticketList}>
                            {history.length > 0 ? history.map((call, i) => (
                              <li key={`h-${i}`} style={styles.historyItem}>
                                <span>{call.ticket} {call.isPriority && '★'}</span>
                                <span style={{opacity: 0.6}}>{call.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </li>
                            )) : <li style={{...styles.ticketItem, opacity: 0.5}}>Nenhum atendimento</li>}
                        </ul>
                    </section>
                </aside>
                <main style={styles.rightPanel}>
                    {currentTicketId ? 
                        <PatientServiceForm patient={currentPatient} onSave={onAddPatient} ticketId={currentTicketId}/> :
                        <div style={styles.placeholder}>{placeholderMessage}</div>
                    }
                </main>
            </div>
            <footer style={styles.footer}>
                <button 
                    onClick={handleActionClick} 
                    style={{
                        ...styles.callButton,
                        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                        opacity: isButtonDisabled ? 0.5 : 1,
                    }} 
                    disabled={isButtonDisabled}>
                    {buttonLabel}
                </button>
            </footer>
        </div>
    );
};