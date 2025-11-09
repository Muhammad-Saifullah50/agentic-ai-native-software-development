import React, { useEffect } from 'react';
import { Save, FolderOpen, FileDown, HelpCircle, FileText, HelpCircleIcon, Play, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type PanelMode = 'explanation' | 'quiz' | 'simulation';

interface TopBarControlsProps {
  onModeChange: (mode: PanelMode) => void;
  currentMode: PanelMode;
}

const TopBarControls: React.FC<TopBarControlsProps> = ({ onModeChange, currentMode }) => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    console.log('TopBarControls mounted');
    return () => {
      console.log('TopBarControls unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('TopBarControls currentMode changed to:', currentMode);
  }, [currentMode]);

  const handleModeButtonClick = (mode: PanelMode) => {
    console.log('Mode button clicked:', mode);
    onModeChange(mode);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm mb-6 animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Brand */}
          <h1 className="text-xl font-bold text-foreground">
            AI-Native Playground
          </h1>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2 hover:bg-secondary transition-colors"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2 hover:bg-secondary transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              Load
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="gap-2 hover:bg-secondary transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuItem className="cursor-pointer hover:bg-secondary">
                  Export as PNG
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-secondary">
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2" role="group" aria-label="Mode Switcher">
            <Button
              variant={currentMode === 'explanation' ? 'default' : 'outline'}
              size="sm"
              title="Explanation Mode"
              onClick={() => handleModeButtonClick('explanation')}
              className="gap-2 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Explanation
            </Button>
            <Button
              variant={currentMode === 'quiz' ? 'default' : 'outline'}
              size="sm"
              title="Quiz Mode"
              onClick={() => handleModeButtonClick('quiz')}
              className="gap-2 transition-colors"
            >
              <HelpCircleIcon className="h-4 w-4" />
              Quiz
            </Button>
            <Button
              variant={currentMode === 'simulation' ? 'default' : 'outline'}
              size="sm"
              title="Simulation Mode"
              onClick={() => handleModeButtonClick('simulation')}
              className="gap-2 transition-colors"
            >
              <Play className="h-4 w-4" />
              Simulate
            </Button>
          </div>

          {/* Theme Toggle & Help */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="gap-2 hover:bg-secondary transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2 hover:bg-secondary transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBarControls;
