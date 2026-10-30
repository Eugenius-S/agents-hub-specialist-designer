// Pre-show check of a mockup: source plus snapshot.
// node precheck.js [--pack] [--styles <styles file>] <index.html…>
// Needs playwright-core 1.64.1 (`npm i playwright-core@1.64.1`) and an installed Chrome; the path to playwright-core goes in PW if it is not in the adjacent node_modules.
// In the mockup: the heading has id="headline", the illustration is <img data-ill-style="<style>">, the size is <meta name="hub-frame" content="WxH">.
// STOP: do not show until fixed; WARN: a hint. Exit code 1 if there is a STOP.
// Next to the snapshot it writes shots/<name>.check.json, which the reviewer sees.
const PW = process.env.PW || 'playwright-core';
const {chromium} = require(PW);
const path = require('path'), url = require('url'), fs = require('fs');

const T = {                 // thresholds: approved promo mockups (1080×1350 posts, 1080×1920 stories) pass without a STOP
  sideMargin: 56, postV: 48, storyTop: 220, storyBottom: 250,
  bandStop: 0.16,           // empty full-width band, share of height: STOP
  holeWarn: 0.16,           // empty rectangle, share of the frame: WARN
  illMin: 0.12,             // share of the frame taken by illustration pixels: below it WARN
  illMinStop: 0.07,         // below it: STOP
  families: 2, sizes: 4,
  lostWarn: 0.30,           // share of illustration pixels matching the background around it (ΔE OKLab < 0.07): WARN
  sideStop: 32, postVStop: 20, // rough margins: STOP; down to sideMargin/postV: WARN
  muddyC: 0.045, muddyL: [0.35, 0.80],
  packSame: 2,              // background / font pair / style: no more than N times in a pack
  bindStop: 1.0, bindWarn: 1.5, // binding: gap to the neighboring block / gap between lines of the block; below: STOP / WARN
  evenGap: 1.2,             // different text styles in a row with gaps within ×1.2: WARN "equal gaps"
};

const args = process.argv.slice(2);
const pack = args.includes('--pack');
let stylesFile = null; const si = args.indexOf('--styles'); if (si >= 0) stylesFile = args.splice(si, 2)[1];
const files = args.filter(a => !a.startsWith('--'));

