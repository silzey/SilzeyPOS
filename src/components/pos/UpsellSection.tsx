"use client";

import type { FC } from 'react';
import type { UpsellSuggestionsOutput } from '@/ai/flows/upsell-suggestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UpsellSectionProps {
  suggestions: UpsellSuggestionsOutput | null;
  isLoading: boolean;
}

const UpsellSection: FC<UpsellSectionProps> = ({ suggestions, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="bg-accent/10 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-accent font-headline">
            <Lightbulb className="mr-2 h-5 w-5" /> AI Upsell Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.suggestions.length === 0) {
    return null; 
  }

  return (
    <Card className="bg-accent/10 border-accent/30 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-accent font-headline">
          <Lightbulb className="mr-2 h-5 w-5" /> AI Upsell Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-accent-foreground/80 mb-3">{suggestions.reasoning}</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.suggestions.map((suggestion, index) => (
            <Badge key={index} variant="default" className="bg-accent text-accent-foreground text-sm py-1 px-3">
              {suggestion}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpsellSection;
