
import React, { useState, useMemo, useEffect } from 'react';
import { Asset, AssetStatus, AppUser, AuditLogEntry } from './types';
import { INITIAL_ASSETS, INITIAL_USERS } from './constants';
import { AssetModal } from './components/AssetModal';
import {
  NexaLogo, PlusIcon, PencilIcon, TrashIcon, SearchIcon,
  DashboardIcon, BoxIcon, ChartBarIcon, CogIcon, UsersIcon, ClipboardDocumentCheckIcon
} from './components/icons';
import { ReportsPage } from './components/ReportsPage';
import { SettingsPage } from './components/SettingsPage';
import { UsersPage } from './components/UsersPage';
import { AuditPage } from './components/AuditPage';
import { PieChart } from './components/PieChart';
import { LoginPage } from './components/LoginPage';

const APP_STORAGE_KEY = 'nexa-assets-v3';
const USERS_STORAGE_KEY = 'nexa-users-v1';

type Page = 'Dashboard' | 'All Assets' | 'Reports' | 'Users' | 'Audit Log' | 'Settings';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  currentUser: AppUser | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onLogout, currentUser }) => {
  const navItems = [
    { icon: <DashboardIcon />, label: 'Dashboard' as Page },
    { icon: <BoxIcon />, label: 'All Assets' as Page },
    { icon: <ChartBarIcon />, label: 'Reports' as Page },
    { icon: <UsersIcon />, label: 'Users' as Page },
    { icon: <ClipboardDocumentCheckIcon />, label: 'Audit Log' as Page },
    { icon: <CogIcon />, label: 'Settings' as Page },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-text flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <NexaLogo className="w-8 h-8" />
        <h1 className="text-xl font-bold ml-3 text-white">Nexa</h1>
      </div>
      <div className="px-6 py-4 border-b border-gray-700">
        <p className="text-xs text-gray-400 uppercase">Logged in as</p>
        <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
        <p className="text-xs text-gray-400">{currentUser?.role}</p>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map(item => (
            <li key={item.label}>
              <button
                onClick={() => onNavigate(item.label)}
                className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  item.label === activePage ? 'bg-primary text-white' : 'hover:bg-sidebar-focus'
                }`}
              >
                {React.cloneElement(item.icon, { className: 'w-5 h-5 mr-3' })}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
          <button onClick={onLogout} className="w-full px-4 py-2 text-sm text-center text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              Sign Out
          </button>
      </div>
    </aside>
  );
};

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
  statusColors: Record<AssetStatus, string>;
  searchTerm: string;
}

const AssetTable: React.FC<AssetTableProps> = ({ assets, onEdit, onDelete, statusColors, searchTerm }) => {
  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold">
          All Assets
          <span className="text-sm font-normal text-text-secondary ml-2">({assets.length} items)</span>
        </h3>
      </div>
      {assets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Asset Tag</th>
                <th scope="col" className="px-6 py-3">Asset Name</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Assigned To</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Re-image Date</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-primary">{asset.assetTag || 'N/A'}</td>
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
                      <button onClick={() => onEdit(asset)} className="p-1 text-gray-500 hover:text-primary"><PencilIcon /></button>
                      <button onClick={() => onDelete(asset.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon /></button>
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
             {searchTerm ? 'Try adjusting your search.' : 'Add a new asset to get started.'}
           </p>
        </div>
      )}
    </div>
  );
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const savedAssets = localStorage.getItem(APP_STORAGE_KEY);
      return savedAssets ? JSON.parse(savedAssets) : INITIAL_ASSETS;
    } catch (error) {
      console.error("Failed to parse assets from localStorage", error);
      return INITIAL_ASSETS;
    }
  });

  const [users, setUsers] = useState<AppUser[]>(() => {
      try {
          const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
          return savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
      } catch (error) {
          return INITIAL_USERS;
      }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState<Page>('Dashboard');

  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Handle Login State Check
  useEffect(() => {
    const sessionUser = localStorage.getItem('nexa_session_user');
    if (sessionUser) {
        setCurrentUser(JSON.parse(sessionUser));
    }
  }, []);

  const handleLogin = (user: AppUser) => {
      setCurrentUser(user);
      localStorage.setItem('nexa_session_user', JSON.stringify(user));
  };

  const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('nexa_session_user');
  };

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

  const logAssetAction = (action: 'Created' | 'Updated' | 'Deleted', details: string): AuditLogEntry => {
      return {
          id: `log-${Date.now()}`,
          date: new Date().toISOString(),
          action,
          details,
          user: currentUser ? currentUser.name : 'Unknown User'
      };
  };

  const handleSaveAsset = (asset: Asset) => {
    setAssets(prev => {
        if (assetToEdit) {
            // Update existing
            return prev.map(a => {
                if (a.id === asset.id) {
                    const updatedLog = [
                        logAssetAction('Updated', `Asset updated. Status: ${asset.status}`),
                        ...(a.auditLog || [])
                    ];
                    return { ...asset, auditLog: updatedLog };
                }
                return a;
            });
        } else {
            // Create new
            const newLog = [logAssetAction('Created', 'Asset created initially')];
            return [{ ...asset, auditLog: newLog }, ...prev];
        }
    });
    handleCloseModal();
  };

  const handleDeleteAsset = (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(prev => prev.filter(a => a.id !== assetId));
    }
  };

  const handleAddUser = (user: AppUser) => {
      setUsers(prev => [...prev, user]);
  };
  
  const handleClearAllData = () => {
      setAssets([]);
      localStorage.removeItem(APP_STORAGE_KEY);
      localStorage.removeItem(USERS_STORAGE_KEY);
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
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
      return matchesSearch;
    });
  }, [assets, searchTerm]);

  const statusColors: Record<AssetStatus, string> = {
    [AssetStatus.InStock]: 'bg-status-instock text-status-instock-text',
    [AssetStatus.Assigned]: 'bg-status-assigned text-status-assigned-text',
    [AssetStatus.InRepair]: 'bg-status-inrepair text-status-inrepair-text',
    [AssetStatus.AwaitingReimage]: 'bg-status-reimage text-status-reimage-text',
    [AssetStatus.LostOrStolen]: 'bg-gray-200 text-gray-800',
    [AssetStatus.Disposed]: 'bg-red-900 text-white',
  };
  
   const statusPieColors: Record<AssetStatus, string> = {
    [AssetStatus.InStock]: '#10B981', // Emerald 500
    [AssetStatus.Assigned]: '#EF4444', // Red 500
    [AssetStatus.InRepair]: '#F59E0B', // Amber 500
    [AssetStatus.AwaitingReimage]: '#6366F1', // Indigo 500
    [AssetStatus.LostOrStolen]: '#6B7280', // Gray 500
    [AssetStatus.Disposed]: '#1F2937', // Gray 800
  };

  const pieChartData = useMemo(() => {
    return Object.entries(countByStatus)
      .map(([status, value]) => ({
        name: status,
        value: Number(value),
        color: statusPieColors[status as AssetStatus] || '#A0AEC0',
      }))
      .sort((a, b) => b.value - a.value);
  }, [countByStatus]);

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return (
          <>
            <div className="mb-6 bg-surface rounded-lg shadow-sm border border-border p-6">
                 <h3 className="text-lg font-semibold text-text-main mb-4">Asset Status Overview</h3>
                 {assets.length > 0 ? (
                    <PieChart data={pieChartData} />
                 ) : (
                    <div className="text-center py-12">
                        <p className="text-text-secondary">No asset data to display. Add an asset to see a summary.</p>
                    </div>
                 )}
            </div>
            <AssetTable
              assets={filteredAssets}
              onEdit={handleOpenModal}
              onDelete={handleDeleteAsset}
              statusColors={statusColors}
              searchTerm={searchTerm}
            />
          </>
        );
      case 'All Assets':
        return (
          <AssetTable
            assets={filteredAssets}
            onEdit={handleOpenModal}
            onDelete={handleDeleteAsset}
            statusColors={statusColors}
            searchTerm={searchTerm}
          />
        );
      case 'Reports':
        return <ReportsPage assets={assets} />;
      case 'Users':
          return <UsersPage users={users} onAddUser={handleAddUser} />;
      case 'Audit Log':
          return <AuditPage assets={assets} />;
      case 'Settings':
        return <SettingsPage onClearAllData={handleClearAllData} />;
      default:
        return <div className="text-center p-8">Error: Page not found</div>;
    }
  };

  // If not logged in, show Login Page
  if (!currentUser) {
      return <LoginPage users={users} onLogin={handleLogin} />;
  }

  return (
    <>
      <div className="flex h-screen bg-background text-text-main font-sans">
        <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} currentUser={currentUser} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-surface border-b border-border shadow-sm">
            <div className="flex justify-between items-center h-16 px-6">
              <h2 className="text-2xl font-bold text-text-main">{activePage}</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="w-5 h-5 text-text-secondary" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center justify-center bg-primary text-primary-content px-4 py-2 rounded-lg shadow-sm hover:bg-primary-focus transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Asset
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
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
