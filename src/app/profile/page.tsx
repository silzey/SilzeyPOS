
"use client";

import type { UserProfile } from '@/types/pos';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Award, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';

// Mock user data for display
const mockUserProfile: UserProfile = {
  id: 'user-123',
  firstName: 'Kim',
  lastName: 'Lunaris',
  email: 'kim.l@silzeypos.com',
  avatarUrl: 'https://placehold.co/150x150.png', 
  bio: 'Enthusiastic budtender with a passion for quality cannabis products and customer education. Helping people find the perfect strain since 2020.',
  memberSince: 'January 15, 2023',
  rewardsPoints: 1250,
};

export default function ProfilePage() {
  const user = mockUserProfile;

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
          <Button variant="outline" disabled> 
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>

        <Card className="overflow-hidden shadow-xl border-primary">
          <CardHeader className="bg-muted/30 p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary">
              <Image
                src={user.avatarUrl}
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
              <p className="text-sm text-muted-foreground mt-1">Member Since: {user.memberSince}</p>
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
                  <li>First purchase: 'Sour Diesel' (Flower) on {user.memberSince}</li>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
