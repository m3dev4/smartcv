'use client';

import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import type React from 'react';

/**
 * Template Clean Professional de CV (inspiré du design Sophia Foster)
 * Caractéristiques:
 * - Design très épuré et minimaliste
 * - Layout en deux colonnes (70/30)
 * - Typographie simple et claire
 * - Pas de bordures, juste des lignes de séparation
 * - Fond blanc avec texte noir
 * - Accents de couleur subtils
 * - Très professionnel et structuré
 */
export const CleanProfessionalTemplate: React.FC<ResumeTemplateProps> = ({
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
    secondary: '#F8FAFC',
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
      {/* En-tête avec nom et titre */}
      <header className="p-8 pb-6" onClick={() => handleEditSection('personalInfo')}>
        <h1 className="text-4xl font-bold mb-2 tracking-wide" style={{ color: theme.text }}>
          {personalInfo?.firstName?.toUpperCase()} {personalInfo?.lastName?.toUpperCase()}
        </h1>
        {personalInfo?.title && (
          <h2 className="text-lg text-gray-600 mb-4">{personalInfo.title}</h2>
        )}

        {/* Informations de contact */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
          {personalInfo?.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 px-8">
        {/* Colonne principale (70%) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Summary */}
          {personalInfo?.description && (
            <section onClick={() => handleEditSection('summary')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                SUMMARY
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">{personalInfo.description}</p>
            </section>
          )}

          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection('experiences')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map(experience => (
                    <div key={experience.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-base">{experience.position}</h3>
                          <h4 className="text-sm font-medium" style={{ color: theme.primary }}>
                            {experience.company}
                          </h4>
                          {experience.location && (
                            <p className="text-sm text-gray-600">{experience.location}</p>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          {formatDate(experience.startDate)} -{' '}
                          {experience.current
                            ? 'Present'
                            : experience.endDate
                            ? formatDate(experience.endDate)
                            : ''}
                        </div>
                      </div>
                      {experience.description && (
                        <ul className="text-sm text-gray-700 space-y-1 ml-0">
                          {experience.description.split('\n').map(
                            (line, index) =>
                              line.trim() && (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2 mt-2 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                                  {line.trim()}
                                </li>
                              )
                          )}
                        </ul>
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
                className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                EDUCATION
              </h2>
              <div className="space-y-4">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map(education => (
                    <div key={education.id}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold text-sm">{education.degree}</h3>
                          <h4 className="text-sm" style={{ color: theme.primary }}>
                            {education.institution}
                          </h4>
                          {education.fieldOfStudy && (
                            <p className="text-sm text-gray-600">{education.fieldOfStudy}</p>
                          )}
                          {education.location && (
                            <p className="text-sm text-gray-600">{education.location}</p>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(education.startDate)} -{' '}
                          {education.endDate ? formatDate(education.endDate) : 'Present'}
                        </div>
                      </div>
                      {education.description && (
                        <p className="text-sm text-gray-700 mt-2">{education.description}</p>
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
                className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                PROJECTS
              </h2>
              <div className="space-y-4">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .map(project => (
                    <div key={project.id}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-sm">{project.title}</h3>
                        {(project.startDate || project.endDate) && (
                          <div className="text-sm text-gray-600">
                            {project.startDate && formatDate(project.startDate)}
                            {project.endDate && ` - ${formatDate(project.endDate)}`}
                          </div>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
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

        {/* Sidebar droite (30%) */}
        <div className="lg:col-span-3 space-y-8">
          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <section onClick={() => handleEditSection('achievements')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                ACHIEVEMENTS
              </h2>
              <div className="space-y-3">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map(achievement => (
                    <div key={achievement.id}>
                      <h3 className="font-semibold text-sm">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-xs text-gray-700 mt-1">{achievement.description}</p>
                      )}
                      {achievement.date && (
                        <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.date)}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection('skills')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
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
                    <h3 className="text-sm font-semibold mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {skillsInCategory.map(skill => (
                        <span
                          key={skill.id}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications/Courses */}
          {certifications && certifications.length > 0 && (
            <section onClick={() => handleEditSection('certifications')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                COURSES
              </h2>
              <div className="space-y-3">
                {certifications
                  .sort((a, b) => a.order - b.order)
                  .map(cert => (
                    <div key={cert.id}>
                      <h3 className="font-semibold text-sm">{cert.name}</h3>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                      {cert.issueDate && (
                        <p className="text-xs text-gray-500">
                          {formatDate(cert.issueDate)}
                          {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs hover:underline"
                          style={{ color: theme.primary }}
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section onClick={() => handleEditSection('languages')}>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                LANGUAGES
              </h2>
              <div className="space-y-2">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map(language => (
                    <div key={language.id} className="flex justify-between items-center">
                      <span className="text-sm">{language.name}</span>
                      <span className="text-xs text-gray-500">
                        {typeof language.level === 'string'
                          ? language.level.charAt(0).toUpperCase() +
                            language.level.slice(1).toLowerCase()
                          : language.level || 'N/A'}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Passions/Interests */}
          <section>
            <h2
              className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
              style={{ color: theme.text }}
            >
              PASSIONS
            </h2>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="mr-2 mt-2 w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">Emerging Software Innovation</h3>
                  <p className="text-xs text-gray-700">
                    Passionate about exploring cutting-edge technologies and methodologies that can
                    transform software development.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="mr-2 mt-2 w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">Mentorship and Development</h3>
                  <p className="text-xs text-gray-700">
                    Dedicated to empowering personal fitness with regular workouts at the local gym
                    and community involvement.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="mr-2 mt-2 w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">Community Relations</h3>
                  <p className="text-xs text-gray-700">
                    Actively participate in local community events and initiatives to foster
                    positive relationships and contribute to local development.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-8 pt-4">
        <div className="border-t border-gray-300 pt-4 text-center">
          <p className="text-xs text-gray-500">
            {personalInfo?.website || 'www.sophiafoster.com'} | Page 1 of 1 |{' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};
