import { NextResponse } from 'next/server';
import { getCommandContacts, initDb } from '@/lib/db';
import { getAllGmailClients } from '@/lib/gmail';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST() {
  try {
    await initDb();
    const contacts = await getCommandContacts();
    const clients = await getAllGmailClients();

    if (clients.length === 0) {
      return NextResponse.json({ error: 'No Gmail accounts connected' }, { status: 400 });
    }

    const results: { name: string; email: string; sent: number; received: number; lastDate: string | null }[] = [];

    for (const contact of contacts) {
      const email = contact.email as string;
      const name = contact.name as string;
      if (!email && !name) continue;

      let totalSent = 0;
      let totalReceived = 0;
      let latestDate: Date | null = null;

      // Helper to get the latest date from the most recent message
      async function getLatestFromMessages(gmail: any, messages: any[]): Promise<Date | null> {
        if (messages.length === 0) return null;
        try {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id: messages[0].id!,
            format: 'metadata',
            metadataHeaders: ['Date'],
          });
          const dateHeader = msg.data.payload?.headers?.find((h: any) => h.name === 'Date');
          if (dateHeader?.value) return new Date(dateHeader.value);
        } catch {}
        return null;
      }

      // Track all unique message IDs to avoid double-counting across queries
      const seenIds = new Set<string>();

      for (const { gmail } of clients) {
        // Build search queries — search by email AND name
        const queries: { q: string; direction: 'sent' | 'received' }[] = [];
        if (email) {
          queries.push({ q: `to:${email} in:sent`, direction: 'sent' });
          queries.push({ q: `from:${email}`, direction: 'received' });
        }
        if (name) {
          // Always search by name too — catches emails where the contact field doesn't match
          queries.push({ q: `to:"${name}" in:sent`, direction: 'sent' });
          queries.push({ q: `from:"${name}"`, direction: 'received' });
        }

        for (const { q, direction } of queries) {
          try {
            const res = await gmail.users.messages.list({
              userId: 'me',
              q,
              maxResults: 100,
            });
            const messages = (res.data.messages || []).filter((m: any) => {
              if (seenIds.has(m.id)) return false;
              seenIds.add(m.id);
              return true;
            });

            if (direction === 'sent') totalSent += messages.length;
            else totalReceived += messages.length;

            const d = await getLatestFromMessages(gmail, messages);
            if (d && (!latestDate || d > latestDate)) latestDate = d;
          } catch {}
        }
      }

      const totalInteractions = totalSent + totalReceived;
      const lastDateStr = latestDate ? latestDate.toISOString().split('T')[0] : null;

      // Update the contact
      if (totalInteractions > 0) {
        const updateParts: string[] = [`times_contacted = ${totalInteractions}`];
        if (lastDateStr) {
          updateParts.push(`last_contact_date = '${lastDateStr}'`);
        }
        // Upgrade status if still 'cold' and we've had interaction
        const currentStatus = contact.status as string;
        if (currentStatus === 'cold' && totalReceived > 0) {
          updateParts.push(`status = 'replied'`);
        } else if (currentStatus === 'cold' && totalSent > 0) {
          updateParts.push(`status = 'emailed'`);
        }

        await db.execute({
          sql: `UPDATE contacts SET ${updateParts.join(', ')} WHERE id = ?`,
          args: [contact.id as number],
        });
      }

      results.push({
        name,
        email,
        sent: totalSent,
        received: totalReceived,
        lastDate: lastDateStr,
      });
    }

    return NextResponse.json({
      success: true,
      synced: results.length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
