import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface ComponentType {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface ComponentLibraryProps {
  componentTypes: ComponentType[];
  onDragStart: (componentType: ComponentType) => void;
  onCreateNew?: () => void;
  isEditMode?: boolean;
  indexName?: string;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ 
  componentTypes, 
  onDragStart, 
  onCreateNew,
  isEditMode = false,
  indexName
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Create New Index Section */}
      <div className="p-6 border-b border-gray-200">
        {isEditMode ? (
          <div className="mb-4">
            <div className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md mb-2">
              <span className="text-lg">✏️</span>
              <span>Edit Index</span>
            </div>
            <p className="text-sm text-gray-600 text-center font-medium">
              {indexName}
            </p>
          </div>
        ) : (
          <button
            onClick={onCreateNew}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-4"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Index</span>
          </button>
        )}
        
        {/* Divider */}
        <div className="border-t border-gray-300 my-4"></div>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Components</h2>
        <p className="text-sm text-gray-500">
          Drag components to the canvas to build your automation workflow
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {componentTypes.map((component) => (
          <div
            key={component.type}
            draggable
            onDragStart={() => onDragStart(component)}
            className="group cursor-grab active:cursor-grabbing"
          >
            <div className={`p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${component.color}`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {component.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1">
                    {component.label}
                  </h3>
                  <p className="text-xs opacity-75 leading-relaxed">
                    {component.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">Quick Tips:</p>
          <ul className="space-y-0.5 ml-2">
            <li>• Drag components to canvas</li>
            <li>• Click to select and configure</li>
            <li>• Click output point to connect</li>
            <li>• Build workflow left to right</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;