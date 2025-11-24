
export enum AssetStatus {
  InStock = 'In Stock',
  Assigned = 'Assigned',
  InRepair = 'In Repair',
  AwaitingReimage = 'Awaiting Re-image',
  LostOrStolen = 'Lost/Stolen',
  Disposed = 'Disposed',
}

export enum AssetCategory {
  Laptop = 'Laptop',
  Desktop = 'Desktop',
  Tablet = 'Tablet',
  Monitor = 'Monitor',
  Projector = 'Projector',
  Peripherals = 'Peripherals',
  Software = 'Software',
}

export interface User {
  name: string;
  email: string;
}

export interface AuditLogEntry {
  id: string;
  date: string;
  action: 'Created' | 'Updated' | 'Deleted' | 'Disposed';
  details: string;
  user: string; // The system user who performed the action
}

export interface Asset {
  id: string;
  assetTag: string; // Primary Key (e.g., Barcode ID)
  name: string;
  category: AssetCategory;
  status: AssetStatus;
  purchaseDate: string;
  reimageDate: string;
  value: number;
  assignedTo: User;
  department: string;
  location: string;
  description: string;
  serialNumber: string;
  auditLog: AuditLogEntry[];
  assignmentSignature?: string; // Base64 image string
  disposalSignature?: string; // Base64 image string
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Staff' | 'Viewer';
  lastLogin: string;
  status: 'Active' | 'Inactive';
  password?: string; // For mock auth
}
