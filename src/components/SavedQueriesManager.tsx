
import React, { useState, useEffect } from 'react';
import { Search, Plus, Share, Folder, Star, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface SavedQuery {
  id: string;
  name: string;
  query: string;
  category: string;
  isShared: boolean;
  sharedBy?: string;
  createdAt: string;
  isFavorite: boolean;
}

interface SavedQueriesManagerProps {
  onQuerySelect: (query: string) => void;
  currentQuery: string;
}

const SavedQueriesManager: React.FC<SavedQueriesManagerProps> = ({ onQuerySelect, currentQuery }) => {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newQueryName, setNewQueryName] = useState('');
  const [newQueryCategory, setNewQueryCategory] = useState('general');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = () => {
    const saved = localStorage.getItem('savedQueriesV2');
    if (saved) {
      try {
        setQueries(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved queries:', error);
      }
    }
  };

  const saveQueries = (updatedQueries: SavedQuery[]) => {
    localStorage.setItem('savedQueriesV2', JSON.stringify(updatedQueries));
    setQueries(updatedQueries);
  };

  const saveCurrentQuery = () => {
    if (!newQueryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query name",
        variant: "destructive"
      });
      return;
    }

    const newQuery: SavedQuery = {
      id: Date.now().toString(),
      name: newQueryName,
      query: currentQuery,
      category: newQueryCategory,
      isShared: false,
      createdAt: new Date().toISOString(),
      isFavorite: false
    };

    const updated = [...queries, newQuery];
    saveQueries(updated);
    
    setNewQueryName('');
    setNewQueryCategory('general');
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Query saved successfully",
    });
  };

  const deleteQuery = (id: string) => {
    const updated = queries.filter(q => q.id !== id);
    saveQueries(updated);
    
    toast({
      title: "Success",
      description: "Query deleted successfully",
    });
  };

  const toggleFavorite = (id: string) => {
    const updated = queries.map(q => 
      q.id === id ? { ...q, isFavorite: !q.isFavorite } : q
    );
    saveQueries(updated);
  };

  const shareQuery = (id: string) => {
    const updated = queries.map(q => 
      q.id === id ? { ...q, isShared: !q.isShared } : q
    );
    saveQueries(updated);
    
    const query = queries.find(q => q.id === id);
    toast({
      title: "Success",
      description: `Query ${query?.isShared ? 'unshared' : 'shared'} successfully`,
    });
  };

  const filteredQueries = queries.filter(query =>
    query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myQueries = filteredQueries.filter(q => !q.sharedBy);
  const sharedQueries = filteredQueries.filter(q => q.sharedBy);
  const allQueries = filteredQueries;

  const renderQueryList = (queryList: SavedQuery[]) => (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2">
        {queryList.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No queries found</p>
          </div>
        ) : (
          queryList.map((query) => (
            <div
              key={query.id}
              className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {query.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {query.category}
                    </Badge>
                    {query.isShared && (
                      <Badge variant="outline" className="text-xs">
                        <Share className="w-3 h-3 mr-1" />
                        Shared
                      </Badge>
                    )}
                    {query.isFavorite && (
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(query.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Star className={`w-3 h-3 ${query.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareQuery(query.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Share className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onQuerySelect(query.query)}
                    className="h-8 w-8 p-0"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteQuery(query.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate">
                {query.query}
              </p>
              
              {query.sharedBy && (
                <p className="text-xs text-gray-500 mt-1">
                  Shared by {query.sharedBy}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div className="space-y-4">
      {/* Search and Save */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Save Query
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Query</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="queryName">Query Name</Label>
                <Input
                  id="queryName"
                  value={newQueryName}
                  onChange={(e) => setNewQueryName(e.target.value)}
                  placeholder="Enter query name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newQueryCategory} onValueChange={setNewQueryCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Query Preview</Label>
                <Textarea
                  value={currentQuery}
                  readOnly
                  className="font-mono text-sm"
                  rows={4}
                />
              </div>
              <Button onClick={saveCurrentQuery} className="w-full">
                Save Query
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Query Tabs */}
      <Tabs defaultValue="my" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="my" className="text-xs">My</TabsTrigger>
          <TabsTrigger value="shared" className="text-xs">Shared</TabsTrigger>
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my">
          {renderQueryList(myQueries)}
        </TabsContent>
        
        <TabsContent value="shared">
          {renderQueryList(sharedQueries)}
        </TabsContent>
        
        <TabsContent value="all">
          {renderQueryList(allQueries)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedQueriesManager;
