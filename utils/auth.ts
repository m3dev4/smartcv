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
type updateUserProfileParams = {
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
      user: process.env.EMAIL_USERNAME,
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
    subject: 'Vérification de votre email - SmartCV',
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérification Email - SmartCV</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
              SmartCV
            </h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
              Votre plateforme de CV intelligente
            </p>
          </div>
  
          <!-- Content -->
          <div style="padding: 50px 30px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h2 style="color: #1a202c; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                Bienvenue sur SmartCV !
              </h2>
              <p style="color: #4a5568; margin: 0; font-size: 16px; line-height: 1.6;">
                Nous sommes ravis de vous accueillir dans notre communauté.<br>
                Pour commencer à utiliser votre compte, veuillez vérifier votre adresse email.
              </p>
            </div>
  
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                ✉️ Vérifier mon email
              </a>
            </div>
  
            <!-- Info Box -->
            <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.5;">
                <strong>⏰ Important :</strong> Ce lien de vérification expirera dans <strong>24 heures</strong>. 
                Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet email en toute sécurité.
              </p>
            </div>
  
            <!-- Alternative Link -->
            <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
                Le bouton ne fonctionne pas ? Copiez et collez ce lien dans votre navigateur :
              </p>
              <p style="word-break: break-all; color: #667eea; font-size: 12px; background-color: #f7fafc; padding: 10px; border-radius: 4px; margin: 0;">
                ${verificationUrl}
              </p>
            </div>
          </div>
  
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">
              Cet email a été envoyé par <strong>SmartCV</strong>
            </p>
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} SmartCV. Tous droits réservés.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

const sendPasswordResetEmail = async (email: string, token: string) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Reinitialisation de votre mot de passe',
    html: `
      <div>
        <h1>Bienvenue sur SmartCV!</h1>
        <p>Merci de vous avoir inscrit. Veuillez choisir un nouveau mot de passe en cliquant sur le lien ci-dessous :</p>
        <a href="${resetUrl}">Reinitialiser mon mot de passe</a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      </div>
    `,
  });
};

const sendEmailAfterPasswordReset = async (email: string) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Votre mot de passe a été reinitialiser',
    html: `
      <div>
        <h1>Votre mot de passe a été reinitialiser</h1
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
        emailVerifyToken: emailVerificationToken,
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
      where: { emailVerifyToken: token },
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
        emailVerifyToken: null,
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

// Forgot password
export async function forgotPassword(email: string) {
  try {
    const userExist = await prisma.user.findUnique({
      where: { email },
    });
    if (!userExist) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }
    const token = uuidv4();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: token,
        passwordResetExpires: tomorrow,
      },
    });

    await sendPasswordResetEmail(email, token);
    return {
      success: true,
      message: 'Email envoyé',
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de réinitialisation de mot de passe:", error);
    return {
      success: false,
      message:
        "Une erreur est survenue lors de l'envoi de l'email de réinitialisation de mot de passe",
    };
  }
}

// Reset password
export async function resetPassword(token: string, newPassword: string) {
  try {
    // Validation des paramètres
    if (!token || !newPassword) {
      return {
        success: false,
        message: 'Token et nouveau mot de passe requis',
      };
    }

    // Validation de la force du mot de passe (optionnel)
    if (newPassword.length < 8) {
      return {
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      };
    }

    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user) {
      return {
        success: false,
        message: 'Token de réinitialisation invalide',
      };
    }

    // Vérification de l'expiration du token
    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      return {
        success: false,
        message: 'Token de réinitialisation expiré',
      };
    }

    // Mise à jour du mot de passe et suppression du token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hash(newPassword, 12), // 12 rounds pour plus de sécurité
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Email de confirmation (optionnel)
    await sendEmailAfterPasswordReset(user.email);

    return {
      success: true,
      message: 'Votre mot de passe a été mis à jour avec succès',
    };
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la réinitialisation du mot de passe',
    };
  }
}

// update user profile
export async function updateUserProfile({
  firstName,
  lastName,
  password,
}: updateUserProfileParams) {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: session.email },
    });
    if (!existingUser) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }

    const updateData: any = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (password) updateData.passwordHash = await hash(password, 10);

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        message: 'Aucune mise à jour effectuée',
      };
    }

    const hashedPassword = await hash(password, 10);
    await prisma.user.update({
      where: { id: session.id },
      data: {
        firstName,
        lastName,
        passwordHash: hashedPassword,
      },
    });

    return {
      success: true,
      message: 'Profil mis à jour avec succès',
    };
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil de l'utilisateur:", error);
  }
}

// delete account
export async function deleteAccount() {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }

  try {
    await prisma.user.delete({
      where: { id: session.id },
    });
    return {
      success: true,
      message: 'Compte supprimé avec succès',
    };
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la suppression du compte',
    };
  }
}
