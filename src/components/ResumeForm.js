import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlus, FiTrash2 } from 'react-icons/fi';
import MissingPointsTracker from './MissingPointsTracker';

const ResumeForm = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState(initialData || {});

  // Initialize form data from initialData, ensuring subsections are properly handled
  useEffect(() => {
    if (initialData) {
      
      // Create a copy of the initial data to modify
      const updatedData = { ...initialData };
      
      // If we have subsections but no summarySections, copy subsections to summarySections
      if (initialData.subsections && (!initialData.summarySections || initialData.summarySections.length === 0)) {
        updatedData.summarySections = [...initialData.subsections];
      }
      
      // Ensure skillCategories is properly initialized
      if (initialData.skillCategories) {
        updatedData.skillCategories = initialData.skillCategories.map(category => {
          // Ensure subCategories is always an array
          return {
            ...category,
            subCategories: Array.isArray(category.subCategories) ? category.subCategories : []
          };
        });
      } else {
        updatedData.skillCategories = [];
      }
      
      // Set the form data with our updated structure
      setFormData(updatedData);
    }
  }, [initialData]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preserve missing points data if it exists
    if (initialData.missingPoints && !formData.missingPoints) {
      formData.missingPoints = initialData.missingPoints;
    }
    
    onSubmit(formData);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle changes to education items
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: field === 'wasAwarded' ? value === 'true' : value
    };
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  // Add new education item
  const addEducationItem = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: '',
          areaOfStudy: '',
          school: '',
          location: '',
          wasAwarded: false,
          date: ''
        }
      ]
    });
  };

  // Remove education item
  const removeEducationItem = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  // Handle changes to certification items
  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value
    };
    setFormData({
      ...formData,
      certifications: updatedCertifications
    });
  };

  // Add new certification item
  const addCertificationItem = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        {
          name: '',
          issuedBy: '',
          dateObtained: '',
          certificationNumber: '',
          expirationDate: ''
        }
      ]
    });
  };

  // Remove certification item
  const removeCertificationItem = (index) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);
    setFormData({
      ...formData,
      certifications: updatedCertifications
    });
  };

  // Handle changes to employment history items
  const handleEmploymentChange = (index, field, value) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[index] = {
      ...updatedEmployment[index],
      [field]: value
    };
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Handle changes to responsibilities array
  const handleResponsibilityChange = (empIndex, respIndex, value) => {
    const updatedEmployment = [...formData.employmentHistory];
    const updatedResponsibilities = [...updatedEmployment[empIndex].responsibilities];
    updatedResponsibilities[respIndex] = value;
    
    updatedEmployment[empIndex] = {
      ...updatedEmployment[empIndex],
      responsibilities: updatedResponsibilities
    };
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Add new responsibility to employment
  const addResponsibility = (empIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[empIndex] = {
      ...updatedEmployment[empIndex],
      responsibilities: [
        ...updatedEmployment[empIndex].responsibilities,
        ''
      ]
    };
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Remove responsibility from employment
  const removeResponsibility = (empIndex, respIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    const updatedResponsibilities = [...updatedEmployment[empIndex].responsibilities];
    updatedResponsibilities.splice(respIndex, 1);
    
    updatedEmployment[empIndex] = {
      ...updatedEmployment[empIndex],
      responsibilities: updatedResponsibilities
    };
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Handle changes to achievements array
  const handleAchievementChange = (empIndex, achieveIndex, value) => {
    const updatedEmployment = [...formData.employmentHistory];
    if (!updatedEmployment[empIndex].achievements) {
      updatedEmployment[empIndex].achievements = [];
    }
    
    updatedEmployment[empIndex].achievements[achieveIndex] = value;
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Add new achievement to employment
  const addAchievement = (empIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    if (!updatedEmployment[empIndex].achievements) {
      updatedEmployment[empIndex].achievements = [];
    }
    
    updatedEmployment[empIndex].achievements.push('');
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Remove achievement from employment
  const removeAchievement = (empIndex, achieveIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[empIndex].achievements.splice(achieveIndex, 1);
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Add new employment item
  const addEmploymentItem = () => {
    setFormData({
      ...formData,
      employmentHistory: [
        ...formData.employmentHistory,
        {
          companyName: '',
          roleName: '',
          description: '',
          responsibilities: [''],
          client: '',
          customer: '',
          project: '',
          projectRole: '',
          projectDescription: '',
          projectEnvironment: '',
          clientProjects: [],
          subsections: [],
          achievements: [],
          keyTechnologies: '',
          environment: '',
          workPeriod: '',
          location: ''
        }
      ]
    });
  };

  // Remove employment item
  const removeEmploymentItem = (index) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment.splice(index, 1);
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Handle changes to professional summary items
  const handleSummaryChange = (index, value) => {
    const updatedSummary = [...formData.professionalSummary];
    updatedSummary[index] = value;
    
    setFormData({
      ...formData,
      professionalSummary: updatedSummary
    });
  };

  // Add new summary point
  const addSummaryPoint = () => {
    setFormData({
      ...formData,
      professionalSummary: [...formData.professionalSummary, '']
    });
  };

  // Remove summary point
  const removeSummaryPoint = (index) => {
    const updatedSummary = [...formData.professionalSummary];
    updatedSummary.splice(index, 1);
    setFormData({
      ...formData,
      professionalSummary: updatedSummary
    });
  };

  // Handle changes to technical skills
  const handleSkillCategoryChange = (category, value) => {
    setFormData({
      ...formData,
      technicalSkills: {
        ...formData.technicalSkills,
        [category]: value.split(',').map(skill => skill.trim())
      }
    });
  };

  // Add new skill category
  const addSkillCategory = () => {
    const newCategoryName = prompt('Enter new skill category name:');
    
    if (newCategoryName && !formData.technicalSkills[newCategoryName]) {
      setFormData({
        ...formData,
        technicalSkills: {
          ...formData.technicalSkills,
          [newCategoryName]: []
        }
      });
    }
  };

  // Remove skill category
  const removeSkillCategory = (category) => {
    const { [category]: removed, ...restCategories } = formData.technicalSkills;
    setFormData({
      ...formData,
      technicalSkills: restCategories
    });
  };

  // Add new functions to handle subsections
  const handleSubsectionChange = (empIndex, subIndex, field, value) => {
    const updatedEmployment = [...formData.employmentHistory];
    if (!updatedEmployment[empIndex].subsections) {
      updatedEmployment[empIndex].subsections = [];
    }
    
    updatedEmployment[empIndex].subsections[subIndex] = {
      ...updatedEmployment[empIndex].subsections[subIndex],
      [field]: value
    };
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  const addSubsection = (empIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    if (!updatedEmployment[empIndex].subsections) {
      updatedEmployment[empIndex].subsections = [];
    }
    
    updatedEmployment[empIndex].subsections.push({
      title: '',
      content: []
    });
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  const removeSubsection = (empIndex, subIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[empIndex].subsections.splice(subIndex, 1);
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  const handleSubsectionItemChange = (empIndex, subIndex, itemIndex, value) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[empIndex].subsections[subIndex].content[itemIndex] = value;
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  const addSubsectionItem = (empIndex, subIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[empIndex].subsections[subIndex].content.push('');
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  const removeSubsectionItem = (empIndex, subIndex, itemIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[empIndex].subsections[subIndex].content.splice(itemIndex, 1);
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Handle changes to client projects
  const handleClientProjectChange = (empIndex, projIndex, field, value) => {
    const updatedEmployment = [...formData.employmentHistory];
    if (!updatedEmployment[empIndex].clientProjects) {
      updatedEmployment[empIndex].clientProjects = [];
    }
    
    updatedEmployment[empIndex].clientProjects[projIndex] = {
      ...updatedEmployment[empIndex].clientProjects[projIndex],
      [field]: value
    };
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Add new client project
  const addClientProject = (empIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    if (!updatedEmployment[empIndex].clientProjects) {
      updatedEmployment[empIndex].clientProjects = [];
    }
    
    updatedEmployment[empIndex].clientProjects.push({
      clientName: '',
      projectName: '',
      projectDescription: '',
      responsibilities: [],
      period: ''
    });
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Remove client project
  const removeClientProject = (empIndex, projIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[empIndex].clientProjects.splice(projIndex, 1);
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Handle client project responsibilities
  const handleClientProjectResponsibilityChange = (empIndex, projIndex, respIndex, value) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[empIndex].clientProjects[projIndex].responsibilities[respIndex] = value;
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Add client project responsibility
  const addClientProjectResponsibility = (empIndex, projIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    if (!updatedEmployment[empIndex].clientProjects[projIndex].responsibilities) {
      updatedEmployment[empIndex].clientProjects[projIndex].responsibilities = [];
    }
    
    updatedEmployment[empIndex].clientProjects[projIndex].responsibilities.push('');
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Remove client project responsibility
  const removeClientProjectResponsibility = (empIndex, projIndex, respIndex) => {
    const updatedEmployment = [...formData.employmentHistory];
    updatedEmployment[empIndex].clientProjects[projIndex].responsibilities.splice(respIndex, 1);
    
    setFormData({
      ...formData,
      employmentHistory: updatedEmployment
    });
  };

  // Handle changes to summary subsections
  const handleSummarySubsectionChange = (subIndex, field, value) => {
    const updatedSummarySections = [...(formData.summarySections || [])];
    updatedSummarySections[subIndex] = {
      ...updatedSummarySections[subIndex],
      [field]: value
    };
    
    setFormData({
      ...formData,
      summarySections: updatedSummarySections
    });
  };

  // Add new summary subsection
  const addSummarySubsection = () => {
    setFormData({
      ...formData,
      summarySections: [
        ...(formData.summarySections || []),
        {
          title: '',
          content: []
        }
      ]
    });
  };

  // Remove summary subsection
  const removeSummarySubsection = (subIndex) => {
    const updatedSummarySections = [...(formData.summarySections || [])];
    updatedSummarySections.splice(subIndex, 1);
    
    setFormData({
      ...formData,
      summarySections: updatedSummarySections
    });
  };

  // Handle changes to summary subsection items
  const handleSummarySubsectionItemChange = (subIndex, itemIndex, value) => {
    const updatedSummarySections = [...(formData.summarySections || [])];
    updatedSummarySections[subIndex].content[itemIndex] = value;
    
    setFormData({
      ...formData,
      summarySections: updatedSummarySections
    });
  };

  // Add new summary subsection item
  const addSummarySubsectionItem = (subIndex) => {
    const updatedSummarySections = [...(formData.summarySections || [])];
    updatedSummarySections[subIndex].content.push('');
    
    setFormData({
      ...formData,
      summarySections: updatedSummarySections
    });
  };

  // Remove summary subsection item
  const removeSummarySubsectionItem = (subIndex, itemIndex) => {
    const updatedSummarySections = [...(formData.summarySections || [])];
    updatedSummarySections[subIndex].content.splice(itemIndex, 1);
    
    setFormData({
      ...formData,
      summarySections: updatedSummarySections
    });
  };

  // Handle changes to skill categories and subcategories
  const handleSkillSubcategoryChange = (categoryIndex, subIndex, field, value) => {
    const updatedSkillCategories = [...(formData.skillCategories || [])];
    if (!updatedSkillCategories[categoryIndex].subCategories) {
      updatedSkillCategories[categoryIndex].subCategories = [];
    }
    
    updatedSkillCategories[categoryIndex].subCategories[subIndex] = {
      ...updatedSkillCategories[categoryIndex].subCategories[subIndex],
      [field]: value
    };
    
    setFormData({
      ...formData,
      skillCategories: updatedSkillCategories
    });
  };

  // Add new skill category with nested structure
  const addNestedSkillCategory = () => {
    const newCategoryName = prompt('Enter new skill category name:');
    
    if (newCategoryName) {
      setFormData({
        ...formData,
        skillCategories: [
          ...(formData.skillCategories || []),
          {
            categoryName: newCategoryName,
            skills: [],
            subCategories: []
          }
        ]
      });
    }
  };

  // Remove skill category from nested structure
  const removeNestedSkillCategory = (categoryIndex) => {
    const updatedSkillCategories = [...(formData.skillCategories || [])];
    updatedSkillCategories.splice(categoryIndex, 1);
    
    setFormData({
      ...formData,
      skillCategories: updatedSkillCategories
    });
  };

  // Add subcategory to a skill category
  const addSkillSubcategory = (categoryIndex) => {
    const newSubcategoryName = prompt('Enter new subcategory name:');
    
    if (newSubcategoryName) {
      const updatedSkillCategories = [...(formData.skillCategories || [])];
      if (!updatedSkillCategories[categoryIndex].subCategories) {
        updatedSkillCategories[categoryIndex].subCategories = [];
      }
      
      updatedSkillCategories[categoryIndex].subCategories.push({
        name: newSubcategoryName,
        skills: []
      });
      
      setFormData({
        ...formData,
        skillCategories: updatedSkillCategories
      });
    }
  };

  // Remove subcategory from a skill category
  const removeSkillSubcategory = (categoryIndex, subIndex) => {
    const updatedSkillCategories = [...(formData.skillCategories || [])];
    updatedSkillCategories[categoryIndex].subCategories.splice(subIndex, 1);
    
    setFormData({
      ...formData,
      skillCategories: updatedSkillCategories
    });
  };

  // Handle changes to skill category main skills
  const handleNestedSkillCategoryChange = (categoryIndex, value) => {
    const updatedSkillCategories = [...(formData.skillCategories || [])];
    updatedSkillCategories[categoryIndex].skills = value.split(',').map(skill => skill.trim());
    
    setFormData({
      ...formData,
      skillCategories: updatedSkillCategories
    });
  };

  // Handle changes to subcategory skills
  const handleSkillSubcategorySkillsChange = (categoryIndex, subIndex, value) => {
    const updatedSkillCategories = [...(formData.skillCategories || [])];
    updatedSkillCategories[categoryIndex].subCategories[subIndex].skills = value.split(',').map(skill => skill.trim());
    
    setFormData({
      ...formData,
      skillCategories: updatedSkillCategories
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <MissingPointsTracker missingPoints={initialData.missingPoints || {summary: [], experience: [], clientProjects: []}} />
      <h2 className="text-2xl font-semibold mb-6 text-center">Review and Edit Resume Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <section className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-xl font-medium mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title/Role</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requisition Number (if any)</label>
              <input
                type="text"
                name="requisitionNumber"
                value={formData.requisitionNumber || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </section>
        
        {/* Education Section */}
        <section className="border rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Education</h3>
            <button 
              type="button" 
              onClick={addEducationItem}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiPlus className="mr-1" /> Add Education
            </button>
          </div>
          
          {formData.education && formData.education.map((edu, index) => (
            <div key={index} className="border rounded-md p-4 mb-4 bg-white">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">Education #{index + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeEducationItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area of Study</label>
                  <input
                    type="text"
                    value={edu.areaOfStudy || ''}
                    onChange={(e) => handleEducationChange(index, 'areaOfStudy', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School/College/University</label>
                  <input
                    type="text"
                    value={edu.school || ''}
                    onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={edu.date || ''}
                    onChange={(e) => handleEducationChange(index, 'date', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Was Degree Awarded?</label>
                  <select
                    value={edu.wasAwarded ? 'true' : 'false'}
                    onChange={(e) => handleEducationChange(index, 'wasAwarded', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          {(!formData.education || formData.education.length === 0) && (
            <div className="text-gray-500 text-center py-4">
              No education entries. Click "Add Education" to add one.
            </div>
          )}
        </section>
        
        {/* Certifications Section */}
        <section className="border rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Certifications</h3>
            <button 
              type="button" 
              onClick={addCertificationItem}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiPlus className="mr-1" /> Add Certification
            </button>
          </div>
          
          {formData.certifications && formData.certifications.map((cert, index) => (
            <div key={index} className="border rounded-md p-4 mb-4 bg-white">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">Certification #{index + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeCertificationItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={cert.name || ''}
                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issued By</label>
                  <input
                    type="text"
                    value={cert.issuedBy || ''}
                    onChange={(e) => handleCertificationChange(index, 'issuedBy', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Obtained</label>
                  <input
                    type="text"
                    value={cert.dateObtained || ''}
                    onChange={(e) => handleCertificationChange(index, 'dateObtained', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Number</label>
                  <input
                    type="text"
                    value={cert.certificationNumber || ''}
                    onChange={(e) => handleCertificationChange(index, 'certificationNumber', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                  <input
                    type="text"
                    value={cert.expirationDate || ''}
                    onChange={(e) => handleCertificationChange(index, 'expirationDate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {(!formData.certifications || formData.certifications.length === 0) && (
            <div className="text-gray-500 text-center py-4">
              No certifications. Click "Add Certification" to add one.
            </div>
          )}
        </section>
        
        {/* Employment History Section */}
        <section className="border rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Employment History</h3>
            <button 
              type="button" 
              onClick={addEmploymentItem}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiPlus className="mr-1" /> Add Employment
            </button>
          </div>
          
          {formData.employmentHistory && formData.employmentHistory.map((job, index) => (
            <div key={index} className="border rounded-md p-4 mb-4 bg-white">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">Employment #{index + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeEmploymentItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={job.companyName || ''}
                    onChange={(e) => handleEmploymentChange(index, 'companyName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                  <input
                    type="text"
                    value={job.roleName || ''}
                    onChange={(e) => handleEmploymentChange(index, 'roleName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={job.description || ''}
                    onChange={(e) => handleEmploymentChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Period</label>
                  <input
                    type="text"
                    value={job.workPeriod || ''}
                    onChange={(e) => handleEmploymentChange(index, 'workPeriod', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={job.location || ''}
                    onChange={(e) => handleEmploymentChange(index, 'location', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <input
                    type="text"
                    value={job.project || ''}
                    onChange={(e) => handleEmploymentChange(index, 'project', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Project name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client (if applicable)</label>
                  <input
                    type="text"
                    value={job.client || ''}
                    onChange={(e) => handleEmploymentChange(index, 'client', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Main client name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input
                    type="text"
                    value={job.customer || ''}
                    onChange={(e) => handleEmploymentChange(index, 'customer', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Customer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Role</label>
                  <input
                    type="text"
                    value={job.projectRole || ''}
                    onChange={(e) => handleEmploymentChange(index, 'projectRole', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Role in project"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                  <textarea
                    value={job.projectDescription || ''}
                    onChange={(e) => handleEmploymentChange(index, 'projectDescription', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    rows="3"
                    placeholder="Detailed description of the project"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Environment</label>
                  <input
                    type="text"
                    value={job.projectEnvironment || ''}
                    onChange={(e) => handleEmploymentChange(index, 'projectEnvironment', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Technologies and tools used"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Technologies/Skills</label>
                  <input
                    type="text"
                    value={job.keyTechnologies || ''}
                    onChange={(e) => handleEmploymentChange(index, 'keyTechnologies', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                  <input
                    type="text"
                    value={job.environment || ''}
                    onChange={(e) => handleEmploymentChange(index, 'environment', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Development environment"
                  />
                </div>
              </div>
              
              {/* Client Projects */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Client Projects</label>
                  <button 
                    type="button" 
                    onClick={() => addClientProject(index)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FiPlus className="inline mr-1" /> Add Client Project
                  </button>
                </div>
                
                {job.clientProjects && job.clientProjects.map((clientProject, projIndex) => (
                  <div key={projIndex} className="border rounded p-3 mb-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-800">Client Project #{projIndex + 1}</h5>
                      <button 
                        type="button" 
                        onClick={() => removeClientProject(index, projIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                        <input
                          type="text"
                          value={clientProject.clientName || ''}
                          onChange={(e) => handleClientProjectChange(index, projIndex, 'clientName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Client name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                        <input
                          type="text"
                          value={clientProject.projectName || ''}
                          onChange={(e) => handleClientProjectChange(index, projIndex, 'projectName', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Project name"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                        <textarea
                          value={clientProject.projectDescription || ''}
                          onChange={(e) => handleClientProjectChange(index, projIndex, 'projectDescription', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          rows="2"
                          placeholder="Brief description of the project"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                        <input
                          type="text"
                          value={clientProject.period || ''}
                          onChange={(e) => handleClientProjectChange(index, projIndex, 'period', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., 3 months, Jan 2023 - Mar 2023"
                        />
                      </div>
                    </div>
                    
                    {/* Client Project Responsibilities */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Project Responsibilities</label>
                        <button 
                          type="button" 
                          onClick={() => addClientProjectResponsibility(index, projIndex)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <FiPlus className="inline mr-1" /> Add
                        </button>
                      </div>
                      
                      {clientProject.responsibilities && clientProject.responsibilities.map((resp, respIndex) => (
                        <div key={respIndex} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={resp || ''}
                            onChange={(e) => handleClientProjectResponsibilityChange(index, projIndex, respIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md"
                            placeholder="Project responsibility"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeClientProjectResponsibility(index, projIndex, respIndex)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                      
                      {(!clientProject.responsibilities || clientProject.responsibilities.length === 0) && (
                        <p className="text-gray-500 text-sm">No project responsibilities added.</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!job.clientProjects || job.clientProjects.length === 0) && (
                  <p className="text-gray-500 text-sm">No client projects added. Use this for jobs with multiple clients or projects.</p>
                )}
              </div>
              
              {/* Responsibilities */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                  <button 
                    type="button" 
                    onClick={() => addResponsibility(index)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FiPlus className="inline mr-1" /> Add
                  </button>
                </div>
                
                {job.responsibilities && job.responsibilities.map((resp, respIndex) => (
                  <div key={respIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={resp || ''}
                      onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="Responsibility"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeResponsibility(index, respIndex)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                
                {(!job.responsibilities || job.responsibilities.length === 0) && (
                  <p className="text-gray-500 text-sm">No responsibilities added.</p>
                )}
              </div>

              {/* Achievements */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Achievements</label>
                  <button 
                    type="button" 
                    onClick={() => addAchievement(index)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FiPlus className="inline mr-1" /> Add
                  </button>
                </div>
                
                {job.achievements && job.achievements.map((achievement, achieveIndex) => (
                  <div key={achieveIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={achievement || ''}
                      onChange={(e) => handleAchievementChange(index, achieveIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="Achievement"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeAchievement(index, achieveIndex)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                
                {(!job.achievements || job.achievements.length === 0) && (
                  <p className="text-gray-500 text-sm">No achievements added.</p>
                )}
              </div>

              {/* Subsections */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Subsections</label>
                  <button 
                    type="button" 
                    onClick={() => addSubsection(index)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FiPlus className="inline mr-1" /> Add Subsection
                  </button>
                </div>
                
                {job.subsections && job.subsections.map((subsection, subIndex) => (
                  <div key={subIndex} className="border rounded p-3 mb-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex-1 mr-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subsection Title</label>
                        <input
                          type="text"
                          value={subsection.title || ''}
                          onChange={(e) => handleSubsectionChange(index, subIndex, 'title', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., Project Management, Technical Leadership"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeSubsection(index, subIndex)}
                        className="text-red-500 hover:text-red-700 self-start mt-6"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                        <button 
                          type="button" 
                          onClick={() => addSubsectionItem(index, subIndex)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <FiPlus className="inline mr-1" /> Add Point
                        </button>
                      </div>
                      
                      {subsection.content && subsection.content.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={item || ''}
                            onChange={(e) => handleSubsectionItemChange(index, subIndex, itemIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md"
                            placeholder="Bullet point"
                          />
                          <button 
                            type="button" 
                            onClick={() => removeSubsectionItem(index, subIndex, itemIndex)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                      
                      {(!subsection.content || subsection.content.length === 0) && (
                        <p className="text-gray-500 text-sm">No bullet points added.</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!job.subsections || job.subsections.length === 0) && (
                  <p className="text-gray-500 text-sm">No subsections added.</p>
                )}
              </div>
            </div>
          ))}
          
          {(!formData.employmentHistory || formData.employmentHistory.length === 0) && (
            <div className="text-gray-500 text-center py-4">
              No employment history. Click "Add Employment" to add one.
            </div>
          )}
        </section>
        
        {/* Professional Summary Section */}
        <section className="border rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Professional Summary</h3>
            <button 
              type="button" 
              onClick={addSummaryPoint}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiPlus className="mr-1" /> Add Point
            </button>
          </div>
          
          {formData.professionalSummary && formData.professionalSummary.map((point, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={point || ''}
                onChange={(e) => handleSummaryChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
                placeholder="Summary point"
              />
              <button 
                type="button" 
                onClick={() => removeSummaryPoint(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          
          {(!formData.professionalSummary || formData.professionalSummary.length === 0) && (
            <div className="text-gray-500 text-center py-4">
              No summary points. Click "Add Point" to add one.
            </div>
          )}
          
          {/* Summary Subsections */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Summary Subsections</label>
              <button 
                type="button" 
                onClick={addSummarySubsection}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <FiPlus className="inline mr-1" /> Add Subsection
              </button>
            </div>
            
            {formData.summarySections && formData.summarySections.map((subsection, subIndex) => (
              <div key={subIndex} className="border rounded p-3 mb-3 bg-white">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1 mr-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subsection Title</label>
                    <input
                      type="text"
                      value={subsection.title || ''}
                      onChange={(e) => handleSummarySubsectionChange(subIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., Areas of Expertise, Core Competencies"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeSummarySubsection(subIndex)}
                    className="text-red-500 hover:text-red-700 self-start mt-6"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                    <button 
                      type="button" 
                      onClick={() => addSummarySubsectionItem(subIndex)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <FiPlus className="inline mr-1" /> Add Point
                    </button>
                  </div>
                  
                  {subsection.content && subsection.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={item || ''}
                        onChange={(e) => handleSummarySubsectionItemChange(subIndex, itemIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md"
                        placeholder="Bullet point"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeSummarySubsectionItem(subIndex, itemIndex)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                  
                  {(!subsection.content || subsection.content.length === 0) && (
                    <p className="text-gray-500 text-sm">No bullet points added.</p>
                  )}
                </div>
              </div>
            ))}
            
            {(!formData.summarySections || formData.summarySections.length === 0) && (
              <p className="text-gray-500 text-sm">No summary subsections added.</p>
            )}
          </div>
        </section>
        
        {/* Technical Skills Section */}
        <section className="border rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Technical Skills</h3>
            <div className="space-x-2">
              <button 
                type="button" 
                onClick={addSkillCategory}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <FiPlus className="mr-1" /> Add Simple Category
              </button>
              <button 
                type="button" 
                onClick={addNestedSkillCategory}
                className="inline-flex items-center text-green-600 hover:text-green-800"
              >
                <FiPlus className="mr-1" /> Add Nested Category
              </button>
            </div>
          </div>
          
          {/* Simple skill categories (legacy format) */}
          {formData.technicalSkills && Object.keys(formData.technicalSkills).map((category) => (
            <div key={category} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">{category}</label>
                <button 
                  type="button" 
                  onClick={() => removeSkillCategory(category)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
              <textarea
                value={(formData.technicalSkills[category] || []).join(', ')}
                onChange={(e) => handleSkillCategoryChange(category, e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter skills separated by commas"
              />
            </div>
          ))}
          
          {/* Nested skill categories (new format) */}
          {formData.skillCategories && formData.skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-4 border rounded p-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1 mr-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={category.categoryName || ''}
                    onChange={(e) => {
                      const updatedSkillCategories = [...formData.skillCategories];
                      updatedSkillCategories[categoryIndex].categoryName = e.target.value;
                      setFormData({
                        ...formData,
                        skillCategories: updatedSkillCategories
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Programming Languages, Databases"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeNestedSkillCategory(categoryIndex)}
                  className="text-red-500 hover:text-red-700 self-start mt-6"
                >
                  <FiTrash2 />
                </button>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Skills</label>
                <textarea
                  value={(category.skills || []).join(', ')}
                  onChange={(e) => handleNestedSkillCategoryChange(categoryIndex, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter skills separated by commas"
                />
              </div>
              
              {/* Subcategories */}
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Subcategories</label>
                  <button 
                    type="button" 
                    onClick={() => addSkillSubcategory(categoryIndex)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FiPlus className="inline mr-1" /> Add Subcategory
                  </button>
                </div>
                
                {category.subCategories && category.subCategories.map((subCategory, subIndex) => (
                  <div key={subIndex} className="border rounded p-3 mb-2 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex-1 mr-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
                        <input
                          type="text"
                          value={subCategory.name || ''}
                          onChange={(e) => handleSkillSubcategoryChange(categoryIndex, subIndex, 'name', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., Frontend, Backend"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeSkillSubcategory(categoryIndex, subIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                      <textarea
                        value={(subCategory.skills || []).join(', ')}
                        onChange={(e) => handleSkillSubcategorySkillsChange(categoryIndex, subIndex, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter skills separated by commas"
                      />
                    </div>
                  </div>
                ))}
                
                {(!category.subCategories || category.subCategories.length === 0) && (
                  <p className="text-gray-500 text-sm">No subcategories added.</p>
                )}
              </div>
            </div>
          ))}
          
          {(!formData.technicalSkills || Object.keys(formData.technicalSkills).length === 0) && 
           (!formData.skillCategories || formData.skillCategories.length === 0) && (
            <div className="text-gray-500 text-center py-4">
              No skill categories. Click "Add Category" to add one.
            </div>
          )}
        </section>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center"
          >
            <FiChevronLeft className="mr-1" /> Back
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            Generate Resume <FiChevronRight className="ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeForm; 