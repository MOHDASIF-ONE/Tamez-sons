"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const yearField = z.union([
  z.literal(""),
  z.string().regex(/^\d{4}$/, "Enter a four-digit year."),
]);

const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name.")
    .max(80, "Keep your name under 80 characters."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number.")
    .max(24, "Check the phone number length.")
    .regex(
      /^[0-9+().\-\s]+$/,
      "Use numbers and common phone punctuation only.",
    ),
  year: yearField,
  make: z.string().trim().max(40, "Keep the make under 40 characters."),
  model: z.string().trim().max(50, "Keep the model under 50 characters."),
  service: z.string(),
  description: z
    .string()
    .trim()
    .min(10, "Add a few details about the concern.")
    .max(1000, "Keep the description under 1,000 characters."),
  preferredContact: z.enum(["phone", "text"]),
});

type InquiryValues = z.infer<typeof inquirySchema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      year: "",
      make: "",
      model: "",
      service: "",
      description: "",
      preferredContact: "phone",
    },
  });

  const onSubmit = async () => {
    // Demo-only: do not transmit, log, or persist the entered customer details.
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    reset();
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="form-card">
      {submitted ? (
        <div className="form-success" role="status">
          <span className="success-icon">
            <Check aria-hidden="true" size={22} />
          </span>
          <p className="micro-label">Demo submission complete</p>
          <h2>No information was sent or saved.</h2>
          <p>
            This is only a website demonstration. Please call the shop directly
            to discuss a real vehicle concern.
          </p>
          <button
            className="text-link success-reset"
            onClick={() => setSubmitted(false)}
            type="button"
          >
            Send another demo inquiry{" "}
            <ArrowRight aria-hidden="true" size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="form-heading">
            <p className="micro-label">Repair inquiry</p>
            <h2>What can we help you ask about?</h2>
            <p>
              This form is for demonstration only. Do not enter real personal
              information; submissions are not sent to the repair shop.
            </p>
          </div>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
              <Field label="Your name" error={errors.name?.message}>
                <input
                  autoComplete="name"
                  id="your-name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "your-name-error" : undefined}
                />
              </Field>
              <Field label="Telephone number" error={errors.phone?.message}>
                <input
                  autoComplete="tel"
                  id="telephone-number"
                  inputMode="tel"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={
                    errors.phone ? "telephone-number-error" : undefined
                  }
                />
              </Field>
              <Field label="Vehicle year" error={errors.year?.message}>
                <input
                  id="vehicle-year"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="e.g. 2018"
                  {...register("year")}
                  aria-invalid={!!errors.year}
                  aria-describedby={
                    errors.year ? "vehicle-year-error" : undefined
                  }
                />
              </Field>
              <Field label="Vehicle make" error={errors.make?.message}>
                <input
                  id="vehicle-make"
                  placeholder="e.g. Toyota"
                  {...register("make")}
                  aria-invalid={!!errors.make}
                  aria-describedby={
                    errors.make ? "vehicle-make-error" : undefined
                  }
                />
              </Field>
              <Field label="Vehicle model" error={errors.model?.message}>
                <input
                  id="vehicle-model"
                  placeholder="e.g. Camry"
                  {...register("model")}
                  aria-invalid={!!errors.model}
                  aria-describedby={
                    errors.model ? "vehicle-model-error" : undefined
                  }
                />
              </Field>
              <Field label="Service category" error={errors.service?.message}>
                <select
                  id="service-category"
                  {...register("service")}
                  aria-invalid={!!errors.service}
                  aria-describedby={
                    errors.service ? "service-category-error" : undefined
                  }
                >
                  <option value="">Choose a category (optional)</option>
                  <option value="engine-diagnostics">Engine diagnostics</option>
                  <option value="brake-repair">Brake repair</option>
                  <option value="oil-maintenance">
                    Oil changes & maintenance
                  </option>
                  <option value="air-conditioning">Air conditioning</option>
                  <option value="battery-starting">Battery & starting</option>
                  <option value="suspension-steering">
                    Suspension & steering
                  </option>
                  <option value="other">Something else</option>
                </select>
              </Field>
              <Field
                className="field-wide"
                label="Describe the concern"
                error={errors.description?.message}
              >
                <textarea
                  id="describe-the-concern"
                  rows={4}
                  {...register("description")}
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description
                      ? "describe-the-concern-error"
                      : undefined
                  }
                />
              </Field>
              <fieldset className="contact-method field-wide">
                <legend>Preferred contact method</legend>
                <label>
                  <input
                    type="radio"
                    value="phone"
                    {...register("preferredContact")}
                  />{" "}
                  <span>Phone call</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="text"
                    {...register("preferredContact")}
                  />{" "}
                  <span>Text message</span>
                </label>
              </fieldset>
            </div>
            <button
              className="button button-dark form-submit"
              disabled={submitting}
              type="submit"
            >
              {submitting ? (
                <>
                  <LoaderCircle aria-hidden="true" className="spin" size={17} />
                  Preparing demo…
                </>
              ) : (
                <>
                  Request a callback <ArrowRight aria-hidden="true" size={17} />
                </>
              )}
            </button>
            <p className="form-privacy">
              Nothing in this demo form is transmitted or stored. Contact the
              shop by phone for a real inquiry.
            </p>
          </form>
        </>
      )}
    </div>
  );
}

function Field({
  children,
  className = "",
  error,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  error?: string;
  label: string;
}) {
  const id = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return (
    <div className={`field${className ? ` ${className}` : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children && (
        <div id={`${id}-control`} className="field-control">
          {children}
        </div>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
