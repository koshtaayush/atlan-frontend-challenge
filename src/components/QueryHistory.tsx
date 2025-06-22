
import React from 'react';
import { Clock, CheckCircle, XCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  executionTime?: number;
  success: boolean;
}

interface QueryHistoryProps {
  history: QueryHistoryItem[];
  onQuerySelect: (query: string) => void;
}

const QueryHistory: React.FC<QueryHistoryProps> = ({ history, onQuerySelect }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateQuery = (query: string, maxLength: number = 100) => {
    if (query.length <= maxLength) return query;
    return query.substring(0, maxLength) + '...';
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No query history yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="group p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {item.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span className="text-xs text-gray-500">
                  {formatTime(item.timestamp)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuerySelect(item.query)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="w-3 h-3" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-700 font-mono leading-relaxed mb-2">
              {truncateQuery(item.query)}
            </p>
            
            {item.success && item.executionTime && (
              <div className="text-xs text-gray-500">
                Executed in {item.executionTime}ms
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default QueryHistory;
