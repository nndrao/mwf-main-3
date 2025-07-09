import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import { Task } from '../types';

interface ControlInstructionsProps {
  task: Task;
}

const ControlInstructions: React.FC<ControlInstructionsProps> = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInstructionContent = (category: string) => {
    switch (category) {
      case 'Final PnL Sign-Off':
        return {
          title: 'Finance / Product Control:',
          content: `This control enables delivery of desk level T+1 Final PnL by Finance Product Controllers for review and acknowledgement by each trading desk. The process ensures accurate position valuation, risk assessment, and compliance with regulatory reporting requirements.`,
          controlNote: 'Standard PnL reconciliation workflow applies. All variances above threshold require documentation.',
          sections: [
            {
              title: 'Finance Product Control Process',
              items: [
                'Upload daily PnL file for applicable trading desk',
                'Ensure all positions are properly marked to market',
                'Verify pricing sources and valuation methodologies',
                'Complete variance analysis for movements above 5% threshold',
                'Document any manual adjustments or overrides'
              ]
            },
            {
              title: 'Trading Desk Review Requirements',
              items: [
                'Review PnL attribution and key profit drivers',
                'Validate position accuracy and trade capture completeness',
                'Confirm pricing methodology for complex instruments',
                'Sign-off on final PnL numbers within 2 business days',
                'Escalate any discrepancies to desk supervisor'
              ]
            }
          ]
        };
      
      case 'Trade Surveillance Alert':
        return {
          title: 'Trade Surveillance Review:',
          content: `This control requires investigation of flagged trading activity that may indicate potential market manipulation, operational errors, or compliance violations. All alerts must be reviewed within 24 hours of generation.`,
          controlNote: 'Alert requires immediate attention. Document all investigation steps and findings.',
          sections: [
            {
              title: 'Investigation Procedures',
              items: [
                'Review trade details including timing, size, and market conditions',
                'Analyze trading patterns and historical behavior',
                'Interview relevant traders and operations staff',
                'Check for system errors or data quality issues',
                'Document findings and recommended actions'
              ]
            },
            {
              title: 'Escalation Requirements',
              items: [
                'Notify compliance team for potential violations',
                'Escalate to legal for regulatory reporting requirements',
                'Inform risk management of operational issues',
                'Update surveillance parameters if needed'
              ]
            }
          ]
        };

      case 'Employee Licensing & Registrations':
        return {
          title: 'Licensing Compliance Review:',
          content: `This control ensures all trading and sales personnel maintain current regulatory licenses and registrations required for their roles. Regular verification prevents compliance violations and regulatory penalties.`,
          controlNote: 'All licensing requirements must be current. Expired licenses require immediate action.',
          sections: [
            {
              title: 'Verification Process',
              items: [
                'Check license status in regulatory databases',
                'Verify continuing education requirements are met',
                'Confirm registration renewals are submitted timely',
                'Update internal systems with current status'
              ]
            }
          ]
        };

      case 'Independent Price Verification (IPV)':
        return {
          title: 'Price Verification Control:',
          content: `Independent validation of pricing for complex financial instruments to ensure accurate valuation and risk measurement. This control is critical for regulatory compliance and internal risk management.`,
          controlNote: 'Price verification must be completed by independent source.',
          sections: [
            {
              title: 'Verification Steps',
              items: [
                'Obtain independent pricing from approved vendors',
                'Compare against internal pricing models',
                'Investigate variances exceeding tolerance levels',
                'Document pricing methodology and sources'
              ]
            }
          ]
        };
      
      default:
        return {
          title: 'Control Instructions:',
          content: task.description,
          controlNote: 'Standard control workflow applies. Follow established procedures.',
          sections: [
            {
              title: 'General Requirements',
              items: [
                'Review all relevant documentation',
                'Complete required analysis within timeframe',
                'Document findings and recommendations',
                'Obtain necessary approvals before completion'
              ]
            }
          ]
        };
    }
  };

  const instructions = getInstructionContent(task.category);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <FileText size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Control Instructions</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
            <ExternalLink size={16} className="text-gray-400 dark:text-gray-500" />
          </button>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          <div className="space-y-4">
            {/* Main Instructions */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{instructions.title}</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{instructions.content}</p>
            </div>

            {/* Instruction Sections */}
            {instructions.sections.map((section, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-3">{section.title}</h5>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Control Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Control Note</h5>
              <p className="text-blue-800 dark:text-blue-300">{instructions.controlNote}</p>
            </div>

            {/* Control Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Control Type</label>
                <p className="text-gray-900 dark:text-white">{task.controlType}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Workflow Name</label>
                <p className="text-gray-900 dark:text-white">{task.workflowName}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlInstructions;