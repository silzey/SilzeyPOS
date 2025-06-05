
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, Sprout, PackageCheck, BarChart2, AlertTriangle } from 'lucide-react';

export default function CultivationPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center">
            <Leaf className="mr-3 h-7 w-7" /> Cultivation Management
          </CardTitle>
          <CardDescription>Oversee your entire cultivation lifecycle, from seed to harvest, ensuring compliance and maximizing yield.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={Sprout}
              title="Plant Lifecycle Tracking"
              description="Monitor every plant from clone or seed through vegetative, flowering, and harvest stages. Track genetics, planting dates, and locations."
              features={[
                "Strain & Batch Management",
                "Individual Plant Tagging (RFID/Barcode placeholders)",
                "Growth Stage Monitoring & Logging",
                "Mother Plant Management",
              ]}
            />
            <FeatureCard
              icon={PackageCheck}
              title="Yield Optimization & Harvest"
              description="Plan and record harvests, track wet and dry weights, and analyze yield data to improve future cultivation cycles."
              features={[
                "Harvest Scheduling & Forecasting",
                "Weight & Potency Tracking",
                "Drying & Curing Room Management",
                "Waste Tracking & Disposal Logs",
              ]}
            />
            <FeatureCard
              icon={AlertTriangle}
              title="Compliance & Reporting"
              description="Maintain compliance with state regulations. (Placeholder for integration with systems like Metrc/BioTrack)."
              features={[
                "State Compliance ID Tracking",
                "Audit Trail Generation",
                "Pesticide & Contaminant Test Logging",
                "Regulatory Report Templates (Mock)",
              ]}
            />
            <FeatureCard
              icon={BarChart2}
              title="Environmental Monitoring & Control"
              description="Integrate with environmental sensors to monitor and adjust conditions like temperature, humidity, and light. (Conceptual - no actual hardware integration)."
              features={[
                "Real-time Sensor Data (Mock)",
                "Nutrient & Feeding Schedules",
                "Lighting Cycle Management",
                "Pest & Disease Management Logs",
              ]}
            />
          </div>
           <p className="mt-8 text-center text-muted-foreground italic">
            Full cultivation management features are under development. The above outlines the planned scope.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, features }) => (
  <Card className="bg-muted/30 hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-primary" />
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <ul className="list-disc list-inside text-xs space-y-1">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
