import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const farms = [
  { id: '1', farmer_name: 'John Doe', hectares: 15.5, crop: 'Coffee' },
  { id: '2', farmer_name: 'Jane Smith', hectares: 42.0, crop: 'Cocoa' },
];

export function FarmsTable() {
  return (
    <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-medium tracking-tight">Onboarded Farms</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead>Farmer Name</TableHead>
              <TableHead>Crop Type</TableHead>
              <TableHead className="text-right">Hectares</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farms.map((farm) => (
              <TableRow key={farm.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-medium">{farm.farmer_name}</TableCell>
                <TableCell>{farm.crop}</TableCell>
                <TableCell className="text-right font-mono">{farm.hectares.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
