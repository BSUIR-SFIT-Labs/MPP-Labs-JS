import * as Router from 'koa-router';

export default class BaseController {
  router: Router;

  constructor() {
    this.router = new Router();
  }
}
