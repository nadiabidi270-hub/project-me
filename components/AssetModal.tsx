import React, { useState, useEffect } from 'react';
import { Asset, AssetStatus, AssetCategory, User } from '../types';
import { SignaturePad } from './SignaturePad';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
  assetToEdit: Asset | null;
}

const initialFormState: Omit<Asset, 'id' | 'assignedTo' | 'auditLog'> & { assignedTo: User } = {
  assetTag: '',
  name: '',
  category: AssetCategory.Laptop,
  status: AssetStatus.InStock,
  purchaseDate: '',
  reimageDate: '',
  value: 0,
  assignedTo: { name: '', email: '' },
  department: '',
  location: '',
  description: '',
  serialNumber: '',
  assignmentSignature: '',
  disposalSignature: ''
};

export const AssetModal: React.FC<AssetModalProps> = ({ isOpen, onClose, onSave, assetToEdit }) => {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (assetToEdit) {
      setFormData(assetToEdit);
    } else {
      setFormData({
          ...initialFormState,
          assetTag: `TAG-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }
  }, [assetToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'assignedToName' || name === 'assignedToEmail') {
        const field = name === 'assignedToName' ? 'name' : 'email';
        setFormData(prev => ({
            ...prev,
            assignedTo: { ...prev.assignedTo, [field]: value }
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: name === 'value' ? parseFloat(value) : value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assetToSave: Asset = {
      ...formData,
      id: assetToEdit ? assetToEdit.id : `asset-${new Date().getTime()}`,
      auditLog: assetToEdit ? assetToEdit.auditLog : [],
    };
    onSave(assetToSave);
  };

  const inputStyles = "w-full bg-background border-border rounded-md shadow-sm focus:ring-primary focus:border-primary text-text-main";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-text-main">{assetToEdit ? 'Edit Asset' : 'Add New Asset'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
                <label htmlFor="assetTag" className="block text-sm font-bold text-primary mb-1">Asset Tag (Primary Key)</label>
                <input type="text" name="assetTag" id="assetTag" value={formData.assetTag} onChange={handleChange} className={inputStyles} required placeholder="e.g. TAG-1234" />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Asset Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
              <select name="category" id="category" value={formData.category} onChange={handleChange} className={inputStyles}>
                {Object.values(AssetCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">Status</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                {Object.values(AssetStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
              </select>
            </div>
            
            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-text-secondary mb-1">Purchase Date</label>
              <input type="date" name="purchaseDate" id="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className={inputStyles} />
            </div>

            <div>
              <label htmlFor="reimageDate" className="block text-sm font-medium text-text-secondary mb-1">Next Re-image Date</label>
              <input type="date" name="reimageDate" id="reimageDate" value={formData.reimageDate} onChange={handleChange} className={inputStyles} />
            </div>

            <div>
              <label htmlFor="value" className="block text-sm font-medium text-text-secondary mb-1">Purchase Value ($)</label>
              <input type="number" name="value" id="value" step="0.01" value={formData.value} onChange={handleChange} className={inputStyles} />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-text-secondary mb-1">Department</label>
              <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} className={inputStyles} />
            </div>
            
            <div>
              <label htmlFor="assignedToName" className="block text-sm font-medium text-text-secondary mb-1">Assigned To Name</label>
              <input type="text" name="assignedToName" id="assignedToName" value={formData.assignedTo.name} onChange={handleChange} className={inputStyles} />
            </div>
            
            <div>
              <label htmlFor="assignedToEmail" className="block text-sm font-medium text-text-secondary mb-1">Assigned To Email</label>
              <input type="email" name="assignedToEmail" id="assignedToEmail" value={formData.assignedTo.email} onChange={handleChange} className={inputStyles} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-1">Location</label>
              <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={inputStyles} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="serialNumber" className="block text-sm font-medium text-text-secondary mb-1">Serial Number</label>
              <input type="text" name="serialNumber" id="serialNumber" value={formData.serialNumber} onChange={handleChange} className={inputStyles} />
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                 <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description</label>
              </div>
              <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className={inputStyles}></textarea>
            </div>

            {/* Signature Section for Assignments */}
            {formData.status === AssetStatus.Assigned && (
                 <div className="md:col-span-2 mt-4 border-t pt-4">
                     <h3 className="text-lg font-bold text-gray-800 mb-2">Device Reception Log</h3>
                     <p className="text-sm text-gray-600 mb-2">I acknowledge receipt of this device in good working order.</p>
                     <SignaturePad 
                        label="Recipient Signature"
                        existingSignature={formData.assignmentSignature}
                        onSave={(sig) => setFormData(prev => ({...prev, assignmentSignature: sig}))}
                        onClear={() => setFormData(prev => ({...prev, assignmentSignature: ''}))}
                     />
                 </div>
            )}

            {/* Signature Section for Disposal */}
             {formData.status === AssetStatus.Disposed && (
                 <div className="md:col-span-2 mt-4 border-t pt-4">
                     <h3 className="text-lg font-bold text-red-800 mb-2">Disposal Agreement</h3>
                     <p className="text-sm text-gray-600 mb-2">I authorize the disposal of this asset according to policy.</p>
                     <SignaturePad 
                        label="Client Disposal Signature"
                        existingSignature={formData.disposalSignature}
                        onSave={(sig) => setFormData(prev => ({...prev, disposalSignature: sig}))}
                        onClear={() => setFormData(prev => ({...prev, disposalSignature: ''}))}
                     />
                 </div>
            )}
          </div>

          <div className="flex justify-end items-center gap-4 pt-6 mt-6 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-text-main rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors">Save Asset</button>
          </div>
        </form>
      </div>
    </div>
  );
};