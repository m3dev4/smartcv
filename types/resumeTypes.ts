import { ResumeTemplateType } from '@/enums/resumeEnum';
import { Resume } from '@/lib/generated/prisma';
import { ReactNode } from 'react';

// Interface pour les propriets commune à tous les template
export interface ResumeTemplateProps {
  resume: Resume & {
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      title?: string;
      email: string;
      phone?: string;
      website?: string;
      location?: string;
      description?: string;
      photoUrl?: string;
    };
    educations?: {
      id: string;
      institution: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate?: string;
      description?: string;
      location?: string;
      order: number;
    }[];
    experiences?: {
      id: string;
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description?: string;
      location?: string;
      order: number;
    }[];
    skills?: {
      id: string;
      name: string;
      level?: string;
      category?: string;
      order: number;
    }[];
    languages?: {
      id: string;
      name: string;
      level: string;
      order: number;
    }[];
    certifications?: {
      id: string;
      name: string;
      issuer: string;
      issueDate: Date;
      expiryDate: Date;
      credentialId?: string;
      credentialUrl?: string;
      order: number;
    }[];
    projects?: {
      id: string;
      title: string;
      description?: string;
      url?: string;
      startDate: Date;
      endDate?: Date;
      order: number;
    }[];
    achievements?: {
      id: string;
      title: string;
      description?: string;
      date?: Date;
      order: number;
    }[];
    customSections?: {
      id: string;
      title: string;
      content: string;
      order: number;
    }[];
    theme?: {
      id: string;
      name: string;
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
    };
    template?: {
      id: string;
      name: string;
    };
    font?: {
      id: string;
      name?: string;
      category?: string;
      url?: string;
    };
  };
  isEditable?: boolean;
  onEditSection: (sectionType: string, sectionId: string) => void;
  className?: string;
}

// Interface pour le compsant template wrapper

export interface ResumeWrapperTemplateProps extends ResumeTemplateProps {
  type: ResumeTemplateType;
  children: ReactNode;
}
