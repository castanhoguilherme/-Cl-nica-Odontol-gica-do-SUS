import React, { CSSProperties } from 'react';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const styles: { [key: string]: CSSProperties } = {
        layout: {
            display: 'flex',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#E9ECEF',
        }
    };

    return (
        <div style={styles.layout}>
            {children}
        </div>
    );
};