import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, HeartHandshake, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckoutDialog } from './CheckoutDialog';

interface CreditCardProps {
  batch: any;
}

export function CreditCard({ batch }: CreditCardProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="group relative rounded-2xl bg-zinc-900 p-[1px] overflow-hidden"
      >
        {/* Subtle gradient border effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-zinc-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative h-full bg-zinc-950/80 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-between border border-white/5">
          <div>
            <div className="flex justify-between items-start mb-4">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-wider text-[10px]">
                {batch.standard.replace('_', ' ')}
              </Badge>
              <span className="text-xl font-mono text-white">${batch.price_per_tonne.toFixed(2)}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
              Agroforestry Carbon Sink
            </h3>
            
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
              {batch.scope_3_region} • Vintage {batch.vintage_year}
            </div>
            
            <div className="flex space-x-3 mb-6">
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5" title="Biodiversity">
                <Leaf className="w-4 h-4 text-emerald-400 mb-1" />
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5" title="Water Conservation">
                <Droplets className="w-4 h-4 text-blue-400 mb-1" />
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5" title="Community Impact">
                <HeartHandshake className="w-4 h-4 text-rose-400 mb-1" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="text-sm">
              <span className="text-muted-foreground">Available: </span>
              <span className="font-mono text-emerald-400">{batch.available_tco2e} tCO2e</span>
            </div>
            <Button 
              size="sm" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
              onClick={() => setCheckoutOpen(true)}
            >
              Finance
            </Button>
          </div>
        </div>
      </motion.div>

      <CheckoutDialog 
        open={checkoutOpen} 
        onOpenChange={setCheckoutOpen}
        batch={batch}
      />
    </>
  );
}
