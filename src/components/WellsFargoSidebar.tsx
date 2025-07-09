import React, { useState } from 'react';
import { ChevronRight, ChevronDown, LayoutDashboard, CheckCircle, Clock, Users, FileText, AlertTriangle, BarChart3, Shield, TrendingUp } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  children?: SidebarItem[];
  isExpanded?: boolean;
  color?: string;
}

interface WellsFargoSidebarProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
}

const WellsFargoSidebar: React.FC<WellsFargoSidebarProps> = ({ activePath = 'all', onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['my-tasks']));

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: 'summary',
      label: 'Summary',
      icon: <LayoutDashboard size={16} />
    },
    {
      id: 'my-tasks',
      label: 'My Tasks (User Only)',
      icon: <FileText size={16} />,
      children: [
        {
          id: 'all',
          label: 'ALL',
          count: 1858,
          color: 'text-blue-600'
        },
        {
          id: 'outstanding',
          label: 'Outstanding',
          count: 1600,
          icon: <Clock size={14} />,
          color: 'text-orange-600'
        },
        {
          id: 'completed',
          label: 'Completed',
          count: 258,
          icon: <CheckCircle size={14} />,
          color: 'text-green-600'
        }
      ]
    },
    {
      id: 'employee-licensing',
      label: 'Employee Licensing & Registrations',
      count: 315,
      icon: <Users size={16} />
    },
    {
      id: 't3-clean-pnl',
      label: 'T+3 Clean PnL Sign-Off',
      count: 244,
      icon: <BarChart3 size={16} />
    },
    {
      id: 'anomalous-trading',
      label: 'Anomalous Trading',
      count: 188,
      icon: <AlertTriangle size={16} />
    },
    {
      id: 'cancel-amend',
      label: 'Cancel and Amend Review',
      count: 85,
      icon: <FileText size={16} />
    },
    {
      id: 'supervisor-dashboard',
      label: 'Supervisor Dashboard Signoff',
      count: 58,
      icon: <Shield size={16} />
    },
    {
      id: 'ipv',
      label: 'Independent Price Verification (IPV)',
      count: 14,
      icon: <TrendingUp size={16} />
    },
    {
      id: 'trade-surveillance',
      label: 'Trade Surveillance Alert',
      count: 9,
      icon: <AlertTriangle size={16} />
    }
  ];

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activePath === item.id;

    return (
      <div key={item.id}>
        <div
          className={`
            flex items-center justify-between px-3 py-2 cursor-pointer transition-colors
            ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
            ${level > 0 ? 'pl-8' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            }
            onNavigate?.(item.id);
          }}
        >
          <div className="flex items-center space-x-2 flex-1">
            {hasChildren ? (
              isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : (
              <span className="w-3.5" />
            )}
            {item.icon}
            <span className={`text-sm font-medium ${item.color || ''}`}>{item.label}</span>
          </div>
          {item.count !== undefined && (
            <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
              {item.count}
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-700">Navigation</h3>
      </div>

      {/* Navigation Items */}
      <div className="py-2">
        {sidebarItems.map(item => renderItem(item))}
      </div>
    </div>
  );
};

export default WellsFargoSidebar;