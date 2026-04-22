import { useNavigate, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { Home, PlusCircle, Calendar, Users, Moon, Sun, LogOut, Menu } from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useTheme();

  return (
    <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <div className="sidebar-top">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        {sidebarOpen && <h1 className="sidebar-brand">VOYAGO</h1>}
      </div>

      <Nav className="sidebar-nav flex-column">
        <Nav.Item>
          <button
            className={`sidebar-item ${path === '/home' ? 'active' : ''}`}
            onClick={() => navigate('/home')}
            title="Home"
          >
            <Home size={20} />
            {sidebarOpen && <span>Home</span>}
          </button>
        </Nav.Item>
        <Nav.Item>
          <button
            className={`sidebar-item ${path.startsWith('/trips') ? 'active' : ''}`}
            onClick={() => navigate('/trips')}
            title="New Trip"
          >
            <PlusCircle size={20} />
            {sidebarOpen && <span>New Trip</span>}
          </button>
        </Nav.Item>
        <Nav.Item>
          <button
            className="sidebar-item"
            onClick={() => navigate('/home')}
            title="Active Trips"
          >
            <Calendar size={20} />
            {sidebarOpen && <span>Active Trips</span>}
          </button>
        </Nav.Item>
      </Nav>

      <div className="sidebar-bottom">
        <button className="sidebar-item sidebar-theme-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {sidebarOpen && <span>{theme === 'light' ? 'Blue Mode' : 'Light Mode'}</span>}
        </button>

        <button className="sidebar-item sidebar-logout" onClick={() => navigate('/login')} title="Logout">
          <LogOut size={20} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
