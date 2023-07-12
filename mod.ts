import { Application, log, isHttpError, Status, oakCors } from './src/deps.ts';
import api from './src/api/api.ts';
import { fileHandler } from './src/logConfig.ts';

const app = new Application();
const PORT = 9000;

app.addEventListener("error", (event) => {
    log.error(event.error);
});

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        log.error(err);
        if (isHttpError(err)) {
            ctx.throw((Number(err.status)), JSON.stringify(err));
            return;
        }
        ctx.throw(Status.InternalServerError, JSON.stringify({ message: "Internal server error" }));
    }
});

app.use(async (ctx, next) => {
    await next();
    const time = ctx.response.headers.get("X-Response-Time");
    log.info(`${ctx.request.method} ${ctx.request.ip} - ${ctx.request.url}: ${time}`);
    fileHandler.flush();
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const delta = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(oakCors({ origin: '*' }));
app.use(api.routes());
app.use(api.allowedMethods());

if (import.meta.main) {
    log.info(`Server started on port ${PORT}`);
    await app.listen({
        port: PORT
    });
}
