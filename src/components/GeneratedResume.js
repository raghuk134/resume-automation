import React, { useState } from 'react';
import { FiDownload, FiChevronLeft, FiPrinter } from 'react-icons/fi';
import MissingPointsTracker from './MissingPointsTracker';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, BorderStyle, AlignmentType, WidthType, ShadingType, VerticalAlign } from 'docx';
import { saveAs } from 'file-saver';

// PricingDisplay component to show token usage and cost
const PricingDisplay = ({ resumeData }) => {
  // Extract token stats if available
  const tokenStats = resumeData?.tokenStats;
  
  if (!tokenStats) return null;
  
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Resume Processing Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <span className="font-medium">Input Tokens:</span> {tokenStats.promptTokens?.toLocaleString() || 0}
        </div>
        <div>
          <span className="font-medium">Output Tokens:</span> {tokenStats.completionTokens?.toLocaleString() || 0}
        </div>
        <div>
          <span className="font-medium">Total Tokens:</span> {tokenStats.totalTokens?.toLocaleString() || 0}
        </div>
        <div>
          <span className="font-medium">Cost:</span> ${typeof tokenStats.cost === 'number' ? tokenStats.cost.toFixed(6) : '0.000000'}
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-600">
        Based on OpenAI pricing: GPT-4o-mini ($0.15/1M input, $0.60/1M output) or GPT-4o ($3.00/1M input, $10.00/1M output)
      </div>
    </div>
  );
};

