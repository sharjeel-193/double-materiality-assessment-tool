import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:3000', // Your Next.js frontend URL
        credentials: true, // Allow cookies/credentials
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
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
