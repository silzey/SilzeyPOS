
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";


// Simple SVG for Google icon
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" className="mr-2">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.53-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

// Simple SVG for Apple icon
const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" height="20px" className="mr-2 fill-current">
    <path d="M18.83,12.06a3.48,3.48,0,0,0-2.07,3.3,3.14,3.14,0,0,0,.48,1.75,3.37,3.37,0,0,0,1.24,1.32,3.78,3.78,0,0,0,2.3.69,3.43,3.43,0,0,0,2.07-3.3A3.14,3.14,0,0,0,22.37,14,3.34,3.34,0,0,0,21.13,12.63a3.78,3.78,0,0,0-2.3-.57M15.4,10.63a3.43,3.43,0,0,1,1.08-2.56,3.11,3.11,0,0,1,2.49-1.15,3.18,3.18,0,0,1,2.33.9,1.2,1.2,0,0,0,1.6.19,1.19,1.19,0,0,0,.2-1.61,5.34,5.34,0,0,0-3.88-1.65A5.55,5.55,0,0,0,14.5,9.25a6,6,0,0,0-2.71,4.89,6.29,6.29,0,0,0,3.17,5.85,1.23,1.23,0,0,0,1.62-.18,1.19,1.19,0,0,0-.19-1.63A3.54,3.54,0,0,1,15.4,10.63Z" />
    <path d="M12.09,6.29A5.29,5.29,0,0,0,9.05,4.1a5.42,5.42,0,0,0-4.3,2.61A7.27,7.27,0,0,0,2.21,12a7.3,7.3,0,0,0,5,6.74,5.4,5.4,0,0,0,6.23-2.15,1.2,1.2,0,0,0-.79-1.75,1.18,1.18,0,0,0-1.74.79A3,3,0,0,1,8.22,18a4.84,4.84,0,0,1-3.17-5.18,5,5,0,0,1,2.62-4.28A2.93,2.93,0,0,1,10,8.14a3,3,0,0,1,2.08,2.84,1.2,1.2,0,0,0,1.21,1.18,1.18,1.18,0,0,0,1.19-1.21A5.24,5.24,0,0,0,12.09,6.29Z" />
  </svg>
);


export default function SignInPage() {
  const { signInWithGoogle, signInWithApple, signInWithEmail, user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/'); // Redirect to home if already logged in
    }
  }, [user, loading, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await signInWithEmail(email, password);
    if (!success) {
      toast({
        title: "Sign In Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
    // If successful, useEffect will redirect.
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline text-primary">Welcome to Silzey POS</CardTitle>
        <CardDescription>Sign in to access your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={loading || isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading || isSubmitting}
            />
          </div>
          <Button type="submit" className="w-full py-3" disabled={loading || isSubmitting}>
            {isSubmitting && !loading ? ( 
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={signInWithGoogle} 
            className="w-full py-3 text-base" 
            variant="outline"
            disabled={loading || isSubmitting}
          >
            {loading && !isSubmitting ? ( 
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Sign In with Google
          </Button>

          <Button 
            onClick={signInWithApple} 
            className="w-full py-3 text-base bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" 
            disabled={loading || isSubmitting}
          >
            {loading && !isSubmitting ? ( 
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <AppleIcon />
            )}
            Sign In with Apple
          </Button>
        </div>
      </CardContent>
       <CardFooter className="flex flex-col items-center justify-center text-sm space-y-1">
        <p className="text-muted-foreground">
          Signing in with Google or Apple will create an account if you're new.
        </p>
      </CardFooter>
    </Card>
  );
}

