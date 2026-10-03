import React from 'react';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { CreditCard } from '@/components/marketplace/CreditCard';

const mockBatches = [
  {
    id: '1',
    standard: 'verra',
    vintage_year: '2023',
    available_tco2e: 450.5,
    price_per_tonne: 22.0,
    scope_3_region: 'Latin America',
  },
  {
    id: '2',
    standard: 'gold_standard',
    vintage_year: '2022',
    available_tco2e: 120.0,
    price_per_tonne: 25.5,
    scope_3_region: 'Asia Pacific',
  },
  {
    id: '3',
    standard: 'verra',
    vintage_year: '2024',
    available_tco2e: 1000.0,
    price_per_tonne: 18.0,
    scope_3_region: 'EMEA',
  }
];

export function BuyerMarketplace() {
  return (
    <div className="flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FilterSidebar />
      
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Discovery Portal</h1>
          <p className="text-muted-foreground mt-2">Source high-integrity offsets and Scope 3 insets directly from aggregated smallholders.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockBatches.map((batch) => (
            <CreditCard key={batch.id} batch={batch} />
          ))}
        </div>
      </div>
    </div>
  );
}
