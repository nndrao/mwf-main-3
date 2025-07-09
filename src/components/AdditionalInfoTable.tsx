import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AdditionalInfo } from '../types';

interface AdditionalInfoTableProps {
  additionalInfo: AdditionalInfo;
  isTabletView?: boolean;
}

const AdditionalInfoTable: React.FC<AdditionalInfoTableProps> = ({ additionalInfo, isTabletView = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getVarianceColor = (variance?: number) => {
    if (!variance) return '';
    if (variance > 0) return 'text-red-600 dark:text-red-400';
    if (variance < 0) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Mobile card view
  const renderMobileView = () => (
    <div className="space-y-3">
      {additionalInfo.data.map((row) => (
        <div key={row.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{row.applicationName}</p>
              {row.envName && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {row.envName} {row.envId && `(${row.envId})`}
                </p>
              )}
            </div>
            {row.status && (
              <span className={`text-sm font-medium ${getStatusColor(row.status)}`}>
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Bank/Acct</p>
              <p className="font-medium text-gray-900 dark:text-white">{row.bankAcct}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Value</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(row.totalValue)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Expected</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(row.expectedValue)}</p>
            </div>
            {row.variance !== undefined && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Variance</p>
                <p className={`font-medium ${getVarianceColor(row.variance)}`}>
                  {formatCurrency(Math.abs(row.variance))}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {additionalInfo.totals && (
        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-500">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">Totals</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total Value</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(additionalInfo.totals.totalValue)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Expected</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(additionalInfo.totals.expectedValue)}
              </p>
            </div>
            {additionalInfo.totals.variance !== undefined && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Variance</p>
                <p className={`font-bold ${getVarianceColor(additionalInfo.totals.variance)}`}>
                  {formatCurrency(Math.abs(additionalInfo.totals.variance))}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Desktop/Tablet table view
  const renderTableView = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Application Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Env Name/ID
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Bank/Acct
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
              Total Value
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
              Expected Value
            </th>
            {additionalInfo.data.some(row => row.variance !== undefined) && (
              <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                Variance
              </th>
            )}
            {additionalInfo.data.some(row => row.status) && (
              <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {additionalInfo.data.map((row, index) => (
            <tr key={row.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
              <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                {row.applicationName}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {row.envName} {row.envId && `(${row.envId})`}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {row.bankAcct}
              </td>
              <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                {formatCurrency(row.totalValue)}
              </td>
              <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                {formatCurrency(row.expectedValue)}
              </td>
              {additionalInfo.data.some(r => r.variance !== undefined) && (
                <td className={`px-4 py-3 text-right font-medium ${getVarianceColor(row.variance)}`}>
                  {row.variance !== undefined ? formatCurrency(Math.abs(row.variance)) : '-'}
                </td>
              )}
              {additionalInfo.data.some(r => r.status) && (
                <td className="px-4 py-3 text-center">
                  {row.status && (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      row.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      row.status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
          {additionalInfo.totals && (
            <tr className="bg-gray-100 dark:bg-gray-600 font-bold">
              <td colSpan={3} className="px-4 py-3 text-gray-900 dark:text-white">
                Totals
              </td>
              <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                {formatCurrency(additionalInfo.totals.totalValue)}
              </td>
              <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                {formatCurrency(additionalInfo.totals.expectedValue)}
              </td>
              {additionalInfo.data.some(row => row.variance !== undefined) && (
                <td className={`px-4 py-3 text-right ${getVarianceColor(additionalInfo.totals.variance)}`}>
                  {additionalInfo.totals.variance !== undefined ? 
                    formatCurrency(Math.abs(additionalInfo.totals.variance)) : '-'}
                </td>
              )}
              {additionalInfo.data.some(row => row.status) && <td></td>}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <span>{additionalInfo.title}</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          {isMobile ? renderMobileView() : renderTableView()}
        </div>
      )}
    </div>
  );
};

export default AdditionalInfoTable;