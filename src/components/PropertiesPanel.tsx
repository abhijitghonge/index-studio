import React from 'react';
import { Settings, Database, Calculator, Shield, FileOutput, GitBranch, Save } from 'lucide-react';
import { Component } from './IndexBuilder';

interface PropertiesPanelProps {
  selectedComponent: Component | null;
  onUpdate: (component: Component) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedComponent, onUpdate }) => {
  const handlePropertyChange = (key: string, value: any) => {
    if (selectedComponent) {
      const updatedComponent = {
        ...selectedComponent,
        properties: {
          ...selectedComponent.properties,
          [key]: value
        }
      };
      onUpdate(updatedComponent);
    }
  };

  const renderPropertyFields = () => {
    if (!selectedComponent) return null;

    switch (selectedComponent.type) {
      case 'datasource':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Source Type
              </label>
              <select
                value={selectedComponent.properties.sourceType || ''}
                onChange={(e) => handlePropertyChange('sourceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type...</option>
                <option value="database">Database</option>
                <option value="api">REST API</option>
                <option value="file">File Upload</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connection String
              </label>
              <input
                type="text"
                value={selectedComponent.properties.connectionString || ''}
                onChange={(e) => handlePropertyChange('connectionString', e.target.value)}
                placeholder="Enter connection details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Query/Endpoint
              </label>
              <textarea
                value={selectedComponent.properties.query || ''}
                onChange={(e) => handlePropertyChange('query', e.target.value)}
                rows={3}
                placeholder="Enter SQL query or API endpoint..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      case 'calculation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Type
              </label>
              <select
                value={selectedComponent.properties.calculationType || ''}
                onChange={(e) => handlePropertyChange('calculationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select calculation...</option>
                <option value="sum">Sum</option>
                <option value="average">Average</option>
                <option value="count">Count</option>
                <option value="custom">Custom Formula</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formula
              </label>
              <textarea
                value={selectedComponent.properties.formula || ''}
                onChange={(e) => handlePropertyChange('formula', e.target.value)}
                rows={3}
                placeholder="Enter calculation formula..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Field Name
              </label>
              <input
                type="text"
                value={selectedComponent.properties.outputField || ''}
                onChange={(e) => handlePropertyChange('outputField', e.target.value)}
                placeholder="result"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'validation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validation Rules
              </label>
              <div className="space-y-2">
                {['required', 'dataType', 'range', 'custom'].map((rule) => (
                  <label key={rule} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedComponent.properties.rules?.includes(rule) || false}
                      onChange={(e) => {
                        const currentRules = selectedComponent.properties.rules || [];
                        const newRules = e.target.checked
                          ? [...currentRules, rule]
                          : currentRules.filter((r: string) => r !== rule);
                        handlePropertyChange('rules', newRules);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">{rule} Check</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Error Handling
              </label>
              <select
                value={selectedComponent.properties.errorHandling || ''}
                onChange={(e) => handlePropertyChange('errorHandling', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select handling...</option>
                <option value="stop">Stop on Error</option>
                <option value="skip">Skip Invalid Records</option>
                <option value="log">Log and Continue</option>
              </select>
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition Expression
              </label>
              <textarea
                value={selectedComponent.properties.condition || ''}
                onChange={(e) => handlePropertyChange('condition', e.target.value)}
                rows={3}
                placeholder="e.g., value > 100 AND status = 'active'"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                True Path Action
              </label>
              <input
                type="text"
                value={selectedComponent.properties.trueAction || ''}
                onChange={(e) => handlePropertyChange('trueAction', e.target.value)}
                placeholder="Action when condition is true"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                False Path Action
              </label>
              <input
                type="text"
                value={selectedComponent.properties.falseAction || ''}
                onChange={(e) => handlePropertyChange('falseAction', e.target.value)}
                placeholder="Action when condition is false"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'output':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Type
              </label>
              <select
                value={selectedComponent.properties.outputType || ''}
                onChange={(e) => handlePropertyChange('outputType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select output...</option>
                <option value="database">Database Table</option>
                <option value="file">File Export</option>
                <option value="api">API Endpoint</option>
                <option value="dashboard">Dashboard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={selectedComponent.properties.destination || ''}
                onChange={(e) => handlePropertyChange('destination', e.target.value)}
                placeholder="Output destination..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format Options
              </label>
              <textarea
                value={selectedComponent.properties.formatOptions || ''}
                onChange={(e) => handlePropertyChange('formatOptions', e.target.value)}
                rows={3}
                placeholder="JSON configuration for output format..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500">
            <p>Select component type to see configuration options</p>
          </div>
        );
    }
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'datasource': return <Database className="w-5 h-5" />;
      case 'calculation': return <Calculator className="w-5 h-5" />;
      case 'validation': return <Shield className="w-5 h-5" />;
      case 'condition': return <GitBranch className="w-5 h-5" />;
      case 'output': return <FileOutput className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        </div>
        <p className="text-sm text-gray-500">
          Configure the selected component
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedComponent ? (
          <div className="p-6">
            {/* Component Header */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                  {getComponentIcon(selectedComponent.type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedComponent.label}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {selectedComponent.type} component
                  </p>
                </div>
              </div>
            </div>

            {/* General Properties */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">General</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Component Name
                  </label>
                  <input
                    type="text"
                    value={selectedComponent.label}
                    onChange={(e) => {
                      const updatedComponent = {
                        ...selectedComponent,
                        label: e.target.value
                      };
                      onUpdate(updatedComponent);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={selectedComponent.properties.description || ''}
                    onChange={(e) => handlePropertyChange('description', e.target.value)}
                    rows={2}
                    placeholder="Component description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Type-specific Properties */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Configuration</h4>
              {renderPropertyFields()}
            </div>

            {/* Advanced Options */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Advanced</h4>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedComponent.properties.enabled !== false}
                    onChange={(e) => handlePropertyChange('enabled', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedComponent.properties.logOutput || false}
                    onChange={(e) => handlePropertyChange('logOutput', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Log Output</span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Component Selected</h3>
              <p className="text-gray-500 text-sm">
                Click on a component in the canvas to configure its properties
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;