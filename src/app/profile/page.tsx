
"use client";

import type { UserProfile as UserProfileType } from '@/types/pos';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Award, ShieldCheck, Activity, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground font-body p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="container mx-auto max-w-3xl">
          <Card className="overflow-hidden shadow-xl border-primary">
            <CardHeader className="bg-muted/30 p-6 flex flex-col sm:flex-row items-center gap-4">
              <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
              <div className="text-center sm:text-left space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-6 w-1/4 mb-1" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Card className="bg-muted/20 p-4 border-border">
                <Skeleton className="h-4 w-3/4 mb-1.5" />
                <Skeleton className="h-4 w-full mb-1.5" />
                <Skeleton className="h-4 w-2/3 mb-1.5" />
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to POS
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">
            User Profile
          </h1>
          <Button variant="outline" onClick={signOut}>
            <LogIn className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <Card className="overflow-hidden shadow-xl border-primary">
          <CardHeader className="bg-muted/30 p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary">
              <Image
                src={user.avatarUrl || 'https://placehold.co/150x150.png'}
                alt={`${user.firstName} ${user.lastName}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint="user avatar"
              />
            </div>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl sm:text-3xl font-headline">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription className="text-md text-muted-foreground">{user.email}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">Member Since: {new Date(user.memberSince).toLocaleDateString()}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {user.bio && (
              <div>
                <h3 className="text-lg font-semibold font-headline mb-1">Bio</h3>
                <p className="text-foreground/80 leading-relaxed">{user.bio}</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold font-headline mb-2 flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Recent Activity
              </h3>
              <Card className="bg-muted/20 p-4 border-border">
                <ul className="list-disc list-inside text-foreground/80 space-y-1.5 text-sm">
                  <li>Purchased 'Blue Dream' (Flower) - 2 days ago</li>
                  <li>Redeemed 100 loyalty points - 1 week ago</li>
                  <li>Viewed 'Concentrates' category - 1 week ago</li>
                  <li>First purchase: 'Sour Diesel' (Flower) on {new Date(user.memberSince).toLocaleDateString()}</li>
                </ul>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-accent/10 p-4 border-accent/30">
                    <CardHeader className="p-0 pb-2 flex flex-row items-center space-x-2">
                         <Award className="h-5 w-5 text-accent" />
                         <CardTitle className="text-md font-semibold text-accent-foreground">Rewards Points</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-2xl font-bold text-accent">{user.rewardsPoints ?? 0}</p>
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/10 p-4 border-secondary/30">
                    <CardHeader className="p-0 pb-2 flex flex-row items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-secondary" />
                         <CardTitle className="text-md font-semibold text-secondary-foreground">Account Status</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-lg font-medium text-green-600">Active</p>
                    </CardContent>
                </Card>
            </div>
             <div className="mt-6 flex justify-end">
               <Button variant="outline" disabled> 
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
