import { SOPFile } from '@/types/sop';
import { FileText, HardDrive, Clock } from 'lucide-react';
import { formatBytes } from '@/lib/formatters';

interface StatisticsBarProps {
  files: SOPFile[];
}

export function StatisticsBar({ files }: StatisticsBarProps) {
  const totalFiles = files.length;
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  
  // Get most recent upload date
  const latestUpload = files.length > 0 
    ? new Date(Math.max(...files.map(f => new Date(f.uploadedDate).getTime())))
    : null;

  const stats = [
    {
      label: 'Total Documents',
      value: totalFiles.toString(),
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Storage Used',
      value: formatBytes(totalSize),
      icon: HardDrive,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Last Upload',
      value: latestUpload 
        ? latestUpload.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'No uploads',
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground font-medium mb-0.5">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground tracking-tight truncate">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
