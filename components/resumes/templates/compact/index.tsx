'use client';

import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import type React from 'react';

/**
 * Template Compact
 * - Design compact avec bordure colorée
 * - Layout en deux colonnes optimisé
 * - Fond subtil avec accents colorés
 * - Barres de progression pour les compétences
 * - Style moderne et professionnel
 * - Badges pour les technologies/compétences
 */
export const CompactModernTemplate: React.FC<ResumeTemplateProps> = ({
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
    primary: '#3B82F6',
    secondary: '#EFF6FF',
    accent: '#1E40AF',
    background: '#F8FAFC',
    text: '#1E293B',
  };

  const handleEditSection = (sectionType: string, sectionId?: string) => {
    if (isEditable && onEditSection) {
      onEditSection(sectionType, sectionId || '');
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto shadow-xl border-4 rounded-lg overflow-hidden"
      style={{
        borderColor: theme.primary,
        fontFamily: resume.font?.name || 'Inter, sans-serif',
        backgroundColor: theme.background,
        color: theme.accent,
      }}
    >
      {/* En-tête avec nom et photo */}
      <header
        className="p-6 relative"
        style={{ backgroundColor: theme.secondary, color: theme.accent }}
        onClick={() => handleEditSection('personalInfo')}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2" style={{ color: theme.accent }}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            {personalInfo?.title && (
              <h2 className="text-lg font-medium mb-3" style={{ color: theme.primary }}>
                {personalInfo.title}
              </h2>
            )}

            {/* Informations de contact en ligne */}
            <div className="flex flex-wrap gap-4 text-sm">
              {personalInfo?.email && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    style={{ color: theme.primary }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {personalInfo.email}
                </div>
              )}
              {personalInfo?.phone && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    style={{ color: theme.primary }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo?.website && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    style={{ color: theme.primary }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {personalInfo.website}
                </div>
              )}
              {personalInfo?.location && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    style={{ color: theme.primary }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {personalInfo.location}
                </div>
              )}
            </div>
          </div>

          {/* Photo de profil */}
          {personalInfo?.photoUrl && (
            <div className="ml-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={personalInfo.photoUrl || '/placeholder.svg'}
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Colonne principale */}
        <div className="lg:col-span-2 p-6 space-y-6">
          {/* Résumé/À propos */}
          {personalInfo?.description && (
            <section onClick={() => handleEditSection('personalInfo')}>
              <h2
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                RÉSUMÉ
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">{personalInfo.description}</p>
            </section>
          )}

          {/* Expérience professionnelle */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection('experiences')}>
              <h2
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                EXPÉRIENCE PROFESSIONNELLE
              </h2>
              <div className="space-y-4">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map(experience => (
                    <div key={experience.id} className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-base">{experience.position}</h3>
                          <h4 className="font-semibold text-sm" style={{ color: theme.primary }}>
                            {experience.company}
                          </h4>
                          {experience.location && (
                            <p className="text-xs text-gray-500">{experience.location}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div
                            className="px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: theme.primary }}
                          >
                            {formatDate(experience.startDate)} -{' '}
                            {experience.current
                              ? 'Présent'
                              : experience.endDate
                              ? formatDate(experience.endDate)
                              : ''}
                          </div>
                        </div>
                      </div>
                      {experience.description && (
                        <ul className="text-sm text-gray-700 space-y-1 ml-4">
                          {experience.description.split('\n').map(
                            (line, index) =>
                              line.trim() && (
                                <li key={index} className="list-disc">
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

          {/* Formation */}
          {educations && educations.length > 0 && (
            <section onClick={() => handleEditSection('educations')}>
              <h2
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                FORMATION
              </h2>
              <div className="space-y-3">
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
                            <p className="text-xs text-gray-600">{education.fieldOfStudy}</p>
                          )}
                          {education.location && (
                            <p className="text-xs text-gray-500">{education.location}</p>
                          )}
                        </div>
                        <div
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {formatDate(education.startDate)} -{' '}
                          {education.endDate ? formatDate(education.endDate) : 'Présent'}
                        </div>
                      </div>
                      {education.description && (
                        <p className="text-sm text-gray-700 mt-1">{education.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Projets */}
          {projects && projects.length > 0 && (
            <section onClick={() => handleEditSection('projects')}>
              <h2
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                PROJETS
              </h2>
              <div className="space-y-3">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .map(project => (
                    <div key={project.id}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-sm">{project.title}</h3>
                        {(project.startDate || project.endDate) && (
                          <div
                            className="px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: theme.primary }}
                          >
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
                          className="text-xs hover:underline"
                          style={{ color: theme.primary }}
                        >
                          Voir le projet →
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar droite */}
        <div
          className="p-6 border-l-4"
          style={{ borderColor: theme.primary, backgroundColor: theme.secondary }}
        >
          {/* Compétences avec barres de progression */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection('skills')} className="mb-6">
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.primary }}>
                COMPÉTENCES
              </h2>
              <div className="space-y-4">
                {Object.entries(
                  skills
                    .sort((a, b) => a.order - b.order)
                    .reduce((acc, skill) => {
                      const category = skill.category || 'Général';
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(skill);
                      return acc;
                    }, {} as Record<string, typeof skills>)
                ).map(([category, skillsInCategory]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide text-gray-600">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {skillsInCategory.map(skill => (
                        <div key={skill.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                            {skill.level && (
                              <span className="text-xs text-gray-500">{skill.level}%</span>
                            )}
                          </div>
                          {skill.level && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                  backgroundColor: theme.primary,
                                  width: `${skill.level}%`,
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

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section onClick={() => handleEditSection('certifications')} className="mb-6">
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.primary }}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-3">
                {certifications
                  .sort((a, b) => a.order - b.order)
                  .map(cert => (
                    <div key={cert.id} className="bg-white p-3 rounded-lg shadow-sm">
                      <h3 className="font-bold text-sm">{cert.name}</h3>
                      <p className="text-xs text-gray-600 mb-1">{cert.issuer}</p>
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
                          className="text-xs mt-1 inline-block hover:underline"
                          style={{ color: theme.primary }}
                        >
                          Voir le certificat
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Langues */}
          {languages && languages.length > 0 && (
            <section onClick={() => handleEditSection('languages')} className="mb-6">
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.primary }}>
                LANGUES
              </h2>
              <div className="space-y-2">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map(language => (
                    <div key={language.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{language.name}</span>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: theme.primary }}
                      >
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

          {/* Réalisations */}
          {achievements && achievements.length > 0 && (
            <section onClick={() => handleEditSection('achievements')}>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.primary }}>
                RÉALISATIONS
              </h2>
              <div className="space-y-3">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map(achievement => (
                    <div key={achievement.id} className="bg-white p-3 rounded-lg shadow-sm">
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
        </div>
      </div>

      {/* Pied de page avec accent coloré */}
      <footer className="text-center py-3" style={{ backgroundColor: theme.primary }}>
        <div className="w-8 h-8 mx-auto bg-white rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5"
            style={{ color: theme.primary }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </footer>
    </div>
  );
};
