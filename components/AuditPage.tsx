
import React, { useMemo, useState } from 'react';
import { Asset, AuditLogEntry } from '../types';

interface AuditPageProps {
    assets: Asset[];
}

export const AuditPage: React.FC<AuditPageProps> = ({ assets }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const allLogs = useMemo(() => {
        const logs: (AuditLogEntry & { assetName: string, assetTag: string })[] = [];
        assets.forEach(asset => {
            if (asset.auditLog) {
                asset.auditLog.forEach(log => {
                    logs.push({
                        ...log,
                        assetName: asset.name,
                        assetTag: asset.assetTag,
                    });
                });
            }
        });
        // Sort by date descending (newest first)
        return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [assets]);

    const filteredLogs = useMemo(() => {
        return allLogs.filter(log => 
            log.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allLogs, searchTerm]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-main">Audit Tracker</h2>
                 <div className="relative">
                     <input
                        type="text"
                        placeholder="Search audit logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-4 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
                    />
                 </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date & Time</th>
                                <th scope="col" className="px-6 py-3">Asset Tag</th>
                                <th scope="col" className="px-6 py-3">Asset Name</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                                <th scope="col" className="px-6 py-3">Details</th>
                                <th scope="col" className="px-6 py-3">User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map(log => (
                                    <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(log.date).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium text-primary">{log.assetTag}</td>
                                        <td className="px-6 py-4">{log.assetName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full 
                                                ${log.action === 'Created' ? 'bg-green-100 text-green-800' : 
                                                  log.action === 'Updated' ? 'bg-blue-100 text-blue-800' : 
                                                  log.action === 'Deleted' ? 'bg-red-100 text-red-800' : 
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{log.details}</td>
                                        <td className="px-6 py-4">{log.user}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No audit logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
