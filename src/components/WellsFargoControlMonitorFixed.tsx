import React, { useState } from 'react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

const WellsFargoControlMonitorFixed: React.FC = () => {
  const [activeView, setActiveView] = useState('all');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('my-open-tasks');
  const [daysToDisplay, setDaysToDisplay] = useState('30');
  const [teamView, setTeamView] = useState('user-only');
  const [expandedSidebar, setExpandedSidebar] = useState<Set<string>>(new Set(['my-tasks']));
  
  const {
    tasks,
    allTasks,
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    updateTask
  } = useTasks();

  // Filter tasks based on active view
  const filteredTasks = allTasks.filter(task => {
    switch (activeView) {
      case 'outstanding':
        return task.status === 'outstanding' || task.status === 'overdue';
      case 'completed':
        return task.status === 'completed';
      case 'all':
      default:
        return true;
    }
  });

  const formatDateTime = (date: Date) => {
    return format(date, 'MMM dd, yyyy, h:mm a');
  };

  const handleSelectTask = (taskId: string) => {
    const newSelected = new Set(selectedTaskIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
  };

  const toggleSidebarItem = (itemId: string) => {
    const newExpanded = new Set(expandedSidebar);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedSidebar(newExpanded);
  };

  const getRowColor = (task: Task) => {
    if (task.status === 'overdue') return '#FFEBEE';
    if (task.status === 'completed') return '#E8F5E9';
    if (task.alertText) return '#FFF9C4';
    return '#FFFFFF';
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#D71E2B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: 'white', color: '#D71E2B', padding: '4px 12px', fontWeight: 'bold', fontSize: '16px' }}>
            WELLS FARGO
          </div>
          <span style={{ fontSize: '16px', fontWeight: '500' }}>Control Monitor</span>
        </div>
        <div style={{ fontSize: '14px' }}>Written Supervisory Procedures (WSPs)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', cursor: 'pointer' }}>Support</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '14px' }}>Vona, Joseph ▼</span>
          </div>
          <button style={{ backgroundColor: '#0066CC', color: 'white', border: 'none', padding: '4px 16px', cursor: 'pointer', fontSize: '14px' }}>
            Exit
          </button>
        </div>
      </div>

      {/* Subheader */}
      <div style={{ backgroundColor: '#333333', color: 'white', textAlign: 'center', padding: '4px', fontSize: '12px' }}>
        You are currently viewing Control Monitor as Vona, Joseph All actions are disabled.
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: '260px', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc', overflow: 'auto' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid #ccc' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Summary</div>
          </div>
          
          {/* My Tasks Section */}
          <div>
            <div 
              style={{ 
                padding: '8px 12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                backgroundColor: activeView === 'my-tasks' ? '#e0e0e0' : 'transparent'
              }}
              onClick={() => toggleSidebarItem('my-tasks')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {expandedSidebar.has('my-tasks') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span style={{ fontSize: '13px', fontWeight: '500' }}>My Tasks (User Only)</span>
              </div>
            </div>
            
            {expandedSidebar.has('my-tasks') && (
              <div style={{ paddingLeft: '24px' }}>
                <div 
                  style={{ 
                    padding: '6px 12px', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: activeView === 'all' ? '#1976D2' : 'transparent',
                    color: activeView === 'all' ? 'white' : '#333'
                  }}
                  onClick={() => setActiveView('all')}
                >
                  <span style={{ fontSize: '13px' }}>ALL</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>1858</span>
                </div>
                <div 
                  style={{ 
                    padding: '6px 12px', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: activeView === 'outstanding' ? '#1976D2' : 'transparent',
                    color: activeView === 'outstanding' ? 'white' : '#FF6B35'
                  }}
                  onClick={() => setActiveView('outstanding')}
                >
                  <span style={{ fontSize: '13px' }}>Outstanding</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>1600</span>
                </div>
                <div 
                  style={{ 
                    padding: '6px 12px', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: activeView === 'completed' ? '#1976D2' : 'transparent',
                    color: activeView === 'completed' ? 'white' : '#4CAF50'
                  }}
                  onClick={() => setActiveView('completed')}
                >
                  <span style={{ fontSize: '13px' }}>Completed</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>258</span>
                </div>
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          {[
            { label: 'Employee Licensing & Registrations', count: 315 },
            { label: 'T+3 Clean PnL Sign-Off', count: 244 },
            { label: 'Anomalous Trading', count: 188 },
            { label: 'Cancel and Amend Review', count: 85 },
            { label: 'Supervisor Dashboard Signoff', count: 58 },
            { label: 'Independent Price Verification (IPV)', count: 14 },
            { label: 'Trade Surveillance Alert', count: 9 }
          ].map((item, index) => (
            <div 
              key={index}
              style={{ 
                padding: '8px 12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderBottom: '1px solid #e0e0e0'
              }}
            >
              <span style={{ fontSize: '13px' }}>{item.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>{item.count}</span>
            </div>
          ))}
        </div>

        {/* Main Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ backgroundColor: '#4A4A4A', padding: '8px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ 
                  backgroundColor: activeTab === 'my-open-tasks' ? '#0066CC' : '#666', 
                  color: 'white', 
                  border: 'none', 
                  padding: '6px 16px', 
                  cursor: 'pointer',
                  fontSize: '13px'
                }}>
                  My Open Tasks
                </button>
                <button style={{ 
                  backgroundColor: activeTab === 'my-tasks' ? '#0066CC' : '#666', 
                  color: 'white', 
                  border: 'none', 
                  padding: '6px 16px', 
                  cursor: 'pointer',
                  fontSize: '13px'
                }}>
                  My Tasks (User Only)
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ backgroundColor: '#999', color: 'white', border: 'none', padding: '6px 16px', cursor: 'pointer', fontSize: '13px' }}>
                  Initiate Sign Off
                </button>
                <button style={{ backgroundColor: '#0066CC', color: 'white', border: 'none', padding: '6px 16px', cursor: 'pointer', fontSize: '13px' }}>
                  Request for Info
                </button>
                <button style={{ backgroundColor: '#0066CC', color: 'white', border: 'none', padding: '6px 16px', cursor: 'pointer', fontSize: '13px' }}>
                  Add Notes/Files
                </button>
                <button style={{ backgroundColor: '#0066CC', color: 'white', border: 'none', padding: '6px 16px', cursor: 'pointer', fontSize: '13px' }}>
                  View Activity
                </button>
                <button style={{ backgroundColor: '#0066CC', color: 'white', border: 'none', padding: '6px 16px', cursor: 'pointer', fontSize: '13px' }}>
                  Delegation & Assignment
                </button>
              </div>
            </div>

            {/* Filter Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ color: 'white', fontSize: '12px' }}>Days To Display (GM+2):</label>
                <select style={{ padding: '2px 8px', fontSize: '12px' }}>
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ color: 'white', fontSize: '12px' }}>Team View:</label>
                <select style={{ padding: '2px 8px', fontSize: '12px' }}>
                  <option>My Watcher View</option>
                  <option>My Tasks (User Only)</option>
                  <option>My RFI Tasks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}>
              {/* Table Header */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '40px 80px 150px 60px 150px auto 80px',
                backgroundColor: '#2C3E50',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                <div style={{ padding: '8px', borderRight: '1px solid #34495e', display: 'flex', alignItems: 'center' }}>
                  <input type="checkbox" />
                </div>
                <div style={{ padding: '8px', borderRight: '1px solid #34495e' }}>Task ID</div>
                <div style={{ padding: '8px', borderRight: '1px solid #34495e' }}>Assignment</div>
                <div style={{ padding: '8px', borderRight: '1px solid #34495e', textAlign: 'center' }}>Files</div>
                <div style={{ padding: '8px', borderRight: '1px solid #34495e' }}>Due Date ⬇</div>
                <div style={{ padding: '8px', borderRight: '1px solid #34495e' }}>Control Name</div>
                <div style={{ padding: '8px', textAlign: 'center' }}>Alert Text</div>
              </div>

              {/* Table Body */}
              {filteredTasks.slice(0, 10).map((task) => (
                <div 
                  key={task.id}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '40px 80px 150px 60px 150px auto 80px',
                    borderBottom: '1px solid #ddd',
                    backgroundColor: getRowColor(task),
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleRowClick(task)}
                >
                  <div style={{ padding: '8px', borderRight: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedTaskIds.has(task.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectTask(task.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div style={{ padding: '8px', borderRight: '1px solid #ddd', color: '#0066CC' }}>{task.id}</div>
                  <div style={{ padding: '8px', borderRight: '1px solid #ddd' }}>Not Delegated</div>
                  <div style={{ padding: '8px', borderRight: '1px solid #ddd', textAlign: 'center' }}>
                    {task.files.length > 0 && <FileText size={14} />}
                  </div>
                  <div style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{formatDateTime(task.dueDate)}</div>
                  <div style={{ padding: '8px', borderRight: '1px solid #ddd', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.controlName}
                  </div>
                  <div style={{ padding: '8px', textAlign: 'center' }}>
                    {task.alertText && <span style={{ color: '#FFA500', fontSize: '16px' }}>⚠</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Panel */}
          {selectedTask && (
            <div style={{ height: '300px', backgroundColor: '#2C3E50', color: 'white', display: 'flex' }}>
              {/* Task Details */}
              <div style={{ flex: 1, padding: '16px', borderRight: '1px solid #34495e' }}>
                <h3 style={{ color: '#F39C12', fontSize: '14px', marginBottom: '12px' }}>Task Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', fontSize: '12px' }}>
                  <span style={{ color: '#95A5A6' }}>Task ID:</span>
                  <span>{selectedTask.id}</span>
                  <span style={{ color: '#95A5A6' }}>Due Status:</span>
                  <span>{selectedTask.status.toUpperCase()}</span>
                  <span style={{ color: '#95A5A6' }}>Due Date (Local):</span>
                  <span>{formatDateTime(selectedTask.dueDate)}</span>
                  <span style={{ color: '#95A5A6' }}>Date Created (Local):</span>
                  <span>{formatDateTime(selectedTask.createdDate)}</span>
                  <span style={{ color: '#95A5A6' }}>Workflow Step:</span>
                  <span>{selectedTask.workflowStep}</span>
                  <span style={{ color: '#95A5A6' }}>Days Overdue:</span>
                  <span>{selectedTask.daysOverdue || '0'}</span>
                  <span style={{ color: '#95A5A6' }}>Control Name:</span>
                  <span>{selectedTask.controlName}</span>
                  <span style={{ color: '#95A5A6' }}>Control Type:</span>
                  <span>{selectedTask.controlType}</span>
                  <span style={{ color: '#95A5A6' }}>Workflow Name:</span>
                  <span>{selectedTask.workflowName}</span>
                </div>
              </div>

              {/* Notes */}
              <div style={{ flex: 1, padding: '16px' }}>
                <h3 style={{ color: '#F39C12', fontSize: '14px', marginBottom: '12px' }}>Notes</h3>
                {selectedTask.notes.length > 0 ? (
                  <div style={{ fontSize: '12px' }}>
                    {selectedTask.notes.map((note) => (
                      <div key={note.id} style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          backgroundColor: '#27AE60', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {note.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 'bold' }}>{note.author}</span>
                            {note.approved && (
                              <span style={{ backgroundColor: '#27AE60', color: 'white', padding: '2px 8px', fontSize: '10px', borderRadius: '2px' }}>
                                approved
                              </span>
                            )}
                          </div>
                          <div style={{ color: '#BDC3C7', marginTop: '4px' }}>{note.content}</div>
                          <div style={{ color: '#7F8C8D', fontSize: '10px', marginTop: '2px' }}>
                            {format(note.timestamp, 'MMM dd, yyyy, h:mm a')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#95A5A6', fontSize: '12px' }}>No notes available.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellsFargoControlMonitorFixed;