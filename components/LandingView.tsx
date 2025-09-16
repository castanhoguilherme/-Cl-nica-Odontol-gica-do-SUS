import React, { CSSProperties } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { AppView } from '../types';

export const LandingView = ({ onNavigate, onLogout }: { onNavigate: (view: Exclude<AppView, 'landing'>) => void; onLogout: () => void; }) => {
    const isSmallScreen = useMediaQuery('(max-width: 600px)');
    const styles: { [key: string]: CSSProperties } = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'center',
            backgroundColor: '#20232a',
            padding: isSmallScreen ? '30px' : '40px 50px',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            width: '90%',
            maxWidth: '500px'
        },
        title: {
            color: 'white',
            fontSize: isSmallScreen ? '2em' : '2.5em',
            marginBottom: '20px',
        },
        navButton: {
            border: 'none',
            borderRadius: '8px',
            padding: '20px 40px',
            fontSize: isSmallScreen ? '1em' : '1.2em',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease, transform 0.1s ease',
            color: '#20232a',
        },
        patientButton: { backgroundColor: '#61dafb' },
        attendantButton: { backgroundColor: '#98c379' },
        displayButton: { backgroundColor: '#e06c75', color: 'white' },
        adminButton: { backgroundColor: '#c678dd', color: 'white' },
        logoutButton: { backgroundColor: '#4a4f58', color: 'white', marginTop: '20px' }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Sistema de Atendimento</h1>
            <button style={{ ...styles.navButton, ...styles.patientButton }} onClick={() => onNavigate('patient')}>Área do Paciente</button>
            <button style={{ ...styles.navButton, ...styles.attendantButton }} onClick={() => onNavigate('attendant')}>Área de Atendimento</button>
            <button style={{ ...styles.navButton, ...styles.adminButton }} onClick={() => onNavigate('admin')}>Área do Administrador</button>
            <button style={{ ...styles.navButton, ...styles.displayButton }} onClick={() => onNavigate('display')}>Painel de Exibição</button>
            <button style={{...styles.navButton, ...styles.logoutButton}} onClick={onLogout}>Sair</button>
        </div>
    );
};
