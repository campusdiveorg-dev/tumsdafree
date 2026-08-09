export const dynamic = 'force-dynamic';

import ContentTableClient from '@/components/admin/ContentTableClient';

export default function Page({ params }: { params: { table: string } }) {
  return <ContentTableClient table={params?.table} />;
}
