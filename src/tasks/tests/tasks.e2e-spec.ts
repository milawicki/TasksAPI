import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from 'src/app.module';
import { randomUUID } from 'crypto';

describe('Tasks API', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST /tasks', () => {
    it('should create a task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          name: 'Test Task',
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
          user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
        })
        .expect(201);
    });

    it('should return 400 if the task is invalid', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          name: 'Test Task',
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
          user_id: 'AAA',
        })
        .expect(400);
    });

    it('should return 400 when end date is not after start date', () => {
      const date = new Date().toISOString();

      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          name: 'Test Task',
          starts_at: date,
          ends_at: date,
          user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
        })
        .expect(400);
    });

    it('should return error when user exceeds the limit', async () => {
      const limit = +(process.env.CREATE_TASK_USER_RATE_LIMIT || 5);

      for (let i = 0; i < limit; i++) {
        await request(app.getHttpServer())
          .post('/tasks')
          .send({
            name: 'Test Task',
            starts_at: `2025-04-${i + 10}T10:00:00.000Z`,
            ends_at: `2025-04-${i + 10}T11:00:00.000Z`,
            user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
          })
          .expect(201);
      }

      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          name: 'Test Task',
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
          user_id: '3cfb30fb-fba2-41cc-aed6-482c3052e0cc',
        })
        .expect(429);
    });

    it('should return error when global limit is exceeded', async () => {
      const limit = +(process.env.CREATE_TASK_GLOBAL_RATE_LIMIT || 5);

      for (let i = 0; i < limit; i++) {
        await request(app.getHttpServer())
          .post('/tasks')
          .send({
            name: 'Test Task',
            starts_at: `2025-04-${i + 10}T10:00:00.000Z`,
            ends_at: `2025-04-${i + 10}T11:00:00.000Z`,
            user_id: randomUUID(),
          })
          .expect(201);
      }

      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          name: 'Test Task',
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
          user_id: randomUUID(),
        })
        .expect(429);
    });
  });
});
