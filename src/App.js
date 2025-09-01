import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResumeForm from './components/ResumeForm';
import GeneratedResume from './components/GeneratedResume';

function App() {
  // State to track the current step of the process
  const [step, setStep] = useState(1);
  
  // State to hold the resume data
  const [resumeData, setResumeData] = useState(null);
  
  // State to track loading state
  const [loading, setLoading] = useState(false);
  
  // Handler for when resume data is extracted
  const handleResumeDataExtracted = (data) => {
    setResumeData(data);
    setStep(2); // Move to form editing step
  };
  
  // Handler for generating final resume
  const handleGenerateResume = (formData) => {
    setResumeData(formData);
    setStep(3); // Move to resume preview step
  };
  
  // Handler to go back to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <p className="text-sm mt-1">Upload your resume and we'll help you create a standardized version</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="w-2/3 flex items-center">
            <div className={`w-1/3 text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div>Upload Resume</div>
            </div>
            <div className={`w-1/3 text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div>Review & Edit</div>
            </div>
            <div className={`w-1/3 text-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2 ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                3
              </div>
              <div>Generated Resume</div>
            </div>
          </div>
        </div>
        
        {/* Content based on current step */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {step === 1 && (
            <FileUpload 
              onResumeDataExtracted={handleResumeDataExtracted}
              setLoading={setLoading}
            />
          )}
          
          {step === 2 && resumeData && (
            <ResumeForm 
              initialData={resumeData}
              onSubmit={handleGenerateResume}
              onBack={handleBack}
            />
          )}
          
          {step === 3 && resumeData && (
            <GeneratedResume 
              resumeData={resumeData}
              onBack={handleBack}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;