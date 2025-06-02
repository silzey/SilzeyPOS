
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCustomers } from '@/lib/mockCustomers';
import type { Customer, UserProfile } from '@/types/pos';
import { Users, ChevronRight, Mail, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ALL_USERS_STORAGE_KEY = 'allUserProfilesSilzeyPOS'; // Updated key

export default function CustomersPage() {
  const [displayCustomers, setDisplayCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let combinedCustomers: Customer[] = [...mockCustomers]; // Start with static mocks
    let allUserProfilesFromStorage: UserProfile[] = [];

    if (typeof window !== 'undefined') {
      const allUsersRaw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
      if (allUsersRaw) {
        try {
          allUserProfilesFromStorage = JSON.parse(allUsersRaw);
        } catch (e) {
          console.error("Error parsing all user profiles from localStorage:", e);
        }
      }
    }

    const customersFromStorage: Customer[] = allUserProfilesFromStorage
      .filter(profile => !mockCustomers.some(mc => mc.email === profile.email)) // Avoid duplicates if email exists in mocks
      .map(profile => ({
        ...profile,
        // For users from storage, assume no order history/current order unless explicitly fetched/set elsewhere
        orderHistory: [], 
        currentOrder: undefined,
        rewardsPoints: profile.rewardsPoints !== undefined ? profile.rewardsPoints : 0,
      }));

    // Combine, ensuring profiles from storage (which might include Google users) take precedence if email matches
    const profileMap = new Map<string, Customer>();
    
    // Add profiles from storage first
    customersFromStorage.forEach(c => profileMap.set(c.email, c));
    
    // Add mock customers only if their email isn't already in the map
    mockCustomers.forEach(mc => {
      if (!profileMap.has(mc.email)) {
        profileMap.set(mc.email, mc);
      }
    });

    const uniqueCustomers = Array.from(profileMap.values());

    setDisplayCustomers(uniqueCustomers.sort((a,b) => (a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)) ));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-1" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden shadow-md">
                                <CardHeader className="flex flex-row items-center gap-4 p-4 bg-muted/20">
                                    <Skeleton className="h-16 w-16 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-3 w-40" />
                                        <Skeleton className="h-3 w-36" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-9 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center">
            <Users className="mr-2 h-6 w-6" /> Customer List
          </CardTitle>
          <CardDescription>Browse and manage customer profiles. Includes Google Sign-In users.</CardDescription>
        </CardHeader>
        <CardContent>
          {displayCustomers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No customers found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCustomers.map((customer: Customer) => (
                <Card key={customer.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 p-4 bg-muted/20">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                      <AvatarImage src={customer.avatarUrl} alt={`${customer.firstName} ${customer.lastName}`} data-ai-hint={customer.dataAiHint || 'person'} />
                      <AvatarFallback>{customer.firstName.charAt(0)}{customer.lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold font-headline group-hover:text-primary">
                        {customer.firstName} {customer.lastName}
                      </CardTitle>
                      <CardDescription className="text-xs flex items-center">
                        <Mail className="mr-1 h-3 w-3" /> {customer.email}
                      </CardDescription>
                       <p className="text-xs text-muted-foreground mt-0.5">
                        Member Since: {new Date(customer.memberSince).toLocaleDateString()}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-muted-foreground flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-500 fill-yellow-500" /> Rewards:
                      </span>
                      <span className="font-semibold text-primary">{customer.rewardsPoints ?? 0} pts</span>
                    </div>
                    <Link href={`/dashboard/customers/${customer.id}`} passHref>
                      <Button className="w-full" variant="outline">
                        View Profile <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
