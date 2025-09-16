import React, { useState, useEffect, CSSProperties } from 'react';
import type { Call } from '../types';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const DisplayPanelView = ({ currentCall, history, onLogout, userProfile, onBack }: { currentCall: Call | null, history: Call[], onLogout: () => void, userProfile: string, onBack?: () => void }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (currentCall) {
            const utterance = new SpeechSynthesisUtterance(`Chamando ${currentCall.ticket}, você será atendido por ${currentCall.attendant} no ${currentCall.desk}.`);
            utterance.lang = 'pt-BR';
            speechSynthesis.speak(utterance);
        }
    }, [currentCall]);

    const styles: { [key: string]: CSSProperties } = {
        container: { 
            width: '100vw', 
            height: '100vh',
            backgroundColor: '#E9ECEF',
            color: '#3D405B',
            display: 'flex', 
            flexDirection: isSmallScreen ? 'column' : 'row', 
            padding: '20px', 
            boxSizing: 'border-box',
            position: 'relative'
        },
        mainPanel: { flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', borderRight: isSmallScreen ? 'none' : '1px solid #E0E0E0', borderBottom: isSmallScreen ? '1px solid #E0E0E0' : 'none' },
        historyPanel: { flex: 1, padding: '20px', overflowY: 'auto' },
        currentCall: { flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
        ticket: { fontSize: 'clamp(3rem, 15vw, 12rem)', fontWeight: 'bold', margin: 0, color: currentCall?.isPriority ? '#F2CC8F' : '#A3B18A', lineHeight: 1.1 },
        priorityLabel: { fontSize: 'clamp(1.5rem, 5vw, 4rem)', color: '#F2CC8F', fontWeight: 'bold' },
        details: { fontSize: 'clamp(1.2rem, 4vw, 3rem)', color: '#3D405B' },
        dateTime: { textAlign: 'center' },
        time: { fontSize: 'clamp(2rem, 8vw, 6rem)', fontWeight: 'bold', margin: 0 },
        date: { fontSize: 'clamp(1rem, 3vw, 2rem)', color: '#8D99AE' },
        historyTitle: { fontSize: '2em', borderBottom: '2px solid #A3B18A', paddingBottom: '10px', marginBottom: '20px', fontWeight: 600 },
        historyList: { listStyle: 'none', padding: 0 },
        historyItem: { padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '10px', marginBottom: '10px', fontSize: '1.2em', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
        actionButton: { position: 'absolute', top: '20px', right: '20px', backgroundColor: '#8D99AE', border: 'none', borderRadius: '10px', color: 'white', padding: '10px 20px', cursor: 'pointer', zIndex: 10, fontWeight: 500 },
        backButton: { position: 'absolute', top: '20px', left: '20px', backgroundColor: '#8D99AE', border: 'none', borderRadius: '10px', color: 'white', padding: '10px 20px', cursor: 'pointer', zIndex: 10, fontWeight: 500 }
    };
    
    return (
        <div style={styles.container}>
             {userProfile === 'administrador' && onBack && (
                <button onClick={onBack} style={styles.backButton}>&larr; Voltar</button>
            )}
             {userProfile === 'painel' && (
                <button onClick={onLogout} style={styles.actionButton}>Sair</button>
            )}
            <div style={styles.mainPanel}>
                <div style={styles.currentCall}>
                    {currentCall ? (
                        <>
                            {currentCall.isPriority && <p style={styles.priorityLabel}>Prioridade</p>}
                            <p style={styles.ticket}>{currentCall.ticket}</p>
                            <p style={styles.details}>Guichê: {currentCall.desk}</p>
                            <p style={styles.details}>Atendente: {currentCall.attendant}</p>
                        </>
                    ) : (
                        <p style={{...styles.ticket, color: '#8D99AE', opacity: 0.5}}>Aguardando...</p>
                    )}
                </div>
                <div style={styles.dateTime}>
                    <p style={styles.time}>{currentTime.toLocaleTimeString('pt-BR')}</p>
                    <p style={styles.date}>{currentTime.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            <div style={styles.historyPanel}>
                <h2 style={styles.historyTitle}>Últimas Chamadas</h2>
                <ul style={styles.historyList}>
                    {history.map((call, index) => (
                        <li key={index} style={{...styles.historyItem, borderLeft: `5px solid ${call.isPriority ? '#F2CC8F' : '#A3B18A'}`}}>
                           <span style={{marginLeft: '10px'}}> {call.ticket} &rarr; {call.desk} {call.isPriority ? '★' : ''}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};