import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ContributeSection = () => {
    return (
        <section className="w-full h-full max-w-container mx-auto">
            <div className="flex flex-col items-start justify-start m-auto p-2">
                <h2 className="text-3xl font-bold">Soutenir SmartCv</h2>
                <p className="text-[14px] font-medium leading-relaxed mt-2 text-muted-foreground ">
                    SmartCV est une application gratuite et open source que je développe avec
                    engagement pour aider chacun à créer un CV moderne, simple et efficace. Si vous
                    trouvez ce projet utile et que vous avez la possibilité de le soutenir, vous
                    pouvez le faire via l’une des plateformes proposées. Chaque geste compte, même
                    le plus petit.
                </p>
                <div className="flex flex-row gap-4 mt-6 items-center p-auto flex-wrap">
                    <Link href="#">
                        <Image
                            src="/images/paypal.png"
                            alt="paypal"
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    </Link>
                    {/* D'autre source de contribution */}
                </div>
                <div className="my-12">
                    <h2 className="text-3xl font-bold">🚀 Contribuer autrement ?</h2>
                    <p className="text-[14px] font-medium leading-relaxed mt-2 text-muted-foreground">
                        Même sans contribution financière, vous pouvez faire une réelle différence :
                        ajoutez une étoile au dépôt GitHub, parlez-en autour de vous, ou envoyez
                        simplement un petit mot pour partager comment SmartCV vous a été utile. Vos
                        retours sont toujours les bienvenus — ils m’aident à améliorer l’expérience
                        et me motivent à continuer. Merci pour votre soutien ✨
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContributeSection;
