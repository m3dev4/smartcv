"use client"

import type { ResumeTemplateProps } from "@/types/resumeTypes"
import { formatDate } from "@/utils/data-utils"
import type React from "react"
import { EditableText } from "@/components/ui/editable-text"

/**
 * Template Clean Professional de CV (inspiré du design Sophia Foster) - Version Responsive
 * Caractéristiques:
 * - Design très épuré et minimaliste
 * - Layout en deux colonnes (70/30) sur desktop, une colonne sur mobile
 * - Typographie simple et claire
 * - Pas de bordures, juste des lignes de séparation
 * - Fond blanc avec texte noir
 * - Accents de couleur subtils
 * - Très professionnel et structuré
 * - Optimisé pour tous les appareils
 */
export const CleanProfessionalTemplate: React.FC<ResumeTemplateProps> = ({
  resume,
  isEditable = false,
  onEditSection,
}) => {
  const { personalInfo, educations, experiences, skills, languages, certifications, projects, achievements } = resume
  
  // Fonction pour mettre à jour les informations personnelles
  const handlePersonalInfoUpdate = (field: string, value: string) => {
    if (isEditable && onEditSection) {
      // Signaler qu'une édition de la section personalInfo est demandée
      // La logique d'édition sera gérée par le composant parent
      onEditSection("personalInfo", "");
      
      // Note: Idéalement, nous voudrions mettre à jour directement ici avec:
      // const updatedResume = {
      //   ...resume,
      //   personalInfo: {
      //     ...resume.personalInfo,
      //     [field]: value
      //   }
      // };
      // Mais cela nécessiterait d'utiliser le context directement ou de passer
      // une fonction de mise à jour complète via les props
    }
  };

  const theme = resume.theme || {
    primary: "#2563EB",
    secondary: "#F8FAFC",
    accent: "#1E40AF",
    background: "#FFFFFF",
    text: "#1F2937",
  }

  const handleEditSection = (sectionType: string, sectionId?: string) => {
    if (isEditable && onEditSection) {
      onEditSection(sectionType, sectionId || "")
    }
  }

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-white shadow-lg"
      style={{
        fontFamily: resume.font?.name || "Arial, sans-serif",
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête avec nom et titre - Responsive */}
      <header className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6" onClick={() => handleEditSection("personalInfo")}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 tracking-wide" style={{ color: theme.text }}>
          <EditableText
            value={`${personalInfo?.firstName?.toUpperCase() || ''} ${personalInfo?.lastName?.toUpperCase() || ''}`}
            onChange={(value) => {
              const names = value.split(' ');
              const firstName = names[0]?.toLowerCase() || '';
              const lastName = names.slice(1).join(' ').toLowerCase() || '';
              handlePersonalInfoUpdate('firstName', firstName);
              handlePersonalInfoUpdate('lastName', lastName);
            }}
            as="span"
          />
        </h1>
        {personalInfo?.title ? (
          <h2 className="text-base sm:text-lg text-gray-600 mb-4">
            <EditableText
              value={personalInfo.title}
              onChange={(value) => handlePersonalInfoUpdate('title', value)}
              as="span"
            />
          </h2>
        ) : isEditable ? (
          <h2 className="text-base sm:text-lg text-gray-600 mb-4">
            <EditableText
              value=""
              onChange={(value) => handlePersonalInfoUpdate('title', value)}
              as="span"
            />
          </h2>
        ) : null}

        {/* Informations de contact - Responsive */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600">
          {personalInfo?.email ? (
            <span className="break-all">
              <EditableText
                value={personalInfo.email}
                onChange={(value) => handlePersonalInfoUpdate('email', value)}
                as="span"
              />
            </span>
          ) : isEditable ? (
            <span className="break-all">
              <EditableText
                value=""
                onChange={(value) => handlePersonalInfoUpdate('email', value)}
                as="span"
              />
            </span>
          ) : null}
          
          {personalInfo?.phone ? (
            <span>
              <EditableText
                value={personalInfo.phone}
                onChange={(value) => handlePersonalInfoUpdate('phone', value)}
                as="span"
              />
            </span>
          ) : isEditable ? (
            <span>
              <EditableText
                value=""
                onChange={(value) => handlePersonalInfoUpdate('phone', value)}
                as="span"
              />
            </span>
          ) : null}
          
          {personalInfo?.location ? (
            <span>
              <EditableText
                value={personalInfo.location}
                onChange={(value) => handlePersonalInfoUpdate('location', value)}
                as="span"
              />
            </span>
          ) : isEditable ? (
            <span>
              <EditableText
                value=""
                onChange={(value) => handlePersonalInfoUpdate('location', value)}
                as="span"
              />
            </span>
          ) : null}
          
          {personalInfo?.website ? (
            <span className="break-all">
              <EditableText
                value={personalInfo.website}
                onChange={(value) => handlePersonalInfoUpdate('website', value)}
                as="span"
              />
            </span>
          ) : isEditable ? (
            <span className="break-all">
              <EditableText
                value=""
                onChange={(value) => handlePersonalInfoUpdate('website', value)}
                as="span"
              />
            </span>
          ) : null}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Colonne principale (70%) */}
        <div className="lg:col-span-7 space-y-6 lg:space-y-8">
          {/* Summary */}
          {personalInfo?.description && (
            <section onClick={() => handleEditSection("summary")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                SUMMARY
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-700">
                <EditableText
                  value={personalInfo.description || ''}
                  onChange={(value) => handlePersonalInfoUpdate('description', value)}
                  multiline={true}
                />
              </p>
            </section>
          )}

          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection("experiences")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                EXPERIENCE
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map((experience) => (
                    <div key={experience.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-1 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm sm:text-base">{experience.position}</h3>
                          <h4 className="text-xs sm:text-sm font-medium" style={{ color: theme.primary }}>
                            {experience.company}
                          </h4>
                          {experience.location && (
                            <p className="text-xs sm:text-sm text-gray-600">{experience.location}</p>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 sm:text-right sm:ml-4 sm:flex-shrink-0">
                          {formatDate(experience.startDate)} -{" "}
                          {experience.current ? "Present" : experience.endDate ? formatDate(experience.endDate) : ""}
                        </div>
                      </div>
                      {experience.description && (
                        <ul className="text-xs sm:text-sm text-gray-700 space-y-1 ml-0">
                          {experience.description.split("\n").map(
                            (line, index) =>
                              line.trim() && (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2 mt-2 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                                  {line.trim()}
                                </li>
                              ),
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
            <section onClick={() => handleEditSection("educations")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                EDUCATION
              </h2>
              <div className="space-y-4">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map((education) => (
                    <div key={education.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 space-y-1 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="font-bold text-xs sm:text-sm">{education.degree}</h3>
                          <h4 className="text-xs sm:text-sm" style={{ color: theme.primary }}>
                            {education.institution}
                          </h4>
                          {education.fieldOfStudy && (
                            <p className="text-xs sm:text-sm text-gray-600">{education.fieldOfStudy}</p>
                          )}
                          {education.location && (
                            <p className="text-xs sm:text-sm text-gray-600">{education.location}</p>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 sm:ml-4 sm:flex-shrink-0">
                          {formatDate(education.startDate)} -{" "}
                          {education.endDate ? formatDate(education.endDate) : "Present"}
                        </div>
                      </div>
                      {education.description && (
                        <p className="text-xs sm:text-sm text-gray-700 mt-2">{education.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section onClick={() => handleEditSection("projects")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                PROJECTS
              </h2>
              <div className="space-y-4">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .map((project) => (
                    <div key={project.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 space-y-1 sm:space-y-0">
                        <h3 className="font-bold text-xs sm:text-sm flex-1">{project.title}</h3>
                        {(project.startDate || project.endDate) && (
                          <div className="text-xs sm:text-sm text-gray-600 sm:ml-4 sm:flex-shrink-0">
                            {project.startDate && formatDate(project.startDate)}
                            {project.endDate && ` - ${formatDate(project.endDate)}`}
                          </div>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-xs sm:text-sm text-gray-700 mb-2">{project.description}</p>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm hover:underline break-all"
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

        {/* Sidebar droite (30%) - Responsive */}
        <div className="lg:col-span-3 space-y-6 lg:space-y-8">
          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <section onClick={() => handleEditSection("achievements")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                ACHIEVEMENTS
              </h2>
              <div className="space-y-3">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map((achievement) => (
                    <div key={achievement.id}>
                      <h3 className="font-semibold text-xs sm:text-sm">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-xs text-gray-700 mt-1">{achievement.description}</p>
                      )}
                      {achievement.date && <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.date)}</p>}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Skills - Responsive */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection("skills")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                SKILLS
              </h2>
              <div className="space-y-4">
                {Object.entries(
                  skills
                    .sort((a, b) => a.order - b.order)
                    .reduce(
                      (acc, skill) => {
                        const category = skill.category || "Technical"
                        if (!acc[category]) {
                          acc[category] = []
                        }
                        acc[category].push(skill)
                        return acc
                      },
                      {} as Record<string, typeof skills>,
                    ),
                ).map(([category, skillsInCategory]) => (
                  <div key={category}>
                    <h3 className="text-xs sm:text-sm font-semibold mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {skillsInCategory.map((skill) => (
                        <span
                          key={skill.id}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded whitespace-nowrap"
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
            <section onClick={() => handleEditSection("certifications")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                COURSES
              </h2>
              <div className="space-y-3">
                {certifications
                  .sort((a, b) => a.order - b.order)
                  .map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-semibold text-xs sm:text-sm">{cert.name}</h3>
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
                          className="text-xs hover:underline break-all"
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
            <section onClick={() => handleEditSection("languages")} className="pb-6 lg:pb-0">
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b border-gray-300"
                style={{ color: theme.text }}
              >
                LANGUAGES
              </h2>
              <div className="space-y-2">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map((language) => (
                    <div key={language.id} className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm">{language.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {typeof language.level === "string"
                          ? language.level.charAt(0).toUpperCase() + language.level.slice(1).toLowerCase()
                          : language.level || "N/A"}
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

