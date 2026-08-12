'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface GoogleAuthButtonProps {
  mode?: 'login' | 'register';
}

export default function GoogleAuthButton({ mode = 'login' }: GoogleAuthButtonProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);

  // Authenticate user with MongoDB backend
  const authenticateWithBackend = async (payload: { email: string; name?: string; picture?: string; googleId?: string }) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
          picture: payload.picture || 'https://lh3.googleusercontent.com/a/default-user',
          googleId: payload.googleId || `g_${Date.now()}`
        })
      });

      const data = await res.json();

      if (data.success) {
        login(data.user);
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        setError(data.error || 'Google authentication failed.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during Google Sign-In.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth Credential Token Callback
  const handleGoogleCallback = async (response: any) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      await authenticateWithBackend({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub
      });
    } catch (err) {
      console.error('Google Callback Error:', err);
      setError('Failed to parse Google OAuth token.');
    }
  };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Load Google Identity Services SDK Script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      setIsGsiLoaded(true);
      if (clientId && window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
          auto_select: false
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  // Trigger Google Account Chooser Popup Window
  const handleGoogleButtonClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (clientId && window.google?.accounts?.id) {
      // Open Official Google Account Chooser Popup Window
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to Google OAuth Token Client Popup if One-Tap is dismissed
          if (window.google?.accounts?.oauth2) {
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: clientId,
              scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
              callback: async (tokenResponse: any) => {
                if (tokenResponse.access_token) {
                  const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                  }).then((r) => r.json());
                  await authenticateWithBackend({
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture,
                    googleId: userInfo.sub
                  });
                }
              }
            });
            tokenClient.requestAccessToken();
          }
        }
      });
      return;
    }

    // Prompt fallback if Client ID is not configured yet in environment
    const userGmail = prompt('Enter your Gmail address to Sign In / Register via Google Account Chooser:', 'dinil2000@gmail.com');
    if (!userGmail || !userGmail.includes('@')) return;

    authenticateWithBackend({
      email: userGmail.trim(),
      name: userGmail.split('@')[0].replace('.', ' '),
      picture: 'https://lh3.googleusercontent.com/a/default-user',
      googleId: `google_${Date.now()}`
    });
  };

  return (
    <div className="w-full space-y-2">
      {error && <p className="text-xs text-red-600 text-center font-medium">{error}</p>}

      {/* Google Account Chooser Trigger Button */}
      <button
        type="button"
        onClick={handleGoogleButtonClick}
        disabled={loading}
        className="w-full py-3 px-4 bg-white border border-gray-300 hover:border-gray-400 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-3 active:scale-[0.99]"
      >
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>
          {loading
            ? 'Authenticating with Google...'
            : mode === 'register'
            ? 'Register with Google / Gmail'
            : 'Continue with Google'}
        </span>
      </button>
    </div>
  );
}

declare global {
  interface Window {
    google?: any;
  }
}
