import React, { useState, useEffect } from 'react';
import { Play, Download, History, Database, FileText, Trash2, Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import QueryEditor from './QueryEditor';
import ResultsTable from './ResultsTable';
import QueryHistory from './QueryHistory';
import QuickActions from './QuickActions';
import ThemeToggle from './ThemeToggle';
import SavedQueriesManager from './SavedQueriesManager';
import EnvironmentSelector, { Environment } from './EnvironmentSelector';
import WalkthroughTooltips from './WalkthroughTooltips';
import UserProfile from './UserProfile';

interface QueryResult {
  columns: string[];
  rows: any[][];
  rowCount: number;
  executionTime: number;
}

interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  executionTime?: number;
  success: boolean;
}

const SQLQueryApp = () => {
  const navigate = useNavigate();
  const [currentQuery, setCurrentQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment | null>(null);
  const [hasShownEnvironmentToast, setHasShownEnvironmentToast] = useState(false);

  // Mock database connection check
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(Math.random() > 0.1);
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load query history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('sqlQueryHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setQueryHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load query history:', error);
      }
    }
  }, []);

  // Save query history to localStorage
  useEffect(() => {
    localStorage.setItem('sqlQueryHistory', JSON.stringify(queryHistory));
  }, [queryHistory]);

  const executeQuery = async () => {
    if (!currentQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SQL query",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      // Simulate API call to execute SQL query
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Mock different types of results based on query
      const query = currentQuery.toLowerCase().trim();
      let mockResult: QueryResult;

      if (query.includes('error') || query.includes('invalid')) {
        throw new Error('Syntax error near "invalid"');
      } else if (query.startsWith('select')) {
        mockResult = generateMockSelectResult();
      } else if (query.startsWith('show tables')) {
        mockResult = generateMockTablesResult();
      } else if (query.startsWith('describe') || query.startsWith('desc')) {
        mockResult = generateMockDescribeResult();
      } else {
        mockResult = {
          columns: ['Message'],
          rows: [['Query executed successfully']],
          rowCount: 1,
          executionTime: Date.now() - startTime
        };
      }

      const executionTime = Date.now() - startTime;
      mockResult.executionTime = executionTime;

      setResults(mockResult);
      
      // Add to history
      const historyItem: QueryHistoryItem = {
        id: Date.now().toString(),
        query: currentQuery,
        timestamp: new Date(),
        executionTime,
        success: true
      };
      
      setQueryHistory(prev => [historyItem, ...prev.slice(0, 49)]);
      
      toast({
        title: "Success",
        description: `Query executed in ${executionTime}ms`,
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Add failed query to history
      const historyItem: QueryHistoryItem = {
        id: Date.now().toString(),
        query: currentQuery,
        timestamp: new Date(),
        success: false
      };
      
      setQueryHistory(prev => [historyItem, ...prev.slice(0, 49)]);
      
      toast({
        title: "Query Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockSelectResult = (): QueryResult => {
    const columns = ['id', 'name', 'email', 'created_at', 'status'];
    const rows = [];
    const rowCount = Math.floor(Math.random() * 20) + 5;
    
    for (let i = 1; i <= rowCount; i++) {
      rows.push([
        i,
        `User ${i}`,
        `user${i}@example.com`,
        new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
        Math.random() > 0.5 ? 'active' : 'inactive'
      ]);
    }
    
    return { columns, rows, rowCount, executionTime: 0 };
  };

  const generateMockTablesResult = (): QueryResult => {
    const columns = ['Table Name', 'Engine', 'Rows', 'Created'];
    const rows = [
      ['users', 'InnoDB', '1,234', '2024-01-15'],
      ['orders', 'InnoDB', '5,678', '2024-01-16'],
      ['products', 'InnoDB', '892', '2024-01-17'],
      ['categories', 'InnoDB', '45', '2024-01-18'],
      ['reviews', 'InnoDB', '3,456', '2024-01-19']
    ];
    
    return { columns, rows, rowCount: rows.length, executionTime: 0 };
  };

  const generateMockDescribeResult = (): QueryResult => {
    const columns = ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'];
    const rows = [
      ['id', 'int(11)', 'NO', 'PRI', null, 'auto_increment'],
      ['name', 'varchar(255)', 'NO', '', null, ''],
      ['email', 'varchar(255)', 'NO', 'UNI', null, ''],
      ['created_at', 'timestamp', 'NO', '', 'CURRENT_TIMESTAMP', ''],
      ['updated_at', 'timestamp', 'NO', '', 'CURRENT_TIMESTAMP', 'on update CURRENT_TIMESTAMP']
    ];
    
    return { columns, rows, rowCount: rows.length, executionTime: 0 };
  };

  const exportResults = () => {
    if (!results) {
      toast({
        title: "No Results",
        description: "Execute a query first to export results",
        variant: "destructive"
      });
      return;
    }

    const csvContent = [
      results.columns.join(','),
      ...results.rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Results exported as CSV file",
    });
  };

  const copyQuery = () => {
    navigator.clipboard.writeText(currentQuery);
    toast({
      title: "Copied",
      description: "Query copied to clipboard",
    });
  };

  const clearHistory = () => {
    setQueryHistory([]);
    toast({
      title: "History Cleared",
      description: "Query history has been cleared",
    });
  };

  const handleEnvironmentChange = (environment: Environment) => {
    setCurrentEnvironment(environment);
    setIsConnected(environment.isConnected);
    
    // Only show toast if this is not the initial setup
    if (hasShownEnvironmentToast) {
      toast({
        title: "Environment Changed",
        description: `Connected to ${environment.name} environment`,
      });
    } else {
      setHasShownEnvironmentToast(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with improved spacing */}
        <div className="flex items-center justify-between pt-6 pb-4">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SQL Query Runner</h1>
              <p className="text-gray-600 dark:text-gray-300">Execute and analyze SQL queries with ease</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/add-connection')}>
              <Plus className="w-4 h-4 mr-1" />
              Add Connection
            </Button>
            
            <div className="environment-selector">
              <EnvironmentSelector onEnvironmentChange={handleEnvironmentChange} />
            </div>
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions onQuerySelect={setCurrentQuery} />
            
            {/* Saved Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Queries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="saved-queries">
                  <SavedQueriesManager 
                    onQuerySelect={setCurrentQuery}
                    currentQuery={currentQuery}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Query History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Query History</span>
                  </span>
                  {queryHistory.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearHistory}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="query-history">
                  <QueryHistory 
                    history={queryHistory}
                    onQuerySelect={setCurrentQuery}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Query Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Query Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>SQL Query Editor</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={copyQuery}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      onClick={executeQuery} 
                      disabled={loading || !isConnected}
                      className="bg-blue-600 hover:bg-blue-700 execute-button"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      {loading ? 'Executing...' : 'Execute'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="query-editor">
                  <QueryEditor 
                    value={currentQuery}
                    onChange={setCurrentQuery}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Query Results</span>
                  {results && (
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <span>{results.rowCount} rows</span>
                      <span>{results.executionTime}ms</span>
                      <Button variant="outline" size="sm" onClick={exportResults}>
                        <Download className="w-4 h-4 mr-1" />
                        Export CSV
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="results-section">
                  {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                        <span className="font-medium">Error:</span>
                        <span>{error}</span>
                      </div>
                    </div>
                  ) : results ? (
                    <ResultsTable results={results} />
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Execute a query to see results here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <WalkthroughTooltips />
    </div>
  );
};

export default SQLQueryApp;
