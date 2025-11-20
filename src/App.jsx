import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import KanbanBoard from './components/kanban/KanbanBoard';
import FocusMode from './components/focus/FocusMode';
import ListView from './components/list/ListView';
import Settings from './components/settings/Settings';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'list':
        return <ListView />;
      case 'kanban':
        return <KanbanBoard />;
      case 'focus':
        return <FocusMode />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-space-800 text-white border border-holo-500/50',
          style: {
            background: '#0a1525',
            color: '#fff',
            border: '1px solid rgba(0, 217, 255, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#00d9ff',
              secondary: '#0a1525',
            },
          },
        }}
      />
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </>
  );
}

export default App;
