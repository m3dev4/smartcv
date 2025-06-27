"use client"

import type { ResumeTemplateProps } from "@/types/resumeTypes"
import { formatDate } from "@/utils/data-utils"
import type React from "react"

/**
 * Template Élégant - Version Responsive
 * Caractéristiques:
 * - Design moderne et sophistiqué
 * - Layout adaptatif (sidebar → sections empilées sur mobile)
 * - Gradient subtil et typographie élégante
 * - Espacement harmonieux responsive
 * - Couleurs raffinées
 * - Éléments visuels discrets mais impactants
 * - Timeline adaptative
 * - Optimisé pour tous les appareils
 */
export const ElegantTemplate: React.FC<ResumeTemplateProps> = ({ resume, isEditable = false, onEditSection }) => {
  const { personalInfo, educations, experiences, skills, languages, certifications, projects, achievements, hobbies } = resume

  const theme = resume.theme || {
    primary: "#6366F1",
    secondary: "#F8FAFC",
    accent: "#EC4899",
    background: "#FFFFFF",
    text: "#0F172A",
  }

  const handleEditSection = (sectionType: string, sectionId?: string) => {
    if (isEditable && onEditSection) {
      onEditSection(sectionType, sectionId || "")
    }
  }

  return (
    <div
      className="w-full max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden"
      style={{
        fontFamily: resume.font?.name || "Inter, sans-serif",
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête avec gradient - Responsive */}
      <div
        className="relative p-4 sm:p-6 lg:p-8 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
        }}
        onClick={() => handleEditSection("personalInfo")}
      >
        {/* Motifs décoratifs - Adaptés pour mobile */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 opacity-10">
          <div className="w-full h-full border-2 border-white rounded-full transform rotate-45"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 opacity-10">
          <div className="w-full h-full border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 tracking-wide">
                {personalInfo?.firstName} {personalInfo?.lastName}
              </h1>
              {personalInfo?.title && (
                <h2 className="text-base sm:text-lg lg:text-xl mb-4 lg:mb-6 opacity-90 font-light">
                  {personalInfo.title}
                </h2>
              )}

              {/* Contact en grille élégante - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm opacity-90">
                {personalInfo?.email && (
                  <div className="flex items-center break-all">
                    <span className="mr-2 sm:mr-3">✉</span>
                    {personalInfo.email}
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center">
                    <span className="mr-2 sm:mr-3">☎</span>
                    {personalInfo.phone}
                  </div>
                )}
                {personalInfo?.location && (
                  <div className="flex items-center">
                    <span className="mr-2 sm:mr-3">📍</span>
                    {personalInfo.location}
                  </div>
                )}
                {personalInfo?.website && (
                  <div className="flex items-center break-all">
                    <span className="mr-2 sm:mr-3">🌐</span>
                    {personalInfo.website}
                  </div>
                )}
              </div>
            </div>

            {/* Photo élégante - Responsive */}
            {personalInfo?.photoUrl && (
              <div className="flex justify-center lg:justify-end lg:ml-8">
                <div className="relative">
                  <div className="absolute -inset-2 bg-white/20 rounded-full blur-md"></div>
                  <img
                    src={personalInfo.photoUrl || "/placeholder.svg"}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white/30"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Contenu principal - Responsive */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Summary avec style élégant */}
          {personalInfo?.description && (
            <section onClick={() => handleEditSection("personalInfo")} className="mb-6 lg:mb-8">
              <div className="relative">
                <div
                  className="absolute left-0 top-0 w-1 h-6 sm:h-8 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-6" style={{ color: theme.text }}>
                  À propos
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg font-light pl-4 sm:pl-6">
                {personalInfo.description}
              </p>
            </section>
          )}

          {/* Experience avec timeline élégante - Responsive */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection("experiences")} className="mb-6 lg:mb-8">
              <div className="relative">
                <div
                  className="absolute left-0 top-0 w-1 h-6 sm:h-8 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pl-4 sm:pl-6" style={{ color: theme.text }}>
                  Expérience
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-6 pl-4 sm:pl-6">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map((experience, index) => (
                    <div key={experience.id} className="relative">
                      {/* Timeline - Adaptée pour mobile */}
                      <div className="hidden sm:block absolute -left-4 sm:-left-6 top-6 w-8 sm:w-12 h-0.5 bg-gray-200"></div>
                      <div
                        className="hidden sm:block absolute -left-2 sm:-left-3 top-5 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: index === 0 ? theme.primary : theme.accent }}
                      ></div>

                      <div className="bg-gray-50 p-4 sm:p-6 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{experience.position}</h3>
                            <h4 className="text-base sm:text-lg font-semibold" style={{ color: theme.primary }}>
                              {experience.company}
                            </h4>
                            {experience.location && (
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">{experience.location}</p>
                            )}
                          </div>
                          <div
                            className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium self-start sm:ml-4"
                            style={{ backgroundColor: theme.accent }}
                          >
                            {formatDate(experience.startDate)} -{" "}
                            {experience.current ? "Présent" : experience.endDate ? formatDate(experience.endDate) : ""}
                          </div>
                        </div>
                        {experience.description && (
                          <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            {experience.description.split("\n").map(
                              (line, lineIndex) =>
                                line.trim() && (
                                  <p key={lineIndex} className="mb-2 flex items-start">
                                    <span
                                      className="mr-2 sm:mr-3 mt-1.5 sm:mt-2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: theme.primary }}
                                    />
                                    {line.trim()}
                                  </p>
                                ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Education - Responsive */}
          {educations && educations.length > 0 && (
            <section onClick={() => handleEditSection("educations")} className="mb-6 lg:mb-8">
              <div className="relative">
                <div
                  className="absolute left-0 top-0 w-1 h-6 sm:h-8 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pl-4 sm:pl-6" style={{ color: theme.text }}>
                  Formation
                </h2>
              </div>
              <div className="grid gap-3 sm:gap-4 pl-4 sm:pl-6">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map((education) => (
                    <div key={education.id} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-1 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="font-bold text-base sm:text-lg">{education.degree}</h3>
                          <h4 className="font-semibold text-sm sm:text-base" style={{ color: theme.primary }}>
                            {education.institution}
                          </h4>
                          {education.fieldOfStudy && (
                            <p className="text-xs sm:text-sm text-gray-600">{education.fieldOfStudy}</p>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 font-medium sm:ml-4">
                          {formatDate(education.startDate)} -{" "}
                          {education.endDate ? formatDate(education.endDate) : "Présent"}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar élégante - Responsive */}
        <div className="w-full lg:w-80 bg-gray-50 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Skills avec barres de progression - Responsive */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection("skills")}>
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: theme.text }}>
                Compétences
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {skills
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 8)
                  .map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.level}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div
                          className="h-1.5 sm:h-2 rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: theme.primary,
                            width:
                              skill.level === "Expert"
                                ? "95%"
                                : skill.level === "Advanced"
                                  ? "80%"
                                  : skill.level === "Intermediate"
                                    ? "65%"
                                    : "45%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Languages - Responsive */}
          {languages && languages.length > 0 && (
            <section onClick={() => handleEditSection("languages")}>
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: theme.text }}>
                Langues
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map((language) => (
                    <div key={language.id} className="flex justify-between items-center p-2 sm:p-3 bg-white rounded-lg">
                      <span className="font-medium text-sm sm:text-base">{language.name}</span>
                      <span
                        className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: theme.accent }}
                      >
                        {language.level}%
                      </span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Certifications - Responsive */}
          {certifications && certifications.length > 0 && (
            <section onClick={() => handleEditSection("certifications")}>
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: theme.text }}>
                Certifications
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {certifications
                  .sort((a, b) => a.order - b.order)
                  .map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3 sm:p-4 bg-white rounded-lg border-l-4"
                      style={{ borderLeftColor: theme.primary }}
                    >
                      <h3 className="font-bold text-xs sm:text-sm">{cert.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{cert.issuer}</p>
                      {cert.issueDate && <p className="text-xs text-gray-500">{formatDate(cert.issueDate)}</p>}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Projects - Responsive */}
          {projects && projects.length > 0 && (
            <section onClick={() => handleEditSection("projects")}>
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: theme.text }}>
                Projets
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 3)
                  .map((project) => (
                    <div key={project.id} className="p-3 sm:p-4 bg-white rounded-lg">
                      <h3 className="font-bold text-xs sm:text-sm mb-2">{project.title}</h3>
                      {project.description && <p className="text-xs text-gray-700 mb-2">{project.description}</p>}
                      {project.url && (
                        <a
                          href={project.url}
                          className="text-xs font-medium hover:underline break-all"
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

          {/* Achievements - Responsive */}
          {achievements && achievements.length > 0 && (
            <section onClick={() => handleEditSection("achievements")} className="pb-4 lg:pb-0">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6" style={{ color: theme.text }}>
                Réalisations
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .map((achievement) => (
                    <div key={achievement.id} className="flex items-start p-2 sm:p-3 bg-white rounded-lg">
                      <span
                        className="mr-2 sm:mr-3 mt-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: theme.accent }}
                      />
                      <div>
                        <h3 className="font-semibold text-xs sm:text-sm">{achievement.title}</h3>
                        {achievement.description && (
                          <p className="text-xs text-gray-700 mt-1">{achievement.description}</p>
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
    </div>
  )
}
