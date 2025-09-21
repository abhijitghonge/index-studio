import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Play, X, Plus, Database, Calculator, Shield, FileOutput, GitBranch } from 'lucide-react';
import ComponentLibrary from './ComponentLibrary';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';

interface IndexBuilderProps {
  indexId: string | null;
  onBack: () => void;
  onCreateNew: () => void;
  indexName?: string;
}

export interface Component {
  id: string;
  type: 'datasource' | 'calculation' | 'validation' | 'output' | 'condition';
  label: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  properties: Record<string, any>;
  connections: string[];
}

const IndexBuilder: React.FC<IndexBuilderProps> = ({ indexId, onBack, onCreateNew, indexName }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const componentTypes = [
    {
      type: 'datasource',
      label: 'Data Source',
      icon: <Database className="w-5 h-5" />,
      color: 'bg-blue-100 border-blue-300 text-blue-700',
      description: 'Connect to external data sources'
    },
    {
      type: 'calculation',
      label: 'Calculation Step',
      icon: <Calculator className="w-5 h-5" />,
      color: 'bg-purple-100 border-purple-300 text-purple-700',
      description: 'Perform mathematical operations'
    },
    {
      type: 'validation',
      label: 'Validation',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-green-100 border-green-300 text-green-700',
      description: 'Validate data quality and rules'
    },
    {
      type: 'condition',
      label: 'Conditional Logic',
      icon: <GitBranch className="w-5 h-5" />,
      color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
      description: 'Add branching logic to workflow'
    },
    {
      type: 'output',
      label: 'Output',
      icon: <FileOutput className="w-5 h-5" />,
      color: 'bg-red-100 border-red-300 text-red-700',
      description: 'Define output destination'
    }
  ];

  const handleDragStart = (componentType: any) => {
    setDraggedComponent(componentType);
    setIsDragging(true);
  };

  const handleDrop = (position: { x: number; y: number }) => {
    if (draggedComponent) {
      const newComponent: Component = {
        id: `${draggedComponent.type}_${Date.now()}`,
        type: draggedComponent.type,
        label: draggedComponent.label,
        icon: draggedComponent.icon,
        position,
        properties: {},
        connections: []
      };
      
      setComponents(prev => [...prev, newComponent]);
      setDraggedComponent(null);
      setIsDragging(false);
    }
  };

  const handleComponentSelect = (component: Component) => {
    setSelectedComponent(component);
  };

  const handleComponentUpdate = (updatedComponent: Component) => {
    setComponents(prev =>
      prev.map(comp =>
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    );
    setSelectedComponent(updatedComponent);
  };

  const handleComponentDelete = (componentId: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  };

  const handleComponentConnect = (sourceId: string, targetId: string) => {
    setComponents(prev =>
      prev.map(comp => {
        if (comp.id === sourceId) {
          // Add connection if it doesn't already exist
          const connections = comp.connections.includes(targetId) 
            ? comp.connections 
            : [...comp.connections, targetId];
          return { ...comp, connections };
        }
        return comp;
      })
    );
  };
  const handleSave = () => {
    // Implement save functionality
    console.log('Saving index...', components);
  };

  const handleRun = () => {
    // Implement run functionality
    console.log('Running index...', components);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {indexId ? `Edit Index: ${indexName}` : 'Create New Index'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {indexId 
                  ? 'Modify your automation workflow by updating components and connections'
                  : 'Design your automation workflow by dragging components to the canvas and connecting them'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleRun}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Run
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Component Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <ComponentLibrary
            componentTypes={componentTypes}
            onDragStart={handleDragStart}
            onCreateNew={!indexId ? onCreateNew : undefined}
            isEditMode={!!indexId}
            indexName={indexName}
          />
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <Canvas
            ref={canvasRef}
            components={components}
            onDrop={handleDrop}
            onComponentSelect={handleComponentSelect}
            onComponentUpdate={handleComponentUpdate}
            onComponentDelete={handleComponentDelete}
            onComponentConnect={handleComponentConnect}
            selectedComponent={selectedComponent}
            isDragging={isDragging}
            componentTypes={componentTypes}
          />
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onUpdate={handleComponentUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default IndexBuilder;