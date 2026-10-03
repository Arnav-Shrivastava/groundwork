import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for UI presentation
const batches = [
  {
    id: '1',
    standard: 'verra',
    vintage_year: '2023',
    available_tco2e: 450.5,
    price_per_tonne: 22.0,
    status: 'listed',
  },
  {
    id: '2',
    standard: 'gold_standard',
    vintage_year: '2022',
    available_tco2e: 120.0,
    price_per_tonne: 25.5,
    status: 'draft',
  },
];

export function BatchesTable() {
  return (
    <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-medium tracking-tight text-emerald-400">
          Active Credit Batches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead>Standard</TableHead>
              <TableHead>Vintage</TableHead>
              <TableHead className="text-right">Available (tCO2e)</TableHead>
              <TableHead className="text-right">Price/t</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-medium uppercase text-xs tracking-wider">
                  {batch.standard.replace('_', ' ')}
                </TableCell>
                <TableCell>{batch.vintage_year}</TableCell>
                <TableCell className="text-right font-mono">
                  {batch.available_tco2e.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono text-emerald-400">
                  ${batch.price_per_tonne.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={batch.status === 'listed' ? 'default' : 'secondary'}
                         className={batch.status === 'listed' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/50' : ''}>
                    {batch.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
