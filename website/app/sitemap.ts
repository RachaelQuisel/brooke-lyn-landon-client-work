import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap {return ['','program','libraries','parents','book','about','contact'].map(path=>({url:`https://reading-with-sage-library-program.rachael-quisel.chatgpt.site/${path}${path?'/':''}`}));}
