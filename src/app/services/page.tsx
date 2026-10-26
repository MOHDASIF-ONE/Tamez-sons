import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { ServiceGrid, Eyebrow } from "@/components/site-ui";
import { business } from "@/data/business";
import { canonicalMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Automotive Services",
  description:
    "Explore proposed maintenance and repair service categories for Tamez & Sons Auto Repair Services in Houston, Texas.",
  alternates: canonicalMetadata("/services"),
};

export default function ServicesPage() {
  return (
    <main>
      <section className="interior-hero interior-hero-dark">
        <div className="site-container interior-hero-content">
          <Eyebrow light>Service guide / Houston, Texas</Eyebrow>
          <h1 data-hero-heading>
            Services to
            <br />
            <span>ask about.</span>
          </h1>
          <p>
            Use these common automotive topics as a starting point for a
            conversation with the shop. Current service availability has not
            been confirmed.
          </p>
          <a className="button button-orange" href={business.phoneHref}>
            <Phone aria-hidden="true" size={16} /> Call the shop{" "}
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </div>
        <div aria-hidden="true" className="interior-hero-number">
          01<span>/ 06</span>
        </div>
      </section>
      <section className="section-pad services-detail-section">
        <div className="site-container">
          <div className="service-confirmation-note">
            <span className="status-dot" />
            <p>
              <strong>Proposed content.</strong> The categories below are based
              on the project brief and need confirmation from the business
              before publication.
            </p>
          </div>
          <ServiceGrid detailed />
        </div>
      </section>
      <section className="service-contact-strip">
        <div className="site-container service-contact-inner">
          <p>Have a different concern?</p>
          <span>
            Describe the symptoms and ask the shop what it can help with.
          </span>
          <Link className="text-link" href="/contact">
            Contact details <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
