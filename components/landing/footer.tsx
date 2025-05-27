import { Link2, Scale } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <div className="my-12 px-4">
            {/* Line  */}
            <div className="border-t border-opacity-10 border-muted-foreground my-12 w-full flex-1" />
            <div className="flex flex col gap-4 justify-between">
                <div className="flex flex-col py-4 w-1/2">
                    <h1 className="text-3xl font-bold">SmartCV</h1>
                    <p className="text-sm mt-2 w-3/4 text-muted-foreground font-bold">
                        Un générateur de CV moderne, simple et efficace et open-source qui simplifie
                        le processus de création, de mise à jour et de partage de votre CV.
                    </p>
                    <div className="mt-6">
                        <span className="text-xs text-muted-foreground">
                            Sous licence{' '}
                            <span className="font-bold">
                                {' '}
                                <Scale size={18} className="inline" /> MIT
                            </span>
                        </span>
                        <p className="text-xs text-muted-foreground">
                            Un projet open-source, vous pouvez le trouver sur GitHub
                            <Link href="http://github.com/m3dev4/smartcv">
                                {' '}
                                <span className="text-cyan-500 underline">
                                    <Link2 className="inline" /> ici
                                </span>
                            </Link>
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Un projet passioné de{' '}
                            <Link href="#" className="underline leading-relaxed">
                                Mouhamed Lo
                            </Link>
                        </p>
                    </div>
                </div>
                {/* privacy */}
                <div className="absolute bottom-0 flex flex-col right-0">
                    <Link href="#">
                        <span className="text-sm text-muted-foreground">
                            Politique de confidentialité
                        </span>
                    </Link>
                    <span className="text-xs my-2 text-muted-foreground">SmartCV v1.0.0</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
