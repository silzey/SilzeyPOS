
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FullPageLoader from '@/components/ui/loader';

// This page is no longer needed as Google Sign-In handles new user creation.
// It will redirect to the sign-in page or home.
export default function SignUpPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the sign-in page, as Google Sign-In now handles registrations.
    router.replace('/auth/signin'); 
  }, [router]);

  return <FullPageLoader />; // Show loader while redirecting
}
