// Geographic selection is independent from the map camera.
export function world(lat,lon,zoom){const n=256*2**zoom,s=Math.sin(lat*Math.PI/180);return [(lon+180)/360*n,(.5-Math.log((1+s)/(1-s))/(4*Math.PI))*n]}
export function fromWorld(x,y,zoom){const n=256*2**zoom;return {lon:((x/n*360)%360+360)%360-180,lat:Math.max(-66,Math.min(66,Math.atan(Math.sinh(Math.PI*(1-2*y/n)))*180/Math.PI))}}
export function mountAreaMap({getSelection,setSelection,isLoading}){
 const el=document.querySelector('#map'),tiles=el.querySelector('#tiles'),box=el.querySelector('.map-box');
 let center={...getSelection()},zoom=17,drag=null,wheelTime=0;const cache=new Map();
 const size=()=>({width:el.clientWidth,height:el.clientHeight});
 function render(){const r=size();if(!r.width)return;const selected=getSelection(),[cx,cy]=world(center.lat,center.lon,zoom),left=cx-r.width/2,top=cy-r.height/2,n=2**zoom,keep=new Set();
  for(let x=Math.floor(left/256);x<=Math.floor((left+r.width)/256);x++)for(let y=Math.floor(top/256);y<=Math.floor((top+r.height)/256);y++){if(y<0||y>=n)continue;const key=`${zoom}/${x}/${y}`;keep.add(key);let img=cache.get(key);if(!img){img=document.createElement('img');img.src=`https://tile.openstreetmap.org/${zoom}/${((x%n)+n)%n}/${y}.png`;img.alt='';img.draggable=false;cache.set(key,img);tiles.append(img)}img.style.left=(x*256-left)+'px';img.style.top=(y*256-top)+'px'}
  for(const [key,img] of cache)if(!keep.has(key)){img.remove();cache.delete(key)}
  const [sx,sy]=world(selected.lat,selected.lon,zoom),span=180*256*2**zoom/(40075016.686*Math.cos(selected.lat*Math.PI/180));
  box.style.left=(sx-left)+'px';box.style.top=(sy-top)+'px';box.style.width=box.style.height=span+'px';
  document.querySelector('#map-zoom-in').disabled=zoom>=19||isLoading();document.querySelector('#map-zoom-out').disabled=zoom<=13||isLoading();
 }
 function fit(){center={...getSelection()};zoom=17;while(zoom>13&&180*256*2**zoom/(40075016.686*Math.cos(center.lat*Math.PI/180))>Math.min(size().width,size().height)-65)zoom--;render()}
 function changeZoom(delta,point){if(isLoading()||drag)return;const next=Math.max(13,Math.min(19,zoom+delta));if(next===zoom)return;const r=size(),px=point?.x??r.width/2,py=point?.y??r.height/2,[cx,cy]=world(center.lat,center.lon,zoom),ratio=2**(next-zoom);center=fromWorld((cx+px-r.width/2)*ratio-px+r.width/2,(cy+py-r.height/2)*ratio-py+r.height/2,next);zoom=next;render()}
 function select(p){setSelection({...p,name:'Custom study area',city:'Selected map location'});render()}
 el.addEventListener('pointerdown',e=>{if(isLoading()||e.button!==0||e.target.closest('a,button')||drag)return;const frame=e.target.closest('.map-box');drag={id:e.pointerId,x:e.clientX,y:e.clientY,kind:frame?'selection':'pan',start:world(...(frame?[getSelection().lat,getSelection().lon]:[center.lat,center.lon]),zoom),moved:false};el.setPointerCapture(e.pointerId);el.classList.add('is-dragging');if(frame)box.focus({preventScroll:true});e.preventDefault()});
 el.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>3)drag.moved=true;if(!drag.moved)return;if(drag.kind==='selection')select(fromWorld(drag.start[0]+dx,drag.start[1]+dy,zoom));else{center=fromWorld(drag.start[0]-dx,drag.start[1]-dy,zoom);render()}});
 function finish(e,cancel=false){if(!drag||e.pointerId!==drag.id)return;if(!cancel&&!drag.moved&&drag.kind==='pan'){const r=el.getBoundingClientRect(),[cx,cy]=world(center.lat,center.lon,zoom);select(fromWorld(cx+e.clientX-r.left-el.clientWidth/2,cy+e.clientY-r.top-el.clientHeight/2,zoom))}if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);drag=null;el.classList.remove('is-dragging')}
 el.addEventListener('pointerup',e=>finish(e));el.addEventListener('pointercancel',e=>finish(e,true));el.addEventListener('lostpointercapture',()=>{drag=null;el.classList.remove('is-dragging')});
 el.addEventListener('wheel',e=>{if(e.target.closest('a'))return;e.preventDefault();if(Date.now()-wheelTime<160)return;wheelTime=Date.now();const r=el.getBoundingClientRect();changeZoom(e.deltaY<0?1:-1,{x:e.clientX-r.left,y:e.clientY-r.top})},{passive:false});
 box.addEventListener('keydown',e=>{if(isLoading())return;const directions={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};if(!directions[e.key])return;e.preventDefault();const [x,y]=world(getSelection().lat,getSelection().lon,zoom),[dx,dy]=directions[e.key];select(fromWorld(x+dx,y+dy,zoom))});
 document.querySelector('#map-zoom-in').onclick=()=>changeZoom(1);document.querySelector('#map-zoom-out').onclick=()=>changeZoom(-1);document.querySelector('#map-fit').onclick=()=>{if(!isLoading())fit()};
 for(const [id,dx,dy] of [['north',0,-100],['south',0,100],['west',-100,0],['east',100,0]])document.querySelector('#map-'+id).onclick=()=>{if(isLoading())return;const [x,y]=world(center.lat,center.lon,zoom);center=fromWorld(x+dx,y+dy,zoom);render()};
 new ResizeObserver(render).observe(el);return {render,fit};
}
