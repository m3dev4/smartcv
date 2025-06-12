import { Input } from '@headlessui/react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useResume } from '@/context/resume-context';
import { Award, Calendar, ExternalLink } from 'lucide-react';
export const RenderCertificationsEditor = () => {
  const { resume, updateResume } = useResume();

  if (!resume) {
    return null;
  }
  const certifications = resume.certifications || []; // Note: suivre la faute de frappe de l'interface

  // Fonction pour ajouter une certification
  const addCertification = () => {
    const newCertification = {
      id: `certification-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: new Date(),
      expiryDate: new Date(),
      credentialId: '',
      credentialUrl: '',
      order: certifications.length,
    };

    updateResume({
      certifications: [...certifications, newCertification],
    });
  };

  // Fonction pour supprimer une certification
  const removeCertification = (index: number) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    updateResume({
      certifications: updatedCertifications,
    });
  };

  // Fonction pour mettre à jour une certification spécifique
  const updateCertification = (index: number, field: string, value: string | Date) => {
    const updatedCertifications = certifications.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert
    );

    updateResume({
      certifications: updatedCertifications,
    });
  };

  // Fonction pour formater une date en string pour l'input
  const formatDateForInput = (date: Date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  // Fonction pour vérifier si une certification est expirée
  const isExpired = (expiryDate: Date) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header avec actions */}
      <div className="flex items-center justify-between border-b pb-3">
        <h4 className="font-medium">Certifications ({certifications.length})</h4>
        <Button size="sm" variant="outline" onClick={addCertification} className="text-xs">
          + Ajouter une certification
        </Button>
      </div>

      {/* Liste des certifications */}
      <div className="space-y-4">
        {certifications.map((certification, index) => {
          const expired = isExpired(certification.expiryDate);

          return (
            <div key={certification.id} className="border border-muted rounded-lg p-4 space-y-3">
              {/* Header de la certification */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Certification {index + 1}
                  </span>
                  {expired && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Expirée
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeCertification(index)}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Supprimer
                </Button>
              </div>

              {/* Nom de la certification */}
              <div>
                <Label className="text-xs mb-1">Nom de la certification</Label>
                <Input
                  value={certification.name || ''}
                  placeholder="Ex: AWS Certified Solutions Architect, PMP, Google Analytics..."
                  className="w-full border border-muted shadow-sm rounded px-2 py-1"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateCertification(index, 'name', e.target.value)
                  }
                />
              </div>

              {/* Organisme émetteur */}
              <div>
                <Label className="text-xs mb-1">Organisme émetteur</Label>
                <Input
                  value={certification.issuer || ''}
                  placeholder="Ex: Amazon Web Services, PMI, Google..."
                  className="w-full border border-muted shadow-sm rounded px-2 py-1"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateCertification(index, 'issuer', e.target.value)
                  }
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Date d'obtention
                  </Label>
                  <Input
                    type="date"
                    value={formatDateForInput(certification.issueDate)}
                    className="w-full border border-muted shadow-sm rounded px-2 py-1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCertification(index, 'issueDate', new Date(e.target.value))
                    }
                  />
                </div>

                {/* <div>
                  <Label className="text-xs mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Date d'expiration
                  </Label>
                  <Input
                    type="date"
                    value={formatDateForInput(certification.expiryDate)}
                    className={`w-full border shadow-sm rounded px-2 py-1 ${
                      expired ? "border-red-300 bg-red-50" : "border-muted"
                    }`}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCertification(index, "expiryDate", new Date(e.target.value))
                    }
                  />
                </div> */}
              </div>

              {/* ID de certification */}
              <div>
                <Label className="text-xs mb-1">ID de certification (optionnel)</Label>
                <Input
                  value={certification.credentialId || ''}
                  placeholder="Ex: AWS-ASA-12345, PMI-67890..."
                  className="w-full border border-muted shadow-sm rounded px-2 py-1"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateCertification(index, 'credentialId', e.target.value)
                  }
                />
              </div>

              {/* URL de vérification */}
              <div>
                <Label className="text-xs mb-1 flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  URL de vérification (optionnel)
                </Label>
                <Input
                  type="url"
                  value={certification.credentialUrl || ''}
                  placeholder="https://www.credly.com/badges/..."
                  className="w-full border border-muted shadow-sm rounded px-2 py-1"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateCertification(index, 'credentialUrl', e.target.value)
                  }
                />
                {certification.credentialUrl && (
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Vérifier la certification
                  </a>
                )}
              </div>

              {/* Aperçu de la certification */}
              {certification.name && certification.issuer && (
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h6 className="font-medium text-blue-900">{certification.name}</h6>
                      <p className="text-sm text-blue-700">{certification.issuer}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Obtenue le {new Date(certification.issueDate).toLocaleDateString('fr-FR')}
                        {/* {certification.expiryDate && (
                          <>
                            {" • "}
                            {expired ? "Expirée" : "Expire"} le{" "}
                            {new Date(certification.expiryDate).toLocaleDateString("fr-FR")}
                          </>
                        )} */}
                      </p>
                    </div>
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message si aucune certification */}
      {certifications.length === 0 && (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-4">Aucune certification ajoutée</p>
          <Button onClick={addCertification} variant="outline">
            Ajouter votre première certification
          </Button>
        </div>
      )}

      {/* Certifications populaires */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <h5 className="text-sm font-medium text-purple-900 mb-2">🏆 Certifications populaires</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services' },
            { name: 'PMP', issuer: 'Project Management Institute' },
            { name: 'Google Analytics', issuer: 'Google' },
            { name: 'Scrum Master', issuer: 'Scrum Alliance' },
            { name: 'Microsoft Azure', issuer: 'Microsoft' },
            { name: 'Salesforce Admin', issuer: 'Salesforce' },
          ].map(cert => (
            <Button
              key={cert.name}
              size="sm"
              variant="outline"
              className="text-xs h-auto p-2 text-left justify-start"
              onClick={() => {
                const newCertification = {
                  id: `certification-${Date.now()}`,
                  name: cert.name,
                  issuer: cert.issuer,
                  issueDate: new Date(),
                  expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
                  credentialId: '',
                  credentialUrl: '',
                  order: certifications.length,
                };
                updateResume({
                  certifications: [...certifications, newCertification],
                });
              }}
            >
              <div>
                <div className="font-medium">{cert.name}</div>
                <div className="text-muted-foreground">{cert.issuer}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Conseils */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-1">
          💡 Conseils pour vos certifications
        </h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Ajoutez l'URL de vérification pour prouver l'authenticité</li>
          <li>• Mentionnez l'ID de certification si disponible</li>
          <li>• Surveillez les dates d'expiration et renouvelez à temps</li>
          <li>• Priorisez les certifications pertinentes pour votre secteur</li>
          <li>• Utilisez des plateformes comme Credly ou Badgr pour la vérification</li>
        </ul>
      </div>
    </div>
  );
};
