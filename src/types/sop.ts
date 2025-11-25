export type Brand = 'knitwell' | 'chicos' | 'talbots';

export interface SOPFile {
  id: string;
  name: string;
  size: number;
  uploadedDate: string;
  brand: Brand;
  url: string;
  fileCategory?: string;
  uploadedBy?: string;
}

export type UploadMode = 'single' | 'bulk' | 'global';
