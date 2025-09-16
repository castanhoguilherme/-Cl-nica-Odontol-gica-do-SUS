import React, { CSSProperties } from 'react';

export const ViewWrapper = ({ children, onBack, title }: { children: React.ReactNode, onBack: () => void, title: string }) => {
    const styles: { [key: string]: CSSProperties } = {
        container: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '16px',
            boxSizing: 'border-box'
        },
        header: { position: 'absolute', top: '20px', left: '20px', zIndex: 10 },
        backButton: {
            backgroundColor: '#4a4f58',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '10px 20px',
            fontSize: '1em',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <button style={styles.backButton} onClick={onBack} aria-label={`Voltar para o início de ${title}`}>&larr; Voltar</button>
            </header>
            <main style={{width: '100%', display: 'flex', justifyContent: 'center'}}>{children}</main>
        </div>
    );
}
