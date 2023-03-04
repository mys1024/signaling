import app from "./app.ts";
import printer from "./utils/printer.ts";

const port = 80;

app.listen({ port });
printer.info(`Listening on port ${port}`);
