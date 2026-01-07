'use client';

import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { useState } from 'react';
import autoTable from 'jspdf-autotable';
import { format, toDate } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Customer, InvoiceItem } from '@/lib/db/schema';
import { currencyFormatter, toBase64 } from '@/lib/utils';

import '@/fonts/Switzer-Regular-normal';
import '@/fonts/Switzer-Medium-normal';
import '@/fonts/Switzer-Semibold-bold';
import '@/fonts/Switzer-Bold-bold';

type Props = {
  invoiceDetails: {
    id: string;
    createdAt: Date;
    status: 'due' | 'paid' | null;
    dueDate: string;
    total: number;
    lastUpdatedAt: Date;
    vat: number;
    discount: number;
    authorId: string;
    billingId: string;
    invoicePrefix: string;
    invoiceNumber: number | null;
    items: InvoiceItem[];
    author: {
      email: string;
      companyAccountNumber: number | null;
      companyAccountType: string | null;
      companyBranchCode: number | null;
      companyName: string | null;
      companyBank: string | null;
      contactNumber: string | null;
      logoUrl: string | null;
      template: string | null;
      customers: Customer[];
    };
    billing: Customer;
  };
};

export default function ExportTemplateTwo({ invoiceDetails }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setLoading(true);

      if (!invoiceDetails) {
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      if (invoiceDetails.author.logoUrl) {
        const imageBase64 = await toBase64(invoiceDetails.author.logoUrl);

        pdf.addImage(imageBase64, 'PNG', 40, 20, 110, 110);
      }

      const invoiceNo = `${invoiceDetails.invoicePrefix}-${invoiceDetails.invoiceNumber}`;

      //header
      pdf.setFont('Switzer-Semibold', 'bold');
      pdf.setFontSize(28);
      pdf.text('Invoice', 285, 65, {
        charSpace: -0.4,
      });

      //company details
      pdf.setFont('Switzer-Medium', 'normal');
      pdf.setFontSize(11);
      pdf.text(`${invoiceDetails.author.companyName}`, 40, 130, {
        charSpace: -0.2,
      });
      pdf.setFont('Switzer-Regular', 'normal');
      pdf.setFontSize(10);
      pdf.text(
        `Contact Number: ${invoiceDetails.author.contactNumber}`,
        40,
        141
      );
      pdf.text(`Email: ${invoiceDetails.author.email}`, 40, 151);

      //invoice-header-info
      pdf.text(
        `Date: ${format(toDate(invoiceDetails.createdAt), 'dd MMM yyyy')}`,
        285,
        130
      );
      pdf.text(
        `Due Date: ${format(toDate(invoiceDetails.dueDate), 'dd MMM yyyy')}`,
        285,
        140
      );
      pdf.text(`Invoice Number:  ${invoiceNo.toUpperCase()}`, 285, 150);

      //bill info

      pdf.setFontSize(10);
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.text('Bill To', 40, 180);
      pdf.setGState(pdf.GState({ opacity: 1 }));

      pdf.setFontSize(11);
      pdf.text(invoiceDetails.billing.customerName, 40, 192);
      pdf.text(invoiceDetails.billing.billingAddress, 40, 202);

      //invoice details
      // 🧾 Table headers and data
      autoTable(pdf, {
        columns: [
          {
            header: 'Items',
            dataKey: 'itemDescription',
          },
          {
            header: 'QTY',
            dataKey: 'qty',
          },
          {
            header: 'Rate',
            dataKey: 'rate',
          },
          {
            header: 'Total',
            dataKey: 'total',
          },
        ],
        body: invoiceDetails.items,
        startY: 232,
        margin: {
          horizontal: 40,
        },
        theme: 'grid', // adds borders
        headStyles: {
          fillColor: '#a5a5a5', // header background color (RGB)
          font: 'Switzer-Medium',
          fontStyle: 'normal',
          textColor: 255, // header text color (white)
          halign: 'left', // text alignment
          lineWidth: 0.2, // border thickness
          lineColor: '#ffffff', // border color,
          cellPadding: 5,
        },
        columnStyles: {
          O: { cellWidth: 90 },
          1: { cellWidth: 50 },
          2: { cellWidth: 60 },
          3: { cellWidth: 70 },
        },
        styles: {
          halign: 'left',
          valign: 'middle',
          lineColor: '#ffffff', // column border color
          lineWidth: 0.5,
          fontSize: 11,
        },
        bodyStyles: {
          font: 'Switzer-Regular',
          fontStyle: 'normal',
          cellPadding: 5,
          textColor: 0,
          fontSize: 10,
        },
        didParseCell: (data) => {
          if (
            data.section === 'body' &&
            ['rate', 'total'].includes(data.column.dataKey.toString())
          ) {
            const value = data.cell.raw;
            data.cell.text = [`${currencyFormatter(String(value))}`];
          }

          if (data.section === 'body') {
            if (data.row.index % 2 === 0) {
              // even index = first row, white background
              data.cell.styles.fillColor = [255, 255, 255];
            } else {
              // odd index = second row, light gray
              data.cell.styles.fillColor = '#f2f2f2';
            }
          }
        },
      });

      //cart information
      //subtotal
      const subtotal = invoiceDetails.items
        .map((item) => item.total)
        .reduce((prev, curr) => prev + curr, 0);
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.setFont('Switzer-Medium', 'normal');
      pdf.setFontSize(10);
      pdf.text('Subtotal', 270, 380);
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(`${currencyFormatter(String(subtotal))}`, 370, 380);
      //discount
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.setFontSize(10);
      pdf.text(`Discount (${invoiceDetails.discount}%)`, 270, 395);
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(
        `${
          invoiceDetails.discount &&
          currencyFormatter(String(subtotal * (invoiceDetails.discount / 100)))
        }`,
        370,
        395
      );

      //Tax
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.setFontSize(10);
      pdf.text(`Tax (${invoiceDetails.vat}%)`, 270, 410);
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(
        `${currencyFormatter(String(subtotal * (invoiceDetails.vat / 100)))}`,
        370,
        410
      );

      //line
      pdf.setDrawColor(229, 231, 235);
      pdf.line(270, 420, 420, 420);

      //total
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.setFontSize(10);
      pdf.text('Total', 270, 435);
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(`${currencyFormatter(String(invoiceDetails.total))}`, 370, 435);

      //extra information
      pdf.setGState(pdf.GState({ opacity: 0.7 }));
      pdf.setFont('Switzer-Regular', 'normal');

      pdf.setFontSize(9);
      pdf.text(
        'Please contact us for more information about invoice options.',
        40,
        475
      );
      pdf.text(`Account Holder: ${invoiceDetails.author.companyName}`, 40, 495);
      pdf.text(
        `Account Number: ${invoiceDetails.author.companyAccountNumber}`,
        40,
        505
      );
      pdf.text(
        `Account Type: ${invoiceDetails.author.companyAccountType}`,
        40,
        515
      );
      pdf.text(`Bank: ${invoiceDetails.author.companyBank}`, 40, 525);
      pdf.text(
        `Branch Code: ${invoiceDetails.author.companyBranchCode}`,
        40,
        535
      );

      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.setFont('Switzer-Semibold', 'bold');
      pdf.text('Thank you for your business.', 180, 575);

      pdf.save(`Invoice-${invoiceNo.toUpperCase()}`);
    } catch (e) {
      if (e instanceof Error) {
        toast.error('Error', {
          description: e.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      variant={'ghost'}
      className='items-start justify-start w-full pl-0 px-2 py-1.5 text-sm font-normal'
      onClick={handleDownloadPdf}
    >
      Export PDF
    </Button>
  );
}
