"use client"

import React from "react"
import { EditableText } from "@/components/ui/editable-text"
import { useResume } from "@/context/resume-context"
import type { ResumeTemplateProps } from "@/types/resumeTypes"

/**
 * Composant Wrapper pour faciliter l'édition directe dans les templates de CV
 * Ce composant fournit des méthodes d'aide pour gérer l'édition directe des différentes sections du CV
 */
export const EditableResumeWrapper: React.FC<{
  children: (helpers: EditableResumeHelpers) => React.ReactNode
  resume: ResumeTemplateProps["resume"]
  isEditable?: boolean
}> = ({ children, resume, isEditable = false }) => {
  const { updateResume, isPreviewMode } = useResume()

  // Peut-on éditer ce CV dans l'état actuel?
  const canEdit = isEditable && !isPreviewMode

  // Fonction pour mettre à jour les informations personnelles
  const updatePersonalInfo = (field: string, value: string) => {
    if (!canEdit || !resume.personalInfo) return

    const updatedPersonalInfo = {
      ...resume.personalInfo,
      [field]: value,
    }

    updateResume({
      personalInfo: updatedPersonalInfo,
    })
  }

  // Fonction pour mettre à jour une expérience
  const updateExperience = (id: string, field: string, value: string) => {
    if (!canEdit || !resume.experiences) return

    const updatedExperiences = resume.experiences.map(exp => {
      if (exp.id === id) {
        return {
          ...exp,
          [field]: value,
        }
      }
      return exp
    })

    updateResume({
      experiences: updatedExperiences,
    })
  }

  // Fonction pour mettre à jour une éducation
  const updateEducation = (id: string, field: string, value: string) => {
    if (!canEdit || !resume.educations) return

    const updatedEducations = resume.educations.map(edu => {
      if (edu.id === id) {
        return {
          ...edu,
          [field]: value,
        }
      }
      return edu
    })

    updateResume({
      educations: updatedEducations,
    })
  }

  // Fonction pour mettre à jour une compétence
  const updateSkill = (id: string, field: string, value: string) => {
    if (!canEdit || !resume.skills) return

    const updatedSkills = resume.skills.map(skill => {
      if (skill.id === id) {
        return {
          ...skill,
          [field]: value,
        }
      }
      return skill
    })

    updateResume({
      skills: updatedSkills,
    })
  }

  // Fonction pour mettre à jour une langue
  const updateLanguage = (id: string, field: string, value: string) => {
    if (!canEdit || !resume.languages) return

    const updatedLanguages = resume.languages.map(lang => {
      if (lang.id === id) {
        return {
          ...lang,
          [field]: value,
        }
      }
      return lang
    })

    updateResume({
      languages: updatedLanguages,
    })
  }

  // Fonction pour mettre à jour une certification
  const updateCertification = (id: string, field: string, value: string) => {
    if (!canEdit || !resume.certifications) return

    const updatedCertifications = resume.certifications.map(cert => {
      if (cert.id === id) {
        return {
          ...cert,
          [field]: value,
        }
      }
      return cert
    })

    updateResume({
      certifications: updatedCertifications,
    })
  }

  // Fonction pour mettre à jour un projet
  const updateProject = (id: string, field: string, value: string) => {
    if (!canEdit || !resume.projects) return

    const updatedProjects = resume.projects.map(proj => {
      if (proj.id === id) {
        return {
          ...proj,
          [field]: value,
        }
      }
      return proj
    })

    updateResume({
      projects: updatedProjects,
    })
  }

  // Fonction pour mettre à jour une réalisation
  const updateAchievement = (id: string, field: string, value: string) => {
    if (!canEdit || !resume.achievements) return

    const updatedAchievements = resume.achievements.map(ach => {
      if (ach.id === id) {
        return {
          ...ach,
          [field]: value,
        }
      }
      return ach
    })

    updateResume({
      achievements: updatedAchievements,
    })
  }

  // Composant pour texte éditable avec les bonnes props
  const EditableField: React.FC<{
    value: string
    onChange: (value: string) => void
    as?: "p" | "h1" | "h2" | "h3" | "h4" | "span"
    className?: string
    style?: React.CSSProperties
    multiline?: boolean
  }> = ({ value, onChange, ...props }) => {
    return (
      <EditableText
        value={value}
        onChange={onChange}
        {...props}
      />
    )
  }

  const helpers: EditableResumeHelpers = {
    canEdit,
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkill,
    updateLanguage,
    updateCertification,
    updateProject,
    updateAchievement,
    EditableField,
  }

  return <>{children(helpers)}</>
}

export interface EditableResumeHelpers {
  canEdit: boolean
  updatePersonalInfo: (field: string, value: string) => void
  updateExperience: (id: string, field: string, value: string) => void
  updateEducation: (id: string, field: string, value: string) => void
  updateSkill: (id: string, field: string, value: string) => void
  updateLanguage: (id: string, field: string, value: string) => void
  updateCertification: (id: string, field: string, value: string) => void
  updateProject: (id: string, field: string, value: string) => void
  updateAchievement: (id: string, field: string, value: string) => void
  EditableField: React.FC<{
    value: string
    onChange: (value: string) => void
    as?: "p" | "h1" | "h2" | "h3" | "h4" | "span"
    className?: string
    style?: React.CSSProperties
    multiline?: boolean
  }>
}