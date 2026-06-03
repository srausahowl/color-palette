let currentPalette=[];
const saved=JSON.parse(localStorage.getItem('palettes')||'[]');

function hslToHex(h,s,l){s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h/30)%12;return l-a*Math.max(Math.min(k-3,9-k,1),-1)};return`#${[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')}`}
function hexToRgb(h){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`rgb(${r},${g},${b})`}

function generate(mode='random'){
    const m=document.getElementById('modeSelect').value||mode;let colors=[];
    const baseH=Math.random()*360,baseS=50+Math.random()*40,baseL=40+Math.random()*30;
    switch(m){
        case'analogous':for(let i=0;i<5;i++)colors.push(hslToHex((baseH+i*30-60)%360,baseS,baseL+((i-2)*5)));break;
        case'complementary':for(let i=0;i<5;i++){const h=i<3?baseH:(baseH+180)%360;const l=baseL+(i%3)*10;colors.push(hslToHex(h,baseS,l))}break;
        case'triadic':colors=[hslToHex(baseH,baseS,baseL),hslToHex((baseH+120)%360,baseS,baseL),hslToHex((baseH+240)%360,baseS,baseL),hslToHex(baseH,baseS-20,baseL+20),hslToHex((baseH+180)%360,baseS-20,baseL+20)];break;
        case'monochrome':for(let i=0;i<5;i++)colors.push(hslToHex(baseH,baseS,20+i*15));break;
        case'pastel':for(let i=0;i<5;i++)colors.push(hslToHex(Math.random()*360,60+Math.random()*20,75+Math.random()*15));break;
        case'dark':for(let i=0;i<5;i++)colors.push(hslToHex(Math.random()*360,40+Math.random()*30,15+Math.random()*25));break;
        default:for(let i=0;i<5;i++)colors.push(hslToHex(Math.random()*360,50+Math.random()*40,35+Math.random()*35))
    }
    currentPalette=colors;renderPalette()}

function renderPalette(){const el=document.getElementById('palette');
el.innerHTML=currentPalette.map(c=>`<div class="color-col" style="background:${c}" onclick="copyColor('${c}',this)"><span class="hex">${c.toUpperCase()}</span><span class="rgb">${hexToRgb(c)}</span><div class="copy-msg">Copied!</div></div>`).join('')}

function copyColor(color,el){navigator.clipboard.writeText(color);const msg=el.querySelector('.copy-msg');msg.classList.add('show');setTimeout(()=>msg.classList.remove('show'),1000)}

function savePalette(){if(currentPalette.length){saved.unshift([...currentPalette]);if(saved.length>20)saved.pop();localStorage.setItem('palettes',JSON.stringify(saved));renderSaved()}}
function renderSaved(){document.getElementById('savedList').innerHTML=saved.map((p,i)=>`<div class="saved-palette" onclick="currentPalette=saved[${i}];renderPalette()">${p.map(c=>`<div style="background:${c}"></div>`).join('')}</div>`).join('')}

document.getElementById('generateBtn').addEventListener('click',()=>generate());
document.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target===document.body){e.preventDefault();generate()}});
document.getElementById('clearSaved').addEventListener('click',()=>{saved.length=0;localStorage.removeItem('palettes');renderSaved()});
document.getElementById('palette').addEventListener('dblclick',savePalette);
generate();renderSaved();