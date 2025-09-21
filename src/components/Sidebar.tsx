import React from 'react';
import { BarChart3, Wrench, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  collapsed, 
  onToggleCollapse 
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ViewType,
      label: 'Index Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'View and manage all indices'
    },
    {
      id: 'studio' as ViewType,
      label: 'Index Studio',
      icon: <Wrench className="w-5 h-5" />,
      description: 'Build and configure indices'
    },
    {
      id: 'sla' as ViewType,
      label: 'SLA Dashboard',
      icon: <Shield className="w-5 h-5" />,
      description: 'Monitor service level agreements'
    }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-50 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Index Studio</span>
          </div>
        )}
        
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`flex-shrink-0 ${
                  currentView === item.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {item.icon}
                </div>
                
                {!collapsed && (
                  <div className="ml-3 flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p className="font-medium">Index Automation Studio</p>
            <p className="mt-1">v2.1.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;