import React, { forwardRef, useState, useRef } from 'react';
import { Trash2, Settings, ArrowRight } from 'lucide-react';
import { Component } from './IndexBuilder';

interface CanvasProps {
  components: Component[];
  onDrop: (position: { x: number; y: number }) => void;
  onComponentSelect: (component: Component) => void;
  onComponentUpdate: (component: Component) => void;
  onComponentDelete: (componentId: string) => void;
  onComponentConnect: (sourceId: string, targetId: string) => void;
  selectedComponent: Component | null;
  isDragging: boolean;
  componentTypes: any[];
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({
  components,
  onDrop,
  onComponentSelect,
  onComponentUpdate,
  onComponentDelete,
  onComponentConnect,
  selectedComponent,
  isDragging,
  componentTypes
}, ref) => {
  const [draggedComponentPos, setDraggedComponentPos] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [tempConnection, setTempConnection] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left - 100, // Center the component
        y: e.clientY - rect.top - 40
      };
      onDrop(position);
    }
  };

  const handleComponentDrag = (componentId: string, position: { x: number; y: number }) => {
    const updatedComponent = components.find(c => c.id === componentId);
    if (updatedComponent) {
      onComponentUpdate({
        ...updatedComponent,
        position
      });
    }
  };

  const handleConnectionStart = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConnecting(true);
    setConnectionStart(componentId);
  };

  const handleConnectionEnd = (targetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting && connectionStart && connectionStart !== targetId) {
      onComponentConnect(connectionStart, targetId);
    }
    setIsConnecting(false);
    setConnectionStart(null);
    setTempConnection(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isConnecting && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setTempConnection({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleCanvasClick = () => {
    if (isConnecting) {
      setIsConnecting(false);
      setConnectionStart(null);
      setTempConnection(null);
    }
  };
  const getComponentColor = (type: string) => {
    const componentType = componentTypes.find(ct => ct.type === type);
    return componentType?.color || 'bg-gray-100 border-gray-300 text-gray-700';
  };

  return (
    <div className="h-full relative bg-gray-50 overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative h-full w-full"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
      >
        {/* Drop Zone Indicator */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-blue-600 mb-2">
                <Settings className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-blue-700 font-medium">Drop component here</p>
              <p className="text-blue-600 text-sm">Position it anywhere on the canvas</p>
            </div>
          </div>
        )}

        {/* Connection Mode Indicator */}
        {isConnecting && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <p className="text-sm font-medium">Connection Mode Active</p>
            <p className="text-xs opacity-90">Click on a target component to connect</p>
          </div>
        )}
        {/* Components */}
        {components.map((component) => (
          <CanvasComponent
            key={component.id}
            component={component}
            isSelected={selectedComponent?.id === component.id}
            isConnecting={isConnecting}
            isConnectionSource={connectionStart === component.id}
            color={getComponentColor(component.type)}
            onSelect={() => onComponentSelect(component)}
            onDelete={() => onComponentDelete(component.id)}
            onDrag={(position) => handleComponentDrag(component.id, position)}
            onConnectionStart={(e) => handleConnectionStart(component.id, e)}
            onConnectionEnd={(e) => handleConnectionEnd(component.id, e)}
          />
        ))}

        {/* Connections */}
        <svg className="absolute inset-0 pointer-events-none z-20" style={{ width: '100%', height: '100%' }}>
          {components.map((component) =>
            component.connections.map((targetId) => {
              const target = components.find(c => c.id === targetId);
              if (!target) return null;
              
              const startX = component.position.x + 100;
              const startY = component.position.y + 40;
              const endX = target.position.x;
              const endY = target.position.y + 40;
              
              return (
                <g key={`${component.id}-${targetId}`}>
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    className="drop-shadow-sm"
                  />
                </g>
              );
            })
          )}
          
          {/* Temporary connection line while connecting */}
          {isConnecting && connectionStart && tempConnection && (
            (() => {
              const sourceComponent = components.find(c => c.id === connectionStart);
              if (!sourceComponent) return null;
              
              const startX = sourceComponent.position.x + 192;
              const startY = sourceComponent.position.y + 40;
              
              return (
                <line
                  x1={startX}
                  y1={startY}
                  x2={tempConnection.x}
                  y2={tempConnection.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead-blue)"
                  className="opacity-70"
                />
              );
            })()
          )}
          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6b7280"
              />
            </marker>
            <marker
              id="arrowhead-blue"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#3b82f6"
              />
            </marker>
          </defs>
        </svg>

        {/* Empty State */}
        {components.length === 0 && !isDragging && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Index</h3>
              <p className="text-gray-500 mb-6">
                Drag components from the left panel to create your automation workflow. 
                Connect them to define the data flow.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <ArrowRight className="w-4 h-4" />
                <span>Drag a component to begin</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

interface CanvasComponentProps {
  component: Component;
  isSelected: boolean;
  isConnecting: boolean;
  isConnectionSource: boolean;
  color: string;
  onSelect: () => void;
  onDelete: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  onConnectionStart: (e: React.MouseEvent) => void;
  onConnectionEnd: (e: React.MouseEvent) => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  isConnecting,
  isConnectionSource,
  color,
  onSelect,
  onDelete,
  onDrag,
  onConnectionStart,
  onConnectionEnd
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isConnecting && (e.target === e.currentTarget || (e.target as HTMLElement).closest('.component-body'))) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      onSelect();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const canvas = document.querySelector('[data-canvas]') as HTMLElement;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        onDrag({
          x: e.clientX - rect.left - dragOffset.x,
          y: e.clientY - rect.top - dragOffset.y
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleComponentClick = (e: React.MouseEvent) => {
    if (isConnecting) {
      onConnectionEnd(e);
    }
  };
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      data-canvas
      className={`absolute cursor-move select-none transition-all duration-200 ${
        isSelected ? 'z-30 scale-105' : 'z-20'
      } ${isDragging ? 'z-40' : ''} ${
        isConnecting ? 'cursor-crosshair' : 'cursor-move'
      } ${
        isConnectionSource ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: component.position.x,
        top: component.position.y,
        transform: isDragging ? 'scale(1.1)' : undefined
      }}
      onMouseDown={handleMouseDown}
      onClick={handleComponentClick}
    >
      <div className={`
        relative w-48 p-4 rounded-lg border-2 shadow-lg component-body
        ${color}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isDragging ? 'shadow-2xl' : 'hover:shadow-xl'}
        ${isConnecting && !isConnectionSource ? 'hover:ring-2 hover:ring-green-400 hover:ring-offset-2' : ''}
        transition-all duration-200
      `}>
        {/* Component Icon and Label */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex-shrink-0">
            {component.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">
              {component.label}
            </h3>
          </div>
        </div>

        {/* Component Actions */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Connection Points */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 cursor-pointer"
          title="Input connection point"
        >
          <div className={`w-4 h-4 bg-white border-2 rounded-full transition-colors ${
            isConnecting ? 'border-green-400 hover:bg-green-50' : 'border-gray-400'
          }`}></div>
        </div>
        <div 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 cursor-pointer"
          onClick={onConnectionStart}
          title="Output connection point - click to start connecting"
        >
          <div className={`w-4 h-4 bg-white border-2 rounded-full transition-colors ${
            isConnectionSource ? 'border-blue-500 bg-blue-50' : 
            'border-gray-400 hover:border-blue-400 hover:bg-blue-50'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;