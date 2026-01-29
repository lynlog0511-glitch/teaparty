import { getMessage } from '@/actions/messages';
import { LandingPage } from '@/components/modes/LandingPage';
import { NotYetRegistered } from '@/components/modes/NotYetRegistered';
import { GiftModeWrapper } from './GiftModeWrapper';
import { FortuneModeWrapper } from './FortuneModeWrapper';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = params?.id;

  // No ID -> Landing page
  if (!id) {
    return <LandingPage />;
  }

  // Fetch message from database
  const result = await getMessage(id);

  // Message not found -> Show "not yet registered" page
  if (!result.success || !result.data) {
    return <NotYetRegistered />;
  }

  const message = result.data;
  const isFirstVisit = message.firstOpenedAt === null;

  // First visit -> Gift Mode
  if (isFirstVisit) {
    return <GiftModeWrapper message={message} />;
  }

  // Already opened -> Fortune Mode
  return <FortuneModeWrapper message={message} />;
}
