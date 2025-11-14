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
    <aside className="w-64 border-r border-border bg-card">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Brands
        </h2>
      </div>
      <nav className="p-4 space-y-2">
        {brands.map(brand => (
          <button
            key={brand.value}
            onClick={() => onSelectBrand(brand.value)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg transition-all',
              'flex items-center gap-3 group',
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
    </aside>
  );
}
