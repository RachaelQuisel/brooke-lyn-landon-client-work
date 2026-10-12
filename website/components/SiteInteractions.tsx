'use client';
import { useEffect } from 'react';
export default function SiteInteractions() {
  useEffect(()=> {
    const escape=(event:KeyboardEvent)=>{if(event.key!=='Escape')return;const menu=document.querySelector<HTMLDetailsElement>('.mobile-menu[open]');if(menu){menu.open=false;menu.querySelector<HTMLElement>('summary')?.focus();}};
    const print=()=>window.print();
    document.addEventListener('keydown',escape);
    document.getElementById('print-guide')?.addEventListener('click',print);
    return()=>{document.removeEventListener('keydown',escape);document.getElementById('print-guide')?.removeEventListener('click',print);};
  },[]);
  return null;
}
