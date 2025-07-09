import React from 'react';
import { User, HelpCircle, LogOut } from 'lucide-react';

interface WellsFargoHeaderProps {
  userName?: string;
}

const WellsFargoHeader: React.FC<WellsFargoHeaderProps> = ({ userName = 'Vona, Joseph' }) => {
  return (
    <div className="bg-[#D71E2B] text-white">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left section with logo and title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="bg-white px-3 py-1 rounded">
              <span className="text-[#D71E2B] font-bold text-lg">WELLS FARGO</span>
            </div>
            <span className="ml-3 text-white font-semibold">Control Monitor</span>
          </div>
        </div>

        {/* Center section */}
        <div className="flex-1 text-center">
          <span className="text-sm">Written Supervisory Procedures (WSPs)</span>
        </div>

        {/* Right section with user info and actions */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-sm hover:underline">
            <span>Support</span>
          </button>
          
          <div className="border-l border-white/30 pl-4">
            <button className="flex items-center space-x-2 hover:bg-red-700 px-2 py-1 rounded">
              <User size={16} />
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs">▼</span>
            </button>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm font-medium">
            Exit
          </button>
        </div>
      </div>

      {/* Subheader message */}
      <div className="bg-gray-800 text-center py-1 text-sm">
        You are currently viewing Control Monitor as Vona, Joseph All actions are disabled.
      </div>
    </div>
  );
};

export default WellsFargoHeader;