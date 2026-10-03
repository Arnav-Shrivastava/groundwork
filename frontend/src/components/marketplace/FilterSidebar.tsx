import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function FilterSidebar() {
  return (
    <div className="w-64 flex-shrink-0 sticky top-6 space-y-8 p-6 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl">
      <div>
        <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-4">Standard</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="verra" defaultChecked />
            <Label htmlFor="verra">Verra (VCS)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="gold_standard" defaultChecked />
            <Label htmlFor="gold_standard">Gold Standard</Label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-4">Price / Tonne</h3>
        <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>$0</span>
          <span>$100+</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-4">Scope 3 Matching</h3>
        <Select defaultValue="all">
          <SelectTrigger className="w-full bg-zinc-950/50 border-white/10">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Global</SelectItem>
            <SelectItem value="latam">Latin America</SelectItem>
            <SelectItem value="apac">Asia Pacific</SelectItem>
            <SelectItem value="emea">EMEA</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
