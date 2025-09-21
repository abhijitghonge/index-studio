import React, { useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Clock, Target, ArrowLeft, Filter, Calendar, Search } from 'lucide-react';

interface StepData {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'pending' | 'running';
  duration: number;
  timestamp: string;
  errorMessage?: string;
}

interface IndexDetails {
  id: string;
  name: string;
  steps: StepData[];
  totalDuration: number;
  slaTarget: number;
  slaStatus: 'met' | 'breached' | 'at-risk';
  lastRun: string;
}

const SLADashboard: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [errorTypeFilter, setErrorTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sampleIndexDetails: IndexDetails = {
    id: '1',
    name: 'iEdge APAC Financials Dividend Plus Index',
    totalDuration: 45,
    slaTarget: 60,
    slaStatus: 'met',
    lastRun: '2024-01-15 14:30:00',
    steps: [
      {
        id: 'step1',
        name: 'Data Source Connection',
        status: 'success',
        duration: 5,
        timestamp: '14:30:00'
      },
      {
        id: 'step2',
        name: 'Market Data Validation',
        status: 'success',
        duration: 8,
        timestamp: '14:30:05'
      },
      {
        id: 'step3',
        name: 'Dividend Calculation',
        status: 'failed',
        duration: 12,
        timestamp: '14:30:13',
        errorMessage: 'Missing dividend data for HSBC Holdings'
      },
      {
        id: 'step4',
        name: 'Index Weight Calculation',
        status: 'pending',
        duration: 0,
        timestamp: '14:30:25'
      },
      {
        id: 'step5',
        name: 'Final Index Value',
        status: 'pending',
        duration: 0,
        timestamp: '14:30:25'
      },
      {
        id: 'step6',
        name: 'Data Output',
        status: 'pending',
        duration: 0,
        timestamp: '14:30:25'
      }
    ]
  };

  const overallStats = {
    overallSLA: 94.2,
    totalCompleted: 156,
    totalFailed: 12,
    totalInProgress: 8
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500 border-green-600 text-white';
      case 'failed':
        return 'bg-red-500 border-red-600 text-white';
      case 'pending':
        return 'bg-yellow-400 border-yellow-500 text-gray-900';
      case 'running':
        return 'bg-blue-500 border-blue-600 text-white';
      default:
        return 'bg-gray-300 border-gray-400 text-gray-700';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'met':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'breached':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'at-risk':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (selectedIndex) {
    const indexDetails = sampleIndexDetails;
    const completedSteps = indexDetails.steps.filter(s => s.status === 'success').length;
    const failedSteps = indexDetails.steps.filter(s => s.status === 'failed').length;
    const slaBreachTime = Math.max(0, indexDetails.totalDuration - indexDetails.slaTarget);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{indexDetails.name}</h1>
                  <p className="text-gray-500">Step-by-step execution flow</p>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
                
                <select
                  value={errorTypeFilter}
                  onChange={(e) => setErrorTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Errors</option>
                  <option value="data">Data Errors</option>
                  <option value="calculation">Calculation Errors</option>
                  <option value="connection">Connection Errors</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SLA Status Summary */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="grid grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Steps</p>
                  <p className="text-xl font-semibold text-gray-900">{indexDetails.steps.length}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Failed Steps</p>
                  <p className="text-xl font-semibold text-gray-900">{failedSteps}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Run</p>
                  <p className="text-xl font-semibold text-gray-900">{indexDetails.lastRun}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-2 rounded-lg border text-sm font-medium ${getSLAStatusColor(indexDetails.slaStatus)}`}>
                  {indexDetails.slaStatus === 'met' && 'SLA Met'}
                  {indexDetails.slaStatus === 'breached' && `SLA Breached (+${slaBreachTime}min)`}
                  {indexDetails.slaStatus === 'at-risk' && 'SLA At Risk'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Flow Visualization */}
        <div className="px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Execution Flow</h2>
            
            <div className="relative">
              {/* Steps */}
              <div className="flex items-center space-x-8 overflow-x-auto pb-4">
                {indexDetails.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4 flex-shrink-0">
                    {/* Step Node */}
                    <div className="relative">
                      <div className={`
                        w-48 p-4 rounded-lg border-2 shadow-sm transition-all duration-200
                        ${getStepStatusColor(step.status)}
                      `}>
                        <div className="flex items-center space-x-3 mb-2">
                          {getStepIcon(step.status)}
                          <span className="font-medium text-sm">{step.name}</span>
                        </div>
                        
                        <div className="text-xs opacity-90">
                          <p>Duration: {step.duration}min</p>
                          <p>Time: {step.timestamp}</p>
                        </div>
                        
                        {step.errorMessage && (
                          <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                            {step.errorMessage}
                          </div>
                        )}
                      </div>
                      
                      {/* Step Number */}
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    {index < indexDetails.steps.length - 1 && (
                      <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {completedSteps}/{indexDetails.steps.length} steps completed</span>
                <span>{Math.round((completedSteps / indexDetails.steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps / indexDetails.steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SLA Dashboard</h1>
                <p className="text-gray-500">Monitor service level agreements and performance metrics</p>
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search indices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Overall SLA</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.overallSLA}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+0.3% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Completed</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Indices this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Failed</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalFailed}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600">Requires attention</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalInProgress}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-yellow-600">Currently running</span>
            </div>
          </div>
        </div>

        {/* Index List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Index Performance</h2>
            <p className="text-sm text-gray-500 mt-1">Click on an index to view detailed step flow</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'iEdge APAC Financials Dividend Plus Index', status: 'running', sla: 98.5 },
                { name: 'SGX S&P Asia 50 Index', status: 'completed', sla: 99.2 },
                { name: 'SGX FTSE China A50 Index', status: 'failed', sla: 94.1 },
                { name: 'MSCI Singapore Free Index', status: 'completed', sla: 99.8 },
                { name: 'Straits Times Index', status: 'running', sla: 97.3 }
              ].map((index, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedIndex('1')}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      index.status === 'completed' ? 'bg-green-500' :
                      index.status === 'running' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{index.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{index.status}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{index.sla}%</p>
                    <p className="text-sm text-gray-500">SLA Performance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLADashboard;