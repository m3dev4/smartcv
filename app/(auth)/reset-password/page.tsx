'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword } from '@/utils/auth';
import { Eye, EyeOff, Loader2, Lock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type React from 'react';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

const ResetPasswordPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Validation des mots de passe
  useEffect(() => {
    if (confirmPassword && newPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  const isPasswordValid = newPassword.length >= 8;
  const canSubmit = newPassword && confirmPassword && passwordsMatch && isPasswordValid && !loading;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage('Le token est manquant');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');
      setLoading(true);

      await resetPassword(token, newPassword);

      setSuccessMessage('Mot de passe mis à jour avec succès');
      toast.success('Votre mot de passe a été mis à jour avec succès');

      // Redirection après succès
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (error: any) {
      const errorMsg =
        error.message || "Une erreur s'est produite lors de la mise à jour du mot de passe";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Erreur de réinitialisation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Le token de réinitialisation est manquant ou expiré
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Link
                href="/forgot-password"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Demander un nouveau lien de réinitialisation
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Réinitialisation du mot de passe
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2 dark:text-gray-400">Créez un nouveau mot de passe sécurisé</p>
        </CardHeader>

        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-6">
            {errorMessage && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Entrez votre nouveau mot de passe"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {newPassword && (
                <p className={`text-xs ${isPasswordValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isPasswordValid ? '✓ Mot de passe valide' : '✗ Au moins 8 caractères requis'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm dark:text-gray-200 font-medium text-gray-700">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Confirmez votre mot de passe"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {confirmPassword && (
                <p className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch
                    ? '✓ Les mots de passe correspondent'
                    : '✗ Les mots de passe ne correspondent pas'}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réinitialisation en cours...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Réinitialiser le mot de passe
                </>
              )}
            </Button>
          </CardFooter>
        </form>

        <div className="px-6 pb-6">
          <div className="text-center">
            <Link
              href="/sign-in"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
