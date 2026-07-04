import {
  Combine,
  Scissors,
  FileOutput,
  ListOrdered,
  RotateCw,
  FileArchive,
  Wrench,
  Landmark,
  FileText,
  Table,
  Presentation,
  Image,
  Type,
  FileType,
  Sheet,
  MonitorPlay,
  Images,
  Hash,
  Droplets,
  Lock,
  LockOpen,
  ScanText,
  AlignLeft,
  Languages,
  GitCompare,
  type LucideIcon
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Combine,
  Scissors,
  FileOutput,
  ListOrdered,
  RotateCw,
  FileArchive,
  Wrench,
  Landmark,
  FileText,
  Table,
  Presentation,
  Image,
  Type,
  FileType,
  Sheet,
  MonitorPlay,
  Images,
  Hash,
  Droplets,
  Lock,
  LockOpen,
  ScanText,
  AlignLeft,
  Languages,
  GitCompare
};

export function PdfToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] || FileText;
  return <Icon className={className} aria-hidden />;
}
