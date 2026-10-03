import React from 'react';
import { BatchesTable } from '@/components/credits/BatchesTable';
import { FarmsTable } from '@/components/farms/FarmsTable';
import { MapCanvas } from '@/components/map/MapCanvas';

export function AggregatorDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Supplier Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your farms and mint verified carbon credits.</p>
        </div>
      </div>
      
      <MapCanvas />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FarmsTable />
        <BatchesTable />
      </div>
    </div>
  );
}
