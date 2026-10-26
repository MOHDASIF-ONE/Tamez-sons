import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BatteryCharging,
  Disc3,
  Droplets,
  Gauge,
  MapPin,
  Phone,
  ScanLine,
  Snowflake,
} from "lucide-react";
import RepairExperience, {
  MechanicalStory,
} from "@/components/repair/repair-experience";
import ScrollReveals from "@/components/repair/scroll-reveals";
import { business } from "@/data/business";
import { services } from "@/data/services";

const icons = {
  scan: ScanLine,
  brakes: Disc3,
  oil: Droplets,
  climate: Snowflake,
  battery: BatteryCharging,
  suspension: Gauge,
};

export default function Home() {
  return (
    <main className="home-page">
      <ScrollReveals />
      <RepairExperience />

      <section className="home-services" id="services">
        <div className="site-container">
          <div className="home-section-heading">
            <div>
              <p className="section-kicker">
                <span /> Care for the whole car
              </p>
              <h2>
                Whatever
                <br />
                <span>brings you in.</span>
              </h2>
            </div>
            <div className="home-heading-aside">
              <p>
                A warning light. A change in how it drives. Or simply time for a
                little attention. Find your starting point.
              </p>
              <Link className="text-link" href="/services">
                Explore all services <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <div className="home-service-grid">
            {services.map((service, index) => {
              const Icon = icons[service.icon];
              return (
                <Link
                  className={
                    index === 0
                      ? "home-service-card featured"
                      : "home-service-card"
                  }
                  href={`/services#${service.slug}`}
                  key={service.slug}
                >
                  <div className="home-service-card-top">
                    <span className="service-card-symbol">
                      <Icon size={25} strokeWidth={1.4} />
                    </span>
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.shortDescription}</p>
                  <span className="service-card-bottom">
                    <span>Let’s take a closer look</span>
                    <ArrowUpRight size={19} />
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="home-service-note">
            Service categories are illustrative. Call the shop to confirm
            availability for your vehicle.
          </p>
        </div>
      </section>

      <section className="workshop-section" id="shop">
        <div className="site-container workshop-layout">
          <div className="workshop-image">
            <Image
              src="/images/workshop.jpg"
              alt="A mechanic carefully working on an engine in a workshop. Illustrative photography."
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
            />
            <div className="workshop-photo-caption glass-surface">
              <span className="status-dot" />
              <span>The work is in the details.</span>
              <WrenchMark />
            </div>
            <span className="workshop-image-credit">
              Illustrative workshop photography · Artem Podrez / Pexels
            </span>
          </div>
          <div className="workshop-copy">
            <p className="section-kicker">
              <span /> The human side of repair
            </p>
            <h2>
              A real conversation.
              <br />
              <span>A clear next step.</span>
            </h2>
            <p className="workshop-intro">
              You know how your car usually feels. When something changes,
              that’s a good place to start. Tell Tamez &amp; Sons what you’ve
              noticed.
            </p>
            <div className="workshop-steps">
              <article>
                <span>01</span>
                <div>
                  <h3>Tell us what changed.</h3>
                  <p>
                    A sound, a warning light, or the way it handles. Every
                    detail helps start the conversation.
                  </p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <h3>Talk through the options.</h3>
                  <p>
                    Ask about available inspections and services for your
                    vehicle’s year, make and model.
                  </p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <h3>Plan your visit.</h3>
                  <p>
                    Confirm the location, hours and next steps directly with the
                    shop before you head over.
                  </p>
                </div>
              </article>
            </div>
            <a className="button button-dark" href={business.phoneHref}>
              Start a conversation <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <MechanicalStory />

      <section className="visit-section" id="contact">
        <div className="site-container">
          <div className="home-section-heading">
            <div>
              <p className="section-kicker">
                <span /> In your neighborhood
              </p>
              <h2>
                Houston roads.
                <br />
                <span>A local connection.</span>
              </h2>
            </div>
            <p className="home-heading-aside">
              Your next step starts with a call. Talk to the shop about your
              vehicle and confirm a good time to visit.
            </p>
          </div>
          <div className="visit-grid">
            <a className="visit-card" href={business.phoneHref}>
              <span className="visit-icon">
                <Phone size={21} />
              </span>
              <p>Give the shop a call</p>
              <h3>{business.phone}</h3>
              <span className="visit-card-bottom">
                Let’s talk about your car <ArrowUpRight size={19} />
              </span>
            </a>
            <a
              className="visit-card"
              href={business.directionsHref}
              target="_blank"
              rel="noreferrer"
            >
              <span className="visit-icon">
                <MapPin size={22} />
              </span>
              <p>Come find us</p>
              <h3>
                {business.address[0]}
                <br />
                <span>{business.address[1]}</span>
              </h3>
              <span className="visit-card-bottom">
                Get directions <ArrowUpRight size={19} />
              </span>
            </a>
            <div className="visit-card visit-hours">
              <span className="visit-icon">
                <Gauge size={22} />
              </span>
              <p>Reported shop hours</p>
              <h3>
                Monday — Friday
                <br />
                <span>9:00 AM — 6:00 PM</span>
              </h3>
              <span className="visit-card-bottom">
                Please call to confirm before visiting.
              </span>
            </div>
          </div>
          <p className="visit-note">
            Contact details and hours are supplied reference information.
            Confirm directly with the business.
          </p>
        </div>
      </section>
      <section className="contact-band">
        <div className="site-container contact-band-inner">
          <div>
            <p className="section-kicker">Tamez &amp; Sons · Houston, Texas</p>
            <h2>
              Let’s keep
              <br />
              <span>you moving.</span>
            </h2>
          </div>
          <div className="contact-band-cta">
            <a className="button button-acid" href={business.phoneHref}>
              Call {business.phone} <ArrowUpRight size={18} />
            </a>
            <Link href="/contact">
              All contact details <ArrowDown size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function WrenchMark() {
  return <Disc3 size={22} aria-hidden="true" />;
}
