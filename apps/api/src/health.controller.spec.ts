import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { afterAll, beforeAll, describe, it } from "vitest";
import request from "supertest";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let moduleRef: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
  });

  it("reports API readiness", async () => {
    await request(app.getHttpServer())
      .get("/api/health")
      .expect(200)
      .expect({ status: "ok", service: "socia-api" });
  });
});
