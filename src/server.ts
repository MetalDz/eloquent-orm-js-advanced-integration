import { createBlogApiApp } from "./app/http/createBlogApiApp";
import { appEnv } from "./app/config/env";

const { app } = createBlogApiApp();

app.listen(appEnv.port, "127.0.0.1", () => {
  console.log(`Blog API listening on http://127.0.0.1:${appEnv.port}`);
});
