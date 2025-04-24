import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

export function setAuthCookie(token) {
    cookies().set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        sameSite: 'strict',
    });
}

export function removeAuthCookie() {
    cookies().delete('auth-token');
}

export function getAuthCookie() {
    return cookies().get('auth-token')?.value;
}

export function getCurrentUser() {
    const token = getAuthCookie();

    if (!token) {
        return null;
    }

    return verifyToken(token);
}

export async function authGuard(req) {
    const token = cookies().get('auth-token')?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: 'Authentication required' },
            { status: 401 }
        );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return NextResponse.json(
            { success: false, message: 'Invalid token' },
            { status: 401 }
        );
    }
    
    return decoded;
}

export async function vendorGuard(req) {
    const user = await authGuard(req);

    if (!user) {
        return null;
    }

    if (user.role !== 'vendor' && user.role !== 'admin') {
        return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 403 }
        );
    }

    return user; 
}

export async function adminGuard(req) {
    const user = await authGuard(req);

    if (!user) {
        return null;    
    }

    if (user.role !== 'admin') {
        return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 403 }
        );
    }

    return user;
}
