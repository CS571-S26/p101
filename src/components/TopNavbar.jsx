import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function TopNavbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme, user } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="top-navbar">
      <div className="navbar-left" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
        <span className="navbar-logo-box">VOYAGO</span>
      </div>

      <div className="navbar-right">
        <div className="navbar-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span className="navbar-avatar">{user.initials}</span>
          <ChevronDown size={14} />
        </div>

        {dropdownOpen && (
          <>
            <div className="navbar-dropdown-overlay" onClick={() => setDropdownOpen(false)} />
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-header">
                <span className="navbar-dropdown-name">{user.name}</span>
                <span className="navbar-dropdown-email">{user.email}</span>
              </div>
              <button className="navbar-dropdown-item" onClick={() => { toggleTheme(); setDropdownOpen(false); }}>
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                {theme === 'light' ? 'Switch Theme (Blue)' : 'Switch Theme (Light)'}
              </button>
              <button className="navbar-dropdown-item" onClick={() => { navigate('/settings'); setDropdownOpen(false); }}>
                <Settings size={16} />
                Settings
              </button>
              <button
                className="navbar-dropdown-item navbar-dropdown-logout"
                onClick={() => { navigate('/login'); setDropdownOpen(false); }}
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default TopNavbar;