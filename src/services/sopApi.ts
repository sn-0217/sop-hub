import { Brand, SOPFile } from '@/types/sop';

// Mock data for demonstration
const mockData: SOPFile[] = [
  {
    id: '1',
    name: 'Employee Handbook 2024.pdf',
    size: 2457600,
    uploadedDate: '2024-01-15',
    brand: 'knitwell',
    url: '#',
  },
  {
    id: '2',
    name: 'Safety Procedures.pdf',
    size: 1536000,
    uploadedDate: '2024-01-20',
    brand: 'knitwell',
    url: '#',
  },
  {
    id: '3',
    name: 'Quality Control Standards.pdf',
    size: 3072000,
    uploadedDate: '2024-02-01',
    brand: 'chicos',
    url: '#',
  },
  {
    id: '4',
    name: 'Customer Service Protocol.pdf',
    size: 1843200,
    uploadedDate: '2024-02-10',
    brand: 'talbots',
    url: '#',
  },
];

let sopFiles = [...mockData];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sopApi = {
  // GET /api/sops?brand=xyz
  async getSOPs(brand: Brand): Promise<SOPFile[]> {
    await delay(500);
    return sopFiles.filter(file => file.brand === brand);
  },

  // POST /api/sops/upload
  async uploadSOP(file: File, brand: Brand): Promise<SOPFile> {
    await delay(1000);
    
    const newFile: SOPFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      uploadedDate: new Date().toISOString().split('T')[0],
      brand,
      url: URL.createObjectURL(file),
    };
    
    sopFiles.push(newFile);
    return newFile;
  },

  // POST /api/sops/upload/bulk
  async uploadBulk(files: File[], brand: Brand): Promise<SOPFile[]> {
    await delay(1500);
    
    const newFiles = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      uploadedDate: new Date().toISOString().split('T')[0],
      brand,
      url: URL.createObjectURL(file),
    }));
    
    sopFiles.push(...newFiles);
    return newFiles;
  },

  // POST /api/sops/upload/global
  async uploadGlobal(files: File[]): Promise<SOPFile[]> {
    await delay(2000);
    
    const brands: Brand[] = ['knitwell', 'chicos', 'talbots'];
    const newFiles: SOPFile[] = [];
    
    brands.forEach(brand => {
      files.forEach(file => {
        const newFile: SOPFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          uploadedDate: new Date().toISOString().split('T')[0],
          brand,
          url: URL.createObjectURL(file),
        };
        newFiles.push(newFile);
      });
    });
    
    sopFiles.push(...newFiles);
    return newFiles;
  },

  // PUT /api/sops/{id}
  async updateSOP(id: string, file: File): Promise<SOPFile> {
    await delay(1000);
    
    const index = sopFiles.findIndex(f => f.id === id);
    if (index === -1) throw new Error('File not found');
    
    const updatedFile: SOPFile = {
      ...sopFiles[index],
      name: file.name,
      size: file.size,
      uploadedDate: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(file),
    };
    
    sopFiles[index] = updatedFile;
    return updatedFile;
  },

  // DELETE /api/sops/{id}
  async deleteSOP(id: string): Promise<void> {
    await delay(500);
    sopFiles = sopFiles.filter(f => f.id !== id);
  },
};
