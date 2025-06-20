"use client"

import type { ResumeTemplateProps } from "@/types/resumeTypes"
import { formatDate } from "@/utils/data-utils"
import type React from "react"

/**
 * Template Mint Green de CV (inspiré de l'image Aiden Williams) - Version Responsive
 * Caractéristiques:
 * - Design clean et moderne
 * - Palette verte menthe (#4ECDC4)
 * - Layout responsive avec sections bien définies
 * - Photo circulaire avec fond coloré
 * - Typographie sans-serif claire
 * - Icônes et capsules colorées pour les sections
 * - Optimisé pour mobile, tablette et desktop
 */
export const MintGreenTemplate: React.FC<ResumeTemplateProps> = ({ resume, isEditable = false, onEditSection }) => {
  const { personalInfo, educations, experiences, skills, languages, certifications, projects, achievements } = resume

  const theme = resume.theme || {
    primary: "#059669",
    secondary: "#10b981",
    accent: "#34d399",
    background: "#FFFFFF",
    text: "#1f2937",
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
        fontFamily: resume.font?.name || "Inter, sans-serif",
        color: theme.text,
        backgroundColor: theme.background,
      }}
    >
      {/* En-tête avec photo et nom - Responsive */}
      <header className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6" onClick={() => handleEditSection("personalInfo")}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Photo de profil avec fond coloré */}
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              {personalInfo?.photoUrl ? (
                <img
                  src={personalInfo.photoUrl || "/placeholder.svg"}
                  alt="Photo de profil"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Nom et titre */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide mb-2" style={{ color: theme.text }}>
              {personalInfo?.firstName?.toUpperCase()} {personalInfo?.lastName?.toUpperCase()}
            </h1>
            {personalInfo?.title && (
              <div
                className="inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-white"
                style={{ backgroundColor: theme.primary }}
              >
                {personalInfo.title.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Section Contacts - Responsive */}
        <section onClick={() => handleEditSection("personalInfo")}>
          <div className="flex items-center mb-4">
            <div
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: theme.primary }}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>
              CONTACTS
            </h2>
          </div>

          <div className="ml-9 sm:ml-11 space-y-2">
            {personalInfo?.email && (
              <div className="flex items-center text-xs sm:text-sm break-all">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
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
              <div className="flex items-center text-xs sm:text-sm">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
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
              <div className="flex items-center text-xs sm:text-sm break-all">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
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
              <div className="flex items-center text-xs sm:text-sm">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0"
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
        </section>

        {/* Section Summary */}
        {personalInfo?.description && (
          <section onClick={() => handleEditSection("summary")}>
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: theme.primary }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>
                SUMMARY
              </h2>
            </div>

            <div className="ml-9 sm:ml-11">
              <p className="text-xs sm:text-sm leading-relaxed text-gray-700">{personalInfo.description}</p>
            </div>
          </section>
        )}

        {/* Section Experience */}
        {experiences && experiences.length > 0 && (
          <section onClick={() => handleEditSection("experiences")}>
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: theme.primary }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1zM4 9v7h12V9H4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>
                EXPERIENCE
              </h2>
            </div>

            <div className="ml-9 sm:ml-11 space-y-4 sm:space-y-6">
              {experiences
                .sort((a, b) => a.order - b.order)
                .map((experience) => (
                  <div key={experience.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-1 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm sm:text-base">{experience.company}</h3>
                        <h4 className="font-semibold text-xs sm:text-sm" style={{ color: theme.primary }}>
                          {experience.position}
                        </h4>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 sm:text-right sm:ml-4">
                        <div>{experience.location}</div>
                        <div>
                          {formatDate(experience.startDate)} -{" "}
                          {experience.current ? "Present" : experience.endDate ? formatDate(experience.endDate) : ""}
                        </div>
                      </div>
                    </div>

                    {experience.description && (
                      <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                        {experience.description.split("\n").map(
                          (line, index) =>
                            line.trim() && (
                              <li key={index} className="flex items-start">
                                <span
                                  className="mr-2 mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: theme.primary }}
                                />
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

        {/* Section Skills - Responsive Grid */}
        {skills && skills.length > 0 && (
          <section onClick={() => handleEditSection("skills")}>
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: theme.primary }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>
                SKILLS
              </h2>
            </div>

            <div className="ml-9 sm:ml-11">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(
                  skills
                    .sort((a, b) => a.order - b.order)
                    .reduce(
                      (acc, skill) => {
                        const category = skill.category || "General"
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
                    <h3 className="font-semibold text-xs sm:text-sm mb-2">{category}</h3>
                    <ul className="space-y-1">
                      {skillsInCategory.map((skill) => (
                        <li key={skill.id} className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center">
                            <span
                              className="mr-2 w-1 h-1 rounded-full flex-shrink-0"
                              style={{ backgroundColor: theme.primary }}
                            />
                            {skill.name}
                          </div>
                          {skill.level && <span className="text-xs text-gray-500 ml-2">{skill.level}%</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section Certifications */}
        {certifications && certifications.length > 0 && (
          <section onClick={() => handleEditSection("certifications")}>
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: theme.primary }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>
                CERTIFICATION
              </h2>
            </div>

            <div className="ml-9 sm:ml-11 space-y-4">
              {certifications
                .sort((a, b) => a.order - b.order)
                .map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-bold text-xs sm:text-sm">{cert.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{cert.issuer}</p>
                    {cert.issueDate && (
                      <p className="text-xs text-gray-500">
                        Issued: {formatDate(cert.issueDate)}
                        {cert.expiryDate && ` • Expires: ${formatDate(cert.expiryDate)}`}
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
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Section Education */}
        {educations && educations.length > 0 && (
          <section onClick={() => handleEditSection("educations")}>
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: theme.primary }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>
                EDUCATION
              </h2>
            </div>

            <div className="ml-9 sm:ml-11 space-y-4">
              {educations
                .sort((a, b) => a.order - b.order)
                .map((education) => (
                  <div key={education.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 space-y-1 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-bold text-xs sm:text-sm">{education.institution}</h3>
                        <h4 className="text-xs sm:text-sm" style={{ color: theme.primary }}>
                          {education.degree}
                        </h4>
                        {education.fieldOfStudy && (
                          <p className="text-xs sm:text-sm text-gray-600">{education.fieldOfStudy}</p>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 sm:text-right sm:ml-4">
                        <div>{education.location}</div>
                        <div>
                          {formatDate(education.startDate)} -{" "}
                          {education.endDate ? formatDate(education.endDate) : "Present"}
                        </div>
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

        {/* Section Languages - Responsive */}
        {languages && languages.length > 0 && (
          <section onClick={() => handleEditSection("languages")}>
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: theme.primary }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 12.236 11.618 14z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>
                LANGUAGES
              </h2>
            </div>

            <div className="ml-9 sm:ml-11">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {languages
                  .sort((a, b) => a.order - b.order)
                  .map((language) => (
                    <div key={language.id} className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm">{language.name}</span>
                      <span className="text-xs text-gray-500">
                        {typeof language.level === "string"
                          ? language.level.charAt(0).toUpperCase() + language.level.slice(1).toLowerCase()
                          : language.level || "N/A"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Section Projects */}
        {projects && projects.length > 0 && (
          <section onClick={() => handleEditSection("projects")}>
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: theme.primary }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>
                PROJECTS
              </h2>
            </div>

            <div className="ml-9 sm:ml-11 space-y-4">
              {projects
                .sort((a, b) => a.order - b.order)
                .map((project) => (
                  <div key={project.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 space-y-1 sm:space-y-0">
                      <h3 className="font-bold text-xs sm:text-sm">{project.title}</h3>
                      {(project.startDate || project.endDate) && (
                        <div className="text-xs sm:text-sm text-gray-600 sm:ml-4">
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
                        className="text-xs hover:underline break-all"
                        style={{ color: theme.primary }}
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Section Achievements */}
        {achievements && achievements.length > 0 && (
          <section onClick={() => handleEditSection("achievements")} className="pb-6 sm:pb-8">
            <div className="flex items-center mb-4">
              <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: theme.primary }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>
                KEY ACHIEVEMENTS
              </h2>
            </div>

            <div className="ml-9 sm:ml-11 space-y-3">
              {achievements
                .sort((a, b) => a.order - b.order)
                .map((achievement) => (
                  <div key={achievement.id} className="flex items-start">
                    <span
                      className="mr-2 mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm">{achievement.title}</h3>
                      {achievement.description && (
                        <p className="text-xs sm:text-sm text-gray-700">{achievement.description}</p>
                      )}
                      {achievement.date && <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.date)}</p>}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
