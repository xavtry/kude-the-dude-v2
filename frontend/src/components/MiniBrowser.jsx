import React, { useState, useEffect, useRef } from 'react'
setTabs(prev => prev.map(t => {
if(t.id !== id) return t
const idx = Math.min(t.history.length - 1, t.index + 1)
return { ...t, index: idx, src: PROXY_PATH(t.history[idx]) }
}))
}


function refresh(id){
const iframe = iframeRefs.current[id]
if(iframe) iframe.src = iframe.src
}


// listen for postMessage from proxied pages (proxy injects a small script)
useEffect(()=>{
function onMsg(e){
try{
const data = e.data
if(!data || !data.__kude) return
setTabs(prev => prev.map(t => {
if(t.src && data.url && data.url === t.history[t.index]){
return { ...t, title: data.title || t.title, favicon: data.favicon || t.favicon }
}
return t
}))
}catch(e){}
}
window.addEventListener('message', onMsg)
return ()=> window.removeEventListener('message', onMsg)
}, [])


const active = tabs.find(t=>t.id===activeId)


return (
<div className="mini-browser">
<div className="toolbar">
<div className="left-controls">
<button onClick={()=>goBack(activeId)} disabled={!active || active.index<=0}>◀</button>
<button onClick={()=>goForward(activeId)} disabled={!active || active.index>= (active?.history.length-1 || 0)}>▶</button>
<button onClick={()=>refresh(activeId)}>⟳</button>
</div>


<div className="address">
<input ref={addressRef} defaultValue={active?.history[active?.index] || ''} placeholder="Search or enter URL" onKeyDown={(e)=>{ if(e.key==='Enter'){ navigate(activeId, e.target.value) } }} />
<button onClick={()=>{ navigate(activeId, addressRef.current.value) }}>Go</button>
</div>


<div className="right-controls">
<button title="New tab" onClick={()=>createTab('https://www.google.com')}>＋</button>
</div>
</div>


<div className="tabs-row">
{tabs.map(t => (
<div key={t.id} className={`tab ${t.id===activeId? 'active':''}`} onClick={()=>setActiveId(t.id)}>
{t.favicon ? <img src={t.favicon} alt="f" className="fav" /> : <span className="fav-placeholder">•</span>}
<span className="title">{t.title.length>24 ? t.title.slice(0,22)+'..' : t.title}</span>
<button className="close" onClick={(e)=>{ e.stopPropagation(); closeTab(t.id) }}>✕</button>
</div>
))}
</div>


<div className="browser-area">
{tabs.map(t => (
<iframe
key={t.id}
ref={el => iframeRefs.current[t.id] = el}
title={t.title}
src={t.src}
style={{ display: t.id===activeId ? 'block' : 'none', width: '100%', height: '100%', border: '0' }}
sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
/>
))}
</div>
</div>
)
}
