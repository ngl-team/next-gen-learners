import { NextResponse } from 'next/server';
import { initDb, getCommandContacts, getSyncState, setSyncState } from '@/lib/db';
import { getAllGmailClients } from '@/lib/gmail';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Extract email addresses from header strings like "Name <email@domain.com>"
function extractEmails(header: string): string[] {
  const matches = header.match(/[\w.+-]+@[\w.-]+\.\w+/g);
  return matches ? matches.map(e => e.toLowerCase()) : [];
}

export async function GET() {
  try {
    await initDb();
    const contacts = await getCommandContacts();
    const clients = await getAllGmailClients();

    if (clients.length === 0) {
      return NextResponse.json({ error: 'No Gmail connected' }, { status: 400 });
    }

    // Build email→contact lookup
    const emailToContact = new Map<string, any>();
    for (const c of contacts) {
      if (c.email) emailToContact.set((c.email as string).toLowerCase(), c);
    }

    let totalUpdated = 0;
    const updates: { contact: string; direction: string; subject: string; date: string }[] = [];

    for (const { user, gmail } of clients) {
      const historyKey = `gmail_history_${user}`;
      const lastHistoryId = await getSyncState(historyKey);

      if (!lastHistoryId) {
        // No history ID stored yet — get current profile to set baseline
        try {
          const profile = await gmail.users.getProfile({ userId: 'me' });
          if (profile.data.historyId) {
            await setSyncState(historyKey, profile.data.historyId);
          }
        } catch {}
        continue; // Skip this user on first run — backfill handles historical data
      }

      // Get history since last sync
      try {
        const history = await gmail.users.history.list({
          userId: 'me',
          startHistoryId: lastHistoryId,
          historyTypes: ['messageAdded'],
        });

        const historyRecords = history.data.history || [];
        let newHistoryId = history.data.historyId;

        for (const record of historyRecords) {
          const addedMessages = record.messagesAdded || [];
          for (const added of addedMessages) {
            const msgId = added.message?.id;
            if (!msgId) continue;

            try {
              const msg = await gmail.users.messages.get({
                userId: 'me',
                id: msgId,
                format: 'metadata',
                metadataHeaders: ['From', 'To', 'Subject', 'Date'],
              });

              const headers = msg.data.payload?.headers || [];
              const from = headers.find(h => h.name === 'From')?.value || '';
              const to = headers.find(h => h.name === 'To')?.value || '';
              const subject = headers.find(h => h.name === 'Subject')?.value || '';
              const dateStr = headers.find(h => h.name === 'Date')?.value || '';
              const labels = msg.data.labelIds || [];

              const fromEmails = extractEmails(from);
              const toEmails = extractEmails(to);
              const isSent = labels.includes('SENT');

              // Match against contacts
              const relevantEmails = isSent ? toEmails : fromEmails;
              for (const email of relevantEmails) {
                const contact = emailToContact.get(email);
                if (!contact) continue;

                const msgDate = dateStr ? new Date(dateStr) : new Date();
                const dateOnly = msgDate.toISOString().split('T')[0];
                const contactLastDate = contact.last_contact_date as string | null;

                // Only update if this is newer
                if (!contactLastDate || dateOnly >= contactLastDate) {
                  const updateParts = [
                    `last_contact_date = '${dateOnly}'`,
                    'times_contacted = times_contacted + 1',
                  ];

                  // If we received an email, upgrade status
                  if (!isSent && (contact.status === 'cold' || contact.status === 'emailed')) {
                    updateParts.push(`status = 'replied'`);
                  }

                  await db.execute({
                    sql: `UPDATE contacts SET ${updateParts.join(', ')} WHERE id = ?`,
                    args: [contact.id as number],
                  });

                  // Update in-memory contact so subsequent matches don't double-count
                  contact.last_contact_date = dateOnly;
                  contact.times_contacted = (contact.times_contacted as number) + 1;

                  totalUpdated++;
                  updates.push({
                    contact: contact.name as string,
                    direction: isSent ? 'sent' : 'received',
                    subject: subject.slice(0, 80),
                    date: dateOnly,
                  });
                }
              }
            } catch {
              // Skip individual message errors
            }
          }
        }

        // Save new history ID
        if (newHistoryId) {
          await setSyncState(historyKey, newHistoryId);
        }
      } catch (err: any) {
        // If historyId is too old, reset it
        if (err?.code === 404 || err?.response?.status === 404) {
          try {
            const profile = await gmail.users.getProfile({ userId: 'me' });
            if (profile.data.historyId) {
              await setSyncState(historyKey, profile.data.historyId);
            }
          } catch {}
        }
      }
    }

    return NextResponse.json({
      success: true,
      updated: totalUpdated,
      updates,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
