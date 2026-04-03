import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // 'light' | 'blue' | 'dark'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user] = useState({ name: 'Shashwat Negi', initials: 'SN', email: 'shashwat@email.com' });

  const toggleTheme = () =>
    setTheme((t) => (t === 'light' ? 'blue' : t === 'blue' ? 'dark' : 'light'));
  const toggleSidebar = () => setSidebarOpen((o) => !o);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, sidebarOpen, toggleSidebar, user }}>
      <div data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}