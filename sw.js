const C='naama-v3', OK=['www.gstatic.com','cdnjs.cloudflare.com'];
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin&&!OK.includes(u.hostname)) return;
  e.respondWith(caches.open(C).then(async c=>{
    const keep=res=>{ if(res&&(res.ok||res.type==='opaque')) c.put(r,res.clone()); return res; };
    if(r.mode==='navigate') return fetch(r).then(keep).catch(()=>c.match(r,{ignoreSearch:true}));
    const hit=await c.match(r); const net=fetch(r).then(keep).catch(()=>hit);
    return hit||net;
  }));
});
