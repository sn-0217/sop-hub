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
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="px-8 py-5 flex items-center gap-8">
        <div className="flex items-center gap-2.5 text-foreground">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Select Brand</span>
        </div>
        <nav className="flex gap-3">
          {brands.map(brand => (
            <button
              key={brand.value}
              onClick={() => onSelectBrand(brand.value)}
              className={cn(
                'px-5 py-2.5 rounded-lg transition-all duration-200',
                'flex items-center gap-2.5 font-medium text-sm',
                selectedBrand === brand.value
                  ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                  : 'hover:bg-secondary text-foreground hover:scale-102'
              )}
            >
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  selectedBrand === brand.value ? 'bg-primary-foreground' : `bg-${brand.color}`
                )}
              />
              <span>{brand.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
