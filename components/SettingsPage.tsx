import React from 'react';
import { ExclamationTriangleIcon } from './icons';

interface SettingsPageProps {
  onClearAllData: () => void;
}

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-text-main">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);


export const SettingsPage: React.FC<SettingsPageProps> = ({ onClearAllData }) => {

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to delete all asset data? This action cannot be undone.')) {
            onClearAllData();
            alert('All asset data has been cleared.');
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-text-main mb-6">Application Settings</h2>
            <div className="max-w-2xl mx-auto space-y-6">
                <SettingsCard title="Data Management">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-text-main">Clear All Asset Data</h4>
                            <p className="text-sm text-text-secondary mt-1">
                                This will permanently delete all asset records from your browser's local storage. This is useful if you want to reset the application to its initial state. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <button 
                                onClick={handleClearData}
                                className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                Clear All Data
                            </button>
                        </div>
                    </div>
                </SettingsCard>
            </div>
        </div>
    );
};
