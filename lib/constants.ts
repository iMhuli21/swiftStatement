import {
  FileText,
  FilePen,
  UserRoundPen,
  RadioTower,
  ChartNoAxesCombined,
} from 'lucide-react';

type Route = {
  href: string;
  label: string;
};

export const routes: Route[] = [
  {
    href: '/customers',
    label: 'Customers',
  },
  {
    href: '/invoices',
    label: 'Invoices',
  },
  {
    href: '/quotations',
    label: 'Quotations',
  },
];

export const steps = [
  {
    title: 'Step 01',
    subtitle: 'Create Your Account',
    description: 'Create your account and set up your business details.',
  },
  {
    title: 'Step 02',
    subtitle: 'Add Clients & Documents',
    description: 'Add your clients and create your first invoice or quotation.',
  },
  {
    title: 'Step 03',
    subtitle: 'Send & track Invoices',
    description: 'Send, track and manage everything from one dashboard',
  },
];

export const features = [
  {
    icon: FileText,
    title: 'Smart Invoicing',
    description:
      'Create professional invoices in minutes. Add items, taxes, discounts and due dates with ease.',
  },
  {
    icon: FilePen,
    title: 'Quotations Made Easy',
    description:
      'Send clear, polished quotations and turn them into invoices when approved. no double work.',
  },
  {
    icon: UserRoundPen,
    title: 'Client Management',
    description:
      'Store all your clients in one place. Reuse details instantly when creating invoices or quotes.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Invoice tracking',
    description:
      'See which invoices are sent, pending or paid at a glance. Stay in control always.',
  },
  {
    icon: RadioTower,
    title: 'Access Anywhere',
    description:
      'Manage your business from any device. Your data stays synced and secure.',
  },
];
