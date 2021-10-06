import Koa from 'koa';
import * as Router from '@koa/router';

const app = new Koa();
const router = new Router();

router.get('/health', (ctx) => {
  ctx.body = 'OK';
});

router.get('/run', (ctx) => {
  ctx.body = 'Hello World4';
});

router.get('/', (ctx) => {
  ctx.body = 'Hello World';
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
