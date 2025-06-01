// This file is intentionally left mostly blank to resolve a dynamic route conflict.
// The route /dashboard/print-receipt/[transactionId] was deprecated.
// The active route is /dashboard/print-receipt/[id]?type=...
//
// To fully remove this route, this file could be deleted, but for now,
// not exporting a default component resolves the startup error.

export {}; // Ensures this is treated as a module but exports nothing that Next.js would use as a page.
