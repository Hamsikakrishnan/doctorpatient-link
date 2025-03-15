
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="p-2 mr-3 rounded-md text-gray-500 hover:text-healthcare-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div 
            onClick={() => user ? navigate(`/${user.role}-dashboard`) : navigate('/')} 
            className="flex items-center cursor-pointer"
          >
            <span className="text-healthcare-600 font-bold text-xl">Health</span>
            <span className="text-healthcare-800 font-bold text-xl">Link</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-healthcare-100 flex items-center justify-center overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-healthcare-500" />
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-md text-gray-500 hover:text-healthcare-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
