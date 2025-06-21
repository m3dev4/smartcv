'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/auth';
import { deleteAccount, updateUserProfile } from '@/utils/auth';
import { CheckCircle, Eye, EyeOff, Loader2, Settings, Shield, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const SettingsPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteAccountConfirmation, setDeleteAccountConfirmation] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });

  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const CONFIRMATION_TEXT = 'supprimer mon compte';

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const handleUpdate = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
      });

      if (result?.success) {
        setSuccessMessage(result.message);
        toast.success('Profil mis à jour avec succès');
        setFormData({ firstName: '', lastName: '', password: '' });
      } else {
        setErrorMessage(result?.message || 'Une erreur est survenue');
        toast.error(result?.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setErrorMessage('Une erreur est survenue lors de la mise à jour du compte');
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteAccountConfirmation.toLowerCase().trim() !== CONFIRMATION_TEXT) {
      toast.error('Veuillez saisir le texte de confirmation exact');
      return;
    }

    try {
      const result = await deleteAccount();
      if (result?.success) {
        toast.success('Compte supprimé avec succès');
        router.push('/sign-in');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Une erreur est survenue lors de la suppression');
    }
  };

  const isDeleteButtonEnabled =
    deleteAccountConfirmation.toLowerCase().trim() === CONFIRMATION_TEXT;

  const hasProfileChanges = formData.firstName || formData.lastName;
  const hasPasswordChange = formData.password;

  return (
    <div className="min-h-screen ">
      <Toaster position="top-right" />

      {/* Header */}
      <div className=" border-b sticky top-0 backdrop-blur  z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Paramètres</h1>
              <p className="text-sm mt-1">Gérez votre compte et vos préférences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Messages d'état */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Section Profil */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder={user?.firstName || 'Votre prénom'}
                  className="transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder={user?.lastName || 'Votre nom'}
                  className="transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                placeholder={user?.email || ''}
                disabled
                className="cursor-not-allowed transition-colors"
              />
              <div className="flex items-center justify-between">
                {user?.emailVerified && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Email vérifié</span>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  L'email ne peut pas être modifié pour des raisons de sécurité
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdate}
                disabled={loading || !hasProfileChanges}
                className="min-w-[120px]"
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Mettre à jour'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section Sécurité */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Modifiez votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Saisissez votre nouveau mot de passe"
                  className="pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Utilisez au moins 8 caractères avec des lettres, chiffres et symboles
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdate}
                disabled={loading || !hasPasswordChange}
                className="min-w-[120px]"
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Changer le mot de passe'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section Suppression */}
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <CardTitle className="text-red-600">Zone de danger</CardTitle>
                <CardDescription>
                  Supprimez définitivement votre compte et toutes vos données
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Attention !</h4>
              <p className="text-sm text-red-700">
                Cette action est irréversible. Toutes vos données seront définitivement supprimées.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deleteConfirmation">
                Pour confirmer, tapez{' '}
                <code className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-xs font-mono">
                  {CONFIRMATION_TEXT}
                </code>{' '}
                ci-dessous :
              </Label>
              <Input
                id="deleteConfirmation"
                value={deleteAccountConfirmation}
                onChange={e => setDeleteAccountConfirmation(e.target.value)}
                placeholder={`Tapez "${CONFIRMATION_TEXT}" pour confirmer`}
                className={`transition-colors ${
                  deleteAccountConfirmation && !isDeleteButtonEnabled
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : isDeleteButtonEnabled
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
                }`}
              />
              {deleteAccountConfirmation && !isDeleteButtonEnabled && (
                <p className="text-sm text-red-600">
                  Le texte ne correspond pas. Tapez exactement "{CONFIRMATION_TEXT}"
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={!isDeleteButtonEnabled}
                    className="min-w-[160px]"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer mon compte
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous absolument certain de vouloir supprimer votre compte ? Cette action
                      ne peut pas être annulée et toutes vos données seront perdues.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                      Supprimer définitivement
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
