import { google } from 'googleapis';
import { getOAuthToken, upsertOAuthToken } from './db';

export function getOAuth2Client() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return null;
  const baseUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${baseUrl}/api/auth/gmail/callback`
  );
}

export async function getGmailClient(user?: string) {
  // Try user-specific token first, then legacy
  const providers = user ? [`gmail:${user}`, 'gmail'] : ['gmail:ryan', 'gmail:brayan', 'gmail'];
  let token = null;
  let provider = '';
  for (const p of providers) {
    const t = await getOAuthToken(p);
    if (t && t.access_token) { token = t; provider = p; break; }
  }
  if (!token) return null;
  const oauth2 = getOAuth2Client();
  if (!oauth2) return null;
  oauth2.setCredentials({
    access_token: token.access_token as string,
    refresh_token: token.refresh_token as string,
    expiry_date: token.expiry ? new Date(token.expiry as string).getTime() : 0,
  });
  oauth2.on('tokens', async (newTokens) => {
    await upsertOAuthToken({
      provider,
      access_token: newTokens.access_token || token.access_token as string,
      refresh_token: newTokens.refresh_token || token.refresh_token as string,
      expiry: newTokens.expiry_date ? new Date(newTokens.expiry_date).toISOString() : token.expiry as string,
      email: token.email as string || '',
    });
  });
  return google.gmail({ version: 'v1', auth: oauth2 });
}

export async function getAllGmailClients(): Promise<{ user: string; gmail: ReturnType<typeof google.gmail> }[]> {
  const clients: { user: string; gmail: ReturnType<typeof google.gmail> }[] = [];
  for (const user of ['ryan', 'brayan']) {
    const token = await getOAuthToken(`gmail:${user}`);
    if (!token || !token.access_token) continue;
    const oauth2 = getOAuth2Client();
    if (!oauth2) continue;
    oauth2.setCredentials({
      access_token: token.access_token as string,
      refresh_token: token.refresh_token as string,
      expiry_date: token.expiry ? new Date(token.expiry as string).getTime() : 0,
    });
    const provider = `gmail:${user}`;
    oauth2.on('tokens', async (newTokens) => {
      await upsertOAuthToken({
        provider,
        access_token: newTokens.access_token || token.access_token as string,
        refresh_token: newTokens.refresh_token || token.refresh_token as string,
        expiry: newTokens.expiry_date ? new Date(newTokens.expiry_date).toISOString() : token.expiry as string,
        email: token.email as string || '',
      });
    });
    clients.push({ user, gmail: google.gmail({ version: 'v1', auth: oauth2 }) });
  }
  return clients;
}

export async function sendEmail(to: string, subject: string, body: string) {
  const gmail = await getGmailClient();
  if (!gmail) throw new Error('Gmail not connected');
  const raw = Buffer.from(
    `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}`
  ).toString('base64url');
  await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
}

export async function sendEmailAsUser(
  user: string,
  to: string,
  subject: string,
  body: string,
  options?: { threadId?: string; messageId?: string; references?: string }
) {
  const gmail = await getGmailClient(user);
  if (!gmail) throw new Error(`Gmail not connected for ${user}`);

  let headers = `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n`;
  if (options?.messageId) {
    headers += `In-Reply-To: ${options.messageId}\r\n`;
    headers += `References: ${options.references || options.messageId}\r\n`;
  }
  headers += `\r\n${body}`;

  const raw = Buffer.from(headers).toString('base64url');
  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw, threadId: options?.threadId },
  });
  return result.data;
}
