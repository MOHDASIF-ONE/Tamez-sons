export type ServiceIconName =
  "scan" | "brakes" | "oil" | "climate" | "battery" | "suspension";

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: ServiceIconName;
};

// These categories are proposed demo content and need confirmation from the shop.
export const services: Service[] = [
  {
    slug: "engine-diagnostics",
    title: "Engine diagnostics",
    shortDescription:
      "A diagnostic check can help narrow down a warning light or change in how your vehicle runs.",
    description:
      "A warning light, unusual sound, or change in performance can have several possible causes. Share what you have noticed and ask the shop which diagnostic options are available for your vehicle.",
    icon: "scan",
  },
  {
    slug: "brake-repair",
    title: "Brake repair",
    shortDescription:
      "Brake concerns can include noise, vibration, or a change in pedal feel.",
    description:
      "Brake concerns can show up as noise, vibration, or a change in pedal feel. Contact the shop to discuss the symptoms and confirm whether brake inspection or repair is available.",
    icon: "brakes",
  },
  {
    slug: "oil-maintenance",
    title: "Oil changes & maintenance",
    shortDescription:
      "Routine maintenance can be planned around your vehicle’s needs and service schedule.",
    description:
      "Oil and routine maintenance intervals vary by vehicle. Have your owner’s manual or service history nearby when you call so the shop can discuss what may be appropriate.",
    icon: "oil",
  },
  {
    slug: "air-conditioning",
    title: "Air conditioning",
    shortDescription:
      "A check can help investigate weak airflow, unusual smells, or warm air from the vents.",
    description:
      "Weak airflow, warm air, or unusual smells can have different causes. Describe what is happening and ask the shop about available air-conditioning diagnosis or service.",
    icon: "climate",
  },
  {
    slug: "battery-starting",
    title: "Battery & starting",
    shortDescription:
      "Slow starts or electrical symptoms may call for a closer look at the starting system.",
    description:
      "A slow start, dim lights, or a no-start condition may involve more than the battery. Contact the shop to ask which battery or starting-system checks it can provide.",
    icon: "battery",
  },
  {
    slug: "suspension-steering",
    title: "Suspension & steering",
    shortDescription:
      "Pulling, vibration, or a change in handling can be useful symptoms to describe.",
    description:
      "If the vehicle pulls, vibrates, or feels different while steering, note when it happens and share those details with the shop. Confirm directly whether the related inspection or repair is available.",
    icon: "suspension",
  },
];
