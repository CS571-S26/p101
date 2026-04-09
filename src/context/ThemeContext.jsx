import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({
    name: 'Shashwat Negi',
    initials: 'SN',
    email: 'shashwat@email.com',
    phone: '',
    bio: '',
    avatarUrl: '',
  });

  const [settings, setSettings] = useState({
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    emailNotifications: true,
    pushNotifications: true,
    tripReminders: true,
    groupUpdates: true,
    marketingEmails: false,
    profileVisibility: 'friends',
    showEmail: false,
    showTrips: true,
    twoFactorEnabled: false,
  });

  const toggleTheme = () =>
    setTheme((t) => (t === 'light' ? 'blue' : 'light'));
  const toggleSidebar = () => setSidebarOpen((o) => !o);

  const updateUser = (updates) =>
    setUser((prev) => {
      const next = { ...prev, ...updates };
      if (updates.name) {
        const parts = updates.name.trim().split(/\s+/);
        next.initials = parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : parts[0].slice(0, 2).toUpperCase();
      }
      return next;
    });

  const updateSettings = (updates) =>
    setSettings((prev) => ({ ...prev, ...updates }));

  return (
    <ThemeContext.Provider value={{
      theme, setTheme, toggleTheme,
      sidebarOpen, toggleSidebar,
      user, updateUser,
      settings, updateSettings,
    }}>
      <div data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}