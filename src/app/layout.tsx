import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/app-providers";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { business } from "@/data/business";
import { canonicalMetadata } from "@/lib/metadata";
import "./globals.css";
import "./professional.css";

export const metadata: Metadata = {
  title: {
    default: "Tamez & Sons Auto Repair Services | Houston, Texas",
    template: "%s | Tamez & Sons Auto Repair Services",
  },
  description:
    "An independent website concept for Tamez & Sons Auto Repair Services in Houston, Texas. Explore proposed service topics and find contact details.",
  alternates: canonicalMetadata("/"),
  openGraph: {
    type: "website",
    title: "Tamez & Sons Auto Repair Services | Houston, Texas",
    description:
      "An independent website concept for a Houston automotive repair business.",
    siteName: "Tamez & Sons Auto Repair Services",
  },
  twitter: {
    card: "summary",
    title: "Tamez & Sons Auto Repair Services | Houston, Texas",
    description:
      "An independent website concept for a Houston automotive repair business.",
  },
};

export const viewport: Viewport = {
  themeColor: "#13171d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <AppProviders>
          <SiteHeader />
          <div id="main-content">{children}</div>
          <SiteFooter />
          <script
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "AutoRepair",
                name: business.name,
              }).replace(/</g, "\\u003c"),
            }}
            type="application/ld+json"
          />
        </AppProviders>
      </body>
    </html>
  );
}
