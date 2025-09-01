import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFileText, FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';

// API base URL - Use environment variable for production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FileUpload = ({ onResumeDataExtracted, setLoading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  
  // 🚀 STREAMING STATE MANAGEMENT
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingProgress, setStreamingProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [detectedSections, setDetectedSections] = useState([]);
  const [completedSections, setCompletedSections] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [processingStartTime, setProcessingStartTime] = useState(null);

  // Handle file drop using react-dropzone
  const onDrop = useCallback((acceptedFiles) => {
    // Accept only the first file if multiple are uploaded
    const selectedFile = acceptedFiles[0];
    
    if (!selectedFile) return;
    
    // Validate file type
    const validTypes = ['.pdf', '.docx', '.doc', '.txt'];
    const extension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(extension)) {
      setError('Invalid file type. Please upload PDF, DOCX, DOC, or TXT files.');
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }
    
    // Clear any previous errors and set the file
    setError('');
    setFile(selectedFile);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    }
  });
  
  // 🚀 REVOLUTIONARY STREAMING UPLOAD FUNCTION
  const handleStreamingSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    // Reset streaming state
    setIsStreaming(true);
    setLoading(true);
    setError('');
    setStreamingProgress(0);
    setCurrentMessage('');
    setDetectedSections([]);
    setCompletedSections([]);
    setProcessingStartTime(Date.now());
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // 🔥 INITIATE STREAMING UPLOAD TO NEW ENDPOINT
      const response = await fetch(`${API_BASE_URL}/api/stream-resume-processing`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // 🌊 SETUP SERVER-SENT EVENTS READER
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete events
        const events = buffer.split('\n\n');
        buffer = events.pop(); // Keep incomplete event in buffer
        
        for (const event of events) {
          if (event.startsWith('data: ')) {
            try {
              const data = JSON.parse(event.slice(6));
              handleStreamingEvent(data);
            } catch (parseError) {
              // Silently ignore parse errors
            }
          }
        }
      }
      
    } catch (streamingError) {
      setError(`Streaming failed: ${streamingError.message}`);
    } finally {
      setIsStreaming(false);
      setLoading(false);
    }
  };
  
  // 📊 HANDLE INDIVIDUAL STREAMING EVENTS
  const handleStreamingEvent = (data) => {
    
    switch (data.type) {
      case 'connection':
        setCurrentMessage('Connected to streaming server');
        break;
        
      case 'progress':
        setStreamingProgress(data.progress || 0);
        setCurrentMessage(data.message || '');
        break;
        
      case 'sections_detected':
        setDetectedSections(data.sections || []);
        setCurrentMessage(data.message || '');
        setStreamingProgress(data.progress || 40);
        break;
        
      case 'section_processing':
        setCurrentMessage(data.message || '');
        setStreamingProgress(data.progress || 50);
        break;
        
      case 'section_skip':
        setCurrentMessage(`Skipping ${data.section} section - ${data.message}`);
        // If it's the certifications section, add it to completed sections
        if (data.section === 'certifications') {
          setCompletedSections(prev => [...prev, data.section]);
        }
        break;
        
      case 'section_complete':
        setCompletedSections(prev => [...prev, data.section]);
        setCurrentMessage(data.message || '');
        setStreamingProgress(data.progress || 70);
        
        // Calculate estimated cost (rough) - GPT-4o-mini pricing
        const tokenEstimate = JSON.stringify(data.data).length / 4;
        setEstimatedCost(prev => prev + (tokenEstimate * 0.0006 / 1000)); // GPT-4o-mini output token pricing ($0.0006 per 1K tokens)
        break;
        
      case 'final_data':
        setStreamingProgress(100);
        setCurrentMessage('Processing complete! 🎉');
        
        // Validate and sanitize final data before passing to parent
        if (data.data) {
          
          const sanitizedData = sanitizeResumeData(data.data);
          
          // Add missing points data if available
          if (data.missingPoints) {
            sanitizedData.missingPoints = data.missingPoints;

            // Calculate statistics about missing points
            const missingSummaryCount = data.missingPoints.summary.length;
            const missingExperienceCount = data.missingPoints.experience.length;
            
            if (missingSummaryCount > 0 || missingExperienceCount > 0) {
              setCurrentMessage(`Processing complete! 🎉 (Found ${missingSummaryCount + missingExperienceCount} missing points)`);
            }
          }
          
          onResumeDataExtracted(sanitizedData);
        }
        
        break;
        
      case 'error':
        setError(data.message || 'Unknown streaming error');
        break;
        
      default:
        // Handle unknown event types silently
    }
  };
  
  // 🔧 DATA SANITIZATION FUNCTION
  const sanitizeResumeData = (data) => {
    
    try {
      const sanitized = {
        name: data.name || '',
        title: data.title || '',
        requisitionNumber: data.requisitionNumber || '',
        professionalSummary: Array.isArray(data.professionalSummary) ? data.professionalSummary : [],
        summarySections: Array.isArray(data.summarySections) ? data.summarySections : [],
        subsections: Array.isArray(data.subsections) ? data.subsections : [],
        employmentHistory: Array.isArray(data.employmentHistory) ? data.employmentHistory : [],
        education: Array.isArray(data.education) ? data.education : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        technicalSkills: (data.technicalSkills && typeof data.technicalSkills === 'object') ? data.technicalSkills : {},
        skillCategories: Array.isArray(data.skillCategories) ? data.skillCategories : []
      };
      
      // Ensure employment history has proper structure
      sanitized.employmentHistory = sanitized.employmentHistory.map(job => ({
        companyName: job.companyName || '',
        roleName: job.roleName || '',
        workPeriod: job.workPeriod || '',
        location: job.location || '',
        description: job.description || '',
        project: job.project || '',
        customer: job.customer || '',
        projectRole: job.projectRole || '',
        projectDescription: job.projectDescription || '',
        projectEnvironment: job.projectEnvironment || '',
        responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : (job.responsibilities ? [job.responsibilities] : []),
        client: job.client || '',
        clientProjects: Array.isArray(job.clientProjects) ? job.clientProjects.map(clientProject => ({
          clientName: clientProject.clientName || '',
          projectName: clientProject.projectName || '',
          projectDescription: clientProject.projectDescription || '',
          responsibilities: Array.isArray(clientProject.responsibilities) ? clientProject.responsibilities : [],
          period: clientProject.period || ''
        })) : [],
        subsections: Array.isArray(job.subsections) ? job.subsections.map(subsection => ({
          title: subsection.title || '',
          content: Array.isArray(subsection.content) ? subsection.content : []
        })) : [],
        keyTechnologies: job.keyTechnologies || '',
        environment: job.environment || '',
        achievements: Array.isArray(job.achievements) ? job.achievements : [],
        additionalFields: job.additionalFields || {}
      }));
      
      // Ensure summary subsections have proper structure
      if (Array.isArray(data.summarySections)) {
        sanitized.summarySections = data.summarySections.map(subsection => ({
          title: subsection.title || '',
          content: Array.isArray(subsection.content) ? subsection.content : []
        }));
      } else if (Array.isArray(data.subsections)) {
        sanitized.summarySections = data.subsections.map(subsection => ({
          title: subsection.title || '',
          content: Array.isArray(subsection.content) ? subsection.content : []
        }));
        sanitized.subsections = sanitized.summarySections; // For compatibility
      }
      
      // Ensure skill categories have proper structure
      if (Array.isArray(data.skillCategories)) {
        sanitized.skillCategories = data.skillCategories.map(category => ({
          categoryName: category.categoryName || '',
          skills: Array.isArray(category.skills) ? category.skills : [],
          subCategories: Array.isArray(category.subCategories) ? category.subCategories.map(subCategory => ({
            name: subCategory.name || '',
            skills: Array.isArray(subCategory.skills) ? subCategory.skills : []
          })) : []
        }));
      }
      
      // Ensure education has proper structure
      sanitized.education = sanitized.education.map(edu => ({
        degree: edu.degree || '',
        areaOfStudy: edu.areaOfStudy || '',
        school: edu.school || '',
        location: edu.location || '',
        date: edu.date || '',
        wasAwarded: edu.wasAwarded !== undefined ? edu.wasAwarded : true
      }));
      
      // Ensure certifications have proper structure
      sanitized.certifications = sanitized.certifications.map(cert => ({
        name: cert.name || '',
        issuedBy: cert.issuedBy || '',
        dateObtained: cert.dateObtained || '',
        certificationNumber: cert.certificationNumber || '',
        expirationDate: cert.expirationDate || ''
      }));

      return sanitized;

    } catch (error) {
      
      // Return safe default structure
      return {
        name: '',
        title: '',
        requisitionNumber: '',
        professionalSummary: [],
        summarySections: [],
        subsections: [],
        employmentHistory: [],
        education: [],
        certifications: [],
        technicalSkills: {},
        skillCategories: []
      };
    }
  };

  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Upload Your Resume</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-start">
          <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        } mb-6`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-2">
          {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to select file (PDF, DOCX, DOC, TXT)
        </p>
      </div>
      
      {file && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center">
          <FiFileText className="text-blue-500 text-xl mr-3" />
          <div className="flex-1">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}
      
      {/* 🚀 REVOLUTIONARY STREAMING INTERFACE */}
      {isStreaming && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-blue-900">⚡ Real-time Resume Processing</h3>
            <p className="text-blue-700 text-sm">{currentMessage}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="relative mb-4">
            <div className="flex justify-between text-xs text-blue-600 mb-1">
              <span>Progress</span>
              <span>{streamingProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${streamingProgress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Detected Sections */}
          {detectedSections.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">📋 Detected Resume Sections:</h4>
              <div className="flex flex-wrap gap-2">
                {detectedSections.map((section, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      completedSections.includes(section) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {completedSections.includes(section) && <FiCheckCircle className="inline mr-1" />}
                    {!completedSections.includes(section) && <FiLoader className="inline mr-1 animate-spin" />}
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Real-time Cost Tracking */}
          {estimatedCost > 0 && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700">💰 Estimated Cost:</span>
                <span className="font-semibold text-green-800">${estimatedCost.toFixed(6)}</span>
              </div>
            </div>
          )}
          
          {/* Processing Time */}
          {processingStartTime && (
            <div className="text-center text-xs text-blue-600">
              ⏱️ Processing for {((Date.now() - processingStartTime) / 1000).toFixed(1)}s
            </div>
          )}
        </div>
      )}
      
      {/* Button Section */}
      <div className="flex justify-center">
        <button 
          onClick={handleStreamingSubmit}
          disabled={!file || isStreaming}
          className={`px-6 py-3 rounded-lg text-white font-medium flex items-center ${
            file && !isStreaming ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isStreaming ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <FiUpload className="mr-2" />
              Process Resume
            </>
          )}
        </button>
      </div>
      
    </div>
  );
};

export default FileUpload; 