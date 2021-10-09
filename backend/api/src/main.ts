import Koa from 'koa';
import * as Router from '@koa/router';
import { initHealthChecks } from './health';

const app = new Koa();
const router = new Router();

initHealthChecks(router);

router.get('/', (ctx) => {
  ctx.body = 'Hello World Again!!';
});



app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
