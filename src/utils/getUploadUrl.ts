/**
 * Construit l'URL complète pour un fichier uploadé
 * En production, utilise l'URL relative directement si VITE_API_URL n'est pas défini
 * En développement, construit l'URL complète avec le serveur
 */
export function getUploadUrl(uploadPath: string): string {
  // Si c'est déjà une URL complète (http:// ou https://), la retourner telle quelle
  if (uploadPath.startsWith('http://') || uploadPath.startsWith('https://')) {
    return uploadPath;
  }

  // Si VITE_API_URL est défini, l'utiliser (enlever /api pour obtenir la base)
  if (import.meta.env.VITE_API_URL) {
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}${uploadPath}`;
  }

  // Sinon, en production utiliser l'URL relative, en développement utiliser localhost
  if (import.meta.env.MODE === 'production') {
    return uploadPath; // uploadPath est déjà relatif (ex: /uploads/file.jpg)
  }

  // Développement : utiliser localhost
  return `http://localhost:3001${uploadPath}`;
}
