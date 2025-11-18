export enum AssetStatus {
  InStock = 'In Stock',
  Assigned = 'Assigned',
  InRepair = 'In Repair',
  AwaitingReimage = 'Awaiting Re-image',
  LostOrStolen = 'Lost/Stolen',
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

export interface Asset {
  id: string;
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
}
