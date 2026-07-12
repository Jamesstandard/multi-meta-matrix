'use client';

import React, { useState } from 'react';
import { Wrench, AlertCircle, CheckCircle, Code, Search, Download, Pause, Play, Clock, Zap, Filter } from '@/lib/icons';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function InspectView() {
  const [activeTab, setActiveTab] = useState<'logs' | 'performance' | 'state' | 'agents'>('logs');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'debug'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const logs = [
    {
      id: 1,
      level: 'info' as const,
      message: 'Agent initialized: CrewAI with 3 agents',
      timestamp: Date.now() - 60000,
      details: 'Framework: CrewAI, Agents: 3, Status: Active',
    },
    {
      id: 2,
      level: 'info' as const,
      message: 'Chat conversation created',
      timestamp: Date.now() - 50000,
      details: 'Conversation ID: conv-1234, Framework: crewai',
    },
    {
      id: 3,
      level: 'debug' as const,
      message: 'Message sent to agent: "What is 2+2?"',
      timestamp: Date.now() - 40000,
      details: 'Agent: Researcher, Response Time: 245ms',
    },
    {
      id: 4,
      level: 'info' as const,
      message: 'Agent response received: "The answer is 4"',
      timestamp: Date.now() - 30000,
      details: 'Processing: Completed, Confidence: 100%',
    },
    {
      id: 5,
      level: 'warning' as const,
      message: 'High API response time detected: 1250ms',
      timestamp: Date.now() - 20000,
      details: 'Service: OpenAI, Expected: <1000ms',
    },
  ];

  const agents = [
    {
      id: 'agent-1',
      name: 'Researcher',
      framework: 'crewai',
      status: 'active' as const,
      tasksCompleted: 12,
      lastActivity: Date.now() - 5000,
    },
    {
      id: 'agent-2',
      name: 'Analyst',
      framework: 'crewai',
      status: 'idle' as const,
      tasksCompleted: 8,
      lastActivity: Date.now() - 30000,
    },
    {
      id: 'agent-3',
      name: 'Reporter',
      framework: 'crewai',
      status: 'active' as const,
      tasksCompleted: 15,
      lastActivity: Date.now() - 1000,
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = logFilter === 'all' || log.level === logFilter;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'debug':
        return <Code className="w-4 h-4 text-purple-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const performance = [
    { metric: 'Avg Response Time', value: '245ms', status: 'good' },
    { metric: 'Memory Usage', value: '126MB', status: 'good' },
    { metric: 'API Calls/min', value: '12', status: 'good' },
    { metric: 'Error Rate', value: '0.1%', status: 'good' },
  ];

  // Response Time Timeline (last 10 minutes)
  const responseTimeData = [
    { time: '0m', ms: 120 },
    { time: '1m', ms: 145 },
    { time: '2m', ms: 180 },
    { time: '3m', ms: 165 },
    { time: '4m', ms: 220 },
    { time: '5m', ms: 245 },
    { time: '6m', ms: 210 },
    { time: '7m', ms: 190 },
    { time: '8m', ms: 235 },
    { time: '9m', ms: 200 },
  ];

  // Memory Usage Timeline
  const memoryData = [
    { time: '0m', mb: 85 },
    { time: '1m', mb: 92 },
    { time: '2m', mb: 101 },
    { time: '3m', mb: 98 },
    { time: '4m', mb: 115 },
    { time: '5m', mb: 126 },
    { time: '6m', mb: 118 },
    { time: '7m', mb: 105 },
    { time: '8m', mb: 120 },
    { time: '9m', mb: 112 },
  ];

  // API Calls Distribution
  const apiCallsData = [
    { name: 'CrewAI', calls: 8 },
    { name: 'AutoGen', calls: 3 },
    { name: 'OpenClaw', calls: 1 },
    { name: 'LangGraph', calls: 0 },
  ];

  // Agent Activity Timeline
  const agentActivityData = [
    { time: '0:00', researcher: 2, analyst: 1, reporter: 1 },
    { time: '1:00', researcher: 3, analyst: 0, reporter: 2 },
    { time: '2:00', researcher: 1, analyst: 2, reporter: 3 },
    { time: '3:00', researcher: 4, analyst: 1, reporter: 1 },
    { time: '4:00', researcher: 2, analyst: 3, reporter: 2 },
    { time: '5:00', researcher: 3, analyst: 2, reporter: 3 },
  ];

  const appState = {
    currentView: 'inspect',
    sidebar: true,
    conversations: 5,
    swarms: 2,
    selectedFramework: 'crewai',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="h-full px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Inspect Panel (DevTools)
          </h1>
          <Wrench className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border pb-4 items-center justify-between flex-wrap">
          <div className="flex gap-4">
            {['logs', 'performance', 'state', 'agents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 font-medium transition-colors capitalize flex items-center gap-2 ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'logs' && <Code className="w-4 h-4" />}
                {tab === 'performance' && <Clock className="w-4 h-4" />}
                {tab === 'state' && <Zap className="w-4 h-4" />}
                {tab === 'agents' && <Filter className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>
          {activeTab === 'logs' && (
            <button
              onClick={() => setIsLiveMonitoring(!isLiveMonitoring)}
              className="px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-2 text-sm"
              title={isLiveMonitoring ? 'Pause monitoring' : 'Resume monitoring'}
            >
              {isLiveMonitoring ? (
                <>
                  <Pause className="w-4 h-4" />
                  Live
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Paused
                </>
              )}
            </button>
          )}
        </div>

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* Filter and Search */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-lobe w-full pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'info', 'warning', 'error', 'debug'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLogFilter(filter)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      logFilter === filter
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button
                onClick={handleExportLogs}
                className="px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
                title="Export logs as JSON"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Logs Display */}
            <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                    className="w-full py-3 px-4 rounded-lg border border-border hover:border-primary/50 transition-all text-left hover:bg-secondary/30 cursor-pointer"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {getLogIcon(log.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                            log.level === 'error'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                              : log.level === 'warning'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100'
                                : log.level === 'debug'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                          }`}>
                            {log.level}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{log.message}</p>
                        {expandedLogId === log.id && (
                          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No logs matching your filter
                </div>
              )}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performance.map((perf, idx) => (
                <div key={idx} className="card-lobe">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {perf.metric === 'Avg Response Time' && <Clock className="w-5 h-5 text-blue-500" />}
                      {perf.metric === 'Memory Usage' && <Zap className="w-5 h-5 text-purple-500" />}
                      {perf.metric === 'API Calls/min' && <Filter className="w-5 h-5 text-green-500" />}
                      {perf.metric === 'Error Rate' && <AlertCircle className="w-5 h-5 text-red-500" />}
                      <h3 className="font-semibold text-foreground text-sm">
                        {perf.metric}
                      </h3>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {perf.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Response Time Chart */}
            <div className="card-lobe">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Response Time (Last 10 minutes)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" stroke="currentColor" className="text-muted-foreground" />
                  <YAxis stroke="currentColor" className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ms"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Memory & API Calls Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Memory Usage Chart */}
              <div className="card-lobe">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  Memory Usage (Last 10 minutes)
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={memoryData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="time" stroke="currentColor" className="text-muted-foreground" />
                    <YAxis stroke="currentColor" className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mb"
                      fill="hsl(var(--primary) / 0.1)"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* API Calls Distribution */}
              <div className="card-lobe">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-green-500" />
                  API Calls by Framework
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={apiCallsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" />
                    <YAxis stroke="currentColor" className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* State Tab */}
        {activeTab === 'state' && (
          <div className="card-lobe">
            <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
              <pre className="whitespace-pre-wrap break-words text-foreground">
                {JSON.stringify(appState, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            {/* Agent Activity Timeline */}
            <div className="card-lobe">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Agent Activity Timeline (Last 6 hours)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={agentActivityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" stroke="currentColor" className="text-muted-foreground" />
                  <YAxis stroke="currentColor" className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="researcher"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Researcher"
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="analyst"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    name="Analyst"
                    dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reporter"
                    stroke="hsl(100, 84%, 60%)"
                    strokeWidth={2}
                    name="Reporter"
                    dot={{ fill: 'hsl(100, 84%, 60%)', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Agent Details Grid */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Active Agents</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="card-lobe">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{agent.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{agent.framework}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                      }`} />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tasks:</span>
                        <span className="font-semibold text-foreground">{agent.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-semibold capitalize ${
                          agent.status === 'active' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Active:</span>
                        <span className="font-semibold text-foreground text-xs">
                          {Math.round((Date.now() - agent.lastActivity) / 1000)}s ago
                        </span>
                      </div>
                    </div>

                    <button
                      className="w-full px-3 py-2 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-medium transition-colors"
                      title="Open agent builder"
                    >
                      Edit Agent
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {agents.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No agents currently running</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
