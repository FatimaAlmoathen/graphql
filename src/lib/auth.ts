import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
 sub?: string;
  id?: number;
  login?: string;
  email?: string;
  iat?: number;  // Issued at timestamp
  exp?: number;
}

export const isTokenExpired = (decodedToken: JwtPayload): boolean => {
  if (!decodedToken.exp) return true; // if no exp, invalid
  return Date.now() >= decodedToken.exp * 1000;
};

export const login = async (usernameOrEmail: string, password: string) => {
  const credentials = btoa(`${usernameOrEmail}:${password}`);

  //send req to endpoint with basic auth, response is jwt
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

  //verify that token is valid before storing
  const decoded = jwtDecode<JwtPayload>(token);
  if (isTokenExpired(decoded)) {
    throw new Error("Token is expired");
  }

  //store jwt in local storage
  localStorage.setItem('jwt', token);
  return token;
};

export const logout = (): Promise<void> => {
  localStorage.removeItem('jwt');

   if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }

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

    if (isTokenExpired(decoded)) {
      logout(); // logout if token is expired
      return null;
    }

    //return user info from token payload
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
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return !isTokenExpired(decoded);
  } catch {
    return false;
  }
};