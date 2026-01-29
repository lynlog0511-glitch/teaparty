import { getMessage } from '@/actions/messages';
import { SetupMode } from '@/components/modes/SetupMode';
import { AlreadyRegistered } from '@/components/modes/AlreadyRegistered';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SetupPage({ params }: PageProps) {
  const { id } = await params;

  // Check if message already exists
  const result = await getMessage(id);

  // Already registered -> show "already done" page
  if (result.success && result.data) {
    return <AlreadyRegistered id={id} />;
  }

  // Not registered yet -> show setup form
  return <SetupMode id={id} />;
}
