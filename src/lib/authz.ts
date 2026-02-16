import 'server-only';

const parseAdminEmails = (raw: string | undefined): string[] => {
  if (!raw) return [];
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const getAdminEmailAllowlist = (): string[] => {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL_ALLOWLIST;
  return parseAdminEmails(raw);
};

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;

  const allowlist = getAdminEmailAllowlist();
  if (allowlist.length === 0) return false;

  return allowlist.includes(email.toLowerCase());
};

