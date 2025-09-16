import React, { CSSProperties } from 'react';
import type { Desk } from '../types';

export const AttendantView = ({ queue, priorityQueue, onCallForDesk, desks, currentlyServing }: { queue: (number | string)[], priorityQueue: (number | string)[], onCallForDesk: (deskName: string) => void, desks: Desk[], currentlyServing: { [key: string]: string | null } }) => {
    const hasTickets = queue.length > 0 || priorityQueue.length > 0;
    const styles: { [key: string]: CSSProperties } = {
        container: { 
            textAlign: 'center', 
            backgroundColor: '#FFFFFF', 
            padding: '30px 40px', 
            borderRadius: '16px', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            width: '100%', 
            maxWidth: '700px' 
        },
        title: { color: '#A3B18A', marginBottom: '20px', fontSize: '2em', fontWeight: 600 },
        queueContainer: { marginBottom: '20px', padding: '15px', backgroundColor: '#F7F7F7', borderRadius: '12px' },
        queueInfo: { fontSize: '1em', color: '#8D99AE', minHeight: '20px', wordBreak: 'break-all' },
        priorityQueueInfo: { color: '#F2CC8F', fontWeight: 'bold' },
        deskList: { listStyle: 'none', padding: 0, margin: 0, maxHeight: '50vh', overflowY: 'auto' },
        deskItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#F7F7F7', borderRadius: '12px', marginBottom: '10px', },
        deskInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' },
        deskName: { fontSize: '1.2em', fontWeight: 'bold', color: '#3D405B' },
        attendantName: { fontSize: '0.9em', color: '#8D99AE' },
        deskTicket: { fontSize: '1em', color: '#A3B18A', fontWeight: 500 },
        callButton: { backgroundColor: '#A3B18A', border: 'none', borderRadius: '10px', color: '#FFFFFF', padding: '10px 20px', fontSize: '1em', cursor: hasTickets ? 'pointer' : 'not-allowed', fontWeight: 'bold', transition: 'background-color 0.3s ease, transform 0.1s ease', opacity: hasTickets ? 1 : 0.5, },
        noDesksMessage: { color: '#8D99AE', marginTop: '20px' }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Área de Atendimento</h1>
            <div style={styles.queueContainer}>
                <div style={{...styles.queueInfo, ...styles.priorityQueueInfo}}>Fila Prioritária: {priorityQueue.length > 0 ? priorityQueue.join(', ') : 'Nenhuma'}</div>
                <div style={styles.queueInfo}>Fila Normal: {queue.length > 0 ? queue.join(', ') : 'Nenhuma'}</div>
            </div>
            <ul style={styles.deskList}>
                {desks.length > 0 ? desks.map(desk => (
                    <li key={desk.name} style={styles.deskItem}>
                        <div style={styles.deskInfo}>
                            <span style={styles.deskName}>{desk.name}</span>
                            <span style={styles.attendantName}>{desk.attendant}</span>
                            <span style={styles.deskTicket}>Atendendo: {currentlyServing[desk.name] ?? '--'}</span>
                        </div>
                        <button style={styles.callButton} onClick={() => onCallForDesk(desk.name)} disabled={!hasTickets}>Chamar</button>
                    </li>
                )) : <p style={styles.noDesksMessage}>Nenhum guichê cadastrado.</p>}
            </ul>
        </div>
    );
};