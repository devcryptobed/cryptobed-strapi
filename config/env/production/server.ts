import cronTasks from "../../cron-tasks";

// Path: ./config/env/production/server.js`
export default ({ env }) => ({
  proxy: true,
  url: env("MY_HEROKU_URL"), // Sets the public URL of the application.
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
});
