import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedingService } from './seeding/seeding.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('SeedRunner');

  logger.log('Seeding application context created.');
  const seeder = app.get(SeedingService);

  try {
    await seeder.seed();
    logger.log('Seeding complete!');
  } catch (error) {
    logger.error('Seeding failed!');
    if (error instanceof Error) {
      logger.error(error.message, error.stack);
    } else {
      logger.error(error);
    }
  } finally {
    await app.close();
  }
}

void bootstrap();
