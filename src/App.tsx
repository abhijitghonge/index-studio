import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Dashboard from './components/Dashboard';
import IndexBuilder from './components/IndexBuilder';
import SLADashboard from './components/SLADashboard';

export type ViewType = 'dashboard' | 'studio' | 'sla';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [selectedIndexName, setSelectedIndexName] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCreateNew = () => {
    setSelectedIndex(null);
    setCurrentView('studio');
  };

  const handleEditIndex = (indexId: string) => {
    // Get index name for the selected index
    const indexNames: Record<string, string> = {
      '1': 'iEdge APAC Financials Dividend Plus Index',
      '2': 'SGX S&P Asia 50 Index',
      '3': 'SGX FTSE China A50 Index',
      '4': 'MSCI Singapore Free Index',
      '5': 'Straits Times Index',
      '6': 'SGX iEdge S-REIT Leaders Index'
    };
    
    setSelectedIndex(indexId);
    setSelectedIndexName(indexNames[indexId] || 'Unknown Index');
    setCurrentView('studio');
  };

  const handleViewSLA = (indexId: string) => {
    setSelectedIndex(indexId);
    setCurrentView('sla');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedIndex(null);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onCreateNew={handleCreateNew}
            onEditIndex={handleEditIndex}
            onViewSLA={handleViewSLA}
          />
        );
      case 'studio':
        return (
          <IndexBuilder 
            indexId={selectedIndex}
            onBack={handleBackToDashboard}
            onCreateNew={handleCreateNew}
          />
        );
      case 'sla':
        return <SLADashboard />;
      default:
        return (
          <Dashboard 
            onCreateNew={handleCreateNew}
            onEditIndex={handleEditIndex}
            onViewSLA={handleViewSLA}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <TopNavbar />
        <main className="flex-1">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;