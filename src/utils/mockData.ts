import { Task, TaskCategory } from '../types';

export const generateMockTasks = (): Task[] => {
  const categories = [
    'Final PnL Sign-Off',
    'T+3 Clean PnL Sign-Off',
    'Employee Licensing & Registrations',
    'Anomalous Trading',
    'Cancel and Amend Review',
    'Supervisor Dashboard Signoff',
    'Independent Price Verification (IPV)',
    'Trade Surveillance Alert'
  ];

  const subcategories = {
    'Final PnL Sign-Off': [
      'Equity Derivatives | Options Trading | Institutional Products',
      'Fixed Income | Government Bonds | Institutional Trading',
      'Currency Exchange | FX Derivatives'
    ],
    'Employee Licensing & Registrations': [
      'Securities Dealer Transaction Review',
      'Employee Licensing & Registration Exception'
    ]
  };

  const controlNames = [
    'Rates | Liquid Products - Derivs | Institutional Swaps CLT | T+3 CLEAN PnL Sign-Off',
    'Rates | Liquid Products - Derivs | Institutional Options | PnL Sign-Off', 
    'Rates | Liquid Products - Derivs | Institutional Swaps | PnL Sign-Off',
    'Fixed Income | Government Bonds | Institutional Trading',
    'Equity Derivatives | Options Trading | Institutional Products',
    'WashTrade Detection',
    'FrontRunning Analysis',
    'Periodic Dashboard Signoff',
    'OffMarket Transaction Review',
    'CrossTrade Validation',
    'Currency Exchange | FX Derivatives',
    'The Liquid...'
  ];

  const assignees = [
    'Not Delegated',
    'Alex Thompson',
    'Sarah Mitchell',
    'Michael Rodriguez',
    'System Administrator',
    'Emma Johnson'
  ];

  const teamViews = ['user', 'pending', 'watcher', 'rfi', 'teams', 'extended'];
  const workflowSteps = [
    'Pending Desk Approval of T+3 CLEAN PnL',
    'COMPLETE',
    'Pending Finance Review',
    'Awaiting Supervisor Approval',
    'Under Investigation'
  ];

  const fictionalDescriptions = [
    'This control enables delivery of desk level T+1 Final PnL by Finance Product Controllers for review and acknowledgment by each trading desk. The process ensures accurate position valuation and risk assessment across all trading activities.',
    'Automated surveillance system has flagged potential anomalous trading patterns requiring immediate review and investigation. Analysis includes trade timing, volume patterns, and market impact assessment.',
    'Monthly licensing verification process to ensure all trading personnel maintain current regulatory certifications and registrations. Includes review of continuing education requirements and compliance status.',
    'Independent price verification control for complex derivative instruments. Requires validation of pricing models, market data sources, and valuation methodologies used in daily mark-to-market processes.',
    'Supervisor dashboard review covering key risk metrics, trading limits, and operational controls. Includes sign-off on daily risk reports and exception handling procedures.',
    'Trade surveillance alert requiring investigation of potentially suspicious trading activity. Analysis includes pattern recognition, timing analysis, and compliance with market regulations.'
  ];

  const fictionalAlertTexts = [
    'Equity Options Clean PnL variance detected: Position reconciliation required for institutional trading desk',
    'Fixed Income trading limits exceeded: Review required for government bond trading activities',
    'Currency derivatives pricing model validation needed for FX options portfolio',
    'Employee certification expiring within 30 days: Renewal process must be initiated',
    'Anomalous trading pattern detected: Large block trades executed outside normal market hours',
    'Cross-trade validation failed: Manual review required for institutional client transactions'
  ];

  const mockTasks: Task[] = [];

  for (let i = 0; i < 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subcategoryList = subcategories[category as keyof typeof subcategories];
    const subcategory = subcategoryList ? subcategoryList[Math.floor(Math.random() * subcategoryList.length)] : undefined;
    
    const isCompleted = Math.random() < 0.25;
    
    let status: Task['status'] = 'outstanding';
    if (isCompleted) status = 'completed';

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 30);

    const createdDate = new Date(dueDate.getTime() - Math.random() * 86400000 * 14);
    const daysOverdue = status === 'outstanding' && dueDate < new Date() ? Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const task: Task = {
      id: (167175 + i).toString(),
      title: `${category} - Control Review ${i + 1}`,
      description: fictionalDescriptions[Math.floor(Math.random() * fictionalDescriptions.length)],
      status,
      priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as Task['priority'],
      dueDate,
      createdDate,
      assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
      category,
      subcategory,
      controlName: controlNames[Math.floor(Math.random() * controlNames.length)],
      workflowStep: status === 'completed' ? 'COMPLETE' : workflowSteps[Math.floor(Math.random() * workflowSteps.length)],
      controlType: category.includes('PnL') ? 'Final PnL Sign-Off' : 'Trade Surveillance Alert',
      workflowName: category.includes('PnL') ? 'PnL Sign-Off' : 'Transaction Monitoring',
      responsibleSupervisor: Math.random() < 0.7 ? 'u395315' : undefined,
      responsibleEmployee: Math.random() < 0.8 ? assignees[Math.floor(Math.random() * assignees.length)] : undefined,
      daysOverdue,
      teamView: teamViews[Math.floor(Math.random() * teamViews.length)] as Task['teamView'],
      alertText: Math.random() < 0.4 ? fictionalAlertTexts[Math.floor(Math.random() * fictionalAlertTexts.length)] : undefined,
      files: [],
      notes: [
        {
          id: '1',
          author: Math.random() < 0.5 ? 'Sarah Mitchell' : 'Emma Johnson',
          content: Math.random() < 0.5 ? 
            `Equity Options Clean PnL 06/30/2025 variance: -1,402,103 USD` : 
            `Please find the Final P&L email for Fixed Income Options portfolio`,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 3),
          avatar: Math.random() < 0.5 ? 'SM' : 'EJ',
          approved: Math.random() < 0.3
        }
      ]
    };

    // Add some files to random tasks
    if (Math.random() < 0.6) {
      const fileNames = [
        'Portfolio_Clean_Flash.xlsm',
        'Derivatives_Portfolio_flash.xlsx',
        'trading_details.csv',
        'Options_Analysis_(3).xlsx',
        'Risk_Report_Summary.pdf',
        'Compliance_Review.docx'
      ];
      
      task.files.push({
        id: '1',
        name: fileNames[Math.floor(Math.random() * fileNames.length)],
        size: Math.floor(Math.random() * 5000000) + 100000,
        type: 'application/vnd.ms-excel.sheet.macroEnabled.12',
        url: '#'
      });
    }

    mockTasks.push(task);
  }

  return mockTasks;
};

export const getTaskCategories = (tasks: Task[]): TaskCategory[] => {
  const categoryMap = new Map<string, { count: number; color: string }>();
  
  tasks.forEach(task => {
    const current = categoryMap.get(task.category) || { count: 0, color: '#6B7280' };
    categoryMap.set(task.category, { ...current, count: current.count + 1 });
  });

  return Array.from(categoryMap.entries()).map(([name, { count, color }]) => ({
    id: name,
    name,
    count,
    color
  }));
};