function styleList(head) {
  if (!stylesFile || !fs.existsSync(stylesFile)) return [];
  const md = fs.readFileSync(stylesFile, 'utf8');
  const sec = md.split(/^## /m).find(s => head.test(s)) || '';
  return sec.split('\n').filter(l => /^- /.test(l)).map(l => l.replace(/^- \*{0,2}([^*—(:]+).*/, '$1').trim().toLowerCase());
}

const PIX = `
const lin=c=>{c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4)};
function oklab(r,g,b){r=lin(r);g=lin(g);b=lin(b);
 const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b),m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b),s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
 return [0.2104542553*l+0.7936177850*m-0.0040720468*s,1.9779984951*l-2.4285922050*m+0.4505937099*s,0.0259040371*l+0.7827717662*m-0.8086757660*s]}
async function img(b64){const i=new Image();i.src='data:image/png;base64,'+b64;await i.decode();const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const x=c.getContext('2d');x.drawImage(i,0,0);return x.getImageData(0,0,i.width,i.height).data}
`;

(async () => {
  const b = await chromium.launch({channel: 'chrome'});
  const stop = styleList(/^Avoid/i), allow = styleList(/^Use/i);
  const all = [];
  for (const f of files) {
    const p = await b.newPage();
    const html = fs.readFileSync(f, 'utf8');
    const m = html.match(/hub-frame" content="(\d+)x(\d+)/); const W = +m[1], H = +m[2];
    await p.setViewportSize({width: W, height: H});
    await p.goto(url.pathToFileURL(path.resolve(f)).href);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelectorAll('img').forEach(i => i.loading = 'eager'));
    const nm = path.basename(f) === 'index.html' ? path.basename(path.dirname(f)) : path.basename(f, '.html');
    const sd = path.join(path.dirname(path.resolve(f)), 'shots'); fs.mkdirSync(sd, {recursive: true});
    const shot = path.join(sd, nm + '.png');
    const full = await p.screenshot({path: shot});

    // texts: each element with its own text
    const src = await p.evaluate(() => {
      const out = [], ills = [];
      for (const e of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(e);
        if (e.tagName === 'IMG' || e.hasAttribute('data-ill')) { const r = e.getBoundingClientRect(); ills.push({src: e.getAttribute('src') || '', style: e.getAttribute('data-ill-style') || '', shape: e.getAttribute('data-ill') === 'shape', box: [r.left, r.top, r.right, r.bottom].map(Math.round)}); continue; }
        if (e.closest('[data-ill]')) continue;
        const tn = [...e.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
        if (!tn.length || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
        const rs = []; for (const n of tn) { const rg = document.createRange(); rg.selectNodeContents(n); rs.push(...rg.getClientRects()); }
        if (!rs.length) continue;
        const area = rs.reduce((a, r) => a + r.width * r.height, 0);
        const box = [Math.min(...rs.map(r => r.left)), Math.min(...rs.map(r => r.top)), Math.max(...rs.map(r => r.right)), Math.max(...rs.map(r => r.bottom))].map(Math.round);
        const lines = []; for (const r of rs) { if (r.width < 1) continue; const l = lines.find(x => Math.abs(x[1] - r.top) < 2); if (l) { l[0] = Math.min(l[0], r.left); l[2] = Math.max(l[2], r.right); } else lines.push([r.left, r.top, r.right, r.bottom]); }
        lines.sort((a, c) => a[1] - c[1]);
        out.push({id: e.id || (e.className && String(e.className).split(' ')[0]) || e.tagName.toLowerCase(), text: tn.map(n => n.textContent.trim()).join(' ').slice(0, 40),
          fs: parseFloat(cs.fontSize), fam: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), area: Math.round(area), box, lines: lines.map(l => l.map(Math.round))});
      }
      const fr = document.getElementById('frame') || document.body;
      return {texts: out, ills, bg: getComputedStyle(fr).backgroundColor};
    });

    // no images: illustration mask; no images and no text: background
    await p.addStyleTag({content: 'img,[data-ill]{visibility:hidden!important}'});
    const noIll = await p.screenshot();
    await p.addStyleTag({content: '*{color:transparent!important;text-shadow:none!important;-webkit-text-stroke:0!important}'});
    const bgOnly = await p.screenshot();
    // ink of each text line: the difference between "with text" and "without text"
    const lineInk = await p.evaluate(new Function('a', `${PIX} return (async()=>{
      const [A,B,W,H,texts]=a; const na=await img(A), ba=await img(B);
      const on=(x,y)=>{const k=(y*W+x)*4;return Math.abs(na[k]-ba[k])+Math.abs(na[k+1]-ba[k+1])+Math.abs(na[k+2]-ba[k+2])>60};
      return texts.map(t=>t.lines.map(([l,tp,r,bt])=>{let top=-1,bot=-1;for(let y=Math.max(0,tp);y<Math.min(H,bt);y++){let hit=0;for(let x=Math.max(0,l);x<Math.min(W,r);x++)if(on(x,y)&&++hit>1)break;if(hit>1){if(top<0)top=y;bot=y}}return top<0?null:[l,top,r,bot]}).filter(Boolean))})()`), [noIll.toString('base64'), bgOnly.toString('base64'), W, H, src.texts]);

    const textBoxes = src.texts.map(t => t.box);
    const res = await p.evaluate(new Function('a', `${PIX} return (async()=>{
      let [A,B,C,W,H,boxes,story,T]=a; const fa=await img(A), na=await img(B), ba=await img(C);
      const N=W*H, mask=new Uint8Array(N); let ill=0;
      for(let i=0;i<N;i++){const k=i*4;if(Math.abs(fa[k]-na[k])+Math.abs(fa[k+1]-na[k+1])+Math.abs(fa[k+2]-na[k+2])>30){mask[i]=1;ill++}}
      // text ink: snapshot without images against snapshot without images and text, inside the element box
      const ink=boxes.map(([l,t,r,b])=>{let x0=W,y0=H,x1=-1,y1=-1;l=Math.max(0,l-8);t=Math.max(0,t-8);r=Math.min(W,r+8);b=Math.min(H,b+8);
        for(let y=t;y<b;y++)for(let x=l;x<r;x++){const k=(y*W+x)*4;if(Math.abs(na[k]-ba[k])+Math.abs(na[k+1]-ba[k+1])+Math.abs(na[k+2]-ba[k+2])>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}}
        return x1<0?null:[x0,y0,x1+1,y1+1]});
      boxes=ink.map((b,i)=>b||boxes[i]);
      // illustration palette: 4-bit bins, merged by OKLab
      const bins=new Map();for(let i=0;i<N;i+=2)if(mask[i]){const k=i*4,key=(fa[k]>>4)<<8|(fa[k+1]>>4)<<4|(fa[k+2]>>4);bins.set(key,(bins.get(key)||0)+1)}
      let cl=[];const tot=[...bins.values()].reduce((x,y)=>x+y,0)||1;
      for(const [key,n] of [...bins].sort((x,y)=>y[1]-x[1])){const r=((key>>8)&15)*16+8,g=((key>>4)&15)*16+8,b=(key&15)*16+8,lab=oklab(r,g,b);
        const c=cl.find(c=>Math.hypot(c.lab[0]-lab[0],c.lab[1]-lab[1],c.lab[2]-lab[2])<0.06);if(c)c.n+=n;else cl.push({rgb:[r,g,b],lab,n})}
      cl=cl.sort((x,y)=>y.n-x.n).slice(0,6).map(c=>({hex:'#'+c.rgb.map(v=>v.toString(16).padStart(2,'0')).join(''),share:+(c.n/tot).toFixed(3),lab:c.lab}));
      // background around the illustration: a 24px ring beyond the mask, from the snapshot without text and images
      const ring=new Map();let rn=0;const R=24;
      for(let y=0;y<H;y+=4)for(let x=0;x<W;x+=4){const i=y*W+x;if(mask[i])continue;let near=false;
        for(const [dx,dy] of [[R,0],[-R,0],[0,R],[0,-R]]){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<W&&Y<H&&mask[Y*W+X]){near=true;break}}
        if(!near)continue;const k=i*4,key=(ba[k]>>3)<<10|(ba[k+1]>>3)<<5|(ba[k+2]>>3);ring.set(key,(ring.get(key)||0)+1);rn++}
      // main background of the frame
      const fb=new Map();for(let i=0;i<N;i+=7){const k=i*4,key=(ba[k]>>3)<<10|(ba[k+1]>>3)<<5|(ba[k+2]>>3);fb.set(key,(fb.get(key)||0)+1)}
      const top=m=>{const [key]=[...m].sort((x,y)=>y[1]-x[1])[0]||[0];return [((key>>10)&31)*8+4,((key>>5)&31)*8+4,(key&31)*8+4]};
      const ringRGB=rn?top(ring):top(fb), frameRGB=top(fb), ringLab=oklab(...ringRGB), frameLab=oklab(...frameRGB);
      let lost=0,seen=0;for(let i=0;i<N;i+=3)if(mask[i]){const k=i*4,L=oklab(fa[k],fa[k+1],fa[k+2]);seen++;if(Math.hypot(L[0]-ringLab[0],L[1]-ringLab[1],L[2]-ringLab[2])<0.07)lost++}
      let blend=9,blendHex='';for(const c of cl)if(c.share>=0.05){const d=Math.hypot(c.lab[0]-ringLab[0],c.lab[1]-ringLab[1],c.lab[2]-ringLab[2]);if(d<blend){blend=d;blendHex=c.hex}}
      // occupancy: illustration plus text boxes, a 20px grid in the working area
      const top0=story?T.storyTop:T.postV, bot0=H-(story?T.storyBottom:T.postV), S=20;
      const gw=Math.floor(W/S), gy0=Math.floor(top0/S), gy1=Math.floor(bot0/S), gh=gy1-gy0;
      const occ=Array.from({length:gh},()=>new Uint8Array(gw));
      for(let gy=0;gy<gh;gy++)for(let gx=0;gx<gw;gx++){let n=0;for(let y=(gy+gy0)*S;y<(gy+gy0+1)*S;y+=4)for(let x=gx*S;x<(gx+1)*S;x+=4)n+=mask[y*W+x];if(n>1)occ[gy][gx]=1}
      for(const [l,t,r,b] of boxes)for(let gy=Math.max(0,Math.floor(t/S)-gy0);gy<Math.min(gh,Math.ceil(b/S)-gy0);gy++)for(let gx=Math.max(0,Math.floor(l/S));gx<Math.min(gw,Math.ceil(r/S));gx++)occ[gy][gx]=1;
      let band=0,run=0,bandAt=0;for(let gy=0;gy<gh;gy++){if(occ[gy].every(v=>!v)){run++;if(run>band){band=run;bandAt=gy-run+1}}else run=0}
      // the largest empty rectangle (histograms)
      let hole=0,holeBox=null;const hgt=new Array(gw).fill(0);
      for(let gy=0;gy<gh;gy++){for(let gx=0;gx<gw;gx++)hgt[gx]=occ[gy][gx]?0:hgt[gx]+1;
        const st=[];for(let gx=0;gx<=gw;gx++){const h=gx<gw?hgt[gx]:0;let s=gx;while(st.length&&st[st.length-1][1]>=h){const [i0,h0]=st.pop();const ar=h0*(gx-i0);if(ar>hole){hole=ar;holeBox=[i0*S,(gy-h0+1+gy0)*S,gx*S,(gy+1+gy0)*S]}s=i0}st.push([s,h])}}
      // illustration frame from the mask
      let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y+=2)for(let x=0;x<W;x+=2)if(mask[y*W+x]){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
      return {ink:boxes,lost:seen?+(lost/seen).toFixed(3):0,ill,illBox:ill?[x0,y0,x1,y1]:null,palette:cl.map(({hex,share})=>({hex,share})),ring:ringRGB,frame:frameRGB,frameLab,blend:+blend.toFixed(3),blendHex,
        band:band*S/H,bandAt:[(bandAt+gy0)*S,(bandAt+gy0+band)*S],hole:hole*S*S/(W*H),holeBox}})()`), [full.toString('base64'), noIll.toString('base64'), bgOnly.toString('base64'), W, H, textBoxes, H / W > 1.7, T]);

    src.texts.forEach((t, i) => { t.box = res.ink[i]; t.area = (t.box[2] - t.box[0]) * (t.box[3] - t.box[1]); });
    const illArea = res.illBox ? (res.illBox[2] - res.illBox[0]) * (res.illBox[3] - res.illBox[1]) : 0;
    const story = H / W > 1.7, stops = [], warns = [];
    const head = src.texts.find(t => t.id === 'headline') || [...src.texts].sort((a, c) => c.fs - a.fs)[0];
    const illShare = illArea / (W * H), illPx = res.ill / (W * H);
    // 1. hierarchy: the two largest masses are the heading and the illustration
    const masses = [{id: 'ill', area: illArea}, ...src.texts.map(t => ({id: t.id, area: t.area, fs: t.fs, text: t.text}))].sort((a, c) => c.area - a.area);
    const lead = masses[0];
    if (res.ill && head && lead.id !== 'ill' && lead.id !== head.id) stops.push(`hierarchy: the largest is "${lead.text || lead.id}", not the heading and not the illustration`);
    for (const t of src.texts) if (head && t !== head && t.area > head.area) warns.push(`"${t.text}" is heavier than the heading (${(t.area / head.area).toFixed(2)}×)`);
    if (res.ill && illShare < T.illMinStop) stops.push(`illustration is small: ${(illShare * 100).toFixed(0)}% of the frame`);
    else if (res.ill && illShare < T.illMin) warns.push(`illustration is smallish: ${(illShare * 100).toFixed(0)}% of the frame`);
    // 2. margins
    for (const t of src.texts) {
      const [l, tp, r, bt] = t.box, side = Math.min(l, W - r), v = Math.min(tp, H - bt);
      if (side < T.sideStop) stops.push(`side margin: "${t.text}" ${side}px < ${T.sideStop}`);
      else if (side < T.sideMargin) warns.push(`side margin: "${t.text}" ${side}px < ${T.sideMargin}`);
      if (story && (tp < T.storyTop || bt > H - T.storyBottom)) stops.push(`story safe zone: "${t.text}" ${tp}–${bt}, needs ${T.storyTop}–${H - T.storyBottom}`);
      if (!story && v < T.postVStop) stops.push(`top/bottom margin: "${t.text}" ${v}px < ${T.postVStop}`);
      else if (!story && v < T.postV) warns.push(`top/bottom margin: "${t.text}" ${v}px < ${T.postV}`);
    }
    // 3. voids
    if (res.band > T.bandStop) stops.push(`empty band ${(res.band * 100).toFixed(0)}% of the height (y ${res.bandAt.join('–')})`);
    if (res.hole > T.holeWarn) warns.push(`hole ${(res.hole * 100).toFixed(0)}% of the frame (${res.holeBox.join(',')})`);
    // 4. fonts: a hint
    const fams = [...new Set(src.texts.map(t => t.fam))], sizes = [...new Set(src.texts.map(t => Math.round(t.fs)))];
    if (fams.length > T.families) warns.push(`${fams.length} fonts: ${fams.join(', ')}`);
    if (sizes.length > T.sizes) warns.push(`${sizes.length} font sizes: ${sizes.sort((a, c) => c - a).join('/')}`);
    // 4a. binding: inside a block it is tighter than to the neighbor (the inner-and-outer rule)
    const blocks = src.texts.map((t, i) => ({t, ink: lineInk[i]})).filter(x => x.ink.length).map(x => ({...x,
      box: [Math.min(...x.ink.map(l => l[0])), x.ink[0][1], Math.max(...x.ink.map(l => l[2])), x.ink[x.ink.length - 1][3]],
      inner: x.ink.length > 1 ? Math.max(...x.ink.slice(1).map((l, i) => l[1] - x.ink[i][3])) : null}));
    const binds = [];
    for (const A of blocks) {
      let nb = null;
      for (const B of blocks) if (B !== A && B.box[1] > A.box[3] && Math.min(A.box[2], B.box[2]) > Math.max(A.box[0], B.box[0]) && (!nb || B.box[1] < nb.box[1])) nb = B;
      if (!nb) continue;
      const gap = nb.box[1] - A.box[3], inner = Math.max(A.inner ?? -1, nb.inner ?? -1);
      binds.push({a: A.t.text, b: nb.t.text, gap, inner, fsA: A.t.fs, fsB: nb.t.fs});
      if (inner <= 0) continue;
      const msg = `binding: "${A.t.text}" → "${nb.t.text}" ${gap}px, while between lines ${inner}px`;
      if (gap / inner < T.bindStop) stops.push(msg + ' (outside is tighter than inside)');
      else if (gap / inner < T.bindWarn) warns.push(msg + ` (outside is less than ${T.bindWarn} times inside)`);
    }
    // equal gaps: different text styles in a row with equal gaps: the groups do not read
    for (let i = 1; i < binds.length; i++) {
      const x = binds[i - 1], y = binds[i];
      if (x.b !== y.a || x.fsA === x.fsB && y.fsA === y.fsB || Math.min(x.gap, y.gap) <= 0) continue;
      if (Math.max(x.gap, y.gap) / Math.min(x.gap, y.gap) < T.evenGap) warns.push(`equal gaps: "${x.a}" → "${x.b}" ${x.gap}px and "${y.a}" → "${y.b}" ${y.gap}px (it is not visible what belongs to what in the group)`);
    }
    // 5. color
    if (res.ill && res.lost > T.lostWarn) warns.push(`illustration blends into the background: ${(res.lost * 100).toFixed(0)}% of its pixels match the background around it`);
    const [L, a2, b2] = res.frameLab, C = Math.hypot(a2, b2);
    if (C < T.muddyC && L > T.muddyL[0] && L < T.muddyL[1]) warns.push(`muddy background: L ${L.toFixed(2)}, C ${C.toFixed(3)}`);
    // 6. illustration style
    const styles = src.ills.map(i => i.style).filter(Boolean);
    if (src.ills.some(i => !i.shape) && !styles.length) (stylesFile ? stops : warns).push('the illustration has no data-ill-style: style not checked');
    for (const s of styles) if (stop.some(x => s.toLowerCase() === x || s.toLowerCase().includes(x))) stops.push(`style is on the stop list: ${s}`);
      else if (allow.length && !allow.includes(s.toLowerCase())) warns.push(`style ${s} is not on the "Use" list`);

    const rep = {name: nm, file: path.resolve(f), shot, frame: [W, H], illShare: +illShare.toFixed(3), illBox: res.illBox,
      headline: head && {text: head.text, fs: head.fs, area: head.area}, masses: masses.slice(0, 5), fonts: fams, sizes,
      palette: res.palette, frameBg: '#' + res.frame.map(v => v.toString(16).padStart(2, '0')).join(''), band: +res.band.toFixed(3), hole: +res.hole.toFixed(3),
      lost: res.lost, binds, styles, ills: src.ills.map(i => path.basename(i.src)), stops, warns};
    fs.writeFileSync(path.join(sd, nm + '.check.json'), JSON.stringify(rep, null, 1));
    all.push(rep);
    console.log(`${stops.length ? 'STOP' : warns.length ? 'WARN' : 'OK  '} ${nm}  ill ${(illShare * 100).toFixed(0)}%/${(illPx * 100).toFixed(0)}%  band ${(res.band * 100).toFixed(0)}%  hole ${(res.hole * 100).toFixed(0)}%  lost ${(res.lost * 100).toFixed(0)}%  bg ${rep.frameBg}  pal ${res.palette.slice(0, 3).map(c => c.hex).join(' ')}`);
    for (const s of stops) console.log('   STOP ' + s);
    for (const w of warns) console.log('   warn ' + w);
    await p.close();
  }
  // pack check
  let packStop = 0;
  if (pack && all.length > 1) {
    console.log('— pack —');
    const cnt = (key) => { const m = new Map(); for (const r of all) { const k = key(r); if (!k) continue; m.set(k, [...(m.get(k) || []), r.name]); } return [...m].filter(([, v]) => v.length > 1); };
    for (const [k, v] of cnt(r => r.ills.join('+'))) { console.log(`   STOP one illustration ${k}: ${v.join(', ')}`); packStop++; }
    for (const [k, v] of cnt(r => r.fonts.slice().sort().join(' + '))) if (v.length > T.packSame) console.log(`   warn font pair ${k} ×${v.length}: ${v.join(', ')}`);
    for (const [k, v] of cnt(r => r.styles.join('+'))) if (v.length > T.packSame) console.log(`   warn style ${k} ×${v.length}: ${v.join(', ')}`);
    // backgrounds: close colors (ΔE<0.04) in a row
    const lab = h => { const n = parseInt(h.slice(1), 16); const f = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; const [r, g, b] = [n >> 16 & 255, n >> 8 & 255, n & 255].map(f);
      const l = Math.cbrt(0.4122 * r + 0.5363 * g + 0.0514 * b), m = Math.cbrt(0.2119 * r + 0.6807 * g + 0.1074 * b), s = Math.cbrt(0.0883 * r + 0.2817 * g + 0.6300 * b);
      return [0.2105 * l + 0.7936 * m - 0.0041 * s, 1.978 * l - 2.4286 * m + 0.4506 * s, 0.0259 * l + 0.7828 * m - 0.8087 * s]; };
    const groups = [];
    for (const r of all) { const L = lab(r.frameBg); const g = groups.find(g => Math.hypot(...g.lab.map((v, i) => v - L[i])) < 0.025); if (g) g.names.push(r.name); else groups.push({lab: L, hex: r.frameBg, names: [r.name]}); }
    for (const g of groups) if (g.names.length > T.packSame) console.log(`   warn background ${g.hex} ×${g.names.length}: ${g.names.join(', ')}`);
  }
  await b.close();
  process.exit(all.some(r => r.stops.length) || packStop ? 1 : 0);
})();
