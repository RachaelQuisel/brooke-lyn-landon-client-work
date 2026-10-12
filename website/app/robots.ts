import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots {return {rules:{userAgent:'*',allow:'/',disallow:['/edit','/api/editor/','/parent-guide/']},sitemap:'https://reading-with-sage-library-program.rachael-quisel.chatgpt.site/sitemap.xml'};}
