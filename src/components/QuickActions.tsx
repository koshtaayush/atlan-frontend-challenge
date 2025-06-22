
import React from 'react';
import { Database, Table, Info, Users, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickActionsProps {
  onQuerySelect: (query: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onQuerySelect }) => {
  const quickQueries = [
    {
      name: 'Show Tables',
      icon: <Table className="w-4 h-4" />,
      query: 'SHOW TABLES;',
      description: 'List all tables in the database'
    },
    {
      name: 'Database Info',
      icon: <Info className="w-4 h-4" />,
      query: 'SELECT DATABASE(), VERSION(), USER();',
      description: 'Show database information'
    },
    {
      name: 'Users Table',
      icon: <Users className="w-4 h-4" />,
      query: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 10;',
      description: 'Show recent users'
    },
    {
      name: 'Orders Summary',
      icon: <ShoppingCart className="w-4 h-4" />,
      query: 'SELECT COUNT(*) as total_orders, SUM(amount) as total_amount FROM orders WHERE created_at >= CURDATE();',
      description: 'Today\'s orders summary'
    },
    {
      name: 'Top Products',
      icon: <Star className="w-4 h-4" />,
      query: 'SELECT p.name, COUNT(oi.id) as order_count FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id ORDER BY order_count DESC LIMIT 5;',
      description: 'Most ordered products'
    },
    {
      name: 'Describe Users',
      icon: <Database className="w-4 h-4" />,
      query: 'DESCRIBE users;',
      description: 'Show users table structure'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quickQueries.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left h-auto p-3"
              onClick={() => onQuerySelect(item.query)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {item.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
