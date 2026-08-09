export const dynamic = 'force-dynamic';

import ContentTableClient from '@/components/admin/ContentTableClient';
import { notFound } from 'next/navigation';

const VALID_TABLES = [
  'departments',
  'ministries',
  'leadership',
  'sermons',
  'events',
  'weekly_meetings',
  'resources',
  'missions',
  'announcements',
  'word_of_the_day',
  'sabbath_gallery',
];

export default function Page({ params }: { params: { table: string } }) {
  if (!params?.table || !VALID_TABLES.includes(params.table)) {
    notFound();
  }

  return <ContentTableClient table={params.table} />;
}
