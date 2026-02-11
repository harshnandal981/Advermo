'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportButtonProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  disabled?: boolean;
}

export default function ExportButton({ 
  onExportCSV, 
  onExportPDF,
  disabled = false 
}: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      await onExportCSV();
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      await onExportPDF();
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled || loading}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span>Export</span>
      </button>

      {showMenu && !loading && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-card border rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-sm">Export as CSV</p>
                <p className="text-xs text-muted-foreground">Download data table</p>
              </div>
            </button>
            
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-t"
            >
              <FileText className="h-4 w-4 text-red-600" />
              <div>
                <p className="font-medium text-sm">Export as PDF</p>
                <p className="text-xs text-muted-foreground">Print report</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
