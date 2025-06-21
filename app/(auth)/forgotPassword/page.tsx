'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPassword } from '@/utils/auth';
import { LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        setSuccess(true);
        toast.success(
          'Email envoyé avec succes. Veuillez suivre les instructions envoyées dans votre boite de reception.'
        );
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error: any) {
      setErrors(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="m-auto">
          <h2 className="text-3xl font-bold text-center mt-6">Mot de passe oublie</h2>
          <p className="text-muted-foreground text-center mt-1">
            Entrez votre adresse e-mail pour obtenir un lien de réinitialisation de mot de passe.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              className="apparence-none relative rounded-md block w-full px-3 mt-2 py-2 border opacity-80 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Entrez votre email"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="space-y-4">
            <Button
              variant="ghost"
              disabled={loading || !email.trim()}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rouded-md bg-indigo-900 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <LoaderIcon className="h-4 w-4 animate-spin" />
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
