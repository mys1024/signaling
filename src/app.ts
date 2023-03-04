import { oak, oakCors } from "./deps.ts";
import logger from "./middleware/logger.ts";
import router from "./router.ts";

const app = new oak.Application();

app.use(logger());
app.use(oakCors());
app.use(router.routes(), router.allowedMethods());

export default app;
