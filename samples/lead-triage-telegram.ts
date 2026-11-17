/**
 * Instant Lead Triage Telegram Webhook Push
 * Delivers qualified prospect details to engineering leads within seconds.
 *
 * @module B2BConsultancy/Automation
 * @author Gurpreet Bhamra | TFS Digital
 */

export interface LeadSubmission {
  name: string;
  company: string;
  email: string;
  budgetRange: string;
  projectScope: string;
}

export async function dispatchLeadNotification(lead: LeadSubmission): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('[Triage Engine] Missing Telegram credentials');
    return false;
  }

  const message = [
    `*[INBOUND LEAD] New Project Request*`,
    `\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-`,
    `*Client:* ${escapeMarkdownV2(lead.name)} \\(${escapeMarkdownV2(lead.company)}\\)`,
    `*Contact:* ${escapeMarkdownV2(lead.email)}`,
    `*Budget:* ${escapeMarkdownV2(lead.budgetRange)}`,
    `*Scope:* ${escapeMarkdownV2(lead.projectScope)}`,
  ].join('\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('[Triage Engine] Failed to dispatch webhook:', error);
    return false;
  }
}

function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}
