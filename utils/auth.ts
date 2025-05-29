'use server';

import { compare, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

//Types
type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SignInParams = {
  email: string;
  password: string;
};

// Config pour l'envoi d'emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.EMAIL_USERNAME, // Utilisation de EMAIL_USERNAME au lieu de EMAIL_USER pour correspondre à .env.local
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      // Ne pas rejeter les certificats auto-signés
      rejectUnauthorized: false,
    },
  });
};

//Fonction pour envoyer un email de vérification
const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = createTransporter();

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Vérification de votre email',
    html: `
      <div>
        <h1>Bienvenue sur SmartCV!</h1>
        <p>Merci de vous être inscrit. Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
        <a href="${verificationUrl}">Vérifier mon email</a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet email.</p>
      </div>
    `,
  });
};

// Inscription utilisateur
export async function signUp({ email, password, firstName, lastName }: SignUpParams) {
  try {
    // Verifier si l'utilisateur existe deja
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return { success: false, message: 'Cet utilisateur existe déjà' };
    }

    //Hasher le MDP
    const hashedPassword = await hash(password, 10);

    //Créer un token de vérification
    const emailVerificationToken = uuidv4();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Creation du user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        profileImage: '',
        emailVerifiyToken: emailVerificationToken,
        emailVerifyExpires: tomorrow,
        role: 'USER',
      },
    });

    //Envoyer un email de vérification
    await sendVerificationEmail(email, emailVerificationToken);

    return {
      success: true,
      message: 'Inscription réussie! Veuillez vérifier votre email pour activer votre compte',
    };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de l'inscription",
    };
  }
}

// Connexion utilisateur
export async function signIn({ email, password }: SignInParams) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    const passwordHash = await compare(password, user.passwordHash);
    if (!passwordHash) {
      return { succes: false, message: 'Email ou mot de passe incorrect' };
    }

    if (!user.emailVerified) {
      return {
        success: false,
        message: 'Veuillez vérifier votre email avant de vous connecter',
      };
    }

    //Creer une session
    const token = uuidv4();
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        lastConnected: new Date(),
        expires: twoWeeks,
      },
    });

    // Stocker le token dans un cookie
    (await cookies()).set({
      name: 'sessionToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      expires: twoWeeks,
    });

    return {
      success: true,
      message: 'Connexion réussie',
    };
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la connexion',
    };
  }
}

// Verification de l'email
export async function VerifyUser(token: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { emailVerifiyToken: token },
    });
    if (!user) {
      return { success: false, message: 'Token de vérification invalide' };
    }

    //Verifier si le token a expiré
    if (user.emailVerifyExpires && user.emailVerifyExpires < new Date()) {
      return { success: false, message: 'Le token de vérification a expiré' };
    }

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiyToken: null,
        emailVerifyExpires: null,
      },
    });

    return { success: true, message: 'Email vérifié avec succès' };
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la vérification de l'email",
    };
  }
}

// Deconnexion utilisateur
export async function signOut() {
  try {
    const sessionToken = (await cookies()).get('sessionToken')?.value;

    if (sessionToken) {
      await prisma.session.delete({
        where: { token: sessionToken },
      });
    }

    (await cookies()).delete('sessionToken');

    redirect('/');
  } catch (error) {
    console.error('Erreur lors de la deconnexion:', error);
    return { success: false, message: 'Une erreur est survenue lors de la deconnexion' };
  }
}

// Récupérer l'utilisateur connecté
export async function getCurrentUser() {
  try {
    const sessionToken = (await cookies()).get('sessionToken')?.value;

    if (!sessionToken) return null;

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      (await cookies()).delete('sessionToken');
      return null;
    }

    //Mettre à jour lastConnecté
    await prisma.session.update({
      where: { id: session.id },
      data: { lastConnected: new Date() },
    });

    return session.user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur connecté:", error);
    return null;
  }
}
