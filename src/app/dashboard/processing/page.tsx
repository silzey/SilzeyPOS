
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cog, FlaskConical, ScanBarcode, FileText, Beaker } from 'lucide-react';

export default function ProcessingPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center">
            <Cog className="mr-3 h-7 w-7" /> Processing & Manufacturing
          </CardTitle>
          <CardDescription>Manage product creation from raw materials to finished goods, with robust inventory auditing and compliance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={Beaker}
              title="Extraction & Formulation"
              description="Track extraction processes, manage product formulations, and record batch details for consistency and quality control."
              features={[
                "Raw Material Input Tracking",
                "Extraction Method Logging (e.g., CO2, Ethanol)",
                "Recipe & Formulation Management",
                "Batch Creation & Numbering",
              ]}
            />
            <FeatureCard
              icon={FlaskConical}
              title="Quality Control & Lab Testing"
              description="Log Certificates of Analysis (COAs), track test results, and manage samples sent for third-party lab testing."
              features={[
                "COA Document Management (Placeholder)",
                "Potency & Terpene Profile Logging",
                "Contaminant Test Results (Microbials, Pesticides)",
                "Lab Sample Tracking",
              ]}
            />
             <FeatureCard
              icon={ScanBarcode}
              title="Packaging & Labeling"
              description="Generate compliant labels, manage packaging inventory, and ensure products are ready for retail distribution."
              features={[
                "Customizable Label Templates (Mock)",
                "Automated Compliance Information (Placeholder)",
                "Packaging Material Inventory",
                "UID/Barcode Generation (Conceptual)",
              ]}
            />
            <FeatureCard
              icon={FileText}
              title="Inventory Auditing & Compliance"
              description="Maintain accurate records of processed goods, conduct internal audits, and prepare for regulatory inspections."
              features={[
                "Work-in-Progress (WIP) Inventory",
                "Finished Goods Inventory Management",
                "Production Cost Analysis (Mock)",
                "Comprehensive Audit Trails",
              ]}
            />
          </div>
           <p className="mt-8 text-center text-muted-foreground italic">
            Full processing and manufacturing features are under development. The above outlines the planned scope.
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
