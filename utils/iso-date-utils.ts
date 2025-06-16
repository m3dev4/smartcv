/**
 * Converts a date string or Date object to an ISO-8601 string.
 * Returns null if the input is invalid or empty.
 */
export const toIsoDateString = (date: Date | string | undefined | null): string | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

/**
 * Safely converts a date string or Date object to a Date object for Prisma.
 * Returns null if the input is invalid or empty.
 */
export const toSafeDate = (date: Date | string | undefined | null): Date | null => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return null;
  return d;
};

/**
 * Converts LinkedIn date format to a safe Date object.
 * LinkedIn dates can be in various formats, this handles common cases.
 */
export const linkedInDateToDate = (dateStr: string | undefined | null): Date | null => {
  if (!dateStr || dateStr.trim() === '') return null;
  
  // Handle common LinkedIn date formats
  try {
    // Clean the date string
    const cleanDateStr = dateStr.trim();
    
    // Try direct conversion first
    let date = new Date(cleanDateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // Handle partial dates like "2023" or "2023-06"
    if (/^\d{4}$/.test(cleanDateStr)) {
      // Year only - assume January 1st
      date = new Date(`${cleanDateStr}-01-01`);
    } else if (/^\d{4}-\d{2}$/.test(cleanDateStr)) {
      // Year-Month - assume 1st day of month
      date = new Date(`${cleanDateStr}-01`);
    }
    
    return !isNaN(date.getTime()) ? date : null;
  } catch (error) {
    console.warn(`Failed to parse LinkedIn date: ${dateStr}`, error);
    return null;
  }
};

/**
 * Converts LinkedIn date format to a safe Date object with fallback.
 * Returns a default date if the input is invalid, to prevent errors.
 */
export const linkedInDateToDateWithFallback = (dateStr: string | undefined | null, fallbackDate?: Date): Date => {
  const parsedDate = linkedInDateToDate(dateStr);
  return parsedDate || fallbackDate || new Date('2000-01-01');
};
