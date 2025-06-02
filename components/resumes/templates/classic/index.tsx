import { ResumeEnumLanguages } from '@/enums/resumeEnumLanguages';
import { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import React from 'react';

/**
 * Template Classique de CV (similaire à l'image 1 avec Kendra Jones)
 * Caractéristiques:
 * - Barre latérale gauche avec contact et compétences
 * - Photo de profil circulaire à droite
 * - Sections clairement séparées
 * - Design épuré et professionnel
 */
export const ClassicTemplate: React.FC<ResumeTemplateProps> = ({
  resume,
  isEditable = false,
  onEditSection,
}) => {
  const { personalInfo, educations, experiences, skills, languages, certfications, achievements } =
    resume;
  const theme = resume.theme || {
    primary: '#EDF7ED',
    secondary: '#2D3E50',
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
      className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      style={{
        fontFamily: resume.font?.name || 'Inter, sans-serif',
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Sidebar gauche */}
        <div
          className="w-full md:w-2/6 p-6 text-white"
          style={{ backgroundColor: theme.secondary }}
        >
          {/* Informations de contact */}
          <div className="mb-8" onClick={() => handleEditSection('personalInfo')}>
            {personalInfo?.phone && (
              <div className="mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-sm">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.email && (
              <div className="mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.website && (
              <div className="mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <span className="text-sm">{personalInfo.website}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
                <span className="text-sm">{personalInfo.location}</span>
              </div>
            )}
          </div>

          {/* Compétences */}
          {skills && skills.length > 0 && (
            <div className="mb-8" onClick={() => handleEditSection('skills')}>
              <h2 className="text-lg font-bold uppercase mb-4 border-b border-white pb-2">
                Compétences
              </h2>
              <div className="space-y-3">
                {skills
                  .sort((a, b) => a.order - b.order)
                  .map(skill => (
                    <div key={skill.id} className="mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      {skill.level !== null && skill.level !== undefined && (
                        <div className="w-full bg-gray-200 bg-opacity-30 rounded-full h-1.5 mt-1">
                          <div
                            className="h-1.5 rounded-full bg-white"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages && languages.length > 0 && (
            <div className="mb-8" onClick={() => handleEditSection('languages')}>
              <h2 className="text-lg font-bold uppercase mb-4 border-b border-white pb-2">
                Langues
              </h2>
              <div className="space-y-2">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map(language => (
                    <div key={language.id} className="mb-2">
                      <span className="text-sm font-medium">{language.name}</span>
                      <div className="flex space-x-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const level = ResumeEnumLanguages.indexOf(language.level);
                          return (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: i <= level ? '#fff' : 'rgba(255,255,255,0.3)',
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="w-full md:w-4/6 p-6">
          {/* En-tête avec nom, titre et photo */}
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"
            onClick={() => handleEditSection('personalInfo')}
          >
            <div>
              <h1 className="text-3xl font-bold">
                {personalInfo?.firstName} {personalInfo?.lastName}
              </h1>
              {personalInfo?.title && (
                <h2 className="text-xl text-gray-600 mt-1">{personalInfo.title}</h2>
              )}
            </div>

            {/* Photo de profil */}
            {personalInfo?.photoUrl && (
              <div className="mt-4 sm:mt-0">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border-2"
                  style={{ borderColor: theme.secondary }}
                >
                  <img
                    src={personalInfo.photoUrl}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* desctiption / À propos */}
          {personalInfo?.description && (
            <div className="mb-6" onClick={() => handleEditSection('summary')}>
              <p className="text-gray-700 leading-relaxed">{personalInfo.description}</p>
            </div>
          )}

          {/* Expériences professionnelles */}
          {experiences && experiences.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('experiences')}>
              <h2
                className="text-xl font-bold uppercase mb-4 pb-2"
                style={{ borderBottom: `2px solid ${theme.primary}` }}
              >
                Expérience
              </h2>
              <div className="space-y-4">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map(experience => (
                    <div key={experience.id} className="mb-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{experience.position}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-gray-700 font-medium">{experience.company}</span>
                            {experience.location && (
                              <>
                                <span className="mx-2 text-gray-500">|</span>
                                <span className="text-gray-600">{experience.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-600 mt-1 sm:mt-0">
                          {formatDate(experience.startDate)} -{' '}
                          {experience.current
                            ? 'Présent'
                            : experience.endDate
                            ? formatDate(experience.endDate)
                            : ''}
                        </div>
                      </div>
                      {experience.desctiption && (
                        <p className="text-gray-600 mt-2 whitespace-pre-line">
                          {experience.desctiption}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {educations && educations.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('educations')}>
              <h2
                className="text-xl font-bold uppercase mb-4 pb-2"
                style={{ borderBottom: `2px solid ${theme.primary}` }}
              >
                Formation
              </h2>
              <div className="space-y-4">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map(education => (
                    <div key={education.id} className="mb-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{education.degree}</h3>
                          {education.fieldOfStudy && (
                            <p className="text-gray-700">{education.fieldOfStudy}</p>
                          )}
                          <div className="flex items-center mt-1">
                            <span className="text-gray-700 font-medium">
                              {education.institutions}
                            </span>
                            {education.location && (
                              <>
                                <span className="mx-2 text-gray-500">|</span>
                                <span className="text-gray-600">{education.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-600 mt-1 sm:mt-0">
                          {formatDate(education.startDate)} -{' '}
                          {education.endDate ? formatDate(education.endDate) : 'Présent'}
                        </div>
                      </div>
                      {education.description && (
                        <p className="text-gray-600 mt-2">{education.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* certfications */}
          {certfications && certfications.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('certfications')}>
              <h2
                className="text-xl font-bold uppercase mb-4 pb-2"
                style={{ borderBottom: `2px solid ${theme.primary}` }}
              >
                certfications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certfications
                  .sort((a, b) => a.order - b.order)
                  .map(cert => (
                    <div
                      key={cert.id}
                      className="border rounded-md p-3"
                      style={{ borderColor: theme.primary }}
                    >
                      <h3 className="font-medium">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      {cert.issueDate && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(cert.issueDate)}
                          {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Réalisations */}
          {achievements && achievements.length > 0 && (
            <div className="mb-6" onClick={() => handleEditSection('achievements')}>
              <h2
                className="text-xl font-bold uppercase mb-4 pb-2"
                style={{ borderBottom: `2px solid ${theme.primary}` }}
              >
                Réalisations
              </h2>
              <div className="space-y-3">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map(achievement => (
                    <div key={achievement.id} className="mb-2">
                      <h3 className="font-medium">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-gray-600 mt-1">{achievement.description}</p>
                      )}
                      {achievement.date && (
                        <p className="text-sm text-gray-500 mt-1">{formatDate(achievement.date)}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
