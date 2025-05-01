
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
  isMobile: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  header, 
  sidebar, 
  main, 
  isMobile,
  sidebarOpen,
  toggleSidebar
}) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="h-16 border-b px-4 flex items-center shadow-sm">
        {header}
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - conditionally rendered for mobile */}
        {(sidebarOpen || !isMobile) && (
          <aside 
            className={`
              ${isMobile ? 'fixed inset-0 z-40 bg-background/95 backdrop-blur-sm' : 'w-80 border-r'}
            `}
          >
            <div className="h-full flex flex-col">
              {isMobile && (
                <div className="h-16 border-b px-4 flex justify-end items-center">
                  <Button variant="outline" size="sm" onClick={toggleSidebar}>
                    Close
                  </Button>
                </div>
              )}
              <div className={`${isMobile ? 'flex-1 p-4' : 'h-full p-4'}`}>
                {sidebar}
              </div>
            </div>
          </aside>
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-hidden bg-muted/30 p-4">
          {main}
        </main>
      </div>
    </div>
  );
};

export default Layout;
