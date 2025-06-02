import { ResumeEnumLanguages } from '@/enums/resumeEnumLanguages';
import { ResumeTemplateProps } from '@/types/resumeTypes';
import { formatDate } from '@/utils/data-utils';
import Image from 'next/image';

/**
 * Template Moderne de Cv
 * Caracteristiques:
 * - Photo de profil ronde
 * - Icone pour les informations de contact
 * - Conception en deux colonnes avec barre lateral coloree
 * - Sections bien délimtée avec des puces
 */

export const ModernTemplate: React.FC<ResumeTemplateProps> = ({
  resume,
  isEditable = false,
  onEditSection,
}) => {
  const { personalInfo, educations, experiences, skills, languages, certfications, achievements } =
    resume;
  const theme = resume.theme || {
    primary: '#4C4F50',
    secondary: '#E8F5E9',
    accent: '#2E7D32',
    background: '#FFFFFF',
    text: '#333333',
  };
  const hanldeEditSection = (sectionType: string, sectionId?: string)  => {
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
      {/* En tete avec photot et informatio personnelle */}
      <header
        className="flex flex-col sm:flex-row p-6 gap-6"
        style={{
          backgroundColor: theme.secondary,
        }}
      >
        {/* Photo de profil */}
        {personalInfo?.photoUrl && (
          <div className="flex-shrik-0">
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4"
              style={{
                borderColor: theme.primary,
              }}
            >
              <Image
                src={personalInfo.photoUrl}
                alt="Photo de profil"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Informations personnelles */}
        <div className="flex-grow flex flex-col">
          <div className="mb-2" onClick={() => hanldeEditSection('personalInfo')}>
            <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            {personalInfo?.title && (
              <div
                className="inline-block px-3 py-1 rounded-md text-white text-sm font-medium"
                style={{
                  backgroundColor: theme.primary,
                }}
              >
                {personalInfo.title}
              </div>
            )}
          </div>

          {/* Informations de contact */}
          <div className="flex flex-wrap gap-4 mt-2">
            {personalInfo?.email && (
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                <span className="text-sm">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo?.phone && (
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                <span className="text-sm">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo?.location && (
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                <span className="text-sm">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo?.website && (
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                <span className="text-sm">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row  p-0">
        {/* column Gauche */}
        <div className="w-full md:w-1/3 p-6" style={{ backgroundColor: theme.secondary }}>
          {personalInfo?.description && (
            <div className="mb-8" onClick={() => hanldeEditSection('summury')}>
              <h3
                className="text-lg font-bold uppercase mb-2 pb-1 border-b-2"
                style={{ borderColor: theme.primary }}
              >
                Résumé
              </h3>
              <p className="text-sm leading-relaxed">{personalInfo.description}</p>
            </div>
          )}

          {/* Compétence */}
          {skills && skills.length > 0 && (
            <div className="mb-8" onClick={() => hanldeEditSection('skills')}>
              <h2
                className="text-lg font-bold uppercase mb-2 pb-1 border-b-2"
                style={{ borderColor: theme.primary }}
              >
                Compétence
              </h2>
              <div className="space-y-3">
                {skills
                  .sort((a, b) => a.order - b.order)
                  .map(skill => (
                    <div key={skill.id} className="mb-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{skill.name}</span>
                        {skill.level !== null && skill.level !== undefined && (
                          <span className="text-xs">{skill.level}%</span>
                        )}
                      </div>
                      {skill.level !== null && skill.level !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${skill.level}%`, backgroundColor: theme.primary }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Langue */}
          {languages && languages.length > 0 && (
            <div className="mb-8" onClick={() => hanldeEditSection('languages')}>
              <h2
                className="text-lg font-bold uppercase mb-2 pb-1 border-b-2"
                style={{ borderColor: theme.primary }}
              >
                Langues
              </h2>
              <div className="space-y-2">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map(language => (
                    <div className="flex justify-between" key={language.id}>
                      <span className="text-sm">{language.name}</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const level = ResumeEnumLanguages.indexOf(language.level);
                          return (
                            <div
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: i <= level ? theme.primary : '#e0e0e0' }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Certification */}
          {certfications && certfications.length > 0 && (
            <div className="mb-8" onClick={() => hanldeEditSection('certfications')}>
              <h2
                className="text-lg font-bold uppercase mb-2 pb-1 border-b-2"
                style={{ borderColor: theme.primary }}
              >
                Certifications
              </h2>
              <div className="space-y-3">
                {certfications
                  .sort((a, b) => a.order - b.order)
                  .map(cert => (
                    <div className="mb-2" key={cert.id}>
                      <h3 className="text-sm font-medium">{cert.name}</h3>
                      <p className="text-gray-600 text-xs">{cert.issuer}</p>
                      {cert.issueDate && (
                        <p className="text-xs">
                          {formatDate(cert.issueDate)}
                          {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                        </p>
                      )}
                      {cert.credentialId && (
                        <p className="text-xs">
                          <span className="font-bold">ID:</span> {cert.credentialId}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <p className="text-xs">
                          <span className="font-bold">URL:</span> {cert.credentialUrl}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 p-6">
          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <div className="mb-8" onClick={() => hanldeEditSection('experiences')}>
              <h2
                className="text-lg font-bold uppercase mb-4 pb-1 border-b-2"
                style={{ borderColor: theme.primary }}
              >
                Expérience
              </h2>
              <div className="space-y-4">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map(experience => (
                    <div key={experience.id} className="mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                        <h3 className="text-base font-medium">{experience.position}</h3>
                        <div className="text-xs italic">
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
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {experience.desctiption}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* formation or education */}
          {educations && educations.length > 0 && (
            <div className="mb-8" onClick={() => hanldeEditSection('educations')}>
              <h2
                className="text-lg font-bold uppercase mb-4 pb-1 border-b-2"
                style={{ borderColor: theme.primary }}
              >
                Formation
              </h2>
              <div className="space-y-4">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map(education => (
                    <div className="mb-4" key={education.id}>
                      <div className="flex-col flex sm:flex-row items-center justify-between mb-1">
                        <h3 className="text-base font-medium">{education.degree}</h3>
                        <div className="text-xs italic">
                          {formatDate(education.startDate)} -{' '}
                          {education.endDate ? formatDate(education.endDate) : 'Présent'}
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        <span className="mx-2 text-sm">{education.institutions}</span>
                        {education.location && (
                          <>
                            <span className="mx-2 text-xs">•</span>
                            <span className="text-sm">{education.location}</span>
                          </>
                        )}
                      </div>
                      {education.fieldOfStudy && (
                        <p className="text-sm font-medium">{education.fieldOfStudy}</p>
                      )}
                      {education.description && (
                        <p className="text-sm text-gray-700">{education.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* achievements */}
          {achievements && achievements.length > 0 && (
            <div className="mb-8" onClick={() => hanldeEditSection('achievements')}>
              <h2
                className="text-lg font-bold uppercase mb-4 pb-1 border-b-2"
                style={{ borderColor: theme.primary }}
              >
                Réalisations
              </h2>
              <div className="space-y-4">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map(achievements => (
                    <div className="flex mb-2" key={achievements.id}>
                      <div className="mr-3 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: theme.primary }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{achievements.title}</h3>
                        {achievements.description && (
                          <p className="text-sm text-gray-700">{achievements.description}</p>
                        )}

                        {achievements.date && (
                          <div className="text-xs italic">{formatDate(achievements.date)}</div>
                        )}
                      </div>
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
