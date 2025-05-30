'use client';

import { Label } from '@/components/ui/label';
import { signIn } from '@/utils/auth';
import { ValidateFormLogin } from '@/validations/authValidation';
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
    email: '',
    password: '',
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
    const validationErrors = ValidateFormLogin(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setServerMessage(null);

    try {
      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setServerMessage({ type: 'success', message: result.message });
        setTimeout(() => {
          router.push('/dashboard/resumes');
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
    <div className="flex flex-col lg:flex-row">
      {/* Image illustrative - Cachée sur mobile */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
        <Image
          src="/images/login-cv.jpg"
          width={640}
          height={620}
          alt="image illustrative"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Conteneur du formulaire */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* En-tête */}
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
              Nous sommes ravis de vous revoir !
            </h2>
            <p className="text-lg font-medium text-gray-700 mt-2">Connectez-vous à votre compte</p>
            <p className="mt-4 text-sm text-gray-600">
              Ou{' '}
              <Link
                href="/sign-up"
                className="text-indigo-500 font-medium hover:text-indigo-600 transition-colors"
              >
                Creez un compte
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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

            {/* Bouton de soumission */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? <Loader className="animate-spin h-5 w-5" /> : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
