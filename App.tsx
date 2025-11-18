import React, { useState, useMemo, useEffect } from 'react';
import { Asset, AssetStatus } from './types';
import { INITIAL_ASSETS } from './constants';
import { AssetModal } from './components/AssetModal';
import {
  NexaLogo, PlusIcon, PencilIcon, TrashIcon,
  CollectionIcon, CheckCircleIcon, UserCircleIcon, WrenchIcon, ComputerDesktopIcon,
} from './components/icons';

const APP_STORAGE_KEY = 'nexa-assets-v1';

const DashboardCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, title, count, color, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`p-4 bg-surface rounded-lg shadow-sm border transition-all duration-200 ${isActive ? 'ring-2 ring-primary border-primary' : 'border-border hover:shadow-md'}`}
  >
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-text-main">{count}</p>
        <p className="text-sm text-text-secondary">{title}</p>
      </div>
    </div>
  </button>
);

const App: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const savedAssets = localStorage.getItem(APP_STORAGE_KEY);
      return savedAssets ? JSON.parse(savedAssets) : INITIAL_ASSETS;
    } catch (error) {
      console.error("Failed to parse assets from localStorage", error);
      return INITIAL_ASSETS;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<AssetStatus | 'all'>('all');

  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(assets));
  }, [assets]);

  const countByStatus = useMemo(() => {
    return assets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {} as Record<AssetStatus, number>);
  }, [assets]);

  const handleOpenModal = (asset?: Asset) => {
    setAssetToEdit(asset || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAssetToEdit(null);
  };

  const handleSaveAsset = (asset: Asset) => {
    setAssets(prev => assetToEdit ? prev.map(a => a.id === asset.id ? asset : a) : [asset, ...prev]);
    handleCloseModal();
  };

  const handleDeleteAsset = (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(prev => prev.filter(a => a.id !== assetId));
    }
  };

  const handleFilterChange = (status: AssetStatus | 'all') => {
    setActiveFilter(status);
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesFilter = activeFilter === 'all' || asset.status === activeFilter;
      const matchesSearch = searchTerm.trim() === '' ||
        Object.values(asset).some(value => {
            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm.toLowerCase());
            }
            if (typeof value === 'object' && value !== null && 'name' in value && 'email' in value) {
                return (value as any).name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (value as any).email.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        });
      return matchesFilter && matchesSearch;
    });
  }, [assets, searchTerm, activeFilter]);

  const statusColors: Record<AssetStatus, string> = {
    [AssetStatus.InStock]: 'bg-green-100 text-green-600',
    [AssetStatus.Assigned]: 'bg-red-100 text-red-600',
    [AssetStatus.InRepair]: 'bg-yellow-100 text-yellow-600',
    [AssetStatus.AwaitingReimage]: 'bg-purple-100 text-purple-600',
    [AssetStatus.LostOrStolen]: 'bg-gray-200 text-gray-800',
  };

  const dashboardCards = [
    {
      title: 'Total Assets',
      status: 'all',
      count: assets.length,
      icon: <CollectionIcon className="text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'In Stock',
      status: AssetStatus.InStock,
      count: countByStatus[AssetStatus.InStock] || 0,
      icon: <CheckCircleIcon className="text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Assigned',
      status: AssetStatus.Assigned,
      count: countByStatus[AssetStatus.Assigned] || 0,
      icon: <UserCircleIcon className="text-red-600" />,
      color: 'bg-red-100'
    },
    {
      title: 'In Repair',
      status: AssetStatus.InRepair,
      count: countByStatus[AssetStatus.InRepair] || 0,
      icon: <WrenchIcon className="text-yellow-600" />,
      color: 'bg-yellow-100'
    },
    {
      title: 'Awaiting Re-image',
      status: AssetStatus.AwaitingReimage,
      count: countByStatus[AssetStatus.AwaitingReimage] || 0,
      icon: <ComputerDesktopIcon className="text-purple-600" />,
      color: 'bg-purple-100'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-background text-text-main font-sans">
        <header className="bg-surface border-b border-border shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <NexaLogo className="w-10 h-10" />
                <h1 className="text-2xl font-bold ml-3">Nexa</h1>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg shadow-sm hover:bg-primary-focus transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Asset
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {dashboardCards.map(card => (
              <DashboardCard
                key={card.title}
                title={card.title}
                count={card.count}
                icon={card.icon}
                color={card.color}
                isActive={activeFilter === card.status}
                onClick={() => handleFilterChange(card.status as AssetStatus | 'all')}
              />
            ))}
          </div>
          
          <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
               <h2 className="text-xl font-semibold">
                {activeFilter === 'all' ? 'All Assets' : `${activeFilter} Assets`}
                <span className="text-sm font-normal text-text-secondary ml-2">({filteredAssets.length} items)</span>
               </h2>
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {filteredAssets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Asset Name</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Assigned To</th>
                      <th scope="col" className="px-6 py-3">Department</th>
                      <th scope="col" className="px-6 py-3">Re-image Date</th>
                      <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map(asset => (
                      <tr key={asset.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {asset.name}
                          <div className="text-xs text-text-secondary">{asset.serialNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[asset.status] || 'bg-gray-100 text-gray-800'}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {asset.assignedTo.name ? (
                            <div>
                                <div>{asset.assignedTo.name}</div>
                                <div className="text-xs text-text-secondary">{asset.assignedTo.email}</div>
                            </div>
                          ) : (
                            <span className="text-text-secondary">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{asset.department || <span className="text-text-secondary">N/A</span>}</td>
                        <td className="px-6 py-4">{asset.reimageDate ? new Date(asset.reimageDate).toLocaleDateString() : <span className="text-text-secondary">N/A</span>}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => handleOpenModal(asset)} className="p-1 text-gray-500 hover:text-primary"><PencilIcon /></button>
                            <button onClick={() => handleDeleteAsset(asset.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8">
                 <h3 className="text-lg font-medium text-text-main">No assets found</h3>
                 <p className="text-sm text-text-secondary mt-1">
                   {searchTerm ? 'Try adjusting your search or filter.' : 'Add a new asset to get started.'}
                 </p>
                 {activeFilter !== 'all' && (
                    <button onClick={() => setActiveFilter('all')} className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-lg shadow-sm hover:bg-primary-focus">
                        Clear Filters
                    </button>
                 )}
              </div>
            )}
          </div>
        </main>
      </div>

      <AssetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAsset}
        assetToEdit={assetToEdit}
      />
    </>
  );
};

export default App;
