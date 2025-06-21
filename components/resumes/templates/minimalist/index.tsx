'use client';

import type { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import type React from 'react';

/**
 * Template Minimaliste
 * Caractéristiques:
 * - Design ultra-épuré
 * - Typographie simple
 * - Layout une colonne
 * - Espacement généreux
 * - Couleurs neutres
 */
export const MinimalistTemplate: React.FC<ResumeTemplateProps> = ({
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
    primary: '#000000',
    secondary: '#F8F9FA',
    accent: '#6B7280',
    background: '#FFFFFF',
    text: '#000000',
  };

  const handleEditSection = (sectionType: string, sectionId?: string) => {
    if (isEditable && onEditSection) {
      onEditSection(sectionType, sectionId || '');
    }
  };

  return (
    <div
      className="max-w-3xl mx-auto bg-white"
      style={{
        fontFamily: resume.font?.name || 'Georgia, serif',
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête simple */}
      <header className="text-center py-12" onClick={() => handleEditSection('personalInfo')}>
        <h1 className="text-5xl font-light mb-4" style={{ color: theme.text }}>
          {personalInfo?.firstName} {personalInfo?.lastName}
        </h1>
        {personalInfo?.title && (
          <h2 className="text-xl font-light mb-6 text-gray-600">{personalInfo.title}</h2>
        )}

        {/* Contact simple */}
        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-8 space-y-12">
        {/* Summary */}
        {personalInfo?.description && (
          <section onClick={() => handleEditSection('personalInfo')}>
            <p className="text-lg leading-relaxed text-gray-700 text-center italic">
              {personalInfo.description}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <section onClick={() => handleEditSection('experiences')}>
            <h2 className="text-2xl font-light mb-8 text-center" style={{ color: theme.text }}>
              Experience
            </h2>
            <div className="space-y-8">
              {experiences
                .sort((a, b) => a.order - b.order)
                .map(experience => (
                  <div key={experience.id} className="text-center">
                    <h3 className="text-xl font-medium mb-1">{experience.position}</h3>
                    <h4 className="text-lg text-gray-600 mb-2">{experience.company}</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      {formatDate(experience.startDate)} —{' '}
                      {experience.current
                        ? 'Present'
                        : experience.endDate
                        ? formatDate(experience.endDate)
                        : ''}
                    </p>
                    {experience.description && (
                      <div className="text-gray-700 max-w-xl mx-auto">
                        {experience.description.split('\n').map(
                          (line, index) =>
                            line.trim() && (
                              <p key={index} className="mb-2">
                                {line.trim()}
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
            <h2 className="text-2xl font-light mb-8 text-center" style={{ color: theme.text }}>
              Education
            </h2>
            <div className="space-y-6">
              {educations
                .sort((a, b) => a.order - b.order)
                .map(education => (
                  <div key={education.id} className="text-center">
                    <h3 className="text-lg font-medium">{education.degree}</h3>
                    <h4 className="text-base text-gray-600">{education.institution}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(education.startDate)} —{' '}
                      {education.endDate ? formatDate(education.endDate) : 'Present'}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section onClick={() => handleEditSection('skills')}>
            <h2 className="text-2xl font-light mb-8 text-center" style={{ color: theme.text }}>
              Skills
            </h2>
            <div className="text-center">
              <p className="text-gray-700 leading-relaxed">
                {skills.map(skill => skill.name).join(' • ')}
              </p>
            </div>
          </section>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section onClick={() => handleEditSection('languages')}>
            <h2 className="text-2xl font-light mb-8 text-center" style={{ color: theme.text }}>
              Languages
            </h2>
            <div className="text-center space-y-2">
              {languages
                .sort((a, b) => a.order - b.order)
                .map(language => (
                  <p key={language.id} className="text-gray-700">
                    {language.name} ({language.level})
                  </p>
                ))}
            </div>
          </section>
        )}
      </div>

      <div className="py-12">
        {certifications && certifications.length > 0 && (
          <section onClick={() => handleEditSection('certifications')}>
            <h2 className="text-center text-2xl font-light mb-8" style={{ color: theme.text }}>
              Certifications
            </h2>
            <div className="flex flex-col items-center space-y-2 justify-center">
              {certifications
                .sort((a, b) => a.order - b.order)
                .map(crt => (
                  <div key={crt.id}>
                    <div className="flex gap-3">
                      <p className="text-xl font-bold" style={{ color: theme.text }}>
                        {crt.name}
                      </p>
                      {crt.issueDate && <p>{formatDate(crt.issueDate)}</p>}
                    </div>
                    <div className="flex gap-3">
                      <span>{crt.issuer}</span>
                      <span>{crt.credentialUrl}</span>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
