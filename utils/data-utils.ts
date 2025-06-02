/**
 * Formate une date en format lisible (ex: Jun 2025)
 */

import { format } from 'path';

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  //Option de formatage
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
  };
  return d.toLocaleDateString('fr-FR', options);
};

/**
 * Formate une plage de date (Jun 2025 - Aug 2025 ou Jun 2025 - aujourd'hui)
 */

export const formatDateRange = (
  startDate: Date | string,
  endDate?: Date | string,
  current = false
): string => {
  const formattedStart = formatDate(startDate);

  if (current) {
    return `${formattedStart} - Présent`;
  }

  if (endDate) {
    const formattedEndDate = formatDate(endDate);
    return `${formattedStart} - ${formattedEndDate}`;
  }
  return formattedStart;
};

/**
 * Calcul la durée entre deux dates en format "X ans Y mois"
 */

export const calculateDuration = (startDate: Date | string, endDate?: Date | string): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : new Date();

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();

  //Ajustement si les mois sont négatifs
  let adjustedYears = years;
  let adjustedMonths = months;

  if (months < 0) {
    adjustedYears -= 1;
    adjustedMonths = 12 + months;
  }

  //Formattage du résultat
  if (adjustedYears > 0 && adjustedMonths > 0) {
    return `${adjustedYears} an${adjustedYears > 1 ? 's' : ''} ${adjustedMonths} mois`;
  } else if (adjustedYears > 0) {
    return `${adjustedYears} an${adjustedYears > 1 ? 's' : ''}`;
  } else {
    return `${adjustedMonths} mois`;
  }
};
