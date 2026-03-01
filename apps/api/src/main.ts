//Server startup (Port, Swagger, CORS)
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import admin from "firebase-admin";
import serveraccount from "../../../vaulted-botany-445315-d7-firebase-adminsdk-1ls4c-08f87214f8.json";
import helmet from "helmet";
import "dotenv/config";

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert(serveraccount as any),
  });
  const app = await NestFactory.create(AppModule);

  // 1. Enable Helmet (Must be before other middleware)
  app.use(helmet());

  // 2. Enable Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 3. Enable Validation (Checks if email is email, number is number)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out extra data sent by hackers
    })
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  // 4. Enable CORS (Allows your Frontend to connect)
  app.enableCors({
    origin: true, // Change this to your Frontend URL later
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
}
bootstrap();
