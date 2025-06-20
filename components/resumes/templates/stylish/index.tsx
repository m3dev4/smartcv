"use client"

import type { ResumeTemplateProps } from "@/types/resumeTypes"
import { formatDate } from "@/utils/data-utils"
import type React from "react"

/**
 * Template Stylish avec Photo - Version Responsive
 * Caractéristiques:
 * - Photo de profil adaptative
 * - Design Stylish et professionnel sur tous écrans
 * - Layout adaptatif (deux colonnes → une colonne sur mobile)
 * - Couleurs bleu/gris élégantes
 * - Sections bien définies avec icônes
 * - Timeline responsive avec points colorés
 * - Barres de progression et notation par cercles adaptatives
 * - Optimisé pour tous les appareils
 */
export const StylishTemplate: React.FC<ResumeTemplateProps> = ({ resume, isEditable = false, onEditSection }) => {
  const { personalInfo, educations, experiences, skills, languages, certifications, projects, achievements } = resume

  const theme = resume.theme || {
    primary: "#2563EB",
    secondary: "#F1F5F9",
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
      className="w-full max-w-4xl mx-auto bg-white shadow-xl"
      style={{
        fontFamily: resume.font?.name || "Inter, sans-serif",
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête avec informations personnelles et photo - Responsive */}
      <header
        className="relative p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6"
        style={{ backgroundColor: theme.secondary }}
        onClick={() => handleEditSection("personalInfo")}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: theme.accent }}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            {personalInfo?.title && (
              <h2 className="text-base sm:text-lg lg:text-xl font-medium mb-3 sm:mb-4 text-gray-600">
                {personalInfo.title}
              </h2>
            )}

            {/* Informations de contact - Responsive */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600"
              style={{ color: theme.accent }}
            >
              {personalInfo?.phone && (
                <div className="flex items-center break-all">
                  <span className="font-medium mr-2 flex-shrink-0">📞</span>
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo?.email && (
                <div className="flex items-center break-all">
                  <span className="font-medium mr-2 flex-shrink-0">✉️</span>
                  {personalInfo.email}
                </div>
              )}
              {personalInfo?.website && (
                <div className="flex items-center break-all">
                  <span className="font-medium mr-2 flex-shrink-0">🌐</span>
                  {personalInfo.website}
                </div>
              )}
              {personalInfo?.location && (
                <div className="flex items-center">
                  <span className="font-medium mr-2 flex-shrink-0">📍</span>
                  {personalInfo.location}
                </div>
              )}
            </div>
          </div>

          {/* Photo de profil - Responsive */}
          {personalInfo?.photoUrl && (
            <div className="flex justify-center sm:justify-end sm:ml-8">
              <img
                src={personalInfo.photoUrl || "/placeholder.svg"}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
        {/* Colonne principale (2/3) - Responsive */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          {/* Summary */}
          {personalInfo?.description && (
            <section onClick={() => handleEditSection("summary")}>
              <h2
                className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{personalInfo.description}</p>
            </section>
          )}

          {/* Experience avec Timeline - Responsive */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection("experiences")}>
              <h2
                className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                EXPERIENCE
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map((experience, index) => (
                    <div key={experience.id} className="relative">
                      {/* Timeline dot - Responsive */}
                      <div
                        className="absolute left-0 top-2 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: theme.primary }}
                      />

                      <div className="ml-6 sm:ml-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-1 sm:space-y-0">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-bold">{experience.position}</h3>
                            <h4 className="text-sm sm:text-base font-medium" style={{ color: theme.primary }}>
                              {experience.company}
                            </h4>
                            {experience.location && (
                              <p className="text-xs sm:text-sm text-gray-600">{experience.location}</p>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 sm:ml-4">
                            <span className="font-medium">
                              {formatDate(experience.startDate)} -{" "}
                              {experience.current
                                ? "Present"
                                : experience.endDate
                                  ? formatDate(experience.endDate)
                                  : ""}
                            </span>
                          </div>
                        </div>
                        {experience.description && (
                          <div className="text-gray-700 text-xs sm:text-sm">
                            {experience.description.split("\n").map(
                              (line, lineIndex) =>
                                line.trim() && (
                                  <p key={lineIndex} className="mb-1">
                                    • {line.trim()}
                                  </p>
                                ),
                            )}
                          </div>
                        )}
                      </div>

                      {/* Timeline line - Responsive */}
                      {index < experiences.length - 1 && (
                        <div
                          className="absolute left-1 sm:left-1.5 top-6 sm:top-8 w-0.5 h-12 sm:h-16"
                          style={{ backgroundColor: theme.secondary }}
                        />
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Education - Responsive */}
          {educations && educations.length > 0 && (
            <section onClick={() => handleEditSection("educations")}>
              <h2
                className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                EDUCATION
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map((education) => (
                    <div
                      key={education.id}
                      className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-sm sm:text-base">{education.degree}</h3>
                        <h4 className="font-medium text-sm sm:text-base" style={{ color: theme.primary }}>
                          {education.institution}
                        </h4>
                        {education.fieldOfStudy && (
                          <p className="text-xs sm:text-sm text-gray-600">{education.fieldOfStudy}</p>
                        )}
                        {education.location && <p className="text-xs sm:text-sm text-gray-600">{education.location}</p>}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 sm:text-right sm:ml-4">
                        {formatDate(education.startDate)} -{" "}
                        {education.endDate ? formatDate(education.endDate) : "Present"}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar (1/3) - Responsive */}
        <div className="space-y-6 lg:space-y-8">
          {/* Skills avec barres de progression - Responsive */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection("skills")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                SKILLS
              </h2>
              <div className="space-y-3 sm:space-y-4">
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
                    <h3 className="font-semibold mb-2 text-xs sm:text-sm">{category}</h3>
                    <div className="space-y-1 sm:space-y-2">
                      {skillsInCategory.map((skill) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm flex-1 mr-2">{skill.name}</span>
                          {skill.level && (
                            <div className="w-16 sm:w-20 h-1.5 sm:h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                style={{
                                  backgroundColor: theme.primary,
                                  width:
                                    skill.level === "Expert"
                                      ? "100%"
                                      : skill.level === "Advanced"
                                        ? "80%"
                                        : skill.level === "Intermediate"
                                          ? "60%"
                                          : "40%",
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

          {/* Languages avec notation par cercles - Responsive */}
          {languages && languages.length > 0 && (
            <section onClick={() => handleEditSection("languages")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                LANGUAGES
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map((language) => (
                    <div key={language.id} className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium flex-1 mr-2">{language.name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1"
                            style={{
                              backgroundColor:
                                level <=
                                (language.level === "Native"
                                  ? 5
                                  : language.level === "Fluent"
                                    ? 4
                                    : language.level === "Advanced"
                                      ? 3
                                      : language.level === "Intermediate"
                                        ? 2
                                        : 1)
                                  ? theme.primary
                                  : "#E5E7EB",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Certifications - Responsive */}
          {certifications && certifications.length > 0 && (
            <section onClick={() => handleEditSection("certifications")}>
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                CERTIFICATIONS
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {certifications
                  .sort((a, b) => a.order - b.order)
                  .map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-semibold text-xs sm:text-sm">{cert.name}</h3>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                      {cert.issueDate && <p className="text-xs text-gray-500">{formatDate(cert.issueDate)}</p>}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Projects - Responsive */}
          {projects && projects.length > 0 && (
            <section onClick={() => handleEditSection("projects")} className="pb-4 lg:pb-0">
              <h2
                className="text-base sm:text-lg font-bold mb-3 sm:mb-4 pb-2 border-b-2"
                style={{ color: theme.primary, borderColor: theme.primary }}
              >
                PROJECTS
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .map((project) => (
                    <div key={project.id}>
                      <h3 className="font-semibold text-xs sm:text-sm">{project.title}</h3>
                      {project.description && <p className="text-xs text-gray-700 mt-1">{project.description}</p>}
                      {project.url && (
                        <a
                          href={project.url}
                          className="text-xs hover:underline break-all"
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
      </div>
    </div>
  )
}
