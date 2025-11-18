import { Brand } from '@/types/sop';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

interface BrandSidebarProps {
  selectedBrand: Brand;
  onSelectBrand: (brand: Brand) => void;
}

const brands: { value: Brand; label: string; color: string }[] = [
  { value: 'knitwell', label: 'Knitwell', color: 'brand-knitwell' },
  { value: 'chicos', label: "Chico's", color: 'brand-chicos' },
  { value: 'talbots', label: 'Talbots', color: 'brand-talbots' },
];

export function BrandSidebar({ selectedBrand, onSelectBrand }: BrandSidebarProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="px-8 py-4 flex items-center gap-6">
        <div className="flex items-center gap-2 text-foreground">
          <Building2 className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Brands:</h2>
        </div>
        <nav className="flex gap-2">
          {brands.map(brand => (
            <button
              key={brand.value}
              onClick={() => onSelectBrand(brand.value)}
              className={cn(
                'px-4 py-2 rounded-lg transition-all',
                'flex items-center gap-2 group',
                selectedBrand === brand.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-secondary text-foreground'
              )}
            >
              <div
                className={cn(
                  'w-3 h-3 rounded-full',
                  selectedBrand === brand.value ? 'bg-primary-foreground' : `bg-${brand.color}`
                )}
              />
              <span className="font-medium">{brand.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
