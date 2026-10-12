declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    EDITOR_EMAILS?: string;
    PUBLIC_FORMSPREE_ENDPOINT?: string;
    PUBLIC_FORMSPREE_PARENT_ENDPOINT?: string;
  }
}
