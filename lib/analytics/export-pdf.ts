import { useReactToPrint } from 'react-to-print';
import { format } from 'date-fns';

/**
 * Hook for generating PDF from a React component
 */
export function usePrintToPDF(filename: string = 'report') {
  const handlePrint = useReactToPrint({
    documentTitle: `${filename}-${format(new Date(), 'yyyy-MM-dd')}`,
    onPrintError: (error) => console.error('Print error:', error),
  });

  return handlePrint;
}

/**
 * Print current page as PDF
 */
export function printPageToPDF(title: string = 'Analytics Report') {
  const originalTitle = document.title;
  document.title = `${title}-${format(new Date(), 'yyyy-MM-dd')}`;
  
  window.print();
  
  // Restore original title after print dialog closes
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}

/**
 * Generate PDF-friendly styles
 */
export const pdfStyles = `
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    @page {
      size: A4;
      margin: 20mm;
    }
    
    .no-print {
      display: none !important;
    }
    
    .page-break {
      page-break-after: always;
    }
    
    .avoid-break {
      page-break-inside: avoid;
    }
    
    /* Ensure charts are visible */
    canvas, svg {
      max-width: 100%;
      height: auto;
    }
  }
`;
