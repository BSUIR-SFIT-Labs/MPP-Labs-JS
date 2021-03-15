import * as Koa from 'koa';
import * as Router from 'koa-router';

import * as logger from 'koa-logger';

const app = new Koa();
const router = new Router();

// Hello world
router.get('/', async (ctx, next) => {
  ctx.body = { msg: 'Hello world' };

  await next();
});

// Middlewares
app.use(logger());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
