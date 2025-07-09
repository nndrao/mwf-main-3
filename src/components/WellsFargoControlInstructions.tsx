import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Task } from '../types';

interface WellsFargoControlInstructionsProps {
  task: Task;
}

const WellsFargoControlInstructions: React.FC<WellsFargoControlInstructionsProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getInstructionContent = (category: string) => {
    switch (category) {
      case 'Final PnL Sign-Off':
        return {
          title: 'Finance / Product Control:',
          content: `This control enables delivery of desk level T+1 Final PnL by Finance Product Controllers for review and approval by each Desk. Below provides instructions for both Finance Product Controllers as well as for individuals responsible to review T+3 CLEAN PnL for each desk.`,
          forBusinessSignOff: 'Finance / Product Controls'
        };
      
      case 'Trade Surveillance Alert':
        return {
          title: 'Trade Surveillance Review:',
          content: `This control requires investigation of flagged trading activity that may indicate potential market manipulation, operational errors, or compliance violations. All alerts must be reviewed within 24 hours of generation.`,
          forBusinessSignOff: 'Compliance Team'
        };

      default:
        return {
          title: 'Control Instructions:',
          content: task.description || 'Standard control workflow applies. Follow established procedures for review and approval.',
          forBusinessSignOff: 'Business Unit'
        };
    }
  };

  const instructions = getInstructionContent(task.category);

  return (
    <div className="bg-gray-800 text-white rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-bold text-yellow-400">Control Instructions</h3>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 hover:bg-gray-500 rounded"
            onClick={(e) => {
              e.stopPropagation();
              // Handle external link
            }}
          >
            <ExternalLink size={14} className="text-gray-300" />
          </button>
          {isExpanded ? (
            <ChevronUp size={16} className="text-gray-300" />
          ) : (
            <ChevronDown size={16} className="text-gray-300" />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Main Instructions */}
          <div>
            <p className="text-xs text-gray-300 mb-2">{instructions.title}</p>
            <p className="text-xs text-white leading-relaxed">{instructions.content}</p>
          </div>

          {/* For Business Sign Off */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs">
              <span className="text-gray-400">For Business Sign Off: </span>
              <span className="text-white font-medium">{instructions.forBusinessSignOff}</span>
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-900/30 border border-blue-700 p-3 rounded">
            <h4 className="text-xs font-bold text-blue-300 mb-2">Additional Information</h4>
            <p className="text-xs text-gray-300">
              No payload.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellsFargoControlInstructions;