import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production';

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

// Client-side cookie functions
export function getAuthCookieClient() {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
    
    if (!authCookie) return null;
    
    return authCookie.split('=')[1];
}

export function setAuthCookieClient(token) {
    if (typeof document === 'undefined') return;
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days
    
    document.cookie = `auth-token=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export function removeAuthCookieClient() {
    if (typeof document === 'undefined') return;
    
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export function getCurrentUserClient() {
    const token = getAuthCookieClient();
    
    if (!token) {
        return null;
    }
    
    return verifyToken(token);
}
