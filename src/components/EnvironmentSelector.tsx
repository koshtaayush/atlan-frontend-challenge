
import React, { useState, useEffect } from 'react';
import { Database, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface Environment {
  id: string;
  name: string;
  type: 'production' | 'development' | 'local' | 'staging';
  connectionString?: string;
  isConnected: boolean;
}

interface EnvironmentSelectorProps {
  onEnvironmentChange: (environment: Environment) => void;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ onEnvironmentChange }) => {
  const [environments] = useState<Environment[]>([
    {
      id: 'prod',
      name: 'Production',
      type: 'production',
      connectionString: 'prod-db.company.com:5432',
      isConnected: true
    },
    {
      id: 'dev',
      name: 'Development',
      type: 'development',
      connectionString: 'dev-db.company.com:5432',
      isConnected: true
    },
    {
      id: 'local',
      name: 'Local',
      type: 'local',
      connectionString: 'localhost:5432',
      isConnected: false
    },
    {
      id: 'staging',
      name: 'Staging',
      type: 'staging',
      connectionString: 'staging-db.company.com:5432',
      isConnected: true
    }
  ]);

  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>(environments[1]); // Default to development

  useEffect(() => {
    onEnvironmentChange(selectedEnvironment);
  }, [selectedEnvironment, onEnvironmentChange]);

  const handleEnvironmentChange = (environmentId: string) => {
    const environment = environments.find(env => env.id === environmentId);
    if (environment) {
      setSelectedEnvironment(environment);
    }
  };

  const getEnvironmentColor = (type: Environment['type']) => {
    switch (type) {
      case 'production': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'local': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'staging': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Database className="w-5 h-5 text-muted-foreground" />
      <div className="flex flex-col space-y-1">
        <Select value={selectedEnvironment.id} onValueChange={handleEnvironmentChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {environments.map((env) => (
              <SelectItem key={env.id} value={env.id}>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${env.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>{env.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Badge className={getEnvironmentColor(selectedEnvironment.type)}>
            {selectedEnvironment.type}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {selectedEnvironment.connectionString}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSelector;
