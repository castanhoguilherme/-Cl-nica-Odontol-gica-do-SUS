import React, { CSSProperties } from 'react';

export const DashboardView = () => {

    const styles: { [key: string]: CSSProperties } = {
        container: {
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            padding: '40px 50px',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '800px',
            alignSelf: 'center'
        },
        title: { 
            color: '#A3B18A', 
            marginBottom: '20px', 
            fontSize: '2.5em',
            fontWeight: 600
        },
        subtitle: {
            fontSize: '1.2em',
            color: '#3D405B',
            lineHeight: 1.6
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Bem-vindo ao Sistema de Atendimento</h1>
            <p style={styles.subtitle}>
                Utilize o menu lateral para navegar entre as seções e gerenciar o sistema.
            </p>
        </div>
    );
};