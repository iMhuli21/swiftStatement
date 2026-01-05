import {
  FileText,
  FilePen,
  UserRoundPen,
  RadioTower,
  ChartNoAxesCombined,
  Users,
  Settings,
  Search,
} from 'lucide-react';

import { TbInvoice } from 'react-icons/tb';
import { AiOutlineDashboard } from 'react-icons/ai';

type Route = {
  href: string;
  label: string;
};

export const routes: Route[] = [
  {
    href: '/dashboard/clients',
    label: 'Clients',
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
  {
    href: '/dashboard/invoices',
    label: 'Invoices',
  },
  {
    href: '/dashboard/quotations',
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

export const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: AiOutlineDashboard,
    },
    {
      title: 'Clients',
      url: '/dashboard/clients',
      icon: Users,
    },
    {
      title: 'Invoices',
      url: '/dashboard/invoices',
      icon: FileText,
    },
    {
      title: 'Quotations',
      url: '/dashboard/quotations',
      icon: TbInvoice,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: Settings,
    },
    {
      title: 'Search',
      url: '/dashboard/search',
      icon: Search,
    },
  ],
};

export type Items = {
  itemDescription: string;
  qty: number;
  rate: number;
  total: number;
};

export const avatars = [
  'https://pc92dhkjxi.ufs.sh/f/8NNLpGsaQ1RnLUU0pEZkh31pATEdx0i7J9Df6jtreRn4Zm8N',
  'https://pc92dhkjxi.ufs.sh/f/8NNLpGsaQ1RnIqV0h0YhbHVDkEgwv2TX6ZL9cyMRzpOSWUut',
  'https://pc92dhkjxi.ufs.sh/f/8NNLpGsaQ1Rnn6MtQqGFXOqRy2JzGkamM4vwBogPhYEb6Z5N',
  'https://pc92dhkjxi.ufs.sh/f/8NNLpGsaQ1RnOPjwnB1BcxF2QjCWTtHRrI7MoPvGV5siE3wK',
];

export const maxItems = 10;

export const templates = [
  {
    value: 'template1',
    label: 'Template 1',
  },
  {
    value: 'template2',
    label: 'Template 2',
  },
];
