'use client';

import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import type React from 'react';


/**
 * Template Contemporain de CV
 * Caractéristiques:
 * - Design moderne et minimaliste
 * - Palette de couleurs contemporaine (bleu/gris)
 * - Typographie élégante avec espacement optimisé
 * - Éléments visuels subtils (gradients, ombres)
 * - Mise en page équilibrée et aérée
 */
export const ContemporaryTemplate: React.FC<ResumeTemplateProps> = ({
  resume,
  isEditable = true,
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
    hobbies,
    achievements,
  } = resume;

  const theme = resume.theme || {
    primary: '#2563EB',
    secondary: '#F1F5F9',
    accent: '#1E40AF',
    background: '#FFFFFF',
    text: '#1E293B',
  };

  const handleEditSection = (sectionType: string, sectionId?: string) => {
    if (isEditable && onEditSection) {
      onEditSection(sectionType, sectionId || '');
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto overflow-hidden shadow-2xl rounded-2xl"
      style={{
        fontFamily: resume.font?.name || 'Inter, sans-serif',
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête moderne avec gradient */}
      <div
        className="relative p-8 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
        }}
      >
        {/* Motif décoratif en arrière-plan */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10" onClick={() => handleEditSection('personalInfo')}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-2">
                {personalInfo?.firstName}
                <span className="font-bold ml-3">{personalInfo?.lastName}</span>
              </h1>
              {personalInfo?.title && (
                <h2 className="text-xl md:text-2xl font-light opacity-90 tracking-wide">
                  {personalInfo.title}
                </h2>
              )}
            </div>

            {/* Photo de profil */}
            {personalInfo?.photoUrl && (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                <img
                  src={personalInfo.photoUrl || '/placeholder.svg'}
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Informations de contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {personalInfo?.email && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span className="text-sm font-light">{personalInfo.email}</span>
              </div>
            )}

            {personalInfo?.phone && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="text-sm font-light">{personalInfo.phone}</span>
              </div>
            )}

            {personalInfo?.location && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-light">{personalInfo.location}</span>
              </div>
            )}

            {personalInfo?.website && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-light">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description / À propos */}
      {personalInfo?.description && (
        <div
          className="px-8 py-6 border-l-4 mx-8 my-6 rounded-r-lg"
          style={{
            backgroundColor: theme.secondary,
            borderColor: theme.primary,
            color: theme.accent,
          }}
          onClick={() => handleEditSection('personalInfo')}
        >
          <p className="text-lg leading-relaxed font-light italic">"{personalInfo.description}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* Expériences professionnelles */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection('experiences')}>
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: theme.primary }}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1zM4 9v7h12V9H4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-light tracking-wide" style={{ color: theme.primary }}>
                  Expérience Professionnelle
                </h2>
              </div>

              <div className="space-y-6">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map((experience, index) => (
                    <div key={experience.id} className="relative">
                      {/* Ligne de connexion */}
                      {index < experiences.length - 1 && (
                        <div
                          className="absolute left-6 top-16 w-0.5 h-16"
                          style={{ backgroundColor: theme.secondary }}
                        />
                      )}

                      <div className="flex items-start space-x-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-2"
                          style={{ backgroundColor: theme.secondary, color: theme.primary }}
                        >
                          <span className="text-sm font-semibold">{index + 1}</span>
                        </div>

                        <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{experience.position}</h3>
                              <p className="text-lg font-medium" style={{ color: theme.primary }}>
                                {experience.company}
                              </p>
                              {experience.location && (
                                <p className="text-sm text-gray-500">{experience.location}</p>
                              )}
                            </div>
                            <div
                              className="px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0"
                              style={{ backgroundColor: theme.secondary, color: theme.primary }}
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
                            <div className="prose prose-sm max-w-none">
                              {experience.description.split('\n').map(
                                (line, idx) =>
                                  line.trim() && (
                                    <p key={idx} className="text-gray-700 mb-2 leading-relaxed">
                                      • {line.trim()}
                                    </p>
                                  )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Formation */}
          {educations && educations.length > 0 && (
            <section onClick={() => handleEditSection('educations')}>
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: theme.primary }}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-light tracking-wide" style={{ color: theme.primary }}>
                  Formation
                </h2>
              </div>

              <div className="space-y-4">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map(education => (
                    <div
                      key={education.id}
                      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{education.degree}</h3>
                          <p className="text-base font-medium" style={{ color: theme.primary }}>
                            {education.institution}
                          </p>
                          {education.fieldOfStudy && (
                            <p className="text-sm text-gray-600">{education.fieldOfStudy}</p>
                          )}
                          {education.location && (
                            <p className="text-sm text-gray-500">{education.location}</p>
                          )}
                        </div>
                        <div
                          className="px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0"
                          style={{ backgroundColor: theme.secondary, color: theme.primary }}
                        >
                          {formatDate(education.startDate)} -{' '}
                          {education.endDate ? formatDate(education.endDate) : 'Présent'}
                        </div>
                      </div>

                      {education.description && (
                        <p className="text-gray-700 leading-relaxed">{education.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Projets */}
          {projects && projects.length > 0 && (
            <section onClick={() => handleEditSection('projects')}>
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: theme.primary }}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-light tracking-wide" style={{ color: theme.primary }}>
                  Projets
                </h2>
              </div>

              <div className="grid gap-4">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .map(project => (
                    <div
                      key={project.id}
                      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        {(project.startDate || project.endDate) && (
                          <div
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: theme.secondary, color: theme.primary }}
                          >
                            {project.startDate && formatDate(project.startDate)}
                            {project.endDate && ` - ${formatDate(project.endDate)}`}
                          </div>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-gray-700 mb-3 leading-relaxed">{project.description}</p>
                      )}

                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-sm font-medium hover:underline"
                          style={{ color: theme.primary }}
                        >
                          <span>Voir le projet</span>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Compétences */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection('skills')}>
              <h2
                className="text-xl font-light tracking-wide mb-4"
                style={{ color: theme.primary }}
              >
                Compétences
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
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-600">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {skillsInCategory.map(skill => (
                        <div key={skill.id} className="flex items-center justify-between">
                          <span className="text-sm">{skill.name}</span>
                          {skill.level && (
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    backgroundColor: theme.primary,
                                    width: `${skill.level}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{skill.level}%</span>
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

          {/* Langues */}
          {languages && languages.length > 0 && (
            <section onClick={() => handleEditSection('languages')}>
              <h2
                className="text-xl font-light tracking-wide mb-4"
                style={{ color: theme.primary }}
              >
                Langues
              </h2>

              <div className="space-y-3">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map(language => (
                    <div key={language.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{language.name}</span>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: theme.secondary, color: theme.primary }}
                      >
                        {typeof language.level === 'string'
                          ? language.level.charAt(0).toUpperCase() +
                            language.level.slice(1).toLowerCase()
                          : language.level || 'Non spécifié'}
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
                className="text-xl font-light tracking-wide mb-4"
                style={{ color: theme.primary }}
              >
                Certifications
              </h2>

              <div className="space-y-4">
                {certifications
                  .sort((a, b) => a.order - b.order)
                  .map(cert => (
                    <div
                      key={cert.id}
                      className="border-l-4 pl-4 py-2"
                      style={{ borderColor: theme.primary }}
                    >
                      <h3 className="text-sm font-semibold">{cert.name}</h3>
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
                          Voir le certificat →
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Réalisations */}
          {achievements && achievements.length > 0 && (
            <section onClick={() => handleEditSection('achievements')}>
              <h2
                className="text-xl font-light tracking-wide mb-4"
                style={{ color: theme.primary }}
              >
                Réalisations
              </h2>

              <div className="space-y-3">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map(achievement => (
                    <div key={achievement.id} className="flex items-start space-x-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{achievement.title}</h3>
                        {achievement.description && (
                          <p className="text-xs text-gray-700 mt-1">{achievement.description}</p>
                        )}
                        {achievement.date && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(achievement.date)}
                          </p>
                        )}
                      </div>
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

      {/* Pied de page moderne */}
      <footer
        className="text-center py-4 text-xs font-light"
        style={{ backgroundColor: theme.secondary, color: theme.primary }}
      >
        Contemporary CV Template | Designed with SmartCV
      </footer>
    </div>
  );
};
