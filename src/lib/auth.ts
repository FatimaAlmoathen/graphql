import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
 sub?: string;
  id?: number;
  login?: string;
  email?: string;
  iat?: number;  // Issued at timestamp
  exp?: number;
}

export const login = async (usernameOrEmail: string, password: string) => {
  const credentials = btoa(`${usernameOrEmail}:${password}`);

  const response = await fetch(process.env.NEXT_PUBLIC_AUTH_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const token = responseText.trim().replace(/^"|"$/g, '');
  if (!token) {
    throw new Error("No token found in response");
  }

  localStorage.setItem('jwt', token);
  return token;
};

export const logout = (): Promise<void> => {
  localStorage.removeItem('jwt');
  return Promise.resolve();
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('jwt');
  return token ? token.replace(/^"|"$/g, '') : null;
};

export const getCurrentUser = (): JwtPayload | null => {
  // ensure only runs on client-side
  if (typeof window === 'undefined') return null;
  
  const token = getToken();
  if (!token) return null;

  try {
    const cleanToken = token.replace(/^"|"$/g, '');
    const decoded = jwtDecode<JwtPayload>(cleanToken);

     return {
      sub: decoded.sub,
      id: decoded.id || (decoded.sub ? parseInt(decoded.sub) : undefined),
      login: decoded.login,
      email: decoded.email,
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};


export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};