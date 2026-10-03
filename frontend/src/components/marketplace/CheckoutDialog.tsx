import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: any;
}

export function CheckoutDialog({ open, onOpenChange, batch }: CheckoutDialogProps) {
  const [tonnes, setTonnes] = useState<number>(100);
  
  const bufferPool = tonnes * 0.15;
  const netTonnes = tonnes - bufferPool;
  const totalPrice = tonnes * batch.price_per_tonne;
  
  const upfront = totalPrice * 0.3;
  const verify = totalPrice * 0.4;
  const issuance = totalPrice * 0.3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-white/10 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-emerald-400">Forward-Finance Checkout</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Purchase verified carbon credits with built-in permanence guarantees.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="tonnes">Gross Tonnes Requested</Label>
            <Input 
              id="tonnes" 
              type="number" 
              value={tonnes}
              onChange={(e) => setTonnes(Number(e.target.value))}
              className="bg-zinc-900 border-white/10 text-lg font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
            <div>
              <p className="text-sm text-muted-foreground">Net Deliverable (85%)</p>
              <p className="text-xl font-mono text-white">{netTonnes.toFixed(1)} <span className="text-sm">tCO2e</span></p>
            </div>
            <div>
              <p className="text-sm text-emerald-400/70">Permanence Buffer (15%)</p>
              <p className="text-xl font-mono text-emerald-400">{bufferPool.toFixed(1)} <span className="text-sm">tCO2e</span></p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Escrow Milestone Payouts</h4>
            <div className="relative pl-4 border-l border-white/10 space-y-6">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <div className="flex justify-between">
                  <span className="font-medium">1. Contract Signing (30%)</span>
                  <span className="font-mono">${upfront.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Upfront financing for practice changes.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <div className="flex justify-between text-zinc-400">
                  <span className="font-medium">2. Satellite Verification (40%)</span>
                  <span className="font-mono">${verify.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <p className="text-sm text-zinc-500 mt-1">Released mid-season upon remote sensing validation.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <div className="flex justify-between text-zinc-400">
                  <span className="font-medium">3. Registry Issuance (30%)</span>
                  <span className="font-mono">${issuance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <p className="text-sm text-zinc-500 mt-1">Final payout upon official MRV issuance.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-6 border-t border-white/10">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Committment</p>
            <p className="text-2xl font-mono font-bold text-white">${totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-6 rounded-xl">
            Confirm & Deposit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
