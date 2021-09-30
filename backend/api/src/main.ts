import Koa from 'koa';
import * as Router from '@koa/router';

const app = new Koa();
const router = new Router();

router.get('/run', (ctx) => {
  ctx.body = 'Hello World2';
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
