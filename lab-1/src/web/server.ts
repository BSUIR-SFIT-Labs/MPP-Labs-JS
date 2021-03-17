import * as Koa from 'koa';

import * as logger from 'koa-logger';
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
    this.app.use(logger());

    // Controllers
    this.loadControllers();
  }

  public start(): void {
    this.app.listen(parseInt(process.env.NODE_LOCAL_PORT), () => {
      console.log('Server running on port ' + process.env.NODE_LOCAL_PORT);
    });
  }
}
