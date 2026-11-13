import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS, authentification et route serverless Vercel à configurer avant DEV.
  await app.listen(Number(process.env.PORT ?? 3001), "0.0.0.0");
}

bootstrap().catch((error: unknown) => {
  console.error("Unable to start PANOKIT API", error);
  process.exitCode = 1;
});
