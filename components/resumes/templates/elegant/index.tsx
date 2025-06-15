'use client';

import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import type React from 'react';

/**
 * Template Élégant
 * Caractéristiques:
 * - Design moderne et sophistiqué
 * - Layout asymétrique créatif
 * - Gradient subtil et typographie élégante
 * - Espacement harmonieux
 * - Couleurs raffinées
 * - Éléments visuels discrets mais impactants
 */
export const ElegantTemplate: React.FC<ResumeTemplateProps> = ({
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
    primary: '#6366F1',
    secondary: '#F8FAFC',
    accent: '#EC4899',
    background: '#FFFFFF',
    text: '#0F172A',
  };

  const handleEditSection = (sectionType: string, sectionId?: string) => {
    if (isEditable && onEditSection) {
      onEditSection(sectionType, sectionId || '');
    }
  };

  return (
    <div
      className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden"
      style={{
        fontFamily: resume.font?.name || 'Inter, sans-serif',
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête avec gradient */}
      <header
        className="relative p-8 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
        }}
        onClick={() => handleEditSection('personalInfo')}
      >
        {/* Motif décoratif */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="w-full h-full border-2 border-white rounded-full transform rotate-45"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
          <div className="w-full h-full border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 tracking-wide">
                {personalInfo?.firstName} {personalInfo?.lastName}
              </h1>
              {personalInfo?.title && (
                <h2 className="text-xl mb-6 opacity-90 font-light">{personalInfo.title}</h2>
              )}

              {/* Contact en grille élégante */}
              <div className="grid grid-cols-2 gap-4 text-sm opacity-90">
                {personalInfo?.email && (
                  <div className="flex items-center">
                    <span className="mr-3">✉</span>
                    {personalInfo.email}
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center">
                    <span className="mr-3">☎</span>
                    {personalInfo.phone}
                  </div>
                )}
                {personalInfo?.location && (
                  <div className="flex items-center">
                    <span className="mr-3">📍</span>
                    {personalInfo.location}
                  </div>
                )}
                {personalInfo?.website && (
                  <div className="flex items-center">
                    <span className="mr-3">🌐</span>
                    {personalInfo.website}
                  </div>
                )}
              </div>
            </div>

            {/* Photo élégante */}
            {personalInfo?.photoUrl && (
              <div className="ml-8">
                <div className="relative">
                  <div className="absolute -inset-2 bg-white/20 rounded-full blur-md"></div>
                  <img
                    src={personalInfo.photoUrl}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white/30"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Contenu principal */}
        <div className="flex-1 p-8">
          {/* Summary avec style élégant */}
          {personalInfo?.description && (
            <section onClick={() => handleEditSection('summary')} className="mb-8">
              <div className="relative">
                <div
                  className="absolute left-0 top-0 w-1 h-8 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <h2 className="text-2xl font-bold mb-4 pl-6" style={{ color: theme.text }}>
                  À propos
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg font-light pl-6">
                {personalInfo.description}
              </p>
            </section>
          )}

          {/* Experience avec timeline élégante */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection('experiences')} className="mb-8">
              <div className="relative">
                <div
                  className="absolute left-0 top-0 w-1 h-8 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <h2 className="text-2xl font-bold mb-6 pl-6" style={{ color: theme.text }}>
                  Expérience
                </h2>
              </div>
              <div className="space-y-6 pl-6">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map((experience, index) => (
                    <div key={experience.id} className="relative">
                      {/* Timeline */}
                      <div className="absolute -left-6 top-6 w-12 h-0.5 bg-gray-200"></div>
                      <div
                        className="absolute -left-3 top-5 w-3 h-3 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: index === 0 ? theme.primary : theme.accent }}
                      ></div>

                      <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {experience.position}
                            </h3>
                            <h4 className="text-lg font-semibold" style={{ color: theme.primary }}>
                              {experience.company}
                            </h4>
                            {experience.location && (
                              <p className="text-sm text-gray-600 mt-1">{experience.location}</p>
                            )}
                          </div>
                          <div
                            className="px-4 py-2 rounded-full text-white text-sm font-medium"
                            style={{ backgroundColor: theme.accent }}
                          >
                            {formatDate(experience.startDate)} -{' '}
                            {experience.current
                              ? 'Présent'
                              : experience.endDate
                              ? formatDate(experience.endDate)
                              : ''}
                          </div>
                        </div>
                        {experience.description && (
                          <div className="text-gray-700 leading-relaxed">
                            {experience.description.split('\n').map(
                              (line, lineIndex) =>
                                line.trim() && (
                                  <p key={lineIndex} className="mb-2 flex items-start">
                                    <span
                                      className="mr-3 mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: theme.primary }}
                                    />
                                    {line.trim()}
                                  </p>
                                )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Education */}
          {educations && educations.length > 0 && (
            <section onClick={() => handleEditSection('educations')} className="mb-8">
              <div className="relative">
                <div
                  className="absolute left-0 top-0 w-1 h-8 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <h2 className="text-2xl font-bold mb-6 pl-6" style={{ color: theme.text }}>
                  Formation
                </h2>
              </div>
              <div className="grid gap-4 pl-6">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map(education => (
                    <div key={education.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{education.degree}</h3>
                          <h4 className="font-semibold" style={{ color: theme.primary }}>
                            {education.institution}
                          </h4>
                          {education.fieldOfStudy && (
                            <p className="text-sm text-gray-600">{education.fieldOfStudy}</p>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          {formatDate(education.startDate)} -{' '}
                          {education.endDate ? formatDate(education.endDate) : 'Présent'}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar élégante */}
        <div className="w-80 bg-gray-50 p-8 space-y-8">
          {/* Skills avec barres de progression */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection('skills')}>
              <h2 className="text-xl font-bold mb-6" style={{ color: theme.text }}>
                Compétences
              </h2>
              <div className="space-y-4">
                {skills
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 8)
                  .map(skill => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.level}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: theme.primary,
                            width:
                              skill.level === 'Expert'
                                ? '95%'
                                : skill.level === 'Advanced'
                                ? '80%'
                                : skill.level === 'Intermediate'
                                ? '65%'
                                : '45%',
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <section onClick={() => handleEditSection('languages')}>
              <h2 className="text-xl font-bold mb-6" style={{ color: theme.text }}>
                Langues
              </h2>
              <div className="space-y-3">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map(language => (
                    <div
                      key={language.id}
                      className="flex justify-between items-center p-3 bg-white rounded-lg"
                    >
                      <span className="font-medium">{language.name}</span>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: theme.accent }}
                      >
                        {language.level}%
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section onClick={() => handleEditSection('certifications')}>
              <h2 className="text-xl font-bold mb-6" style={{ color: theme.text }}>
                Certifications
              </h2>
              <div className="space-y-4">
                {certifications
                  .sort((a, b) => a.order - b.order)
                  .map(cert => (
                    <div
                      key={cert.id}
                      className="p-4 bg-white rounded-lg border-l-4"
                      style={{ borderLeftColor: theme.primary }}
                    >
                      <h3 className="font-bold text-sm">{cert.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{cert.issuer}</p>
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
              <h2 className="text-xl font-bold mb-6" style={{ color: theme.text }}>
                Projets
              </h2>
              <div className="space-y-4">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 3)
                  .map(project => (
                    <div key={project.id} className="p-4 bg-white rounded-lg">
                      <h3 className="font-bold text-sm mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-xs text-gray-700 mb-2">{project.description}</p>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          className="text-xs font-medium hover:underline"
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

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <section onClick={() => handleEditSection('achievements')}>
              <h2 className="text-xl font-bold mb-6" style={{ color: theme.text }}>
                Réalisations
              </h2>
              <div className="space-y-3">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map(achievement => (
                    <div key={achievement.id} className="flex items-start p-3 bg-white rounded-lg">
                      <span
                        className="mr-3 mt-1 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: theme.accent }}
                      />
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
        </div>
      </div>
    </div>
  );
};
