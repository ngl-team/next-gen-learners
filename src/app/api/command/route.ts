import { NextResponse } from 'next/server';
import { getCommandContacts, getOverdueFollowups, getGoingCold, getQuickLogs, getBrainDumps, getActivityByPerson, getShelvedContacts } from '@/lib/db';

export async function GET() {
  try {
    const [contacts, overdue, goingCold, quickLogs, brainDumps, brayanActivity, ryanActivity, shelved] = await Promise.all([
      getCommandContacts(),
      getOverdueFollowups(),
      getGoingCold(5),
      getQuickLogs(20),
      getBrainDumps(10),
      getActivityByPerson('brayan', 15),
      getActivityByPerson('ryan', 15),
      getShelvedContacts(),
    ]);

    // Split contacts by priority
    const highTouch = contacts.filter((c: any) => c.priority === 'high-touch');
    const activeDeals = contacts.filter((c: any) => c.priority === 'active-deal');
    const pipeline = contacts.filter((c: any) => c.priority === 'pipeline' || !c.priority);

    // Contacts needing approval (high-touch with overdue follow-ups)
    const needsApproval = overdue.filter((c: any) => c.priority === 'high-touch');
    // Auto-sendable (pipeline contacts with overdue follow-ups)
    const autoSendable = overdue.filter((c: any) => c.priority !== 'high-touch');

    return NextResponse.json({
      briefing: {
        needsApproval,
        autoSendable,
        goingCold,
        overdueCount: overdue.length,
      },
      contacts: { highTouch, activeDeals, pipeline, all: contacts, shelved },
      quickLogs,
      brainDumps,
      activity: { brayan: brayanActivity, ryan: ryanActivity },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
