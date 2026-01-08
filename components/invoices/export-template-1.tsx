'use client';

import jsPDF from 'jspdf';
import { useState } from 'react';
import autoTable from 'jspdf-autotable';
import { format, toDate } from 'date-fns';
import { currencyFormatter } from '@/lib/utils';

import '@/fonts/Switzer-Regular-normal';
import '@/fonts/Switzer-Medium-normal';
import '@/fonts/Switzer-Semibold-bold';
import '@/fonts/Switzer-Bold-bold';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Customer, InvoiceItem } from '@/lib/db/schema';

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
      companyAccountNumber: string | null;
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

export default function ExportTemplateOne({ invoiceDetails }: Props) {
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

      const invoiceNo = `${invoiceDetails.invoicePrefix}-${invoiceDetails.invoiceNumber}`;

      //header
      pdf.setFont('Switzer-Semibold', 'bold');
      pdf.setFontSize(28);
      pdf.text('Invoice', 40, 50);

      pdf.setFont('Switzer-Regular', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Invoice No: ${invoiceNo.toUpperCase()}`, 300, 90);
      pdf.text(
        `Date: ${format(toDate(invoiceDetails.createdAt), 'dd MMM yyyy')}`,
        300,
        100
      );
      pdf.text(
        `Due Date: ${format(toDate(invoiceDetails.dueDate), 'dd MMM yyyy')}`,
        300,
        110
      );

      pdf.setFontSize(10);
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.setFont('Switzer-Medium', 'normal');
      pdf.text('From', 40, 125);
      pdf.setFont('Switzer-Regular', 'normal');
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(`${invoiceDetails.author.companyName}`, 40, 138);
      pdf.text(`${invoiceDetails.author.email}`, 40, 148);

      //invoice contact
      pdf.setFont('Switzer-Medium', 'normal');
      pdf.setFontSize(10);
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.text('Issue To', 40, 170);
      pdf.setFont('Switzer-Regular', 'normal');
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(`${invoiceDetails.billing.customerName}`, 40, 183);
      pdf.text(`${invoiceDetails.billing.email}`, 40, 193);
      pdf.text(`${invoiceDetails.billing.billingAddress}`, 40, 203);

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
          fillColor: [250, 250, 250], // header background color (RGB)
          font: 'Switzer-Medium',
          fontStyle: 'normal',
          textColor: 0, // header text color (white)
          halign: 'left', // text alignment
          lineWidth: 0.2, // border thickness
          lineColor: [229, 231, 235], // border color,
          cellPadding: 5,
        },
        columnStyles: {
          O: { cellWidth: 90 },
          1: { cellWidth: 50 },
          2: { cellWidth: 60 },
          3: { cellWidth: 70 },
        },
        didParseCell: (data) => {
          if (
            data.section === 'body' &&
            ['rate', 'total'].includes(data.column.dataKey.toString())
          ) {
            const value = data.cell.raw;
            data.cell.text = [`${currencyFormatter(String(value))}`];
          }
        },
        styles: {
          halign: 'left',
          valign: 'middle',
          lineColor: [229, 231, 235], // column border color
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
      });

      //cart information
      //subtotal
      const subtotal = invoiceDetails.items
        .map((item) => item.total)
        .reduce((prev, curr) => prev + curr, 0);

      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.setFont('Switzer-Medium', 'normal');
      pdf.setFontSize(10);
      pdf.text('Subtotal', 270, 400);
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(`${currencyFormatter(String(subtotal))}`, 370, 400);
      //discount
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.setFontSize(10);
      pdf.text(`Discount (${invoiceDetails.discount}%)`, 270, 415);
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(
        `${
          invoiceDetails.discount &&
          currencyFormatter(String(subtotal * (invoiceDetails.discount / 100)))
        }`,
        370,
        415
      );
      //Tax
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.setFontSize(10);
      pdf.text(`Tax (${invoiceDetails.vat}%)`, 270, 430);
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(
        `${currencyFormatter(String(subtotal * (invoiceDetails.vat / 100)))}`,
        370,
        430
      );

      //line
      pdf.setDrawColor(229, 231, 235);
      pdf.line(270, 440, 420, 440);

      //total
      pdf.setGState(pdf.GState({ opacity: 0.5 }));
      pdf.setFontSize(10);
      pdf.text('Total', 270, 455);
      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.text(`${currencyFormatter(String(invoiceDetails.total))}`, 370, 455);

      //extra information
      pdf.setGState(pdf.GState({ opacity: 0.7 }));
      pdf.setFont('Switzer-Regular', 'normal');
      pdf.setFontSize(9);
      pdf.text(
        'Please contact us for more information about invoice options.',
        40,
        500
      );
      pdf.text(`Account Holder: ${invoiceDetails.author.companyName}`, 40, 520);
      pdf.text(
        `Account Number: ${invoiceDetails.author.companyAccountNumber}`,
        40,
        530
      );
      pdf.text(
        `Account Type: ${invoiceDetails.author.companyAccountType}`,
        40,
        540
      );
      pdf.text(`Bank: ${invoiceDetails.author.companyBank}`, 40, 550);
      pdf.text(
        `Branch Code: ${invoiceDetails.author.companyBranchCode}`,
        40,
        560
      );

      pdf.setGState(pdf.GState({ opacity: 1 }));
      pdf.setFont('Switzer-Semibold', 'bold');
      pdf.text('Thank you for your business.', 180, 580);

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
