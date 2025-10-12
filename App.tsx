import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import type { AppView, Collaborator } from './types';

import { LoginView } from './components/LoginView';
import { PatientView } from './components/PatientView';
import { AttendantView } from './components/AttendantView';
import { AdminView } from './components/AdminView';
import { DisplayPanelView } from './components/DisplayPanelView';
import { DedicatedAttendantView } from './components/DedicatedAttendantView';
import { MainLayout } from './components/MainLayout';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';


export const App = () => {
    const [currentUser, setCurrentUser] = useState<Collaborator | null>(null);
    const [currentView, setCurrentView] = useState<AppView>('dashboard');
    
    const appState = useAppState();

    const handleLogin = async (user: string, pass: string): Promise<boolean> => {
        if (user === 'administrador' && pass === 'admin') {
            setCurrentUser({ id: 0, firstName: 'Admin', lastName: '', registration: 'admin', profile: 'administrador', password: 'admin' });
            setCurrentView('dashboard');
            return true;
        }
        if (user === 'painel' && pass === 'painel') {
            setCurrentUser({ id: 1, firstName: 'Painel', lastName: '', registration: 'painel', profile: 'painel', password: 'painel' });
            setCurrentView('display');
            return true;
        }

        const attendant = appState.collaborators.find(
            c => c.registration === user && c.password === pass && c.profile === 'atendente'
        );

        if (attendant) {
            setCurrentUser(attendant);
            setCurrentView('dedicated_attendant');
            return true;
        }
        
        return false;
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentView('dashboard'); // Reset view for next login
    };
    
    const handleNavigate = (view: AppView) => setCurrentView(view);

    // FIX: Removed unreachable 'patient' and 'display' cases for the admin user.
    // These views are rendered as standalone pages before MainLayout, so including them here
    // was redundant and likely causing a subtle type inference issue.
    const renderAdminContent = () => {
        switch (currentView) {
            case 'attendant':
                return <AttendantView 
                            queue={appState.queue} 
                            priorityQueue={appState.priorityQueue} 
                            onCallForDesk={appState.handleCallForDesk} 
                            desks={appState.desks} 
                            currentlyServing={appState.currentlyServing} 
                        />;
            case 'admin':
                return <AdminView 
                            desks={appState.desks} 
                            collaborators={appState.collaborators}
                            patients={appState.patients}
                            onAddDesk={appState.handleAddDesk}
                            onRemoveDesk={appState.handleRemoveDesk}
                            onAddCollaborator={appState.handleAddCollaborator}
                            onRemoveCollaborator={appState.handleRemoveCollaborator}
                            onAddPatient={appState.handleAddPatient}
                            onRemovePatient={appState.handleRemovePatient}
                        />;
            case 'dashboard':
            default:
                return <DashboardView />;
        }
    }


    if (!currentUser) {
        return <LoginView onLogin={handleLogin} />;
    }

    if (currentUser.profile === 'administrador') {
        // Standalone views for admin
        if (currentView === 'patient') {
            return <PatientView 
                        patients={appState.patients} 
                        onGenerateTicket={appState.handleGenerateTicket} 
                        onGeneratePriorityTicket={appState.handleGeneratePriorityTicket}
                        onBack={() => handleNavigate('dashboard')} 
                    />;
        }
        if (currentView === 'display') {
            return <DisplayPanelView 
                        currentCall={appState.currentCall} 
                        history={appState.callHistory} 
                        onLogout={handleLogout} 
                        userProfile={currentUser.profile} 
                        onBack={() => handleNavigate('dashboard')}
                    />;
        }

        // Default layout with sidebar for other views
        return (
            <MainLayout>
                <Sidebar onNavigate={handleNavigate} onLogout={handleLogout} activeView={currentView} />
                <main style={{flex: 1, padding: '2rem', overflowY: 'auto', boxSizing: 'border-box', height: '100vh', display: 'flex', justifyContent: 'center'}}>
                    {renderAdminContent()}
                </main>
            </MainLayout>
        );
    }
    
    if (currentUser.profile === 'atendente') {
        const attendantName = `${currentUser.firstName} ${currentUser.lastName}`;
        const desk = appState.desks.find(d => d.attendant === attendantName);
        const history = appState.callHistory.filter(c => c.attendant === attendantName);
        const currentTicketId = desk ? appState.currentlyServing[desk.name] : null;

        return <DedicatedAttendantView
            attendant={currentUser}
            desk={desk}
            queue={appState.queue}
            priorityQueue={appState.priorityQueue}
            history={history}
            onCallNext={() => desk && appState.handleCallForDesk(desk.name)}
            onLogout={handleLogout}
            currentTicketId={currentTicketId}
            ticketDetails={appState.ticketDetails}
            onAddPatient={appState.handleAddPatient}
            onFinishServing={() => desk && appState.handleFinishServing(desk.name)}
        />
    }

    // Default to panel view if logged in and not admin/attendant
    return <DisplayPanelView 
                currentCall={appState.currentCall} 
                history={appState.callHistory} 
                onLogout={handleLogout} 
                userProfile={currentUser.profile} 
            />;
};
