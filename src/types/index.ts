export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'outstanding' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  createdDate: Date;
  assignedTo: string;
  category: string;
  files: TaskFile[];
  notes: TaskNote[];
  controlName: string;
  workflowStep: string;
  alertText?: string;
  controlType: string;
  workflowName: string;
  responsibleSupervisor?: string;
  responsibleEmployee?: string;
  daysOverdue?: number;
  subcategory?: string;
  teamView?: 'user' | 'pending' | 'watcher' | 'rfi' | 'teams' | 'extended';
}

export interface TaskFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface TaskNote {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar?: string;
  approved?: boolean;
}

export interface TaskCategory {
  id: string;
  name: string;
  count: number;
  color: string;
  subcategories?: TaskSubcategory[];
  daysFilter?: number[];
}

export interface TaskSubcategory {
  id: string;
  name: string;
  count: number;
  parentId: string;
}

export interface TaskFilters {
  status: string;
  category: string;
  priority: string;
  search: string;
  subcategory?: string;
  daysFilter?: string;
  teamView?: string;
}

export interface TaskStats {
  outstanding: number;
  today: number;
  upcoming: number;
  completed: number;
  all: number;
}

export interface ControlInstruction {
  title: string;
  content: string;
  additionalInfo: string;
  sections: InstructionSection[];
}

export interface InstructionSection {
  title: string;
  items: string[];
}