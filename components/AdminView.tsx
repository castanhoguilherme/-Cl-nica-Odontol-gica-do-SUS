import React, { useState, useEffect, CSSProperties } from 'react';
import type { Desk, Collaborator, Patient } from '../types';
import { useMediaQuery } from '../hooks/useMediaQuery';

// --- SUB-COMPONENTES DE ADMINISTRAÇÃO ---
const DeskManagementView = ({ desks, collaborators, onAddDesk, onRemoveDesk }: { desks: Desk[], collaborators: Collaborator[], onAddDesk: (desk: Desk) => void, onRemoveDesk: (name: string) => void }) => {
    const attendantCollaborators = collaborators.filter(c => c.profile === 'atendente');
    const [newDeskName, setNewDeskName] = useState('');
    const [selectedAttendant, setSelectedAttendant] = useState(attendantCollaborators.length > 0 ? `${attendantCollaborators[0].firstName} ${attendantCollaborators[0].lastName}` : '');
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    useEffect(() => {
        if (!selectedAttendant && attendantCollaborators.length > 0) {
            setSelectedAttendant(`${attendantCollaborators[0].firstName} ${attendantCollaborators[0].lastName}`);
        }
    }, [attendantCollaborators, selectedAttendant]);

    const handleAdd = () => {
        const trimmedDeskName = newDeskName.trim();
        if (trimmedDeskName && selectedAttendant && !desks.some(d => d.name === trimmedDeskName)) {
            onAddDesk({ name: trimmedDeskName, attendant: selectedAttendant });
            setNewDeskName('');
        }
    };
    
    const styles: { [key: string]: CSSProperties } = {
        subViewContainer: { width: '100%' },
        subViewTitle: { color: '#A3B18A', marginBottom: '20px', fontSize: '1.5em', borderBottom: '2px solid #A3B18A', paddingBottom: '10px', fontWeight: 600 },
        form: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
        inputGroup: { display: 'flex', gap: '10px', flexDirection: isSmallScreen ? 'column' : 'row' },
        input: { flexGrow: 1, padding: '12px', fontSize: '1em', backgroundColor: '#FDFCFB', border: '1px solid #E0E0E0', borderRadius: '10px', color: '#3D405B' },
        select: { flexGrow: 1, padding: '12px', fontSize: '1em', backgroundColor: '#FDFCFB', border: '1px solid #E0E0E0', borderRadius: '10px', color: '#3D405B' },
        addButton: { backgroundColor: '#A3B18A', border: 'none', borderRadius: '10px', color: 'white', padding: '12px 20px', fontSize: '1em', cursor: 'pointer', fontWeight: 'bold', opacity: attendantCollaborators.length > 0 ? 1 : 0.5 },
        list: { listStyle: 'none', padding: 0 },
        listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F7F7F7', borderRadius: '10px', marginBottom: '8px' },
        removeButton: { backgroundColor: '#E07A5F', border: 'none', borderRadius: '50%', color: 'white', width: '30px', height: '30px', fontSize: '1.2em', cursor: 'pointer', lineHeight: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        emptyMessage: { color: '#8D99AE' }
    };

    return (
        <div style={styles.subViewContainer}>
            <h3 style={styles.subViewTitle}>Gerenciar Guichês</h3>
            <div style={styles.form}>
                <div style={styles.inputGroup}>
                    <input type="text" value={newDeskName} onChange={(e) => setNewDeskName(e.target.value)} placeholder="Nome do Guichê" style={styles.input} />
                    <select value={selectedAttendant} onChange={(e) => setSelectedAttendant(e.target.value)} style={styles.select} disabled={attendantCollaborators.length === 0}>
                        {attendantCollaborators.map(c => <option key={c.id} value={`${c.firstName} ${c.lastName}`}>{c.firstName} {c.lastName}</option>)}
                    </select>
                </div>
                <button onClick={handleAdd} style={styles.addButton} disabled={attendantCollaborators.length === 0}>Adicionar Guichê</button>
            </div>
            <ul style={styles.list}>
                {desks.map(desk => <li key={desk.name} style={styles.listItem}><span>{desk.name} ({desk.attendant})</span><button onClick={() => onRemoveDesk(desk.name)} style={styles.removeButton}>&times;</button></li>)}
            </ul>
        </div>
    );
};

const CollaboratorManagementView = ({ collaborators, onAdd, onRemove }: { collaborators: Collaborator[], onAdd: (c: Omit<Collaborator, 'id'>) => void, onRemove: (id: number) => void }) => {
    const [formState, setFormState] = useState({ firstName: '', lastName: '', registration: '', profile: 'atendente' as Collaborator['profile'], password: '' });
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    const handleGeneratePassword = () => {
        const newPassword = Math.random().toString(36).slice(-8);
        setFormState(prev => ({...prev, password: newPassword}));
    };

    const handleAdd = () => {
        if (formState.firstName && formState.lastName && formState.registration && formState.password) {
            onAdd(formState);
            setFormState({ firstName: '', lastName: '', registration: '', profile: 'atendente', password: '' });
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const styles: { [key: string]: CSSProperties } = {
        subViewContainer: { width: '100%' },
        subViewTitle: { color: '#A3B18A', marginBottom: '20px', fontSize: '1.5em', borderBottom: '2px solid #A3B18A', paddingBottom: '10px', fontWeight: 600 },
        form: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
        inputGroup: { display: 'flex', gap: '10px', flexDirection: isSmallScreen ? 'column' : 'row' },
        input: { flexGrow: 1, padding: '12px', fontSize: '1em', backgroundColor: '#FDFCFB', border: '1px solid #E0E0E0', borderRadius: '10px', color: '#3D405B' },
        select: { flexGrow: 1, padding: '12px', fontSize: '1em', backgroundColor: '#FDFCFB', border: '1px solid #E0E0E0', borderRadius: '10px', color: '#3D405B' },
        addButton: { backgroundColor: '#A3B18A', border: 'none', borderRadius: '10px', color: 'white', padding: '12px 20px', fontSize: '1em', cursor: 'pointer', fontWeight: 'bold' },
        generateButton: {
            backgroundColor: '#A8DADC',
            color: '#3D405B',
            border: 'none',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '0.9em',
            cursor: 'pointer',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
        },
        list: { listStyle: 'none', padding: 0 },
        listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F7F7F7', borderRadius: '10px', marginBottom: '8px', flexWrap: 'wrap' },
        removeButton: { backgroundColor: '#E07A5F', border: 'none', borderRadius: '50%', color: 'white', width: '30px', height: '30px', fontSize: '1.2em', cursor: 'pointer', lineHeight: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
    };
    
    return (
        <div style={styles.subViewContainer}>
            <h3 style={styles.subViewTitle}>Gerenciar Colaboradores</h3>
            <div style={styles.form}>
                <div style={styles.inputGroup}>
                    <input name="firstName" value={formState.firstName} onChange={handleChange} placeholder="Nome" style={styles.input} />
                    <input name="lastName" value={formState.lastName} onChange={handleChange} placeholder="Sobrenome" style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                    <input name="registration" value={formState.registration} onChange={handleChange} placeholder="Matrícula" style={styles.input} />
                    <select name="profile" value={formState.profile} onChange={handleChange} style={styles.select}>
                        <option value="atendente">Atendente</option>
                        <option value="administrador">Administrador</option>
                        <option value="painel">Painel</option>
                    </select>
                </div>
                <div style={styles.inputGroup}>
                    <input name="password" type="text" value={formState.password} onChange={handleChange} placeholder="Senha" style={styles.input} />
                    <button type="button" onClick={handleGeneratePassword} style={styles.generateButton}>Gerar Senha</button>
                </div>
                <button onClick={handleAdd} style={styles.addButton}>Adicionar Colaborador</button>
            </div>
            <ul style={styles.list}>
                {collaborators.map(c => <li key={c.id} style={styles.listItem}><span>{c.firstName} {c.lastName} ({c.profile})</span><button onClick={() => onRemove(c.id)} style={styles.removeButton}>&times;</button></li>)}
            </ul>
        </div>
    );
};

const PatientManagementView = ({ patients, onAdd, onRemove }: { patients: Patient[], onAdd: (p: Omit<Patient, 'id'>) => void, onRemove: (id: number) => void }) => {
    const [formState, setFormState] = useState({ firstName: '', lastName: '', cpf: '', dob: '' });
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    const handleAdd = () => {
        if (formState.firstName && formState.cpf && formState.dob) {
            onAdd(formState);
            setFormState({ firstName: '', lastName: '', cpf: '', dob: '' });
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const styles: { [key: string]: CSSProperties } = {
        subViewContainer: { width: '100%' },
        subViewTitle: { color: '#A3B18A', marginBottom: '20px', fontSize: '1.5em', borderBottom: '2px solid #A3B18A', paddingBottom: '10px', fontWeight: 600 },
        form: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
        inputGroup: { display: 'flex', gap: '10px', flexDirection: isSmallScreen ? 'column' : 'row' },
        input: { flexGrow: 1, padding: '12px', fontSize: '1em', backgroundColor: '#FDFCFB', border: '1px solid #E0E0E0', borderRadius: '10px', color: '#3D405B' },
        addButton: { backgroundColor: '#A3B18A', border: 'none', borderRadius: '10px', color: 'white', padding: '12px 20px', fontSize: '1em', cursor: 'pointer', fontWeight: 'bold' },
        list: { listStyle: 'none', padding: 0 },
        listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#F7F7F7', borderRadius: '10px', marginBottom: '8px', flexWrap: 'wrap' },
        removeButton: { backgroundColor: '#E07A5F', border: 'none', borderRadius: '50%', color: 'white', width: '30px', height: '30px', fontSize: '1.2em', cursor: 'pointer', lineHeight: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
    };

    return (
        <div style={styles.subViewContainer}>
            <h3 style={styles.subViewTitle}>Cadastrar Paciente</h3>
            <div style={styles.form}>
                <div style={styles.inputGroup}>
                    <input name="firstName" value={formState.firstName} onChange={handleChange} placeholder="Nome" style={styles.input} />
                    <input name="lastName" value={formState.lastName} onChange={handleChange} placeholder="Sobrenome" style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                    <input name="cpf" value={formState.cpf} onChange={handleChange} placeholder="CPF" style={styles.input} />
                    <input name="dob" type="date" value={formState.dob} onChange={handleChange} style={styles.input} />
                </div>
                <button onClick={handleAdd} style={styles.addButton}>Adicionar Paciente</button>
            </div>
            <ul style={styles.list}>
                {patients.map(p => <li key={p.id} style={styles.listItem}><span>{p.firstName} {p.lastName} ({p.cpf})</span><button onClick={() => onRemove(p.id)} style={styles.removeButton}>&times;</button></li>)}
            </ul>
        </div>
    );
};

interface AdminViewProps {
    desks: Desk[];
    collaborators: Collaborator[];
    patients: Patient[];
    onAddDesk: (desk: Desk) => void;
    onRemoveDesk: (name: string) => void;
    onAddCollaborator: (c: Omit<Collaborator, 'id'>) => void;
    onRemoveCollaborator: (id: number) => void;
    onAddPatient: (p: Omit<Patient, 'id'>) => void;
    onRemovePatient: (id: number) => void;
}

export const AdminView = (props: AdminViewProps) => {
    const [activeTab, setActiveTab] = useState<'desks' | 'collaborators' | 'patients'>('desks');
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    const styles: { [key: string]: CSSProperties } = {
        container: {
            textAlign: 'left',
            backgroundColor: '#FFFFFF',
            padding: '30px 40px',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '900px'
        },
        title: { color: '#3D405B', marginBottom: '30px', fontSize: '2em', textAlign: 'center', fontWeight: 600 },
        tabContainer: { display: 'flex', marginBottom: '30px', borderBottom: '1px solid #E0E0E0', flexDirection: isSmallScreen ? 'column' : 'row', gap: isSmallScreen ? '10px' : '0' },
        tab: {
            padding: '10px 20px',
            fontSize: '1.1em',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#8D99AE',
            fontWeight: 500,
            borderBottom: '4px solid transparent',
        },
        activeTab: {
            color: '#A3B18A',
            borderBottom: '4px solid #A3B18A',
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Área do Administrador</h1>
            <nav style={styles.tabContainer}>
                <button style={{ ...styles.tab, ...(activeTab === 'desks' && styles.activeTab) }} onClick={() => setActiveTab('desks')}>Gerenciar Guichês</button>
                <button style={{ ...styles.tab, ...(activeTab === 'collaborators' && styles.activeTab) }} onClick={() => setActiveTab('collaborators')}>Gerenciar Colaboradores</button>
                <button style={{ ...styles.tab, ...(activeTab === 'patients' && styles.activeTab) }} onClick={() => setActiveTab('patients')}>Cadastrar Paciente</button>
            </nav>
            <div>
                {activeTab === 'desks' && <DeskManagementView desks={props.desks} collaborators={props.collaborators} onAddDesk={props.onAddDesk} onRemoveDesk={props.onRemoveDesk} />}
                {activeTab === 'collaborators' && <CollaboratorManagementView collaborators={props.collaborators} onAdd={props.onAddCollaborator} onRemove={props.onRemoveCollaborator} />}
                {activeTab === 'patients' && <PatientManagementView patients={props.patients} onAdd={props.onAddPatient} onRemove={props.onRemovePatient} />}
            </div>
        </div>
    );
};