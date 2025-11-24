
import React, { useMemo } from 'react';
import { Asset, AssetStatus, AssetCategory } from '../types';

interface ReportsPageProps {
  assets: Asset[];
}

const statusColors: Record<AssetStatus, string> = {
    [AssetStatus.InStock]: 'bg-green-500',
    [AssetStatus.Assigned]: 'bg-red-500',
    [AssetStatus.InRepair]: 'bg-yellow-500',
    [AssetStatus.AwaitingReimage]: 'bg-indigo-500',
    [AssetStatus.LostOrStolen]: 'bg-gray-500',
    [AssetStatus.Disposed]: 'bg-slate-800',
};

const getDaysUntil = (dateString: string): number => {
    const today = new Date();
    const futureDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    futureDate.setHours(0, 0, 0, 0);
    const diffTime = futureDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

const ReportCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-text-main">{title}</h3>
        </div>
        <div className="p-4">
            {children}
        </div>
    </div>
);

export const ReportsPage: React.FC<ReportsPageProps> = ({ assets }) => {

    const statusBreakdown = useMemo(() => {
        const counts = assets.reduce((acc, asset) => {
            acc[asset.status] = (acc[asset.status] || 0) + 1;
            return acc;
        }, {} as Record<AssetStatus, number>);
        return Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1]));
    }, [assets]);

    const categoryBreakdown = useMemo(() => {
        const counts = assets.reduce((acc, asset) => {
            acc[asset.category] = (acc[asset.category] || 0) + 1;
            return acc;
        }, {} as Record<AssetCategory, number>);
        return Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1]));
    }, [assets]);
    
    const upcomingMaintenance = useMemo(() => {
        const today = new Date();
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(today.getDate() + 90);

        return assets
            .filter(asset => {
                if (!asset.reimageDate) return false;
                const reimageDate = new Date(asset.reimageDate);
                return reimageDate >= today && reimageDate <= ninetyDaysFromNow;
            })
            .sort((a, b) => new Date(a.reimageDate).getTime() - new Date(b.reimageDate).getTime());
    }, [assets]);

    const totalAssets = assets.length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-text-main mb-4">Asset Reports</h2>
            </div>
            <ReportCard title="Status Breakdown">
                <div className="space-y-4">
                    {statusBreakdown.map(([status, count]) => {
                        const percentage = totalAssets > 0 ? (Number(count) / totalAssets) * 100 : 0;
                        return (
                            <div key={status}>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-medium text-text-secondary">{status}</span>
                                    <span className="font-semibold text-text-main">{String(count)}</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2.5">
                                    <div 
                                        className={`${statusColors[status as AssetStatus] || 'bg-gray-400'} h-2.5 rounded-full`} 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )
                    })}
                     {statusBreakdown.length === 0 && <p className="text-text-secondary">No assets to report.</p>}
                </div>
            </ReportCard>

            <ReportCard title="Category Breakdown">
                <ul className="divide-y divide-border">
                    {categoryBreakdown.map(([category, count]) => (
                         <li key={category} className="flex justify-between items-center py-3">
                            <span className="text-sm font-medium text-text-secondary">{category}</span>
                            <span className="text-sm font-semibold bg-background px-2 py-1 rounded-md">{String(count)}</span>
                        </li>
                    ))}
                    {categoryBreakdown.length === 0 && <p className="text-text-secondary">No assets to report.</p>}
                </ul>
            </ReportCard>
            
            <div className="lg:col-span-2">
                <ReportCard title="Upcoming Maintenance (Next 90 Days)">
                   {upcomingMaintenance.length > 0 ? (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-text-secondary uppercase bg-background">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Asset Name</th>
                                    <th scope="col" className="px-4 py-3">Department</th>
                                    <th scope="col" className="px-4 py-3">Location</th>
                                    <th scope="col" className="px-4 py-3">Re-image Date</th>
                                    <th scope="col" className="px-4 py-3">Days Until Due</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingMaintenance.map(asset => {
                                    const daysUntil = getDaysUntil(asset.reimageDate);
                                    const urgencyColor = daysUntil <= 7 ? 'text-red-600 font-bold' : daysUntil <= 30 ? 'text-yellow-600 font-semibold' : 'text-text-main';
                                    return (
                                        <tr key={asset.id} className="border-b border-border hover:bg-background">
                                            <td className="px-4 py-3 font-medium text-text-main">{asset.name}</td>
                                            <td className="px-4 py-3">{asset.department}</td>
                                            <td className="px-4 py-3">{asset.location}</td>
                                            <td className="px-4 py-3">{new Date(asset.reimageDate).toLocaleDateString()}</td>
                                            <td className={`px-4 py-3 ${urgencyColor}`}>
                                                {daysUntil <= 0 ? 'Due Today' : `${daysUntil} day${daysUntil > 1 ? 's' : ''}`}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                   ) : (
                    <p className="text-text-secondary text-sm">No assets have maintenance scheduled in the next 90 days.</p>
                   )}
                </ReportCard>
            </div>
        </div>
    );
};