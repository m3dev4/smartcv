export const ValidateForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const newErrors: Record<string, string> = {};

  // Validation du prénom
  if (!formData.firstName.trim()) {
    newErrors.firstName = 'Le prénom est requis';
  }

  // Validation du nom
  if (!formData.lastName.trim()) {
    newErrors.lastName = 'Le nom est requis';
  }

  // Validation de l'email
  if (!formData.email.trim()) {
    newErrors.email = "L'email est requis";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "L'email est invalide";
  }

  // Validation du mot de passe
  if (!formData.password.trim()) {
    newErrors.password = 'Le mot de passe est requis';
  } else if (formData.password.length < 8) {
    newErrors.password = 'Le mot de passe doit avoir au moins 8 caractères';
  }

  // Validation de la confirmation du mot de passe
  if (!formData.confirmPassword.trim()) {
    newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  // Retourner les erreurs (objet vide si pas d'erreurs)
  return newErrors;
};

export const ValidateFormLogin = (formData: { email: string; password: string }) => {
  const newErrors: Record<string, string> = {};

  // Validation de l'email
  if (!formData.email.trim()) {
    newErrors.email = "L'email est requis";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "L'email est invalide";
  }

  // Validation du mot de passe
  if (!formData.password.trim()) {
    newErrors.password = 'Le mot de passe est requis';
  }

  // Retourner les erreurs (objet vide si pas d'erreurs)
  return newErrors;
};
