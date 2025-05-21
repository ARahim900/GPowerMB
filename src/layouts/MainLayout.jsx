import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Droplet, Zap, Building2, Users, ChevronLeft, Settings, LogOut, HelpCircle, Bell } from 'lucide-react';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} bg-primary text-white transition-all duration-300 flex flex-col`}>
        <div className="flex items-center p-5 border-b border-primary-dark">
          {!collapsed && (
            <>
              <div className="w-8 h-8 bg-white/20 flex items-center justify-center rounded">
                <div className="w-4 h-4 bg-white"></div>
              </div>
              <h1 className="ml-3 text-xl font-medium">Muscat Bay</h1>
            </>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-white/20 flex items-center justify-center rounded mx-auto">
              <div className="w-4 h-4 bg-white"></div>
            </div>
          )}
          <button className="ml-auto" onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft size={20} className={`transition-all duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="mt-6 flex-1">
          <NavItem 
            to="/" 
            icon={<Home size={20} />} 
            label="Dashboard" 
            isActive={location.pathname === '/'} 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/water" 
            icon={<Droplet size={20} />} 
            label="Water Analysis" 
            isActive={location.pathname === '/water' || location.pathname === '/water-analysis'} 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/electricity" 
            icon={<Zap size={20} />} 
            label="Electricity Analysis" 
            isActive={location.pathname === '/electricity'} 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/stp" 
            icon={<Building2 size={20} />} 
            label="STP Plant" 
            isActive={location.pathname === '/stp'} 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/contractors" 
            icon={<Users size={20} />} 
            label="Contractor Tracker" 
            isActive={location.pathname.includes('/contractors')} 
            collapsed={collapsed} 
          />
        </nav>

        <div className={`border-t border-primary-dark p-4 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">admin@muscatbay.com</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
              A
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

// Component for sidebar navigation items
const NavItem = ({ to, icon, label, isActive, collapsed }) => {
  return (
    <NavLink 
      to={to} 
      className={`flex items-center px-6 py-3 text-gray-300 hover:bg-white/10 ${isActive ? 'bg-white/10 text-white' : ''} ${collapsed ? 'justify-center' : ''}`}
    >
      <span className={collapsed ? '' : 'mr-3'}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

export default MainLayout;