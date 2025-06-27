'use client';

import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import type React from 'react';

/**
 * Template Timeline
 * Caractéristiques:
 * - Design très structuré et Timeline
 * - Layout en deux colonnes (65/35)
 * - Sections bien définies avec des titres en majuscules
 * - Typographie claire et hiérarchisée
 * - Couleurs sobres et Timeline
 * - Inspiré du CV de Steve Green
 */
export const TimelineTemplate: React.FC<ResumeTemplateProps> = ({
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
    hobbies
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
      className="max-w-4xl mx-auto bg-white shadow-lg"
      style={{
        fontFamily: resume.font?.name || 'Arial, sans-serif',
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête */}
      <div className="p-8 pb-6" onClick={() => handleEditSection('personalInfo')}>
        <h1 className="text-4xl font-bold mb-2 tracking-wide" style={{ color: theme.text }}>
          {personalInfo?.firstName?.toUpperCase()} {personalInfo?.lastName?.toUpperCase()}
        </h1>
        {personalInfo?.title && (
          <h2 className="text-lg mb-4" style={{ color: theme.primary }}>
            {personalInfo.title}
          </h2>
        )}

        {/* Contact info en ligne */}
        <div className="flex flex-wrap gap-8 text-sm text-gray-600">
          {personalInfo?.phone && (
            <span className="flex items-center">
              <span className="mr-2">📱</span>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo?.email && (
            <span className="flex items-center">
              <span className="mr-2">✉️</span>
              {personalInfo.email}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center">
              <span className="mr-2">📍</span>
              {personalInfo.location}
            </span>
          )}
          {personalInfo?.website && (
            <span className="flex items-center">
              <span className="mr-2">🌐</span>
              {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8">
        {/* Colonne principale (65%) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          {personalInfo?.description && (
            <section onClick={() => handleEditSection('personalInfo')}>
              <h2
                className="text-lg font-bold mb-4 uppercase tracking-wide"
                style={{ color: theme.text }}
              >
                Summary
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 text-justify">
                {personalInfo.description}
              </p>
            </section>
          )}

          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection('experiences')}>
              <h2
                className="text-lg font-bold mb-6 uppercase tracking-wide"
                style={{ color: theme.text }}
              >
                Experience
              </h2>
              <div className="space-y-6">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map(experience => (
                    <div key={experience.id} className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span
                              className="text-sm font-bold mr-2"
                              style={{ color: theme.primary }}
                            >
                              {formatDate(experience.startDate)} -{' '}
                              {experience.current
                                ? 'Present'
                                : experience.endDate
                                ? formatDate(experience.endDate)
                                : ''}
                            </span>
                            <div className="flex-1 h-px bg-gray-300 mx-2"></div>
                          </div>
                          <h3 className="font-bold text-base mb-1">{experience.position}</h3>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            {experience.company}
                            {experience.location && (
                              <span className="text-gray-500">, {experience.location}</span>
                            )}
                          </h4>
                        </div>
                      </div>
                      {experience.description && (
                        <div className="text-sm text-gray-700 ml-4">
                          {experience.description.split('\n').map(
                            (line, index) =>
                              line.trim() && (
                                <p key={index} className="mb-2">
                                  • {line.trim()}
                                </p>
                              )
                          )}
                        </div>
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
                className="text-lg font-bold mb-6 uppercase tracking-wide"
                style={{ color: theme.text }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map(education => (
                    <div key={education.id}>
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-bold mr-2" style={{ color: theme.primary }}>
                          {formatDate(education.startDate)} -{' '}
                          {education.endDate ? formatDate(education.endDate) : 'Present'}
                        </span>
                        <div className="flex-1 h-px bg-gray-300 mx-2"></div>
                      </div>
                      <h3 className="font-bold text-base">{education.degree}</h3>
                      <h4 className="text-sm text-gray-700">
                        {education.institution}
                        {education.location && (
                          <span className="text-gray-500">, {education.location}</span>
                        )}
                      </h4>
                      {education.fieldOfStudy && (
                        <p className="text-sm text-gray-600 mt-1">{education.fieldOfStudy}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar droite (35%) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <section onClick={() => handleEditSection('achievements')}>
              <h2
                className="text-lg font-bold mb-4 uppercase tracking-wide"
                style={{ color: theme.text }}
              >
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map(achievement => (
                    <div key={achievement.id} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1 flex-shrink-0">✓</span>
                      <div>
                        <h3 className="font-semibold text-sm">{achievement.title}</h3>
                        {achievement.description && (
                          <p className="text-xs text-gray-700 mt-1">{achievement.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection('skills')}>
              <h2
                className="text-lg font-bold mb-4 uppercase tracking-wide"
                style={{ color: theme.text }}
              >
                Skills
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
                    <h3 className="text-sm font-bold mb-2" style={{ color: theme.primary }}>
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {skillsInCategory.map(skill => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-sm">{skill.name}</span>
                          {skill.level && (
                            <div className="flex items-center">
                              <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
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
                              <span className="text-xs text-gray-500 w-6">
                                {skill.level === 'Expert'
                                  ? '5'
                                  : skill.level === 'Advanced'
                                  ? '4'
                                  : skill.level === 'Intermediate'
                                  ? '3'
                                  : '2'}
                              </span>
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
                className="text-lg font-bold mb-4 uppercase tracking-wide"
                style={{ color: theme.text }}
              >
                Languages
              </h2>
              <div className="space-y-2">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map(language => (
                    <div key={language.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{language.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {language.level}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section onClick={() => handleEditSection('certifications')}>
              <h2
                className="text-lg font-bold mb-4 uppercase tracking-wide"
                style={{ color: theme.text }}
              >
                Certifications
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
                className="text-lg font-bold mb-4 uppercase tracking-wide"
                style={{ color: theme.text }}
              >
                Projects
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
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs hover:underline mt-1 block"
                          style={{ color: theme.primary }}
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Hobbies */}
          {hobbies && hobbies.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('hobbies')}>
              <h2
                className="text-xl font-bold uppercase mb-4 pb-2 flex items-center gap-2"
                style={{ borderBottom: `2px solid ${theme.primary}` }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17a4.25 4.25 0 104.5-7.5m-7.5 4.5a4.25 4.25 0 107.5 4.5m1.5-8a4.25 4.25 0 11-4.5-7.5"
                  />
                </svg>
                Hobbies
              </h2>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {hobbies.map((hobby, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <p className='text-sm font-semibold'>{hobby.name}</p>
                    {hobby.icon && (
                      <span className="text-xs" aria-label="Icône hobby">{hobby.icon}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="pb-8"></div>
    </div>
  );
};
