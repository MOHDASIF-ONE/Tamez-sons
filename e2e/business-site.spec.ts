import { expect, test, type Page } from "@playwright/test";

async function openBay(page: Page) {
  await page.goto("/");
  const canvas = page.locator(".repair-canvas canvas");
  await expect(canvas).toBeVisible({ timeout: 60000 });
  await expect(canvas).toHaveAttribute("data-ready", "true", {
    timeout: 60000,
  });
  return canvas;
}

async function scrollStory(page: Page, progress: number) {
  await page.evaluate((p) => {
    const element = document.querySelector<HTMLElement>(".mechanical-story")!;
    window.scrollTo({
      top: element.offsetTop + (element.offsetHeight - innerHeight) * p,
      behavior: "instant",
    });
  }, progress);
}

test("detailed vehicle loads locally with repair context and automatic controls", async ({
  page,
}) => {
  const errors: string[] = [];
  const media: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().includes("/media/")) media.push(request.url());
  });
  const canvas = await openBay(page);
  await expect(canvas).toHaveAttribute("data-model", "detailed-gltf");
  await expect(page.locator(".home-service-card")).toHaveCount(6);
  expect(
    await page
      .locator(".site-header")
      .evaluate((element) => getComputedStyle(element).backdropFilter),
  ).toContain("blur");
  expect(
    await page.evaluate(
      () =>
        document.querySelector<HTMLElement>(".home-services")!.offsetTop <
        document.querySelector<HTMLElement>(".mechanical-story")!.offsetTop,
    ),
  ).toBe(true);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.triangles)))
    .toBeGreaterThan(100000);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Auto care.*Down to.*the detail/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: /play sequence|play repair|fit parts|pause repair/i,
    }),
  ).toHaveCount(0);
  await expect(page.getByRole("slider")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Let’s talk repairs/ }),
  ).toHaveAttribute("href", "tel:+17139262778");
  expect(media).toEqual([]);
  expect(errors).toEqual([]);
});

test("hover automatically separates real wheel geometry and leaving fits it back", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const canvas = await openBay(page);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.separation)), {
      timeout: 20000,
    })
    .toBeLessThan(0.02);
  const before = await canvas.screenshot();
  await expect(canvas).toHaveAttribute("data-bonnet-angle", "0.00");
  await expect(canvas).toHaveAttribute("data-engine-lift", "0.000");
  expect(
    Number(await canvas.getAttribute("data-engine-parts")),
  ).toBeGreaterThan(100);
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.separation)), {
      timeout: 20000,
    })
    .toBeGreaterThan(0.75);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.bonnetAngle)), {
      timeout: 20000,
    })
    .toBeGreaterThan(60);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.engineLift)), {
      timeout: 20000,
    })
    .toBeGreaterThan(0.14);
  expect(before.equals(await canvas.screenshot())).toBe(false);
  await page.mouse.move(5, 5);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.separation)), {
      timeout: 20000,
    })
    .toBeLessThan(0.05);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.bonnetAngle)), {
      timeout: 20000,
    })
    .toBeLessThan(1);
  await expect(canvas).toHaveAttribute("data-engine-lift", "0.000");
});

test("scrolling alone animates the car without clicking or hovering", async ({
  page,
}) => {
  const canvas = await openBay(page);
  await page.mouse.move(5, 5);
  await page.evaluate(() => window.scrollTo({ top: 230, behavior: "instant" }));
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.scroll)), {
      timeout: 15000,
    })
    .toBeGreaterThan(0.2);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.separation)), {
      timeout: 20000,
    })
    .toBeGreaterThan(0.3);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.bonnetAngle)), {
      timeout: 20000,
    })
    .toBeGreaterThan(25);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.engineLift)), {
      timeout: 20000,
    })
    .toBeGreaterThan(0);
});

