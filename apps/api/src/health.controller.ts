import { Controller, Get } from "@nestjs/common";

export type ApiHealth = {
  status: "ok";
  service: "panokit-api";
};

@Controller("health")
export class HealthController {
  @Get()
  status(): ApiHealth {
    return { status: "ok", service: "panokit-api" };
  }
}
