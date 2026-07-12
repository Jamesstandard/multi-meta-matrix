'use client';

import React, { useState } from 'react';
import { Puzzle, Plus, Search, Download, Code, Zap } from '@/lib/icons';

export function SkillsView() {
  const [activeTab, setActiveTab] = useState<'library' | 'github' | 'marketplace' | 'web-scrape'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [scrapingUrl, setScrapingUrl] = useState('');
  const [isScrapingOpen, setIsScrapingOpen] = useState(false);

  const skills = [
    {
      id: 1,
      name: 'Web Scraper',
      category: 'Data',
      description: 'Extract and parse web content',
      installed: true,
    },
    {
      id: 2,
      name: 'Email Sender',
      category: 'Communication',
      description: 'Send emails with attachments',
      installed: true,
    },
    {
      id: 3,
      name: 'Code Generator',
      category: 'Development',
      description: 'Generate code snippets from natural language',
      installed: false,
    },
    {
      id: 4,
      name: 'API Caller',
      category: 'Integration',
      description: 'Make HTTP requests to external APIs',
      installed: true,
    },
    {
      id: 5,
      name: 'Database Query',
      category: 'Data',
      description: 'Query and manipulate databases',
      installed: false,
    },
    {
      id: 6,
      name: 'File Manager',
      category: 'System',
      description: 'Read, write, and manage files',
      installed: true,
    },
  ];

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGithubImport = async () => {
    if (!githubRepo.trim()) return;
    setIsImporting(true);
    try {
      // Simulate GitHub import - detect SKILL.md and code files
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert(`Imported skills from ${githubRepo}`);
      setGithubRepo('');
    } finally {
      setIsImporting(false);
    }
  };

  const handleWebScrape = async () => {
    if (!scrapingUrl.trim()) return;
    setIsImporting(true);
    try {
      // Simulate web scraping - extract skills from URL
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert(`Scraped skills from ${scrapingUrl}`);
      setScrapingUrl('');
      setIsScrapingOpen(false);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <div className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="h-full px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">MCP Skills Marketplace</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border pb-4 overflow-x-auto">
          {[
            { id: 'library', label: 'Tool Library', icon: Puzzle },
            { id: 'github', label: 'GitHub Import', icon: Code },
            { id: 'marketplace', label: 'MCP Marketplace', icon: Zap },
            { id: 'web-scrape', label: 'Web Scraping', icon: Search },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content - Tool Library */}
        {activeTab === 'library' && (
          <>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills..."
                  className="input-lobe pl-11"
                />
              </div>
            </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-lobe">
            <p className="text-sm text-muted-foreground mb-1">Total Skills</p>
            <p className="text-3xl font-bold text-primary">{skills.length}</p>
          </div>
          <div className="card-lobe">
            <p className="text-sm text-muted-foreground mb-1">Installed</p>
            <p className="text-3xl font-bold text-primary">
              {skills.filter((s) => s.installed).length}
            </p>
          </div>
          <div className="card-lobe">
            <p className="text-sm text-muted-foreground mb-1">Available</p>
            <p className="text-3xl font-bold text-primary">
              {skills.filter((s) => !s.installed).length}
            </p>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="card-lobe">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Puzzle className="w-5 h-5 text-primary" />
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    skill.installed
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  {skill.installed ? 'Installed' : 'Available'}
                </span>
              </div>

              <h3 className="font-bold text-foreground mb-1">{skill.name}</h3>
              <p className="text-xs text-primary mb-3 capitalize">{skill.category}</p>
              <p className="text-sm text-muted-foreground mb-4">{skill.description}</p>

              <button
                className={`w-full py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  skill.installed
                    ? 'btn-lobe-secondary'
                    : 'btn-lobe-primary'
                }`}
              >
                <Download className="w-4 h-4" />
                {skill.installed ? 'Uninstall' : 'Install'}
              </button>
            </div>
          ))}
        </div>

            {filteredSkills.length === 0 && (
              <div className="text-center py-12">
                <Puzzle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No Skills Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search query
                </p>
              </div>
            )}
          </>
        )}

        {/* Tab Content - GitHub Import */}
        {activeTab === 'github' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">Import from GitHub</h2>
            <p className="text-muted-foreground mb-6">
              Paste a GitHub repository URL. We'll automatically detect SKILL.md files and code to import skills.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Repository URL
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="input-lobe"
                />
              </div>
              <button
                onClick={handleGithubImport}
                disabled={isImporting || !githubRepo.trim()}
                className="btn-lobe-primary w-full disabled:opacity-50"
              >
                {isImporting ? 'Importing...' : 'Import Skills'}
              </button>
            </div>
          </div>
        )}

        {/* Tab Content - MCP Marketplace */}
        {activeTab === 'marketplace' && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">MCP Marketplace</h2>
            <p className="text-muted-foreground mb-6">
              Browse and install Model Context Protocol (MCP) tools for enhanced agent capabilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Web Search MCP',
                  description: 'Search the internet in real-time',
                  installed: false,
                },
                {
                  name: 'Database MCP',
                  description: 'Query multiple database types',
                  installed: true,
                },
                {
                  name: 'File System MCP',
                  description: 'Safe file operations and management',
                  installed: true,
                },
                {
                  name: 'API Gateway MCP',
                  description: 'Call external APIs with proper auth',
                  installed: false,
                },
              ].map((mcp, idx) => (
                <div key={idx} className="card-lobe">
                  <h3 className="font-semibold text-foreground mb-2">{mcp.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{mcp.description}</p>
                  <button
                    className={`w-full py-2 rounded-lg font-medium ${
                      mcp.installed ? 'btn-lobe-secondary' : 'btn-lobe-primary'
                    }`}
                  >
                    {mcp.installed ? 'Uninstall' : 'Install'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content - Web Scraping */}
        {activeTab === 'web-scrape' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">Web Scraping</h2>
            <p className="text-muted-foreground mb-6">
              Scrape documentation and content from websites to extract skills and tools automatically.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website URL
                </label>
                <input
                  type="text"
                  value={scrapingUrl}
                  onChange={(e) => setScrapingUrl(e.target.value)}
                  placeholder="https://example.com/docs"
                  className="input-lobe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Extraction Pattern
                </label>
                <select className="input-lobe">
                  <option>Documentation structure</option>
                  <option>API endpoints</option>
                  <option>Tool descriptions</option>
                  <option>Code examples</option>
                </select>
              </div>
              <button
                onClick={handleWebScrape}
                disabled={isImporting || !scrapingUrl.trim()}
                className="btn-lobe-primary w-full disabled:opacity-50"
              >
                {isImporting ? 'Scraping...' : 'Start Scraping'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