test("scroll reveals and reassembles brake, piston and suspension geometry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openBay(page);
  const canvas = page.locator(".mechanical-visual canvas");
  await scrollStory(page, 0.16);
  await expect(canvas).toHaveAttribute("data-ready", "true", {
    timeout: 60000,
  });
  await expect(canvas).toHaveAttribute("data-chapter", "0");
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.separation)), {
      timeout: 20000,
    })
    .toBeGreaterThan(0.65);
  const brake = await canvas.screenshot();
  await scrollStory(page, 0.32);
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.separation)), {
      timeout: 20000,
    })
    .toBeLessThan(0.25);
  await scrollStory(page, 0.5);
  await expect(canvas).toHaveAttribute("data-chapter", "1");
  await expect(
    page.getByRole("heading", { name: /Small details.*Moving you/ }),
  ).toBeVisible({ timeout: 30000 });
  await expect
    .poll(() => canvas.evaluate((el) => Number(el.dataset.separation)), {
      timeout: 20000,
    })
    .toBeGreaterThan(0.65);
  expect(brake.equals(await canvas.screenshot())).toBe(false);
  await scrollStory(page, 0.83);
  await expect(canvas).toHaveAttribute("data-chapter", "2");
  await expect(
    page.getByRole("heading", { name: /Connected.*To the road/ }),
  ).toBeVisible();
  await expect(page.locator(".mechanical-part-list")).toContainText(
    "Coil spring",
  );
});

test("reduced motion keeps vehicle still and service chapters readable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const canvas = await openBay(page);
  await expect(page.locator(".repair-canvas")).toHaveAttribute(
    "data-motion",
    "reduced",
  );
  await page.locator(".repair-bay").hover();
  await expect(canvas).toHaveAttribute("data-separation", "0.000");
  await expect(canvas).toHaveAttribute("data-bonnet-angle", "0.00");
  await expect(canvas).toHaveAttribute("data-engine-lift", "0.000");
  await scrollStory(page, 0.5);
  await expect(
    page.getByRole("heading", { name: /Small details.*Moving you/ }),
  ).toBeVisible({ timeout: 30000 });
  await expect(page.locator(".mechanical-visual canvas")).toHaveAttribute(
    "data-separation",
    "0.350",
    { timeout: 30000 },
  );
});

for (const width of [1440, 768, 390, 360]) {
  test(`automatic 3D sections fit a ${width}px viewport and preserve scrolling`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const canvas = await openBay(page);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(
      await canvas.evaluate((el) => getComputedStyle(el).touchAction),
    ).toBe("pan-y");
    await scrollStory(page, 0.5);
    await expect(page.locator(".mechanical-story")).toHaveAttribute(
      "data-chapter",
      "1",
      { timeout: 30000 },
    );
    await expect(
      page.getByRole("heading", { name: /Small details.*Moving you/ }),
    ).toBeInViewport({ timeout: 30000 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}

test("mobile navigation works from the repair bay and restores focus with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openBay(page);
  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).not.toBeVisible();
});

test("business routes, service anchors, phone, and directions remain available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openBay(page);
  for (const [label, path, heading] of [
    ["Services", "/services", /services to ask about/i],
    ["About", "/about", /rooted in a houston address/i],
    ["Contact", "/contact", /start with a conversation/i],
  ] as const) {
    await page
      .getByRole("navigation")
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  }
  await expect(
    page.getByRole("link", { name: /Call the shop/ }).first(),
  ).toHaveAttribute("href", "tel:+17139262778");
  await expect(
    page.getByRole("link", { name: "Search directions" }),
  ).toHaveAttribute("href", /google\.com\/maps\/search/);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await page
    .locator(".home-service-card")
    .filter({
      has: page.getByRole("heading", {
        name: "Engine diagnostics",
        exact: true,
      }),
    })
    .click();
  await expect(page).toHaveURL(/\/services#engine-diagnostics$/);
  await expect(page.locator("#engine-diagnostics")).toBeInViewport();
});

test("business pages retain readable narrow phone and tablet layouts", async ({
  page,
}) => {
  test.setTimeout(60000);
  for (const width of [360, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ["/services", "/about", "/contact"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${path} at ${width}`,
      ).toBeLessThanOrEqual(width);
    }
  }
});

test("inquiry validates and completes locally without sending information", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await page.goto("/contact");
  await page.getByRole("button", { name: /request a callback/i }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await expect(page.getByText("Enter a phone number.")).toBeVisible();
  await expect(
    page.getByText("Add a few details about the concern."),
  ).toBeVisible();
  await page.getByLabel("Your name").fill("Alex Test");
  await page.getByLabel("Telephone number").fill("7135550100");
  await page.getByLabel("Service category").selectOption("brake-repair");
  await page
    .getByLabel("Describe the concern")
    .fill("Synthetic test data for a brake noise inquiry.");
  await page.getByRole("button", { name: /request a callback/i }).click();
  await expect(page.getByRole("status")).toContainText(
    "No information was sent or saved.",
  );
  expect(posts).toEqual([]);
});
