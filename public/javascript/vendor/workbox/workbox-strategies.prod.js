this.workbox=this.workbox||{},this.workbox.strategies=function(t,e,s,i,r){"use strict";try{self["workbox:strategies:5.0.0-beta.1"]&&_()}catch(t){}class n{constructor(t={}){this.t=e.cacheNames.getRuntimeName(t.cacheName),this.s=t.plugins||[],this.i=t.fetchOptions,this.h=t.matchOptions}async handle({event:t,request:e}){let i,n=await s.cacheWrapper.match({cacheName:this.t,request:e,event:t,matchOptions:this.h,plugins:this.s});if(!n)try{n=await this.o(e,t)}catch(t){i=t}if(!n)throw new r.WorkboxError("no-response",{url:e.url,error:i});return n}async o(t,e){const r=await i.fetchWrapper.fetch({request:t,event:e,fetchOptions:this.i,plugins:this.s}),n=r.clone(),h=s.cacheWrapper.put({cacheName:this.t,request:t,response:n,event:e,plugins:this.s});if(e)try{e.waitUntil(h)}catch(t){}return r}}class h{constructor(t={}){this.t=e.cacheNames.getRuntimeName(t.cacheName),this.s=t.plugins||[],this.h=t.matchOptions}async handle({event:t,request:e}){const i=await s.cacheWrapper.match({cacheName:this.t,request:e,event:t,matchOptions:this.h,plugins:this.s});if(!i)throw new r.WorkboxError("no-response",{url:e.url});return i}}const c={cacheWillUpdate:async({response:t})=>200===t.status||0===t.status?t:null};class a{constructor(t={}){if(this.t=e.cacheNames.getRuntimeName(t.cacheName),t.plugins){let e=t.plugins.some(t=>!!t.cacheWillUpdate);this.s=e?t.plugins:[c,...t.plugins]}else this.s=[c];this.u=t.networkTimeoutSeconds||0,this.i=t.fetchOptions,this.h=t.matchOptions}async handle({event:t,request:e}){const s=[],i=[];let n;if(this.u){const{id:r,promise:h}=this.l({request:e,event:t,logs:s});n=r,i.push(h)}const h=this.p({timeoutId:n,request:e,event:t,logs:s});i.push(h);let c=await Promise.race(i);if(c||(c=await h),!c)throw new r.WorkboxError("no-response",{url:e.url});return c}l({request:t,logs:e,event:s}){let i;return{promise:new Promise(e=>{i=setTimeout(async()=>{e(await this.v({request:t,event:s}))},1e3*this.u)}),id:i}}async p({timeoutId:t,request:e,logs:r,event:n}){let h,c;try{c=await i.fetchWrapper.fetch({request:e,event:n,fetchOptions:this.i,plugins:this.s})}catch(t){h=t}if(t&&clearTimeout(t),h||!c)c=await this.v({request:e,event:n});else{const t=c.clone(),i=s.cacheWrapper.put({cacheName:this.t,request:e,response:t,event:n,plugins:this.s});if(n)try{n.waitUntil(i)}catch(t){}}return c}v({event:t,request:e}){return s.cacheWrapper.match({cacheName:this.t,request:e,event:t,matchOptions:this.h,plugins:this.s})}}class o{constructor(t={}){this.s=t.plugins||[],this.i=t.fetchOptions}async handle({event:t,request:e}){let s,n;try{n=await i.fetchWrapper.fetch({request:e,event:t,fetchOptions:this.i,plugins:this.s})}catch(t){s=t}if(!n)throw new r.WorkboxError("no-response",{url:e.url,error:s});return n}}class u{constructor(t={}){if(this.t=e.cacheNames.getRuntimeName(t.cacheName),this.s=t.plugins||[],t.plugins){let e=t.plugins.some(t=>!!t.cacheWillUpdate);this.s=e?t.plugins:[c,...t.plugins]}else this.s=[c];this.i=t.fetchOptions,this.h=t.matchOptions}async handle({event:t,request:e}){const i=this.o({request:e,event:t});let n,h=await s.cacheWrapper.match({cacheName:this.t,request:e,event:t,matchOptions:this.h,plugins:this.s});if(h){if(t)try{t.waitUntil(i)}catch(n){}}else try{h=await i}catch(t){n=t}if(!h)throw new r.WorkboxError("no-response",{url:e.url,error:n});return h}async o({request:t,event:e}){const r=await i.fetchWrapper.fetch({request:t,event:e,fetchOptions:this.i,plugins:this.s}),n=s.cacheWrapper.put({cacheName:this.t,request:t,response:r.clone(),event:e,plugins:this.s});if(e)try{e.waitUntil(n)}catch(t){}return r}}const l={cacheFirst:n,cacheOnly:h,networkFirst:a,networkOnly:o,staleWhileRevalidate:u},w=t=>{const e=l[t];return t=>new e(t)},p=w("cacheFirst"),v=w("cacheOnly"),m=w("networkFirst"),q=w("networkOnly"),y=w("staleWhileRevalidate");return t.CacheFirst=n,t.CacheOnly=h,t.NetworkFirst=a,t.NetworkOnly=o,t.StaleWhileRevalidate=u,t.cacheFirst=p,t.cacheOnly=v,t.networkFirst=m,t.networkOnly=q,t.staleWhileRevalidate=y,t}({},workbox.core._private,workbox.core._private,workbox.core._private,workbox.core._private);
//# sourceMappingURL=workbox-strategies.prod.js.map
