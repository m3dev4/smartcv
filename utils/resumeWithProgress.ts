export function calculateResumeProgress(resume: any): number {
  const sections = [
    resume.personalInfo?.length > 0,
    resume.experiences?.length > 0,
    resume.educations?.length > 0,
    resume.skills?.length > 0,
    resume.languages?.length > 0,
    resume.certifications?.length > 0,
    resume.achievements?.length > 0,
  ];
  const completedSections = sections.filter(Boolean).length;
  return Math.round((completedSections / sections.length) * 100);
}
