import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  CircleGauge,
  Disc3,
  Fan,
  Gauge,
  MoveRight,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { business } from "@/data/business";
import { services, type Service, type ServiceIconName } from "@/data/services";

const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  scan: CircleGauge,
  brakes: Disc3,
  oil: Wrench,
  climate: Fan,
  battery: BatteryCharging,
  suspension: Gauge,
};

export function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow${light ? "eyebrow-light" : ""}`}>
      <span aria-hidden="true" className="eyebrow-dot" />
      {children}
    </p>
  );
}

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const Icon = serviceIcons[service.icon];
  return (
    <article
      className="service-card"
      data-reveal
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <div className="service-card-top">
        <span className="service-icon">
          <Icon aria-hidden="true" size={22} strokeWidth={1.65} />
        </span>
        <span className="card-index">0{index + 1}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.shortDescription}</p>
      <Link className="text-link" href="/contact">
        Ask about this service <ArrowUpRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}

export function ServiceGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className={`service-grid${detailed ? "service-grid-detailed" : ""}`}>
      {services.map((service, index) => (
        <article
          className="service-card service-detail-card"
          data-reveal
          id={service.slug}
          key={service.slug}
        >
          <div className="service-card-top">
            {(() => {
              const Icon = serviceIcons[service.icon];
              return (
                <span className="service-icon">
                  <Icon aria-hidden="true" size={22} strokeWidth={1.65} />
                </span>
              );
            })()}
            <span className="card-index">0{index + 1}</span>
          </div>
          <h2>{service.title}</h2>
          <p>{detailed ? service.description : service.shortDescription}</p>
          {detailed && (
            <div className="service-detail-foot">
              <span>Proposed category · confirm availability</span>
              <Link
                aria-label={`Ask the shop about ${service.title}`}
                href="/contact"
              >
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          )}
          {!detailed && (
            <Link className="text-link" href="/contact">
              Ask about this service{" "}
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}

export function HoursPanel() {
  return (
    <section aria-labelledby="hours-heading" className="info-panel" data-reveal>
      <div className="info-panel-heading">
        <span className="info-icon">
          <span className="status-dot" />
        </span>
        <div>
          <p className="micro-label">Before you visit</p>
          <h2 id="hours-heading">Reported hours</h2>
        </div>
      </div>
      <div className="hours-list">
        {business.hours.map((item) => (
          <p key={item.days}>
            <span>{item.days}</span>
            <strong>{item.value}</strong>
          </p>
        ))}
      </div>
      <p className="fine-print">{business.hoursStatus}</p>
    </section>
  );
}

export function AddressPanel() {
  return (
    <section
      aria-labelledby="address-heading"
      className="info-panel address-panel"
      data-reveal
    >
      <div className="info-panel-heading">
        <span aria-hidden="true" className="info-icon address-symbol">
          01
        </span>
        <div>
          <p className="micro-label">Houston, Texas</p>
          <h2 id="address-heading">Find the shop</h2>
        </div>
      </div>
      <address>
        {business.address[0]}
        <br />
        {business.address[1]}
      </address>
      <p className="fine-print">{business.addressStatus}</p>
      <a
        className="text-link"
        href={business.directionsHref}
        rel="noreferrer"
        target="_blank"
      >
        Search in Google Maps <ArrowUpRight aria-hidden="true" size={16} />
      </a>
    </section>
  );
}

export function ContactBand() {
  return (
    <section className="contact-band">
      <div className="site-container contact-band-inner">
        <div>
          <Eyebrow light>Start with a conversation</Eyebrow>
          <h2>
            Tell the shop what
            <br className="desktop-break" /> your vehicle is doing.
          </h2>
        </div>
        <div className="contact-band-actions">
          <a className="button button-orange" href={business.phoneHref}>
            Call {business.phone} <ArrowUpRight aria-hidden="true" size={17} />
          </a>
          <Link className="button button-light-outline" href="/contact">
            Contact & location <MoveRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <ArrowDownRight
          aria-hidden="true"
          className="contact-band-decoration"
          strokeWidth={0.8}
        />
      </div>
    </section>
  );
}
