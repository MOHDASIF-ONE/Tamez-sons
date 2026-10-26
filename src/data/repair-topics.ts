export type RepairTopic =
  | "overview"
  | "engine"
  | "brakes"
  | "maintenance"
  | "climate"
  | "battery"
  | "suspension";

export const repairTopics = [
  {
    id: "engine",
    number: "01",
    label: "Engine diagnostics",
    short: "Engine",
    slug: "engine-diagnostics",
    title: "Start beneath the hood.",
    description:
      "A warning light or a change in how your engine runs? Describe what you’ve noticed and ask about the diagnostic options available for your vehicle.",
    parts: ["Engine assembly", "Cylinder head", "Ignition components"],
    motion:
      "The hood opens and the engine components lift apart to reveal the assembly.",
  },
  {
    id: "brakes",
    number: "02",
    label: "Brake repair",
    short: "Brakes",
    slug: "brake-repair",
    title: "A closer look at stopping.",
    description:
      "Noise, vibration, or a change in pedal feel gives the shop a useful starting point. Call to discuss your symptoms and ask about brake inspection or repair.",
    parts: ["Wheel & hub", "Brake rotor", "Caliper & pads"],
    motion:
      "The wheel, brake rotor, and caliper separate along the axle, then fit back together.",
  },
  {
    id: "maintenance",
    number: "03",
    label: "Oil & maintenance",
    short: "Maintenance",
    slug: "oil-maintenance",
    title: "The small things add up.",
    description:
      "Routine maintenance starts with your vehicle’s service schedule. Keep your owner’s manual or service history nearby when you call the shop.",
    parts: ["Oil filter", "Engine cover", "Service access"],
    motion:
      "The hood opens and the oil filter moves out from the engine for a closer look.",
  },
  {
    id: "climate",
    number: "04",
    label: "Air conditioning",
    short: "A/C",
    slug: "air-conditioning",
    title: "Follow the cooling system.",
    description:
      "Warm air, weak airflow, or an unusual smell? Explain when it happens and ask which air-conditioning checks the shop can provide.",
    parts: ["A/C compressor", "Condenser", "Cooling lines"],
    motion:
      "The compressor and front heat exchanger move away from their fitted positions.",
  },
  {
    id: "battery",
    number: "05",
    label: "Battery & starting",
    short: "Battery",
    slug: "battery-starting",
    title: "Find your starting point.",
    description:
      "A slow start, dim lights, or a no-start concern can involve more than the battery. Ask the shop about battery and starting-system checks.",
    parts: ["12V battery", "Battery terminals", "Starter motor"],
    motion:
      "A conventional 12V battery and starter lift out of the engine bay.",
  },
  {
    id: "suspension",
    number: "06",
    label: "Suspension & steering",
    short: "Suspension",
    slug: "suspension-steering",
    title: "Look beyond the wheel.",
    description:
      "Pulling, vibration, or a change in handling are useful symptoms to share. Note when they happen and confirm the related inspection options with the shop.",
    parts: ["Spring & strut", "Steering link", "Wheel assembly"],
    motion:
      "The wheel and suspension strut move apart to reveal their connection to the chassis.",
  },
] as const;

export const overviewTopic = {
  id: "overview",
  number: "00",
  label: "Full inspection",
  short: "Overview",
  slug: "",
  title: "See how it all fits.",
  description:
    "Every vehicle concern starts somewhere. Explore the assemblies, see the parts come together, and find the right topic for your conversation with Tamez & Sons.",
  parts: ["Explore a system", "Drag to rotate", "Watch parts fit"],
  motion:
    "An illustrative engine, brake, battery, and suspension assembly opens for inspection.",
} as const;
