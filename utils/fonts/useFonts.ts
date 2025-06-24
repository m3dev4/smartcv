import { useEffect, useState } from 'react';

export interface Font {
  id: string;
  name: string;
  category: string;
  url?: string;
  isDefault?: boolean;
}

export function useFonts() {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFonts() {
      setLoading(true);
      try {
        const res = await fetch('/api/fonts');
        const data = await res.json();
        if (data.success) {
          setFonts(data.fonts);
        } else {
          setError(data.message || 'Erreur lors du chargement des polices');
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des polices');
      } finally {
        setLoading(false);
      }
    }
    fetchFonts();
  }, []);

  return { fonts, loading, error };
}
