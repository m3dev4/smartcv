'use client';

import { Button } from '@/components/ui/button';
import { VerifyUser } from '@/utils/auth';

import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function verifyUser() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>(
        'loading',
    );
    const [message, setMessage] = useState('Vérification de votre email en cours...');

    useEffect(() => {
        async function verify() {
            if (!token) {
                setVerificationState('error');
                setMessage(
                    'Token de vérification manquant. Veuillez utiliser le lien complet envoyé dans votre email.',
                );
                return;
            }

            try {
                const result = await VerifyUser(token);
                if (result.success) {
                    setVerificationState('success');
                    setMessage(result.message);
                } else {
                    setVerificationState('error');
                    setMessage(result.message);
                }
            } catch (error) {
                setVerificationState('error');
                setMessage(
                    "Une erreur s'est produite lors de la vérification. Veuillez réessayer.",
                );
            }
        }

        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Vérification de votre email
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Nous vérifions votre email pour activer votre compte
                    </p>
                </div>

                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="flex flex-col items-center justify-center space-y-6">
                        {verificationState === 'loading' && (
                            <div className="animate-pulse flex flex-col items-center text-blue-500">
                                <Clock size={80} className="mb-4" />
                                <h3 className="text-xl font-medium">Vérification en cours...</h3>
                                <p className="mt-2 text-center text-gray-500">
                                    Nous sommes en train de vérifier votre email. Cela ne prendra
                                    qu'un instant.
                                </p>
                            </div>
                        )}

                        {verificationState === 'success' && (
                            <div className="flex flex-col items-center text-green-500">
                                <CheckCircle size={80} className="mb-4" />
                                <h3 className="text-xl font-medium">Email vérifié avec succès!</h3>
                                <p className="mt-2 text-center text-gray-500">{message}</p>
                                <Button className="mt-6" asChild>
                                    <Link href="/sign-in">
                                        Se connecter <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}

                        {verificationState === 'error' && (
                            <div className="flex flex-col items-center text-red-500">
                                <XCircle size={80} className="mb-4" />
                                <h3 className="text-xl font-medium">Échec de la vérification</h3>
                                <p className="mt-2 text-center text-gray-500">{message}</p>
                                <div className="mt-6 flex gap-4">
                                    <Button variant="outline" asChild>
                                        <Link href="/sign-up">S'inscrire à nouveau</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/sign-in">Se connecter</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Besoin d'aide?{' '}
                        <Link
                            href="/contact"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Contactez-nous
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
