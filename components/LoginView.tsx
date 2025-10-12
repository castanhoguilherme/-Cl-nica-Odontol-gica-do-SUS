import React, { useState, CSSProperties } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const LoginView = ({ onLogin }: { onLogin: (user: string, pass: string) => Promise<boolean> }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await onLogin(username, password);
        if (!success) {
            setError('Usuário ou senha inválidos.');
        }
    };

    const styles: { [key: string]: CSSProperties } = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            padding: isSmallScreen ? '30px' : '40px 50px',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            width: '90%',
            maxWidth: '400px'
        },
        title: {
            color: '#3D405B',
            fontSize: isSmallScreen ? '2em' : '2.5em',
            marginBottom: '10px',
            fontWeight: 600
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
        },
        input: {
            padding: '14px',
            fontSize: '1em',
            backgroundColor: '#FDFCFB',
            border: '1px solid #E0E0E0',
            borderRadius: '10px',
            color: '#3D405B',
        },
        button: {
            border: 'none',
            borderRadius: '10px',
            padding: '15px',
            fontSize: '1.1em',
            cursor: 'pointer',
            fontWeight: 600,
            backgroundColor: '#A3B18A',
            color: '#FFFFFF',
            transition: 'background-color 0.3s ease',
        },
        error: {
            color: '#E07A5F',
            minHeight: '20px',
            margin: 0,
        },
        hint: {
            color: '#8D99AE',
            fontSize: '0.85em',
            marginTop: '5px'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Matrícula / Usuário"
                    style={styles.input}
                    aria-label="Matrícula ou nome de usuário"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    style={styles.input}
                    aria-label="Senha"
                />
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Entrar</button>
            </form>
            <p style={styles.hint}>
                Dica: Use 'administrador' e 'admin' para acesso administrativo.
            </p>
        </div>
    );
};
