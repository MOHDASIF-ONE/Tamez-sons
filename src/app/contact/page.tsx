import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { AddressPanel, Eyebrow, HoursPanel } from "@/components/site-ui";
import { business } from "@/data/business";
import { canonicalMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Contact & Location",
  description:
    "Find the supplied contact and location details for Tamez & Sons Auto Repair Services in Houston. Confirm reference information with the shop.",
  alternates: canonicalMetadata("/contact"),
};

export default function ContactPage() {
  return (
    <main>
      <section className="interior-hero interior-hero-contact">
        <div className="site-container interior-hero-content">
          <Eyebrow light>Contact / Houston, Texas</Eyebrow>
          <h1 data-hero-heading>
            Start with a<br />
            <span>conversation.</span>
          </h1>
          <p>
            Call to describe a vehicle concern or ask which services may be
            available. This demo does not schedule appointments.
          </p>
          <a className="button button-orange" href={business.phoneHref}>
            <Phone aria-hidden="true" size={16} /> Call {business.phone}{" "}
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>
        <div className="contact-hero-side">
          <p>01 / DIRECT</p>
          <p>
            Call the shop to
            <br />
            confirm details
          </p>
        </div>
      </section>
      <section className="contact-details-section section-pad">
        <div className="site-container">
          <div className="reference-notice">
            <span className="status-dot" />
            <p>
              <strong>Reference details awaiting confirmation.</strong> Phone,
              address, and hours in this concept were supplied as starting
              points. Please confirm them directly with the business.
            </p>
          </div>
          <div className="contact-info-grid">
            <div className="contact-phone-card">
              <p className="micro-label">Telephone</p>
              <a className="contact-phone-number" href={business.phoneHref}>
                {business.phone}
                <ArrowUpRight aria-hidden="true" size={20} />
              </a>
              <p>{business.phoneStatus}</p>
              <a className="button button-dark" href={business.phoneHref}>
                <Phone aria-hidden="true" size={16} /> Call the shop
              </a>
            </div>
            <AddressPanel />
            <HoursPanel />
          </div>
          <div className="directions-note">
            <span className="micro-label">Directions</span>
            <p>
              Opens a Google Maps search for the supplied business name and
              address. It does not use a hard-coded coordinate.
            </p>
            <a
              className="text-link"
              href={business.directionsHref}
              rel="noreferrer"
              target="_blank"
            >
              Search directions <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>
        </div>
      </section>
      <section className="inquiry-section section-pad">
        <div className="site-container inquiry-layout">
          <div className="inquiry-intro">
            <Eyebrow>Demo / Repair inquiry</Eyebrow>
            <h2>
              Describe what
              <br />
              you’ve noticed.
            </h2>
            <p>
              The form demonstrates validation and a confirmation state. It is
              not connected to the repair shop or a backend.
            </p>
            <div className="inquiry-callout">
              <span className="status-dot" />
              <p>
                For an actual vehicle concern, call the shop directly. Do not
                enter real personal details in this demo.
              </p>
            </div>
            <Link className="text-link" href="/services">
              Review proposed service topics{" "}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
