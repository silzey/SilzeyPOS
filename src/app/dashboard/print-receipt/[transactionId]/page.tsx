// This file is intentionally left mostly blank to resolve a dynamic route conflict.
// The route /dashboard/print-receipt/[transactionId] was deprecated.
// The active route is /dashboard/print-receipt/[id]?type=...
//
// Exporting 'default null' to explicitly mark this as not a valid page component.
// This should prevent Next.js from treating it as a page and resolve the slug name conflict.

export default null;
