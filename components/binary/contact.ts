const configuredContactUrl = process.env.NEXT_PUBLIC_CONTACT_URL?.trim() ?? '';
const hasAllowedProtocol = /^(?:https?:\/\/|mailto:)/i.test(configuredContactUrl);

export const CONTACT_HREF = hasAllowedProtocol ? configuredContactUrl : null;
export const CONTACT_IS_CONFIGURED = CONTACT_HREF !== null;
export const CONTACT_IS_EXTERNAL = CONTACT_HREF ? /^https?:\/\//i.test(CONTACT_HREF) : false;
export const CONTACT_TARGET = CONTACT_IS_EXTERNAL ? '_blank' : undefined;
export const CONTACT_REL = CONTACT_IS_EXTERNAL ? 'noopener noreferrer' : undefined;
