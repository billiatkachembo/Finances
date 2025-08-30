import React from 'react';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
      
      </header>
      <main className="p-4">
        {children}
      </main>
      {/* Footer */}
      <footer className="px-4 py-3 border-t text-sm text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} Billiat. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
