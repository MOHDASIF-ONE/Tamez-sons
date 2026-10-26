import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/site-ui";
import { business } from "@/data/business";
import { canonicalMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "About",
  description:
    "About this independent website concept for Tamez & Sons Auto Repair Services in Houston, Texas.",
  alternates: canonicalMetadata("/about"),
};

export default function AboutPage() {
  return (
    <main>
      <section className="interior-hero interior-hero-dark">
        <div className="site-container interior-hero-content">
          <Eyebrow light>About / An independent concept</Eyebrow>
          <h1 data-hero-heading>
            Rooted in a<br />
            <span>Houston address.</span>
          </h1>
          <p>
            A proposed digital front door for a local automotive repair
            business, designed to make service information and direct contact
            easier to find.
          </p>
          <Link className="button button-light-outline" href="/contact">
            View contact details <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div aria-hidden="true" className="interior-hero-number">
          TX<span>77011</span>
        </div>
      </section>
      <section className="about-story-section section-pad">
        <div className="site-container about-story-grid">
          <div className="about-story-label">
            <Eyebrow>Built around clarity</Eyebrow>
            <div className="about-line-art">
              <span>T</span>
              <i>&amp;</i>
              <span>S</span>
            </div>
          </div>
          <div className="about-story-copy">
            <h2>A helpful first impression should be simple.</h2>
            <p>
              This website concept introduces Tamez &amp; Sons Auto Repair
              Services as an automotive repair and maintenance business in
              Houston, Texas. It gives visitors a place to review proposed
              service topics, find the supplied phone and address references,
              and decide how to make contact.
            </p>
            <p>
              Business history, current services, hours, and contact details
              should be confirmed with the shop before the concept is used
              publicly. No founding year, family history, certification,
              customer promise, or review has been added here.
            </p>
            <Link className="text-link" href="/services">
              Explore service topics <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="about-values-section">
        <div className="site-container about-values-grid">
          <article>
            <span className="about-value-icon">
              <MapPin aria-hidden="true" size={19} />
            </span>
            <p className="micro-label">01 / Local</p>
            <h2>Useful location details</h2>
            <p>
              Address and directions are easy to reach, with a reminder to
              confirm the reference information first.
            </p>
          </article>
          <article>
            <span className="about-value-icon">
              <ShieldCheck aria-hidden="true" size={19} />
            </span>
            <p className="micro-label">02 / Clear</p>
            <h2>Facts kept in view</h2>
            <p>
              Proposed service categories and reported hours are labeled so the
              demo does not present them as confirmed.
            </p>
          </article>
          <article>
            <span className="about-value-icon">
              <Phone aria-hidden="true" size={19} />
            </span>
            <p className="micro-label">03 / Direct</p>
            <h2>A simple next step</h2>
            <p>
              Telephone links make it easy to contact the shop from a device
              that can place calls.
            </p>
          </article>
        </div>
      </section>
      <section className="concept-disclosure">
        <div className="site-container">
          <p className="micro-label">Concept disclosure</p>
          <p>
            {business.websiteConceptNotice} Business details on this demo come
            from initial reference material and still need confirmation.
          </p>
        </div>
      </section>
    </main>
  );
}
