import type { Metadata } from 'next';
import '../src/styles/global.css';
import './editor.css';
export const metadata:Metadata={metadataBase:new URL('https://reading-with-sage-library-program.rachael-quisel.chatgpt.site'),icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>;
}