const GeneratedResume = ({ resumeData, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to handle resume download is removed in favor of Word document generation

  // Function to handle resume printing
  const handlePrint = () => {
    window.print();
  };

  // Helper function to create education table
  const createEducationTable = (resumeData) => {
    const rows = [
      // Header row
      new TableRow({
        tableHeader: true,
        height: {
          value: 500,
          rule: 'atLeast'
        },
        children: [
          new TableCell({
            width: {
              size: 15,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Degree',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                }),
                new TextRun({
                  text: ' (AA/AS, BA/BS, MA/MS/MBA, PhD, JD)',
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
          new TableCell({
            width: {
              size: 15,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Area of Study',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'School/College/University',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
          new TableCell({
            width: {
              size: 15,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Location',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
          new TableCell({
            width: {
              size: 15,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Was the degree awarded?',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                }),
                new TextRun({
                  text: ' (Yes/No)',
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'OPTIONAL: Date',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                }),
                new TextRun({
                  text: ' (MM/YY)',
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
        ],
      })
    ];

    // Add data rows
    if (resumeData.education && resumeData.education.length > 0) {
      resumeData.education.forEach(edu => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: edu.degree || '' })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: edu.areaOfStudy || '' })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: edu.school || '' })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: edu.location || '' })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: edu.wasAwarded ? 'Yes' : 'No' })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: edu.date || '-' })],
              }),
            ],
          })
        );
      });
    } else {
      // Empty row if no education data
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 6,
              verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, text: '-' })],
            }),
          ],
        })
      );
    }

    return new Table({
      rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        bottom: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        left: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        right: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        insideHorizontal: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        insideVertical: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
      },
    });
  };

  // Helper function to create certifications table
  const createCertificationsTable = (resumeData) => {
    const rows = [
      // Header row
      new TableRow({
        tableHeader: true,
        height: {
          value: 700,
          rule: 'atLeast'
        },
        children: [
          new TableCell({
            width: {
              size: 25,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Certification',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Issued By',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
          new TableCell({
            width: {
              size: 15,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Date Obtained',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                }),
                new TextRun({
                  text: ' (MM/YY)',
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Certification Number',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                }),
                new TextRun({
                  text: ' (If Applicable)',
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
          new TableCell({
            width: {
              size: 20,
              type: WidthType.PERCENTAGE
            },
            shading: {
              fill: 'D1D5DB',
              type: ShadingType.CLEAR
            },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Expiration Date',
                  bold: true,
                  size: 20,
                  color: '000000',
                  font: "Arial"
                }),
                new TextRun({
                  text: ' (If Applicable)',
                  size: 20,
                  color: '000000',
                  font: "Arial"
                })
              ]
            })],
          }),
        ],
      })
    ];

    // Add data rows
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      resumeData.certifications.forEach(cert => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: cert.name || '' })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: cert.issuedBy || '' })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: cert.dateObtained || '' })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: cert.certificationNumber || '-' })],
              }),
              new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, text: cert.expirationDate || '-' })],
              }),
            ],
          })
        );
      });
    } else {
      // Empty row if no certification data
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 5,
              verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, text: '-' })],
            }),
          ],
        })
      );
    }

    return new Table({
      rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        bottom: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        left: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        right: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        insideHorizontal: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
        insideVertical: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: '000000',
        },
      },
    });
  };

  // Helper function to create employment history content
  const createEmploymentHistory = (resumeData) => {
    const paragraphs = [];
    
    if (resumeData.employmentHistory && resumeData.employmentHistory.length > 0) {
      // Sort employment history by workPeriod if available
      const sortedEmploymentHistory = [...resumeData.employmentHistory];
      
      sortedEmploymentHistory.forEach((job, index) => {
        // Add spacing before each employment history except the first one
        if (index > 0) {
          paragraphs.push(
            new Paragraph({
              children: []
            })
          );
        }
        
        // Company row with date right-aligned
        paragraphs.push(
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: job.companyName || 'Company',
                            bold: true,
                            size: 28,
                            color: '0F3E78',
                          })
                        ]
                      })
                    ],
                  }),
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: job.workPeriod || '',
                            color: '0F3E78',
                            size: 28,
                            bold: true,
                          })
                        ]
                      })
                    ],
                  })
                ]
              })
            ]
          })
        );
        
        // Job title row with location right-aligned
        paragraphs.push(
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: job.roleName || 'Role',
                            bold: true,
                            size: 28,
                            color: '0F3E78',
                          })
                        ]
                      })
                    ],
                  }),
                  new TableCell({
                    width: {
                      size: 50,
                      type: WidthType.PERCENTAGE
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: job.location || '',
                            color: '0F3E78',
                            size: 28,
                            bold: true,
                          })
                        ]
                      })
                    ],
                  })
                ]
              })
            ]
          })
        );
        
        if (job.project) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Project:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
                new TextRun({
                  text: ' ' + job.project,
                  bold: true,
                  size: 22,
                  font: "Calibri",
                  color: '000000'
                }),
              ],
            })
          );
        }
        
        // Project Role
        if (job.projectRole) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Project Role:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
                new TextRun({
                  text: ' ' + job.projectRole,
                  bold: true,
                  size: 22,
                  font: "Calibri",
                  color: '000000'
                }),
              ],
            })
          );
        }
        
        // Project Description
        if (job.projectDescription) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Project Description:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
                new TextRun({
                  text: ' ' + job.projectDescription,
                  size: 22,
                  font: "Calibri",
                  color: '000000'
                }),
              ],
            })
          );
        }
        
        // Project Environment
        if (job.projectEnvironment) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Project Environment:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
                new TextRun({
                  text: ' ' + job.projectEnvironment,
                  size: 22,
                  font: "Calibri",
                  color: '000000'
                }),
              ],
            })
          );
        }
        
        // Client
        if (job.client) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Client:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
                new TextRun({
                  text: ' ' + job.client,
                  bold: true,
                  size: 22,
                  font: "Calibri",
                  color: '000000'
                }),
              ],
            })
          );
        }
        
        // Customer
        if (job.customer) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Customer:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
                new TextRun({
                  text: ' ' + job.customer,
                  bold: true,
                  size: 22,
                  font: "Calibri",
                  color: '000000'
                }),
              ],
            })
          );
        }
        
        // Description
        if (job.description) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Description:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
                new TextRun({
                  text: ' ' + job.description,
                  size: 22,
                  font: "Calibri",
                  color: '000000'
                }),
              ],
            })
          );
        }
        
        // Client Projects
        if (job.clientProjects && job.clientProjects.length > 0) {
          paragraphs.push(
            new Paragraph({
              spacing: {
                before: 200
              },
              children: [
                new TextRun({
                  text: 'Client Projects:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
              ],
            })
          );
          
          job.clientProjects.forEach(clientProject => {
            // Client Project header
            const projectTitle = clientProject.clientName && clientProject.projectName 
              ? `${clientProject.clientName} - ${clientProject.projectName}`
              : clientProject.clientName || clientProject.projectName || 'Client Project';
            
            paragraphs.push(
              new Paragraph({
                spacing: {
                  before: 120
                },
                children: [
                  new TextRun({
                    text: projectTitle,
                    bold: true,
                    size: 20,
                    color: '0F3E78',
                    font: "Calibri"
                  }),
                ],
              })
            );
            
            // Project period
            if (clientProject.period) {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Duration: ' + clientProject.period,
                      italic: true,
                      size: 20,
                      color: '666666',
                      font: "Calibri"
                    }),
                  ],
                })
              );
            }
            
            // Project description
            if (clientProject.projectDescription) {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: clientProject.projectDescription,
                      size: 20,
                      font: "Calibri",
                      color: '000000'
                    }),
                  ],
                })
              );
            }
            
            // Project responsibilities
            if (clientProject.responsibilities && clientProject.responsibilities.length > 0) {
              clientProject.responsibilities.forEach(resp => {
                if (resp.trim()) {
                  paragraphs.push(
                    new Paragraph({
                      bullet: {
                        level: 1
                      },
                      indent: {
                        left: 450
                      },
                      children: [
                        new TextRun({
                          text: resp,
                          size: 20,
                          font: "Calibri",
                          color: '000000'
                        }),
                      ],
                    })
                  );
                }
              });
            }
          });
        }
        
        // General Responsibilities
        if (job.responsibilities && job.responsibilities.length > 0 && job.responsibilities.some(r => r.trim())) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Responsibilities',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
              ],
            })
          );
          
          job.responsibilities.forEach(resp => {
            if (resp.trim()) {
              paragraphs.push(
                new Paragraph({
                  bullet: {
                    level: 0
                  },
                  indent: {
                    left: 350
                  },
                  children: [
                    new TextRun({
                      text: resp,
                      size: 22,
                      font: "Calibri",
                      color: '000000'
                    }),
                  ],
                })
              );
            }
          });
        }
        
        // Subsections
        if (job.subsections && job.subsections.length > 0) {
          job.subsections.forEach(subsection => {
            if (subsection.title) {
              // Add spacing before subsection
              paragraphs.push(
                new Paragraph({
                  spacing: {
                    before: 200
                  },
                  children: [
                    new TextRun({
                      text: subsection.title + ':',
                      bold: true,
                      size: 22,
                      color: '000000',
                      font: "Calibri"
                    }),
                  ],
                })
              );
              
              // Add subsection content as bullet points
              if (subsection.content && subsection.content.length > 0) {
                subsection.content.forEach(item => {
                  if (item.trim()) {
                    paragraphs.push(
                      new Paragraph({
                        bullet: {
                          level: 0
                        },
                        indent: {
                          left: 350
                        },
                        children: [
                          new TextRun({
                            text: item,
                            size: 22,
                            font: "Calibri",
                            color: '000000'
                          }),
                        ],
                      })
                    );
                  }
                });
              }
            }
          });
        }
        
        // Key Technologies/Skills
        if (job.keyTechnologies) {
          paragraphs.push(
            new Paragraph({
              spacing: {
                before: 200
              },
              children: [
                new TextRun({
                  text: 'Key Technologies/Skills:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
                new TextRun({
                  text: ' ' + job.keyTechnologies,
                  size: 22,
                  font: "Calibri",
                  color: '000000'
                }),
              ],
            })
          );
        }
        
        // Environment
        if (job.environment) {
          paragraphs.push(
            new Paragraph({
              spacing: {
                before: 200
              },
              children: [
                new TextRun({
                  text: 'Environment:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
                new TextRun({
                  text: ' ' + job.environment,
                  size: 22,
                  font: "Calibri",
                  color: '000000'
                }),
              ],
            })
          );
        }
        
        // Achievements
        if (job.achievements && job.achievements.length > 0) {
          paragraphs.push(
            new Paragraph({
              spacing: {
                before: 200
              },
              children: [
                new TextRun({
                  text: 'Achievements:',
                  bold: true,
                  size: 22,
                  color: '000000',
                  font: "Calibri"
                }),
              ],
            })
          );
          
          job.achievements.forEach(achievement => {
            if (achievement.trim()) {
              paragraphs.push(
                new Paragraph({
                  bullet: {
                    level: 0
                  },
                  indent: {
                    left: 350
                  },
                  children: [
                    new TextRun({
                      text: achievement,
                      size: 22,
                      font: "Calibri",
                      color: '000000'
                    }),
                  ],
                })
              );
            }
          });
        }
      });
    } else {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'No employment history',
            }),
          ],
        })
      );
    }
    
    return paragraphs;
  };

  // Helper function to create technical skills content
  const createTechnicalSkills = (resumeData) => {
    const paragraphs = [];
    
    // Legacy format skills
    if (resumeData.technicalSkills && Object.keys(resumeData.technicalSkills).length > 0) {
      Object.entries(resumeData.technicalSkills).forEach(([category, skills]) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: category + ': ',
                bold: true,
                color: '000000',
                size: 22,
                font: "Calibri"
              }),
              new TextRun({
                text: (Array.isArray(skills) ? skills.join(', ') : skills),
                size: 22,
                color: '000000',
                font: "Calibri"
              }),
            ],
          })
        );
      });
    }
    
    // Nested skill categories
    if (resumeData.skillCategories && resumeData.skillCategories.length > 0) {
      resumeData.skillCategories.forEach(category => {
        // Category name with skills on the same line
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: (category.categoryName || 'Category') + ': ',
                bold: true,
                color: '000000',
                size: 22,
                font: "Calibri"
              }),
              new TextRun({
                text: Array.isArray(category.skills) ? category.skills.join(', ') : (category.skills || ''),
                size: 22,
                color: '000000',
                font: "Calibri"
              }),
            ],
          })
        );
        
        // Main skills are now included with the category name
        
        // Subcategories - ensure they exist and are properly handled
        if (category.subCategories && Array.isArray(category.subCategories) && category.subCategories.length > 0) {
          category.subCategories.forEach(subCategory => {
            // Subcategory name with skills on the same line
            paragraphs.push(
              new Paragraph({
                spacing: {
                  before: 120,
                },
                indent: {
                  left: 350
                },
                children: [
                  new TextRun({
                    text: (subCategory.name || 'Subcategory') + ': ',
                    bold: true,
                    color: '000000',
                    size: 22,
                    font: "Calibri"
                  }),
                  new TextRun({
                    text: Array.isArray(subCategory.skills) ? subCategory.skills.join(', ') : (subCategory.skills || ''),
                    size: 22,
                    color: '000000',
                    font: "Calibri"
                  }),
                ],
              })
            );
          });
        }
      });
    }
    
    if (paragraphs.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'No skills provided',
              size: 22,
              color: '000000',
              font: "Calibri"
            }),
          ],
        })
      );
    }
    
    return paragraphs;
  };

  // Helper function to handle Word document generation and download
  const handleDownloadWord = async () => {
    if (!resumeData) return;
    
    setIsGenerating(true);
    
    try {
      // Create a new Word document
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720,
                  right: 720,
                  bottom: 720,
                  left: 720
                }
              }
            },
            children: [
              // Header with Name
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${resumeData.name || 'Full Name'}`,
                    bold: true,
                    size: 36,
                    color: '0F3E78'
                  })
                ]
              }),
              
              // Title/Role and Requisition Number in a single row using table
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE
                        },
                        shading: {
                          type: ShadingType.CLEAR,
                        },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: 'Title/Role: ',
                                bold: true,
                                size: 28,
                                color: '0F3E78'
                              })
                            ]
                          }),
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: resumeData.title || '',
                                size: 22,
                                font: "Calibri"
                              })
                            ]
                          })
                        ],
                      }),
                      new TableCell({
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE
                        },
                        shading: {
                          type: ShadingType.CLEAR,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            
                            children: [
                              new TextRun({ 
                                text: 'VectorVMS Requisition Number: ',
                                bold: true,
                                size: 28,
                                color: '0F3E78'
                              })
                            ]
                          }),
                          new Paragraph({
                            alignment: AlignmentType.LEFT,
                            indent: {
                              left: 1200 
                            },
                            children: [
                              new TextRun({
                                text: resumeData.requisitionNumber || '',
                                size: 22,
                                font: "Calibri"
                              })
                            ]
                          })
                        ],
                      })
                    ]
                  })
                ]
              }),
              
              // Education Section
              new Paragraph({
                spacing: {
                  before: 200,
                  after: 200
                },
                children: [
                  new TextRun({
                    text: 'Education:',
                    bold: true,
                    size: 28,
                    color: '0F3E78'
                  })
                ]
              }),
              
              // Education Table
              createEducationTable(resumeData),
              
              // Certifications Section
              new Paragraph({
                spacing: {
                  before: 400,
                  after: 200
                },
                children: [
                  new TextRun({
                    text: 'Certifications and Certificates:',
                    bold: true,
                    size: 28,
                    color: '0F3E78'
                  })
                ]
              }),
              
              // Certifications Table
              createCertificationsTable(resumeData),
              
              // Employment History Section
              new Paragraph({
                spacing: {
                  before: 400,
                  after: 200
                },
                children: [
                  new TextRun({
                    text: 'Employment History:',
                    bold: true,
                    size: 28,
                    color: '0F3E78'
                  })
                ]
              }),
              
              // Employment History Content
              ...createEmploymentHistory(resumeData),

              // Professional Summary Section
              new Paragraph({
                spacing: {
                  before: 400,
                  after: 200
                },
                children: [
                  new TextRun({
                    text: 'Professional Summary',
                    bold: true,
                    size: 28,
                    color: '0F3E78'
                  })
                ]
              }),
              
              // Professional Summary Content
              ...(resumeData.professionalSummary || []).map(point => (
                new Paragraph({
                  bullet: {
                    level: 0
                  },
                  indent: {
                    left: 350
                  },
                  children: [
                    new TextRun({
                      text: point,
                      size: 22,
                      font: "Calibri",
                      color: '000000'
                    })
                  ]
                })
              )),
              
                              // Summary subsections - support both formats
                ...(resumeData.summarySections || resumeData.subsections || []).flatMap(subsection => [
                  // Subsection title
                  new Paragraph({
                    spacing: {
                      before: 200,
                      after: 100
                    },
                    children: [
                      new TextRun({
                        text: subsection.title || '',
                        bold: true,
                        size: 22,
                        font: "Calibri",
                        color: '000000'
                      })
                    ]
                  }),
                  // Subsection content (only if there is content)
                  ...(subsection.content && subsection.content.length > 0 
                    ? subsection.content.map(item => (
                        new Paragraph({
                          bullet: {
                            level: 0
                          },
                          indent: {
                            left: 350
                          },
                          children: [
                            new TextRun({
                              text: item,
                              size: 22,
                              font: "Calibri",
                              color: '000000'
                            })
                          ]
                        })
                      ))
                    : []
                  )
              ]),
              
              // Technical Skills Section
              new Paragraph({
                spacing: {
                  before: 400,
                },
                children: [
                  new TextRun({
                    text: 'Technical Skills',
                    bold: true,
                    size: 28,
                    color: '0F3E78'
                  })
                ]
              }),
              
              // Technical Skills Content
              ...createTechnicalSkills(resumeData)
            ]
          }
        ]
      });
      
      // Generate and save the document
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${resumeData.name || 'Resume'}.docx`);
    } catch (error) {
      alert('Error generating Word document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {resumeData.missingPoints && <MissingPointsTracker missingPoints={resumeData.missingPoints} />}
      
      {/* Add PricingDisplay component */}
      <PricingDisplay resumeData={resumeData} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Generated Resume</h2>
        <div className="flex space-x-3">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center"
          >
            <FiPrinter className="mr-2" /> Print
          </button>
          <button
            onClick={handleDownloadWord}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
            disabled={isGenerating}
          >
            <FiDownload className="mr-2" /> {isGenerating ? 'Generating...' : 'Download Word'}
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <FiChevronLeft className="mr-2" /> Edit Resume
          </button>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="border rounded-lg p-8 bg-white shadow-lg print:shadow-none" id="resume-preview">
        {/* Header */}
        <header className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">{resumeData.name || 'Full Name'}</h1>
          <p className="text-xl text-center text-gray-700 mb-4">{resumeData.title || 'Professional Title'}</p>
          
          {resumeData.requisitionNumber && (
            <p className="text-center text-gray-600">Requisition Number: {resumeData.requisitionNumber}</p>
          )}
        </header>

        {/* Professional Summary */}
        {(resumeData.professionalSummary && resumeData.professionalSummary.length > 0) || 
         (resumeData.summarySections && resumeData.summarySections.length > 0) ||
         (resumeData.subsections && resumeData.subsections.length > 0) ? (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-3">Professional Summary</h2>
            
            {/* Main summary points */}
            {resumeData.professionalSummary && resumeData.professionalSummary.length > 0 && (
              <ul className="list-disc pl-5 space-y-1 mb-4">
                {resumeData.professionalSummary.map((point, index) => (
                  <li key={index} className="text-gray-800">{point}</li>
                ))}
              </ul>
            )}
            
            {/* Summary subsections - support both formats */}
            {(resumeData.summarySections || resumeData.subsections) && 
             ((resumeData.summarySections && resumeData.summarySections.length > 0) || 
              (resumeData.subsections && resumeData.subsections.length > 0)) && (
              <div className="mt-4 space-y-3">
                {(resumeData.summarySections || resumeData.subsections).map((subsection, index) => (
                  <div key={index} className="border-l-2 border-blue-100 pl-3 py-1">
                    {subsection.title && (
                      <h4 className="font-medium text-gray-800">{subsection.title}</h4>
                    )}
                    {subsection.content && subsection.content.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {subsection.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-800">{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {/* Work Experience */}
        {resumeData.employmentHistory && resumeData.employmentHistory.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-3">Employment History</h2>
            
            {resumeData.employmentHistory.map((job, index) => (
              <div key={index} className="mb-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{job.companyName || 'Company Name'}</h3>
                    <p className="font-medium">{job.roleName || 'Role'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{job.workPeriod || 'Period'}</p>
                    <p className="text-gray-600">{job.location || 'Location'}</p>
                  </div>
                </div>
                {job.project && (
                  <p className="my-2">
                    <span className="font-medium">Project: </span>
                    <span className="text-gray-800 font-bold">{job.project}</span>
                  </p>
                )}
                
                {job.projectRole && (
                  <p className="my-2">
                    <span className="font-medium">Project Role: </span>
                    <span className="text-gray-800 font-bold">{job.projectRole}</span>
                  </p>
                )}
                
                {job.projectDescription && (
                  <p className="my-2">
                    <span className="font-medium">Project Description: </span>
                    <span className="text-gray-800">{job.projectDescription}</span>
                  </p>
                )}
                
                {job.projectEnvironment && (
                  <p className="my-2">
                    <span className="font-medium">Project Environment: </span>
                    <span className="text-gray-800">{job.projectEnvironment}</span>
                  </p>
                )}
                
                {job.client && (
                  <p className="my-2">
                    <span className="font-medium">Client: </span>
                    <span className="text-gray-800 font-bold">{job.client}</span>
                  </p>
                )}
                
                {job.customer && (
                  <p className="my-2">
                    <span className="font-medium">Customer: </span>
                    <span className="text-gray-800 font-bold">{job.customer}</span>
                  </p>
                )}
                
                {job.description && (
                  <p className="my-2 text-gray-800">{job.description}</p>
                )}

                {/* Client Projects */}
                {job.clientProjects && job.clientProjects.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium mb-2">Client Projects:</p>
                    {job.clientProjects.map((clientProject, projIndex) => (
                      <div key={projIndex} className="border-l-2 border-blue-200 pl-4 mb-3 bg-blue-50 p-3 rounded">
                        <h5 className="font-medium text-blue-800">
                          {clientProject.clientName && clientProject.projectName 
                            ? `${clientProject.clientName} - ${clientProject.projectName}`
                            : clientProject.clientName || clientProject.projectName || `Project ${projIndex + 1}`}
                        </h5>
                        {clientProject.period && (
                          <p className="text-sm text-gray-600 mb-1">Duration: {clientProject.period}</p>
                        )}
                        {clientProject.projectDescription && (
                          <p className="text-gray-700 mb-2">{clientProject.projectDescription}</p>
                        )}
                        {clientProject.responsibilities && clientProject.responsibilities.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1">
                            {clientProject.responsibilities.map((resp, respIndex) => (
                              <li key={respIndex} className="text-gray-800 text-sm">{resp}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">General Responsibilities:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {job.responsibilities.map((resp, respIndex) => (
                        <li key={respIndex} className="text-gray-800">{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Subsections */}
                {job.subsections && job.subsections.length > 0 && job.subsections.map((subsection, subIndex) => (
                  <div key={subIndex} className="mt-3">
                    {subsection.title && (
                      <p className="font-medium">{subsection.title}:</p>
                    )}
                    {subsection.content && subsection.content.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1">
                        {subsection.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-800">{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                
                {job.keyTechnologies && (
                  <p className="mt-2">
                    <span className="font-medium">Key Technologies/Skills: </span>
                    <span className="text-gray-800">{job.keyTechnologies}</span>
                  </p>
                )}
                
                {job.environment && (
                  <p className="mt-2">
                    <span className="font-medium">Environment: </span>
                    <span className="text-gray-800">{job.environment}</span>
                  </p>
                )}
                
                {/* Achievements */}
                {job.achievements && job.achievements.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Achievements:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {job.achievements.map((achievement, achieveIndex) => (
                        <li key={achieveIndex} className="text-gray-800">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-3">Education</h2>
            
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{edu.degree || 'Degree'} {edu.areaOfStudy ? `in ${edu.areaOfStudy}` : ''}</h3>
                    <p className="text-gray-800">{edu.school || 'Institution'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{edu.date || 'Date'}</p>
                    <p className="text-gray-600">{edu.location || 'Location'}</p>
                  </div>
                </div>
                <p className="text-gray-600">{edu.wasAwarded ? 'Degree awarded' : 'Degree in progress'}</p>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-3">Certifications</h2>
            
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold">{cert.name || 'Certification'}</h3>
                <p className="text-gray-800">
                  {cert.issuedBy ? `Issued by: ${cert.issuedBy}` : ''}
                  {cert.dateObtained ? ` • Obtained: ${cert.dateObtained}` : ''}
                </p>
                {cert.expirationDate && (
                  <p className="text-gray-600">Expires: {cert.expirationDate}</p>
                )}
                {cert.certificationNumber && (
                  <p className="text-gray-600">Certification #: {cert.certificationNumber}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Technical Skills */}
        {(resumeData.technicalSkills && Object.keys(resumeData.technicalSkills).length > 0) ||
         (resumeData.skillCategories && resumeData.skillCategories.length > 0) ? (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-3">Technical Skills</h2>
            
            {/* Legacy format skills */}
            {resumeData.technicalSkills && Object.keys(resumeData.technicalSkills).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {Object.entries(resumeData.technicalSkills).map(([category, skills]) => (
                  <div key={category} className="border-l-2 border-blue-100 pl-3 py-1">
                    <h3 className="font-bold">{category}</h3>
                    <p className="text-gray-800">{Array.isArray(skills) ? skills.join(', ') : skills}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Nested skill categories */}
            {resumeData.skillCategories && resumeData.skillCategories.length > 0 && (
              <div className="space-y-5">
                {resumeData.skillCategories.map((category, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <h3 className="font-bold text-lg text-blue-800">{category.categoryName || 'Category'}</h3>
                    
                    {/* Main skills */}
                    {category.skills && category.skills.length > 0 && (
                      <p className="text-gray-800 mb-3 mt-1">
                        {Array.isArray(category.skills) ? category.skills.join(', ') : category.skills}
                      </p>
                    )}
                    
                    {/* Subcategories */}
                    {category.subCategories && Array.isArray(category.subCategories) && category.subCategories.length > 0 && (
                      <div className="ml-4 mt-3 space-y-3">
                        {category.subCategories.map((subCategory, subIndex) => (
                          <div key={subIndex} className="border-l-2 border-gray-300 pl-3 py-1">
                            <h4 className="font-medium text-gray-700">{subCategory.name || 'Subcategory'}</h4>
                            {subCategory.skills && subCategory.skills.length > 0 && (
                              <ul className="list-disc pl-5 space-y-1 mt-1">
                                {Array.isArray(subCategory.skills) ? 
                                  subCategory.skills.map((skill, skillIndex) => (
                                    <li key={skillIndex} className="text-gray-800">{skill}</li>
                                  )) : 
                                  <li className="text-gray-800">{subCategory.skills}</li>
                                }
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>

      {/* Print Styles - Hidden in normal view, visible when printing */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #resume-preview, #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 40px;
            }
          }
        `
      }} />
    </div>
  );
};

export default GeneratedResume;