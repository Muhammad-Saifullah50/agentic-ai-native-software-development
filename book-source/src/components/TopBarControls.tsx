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
           
           
            
           

        

          {/* Theme Toggle & Help */}
          <div className="flex items-center gap-2">
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
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="gap-2 hover:bg-secondary transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
           
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBarControls;
