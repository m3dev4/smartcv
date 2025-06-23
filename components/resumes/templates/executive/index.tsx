"use client"

import type { ResumeTemplateProps } from "@/types/resumeTypes"
import { formatDate } from "@/utils/data-utils"
import type React from "react"

/**
 * Template Executive - Version Responsive
 * Caractéristiques:
 * - Design ultra-professionnel et épuré
 * - Couleurs sobres (gris/bleu foncé) adaptatives
 * - Typographie moderne et lisible sur tous écrans
 * - Layout adaptatif (sidebar → sections empilées sur mobile)
 * - Espacement parfait pour la lecture responsive
 * - Éléments visuels subtils mais impactants
 * - Optimisé pour cadres dirigeants sur tous appareils
 */
export const ExecutiveTemplate: React.FC<ResumeTemplateProps> = ({ resume, isEditable = false, onEditSection }) => {
  const { personalInfo, educations, experiences, skills, languages, certifications, projects, achievements, hobbies } = resume

  const theme = resume.theme || {
    primary: "#1E293B",
    secondary: "#F8FAFC",
    accent: "#475569",
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
      className="w-full max-w-5xl mx-auto bg-white shadow-lg"
      style={{
        fontFamily: resume.font?.name || "Inter, -apple-system, sans-serif",
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête moderne et épuré - Responsive */}
      <header
        className="relative px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 bg-gradient-to-r from-slate-50 to-gray-50"
        onClick={() => handleEditSection("personalInfo")}
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-2 sm:mb-3"
              style={{ color: theme.primary }}
            >
              {personalInfo?.firstName}
              <span className="font-bold ml-1 sm:ml-2">{personalInfo?.lastName}</span>
            </h1>
            {personalInfo?.title && (
              <h2 className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 font-light tracking-wide">
                {personalInfo.title}
              </h2>
            )}

            {/* Contact moderne - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-gray-600">
              {personalInfo?.email && (
                <div className="flex items-center break-all">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full"></div>
                  </div>
                  {personalInfo.email}
                </div>
              )}
              {personalInfo?.phone && (
                <div className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full"></div>
                  </div>
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo?.location && (
                <div className="flex items-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full"></div>
                  </div>
                  {personalInfo.location}
                </div>
              )}
              {personalInfo?.website && (
                <div className="flex items-center break-all">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full"></div>
                  </div>
                  {personalInfo.website}
                </div>
              )}
            </div>
          </div>

          {/* Photo professionnelle - Responsive */}
          {personalInfo?.photoUrl && (
            <div className="flex justify-center lg:justify-end lg:ml-10">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-100 rounded-sm overflow-hidden">
                  <img
                    src={personalInfo.photoUrl || "/placeholder.svg"}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    className="w-full h-full object-cover grayscale-[20%]"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-slate-700 rounded-sm"></div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Contenu principal - Responsive */}
        <div className="flex-1 px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
          {/* Summary professionnel */}
          {personalInfo?.description && (
            <section onClick={() => handleEditSection("personalInfo")} className="mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-8 sm:w-10 lg:w-12 h-px bg-slate-700 mr-3 sm:mr-4"></div>
                <h2
                  className="text-sm sm:text-base lg:text-lg font-medium tracking-wider uppercase"
                  style={{ color: theme.primary }}
                >
                  Executive Summary
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base font-light">
                {personalInfo.description}
              </p>
            </section>
          )}

          {/* Experience avec design moderne - Responsive */}
          {experiences && experiences.length > 0 && (
            <section onClick={() => handleEditSection("experiences")} className="mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="w-8 sm:w-10 lg:w-12 h-px bg-slate-700 mr-3 sm:mr-4"></div>
                <h2
                  className="text-sm sm:text-base lg:text-lg font-medium tracking-wider uppercase"
                  style={{ color: theme.primary }}
                >
                  Professional Experience
                </h2>
              </div>
              <div className="space-y-6 sm:space-y-8">
                {experiences
                  .sort((a, b) => a.order - b.order)
                  .map((experience, index) => (
                    <div key={experience.id} className="relative">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold mb-1" style={{ color: theme.text }}>
                            {experience.position}
                          </h3>
                          <h4 className="text-base sm:text-lg font-medium text-slate-600 mb-1 sm:mb-2">
                            {experience.company}
                          </h4>
                          {experience.location && (
                            <p className="text-xs sm:text-sm text-gray-500">{experience.location}</p>
                          )}
                        </div>
                        <div className="sm:ml-8">
                          <div className="bg-slate-100 px-3 py-1 sm:px-4 sm:py-2 rounded-sm inline-block">
                            <span className="text-xs sm:text-sm font-medium text-slate-700">
                              {formatDate(experience.startDate)} -{" "}
                              {experience.current
                                ? "Present"
                                : experience.endDate
                                  ? formatDate(experience.endDate)
                                  : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      {experience.description && (
                        <div className="pl-4 sm:pl-6 border-l-2 border-gray-100">
                          {experience.description.split("\n").map(
                            (line, lineIndex) =>
                              line.trim() && (
                                <p key={lineIndex} className="text-gray-700 mb-2 leading-relaxed text-sm sm:text-base">
                                  {line.trim()}
                                </p>
                              ),
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Education - Responsive */}
          {educations && educations.length > 0 && (
            <section onClick={() => handleEditSection("educations")} className="mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-8 sm:w-10 lg:w-12 h-px bg-slate-700 mr-3 sm:mr-4"></div>
                <h2
                  className="text-sm sm:text-base lg:text-lg font-medium tracking-wider uppercase"
                  style={{ color: theme.primary }}
                >
                  Education
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {educations
                  .sort((a, b) => a.order - b.order)
                  .map((education) => (
                    <div
                      key={education.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg" style={{ color: theme.text }}>
                          {education.degree}
                        </h3>
                        <h4 className="text-sm sm:text-base font-medium text-slate-600">{education.institution}</h4>
                        {education.fieldOfStudy && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{education.fieldOfStudy}</p>
                        )}
                        {education.location && <p className="text-xs sm:text-sm text-gray-500">{education.location}</p>}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium sm:ml-8">
                        {formatDate(education.startDate)} -{" "}
                        {education.endDate ? formatDate(education.endDate) : "Present"}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar droite moderne - Responsive */}
        <div className="w-full lg:w-80 bg-slate-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          {/* Core Competencies - Responsive */}
          {skills && skills.length > 0 && (
            <section onClick={() => handleEditSection("skills")} className="mb-8 lg:mb-10">
              <h2 className="text-sm sm:text-base font-medium tracking-wider uppercase mb-4 sm:mb-6 text-slate-700">
                Core Competencies
              </h2>
              <div className="space-y-4 sm:space-y-6">
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
                    <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-slate-600">{category}</h3>
                    <div className="space-y-2">
                      {skillsInCategory.slice(0, 4).map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-gray-700">{skill.name}</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    level <=
                                    (skill.level === "Expert"
                                      ? 4
                                      : skill.level === "Advanced"
                                        ? 3
                                        : skill.level === "Intermediate"
                                          ? 2
                                          : 1)
                                      ? theme.primary
                                      : "#E2E8F0",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages - Responsive */}
          {languages && languages.length > 0 && (
            <section onClick={() => handleEditSection("languages")} className="mb-8 lg:mb-10">
              <h2 className="text-sm sm:text-base font-medium tracking-wider uppercase mb-4 sm:mb-6 text-slate-700">
                Languages
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map((language) => (
                    <div key={language.id} className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{language.name}</span>
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-sm">{language.level}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Certifications - Responsive */}
          {certifications && certifications.length > 0 && (
            <section onClick={() => handleEditSection("certifications")} className="mb-8 lg:mb-10">
              <h2 className="text-sm sm:text-base font-medium tracking-wider uppercase mb-4 sm:mb-6 text-slate-700">
                Certifications
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {certifications
                  .sort((a, b) => a.order - b.order)
                  .map((cert) => (
                    <div key={cert.id} className="bg-white p-3 sm:p-4 rounded-sm">
                      <h3 className="font-semibold text-xs sm:text-sm text-gray-900">{cert.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{cert.issuer}</p>
                      {cert.issueDate && <p className="text-xs text-gray-500 mt-1">{formatDate(cert.issueDate)}</p>}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Key Achievements - Responsive */}
          {achievements && achievements.length > 0 && (
            <section onClick={() => handleEditSection("achievements")} className="mb-8 lg:mb-10">
              <h2 className="text-sm sm:text-base font-medium tracking-wider uppercase mb-4 sm:mb-6 text-slate-700">
                Key Achievements
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {achievements
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div key={achievement.id} className="bg-white p-3 sm:p-4 rounded-sm">
                      <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-2">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-xs text-gray-700 leading-relaxed">{achievement.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Projects - Responsive */}
          {projects && projects.length > 0 && (
            <section onClick={() => handleEditSection("projects")} className="pb-4 lg:pb-0">
              <h2 className="text-sm sm:text-base font-medium tracking-wider uppercase mb-4 sm:mb-6 text-slate-700">
                Notable Projects
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {projects
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 2)
                  .map((project) => (
                    <div key={project.id} className="bg-white p-3 sm:p-4 rounded-sm">
                      <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-2">{project.title}</h3>
                      {project.description && <p className="text-xs text-gray-700 mb-2">{project.description}</p>}
                      {project.url && (
                        <a href={project.url} className="text-xs text-slate-600 hover:text-slate-800 break-all">
                          View Project →
                        </a>
                      )}
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
