'use client';

import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import type React from 'react';

/**
 * Template Stylish avec Photo (inspiré du CV d'Arthur Davies)
 * Caractéristiques:
 * - Photo de profil en haut à droite
 * - Design Stylish et professionnel
 * - Layout en deux colonnes
 * - Couleurs bleu/gris élégantes
 * - Sections bien définies avec icônes
 */
export const StylishTemplate: React.FC<ResumeTemplateProps> = ({
  resume,
  isEditable = false,
  onEditSection,
}) => {
  const {
    personalInfo,
    educations,
    experiences,
    skills,
    languages,
    certifications,
    projects,
    achievements,
  } = resume;

  const theme = resume.theme || {
    primary: '#2563EB',
    secondary: '#F1F5F9',
    accent: '#1E40AF',
    background: '#FFFFFF',
    text: '#1F2937',
  };

  const handleEditSection = (sectionType: string, sectionId?: string) => {
    if (isEditable && onEditSection) {
      onEditSection(sectionType, sectionId || '');
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto bg-white shadow-xl"
      style={{
        fontFamily: resume.font?.name || 'Inter, sans-serif',
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête avec informations personnelles et photo */}
      <header
        className="relative p-8 pb-6"
        style={{ backgroundColor: theme.secondary }}
        onClick={() => handleEditSection('personalInfo')}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2" style={{ color: theme.accent }}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            {personalInfo?.title && (
              <h2 className="text-xl font-medium mb-4 text-gray-600">{personalInfo.title}</h2>
            )}

            {/* Informations de contact */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600"
              style={{ color: theme.accent }}
            >
              {personalInfo?.phone && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">📞</span>
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo?.email && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">✉️</span>
                  {personalInfo.email}
                </div>
              )}
              {personalInfo?.website && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">🌐</span>
                  {personalInfo.website}
                </div>
              )}
              {personalInfo?.location && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">📍</span>
                  {personalInfo.location}
                </div>
              )}
            </div>
          </div>

          {/* Photo de profil */}
          {personalInfo?.photoUrl && (
            <div className="ml-8">
              <img
                src={personalInfo.photoUrl}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Colonne principale (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          {personalInfo?.description && (
            <section onClick={() => handleEditSection('summary')}>
              <h2
                className="text-xl font-bold mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.description}</p>
            </section>
          )}

          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection('experiences')}>
              <h2
                className="text-xl font-bold mb-6 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map((experience, index) => (
                    <div key={experience.id} className="relative">
                      {/* Timeline dot */}
                      <div
                        className="absolute left-0 top-2 w-3 h-3 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: theme.primary }}
                      />

                      <div className="ml-8">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold">{experience.position}</h3>
                            <h4 className="text-base font-medium" style={{ color: theme.primary }}>
                              {experience.company}
                            </h4>
                            {experience.location && (
                              <p className="text-sm text-gray-600">{experience.location}</p>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1 md:mt-0">
                            <span className="font-medium">
                              {formatDate(experience.startDate)} -{' '}
                              {experience.current
                                ? 'Present'
                                : experience.endDate
                                ? formatDate(experience.endDate)
                                : ''}
                            </span>
                          </div>
                        </div>
                        {experience.description && (
                          <div className="text-gray-700">
                            {experience.description.split('\n').map(
                              (line, lineIndex) =>
                                line.trim() && (
                                  <p key={lineIndex} className="mb-1">
                                    • {line.trim()}
                                  </p>
                                )
                            )}
                          </div>
                        )}
                      </div>

                      {/* Timeline line */}
                      {index < experiences.length - 1 && (
                        <div
                          className="absolute left-1.5 top-8 w-0.5 h-16"
                          style={{ backgroundColor: theme.secondary }}
                        />
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Education */}
          {educations && educations.length > 0 && (
            <section onClick={() => handleEditSection('educations')}>
              <h2
                className="text-xl font-bold mb-6 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                EDUCATION
              </h2>
              <div className="space-y-4">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map(education => (
                    <div key={education.id} className="flex justify-between">
                      <div>
                        <h3 className="font-bold">{education.degree}</h3>
                        <h4 className="font-medium" style={{ color: theme.primary }}>
                          {education.institution}
                        </h4>
                        {education.fieldOfStudy && (
                          <p className="text-sm text-gray-600">{education.fieldOfStudy}</p>
                        )}
                        {education.location && (
                          <p className="text-sm text-gray-600">{education.location}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 text-right">
                        {formatDate(education.startDate)} -{' '}
                        {education.endDate ? formatDate(education.endDate) : 'Present'}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-8">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection('skills')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                SKILLS
              </h2>
              <div className="space-y-4">
                {Object.entries(
                  skills
                    .sort((a, b) => a.order - b.order)
                    .reduce((acc, skill) => {
                      const category = skill.category || 'Technical';
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(skill);
                      return acc;
                    }, {} as Record<string, typeof skills>)
                ).map(([category, skillsInCategory]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-2 text-sm">{category}</h3>
                    <div className="space-y-1">
                      {skillsInCategory.map(skill => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-sm">{skill.name}</span>
                          {skill.level && (
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  backgroundColor: theme.primary,
                                  width:
                                    skill.level === 'Expert'
                                      ? '100%'
                                      : skill.level === 'Advanced'
                                      ? '80%'
                                      : skill.level === 'Intermediate'
                                      ? '60%'
                                      : '40%',
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section onClick={() => handleEditSection('languages')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                LANGUAGES
              </h2>
              <div className="space-y-2">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map(language => (
                    <div key={language.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{language.name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(level => (
                          <div
                            key={level}
                            className="w-3 h-3 rounded-full mr-1"
                            style={{
                              backgroundColor:
                                level <=
                                (language.level === 'Native'
                                  ? 5
                                  : language.level === 'Fluent'
                                  ? 4
                                  : language.level === 'Advanced'
                                  ? 3
                                  : language.level === 'Intermediate'
                                  ? 2
                                  : 1)
                                  ? theme.primary
                                  : '#E5E7EB',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section onClick={() => handleEditSection('certifications')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                CERTIFICATIONS
              </h2>
              <div className="space-y-3">
                {certifications
                  .sort((a, b) => a.order - b.order)
                  .map(cert => (
                    <div key={cert.id}>
                      <h3 className="font-semibold text-sm">{cert.name}</h3>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                      {cert.issueDate && (
                        <p className="text-xs text-gray-500">{formatDate(cert.issueDate)}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section onClick={() => handleEditSection('projects')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                PROJECTS
              </h2>
              <div className="space-y-3">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .map(project => (
                    <div key={project.id}>
                      <h3 className="font-semibold text-sm">{project.title}</h3>
                      {project.description && (
                        <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          className="text-xs hover:underline"
                          style={{ color: theme.primary }}
                        >
                          View Project
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
