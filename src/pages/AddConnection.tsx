
import React, { useState } from 'react';
import { ArrowLeft, Database, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';

const AddConnection: React.FC = () => {
  const navigate = useNavigate();
  const [connectionData, setConnectionData] = useState({
    name: '',
    type: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    description: ''
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setConnectionData(prev => ({ ...prev, [field]: value }));
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    
    // Simulate connection test
    setTimeout(() => {
      setIsTestingConnection(false);
      toast({
        title: "Connection Test",
        description: "Connection successful!",
      });
    }, 2000);
  };

  const saveConnection = () => {
    if (!connectionData.name || !connectionData.type || !connectionData.host) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Save connection to localStorage
    const connections = JSON.parse(localStorage.getItem('dbConnections') || '[]');
    const newConnection = {
      ...connectionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    connections.push(newConnection);
    localStorage.setItem('dbConnections', JSON.stringify(connections));
    
    toast({
      title: "Success",
      description: "Database connection saved successfully",
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Database Connection</h1>
              <p className="text-gray-600 dark:text-gray-300">Configure a new database connection</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Connection Form */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Connection Name *</Label>
                <Input
                  id="name"
                  value={connectionData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Production DB"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Database Type *</Label>
                <Select value={connectionData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="oracle">Oracle</SelectItem>
                    <SelectItem value="sqlserver">SQL Server</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="host">Host *</Label>
                <Input
                  id="host"
                  value={connectionData.host}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                  placeholder="localhost"
                />
              </div>
              
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  value={connectionData.port}
                  onChange={(e) => handleInputChange('port', e.target.value)}
                  placeholder="5432"
                />
              </div>
              
              <div>
                <Label htmlFor="database">Database Name</Label>
                <Input
                  id="database"
                  value={connectionData.database}
                  onChange={(e) => handleInputChange('database', e.target.value)}
                  placeholder="myapp_production"
                />
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={connectionData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="dbuser"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={connectionData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={connectionData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Optional description for this connection"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={testConnection}
                disabled={isTestingConnection}
              >
                <TestTube className="w-4 h-4 mr-1" />
                {isTestingConnection ? 'Testing...' : 'Test Connection'}
              </Button>
              
              <Button onClick={saveConnection}>
                Save Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddConnection;
