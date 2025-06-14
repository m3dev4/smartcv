
/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */

Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.9.0
 * Query Engine version: 81e4af48011447c3cc503a190e86995b66d2a28e
 */
Prisma.prismaVersion = {
  client: "6.9.0",
  engine: "81e4af48011447c3cc503a190e86995b66d2a28e"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  emailVerified: 'emailVerified',
  emailVerifyToken: 'emailVerifyToken',
  emailVerifyExpires: 'emailVerifyExpires',
  passwordHash: 'passwordHash',
  passwordResetToken: 'passwordResetToken',
  passwordResetExpires: 'passwordResetExpires',
  firstName: 'firstName',
  lastName: 'lastName',
  profileImage: 'profileImage',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  role: 'role'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  lastConnected: 'lastConnected',
  expires: 'expires',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ResumeScalarFieldEnum = {
  id: 'id',
  title: 'title',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isPublic: 'isPublic',
  publicUrl: 'publicUrl',
  templateId: 'templateId',
  themeId: 'themeId',
  fontId: 'fontId'
};

exports.Prisma.PersonalInfoScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  firstName: 'firstName',
  lastName: 'lastName',
  title: 'title',
  email: 'email',
  phone: 'phone',
  website: 'website',
  location: 'location',
  photoUrl: 'photoUrl',
  description: 'description'
};

exports.Prisma.SectionScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  type: 'type',
  title: 'title',
  isVisible: 'isVisible',
  order: 'order'
};

exports.Prisma.EducationScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  institution: 'institution',
  degree: 'degree',
  fieldOfStudy: 'fieldOfStudy',
  startDate: 'startDate',
  endDate: 'endDate',
  description: 'description',
  location: 'location',
  order: 'order'
};

exports.Prisma.ExperienceScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  company: 'company',
  position: 'position',
  startDate: 'startDate',
  endDate: 'endDate',
  current: 'current',
  description: 'description',
  location: 'location',
  order: 'order'
};

exports.Prisma.SkillScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  name: 'name',
  level: 'level',
  category: 'category',
  order: 'order'
};

exports.Prisma.LanguageScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  name: 'name',
  level: 'level',
  order: 'order'
};

exports.Prisma.CertificationScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  name: 'name',
  issuer: 'issuer',
  issueDate: 'issueDate',
  expiryDate: 'expiryDate',
  credentialId: 'credentialId',
  credentialUrl: 'credentialUrl',
  order: 'order'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  title: 'title',
  description: 'description',
  url: 'url',
  startDate: 'startDate',
  endDate: 'endDate',
  order: 'order'
};

exports.Prisma.AchievementScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  title: 'title',
  description: 'description',
  date: 'date',
  order: 'order'
};

exports.Prisma.CustomSectionScalarFieldEnum = {
  id: 'id',
  resumeId: 'resumeId',
  title: 'title',
  content: 'content',
  order: 'order'
};

exports.Prisma.TemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  thumbnail: 'thumbnail',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ThemeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  background: 'background',
  text: 'text',
  description: 'description',
  thumbnail: 'thumbnail',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FontScalarFieldEnum = {
  id: 'id',
  name: 'name',
  category: 'category',
  url: 'url',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

exports.SectionType = exports.$Enums.SectionType = {
  PERSONAL_INFO: 'PERSONAL_INFO',
  EXPERIENCE: 'EXPERIENCE',
  EDUCATION: 'EDUCATION',
  SKILLS: 'SKILLS',
  LANGUAGES: 'LANGUAGES',
  CERTIFICATIONS: 'CERTIFICATIONS',
  PROJECTS: 'PROJECTS',
  ACHIEVEMENTS: 'ACHIEVEMENTS',
  CUSTOM: 'CUSTOM'
};

exports.LanguageLevel = exports.$Enums.LanguageLevel = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  FLUENT: 'FLUENT',
  NATIVE: 'NATIVE'
};

exports.Prisma.ModelName = {
  User: 'User',
  Session: 'Session',
  Resume: 'Resume',
  PersonalInfo: 'PersonalInfo',
  Section: 'Section',
  Education: 'Education',
  Experience: 'Experience',
  Skill: 'Skill',
  Language: 'Language',
  Certification: 'Certification',
  Project: 'Project',
  Achievement: 'Achievement',
  CustomSection: 'CustomSection',
  Template: 'Template',
  Theme: 'Theme',
  Font: 'Font'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
