import * as Koa from 'koa';

import * as logger from 'koa-logger';
import * as bodyParser from 'koa-bodyparser';
import * as staticFiles from 'koa-static';
import * as cors from '@koa/cors';
import * as jwt from 'koa-jwt';
import configureDatabaseConnection from '../persistence/dbConfig';
import BaseController from './controllers/base.controller';

export default class Server {
  private readonly app: Koa;
  private readonly controllers: BaseController[];

  constructor(controllers: BaseController[]) {
    this.app = new Koa();
    this.controllers = controllers;
  }

  private loadControllers() {
    this.controllers.forEach((controller) => {
      this.app.use(controller.router.routes());
      this.app.use(controller.router.allowedMethods());
    });
  }

  public async configure(): Promise<void> {
    await configureDatabaseConnection();

    // Middlewares
    this.app.use(cors());
    this.app.use(
      jwt({ secret: 'fcfe7f47-193e-41d8-814d-3c5985ee2832' }).unless({
        path: [/^\/user/, /^\/upload*/],
      }),
    );
    this.app.use(logger());
    this.app.use(bodyParser());
    this.app.use(staticFiles(__dirname + '/static'));

    // Controllers
    this.loadControllers();
  }

  public start(): void {
    this.app.listen(parseInt(process.env.NODE_LOCAL_PORT), () => {
      console.log('Server running on port ' + process.env.NODE_LOCAL_PORT);
    });
  }
}
