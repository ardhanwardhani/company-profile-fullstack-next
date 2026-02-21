const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
