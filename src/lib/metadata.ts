export function canonicalMetadata(pathname: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;
  try {
    return { canonical: new URL(pathname, siteUrl) };
  } catch {
    return undefined;
  }
}
