'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { signUp } from '@/utils/auth';
import { ValidateForm } from '@/validations/authValidation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Input } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

const RegisterPage = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = ValidateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setServerMessage(null);

    try {
      const result = await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setServerMessage({ type: 'success', message: result.message });
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000);
      } else {
        setServerMessage({ type: 'error', message: result.message });
      }
    } catch (error) {
      setServerMessage({
        type: 'error',
        message: 'Une erreur est survenue lors de la connexion',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-start flex-col lg:flex-row">
      {/* Image illustrative - Cachée sur mobile */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
         <video className="w-full h-screen object-cover" autoPlay loop muted playsInline>
          <source src="/videos/smartcv.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Conteneur du formulaire */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* En-tête */}
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">
              Nous sommes ravis de vous voir !
            </h2>
            <p className="text-lg font-medium text-gray-700 mt-2 dark:text-gray-200">Créez votre compte</p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Ou{' '}
              <Link
                href="/sign-in"
                className="text-indigo-500 font-medium hover:text-indigo-600 transition-colors"
              >
                Connectez-vous à votre compte existant
              </Link>
            </p>
          </div>

          {/* Message du serveur */}
          {serverMessage && (
            <div
              className={`rounded-md p-4 ${
                serverMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {serverMessage.type === 'success' ? (
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      serverMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {serverMessage.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Prénom et Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="block dark:text-white text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.firstName
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Votre prénom"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="block dark:text-white text-sm font-medium text-gray-700 mb-1">
                  Nom
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.lastName
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Votre nom"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block dark:text-white text-sm font-medium text-gray-700 mb-1">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <Label htmlFor="password" className="block dark:text-white text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium dark:text-white text-gray-700 mb-1"
              >
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? <Loader className="animate-spin h-5 w-5" /> : "S'inscrire"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
