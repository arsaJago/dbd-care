import { redirect } from 'next/navigation';

export default function ManageChecklistPage() {
  redirect('/admin/manage-content');
  return null;
}
