import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface SignoffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTasks: Task[];
  onSubmit: (data: SignoffData) => void;
}

interface SignoffData {
  document: string;
  notes: string;
  files: File[];
  additionalNotes: string;
}

const SignoffDialog: React.FC<SignoffDialogProps> = ({ 
  isOpen, 
  onClose, 
  selectedTasks,
  onSubmit 
}) => {
  const [formData, setFormData] = useState<SignoffData>({
    document: '',
    notes: '',
    files: [],
    additionalNotes: ''
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...droppedFiles]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...selectedFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const selectedTasksInfo = selectedTasks.slice(0, 3);
  const remainingCount = selectedTasks.length - 3;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 md:inset-x-auto md:inset-y-auto md:top-[50%] md:left-[50%] md:translate-y-[-50%] md:translate-x-[-50%] md:w-[600px] md:max-h-[90vh] md:rounded-lg bg-gray-900 shadow-2xl z-50 overflow-hidden border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Sign Off/Update Task(s)</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Selected Tasks */}
            <div>
              <h3 className="text-sm font-medium text-yellow-400 mb-3">Selected Task(s)</h3>
              <div className="space-y-2">
                {selectedTasksInfo.map(task => (
                  <div key={task.id} className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-400">ID {task.id}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-white flex-1 truncate">{task.title}</span>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="text-sm text-gray-400">
                    and {remainingCount} more task{remainingCount > 1 ? 's' : ''}...
                  </div>
                )}
              </div>
            </div>

            {/* Sign Off/Workflow Submission */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4">Sign Off/Workflow Submission</h3>
              
              {/* Select a Document */}
              <div className="mb-4">
                <label className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
                  <span>Select a Document</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="bg-gray-800 border border-gray-600 rounded p-3">
                  <select
                    value={formData.document}
                    onChange={(e) => setFormData(prev => ({ ...prev, document: e.target.value }))}
                    className="w-full bg-transparent text-white focus:outline-none"
                    required
                  >
                    <option value="">Choose one below</option>
                    <option value="rates-head-complete">Rates Head (C) - This task will be marked as COMPLETE</option>
                    <option value="rates-head-complete-comments">Rates Head (C) - This task will be marked as COMPLETE - COMMENTS</option>
                    <option value="equity-head-complete">Equity Head (C) - This task will be marked as COMPLETE</option>
                    <option value="fx-head-complete">FX Head (C) - This task will be marked as COMPLETE</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="text-sm text-gray-300 block mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  rows={4}
                  placeholder="Enter your notes here..."
                />
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                    ${isDragging 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                    }
                  `}
                >
                  <Upload size={40} className="mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400 mb-1">Drop and drag files here to upload</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                
                {/* Uploaded Files */}
                {formData.files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-300">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">My Files</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                rows={2}
                placeholder="Enter additional notes..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-400 text-center md:text-left">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>It's 5:22pm. Any tasks submitted now will be timestamped for tomorrow.</span>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 md:flex-initial px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.document}
                className="flex-1 md:flex-initial px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignoffDialog;