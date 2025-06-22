
import React, { useState, useEffect } from 'react';
import { HelpCircle, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TooltipStep {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tooltipSteps: TooltipStep[] = [
  {
    id: 'environment-selector',
    target: '.environment-selector',
    title: 'Environment Selection',
    content: 'Switch between different database environments: Production, Development, Local, and Staging.',
    position: 'bottom'
  },
  {
    id: 'query-editor',
    target: '.query-editor',
    title: 'SQL Query Editor',
    content: 'Write your SQL queries here. Use Ctrl+Enter to execute or click the Execute button.',
    position: 'bottom'
  },
  {
    id: 'execute-button',
    target: '.execute-button',
    title: 'Execute Query',
    content: 'Click here to run your SQL query. Make sure you have selected the right environment.',
    position: 'bottom'
  },
  {
    id: 'results-table',
    target: '.results-section',
    title: 'Query Results',
    content: 'Your query results will appear here. You can export them as CSV or paginate through large datasets.',
    position: 'top'
  },
  {
    id: 'saved-queries',
    target: '.saved-queries',
    title: 'Saved Queries',
    content: 'Save frequently used queries, search through them, and organize by categories.',
    position: 'left'
  },
  {
    id: 'query-history',
    target: '.query-history',
    title: 'Query History',
    content: 'View your recent query executions. Click on any query to load it back into the editor.',
    position: 'right'
  }
];

const WalkthroughTooltips: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenWalkthrough, setHasSeenWalkthrough] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenWalkthrough');
    if (!seen) {
      setIsActive(true);
    } else {
      setHasSeenWalkthrough(true);
    }
  }, []);

  useEffect(() => {
    if (isActive && currentStep < tooltipSteps.length) {
      positionTooltip();
    }
  }, [isActive, currentStep]);

  const positionTooltip = () => {
    const currentTooltip = tooltipSteps[currentStep];
    const targetElement = document.querySelector(currentTooltip.target);
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      
      let top = 0;
      let left = 0;
      
      switch (currentTooltip.position) {
        case 'top':
          top = rect.top - tooltipHeight - 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - 10;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + 10;
          break;
      }
      
      // Ensure tooltip stays within viewport
      top = Math.max(10, Math.min(top, window.innerHeight - tooltipHeight - 10));
      left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));
      
      setTooltipPosition({ top, left });
      
      // Highlight the target element
      targetElement.classList.add('walkthrough-highlight');
      
      // Remove highlight from previous elements
      document.querySelectorAll('.walkthrough-highlight').forEach(el => {
        if (el !== targetElement) {
          el.classList.remove('walkthrough-highlight');
        }
      });
    }
  };

  const startWalkthrough = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < tooltipSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeWalkthrough();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeWalkthrough = () => {
    setIsActive(false);
    setHasSeenWalkthrough(true);
    localStorage.setItem('hasSeenWalkthrough', 'true');
    
    // Remove all highlights
    document.querySelectorAll('.walkthrough-highlight').forEach(el => {
      el.classList.remove('walkthrough-highlight');
    });
  };

  const skipWalkthrough = () => {
    completeWalkthrough();
  };

  if (!isActive) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={startWalkthrough}
        className="fixed bottom-4 right-4 z-50"
      >
        <HelpCircle className="w-4 h-4 mr-1" />
        Help
      </Button>
    );
  }

  const currentTooltip = tooltipSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-50 w-80 shadow-lg" 
        style={{ 
          top: `${tooltipPosition.top}px`, 
          left: `${tooltipPosition.left}px` 
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{currentTooltip.title}</h3>
            <Button variant="ghost" size="sm" onClick={skipWalkthrough}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {currentTooltip.content}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} of {tooltipSteps.length}
            </span>
            
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
              
              <Button size="sm" onClick={nextStep}>
                {currentStep === tooltipSteps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < tooltipSteps.length - 1 && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
          
          <div className="mt-3">
            <Button variant="ghost" size="sm" onClick={skipWalkthrough} className="w-full text-xs">
              Skip walkthrough
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <style>{`
        .walkthrough-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default WalkthroughTooltips;
