import { initBotId } from "botid/client/core";

// Only contact submissions are checked; public pages remain crawlable.
initBotId({ protect: [{ path: "/api/contact", method: "POST" }] });
