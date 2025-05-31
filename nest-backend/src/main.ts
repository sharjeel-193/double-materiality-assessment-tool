import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // ✅ This is crucial for GraphQL
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    await app.listen(4000);
}
bootstrap();
