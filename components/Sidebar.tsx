import React, { useState, CSSProperties } from 'react';
import { AppView } from '../types';
import { DashboardIcon, PatientIcon, AttendantIcon, AdminIcon, DisplayIcon, LogoutIcon } from './icons';

interface SidebarProps {
    onNavigate: (view: AppView) => void;
    onLogout: () => void;
    activeView: AppView;
}

export const Sidebar = ({ onNavigate, onLogout, activeView }: SidebarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const navItems = [
        { view: 'dashboard' as const, label: 'Dashboard', icon: <DashboardIcon /> },
        { view: 'patient' as const, label: 'Paciente', icon: <PatientIcon /> },
        { view: 'attendant' as const, label: 'Atendimento', icon: <AttendantIcon /> },
        { view: 'admin' as const, label: 'Administração', icon: <AdminIcon /> },
        { view: 'display' as const, label: 'Painel', icon: <DisplayIcon /> },
    ];

    const styles: { [key: string]: CSSProperties } = {
        sidebar: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            color: '#3D405B',
            height: '100vh',
            width: isExpanded ? '250px' : '80px',
            transition: 'width 0.3s ease',
            padding: '20px 0',
            boxSizing: 'border-box',
            flexShrink: 0,
            boxShadow: '4px 0px 15px rgba(0, 0, 0, 0.05)',
        },
        logo: {
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#A3B18A',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        },
        nav: {
            flexGrow: 1,
        },
        navItem: {
            display: 'flex',
            alignItems: 'center',
            padding: '15px 25px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            textDecoration: 'none',
            color: '#3D405B',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            borderRadius: '0 50px 50px 0',
            marginRight: '10px'
        },
        navItemActive: {
            backgroundColor: '#F0EBE3',
            color: '#A3B18A',
            fontWeight: 600,
            borderLeft: '4px solid #A3B18A',
            paddingLeft: '21px'
        },
        icon: {
            marginRight: isExpanded ? '20px' : '0',
            minWidth: '30px',
            transition: 'margin-right 0.3s ease',
        },
        label: {
            opacity: isExpanded ? 1 : 0,
            transition: 'opacity 0.2s ease 0.1s',
            fontWeight: 500,
        },
        logoutButton: {
            marginTop: 'auto',
        }
    };

    return (
        <aside 
            style={styles.sidebar}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div style={styles.logo}>
                {isExpanded ? 'Sistema' : 'S'}
            </div>
            <nav style={styles.nav}>
                {navItems.map(item => (
                    <div 
                        key={item.view} 
                        style={{...styles.navItem, ...(activeView === item.view && styles.navItemActive)}} 
                        onClick={() => onNavigate(item.view)}
                        role="button"
                        aria-label={item.label}
                    >
                        <span style={styles.icon}>{item.icon}</span>
                        <span style={styles.label}>{item.label}</span>
                    </div>
                ))}
            </nav>
            <div style={{...styles.navItem, ...styles.logoutButton}} onClick={onLogout} role="button" aria-label="Sair do sistema">
                <span style={styles.icon}><LogoutIcon /></span>
                <span style={styles.label}>Sair</span>
            </div>
        </aside>
    );
};