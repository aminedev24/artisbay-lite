(()=>{var Et=Object.defineProperty,St=Object.defineProperties;var zt=Object.getOwnPropertyDescriptors;var He=Object.getOwnPropertySymbols;var Ct=Object.prototype.hasOwnProperty,It=Object.prototype.propertyIsEnumerable;var De=i=>{throw TypeError(i)};var be=(i,t,e)=>t in i?Et(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e,A=(i,t)=>{for(var e in t||(t={}))Ct.call(t,e)&&be(i,e,t[e]);if(He)for(var e of He(t))It.call(t,e)&&be(i,e,t[e]);return i},H=(i,t)=>St(i,zt(t));var k=(i,t,e)=>be(i,typeof t!="symbol"?t+"":t,e),Rt=(i,t,e)=>t.has(i)||De("Cannot "+e);var Pe=(i,t,e)=>t.has(i)?De("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(i):t.set(i,e);var ie=(i,t,e)=>(Rt(i,t,"access private method"),e);var X="https://api.aurora-lumen.com",je="https://aurora-lumen.com",Oe=document.currentScript,q=Oe&&Oe.getAttribute("data-slug")||"artisbay",xe={display_name:"Aurora",company_name:"Artisbay",tagline:"Sales Assistant",greeting:"Hi! How can I help you today?",brand_color:"#1E398A",accent_color:"#FF9900",text_color:"#ffffff",logo_url:"",ref_link_base:"https://artisbay.com/vehicle/",default_mode:"artisbay_chat",widget_position:"bottom-right",widget_width:420,widget_height:620,quick_replies:["Browse stock \u{1F697}","Shipping cost \u{1F4E6}","Used tires \u{1F6DE}","How to order \u{1F4CB}","Contact team \u2709\uFE0F"],proactive_message:"\u{1F44B} Hi! Ask Aurora anything about our vehicles or services.",lead_form_title:"Contact the Artisbay Team"},Fe=`<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 14px rgba(30,57,138,.45))">
  <path d="M6 2 H38 A6 6 0 0 1 44 8 V26 A6 6 0 0 1 38 32 H25 L22 40 L19 32 H6 A6 6 0 0 1 0 26 V8 A6 6 0 0 1 6 2 Z"
        fill="#1DA1F2" stroke="#1E398A" stroke-width="2" stroke-linejoin="round"/>
  <text x="22" y="22" text-anchor="middle" font-size="12" font-weight="800" font-family="Arial,Helvetica,sans-serif" fill="#1E398A" letter-spacing="0.5">Chat</text>
</svg>`,Ze=["/Artisbay%20Bot%20Avatar/Artisbay%20Bot%20Avatar%20adult%201.png","/Artisbay%20Bot%20Avatar/Artisbay%20Bot%20Avatar%20adult%202.png","/Artisbay%20Bot%20Avatar/Artisbay%20Bot%20Avatar%20adult%203.png","/Artisbay%20Bot%20Avatar/Artisbay%20Bot%20Avatar%20adult%204.png"];function ve(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var F=ve();function Ye(i){F=i}var Ge=/[&<>"']/,Lt=new RegExp(Ge.source,"g"),Je=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,qt=new RegExp(Je.source,"g"),Mt={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Ue=i=>Mt[i];function C(i,t){if(t){if(Ge.test(i))return i.replace(Lt,Ue)}else if(Je.test(i))return i.replace(qt,Ue);return i}var Bt=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;function Nt(i){return i.replace(Bt,(t,e)=>(e=e.toLowerCase(),e==="colon"?":":e.charAt(0)==="#"?e.charAt(1)==="x"?String.fromCharCode(parseInt(e.substring(2),16)):String.fromCharCode(+e.substring(1)):""))}var Ht=/(^|[^\[])\^/g;function x(i,t){let e=typeof i=="string"?i:i.source;t=t||"";let n={replace:(o,r)=>{let s=typeof r=="string"?r:r.source;return s=s.replace(Ht,"$1"),e=e.replace(o,s),n},getRegex:()=>new RegExp(e,t)};return n}function We(i){try{i=encodeURI(i).replace(/%25/g,"%")}catch(t){return null}return i}var G={exec:()=>null};function Qe(i,t){let e=i.replace(/\|/g,(r,s,a)=>{let l=!1,u=s;for(;--u>=0&&a[u]==="\\";)l=!l;return l?"|":" |"}),n=e.split(/ \|/),o=0;if(n[0].trim()||n.shift(),n.length>0&&!n[n.length-1].trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push("");for(;o<n.length;o++)n[o]=n[o].trim().replace(/\\\|/g,"|");return n}function ae(i,t,e){let n=i.length;if(n===0)return"";let o=0;for(;o<n;){let r=i.charAt(n-o-1);if(r===t&&!e)o++;else if(r!==t&&e)o++;else break}return i.slice(0,n-o)}function Dt(i,t){if(i.indexOf(t[1])===-1)return-1;let e=0;for(let n=0;n<i.length;n++)if(i[n]==="\\")n++;else if(i[n]===t[0])e++;else if(i[n]===t[1]&&(e--,e<0))return n;return-1}function Ve(i,t,e,n){let o=t.href,r=t.title?C(t.title):null,s=i[1].replace(/\\([\[\]])/g,"$1");if(i[0].charAt(0)!=="!"){n.state.inLink=!0;let a={type:"link",raw:e,href:o,title:r,text:s,tokens:n.inlineTokens(s)};return n.state.inLink=!1,a}return{type:"image",raw:e,href:o,title:r,text:C(s)}}function Pt(i,t){let e=i.match(/^(\s+)(?:```)/);if(e===null)return t;let n=e[1];return t.split(`
`).map(o=>{let r=o.match(/^\s+/);if(r===null)return o;let[s]=r;return s.length>=n.length?o.slice(n.length):o}).join(`
`)}var Z=class{constructor(t){k(this,"options");k(this,"rules");k(this,"lexer");this.options=t||F}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=e[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:ae(n,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],o=Pt(n,e[3]||"");return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:o}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(/#$/.test(n)){let o=ae(n,"#");(this.options.pedantic||!o||/ $/.test(o))&&(n=o.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:e[0]}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=e[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,`
    $1`);n=ae(n.replace(/^ *>[ \t]?/gm,""),`
`);let o=this.lexer.state.top;this.lexer.state.top=!0;let r=this.lexer.blockTokens(n);return this.lexer.state.top=o,{type:"blockquote",raw:e[0],tokens:r,text:n}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),o=n.length>1,r={type:"list",raw:"",ordered:o,start:o?+n.slice(0,-1):"",loose:!1,items:[]};n=o?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=o?n:"[*+-]");let s=new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),a="",l="",u=!1;for(;t;){let c=!1;if(!(e=s.exec(t))||this.rules.block.hr.test(t))break;a=e[0],t=t.substring(a.length);let p=e[2].split(`
`,1)[0].replace(/^\t+/,y=>" ".repeat(3*y.length)),d=t.split(`
`,1)[0],f=0;this.options.pedantic?(f=2,l=p.trimStart()):(f=e[2].search(/[^ ]/),f=f>4?1:f,l=p.slice(f),f+=e[1].length);let g=!1;if(!p&&/^ *$/.test(d)&&(a+=d+`
`,t=t.substring(d.length+1),c=!0),!c){let y=new RegExp(`^ {0,${Math.min(3,f-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),$=new RegExp(`^ {0,${Math.min(3,f-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),v=new RegExp(`^ {0,${Math.min(3,f-1)}}(?:\`\`\`|~~~)`),R=new RegExp(`^ {0,${Math.min(3,f-1)}}#`);for(;t;){let z=t.split(`
`,1)[0];if(d=z,this.options.pedantic&&(d=d.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),v.test(d)||R.test(d)||y.test(d)||$.test(t))break;if(d.search(/[^ ]/)>=f||!d.trim())l+=`
`+d.slice(f);else{if(g||p.search(/[^ ]/)>=4||v.test(p)||R.test(p)||$.test(p))break;l+=`
`+d}!g&&!d.trim()&&(g=!0),a+=z+`
`,t=t.substring(z.length+1),p=d.slice(f)}}r.loose||(u?r.loose=!0:/\n *\n *$/.test(a)&&(u=!0));let h=null,w;this.options.gfm&&(h=/^\[[ xX]\] /.exec(l),h&&(w=h[0]!=="[ ] ",l=l.replace(/^\[[ xX]\] +/,""))),r.items.push({type:"list_item",raw:a,task:!!h,checked:w,loose:!1,text:l,tokens:[]}),r.raw+=a}r.items[r.items.length-1].raw=a.trimEnd(),r.items[r.items.length-1].text=l.trimEnd(),r.raw=r.raw.trimEnd();for(let c=0;c<r.items.length;c++)if(this.lexer.state.top=!1,r.items[c].tokens=this.lexer.blockTokens(r.items[c].text,[]),!r.loose){let p=r.items[c].tokens.filter(f=>f.type==="space"),d=p.length>0&&p.some(f=>/\n.*\n/.test(f.raw));r.loose=d}if(r.loose)for(let c=0;c<r.items.length;c++)r.items[c].loose=!0;return r}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(/\s+/g," "),o=e[2]?e[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:o,title:r}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!/[:|]/.test(e[2]))return;let n=Qe(e[1]),o=e[2].replace(/^\||\| *$/g,"").split("|"),r=e[3]&&e[3].trim()?e[3].replace(/\n[ \t]*$/,"").split(`
`):[],s={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===o.length){for(let a of o)/^ *-+: *$/.test(a)?s.align.push("right"):/^ *:-+: *$/.test(a)?s.align.push("center"):/^ *:-+ *$/.test(a)?s.align.push("left"):s.align.push(null);for(let a of n)s.header.push({text:a,tokens:this.lexer.inline(a)});for(let a of r)s.rows.push(Qe(a,s.header.length).map(l=>({text:l,tokens:this.lexer.inline(l)})));return s}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:C(e[1])}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&/^<a /i.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&/^</.test(n)){if(!/>$/.test(n))return;let s=ae(n.slice(0,-1),"\\");if((n.length-s.length)%2===0)return}else{let s=Dt(e[2],"()");if(s>-1){let l=(e[0].indexOf("!")===0?5:4)+e[1].length+s;e[2]=e[2].substring(0,s),e[0]=e[0].substring(0,l).trim(),e[3]=""}}let o=e[2],r="";if(this.options.pedantic){let s=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(o);s&&(o=s[1],r=s[3])}else r=e[3]?e[3].slice(1,-1):"";return o=o.trim(),/^</.test(o)&&(this.options.pedantic&&!/>$/.test(n)?o=o.slice(1):o=o.slice(1,-1)),Ve(e,{href:o&&o.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let o=(n[2]||n[1]).replace(/\s+/g," "),r=e[o.toLowerCase()];if(!r){let s=n[0].charAt(0);return{type:"text",raw:s,text:s}}return Ve(n,r,n[0],this.lexer)}}emStrong(t,e,n=""){let o=this.rules.inline.emStrongLDelim.exec(t);if(!o||o[3]&&n.match(/[\p{L}\p{N}]/u))return;if(!(o[1]||o[2]||"")||!n||this.rules.inline.punctuation.exec(n)){let s=[...o[0]].length-1,a,l,u=s,c=0,p=o[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(p.lastIndex=0,e=e.slice(-1*t.length+s);(o=p.exec(e))!=null;){if(a=o[1]||o[2]||o[3]||o[4]||o[5]||o[6],!a)continue;if(l=[...a].length,o[3]||o[4]){u+=l;continue}else if((o[5]||o[6])&&s%3&&!((s+l)%3)){c+=l;continue}if(u-=l,u>0)continue;l=Math.min(l,l+u+c);let d=[...o[0]][0].length,f=t.slice(0,s+o.index+d+l);if(Math.min(s,l)%2){let h=f.slice(1,-1);return{type:"em",raw:f,text:h,tokens:this.lexer.inlineTokens(h)}}let g=f.slice(2,-2);return{type:"strong",raw:f,text:g,tokens:this.lexer.inlineTokens(g)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(/\n/g," "),o=/[^ ]/.test(n),r=/^ /.test(n)&&/ $/.test(n);return o&&r&&(n=n.substring(1,n.length-1)),n=C(n,!0),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t){let e=this.rules.inline.del.exec(t);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,o;return e[2]==="@"?(n=C(e[1]),o="mailto:"+n):(n=C(e[1]),o=n),{type:"link",raw:e[0],text:n,href:o,tokens:[{type:"text",raw:n,text:n}]}}}url(t){var n,o;let e;if(e=this.rules.inline.url.exec(t)){let r,s;if(e[2]==="@")r=C(e[0]),s="mailto:"+r;else{let a;do a=e[0],e[0]=(o=(n=this.rules.inline._backpedal.exec(e[0]))==null?void 0:n[0])!=null?o:"";while(a!==e[0]);r=C(e[0]),e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n;return this.lexer.state.inRawBlock?n=e[0]:n=C(e[0]),{type:"text",raw:e[0],text:n}}}},Ot=/^(?: *(?:\n|$))+/,jt=/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,Ft=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,K=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Zt=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Ke=/(?:[*+-]|\d{1,9}[.)])/,et=x(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,Ke).replace(/blockCode/g,/ {4}/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),$e=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ut=/^[^\n]+/,_e=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Wt=x(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label",_e).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Qt=x(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Ke).getRegex(),pe="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Te=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Vt=x("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))","i").replace("comment",Te).replace("tag",pe).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),tt=x($e).replace("hr",K).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pe).getRegex(),Xt=x(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",tt).getRegex(),Ae={blockquote:Xt,code:jt,def:Wt,fences:Ft,heading:Zt,hr:K,html:Vt,lheading:et,list:Qt,newline:Ot,paragraph:tt,table:G,text:Ut},Xe=x("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",K).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pe).getRegex(),Yt=H(A({},Ae),{table:Xe,paragraph:x($e).replace("hr",K).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Xe).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pe).getRegex()}),Gt=H(A({},Ae),{html:x(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Te).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:G,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:x($e).replace("hr",K).replace("heading",` *#{1,6} *[^
]`).replace("lheading",et).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()}),nt=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Jt=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,st=/^( {2,}|\\)\n(?!\s*$)/,Kt=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ee="\\p{P}\\p{S}",en=x(/^((?![*_])[\spunctuation])/,"u").replace(/punctuation/g,ee).getRegex(),tn=/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,nn=x(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,"u").replace(/punct/g,ee).getRegex(),sn=x("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])","gu").replace(/punct/g,ee).getRegex(),on=x("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])","gu").replace(/punct/g,ee).getRegex(),rn=x(/\\([punct])/,"gu").replace(/punct/g,ee).getRegex(),an=x(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ln=x(Te).replace("(?:-->|$)","-->").getRegex(),cn=x("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ln).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),ce=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,pn=x(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",ce).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ot=x(/^!?\[(label)\]\[(ref)\]/).replace("label",ce).replace("ref",_e).getRegex(),rt=x(/^!?\[(ref)\](?:\[\])?/).replace("ref",_e).getRegex(),dn=x("reflink|nolink(?!\\()","g").replace("reflink",ot).replace("nolink",rt).getRegex(),Ee={_backpedal:G,anyPunctuation:rn,autolink:an,blockSkip:tn,br:st,code:Jt,del:G,emStrongLDelim:nn,emStrongRDelimAst:sn,emStrongRDelimUnd:on,escape:nt,link:pn,nolink:rt,punctuation:en,reflink:ot,reflinkSearch:dn,tag:cn,text:Kt,url:G},un=H(A({},Ee),{link:x(/^!?\[(label)\]\((.*?)\)/).replace("label",ce).getRegex(),reflink:x(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ce).getRegex()}),we=H(A({},Ee),{escape:x(nt).replace("])","~|])").getRegex(),url:x(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/}),hn=H(A({},we),{br:x(st).replace("{2,}","*").getRegex(),text:x(we.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()}),le={normal:Ae,gfm:Yt,pedantic:Gt},Y={normal:Ee,gfm:we,breaks:hn,pedantic:un},M=class i{constructor(t){k(this,"tokens");k(this,"options");k(this,"state");k(this,"tokenizer");k(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=t||F,this.options.tokenizer=this.options.tokenizer||new Z,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let e={block:le.normal,inline:Y.normal};this.options.pedantic?(e.block=le.pedantic,e.inline=Y.pedantic):this.options.gfm&&(e.block=le.gfm,this.options.breaks?e.inline=Y.breaks:e.inline=Y.gfm),this.tokenizer.rules=e}static get rules(){return{block:le,inline:Y}}static lex(t,e){return new i(e).lex(t)}static lexInline(t,e){return new i(e).inlineTokens(t)}lex(t){t=t.replace(/\r\n|\r/g,`
`),this.blockTokens(t,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let n=this.inlineQueue[e];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,e=[]){this.options.pedantic?t=t.replace(/\t/g,"    ").replace(/^ +$/gm,""):t=t.replace(/^( *)(\t+)/gm,(a,l,u)=>l+"    ".repeat(u.length));let n,o,r,s;for(;t;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(a=>(n=a.call({lexer:this},t,e))?(t=t.substring(n.raw.length),e.push(n),!0):!1))){if(n=this.tokenizer.space(t)){t=t.substring(n.raw.length),n.raw.length===1&&e.length>0?e[e.length-1].raw+=`
`:e.push(n);continue}if(n=this.tokenizer.code(t)){t=t.substring(n.raw.length),o=e[e.length-1],o&&(o.type==="paragraph"||o.type==="text")?(o.raw+=`
`+n.raw,o.text+=`
`+n.text,this.inlineQueue[this.inlineQueue.length-1].src=o.text):e.push(n);continue}if(n=this.tokenizer.fences(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.heading(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.hr(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.blockquote(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.list(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.html(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.def(t)){t=t.substring(n.raw.length),o=e[e.length-1],o&&(o.type==="paragraph"||o.type==="text")?(o.raw+=`
`+n.raw,o.text+=`
`+n.raw,this.inlineQueue[this.inlineQueue.length-1].src=o.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title});continue}if(n=this.tokenizer.table(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.lheading(t)){t=t.substring(n.raw.length),e.push(n);continue}if(r=t,this.options.extensions&&this.options.extensions.startBlock){let a=1/0,l=t.slice(1),u;this.options.extensions.startBlock.forEach(c=>{u=c.call({lexer:this},l),typeof u=="number"&&u>=0&&(a=Math.min(a,u))}),a<1/0&&a>=0&&(r=t.substring(0,a+1))}if(this.state.top&&(n=this.tokenizer.paragraph(r))){o=e[e.length-1],s&&o.type==="paragraph"?(o.raw+=`
`+n.raw,o.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=o.text):e.push(n),s=r.length!==t.length,t=t.substring(n.raw.length);continue}if(n=this.tokenizer.text(t)){t=t.substring(n.raw.length),o=e[e.length-1],o&&o.type==="text"?(o.raw+=`
`+n.raw,o.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=o.text):e.push(n);continue}if(t){let a="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,e}inline(t,e=[]){return this.inlineQueue.push({src:t,tokens:e}),e}inlineTokens(t,e=[]){let n,o,r,s=t,a,l,u;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(a=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)c.includes(a[0].slice(a[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(a=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)s=s.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(a=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,a.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;t;)if(l||(u=""),l=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(c=>(n=c.call({lexer:this},t,e))?(t=t.substring(n.raw.length),e.push(n),!0):!1))){if(n=this.tokenizer.escape(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.tag(t)){t=t.substring(n.raw.length),o=e[e.length-1],o&&n.type==="text"&&o.type==="text"?(o.raw+=n.raw,o.text+=n.text):e.push(n);continue}if(n=this.tokenizer.link(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(n.raw.length),o=e[e.length-1],o&&n.type==="text"&&o.type==="text"?(o.raw+=n.raw,o.text+=n.text):e.push(n);continue}if(n=this.tokenizer.emStrong(t,s,u)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.codespan(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.br(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.del(t)){t=t.substring(n.raw.length),e.push(n);continue}if(n=this.tokenizer.autolink(t)){t=t.substring(n.raw.length),e.push(n);continue}if(!this.state.inLink&&(n=this.tokenizer.url(t))){t=t.substring(n.raw.length),e.push(n);continue}if(r=t,this.options.extensions&&this.options.extensions.startInline){let c=1/0,p=t.slice(1),d;this.options.extensions.startInline.forEach(f=>{d=f.call({lexer:this},p),typeof d=="number"&&d>=0&&(c=Math.min(c,d))}),c<1/0&&c>=0&&(r=t.substring(0,c+1))}if(n=this.tokenizer.inlineText(r)){t=t.substring(n.raw.length),n.raw.slice(-1)!=="_"&&(u=n.raw.slice(-1)),l=!0,o=e[e.length-1],o&&o.type==="text"?(o.raw+=n.raw,o.text+=n.text):e.push(n);continue}if(t){let c="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return e}},U=class{constructor(t){k(this,"options");this.options=t||F}code(t,e,n){var r;let o=(r=(e||"").match(/^\S*/))==null?void 0:r[0];return t=t.replace(/\n$/,"")+`
`,o?'<pre><code class="language-'+C(o)+'">'+(n?t:C(t,!0))+`</code></pre>
`:"<pre><code>"+(n?t:C(t,!0))+`</code></pre>
`}blockquote(t){return`<blockquote>
${t}</blockquote>
`}html(t,e){return t}heading(t,e,n){return`<h${e}>${t}</h${e}>
`}hr(){return`<hr>
`}list(t,e,n){let o=e?"ol":"ul",r=e&&n!==1?' start="'+n+'"':"";return"<"+o+r+`>
`+t+"</"+o+`>
`}listitem(t,e,n){return`<li>${t}</li>
`}checkbox(t){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph(t){return`<p>${t}</p>
`}table(t,e){return e&&(e=`<tbody>${e}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+e+`</table>
`}tablerow(t){return`<tr>
${t}</tr>
`}tablecell(t,e){let n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong(t){return`<strong>${t}</strong>`}em(t){return`<em>${t}</em>`}codespan(t){return`<code>${t}</code>`}br(){return"<br>"}del(t){return`<del>${t}</del>`}link(t,e,n){let o=We(t);if(o===null)return n;t=o;let r='<a href="'+t+'"';return e&&(r+=' title="'+e+'"'),r+=">"+n+"</a>",r}image(t,e,n){let o=We(t);if(o===null)return n;t=o;let r=`<img src="${t}" alt="${n}"`;return e&&(r+=` title="${e}"`),r+=">",r}text(t){return t}},J=class{strong(t){return t}em(t){return t}codespan(t){return t}del(t){return t}html(t){return t}text(t){return t}link(t,e,n){return""+n}image(t,e,n){return""+n}br(){return""}},B=class i{constructor(t){k(this,"options");k(this,"renderer");k(this,"textRenderer");this.options=t||F,this.options.renderer=this.options.renderer||new U,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new J}static parse(t,e){return new i(e).parse(t)}static parseInline(t,e){return new i(e).parseInline(t)}parse(t,e=!0){let n="";for(let o=0;o<t.length;o++){let r=t[o];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[r.type]){let s=r,a=this.options.extensions.renderers[s.type].call({parser:this},s);if(a!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(s.type)){n+=a||"";continue}}switch(r.type){case"space":continue;case"hr":{n+=this.renderer.hr();continue}case"heading":{let s=r;n+=this.renderer.heading(this.parseInline(s.tokens),s.depth,Nt(this.parseInline(s.tokens,this.textRenderer)));continue}case"code":{let s=r;n+=this.renderer.code(s.text,s.lang,!!s.escaped);continue}case"table":{let s=r,a="",l="";for(let c=0;c<s.header.length;c++)l+=this.renderer.tablecell(this.parseInline(s.header[c].tokens),{header:!0,align:s.align[c]});a+=this.renderer.tablerow(l);let u="";for(let c=0;c<s.rows.length;c++){let p=s.rows[c];l="";for(let d=0;d<p.length;d++)l+=this.renderer.tablecell(this.parseInline(p[d].tokens),{header:!1,align:s.align[d]});u+=this.renderer.tablerow(l)}n+=this.renderer.table(a,u);continue}case"blockquote":{let s=r,a=this.parse(s.tokens);n+=this.renderer.blockquote(a);continue}case"list":{let s=r,a=s.ordered,l=s.start,u=s.loose,c="";for(let p=0;p<s.items.length;p++){let d=s.items[p],f=d.checked,g=d.task,h="";if(d.task){let w=this.renderer.checkbox(!!f);u?d.tokens.length>0&&d.tokens[0].type==="paragraph"?(d.tokens[0].text=w+" "+d.tokens[0].text,d.tokens[0].tokens&&d.tokens[0].tokens.length>0&&d.tokens[0].tokens[0].type==="text"&&(d.tokens[0].tokens[0].text=w+" "+d.tokens[0].tokens[0].text)):d.tokens.unshift({type:"text",text:w+" "}):h+=w+" "}h+=this.parse(d.tokens,u),c+=this.renderer.listitem(h,g,!!f)}n+=this.renderer.list(c,a,l);continue}case"html":{let s=r;n+=this.renderer.html(s.text,s.block);continue}case"paragraph":{let s=r;n+=this.renderer.paragraph(this.parseInline(s.tokens));continue}case"text":{let s=r,a=s.tokens?this.parseInline(s.tokens):s.text;for(;o+1<t.length&&t[o+1].type==="text";)s=t[++o],a+=`
`+(s.tokens?this.parseInline(s.tokens):s.text);n+=e?this.renderer.paragraph(a):a;continue}default:{let s='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return n}parseInline(t,e){e=e||this.renderer;let n="";for(let o=0;o<t.length;o++){let r=t[o];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[r.type]){let s=this.options.extensions.renderers[r.type].call({parser:this},r);if(s!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(r.type)){n+=s||"";continue}}switch(r.type){case"escape":{let s=r;n+=e.text(s.text);break}case"html":{let s=r;n+=e.html(s.text);break}case"link":{let s=r;n+=e.link(s.href,s.title,this.parseInline(s.tokens,e));break}case"image":{let s=r;n+=e.image(s.href,s.title,s.text);break}case"strong":{let s=r;n+=e.strong(this.parseInline(s.tokens,e));break}case"em":{let s=r;n+=e.em(this.parseInline(s.tokens,e));break}case"codespan":{let s=r;n+=e.codespan(s.text);break}case"br":{n+=e.br();break}case"del":{let s=r;n+=e.del(this.parseInline(s.tokens,e));break}case"text":{let s=r;n+=e.text(s.text);break}default:{let s='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return n}},P=class{constructor(t){k(this,"options");this.options=t||F}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}};k(P,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));var j,ye,it,ke=class{constructor(...t){Pe(this,j);k(this,"defaults",ve());k(this,"options",this.setOptions);k(this,"parse",ie(this,j,ye).call(this,M.lex,B.parse));k(this,"parseInline",ie(this,j,ye).call(this,M.lexInline,B.parseInline));k(this,"Parser",B);k(this,"Renderer",U);k(this,"TextRenderer",J);k(this,"Lexer",M);k(this,"Tokenizer",Z);k(this,"Hooks",P);this.use(...t)}walkTokens(t,e){var o,r;let n=[];for(let s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{let a=s;for(let l of a.header)n=n.concat(this.walkTokens(l.tokens,e));for(let l of a.rows)for(let u of l)n=n.concat(this.walkTokens(u.tokens,e));break}case"list":{let a=s;n=n.concat(this.walkTokens(a.items,e));break}default:{let a=s;(r=(o=this.defaults.extensions)==null?void 0:o.childTokens)!=null&&r[a.type]?this.defaults.extensions.childTokens[a.type].forEach(l=>{let u=a[l].flat(1/0);n=n.concat(this.walkTokens(u,e))}):a.tokens&&(n=n.concat(this.walkTokens(a.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let o=A({},n);if(o.async=this.defaults.async||o.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let s=e.renderers[r.name];s?e.renderers[r.name]=function(...a){let l=r.renderer.apply(this,a);return l===!1&&(l=s.apply(this,a)),l}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let s=e[r.level];s?s.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),o.extensions=e),n.renderer){let r=this.defaults.renderer||new U(this.defaults);for(let s in n.renderer){if(!(s in r))throw new Error(`renderer '${s}' does not exist`);if(s==="options")continue;let a=s,l=n.renderer[a],u=r[a];r[a]=(...c)=>{let p=l.apply(r,c);return p===!1&&(p=u.apply(r,c)),p||""}}o.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Z(this.defaults);for(let s in n.tokenizer){if(!(s in r))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;let a=s,l=n.tokenizer[a],u=r[a];r[a]=(...c)=>{let p=l.apply(r,c);return p===!1&&(p=u.apply(r,c)),p}}o.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new P;for(let s in n.hooks){if(!(s in r))throw new Error(`hook '${s}' does not exist`);if(s==="options")continue;let a=s,l=n.hooks[a],u=r[a];P.passThroughHooks.has(s)?r[a]=c=>{if(this.defaults.async)return Promise.resolve(l.call(r,c)).then(d=>u.call(r,d));let p=l.call(r,c);return u.call(r,p)}:r[a]=(...c)=>{let p=l.apply(r,c);return p===!1&&(p=u.apply(r,c)),p}}o.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,s=n.walkTokens;o.walkTokens=function(a){let l=[];return l.push(s.call(this,a)),r&&(l=l.concat(r.call(this,a))),l}}this.defaults=A(A({},this.defaults),o)}),this}setOptions(t){return this.defaults=A(A({},this.defaults),t),this}lexer(t,e){return M.lex(t,e!=null?e:this.defaults)}parser(t,e){return B.parse(t,e!=null?e:this.defaults)}};j=new WeakSet,ye=function(t,e){return(n,o)=>{let r=A({},o),s=A(A({},this.defaults),r);this.defaults.async===!0&&r.async===!1&&(s.silent||console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."),s.async=!0);let a=ie(this,j,it).call(this,!!s.silent,!!s.async);if(typeof n=="undefined"||n===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));if(s.hooks&&(s.hooks.options=s),s.async)return Promise.resolve(s.hooks?s.hooks.preprocess(n):n).then(l=>t(l,s)).then(l=>s.hooks?s.hooks.processAllTokens(l):l).then(l=>s.walkTokens?Promise.all(this.walkTokens(l,s.walkTokens)).then(()=>l):l).then(l=>e(l,s)).then(l=>s.hooks?s.hooks.postprocess(l):l).catch(a);try{s.hooks&&(n=s.hooks.preprocess(n));let l=t(n,s);s.hooks&&(l=s.hooks.processAllTokens(l)),s.walkTokens&&this.walkTokens(l,s.walkTokens);let u=e(l,s);return s.hooks&&(u=s.hooks.postprocess(u)),u}catch(l){return a(l)}}},it=function(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let o="<p>An error occurred:</p><pre>"+C(n.message+"",!0)+"</pre>";return e?Promise.resolve(o):o}if(e)return Promise.reject(n);throw n}};var O=new ke;function b(i,t){return O.parse(i,t)}b.options=b.setOptions=function(i){return O.setOptions(i),b.defaults=O.defaults,Ye(b.defaults),b};b.getDefaults=ve;b.defaults=F;b.use=function(...i){return O.use(...i),b.defaults=O.defaults,Ye(b.defaults),b};b.walkTokens=function(i,t){return O.walkTokens(i,t)};b.parseInline=O.parseInline;b.Parser=B;b.parser=B.parse;b.Renderer=U;b.TextRenderer=J;b.Lexer=M;b.lexer=M.lex;b.Tokenizer=Z;b.Hooks=P;b.parse=b;var $n=b.options,_n=b.setOptions,Tn=b.use,An=b.walkTokens,En=b.parseInline;var Sn=B.parse,zn=M.lex;b.use({breaks:!0,gfm:!0,renderer:{link(i,t,e){let n=i&&typeof i=="object"?i:{href:i,title:t,text:e},o=!n.href||n.href.startsWith("javascript:")?"#":n.href,r=n.title?` title="${n.title}"`:"";return`<a href="${o}" target="_blank" rel="noopener noreferrer"${r}>${n.text||o}</a>`},code(i){return`<p>${i&&typeof i=="object"?i.text:i}</p>`},codespan(i){return i&&typeof i=="object"?i.text:i},table(i,t){return i&&typeof i=="object"?!1:`<div class="tbl-wrap"><table><thead>${i}</thead>${t?`<tbody>${t}</tbody>`:""}</table></div>`}}});var Se="";function at(i){Se=(i||"").trim()}var fn=/(\[[^\]]*)?[*_]{0,2}\bREF:?[\s*_]*(\d{3,})\b[*_]{0,2}(\]\([^)]*\))?/gi;function gn(i){return Se?i.replace(fn,(t,e,n,o)=>e||o?t:`[REF: ${n}](${Se}${n})`):i}var mn=/^(\s*)\*\*(?!.*\*\*)/gm;function W(i){if(!i)return"";let t=b.parse(gn(i.replace(mn,"$1"))),e=document.createElement("div");return e.innerHTML=t,e.querySelectorAll("script,style,iframe,object,embed,form").forEach(n=>n.remove()),e.querySelectorAll("a").forEach(n=>{let o=(n.getAttribute("href")||"").trim();(o===""||o==="#"||o.endsWith("/#"))&&n.replaceWith(...n.childNodes)}),e.querySelectorAll("*").forEach(n=>{[...n.attributes].forEach(o=>{o.name.startsWith("on")&&n.removeAttribute(o.name),o.name==="href"&&o.value.startsWith("javascript:")&&n.setAttribute("href","#")})}),e.innerHTML}function lt({brand:i,accent:t,onBrand:e,onLeft:n,widgetWidth:o,widgetHeight:r}){let s=c=>{let p=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);return p?`${parseInt(p[1],16)},${parseInt(p[2],16)},${parseInt(p[3],16)}`:"26,115,232"},a=s(i),l=s(t||i),u="linear-gradient(135deg,#1a73e8 0%,#1DA1F2 60%,#0ea5e9 100%)";return`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

    /* \u2500\u2500 FAB bubble \u2500\u2500 */
    .wb{
      position:fixed;bottom:24px;${n?"left":"right"}:24px;
      width:64px;height:64px;border-radius:50%;border:none;cursor:pointer;
      background:transparent;color:${i};
      display:flex;align-items:center;justify-content:center;
      box-shadow:none;
      transition:transform .18s,box-shadow .18s;
      pointer-events:all;overflow:visible;flex-shrink:0;
    }
    .wb:hover{transform:scale(1.1);}
    .wb.is-open{background:${i};color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.3);overflow:hidden;}
    .wb svg{width:44px;height:44px;flex-shrink:0}

    /* \u2500\u2500 Messenger FAB (above chat bubble) \u2500\u2500 */
    .wmb{
      position:fixed;bottom:100px;${n?"left":"right"}:28px;
      width:52px;height:52px;border-radius:50%;
      background:#0084FF;color:#fff;
      display:flex;align-items:center;justify-content:center;
      text-decoration:none;
      box-shadow:0 3px 12px rgba(0,132,255,.45);
      transition:transform .18s,box-shadow .18s;
      pointer-events:all;
    }
    .wmb:hover{transform:scale(1.1);box-shadow:0 5px 16px rgba(0,132,255,.6)}
    .wmb svg{width:30px;height:30px;flex-shrink:0}
    @media(max-width:480px){.wmb{bottom:96px;${n?"left":"right"}:20px;width:46px;height:46px}}

    /* \u2500\u2500 Panel \u2500\u2500 */
    .wp{
      position:fixed;
      bottom:96px;${n?"left":"right"}:24px;
      width:min(${o}px,calc(100vw - 16px));
      height:min(${r}px,calc(100vh - 100px));
      background:#fff;border-radius:16px;
      box-shadow:0 8px 40px rgba(0,0,0,.18);
      display:flex;flex-direction:column;overflow:hidden;
      pointer-events:none;
      opacity:0;transform:translateY(14px) scale(.97);
      transition:opacity .22s,transform .22s;
    }
    .wp.open{opacity:1;transform:none;pointer-events:all}

    @media(max-width:480px){
      .wp{top:0;left:0;right:0;bottom:0;width:100%;height:100%;border-radius:0}
      .wb.is-open{display:none}
    }

    /* \u2500\u2500 Resize handle \u2500\u2500 */
    .wr{
      position:absolute;top:0;${n?"right":"left"}:0;
      width:22px;height:22px;cursor:nw-resize;
      display:flex;align-items:flex-start;justify-content:${n?"flex-end":"flex-start"};
      padding:4px;z-index:10;
    }
    .wr svg{width:12px;height:12px;color:rgba(255,255,255,.7);filter:drop-shadow(0 0 1px rgba(0,0,0,.5))}
    @media(max-width:480px){.wr{display:none}}

    /* \u2500\u2500 Header \u2500\u2500 */
    .wh{
      background:${u};color:#fff;
      padding:13px 16px;
      display:flex;align-items:center;justify-content:space-between;gap:10px;flex-shrink:0;
    }
    .wh-left{display:flex;align-items:center;gap:10px}
    .wh-logo{width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:center top;flex-shrink:0;border:2px solid rgba(255,255,255,.35)}
    .wh-avatar{
      width:52px;height:52px;border-radius:50%;flex-shrink:0;
      background:rgba(255,255,255,.22);
      display:flex;align-items:center;justify-content:center;
      font-size:18px;font-weight:700;color:#fff;
    }
    .wh-info{flex:1;min-width:0}
    .wh-name{font-size:15px;font-weight:700;line-height:1.2;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .wh-tagline{font-size:11px;color:rgba(255,255,255,.8);margin-top:1px;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .wh-status{display:flex;align-items:center;gap:5px;margin-top:3px}
    .wh-status-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;flex-shrink:0;box-shadow:0 0 0 2px rgba(74,222,128,.35)}
    .wh-status-txt{font-size:10px;color:rgba(255,255,255,.85)}
    .wh-close{
      background:none;border:none;cursor:pointer;
      color:#fff;padding:5px;border-radius:7px;
      display:flex;align-items:center;justify-content:center;
      opacity:.75;transition:background .15s,opacity .15s;
    }
    .wh-close:hover{background:rgba(255,255,255,.18);opacity:1}
    .wh-close svg{width:18px;height:18px}

    /* \u2500\u2500 Messages area \u2500\u2500 */
    .wm{
      flex:1;overflow-y:auto;padding:16px;
      display:flex;flex-direction:column;gap:10px;
      scroll-behavior:smooth;
    }
    .wm::-webkit-scrollbar{width:4px}
    .wm::-webkit-scrollbar-track{background:transparent}
    .wm::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px}

    /* \u2500\u2500 Scroll-to-bottom button \u2500\u2500 */
    .aw-scroll-btn{
      position:absolute;bottom:100px;left:50%;transform:translateX(-50%);
      width:32px;height:32px;border-radius:50%;
      border:1.5px solid ${t||"#1DA1F2"};
      background:#fff;color:${t||"#1DA1F2"};
      font-size:16px;line-height:1;cursor:pointer;
      display:none;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,.18);
      transition:background .15s,color .15s;
      z-index:20;
      animation:aw-scroll-btn-in .18s ease;
    }
    .aw-scroll-btn:hover{background:${t||"#1DA1F2"};color:#fff}
    @keyframes aw-scroll-btn-in{
      from{opacity:0;transform:translateX(-50%) translateY(6px)}
      to{opacity:1;transform:translateX(-50%) translateY(0)}
    }

    /* \u2500\u2500 Message bubbles \u2500\u2500 */
    .msg{display:flex;flex-direction:column}
    .msg.bot{align-self:flex-start;max-width:100%;flex-direction:row;gap:8px;align-items:flex-start}
    .msg.user{align-self:flex-end;max-width:88%}
    .msg-col{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0}
    .msg-avatar{
      width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0;
      border:1px solid rgba(0,0,0,.08);background:#fff;
      box-shadow:0 2px 6px rgba(0,0,0,.12);
    }

    .msg-bbl{
      padding:10px 14px;border-radius:16px;
      font-size:14px;line-height:1.58;word-break:break-word;
    }
    .msg.bot .msg-bbl{
      background:#f0f7ff;color:#1a1a2e;
      border-bottom-left-radius:4px;
      border-left:3px solid #1DA1F2;
    }
    .msg.user .msg-bbl{
      background:${u};color:#fff;
      border-bottom-right-radius:4px;
      white-space:pre-wrap;
    }

    /* \u2500\u2500 Markdown inside bot bubble \u2500\u2500 */
    .msg.bot .msg-bbl p{margin:0 0 6px}
    .msg.bot .msg-bbl p:last-child{margin-bottom:0}
    .msg.bot .msg-bbl ul,.msg.bot .msg-bbl ol{padding-left:18px;margin:4px 0 6px}
    .msg.bot .msg-bbl li{margin-bottom:2px}
    .msg.bot .msg-bbl a{color:#1DA1F2;text-decoration:underline;word-break:break-all}
    .msg.bot .msg-bbl strong{font-weight:600}
    .msg.bot .msg-bbl em{font-style:italic}
    .msg.bot .msg-bbl code{background:#e0f0ff;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12.5px}
    .msg.bot .msg-bbl pre{background:#1e293b;color:#e2e8f0;padding:10px 12px;border-radius:8px;overflow-x:auto;font-size:12px;margin:6px 0}
    .msg.bot .msg-bbl pre code{background:none;padding:0;color:inherit}
    .msg.bot .msg-bbl h1,.msg.bot .msg-bbl h2,.msg.bot .msg-bbl h3{font-size:14px;font-weight:700;margin:6px 0 3px}
    .msg.bot .msg-bbl blockquote{border-left:3px solid #1DA1F2;margin:4px 0;padding-left:10px;opacity:.8}
    .msg.bot .msg-bbl .tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;margin:6px 0}
    .msg.bot .msg-bbl table{border-collapse:collapse;width:100%;font-size:12.5px}
    .msg.bot .msg-bbl th,.msg.bot .msg-bbl td{border:1px solid #bde0fc;padding:5px 8px;text-align:left}
    .msg.bot .msg-bbl th{background:rgba(29,161,242,.08);font-weight:600}
    .msg.bot .msg-bbl tr:nth-child(even) td{background:#f0f7ff}
    .msg.bot .msg-bbl hr{border:none;border-top:1px solid #e0e0e0;margin:8px 0}

    /* \u2500\u2500 Typing dots \u2014 left-aligned inside a bot-style bubble \u2500\u2500 */
    .typing-bbl{
      align-self:flex-start;
      background:#f0f7ff;
      border-left:3px solid #1DA1F2;
      border-radius:16px;border-bottom-left-radius:4px;
      padding:10px 14px;
      display:inline-flex;align-items:center;gap:5px;
    }
    .typing-bbl span{
      width:7px;height:7px;border-radius:50%;
      background:#1DA1F2;
      animation:tbounce 1.2s ease-in-out infinite;
    }
    .typing-bbl span:nth-child(2){animation-delay:.15s}
    .typing-bbl span:nth-child(3){animation-delay:.3s}
    @keyframes tbounce{
      0%,60%,100%{transform:translateY(0);opacity:.4}
      30%{transform:translateY(-6px);opacity:1}
    }

    /* \u2500\u2500 Timestamp \u2500\u2500 */
    .msg-ts{font-size:10px;color:#bbb;padding:2px 2px 0}
    .msg.bot .msg-ts{align-self:flex-start}
    .msg.user .msg-ts{align-self:flex-end}

    /* \u2500\u2500 Copy button \u2500\u2500 */
    .msg-copy{
      background:rgba(255,255,255,.9);border:1px solid #e0e0e0;
      border-radius:6px;padding:2px 7px;cursor:pointer;
      font-size:11px;color:#555;opacity:0;transition:opacity .15s;
      pointer-events:none;align-self:flex-start;margin-top:2px;
    }
    .msg.bot:hover .msg-copy{opacity:1;pointer-events:all}
    .msg-copy:hover{background:#f0f0f0}

    /* \u2500\u2500 Quick replies \u2500\u2500 */
    .qr-wrap{display:flex;flex-wrap:wrap;gap:7px;padding:4px 0}
    .qr-btn{
      padding:6px 13px;border-radius:20px;border:1.5px solid #1DA1F2;
      background:#fff;color:#1DA1F2;font-size:13px;cursor:pointer;
      font-family:inherit;transition:background .15s,color .15s;
    }
    .qr-btn:hover{background:#1DA1F2;color:#fff}

    /* \u2500\u2500 Input row \u2500\u2500 */
    .wi{
      padding:11px 13px;border-top:1px solid #eaedf4;
      display:flex;gap:8px;align-items:flex-end;
      background:#fff;flex-shrink:0;
    }
    .wi-ta{
      flex:1;resize:none;border:1.5px solid #dde2ef;
      border-radius:10px;padding:9px 12px;
      font-size:14px;line-height:1.45;outline:none;
      font-family:inherit;max-height:120px;overflow-y:auto;
      transition:border-color .15s;background:#fff;color:#1a1a2e;
    }
    .wi-ta:focus{border-color:#1DA1F2}
    .wi-ta::placeholder{color:#aab}
    .wi-send{
      width:38px;height:38px;flex-shrink:0;
      background:#1DA1F2;color:#fff;
      border:none;border-radius:10px;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      transition:opacity .15s,transform .1s;
    }
    .wi-send:hover{opacity:.88}
    .wi-send:active{transform:scale(.93)}
    .wi-send:disabled{opacity:.35;cursor:default;transform:none}
    .wi-send svg{width:17px;height:17px}

    /* \u2500\u2500 Powered by \u2500\u2500 */
    .wpb{
      text-align:center;padding:5px 8px;
      font-size:10.5px;color:#bbb;
      border-top:1px solid #f2f2f2;flex-shrink:0;
    }
    .wpb a{color:#bbb;text-decoration:none}
    .wpb a:hover{color:#999}

    /* \u2500\u2500 Proactive notification \u2500\u2500 */
    .wnotif{
      position:fixed;bottom:96px;${n?"left":"right"}:24px;
      background:${u};color:#fff;
      padding:11px 34px 11px 14px;border-radius:14px 14px ${n?"14px 0":"0 14px"};
      box-shadow:0 4px 18px rgba(0,0,0,.25);
      font-size:13.5px;font-weight:600;line-height:1.4;max-width:240px;
      pointer-events:all;cursor:pointer;
      animation:wslide .35s cubic-bezier(.34,1.56,.64,1);z-index:9;
    }
    @keyframes wslide{from{opacity:0;transform:translateY(14px) scale(.92)}to{opacity:1;transform:none}}
    .wnotif-x{
      position:absolute;top:7px;right:9px;font-size:14px;
      opacity:.6;cursor:pointer;line-height:1;color:#fff;
      background:none;border:none;padding:0;
    }
    .wnotif-x:hover{opacity:1}

    /* \u2500\u2500 Radar/ping rings \u2014 always on, hidden when open \u2500\u2500 */
    .wb::before,.wb::after{
      content:'';
      position:absolute;top:50%;left:50%;
      width:54px;height:54px;
      margin-top:-27px;margin-left:-27px;
      border-radius:50%;
      background:rgba(${l},1);
      animation:wradar 2.4s ease-out infinite;
      pointer-events:none;
      z-index:-1;
    }
    .wb::after{animation-delay:1.2s}
    .wb.is-open::before,.wb.is-open::after{display:none}
    @keyframes wradar{
      0%{transform:scale(1);opacity:.7}
      100%{transform:scale(2.7);opacity:0}
    }

    /* \u2500\u2500 Legacy shake/pulse (kept for compat) \u2500\u2500 */
    @keyframes wpulse{
      0%,100%{box-shadow:0 4px 18px rgba(0,0,0,.28)}
      50%{box-shadow:0 4px 18px rgba(0,0,0,.28),0 0 0 12px rgba(${a},.28),0 0 0 26px rgba(${a},.10)}
    }
    @keyframes wshake{
      0%,100%{transform:rotate(0deg) scale(1)}
      10%{transform:rotate(-12deg) scale(1.08)}
      20%{transform:rotate(10deg) scale(1.08)}
      30%{transform:rotate(-10deg) scale(1.05)}
      40%{transform:rotate(8deg) scale(1.05)}
      50%{transform:rotate(-6deg) scale(1.02)}
      60%{transform:rotate(4deg) scale(1.02)}
      70%{transform:rotate(-2deg)}
      80%{transform:rotate(2deg)}
    }
    .wb.pulse{animation:wshake .7s ease-in-out,wpulse 1.6s ease-in-out 1s 4}
  `}var ct=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>`,bn=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round">
  <line x1="22" y1="2" x2="11" y2="13"/>
  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
</svg>`,ze=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
</svg>`,xn=`<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <line x1="2" y1="10" x2="10" y2="2"/>
  <line x1="6" y1="10" x2="10" y2="6"/>
</svg>`;function pt({displayName:i,tagline:t,logoUrl:e,avatarUrl:n}){let o=e||n,r=o?`<img class="wh-logo" src="${o}" alt="${i}" onerror="this.outerHTML='<div class=\\'wh-avatar\\'>${i.charAt(0)}</div>'">`:`<div class="wh-avatar">${i.charAt(0)}</div>`;return`
    <div class="wr" title="Drag to resize">${xn}</div>
    <div class="wh">
      <div class="wh-left">
        ${r}
        <div class="wh-info">
          <div class="wh-name">${i}</div>
          ${t?`<div class="wh-tagline">${t}</div>`:""}
          <div class="wh-status">
            <span class="wh-status-dot"></span>
            <span class="wh-status-txt">Online</span>
          </div>
        </div>
      </div>
      <button class="wh-close" aria-label="Close chat">${ze}</button>
    </div>
    <div class="wm" id="aw-msgs" role="log" aria-live="polite"></div>
    <div class="wi">
      <textarea class="wi-ta" id="aw-input" placeholder="Ask me anything\u2026" rows="1"
        aria-label="Chat message"></textarea>
      <button class="wi-send" id="aw-send" aria-label="Send message">${bn}</button>
    </div>
    <div class="wpb">Powered by <a href="https://aurora-lumen.com" target="_blank" rel="noopener">Aurora Lumen</a></div>
  `}function dt({msgs:i,shadow:t,botAvatarUrl:e,accent:n}){let o=document.createElement("button");o.className="aw-scroll-btn",o.setAttribute("aria-label","Jump to latest message"),o.textContent="\u2193",o.style.display="none",i.addEventListener("scroll",()=>{let c=i.scrollHeight-i.scrollTop-i.clientHeight;o.style.display=c>100?"flex":"none"},{passive:!0}),o.addEventListener("click",()=>{i.scrollTop=i.scrollHeight});function r(){i.scrollHeight-i.scrollTop-i.clientHeight<120&&(i.scrollTop=i.scrollHeight)}function s(c){let p=Math.floor((Date.now()-c)/1e3);return p<60?"just now":p<3600?`${Math.floor(p/60)} min ago`:p<86400?`${Math.floor(p/3600)}h ago`:`${Math.floor(p/86400)}d ago`}function a(c,p,d=!1){let f=Date.now(),g=document.createElement("div");g.className=`msg ${p}`,g.dataset.ts=f;let h=document.createElement("div");h.className="msg-bbl",d?h.innerHTML=c:h.textContent=c;let w=document.createElement("div");if(w.className="msg-ts",w.textContent="just now",setInterval(()=>{w.textContent=s(f)},3e4),p==="bot"){if(e){let v=document.createElement("img");v.className="msg-avatar",v.src=e,v.alt="Avatar",v.loading="lazy",v.addEventListener("error",()=>{v.style.display="none"}),g.appendChild(v)}let y=document.createElement("div");y.className="msg-col";let $=document.createElement("button");$.className="msg-copy",$.textContent="Copy",$.addEventListener("click",()=>{navigator.clipboard.writeText(h.innerText||h.textContent).then(()=>{$.textContent="Copied!",setTimeout(()=>{$.textContent="Copy"},1500)}).catch(()=>{})}),y.appendChild(h),y.appendChild(w),y.appendChild($),g.appendChild(y)}else g.appendChild(h),g.appendChild(w);return i.appendChild(g),r(),h}function l(){let c=document.createElement("div");if(c.id="aw-typing",c.className="msg bot",e){let d=document.createElement("img");d.className="msg-avatar",d.src=e,d.alt="Avatar",d.loading="lazy",d.addEventListener("error",()=>{d.style.display="none"}),c.appendChild(d)}let p=document.createElement("div");p.className="typing-bbl",p.innerHTML="<span></span><span></span><span></span>",c.appendChild(p),i.appendChild(c),r()}function u(){var c;(c=t.getElementById("aw-typing"))==null||c.remove()}return{addMsg:a,addTyping:l,removeTyping:u,scrollDown:r,scrollBtn:o}}function ut({shadow:i,msgs:t,API_BASE:e,SLUG:n,brand:o,onBrand:r,displayName:s,companyName:a,scrollDown:l,visitorId:u},c){let p=a||s,d="aw-lead-form",f=i.getElementById(d);if(f){if(f.querySelector("form")){t.appendChild(f),l();return}f.id=""}let g=document.createElement("div");g.className="msg bot",g.id=d;let h=document.createElement("div");h.className="msg-bbl",h.style.cssText="padding:0;background:#f0f7ff;border:1px solid #bde0fc;border-radius:14px;overflow:hidden;",h.innerHTML=`
    <div style="background:linear-gradient(135deg,#1a73e8,${o});color:${r};padding:10px 14px;font-size:13px;font-weight:600;">
      ${c}
    </div>
    <form id="aw-lf" style="padding:12px;display:flex;flex-direction:column;gap:8px;">
      <input name="name" placeholder="Your name *" required
        style="padding:8px 10px;border:1.5px solid #bde0fc;border-radius:8px;font-size:13px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;">
      <input name="email" type="email" placeholder="Email *" required
        style="padding:8px 10px;border:1.5px solid #bde0fc;border-radius:8px;font-size:13px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;">
      <input name="phone" placeholder="Phone (optional)"
        style="padding:8px 10px;border:1.5px solid #bde0fc;border-radius:8px;font-size:13px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;">
      <textarea name="message" placeholder="How can we help?" rows="2"
        style="padding:8px 10px;border:1.5px solid #bde0fc;border-radius:8px;font-size:13px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;resize:vertical;min-height:52px;max-height:120px;"></textarea>
      <button type="submit"
        style="background:linear-gradient(135deg,#1a73e8,${o});color:${r};border:none;border-radius:8px;padding:9px;font-size:13px;font-weight:600;cursor:pointer;">
        Send Message
      </button>
      <p id="aw-lf-msg" style="font-size:12px;text-align:center;color:#666;display:none;"></p>
    </form>
  `,g.appendChild(h),t.appendChild(g),l(),i.getElementById("aw-lf").addEventListener("submit",async w=>{w.preventDefault();let y=new FormData(w.target),$=w.target.querySelector("button[type=submit]"),v=i.getElementById("aw-lf-msg");$.disabled=!0,$.textContent="Sending\u2026";try{if((await fetch(`${e}/api/partner/leads`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({partner_id:n,name:y.get("name"),email:y.get("email"),phone:y.get("phone")||"",message:y.get("message")||"",session_id:u||""})})).ok)h.innerHTML=`<div style="padding:16px;text-align:center;color:#1a73e8;font-size:13px;font-weight:600;">
          \u2713 Message sent! The ${p} team will be in touch shortly.
        </div>`,g.id="";else throw new Error("failed")}catch(R){v.style.display="block",v.textContent="Something went wrong. Please try again.",$.disabled=!1,$.textContent="Send Message"}})}function ht({panel:i,shadow:t,brand:e,onBrand:n,API_BASE:o,SLUG:r,visitorId:s,getSavedMsgs:a,onClose:l}){let u="aw-rating-card";if(t.getElementById(u))return;let c=document.createElement("div");c.id=u,c.style.cssText=`
    position:absolute;inset:0;background:rgba(0,0,0,.45);
    display:flex;align-items:flex-end;justify-content:center;
    z-index:9999;border-radius:inherit;
  `,c.innerHTML=`
    <div id="aw-rc-box" style="
      background:#fff;width:100%;border-radius:14px 14px 0 0;
      padding:20px 16px 24px;box-shadow:0 -4px 20px rgba(0,0,0,.15);
      font-family:inherit;
    ">
      <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#111;text-align:center;">
        How was your experience?
      </p>
      <p style="margin:0 0 14px;font-size:12px;color:#666;text-align:center;">
        Your feedback helps us improve
      </p>
      <div id="aw-stars" style="display:flex;justify-content:center;gap:10px;margin-bottom:16px;">
        ${[1,2,3,4,5].map(g=>`
          <span data-star="${g}" style="
            font-size:32px;cursor:pointer;color:#ddd;
            transition:color .15s,transform .1s;user-select:none;
          ">\u2605</span>
        `).join("")}
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <input id="aw-rc-name" placeholder="Your name *" style="
          padding:9px 11px;border:1.5px solid #bde0fc;border-radius:8px;
          font-size:13px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;
        ">
        <input id="aw-rc-email" type="email" placeholder="Email *" style="
          padding:9px 11px;border:1.5px solid #bde0fc;border-radius:8px;
          font-size:13px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;
        ">
        <textarea id="aw-rc-message" placeholder="Any feedback? (optional)" rows="2" style="
          padding:9px 11px;border:1.5px solid #bde0fc;border-radius:8px;
          font-size:13px;outline:none;font-family:inherit;width:100%;box-sizing:border-box;
          resize:vertical;min-height:48px;max-height:100px;
        "></textarea>
      </div>
      <p id="aw-rc-err" style="color:#c0392b;font-size:12px;text-align:center;margin:8px 0 0;display:none;"></p>
      <div style="display:flex;gap:8px;margin-top:14px;">
        <button id="aw-rc-skip" style="
          flex:1;padding:9px;border:1.5px solid #bde0fc;border-radius:8px;
          background:#fff;font-size:13px;cursor:pointer;color:#555;
        ">Skip</button>
        <button id="aw-rc-submit" style="
          flex:2;padding:9px;border:none;border-radius:8px;
          background:linear-gradient(135deg,#1a73e8,${e});color:${n};font-size:13px;font-weight:600;cursor:pointer;
        ">Submit &amp; Close</button>
      </div>
    </div>
  `,i.appendChild(c);let p=0,d=[...c.querySelectorAll("[data-star]")];function f(g){d.forEach(h=>{let w=Number(h.dataset.star);h.style.color=w<=g?"#f5a623":"#ddd",h.style.transform=w<=g?"scale(1.15)":"scale(1)"})}d.forEach(g=>{g.addEventListener("mouseenter",()=>f(Number(g.dataset.star))),g.addEventListener("mouseleave",()=>f(p)),g.addEventListener("click",()=>{p=Number(g.dataset.star),f(p)}),g.addEventListener("touchend",h=>{h.preventDefault(),p=Number(g.dataset.star),f(p)})}),c.querySelector("#aw-rc-skip").addEventListener("click",()=>{c.remove(),l()}),c.querySelector("#aw-rc-submit").addEventListener("click",async()=>{let g=c.querySelector("#aw-rc-name").value.trim(),h=c.querySelector("#aw-rc-email").value.trim(),w=c.querySelector("#aw-rc-message").value.trim().slice(0,1e3),y=c.querySelector("#aw-rc-err"),$=c.querySelector("#aw-rc-submit");if(!g||!h){y.textContent="Please fill in your name and email.",y.style.display="block";return}if(!p){y.textContent="Please select a star rating.",y.style.display="block";return}y.style.display="none",$.disabled=!0,$.textContent="Sending\u2026";let v=a().map(R=>`${R.role==="user"?"User":"Aurora"}: ${R.text}`).join(`

`);try{await fetch(`${o}/api/partner/leads`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({partner_id:r,name:g,email:h,message:w,rating:p,conversation:v,session_id:s||""})})}catch(R){}c.querySelector("#aw-rc-box").innerHTML=`
      <p style="text-align:center;font-size:15px;font-weight:700;color:#1a73e8;margin:0 0 6px;">
        Thank you for your feedback! \u2728
      </p>
      <p style="text-align:center;font-size:13px;color:#555;margin:0;">
        We appreciate you taking the time.
      </p>
    `,setTimeout(()=>{c.remove(),l()},1600)})}function ft(){if(typeof crypto!="undefined"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();if(typeof crypto!="undefined"&&typeof crypto.getRandomValues=="function"){let i=crypto.getRandomValues(new Uint8Array(16));return Array.from(i,t=>t.toString(16).padStart(2,"0")).join("")}return`${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`}function gt(i){let t=`aurora_widget_${i}`,e=`aurora_widget_${i}_visitor`;function n(){try{let s=localStorage.getItem(e);return s||(s=ft(),localStorage.setItem(e,s)),s}catch(s){return ft()}}function o(s,a){try{localStorage.setItem(t,JSON.stringify({v:3,history:s,msgs:a}))}catch(l){}}function r(){try{let s=localStorage.getItem(t);if(!s)return null;let a=JSON.parse(s);return!a||a.v!==3?(localStorage.removeItem(t),null):a}catch(s){return null}}return{SESSION_KEY:t,visitorId:n(),save:o,load:r}}function mt({shadow:i,openPanel:t,getOpen:e,getSessionLoaded:n,proactiveMessage:o}){setTimeout(()=>{var a;if(e()||n()||!o)return;(a=i.querySelector(".wb"))==null||a.classList.add("pulse");let r=document.createElement("div");r.className="wnotif",r.innerHTML=`<span class="wnotif-x" id="wn-x">\u2715</span>${o}`,i.appendChild(r);let s=()=>{r.parentNode&&r.remove()};r.addEventListener("click",l=>{s(),l.target.id!=="wn-x"&&t()}),setTimeout(s,2e4)},4e3)}function bt({panel:i,handle:t,onLeft:e}){if(!t)return;let n=300,o=400,r=900,s=()=>document.documentElement.clientWidth-8;t.addEventListener("mousedown",a=>{a.preventDefault();let l=a.clientX,u=a.clientY,c=i.offsetWidth,p=i.offsetHeight;function d(g){let h=e?g.clientX-l:l-g.clientX,w=u-g.clientY;i.style.width=Math.min(s()-32,Math.max(n,c+h))+"px",i.style.height=Math.min(r,Math.max(o,p+w))+"px"}function f(){document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",f)}document.addEventListener("mousemove",d),document.addEventListener("mouseup",f)})}var xt=Fe||ct;window.__auroraWidgetLoaded__||(window.__auroraWidgetLoaded__=!0,wn());async function wn(){let i=H(A({},xe),{default_mode:`${q}_chat`}),t=new AbortController,e=setTimeout(()=>t.abort(),1200);try{let n=await fetch(`${X}/api/partner/config/${encodeURIComponent(q)}`,{signal:t.signal});if(clearTimeout(e),n.ok){let o=await n.json();for(let[r,s]of Object.entries(o))s!=null&&!(Array.isArray(s)&&s.length===0)&&(i[r]=s)}}catch(n){clearTimeout(e)}kn(i)}function kn(i){at(i.ref_link_base);let t=i.widget_position==="bottom-left",e=i.brand_color,n=i.accent_color||i.brand_color,o=i.text_color,r=Array.isArray(i.avatar_urls)&&i.avatar_urls.length?i.avatar_urls:Ze,s=r&&r.length?r[Math.floor(Math.random()*r.length)]:i.logo_url,a=s?/^https?:\/\//i.test(s)?s:`${je}${s.startsWith("/")?"":"/"}${s}`:"",l=document.createElement("div");l.id="aurora-widget-root",Object.assign(l.style,{position:"fixed",bottom:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none",background:"transparent",border:"none",padding:"0",margin:"0"}),document.body.appendChild(l);let u=l.attachShadow({mode:"closed"}),c=document.createElement("style");c.textContent=lt({brand:e,accent:n,onBrand:o,onLeft:t,widgetWidth:i.widget_width,widgetHeight:i.widget_height});let p=document.createElement("div");p.className="wp",p.setAttribute("role","dialog"),p.setAttribute("aria-label",`${i.display_name} chat`),p.innerHTML=pt({displayName:i.display_name,tagline:i.tagline,logoUrl:i.logo_url,avatarUrl:a});let d=document.createElement("button");d.className="wb",d.setAttribute("aria-label",`Open ${i.display_name} chat`),d.innerHTML=xt,u.appendChild(c),u.appendChild(p),u.appendChild(d);let f=(i.messenger_page_id||"").trim();if(f){let m=document.createElement("a");m.href=`https://m.me/${encodeURIComponent(f)}?ref=prime_${q}`,m.target="_blank",m.rel="noopener noreferrer",m.className="wmb",m.setAttribute("aria-label","Chat on Messenger"),m.innerHTML=`<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.556-6.963 3.131 3.259 5.889-3.259-6.558 6.963z"/>
    </svg>`,u.appendChild(m)}let g=u.getElementById("aw-msgs"),h=u.getElementById("aw-input"),w=u.getElementById("aw-send"),y=gt(q),{visitorId:$}=y,v=!1,R=!1,z=[],I=[],te=40,Q=!1,ne=!1,de=!1,Ce=/shall I (show|send|bring up)|would you like (me to show|to (fill|submit))|want me to (show|send)|should I show|like to (send|submit).*form|can I show.*form/i;function se(){y.save(z,I)}let{addMsg:N,addTyping:wt,removeTyping:ue,scrollDown:he,scrollBtn:kt}=dt({msgs:g,shadow:u,botAvatarUrl:a});p.appendChild(kt);function Ie(m){R=m,w.disabled=m,h.disabled=m}function oe(m){ut({shadow:u,msgs:g,API_BASE:X,SLUG:q,brand:e,onBrand:o,displayName:i.display_name,companyName:i.company_name,scrollDown:he,visitorId:$},m||i.lead_form_title||"Get in touch")}let Re=/\b(talk|speak|chat|message|write|reach|contact|connect|get|put me)\b.{0,40}\b(human|person|people|someone|agent|associate|rep(resentative)?|staff|employee|sales\s*(person|assistant|agent|rep|team|staff)|support\s*(team|agent|staff)|customer\s*(service|support)|team\s*member|real\s*(person|human|agent)|live\s*(agent|person|support|chat))\b|(sales|support|human|live)\s*(team|agent|chat|support|assistant)|(can|could|may|would)?\s*i\s+(talk|speak|chat|write|reach)\s+to\b|(put|connect|transfer)\s+me\b|(speak|talk)\s+to\s+(a|an|the|your|some)?\s*(human|person|agent|associate|rep|staff|team)\b/i,yt=["contact the team","contact sales","send my message","get in touch","reach out","please contact me","contact me back","call me back","request a demo","book a demo","schedule a demo","get a demo","request a quote","get a quote","need a quote","connect me with","put me in touch","submit an enquiry","make an enquiry","send an enquiry","i want to enquire","i want to contact","i'd like to contact","where is the form","show me the form","i need the form","open the form","show the form","give me the form","send the form","talk to sales","speak to sales","speak to someone"];function vt(m){let _=m.toLowerCase();return Re.test(_)||yt.some(E=>_.includes(E))}function $t(m){let _=document.createElement("div");_.className="qr-wrap",_.id="aw-qr",m.forEach(E=>{let S=document.createElement("button");S.className="qr-btn",S.textContent=E,S.addEventListener("click",()=>{_.remove(),h.value=E.replace(new RegExp("\\p{Emoji_Presentation}","gu"),"").trim(),fe()}),_.appendChild(S)}),g.appendChild(_),he()}function re(){var m,_;if(v=!0,p.classList.add("open"),d.classList.add("is-open"),d.innerHTML=ze,d.setAttribute("aria-label",`Close ${i.display_name} chat`),window.innerWidth<=480&&(document.body.style.overflow="hidden"),(m=u.querySelector(".wnotif"))==null||m.remove(),!de){de=!0;let E=y.load();if(((_=E==null?void 0:E.msgs)==null?void 0:_.length)>0){z=E.history||[],I=E.msgs,E.msgs.forEach(T=>N(T.role==="bot"?W(T.text):T.text,T.role,T.role==="bot"));let S=E.msgs[E.msgs.length-1];(S==null?void 0:S.role)==="bot"&&Ce.test(S.text||"")&&(Q=!0)}else i.greeting&&setTimeout(()=>{var S;N(W(i.greeting),"bot",!0),I.push({role:"bot",text:i.greeting}),z.push({role:"assistant",content:i.greeting}),se(),(S=i.quick_replies)!=null&&S.length&&$t(i.quick_replies)},180)}setTimeout(()=>h.focus(),250)}function V(){if(I.some(_=>_.role==="user")&&!u.getElementById("aw-rating-card")){ht({panel:p,shadow:u,brand:e,onBrand:o,API_BASE:X,SLUG:q,visitorId:$,getSavedMsgs:()=>I,onClose:Le});return}Le()}function Le(){v=!1,p.classList.remove("open"),d.classList.remove("is-open"),d.innerHTML=xt,d.setAttribute("aria-label",`Open ${i.display_name} chat`),h.blur(),document.body.style.overflow=""}h.addEventListener("input",()=>{h.style.height="auto",h.style.height=Math.min(h.scrollHeight,120)+"px"}),d.addEventListener("click",()=>v?V():re()),p.querySelector(".wh-close").addEventListener("click",V),document.addEventListener("keydown",m=>{m.key==="Escape"&&v&&V()}),w.addEventListener("click",()=>fe()),h.addEventListener("keydown",m=>{m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),fe())}),bt({panel:p,handle:p.querySelector(".wr"),onLeft:t}),window.__auroraWidget={open:re,close:V,toggle:()=>v?V():re()},mt({shadow:u,openPanel:re,getOpen:()=>v,getSessionLoaded:()=>de,proactiveMessage:i.proactive_message||xe.proactive_message});async function fe(){var S;let m=h.value.trim();if(!m||R)return;(S=u.getElementById("aw-qr"))==null||S.remove(),N(m,"user"),h.value="",h.style.height="auto",I.push({role:"user",text:m});let _=/^(yes|yeah|sure|ok|okay|please|go ahead|send it|show it|proceed|absolutely|of course|definitely|do it|yes please|sure thing|sounds good|let's go)\b/i.test(m);if(Q&&_){Q=!1;let T="Here you go! Please fill in your details below.";N(W(T),"bot",!0),I.push({role:"bot",text:T}),oe(),se();return}if(_||(Q=!1),vt(m)){let T=/demo|trial|call|meeting|schedule/i.test(m),D=T?"Book a Demo":i.lead_form_title,L=T?"I'd love to set that up! Please fill in the form below and our team will be in touch.":"Of course! Fill in the form below and our team will get back to you shortly.";N(W(L),"bot",!0),I.push({role:"bot",text:L}),oe(D),se();return}let E=/\b(contact|associate|agent|real person|sales team|support team|enquir|get a quote|need a quote|request a quote|show.*form|form.*appear|book a demo|request a demo)\b/i;(Re.test(m.toLowerCase())||E.test(m))&&(ne=!0),Ie(!0),wt();try{let T=await fetch(`${X}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json","X-Partner-Slug":q,"X-Visitor-Id":$},body:JSON.stringify({prompt:m,mode:i.default_mode||`${q}_chat`,chat_title:"widget_chat",messages:z,page_url:window.location.href})});if(!T.ok)throw new Error(`HTTP ${T.status}`);let D=null,L="",_t=T.body.getReader(),Tt=new TextDecoder,ge="";for(;;){let{done:qe,value:At}=await _t.read();if(qe)break;ge+=Tt.decode(At,{stream:!0});let Me=ge.split(`
`);ge=Me.pop();for(let Be of Me){if(!Be.startsWith("data: "))continue;let Ne=Be.slice(6);if(Ne==="[DONE]")break;try{let me=JSON.parse(Ne);me.token&&(D||(ue(),D=N("","bot",!0)),L+=me.token,D.innerHTML=W(L),he())}catch(me){}}}ue(),D||(D=N("","bot",!0)),z.push({role:"user",content:m}),z.push({role:"assistant",content:L}),z.length>te&&(z=z.slice(-te)),I.push({role:"bot",text:L}),I.length>te*2&&(I=I.slice(-te*2)),se(),ne?(ne=!1,setTimeout(()=>oe(),800)):(ne=!1,/contact.*team|get\s+in\s+touch|contact\s+us|fill.*form|submit.*enquiry|form will appear|connect you with|here you go|here's the form|fill in (your|the)|please fill/i.test(L)&&setTimeout(()=>oe(),600)),Ce.test(L)&&!u.getElementById("aw-lead-form")&&(Q=!0)}catch(T){ue(),N("Something went wrong \u2014 please try again.","bot")}finally{Ie(!1),h.focus()}}}})();
