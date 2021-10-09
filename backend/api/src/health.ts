import * as Router from '@koa/router';

export function initHealthChecks(router: Router) {
  router.get('/health', (ctx) => {
    ctx.body = 'OK';
  });
}
