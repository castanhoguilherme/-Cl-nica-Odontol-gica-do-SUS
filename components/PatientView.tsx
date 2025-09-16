import React, { useState, useEffect, CSSProperties } from 'react';
import type { Patient } from '../types';
import { calculateAge } from '../utils/dateHelper';

export const PatientView = ({ patients, onGenerateTicket, onGeneratePriorityTicket, onBack }: { patients: Patient[], onGenerateTicket: (patient: Patient | null) => number, onGeneratePriorityTicket: (patient: Patient | null) => number, onBack?: () => void }) => {
    const [view, setView] = useState<'cpfInput' | 'buttons' | 'confirmation'>('cpfInput');
    const [cpf, setCpf] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (view === 'confirmation') {
            const timer = setTimeout(() => {
                setView('cpfInput');
                setMessage('');
                setCpf('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [view]);

    const handleCpfCheck = () => {
        const foundPatient = patients.find(p => p.cpf.replace(/[.-]/g, '') === cpf.replace(/[.-]/g, ''));
        if (foundPatient) {
            const age = calculateAge(foundPatient.dob);
            const isPriority = age >= 60;
            const ticketNumber = isPriority ? onGeneratePriorityTicket(foundPatient) : onGenerateTicket(foundPatient);
            setMessage(`Olá ${foundPatient.firstName}! Sua senha ${isPriority ? 'prioritária' : ''} número ${ticketNumber} foi gerada.`);
            setView('confirmation');
        } else {
            setMessage('CPF não encontrado. Pegue uma senha avulsa abaixo.');
            setView('buttons');
        }
    };

    const styles: { [key: string]: CSSProperties } = {
        container: {
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            padding: '30px 40px',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '450px',
            gap: '20px',
            position: 'relative'
        },
        backButton: {
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: '#8D99AE',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            padding: '10px 20px',
            fontSize: '1em',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        title: { color: '#A3B18A', marginBottom: '10px', fontSize: '2em', fontWeight: 600 },
        input: { padding: '12px', fontSize: '1em', backgroundColor: '#FDFCFB', border: '1px solid #E0E0E0', borderRadius: '10px', color: '#3D405B', textAlign: 'center', width: 'calc(100% - 24px)' },
        message: { fontSize: '1em', color: '#F2CC8F', marginBottom: '10px', fontWeight: 500 },
        confirmationMessage: { fontSize: '1.1em', color: '#A3B18A', fontWeight: 'bold', minHeight: '50px' },
        generateButton: { border: 'none', borderRadius: '10px', padding: '15px 30px', fontSize: '1.1em', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease, transform 0.1s ease', width: '100%', },
        normalButton: { backgroundColor: '#A8DADC', color: '#3D405B', },
        priorityButton: { backgroundColor: '#F2CC8F', color: '#3D405B', },
        confirmButton: { backgroundColor: '#A3B18A', color: '#FFFFFF' }
    };

    return (
        <div style={styles.container}>
            {onBack && (
                <button style={styles.backButton} onClick={onBack}>&larr; Voltar</button>
            )}
            <h1 style={styles.title}>Área do Paciente</h1>
            {view === 'confirmation' ? (<p style={styles.confirmationMessage}>{message}</p>) : (<>
                {view === 'cpfInput' && (<>
                    <p style={{color: '#8D99AE'}}>Digite seu CPF para um atendimento personalizado.</p>
                    <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Seu CPF" style={styles.input} />
                    <button onClick={handleCpfCheck} style={{...styles.generateButton, ...styles.confirmButton}}>Confirmar CPF</button>
                </>)}
                {message && <p style={styles.message}>{message}</p>}
                {view === 'buttons' && (<>
                    <button style={{...styles.generateButton, ...styles.normalButton}} onClick={() => { const ticket = onGenerateTicket(null); setMessage(`Senha avulsa número ${ticket} gerada.`); setView('confirmation'); }}>Pegar Senha</button>
                    <button style={{...styles.generateButton, ...styles.priorityButton}} onClick={() => { const ticket = onGeneratePriorityTicket(null); setMessage(`Senha prioritária avulsa número ${ticket} gerada.`); setView('confirmation'); }}>Pegar Senha Prioritária</button>
                </>)}
            </>)}
        </div>
    );
};