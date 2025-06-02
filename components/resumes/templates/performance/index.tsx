import { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import React from 'react';

/**
 * Template Performance de CV (similaire aux images 2-3 avec Isaac Hall et Isabella Adams)
 * Caractéristiques:
 * - Bordure verte encadrant le document
 * - Disposition en colonnes équilibrées
 * - Affichage compact des informations
 * - Séparation claire entre les sections
 */
export const PerformanceTemplate: React.FC<ResumeTemplateProps> = ({
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
    certfications,
    projects,
    achievements,
  } = resume;
  const theme = resume.theme || {
    primary: '#4CAF50',
    secondary: '#EDF7ED',
    accent: '#2E7D32',
    background: '#FFFFFF',
    text: '#333333',
  };

  const handleEditSection = (sectionType: string, sectionId?: string) => {
    if (isEditable && onEditSection) {
      onEditSection(sectionType, sectionId || '');
    }
  };

  return (
    <div
      className="border-4 rounded-lg max-w-4xl mx-auto overflow-hidden shadow-lg"
      style={{
        borderColor: theme.primary,
        fontFamily: resume.font?.name || 'Inter, sans-serif',
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête avec nom et informations de contact */}
      <header className="p-6 border-b" style={{ borderColor: theme.primary }}>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0" onClick={() => handleEditSection('personalInfo')}>
            <h1
              className="text-3xl font-bold uppercase tracking-wider"
              style={{ color: theme.primary }}
            >
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            {personalInfo?.title && (
              <h2 className="text-xl text-gray-600 mt-1">{personalInfo.title}</h2>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            {personalInfo?.phone && (
              <div className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: theme.primary }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {personalInfo.phone}
              </div>
            )}
            {personalInfo?.email && (
              <div className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: theme.primary }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {personalInfo.email}
              </div>
            )}
            {personalInfo?.website && (
              <div className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: theme.primary }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                {personalInfo.website}
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: theme.primary }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {personalInfo.location}
              </div>
            )}
          </div>
        </div>

        {/* Description / À propos */}
        {personalInfo?.description && (
          <div className="mt-4" onClick={() => handleEditSection('summary')}>
            <p className="text-gray-700 text-sm leading-relaxed">{personalInfo.description}</p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Colonne gauche */}
        <div className="md:col-span-2 p-6 border-r" style={{ borderColor: theme.primary }}>
          {/* Expériences professionnelles */}
          {experiences && experiences.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('experiences')}>
              <h2 className="text-lg font-bold uppercase mb-4" style={{ color: theme.primary }}>
                Expérience Professionnelle
              </h2>
              <div className="space-y-4">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map(experience => (
                    <div key={experience.id} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <h3 className="text-base font-semibold">{experience.position}</h3>
                        <div className="text-sm">
                          {formatDate(experience.startDate)} -{' '}
                          {experience.current
                            ? 'Présent'
                            : experience.endDate
                            ? formatDate(experience.endDate)
                            : ''}
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium">{experience.company}</span>
                        {experience.location && (
                          <>
                            <span className="mx-2 text-xs">•</span>
                            <span className="text-sm">{experience.location}</span>
                          </>
                        )}
                      </div>
                      {experience.desctiption && (
                        <ul className="text-sm text-gray-700 list-disc ml-4 space-y-1">
                          {experience.desctiption
                            .split('\n')
                            .map(
                              (line, index) => line.trim() && <li key={index}>{line.trim()}</li>
                            )}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Projets */}
          {projects && projects.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('projects')}>
              <h2 className="text-lg font-bold uppercase mb-4" style={{ color: theme.primary }}>
                Projets
              </h2>
              <div className="space-y-4">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .map(project => (
                    <div key={project.id} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <h3 className="text-base font-semibold">{project.title}</h3>
                        {(project.startDate || project.endDate) && (
                          <div className="text-sm">
                            {project.startDate && formatDate(project.startDate)}
                            {project.endDate && ` - ${formatDate(project.endDate)}`}
                          </div>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-700">{project.description}</p>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm mt-1 inline-block"
                          style={{ color: theme.primary }}
                        >
                          Voir le projet
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {educations && educations.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('educations')}>
              <h2 className="text-lg font-bold uppercase mb-4" style={{ color: theme.primary }}>
                Formation
              </h2>
              <div className="space-y-4">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map(education => (
                    <div key={education.id} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <h3 className="text-base font-semibold">{education.degree}</h3>
                        <div className="text-sm">
                          {formatDate(education.startDate)} -{' '}
                          {education.endDate ? formatDate(education.endDate) : 'Présent'}
                        </div>
                      </div>
                      <div className="mb-1">
                        <span className="text-sm font-medium">{education.institutions}</span>
                        {education.location && (
                          <>
                            <span className="mx-2 text-xs">•</span>
                            <span className="text-sm">{education.location}</span>
                          </>
                        )}
                      </div>
                      {education.fieldOfStudy && (
                        <p className="text-sm text-gray-700">{education.fieldOfStudy}</p>
                      )}
                      {education.description && (
                        <p className="text-sm text-gray-700 mt-1">{education.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite */}
        <div className="p-6">
          {/* Compétences */}
          {skills && skills.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('skills')}>
              <h2 className="text-lg font-bold uppercase mb-4" style={{ color: theme.primary }}>
                Compétences
              </h2>
              <div className="space-y-2">
                {Object.entries(
                  skills
                    .sort((a, b) => a.order - b.order)
                    .reduce((acc, skill, index) => {
                      // Regrouper par catégorie si disponible
                      const category = skill.category || 'Général';
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(skill);
                      return acc;
                    }, {} as Record<string, typeof skills>)
                ).map(([category, skillsInCategory]) => (
                  <div key={category} className="mb-3">
                    <h3 className="text-sm font-medium mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillsInCategory.map(skill => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: theme.secondary,
                            color: theme.primary,
                            border: `1px solid ${theme.primary}`,
                          }}
                        >
                          {skill.name}
                          {skill.level !== null &&
                            skill.level !== undefined &&
                            ` (${skill.level}%)`}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages && languages.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('languages')}>
              <h2 className="text-lg font-bold uppercase mb-4" style={{ color: theme.primary }}>
                Langues
              </h2>
              <div className="space-y-2">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map(language => (
                    <div key={language.id} className="flex items-center justify-between mb-2">
                      <span className="text-sm">{language.name}</span>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ backgroundColor: theme.secondary, color: theme.primary }}
                      >
                        {language.level && typeof language.level === 'string'
                          ? language.level.charAt(0).toUpperCase() +
                            language.level.slice(1).toLowerCase()
                          : language.level || 'Non spécifié'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* certfications */}
          {certfications && certfications.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('certfications')}>
              <h2 className="text-lg font-bold uppercase mb-4" style={{ color: theme.primary }}>
                certfications
              </h2>
              <div className="space-y-3">
                {certfications
                  .sort((a, b) => a.order - b.order)
                  .map(cert => (
                    <div key={cert.id} className="mb-2">
                      <h3 className="text-sm font-medium">{cert.name}</h3>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                      {cert.issueDate && (
                        <p className="text-xs">
                          {formatDate(cert.issueDate)}
                          {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs mt-1 inline-block"
                          style={{ color: theme.primary }}
                        >
                          Voir le certificat
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Réalisations */}
          {achievements && achievements.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('achievements')}>
              <h2 className="text-lg font-bold uppercase mb-4" style={{ color: theme.primary }}>
                Réalisations
              </h2>
              <div className="space-y-2">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map(achievement => (
                    <div key={achievement.id} className="mb-2">
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 mt-1 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: theme.primary }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium">{achievement.title}</h3>
                          {achievement.description && (
                            <p className="text-xs text-gray-700">{achievement.description}</p>
                          )}
                          {achievement.date && (
                            <p className="text-xs text-gray-500">{formatDate(achievement.date)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pied de page */}
      <footer
        className="py-2 px-6 text-center text-xs border-t"
        style={{ borderColor: theme.primary, color: theme.primary }}
      >
        Performance CV | Powered by SmartCV
      </footer>
    </div>
  );
};
