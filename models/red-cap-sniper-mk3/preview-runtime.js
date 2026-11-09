(()=>{/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var di={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},fi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},kl=0,Pa=1,Hl=2;var al=1,va=2,Rn=3,Zn=0,Fe=1,Oe=2;var Xn=0,Oi=1,Ia=2,La=3,Ua=4,Vl=5,ni=100,Gl=101,Wl=102,Da=103,Na=104,Xl=200,Yl=201,ql=202,Zl=203,Uo=204,Do=205,Kl=206,Jl=207,jl=208,Ql=209,$l=210,th=211,eh=212,nh=213,ih=214,sh=0,rh=1,oh=2,hr=3,ah=4,ch=5,lh=6,hh=7,cl=0,uh=1,dh=2,Yn=0,fh=1,ph=2,mh=3,Ma=4,gh=5,_h=6;var ll=300,zi=301,ki=302,No=303,Oo=304,Vr=306,ps=1e3,un=1001,Fo=1002,We=1003,Oa=1004;var Qr=1005;var en=1006,xh=1007;var ms=1008;var qn=1009,yh=1010,vh=1011,Sa=1012,hl=1013,Gn=1014,Wn=1015,gs=1016,ul=1017,dl=1018,si=1020,Mh=1021,dn=1023,Sh=1024,bh=1025,ri=1026,Hi=1027,Eh=1028,fl=1029,Ah=1030,pl=1031,ml=1033,$r=33776,to=33777,eo=33778,no=33779,Fa=35840,Ba=35841,za=35842,ka=35843,gl=36196,Ha=37492,Va=37496,Ga=37808,Wa=37809,Xa=37810,Ya=37811,qa=37812,Za=37813,Ka=37814,Ja=37815,ja=37816,Qa=37817,$a=37818,tc=37819,ec=37820,nc=37821,io=36492,ic=36494,sc=36495,Th=36283,rc=36284,oc=36285,ac=36286;var ur=2300,dr=2301,so=2302,cc=2400,lc=2401,hc=2402;var _l=3e3,oi=3001,wh=3200,Rh=3201,xl=0,Ch=1,nn="",Ee="srgb",In="srgb-linear",ba="display-p3",Gr="display-p3-linear",fr="linear",de="srgb",pr="rec709",mr="p3";var mi=7680;var uc=519,Ph=512,Ih=513,Lh=514,yl=515,Uh=516,Dh=517,Nh=518,Oh=519,dc=35044;var fc="300 es",Bo=1035,Cn=2e3,gr=2001,yn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],pc=1234567,as=Math.PI/180,_s=180/Math.PI;function pi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]).toLowerCase()}function Te(i,t,e){return Math.max(t,Math.min(e,i))}function Ea(i,t){return(i%t+t)%t}function Fh(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Bh(i,t,e){return i!==t?(e-i)/(t-i):0}function cs(i,t,e){return(1-e)*i+e*t}function zh(i,t,e,n){return cs(i,t,1-Math.exp(-e*n))}function kh(i,t=1){return t-Math.abs(Ea(i,t*2)-t)}function Hh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Vh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Gh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Wh(i,t){return i+Math.random()*(t-i)}function Xh(i){return i*(.5-Math.random())}function Yh(i){i!==void 0&&(pc=i);let t=pc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function qh(i){return i*as}function Zh(i){return i*_s}function zo(i){return(i&i-1)===0&&i!==0}function Kh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function _r(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Jh(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),p=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*p,o*l);break;case"YXY":i.set(c*p,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*p,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ii(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ve(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Ye={DEG2RAD:as,RAD2DEG:_s,generateUUID:pi,clamp:Te,euclideanModulo:Ea,mapLinear:Fh,inverseLerp:Bh,lerp:cs,damp:zh,pingpong:kh,smoothstep:Hh,smootherstep:Vh,randInt:Gh,randFloat:Wh,randFloatSpread:Xh,seededRandom:Yh,degToRad:qh,radToDeg:Zh,isPowerOfTwo:zo,ceilPowerOfTwo:Kh,floorPowerOfTwo:_r,setQuaternionFromProperEuler:Jh,normalize:Ve,denormalize:Ii},at=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ie=class i{constructor(t,e,n,s,r,a,o,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],_=s[0],m=s[3],f=s[6],b=s[1],x=s[4],A=s[7],L=s[2],w=s[5],T=s[8];return r[0]=a*_+o*b+c*L,r[3]=a*m+o*x+c*w,r[6]=a*f+o*A+c*T,r[1]=l*_+h*b+u*L,r[4]=l*m+h*x+u*w,r[7]=l*f+h*A+u*T,r[2]=d*_+p*b+g*L,r[5]=d*m+p*x+g*w,r[8]=d*f+p*A+g*T,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*r,p=l*r-a*c,g=e*u+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*a)*_,t[3]=d*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-o*e)*_,t[6]=p*_,t[7]=(n*c-l*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(ro.makeScale(t,e)),this}rotate(t){return this.premultiply(ro.makeRotation(-t)),this}translate(t,e){return this.premultiply(ro.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},ro=new ie;function vl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function xs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function jh(){let i=xs("canvas");return i.style.display="block",i}var mc={};function ls(i){i in mc||(mc[i]=!0,console.warn(i))}var gc=new ie().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),_c=new ie().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Bs={[In]:{transfer:fr,primaries:pr,toReference:i=>i,fromReference:i=>i},[Ee]:{transfer:de,primaries:pr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Gr]:{transfer:fr,primaries:mr,toReference:i=>i.applyMatrix3(_c),fromReference:i=>i.applyMatrix3(gc)},[ba]:{transfer:de,primaries:mr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(_c),fromReference:i=>i.applyMatrix3(gc).convertLinearToSRGB()}},Qh=new Set([In,Gr]),ce={enabled:!0,_workingColorSpace:In,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Qh.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=Bs[t].toReference,s=Bs[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Bs[i].primaries},getTransfer:function(i){return i===nn?fr:Bs[i].transfer}};function Fi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function oo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var gi,xr=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{gi===void 0&&(gi=xs("canvas")),gi.width=t.width,gi.height=t.height;let n=gi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=gi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=xs("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Fi(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Fi(e[n]/255)*255):e[n]=Fi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},$h=0,yr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=pi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ao(s[a].image)):r.push(ao(s[a]))}else r=ao(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ao(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?xr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var tu=0,$e=class i extends yn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=un,s=un,r=en,a=ms,o=dn,c=qn,l=i.DEFAULT_ANISOTROPY,h=nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tu++}),this.uuid=pi(),this.name="",this.source=new yr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new at(0,0),this.repeat=new at(1,1),this.center=new at(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ls("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===oi?Ee:nn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ll)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ps:t.x=t.x-Math.floor(t.x);break;case un:t.x=t.x<0?0:1;break;case Fo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ps:t.y=t.y-Math.floor(t.y);break;case un:t.y=t.y<0?0:1;break;case Fo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ls("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ee?oi:_l}set encoding(t){ls("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===oi?Ee:nn}};$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=ll;$e.DEFAULT_ANISOTROPY=1;var ge=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],p=c[5],g=c[9],_=c[2],m=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let x=(l+1)/2,A=(p+1)/2,L=(f+1)/2,w=(h+d)/4,T=(u+_)/4,W=(g+m)/4;return x>A&&x>L?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=w/n,r=T/n):A>L?A<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(A),n=w/s,r=W/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=T/r,s=W/r),this.set(n,s,r,e),this}let b=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-_)/b,this.z=(d-h)/b,this.w=Math.acos((l+p+f-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ko=class extends yn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ge(0,0,t,e),this.scissorTest=!1,this.viewport=new ge(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(ls("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===oi?Ee:nn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new $e(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new yr(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ln=class extends ko{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},vr=class extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ho=class extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var fn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==p||h!==g){let m=1-o,f=c*d+l*p+h*g+u*_,b=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){let L=Math.sqrt(x),w=Math.atan2(L,f*b);m=Math.sin(m*w)/L,o=Math.sin(o*w)/L}let A=o*b;if(c=c*m+d*A,l=l*m+p*A,h=h*m+g*A,u=u*m+_*A,m===1-o){let L=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=L,l*=L,h*=L,u*=L}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+h*u+c*p-l*d,t[e+1]=c*g+h*d+l*u-o*p,t[e+2]=l*g+h*p+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(r/2),d=c(n/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"YZX":this._x=d*h*u+l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u-d*p*g;break;case"XZY":this._x=d*h*u-l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>u){let p=2*Math.sqrt(1+n-o-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>u){let p=2*Math.sqrt(1+o-n-u);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+h)/p}else{let p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Te(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(xc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(xc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),h=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return co.copy(this).projectOnVector(t),this.sub(co)}reflect(t){return this.sub(co.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},co=new P,xc=new fn,Un=class{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(an.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(an.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=an.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,an):an.fromBufferAttribute(r,a),an.applyMatrix4(t.matrixWorld),this.expandByPoint(an);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),zs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zs.copy(n.boundingBox)),zs.applyMatrix4(t.matrixWorld),this.union(zs)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,an),an.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ns),ks.subVectors(this.max,ns),_i.subVectors(t.a,ns),xi.subVectors(t.b,ns),yi.subVectors(t.c,ns),Bn.subVectors(xi,_i),zn.subVectors(yi,xi),jn.subVectors(_i,yi);let e=[0,-Bn.z,Bn.y,0,-zn.z,zn.y,0,-jn.z,jn.y,Bn.z,0,-Bn.x,zn.z,0,-zn.x,jn.z,0,-jn.x,-Bn.y,Bn.x,0,-zn.y,zn.x,0,-jn.y,jn.x,0];return!lo(e,_i,xi,yi,ks)||(e=[1,0,0,0,1,0,0,0,1],!lo(e,_i,xi,yi,ks))?!1:(Hs.crossVectors(Bn,zn),e=[Hs.x,Hs.y,Hs.z],lo(e,_i,xi,yi,ks))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,an).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(an).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},bn=[new P,new P,new P,new P,new P,new P,new P,new P],an=new P,zs=new Un,_i=new P,xi=new P,yi=new P,Bn=new P,zn=new P,jn=new P,ns=new P,ks=new P,Hs=new P,Qn=new P;function lo(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Qn.fromArray(i,r);let o=s.x*Math.abs(Qn.x)+s.y*Math.abs(Qn.y)+s.z*Math.abs(Qn.z),c=t.dot(Qn),l=e.dot(Qn),h=n.dot(Qn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var eu=new Un,is=new P,ho=new P,ys=class{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):eu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;is.subVectors(t,this.center);let e=is.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(is,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ho.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(is.copy(t.center).add(ho)),this.expandByPoint(is.copy(t.center).sub(ho))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},En=new P,uo=new P,Vs=new P,kn=new P,fo=new P,Gs=new P,po=new P,Vi=class{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,En)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=En.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(En.copy(this.origin).addScaledVector(this.direction,e),En.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){uo.copy(t).add(e).multiplyScalar(.5),Vs.copy(e).sub(t).normalize(),kn.copy(this.origin).sub(uo);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Vs),o=kn.dot(this.direction),c=-kn.dot(Vs),l=kn.lengthSq(),h=Math.abs(1-a*a),u,d,p,g;if(h>0)if(u=a*c-o,d=a*o-c,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,p=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(uo).addScaledVector(Vs,d),p}intersectSphere(t,e){En.subVectors(t.center,this.origin);let n=En.dot(this.direction),s=En.dot(En)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,En)!==null}intersectTriangle(t,e,n,s,r){fo.subVectors(e,t),Gs.subVectors(n,t),po.crossVectors(fo,Gs);let a=this.direction.dot(po),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;kn.subVectors(this.origin,t);let c=o*this.direction.dot(Gs.crossVectors(kn,Gs));if(c<0)return null;let l=o*this.direction.dot(fo.cross(kn));if(l<0||c+l>a)return null;let h=-o*kn.dot(po);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Me=class i{constructor(t,e,n,s,r,a,o,c,l,h,u,d,p,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,h,u,d,p,g,_,m)}set(t,e,n,s,r,a,o,c,l,h,u,d,p,g,_,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/vi.setFromMatrixColumn(t,0).length(),r=1/vi.setFromMatrixColumn(t,1).length(),a=1/vi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=a*h,p=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=d-_*l,e[9]=-o*c,e[2]=_-d*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){let d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d+_*o,e[4]=g*o-p,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=p*o-g,e[6]=_+d*o,e[10]=a*c}else if(t.order==="ZXY"){let d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*h,e[9]=_-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let d=a*h,p=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=g*l-p,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=p*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let d=a*c,p=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=p*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=a*c,p=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(nu,t,iu)}lookAt(t,e,n){let s=this.elements;return je.subVectors(t,e),je.lengthSq()===0&&(je.z=1),je.normalize(),Hn.crossVectors(n,je),Hn.lengthSq()===0&&(Math.abs(n.z)===1?je.x+=1e-4:je.z+=1e-4,je.normalize(),Hn.crossVectors(n,je)),Hn.normalize(),Ws.crossVectors(je,Hn),s[0]=Hn.x,s[4]=Ws.x,s[8]=je.x,s[1]=Hn.y,s[5]=Ws.y,s[9]=je.y,s[2]=Hn.z,s[6]=Ws.z,s[10]=je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],b=n[3],x=n[7],A=n[11],L=n[15],w=s[0],T=s[4],W=s[8],v=s[12],E=s[1],B=s[5],K=s[9],ot=s[13],U=s[2],F=s[6],Y=s[10],$=s[14],J=s[3],q=s[7],tt=s[11],k=s[15];return r[0]=a*w+o*E+c*U+l*J,r[4]=a*T+o*B+c*F+l*q,r[8]=a*W+o*K+c*Y+l*tt,r[12]=a*v+o*ot+c*$+l*k,r[1]=h*w+u*E+d*U+p*J,r[5]=h*T+u*B+d*F+p*q,r[9]=h*W+u*K+d*Y+p*tt,r[13]=h*v+u*ot+d*$+p*k,r[2]=g*w+_*E+m*U+f*J,r[6]=g*T+_*B+m*F+f*q,r[10]=g*W+_*K+m*Y+f*tt,r[14]=g*v+_*ot+m*$+f*k,r[3]=b*w+x*E+A*U+L*J,r[7]=b*T+x*B+A*F+L*q,r[11]=b*W+x*K+A*Y+L*tt,r[15]=b*v+x*ot+A*$+L*k,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*c*u-s*l*u-r*o*d+n*l*d+s*o*p-n*c*p)+_*(+e*c*p-e*l*d+r*a*d-s*a*p+s*l*h-r*c*h)+m*(+e*l*u-e*o*p-r*a*u+n*a*p+r*o*h-n*l*h)+f*(-s*o*h-e*c*u+e*o*d+s*a*u-n*a*d+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],b=u*m*l-_*d*l+_*c*p-o*m*p-u*c*f+o*d*f,x=g*d*l-h*m*l-g*c*p+a*m*p+h*c*f-a*d*f,A=h*_*l-g*u*l+g*o*p-a*_*p-h*o*f+a*u*f,L=g*u*c-h*_*c-g*o*d+a*_*d+h*o*m-a*u*m,w=e*b+n*x+s*A+r*L;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/w;return t[0]=b*T,t[1]=(_*d*r-u*m*r-_*s*p+n*m*p+u*s*f-n*d*f)*T,t[2]=(o*m*r-_*c*r+_*s*l-n*m*l-o*s*f+n*c*f)*T,t[3]=(u*c*r-o*d*r-u*s*l+n*d*l+o*s*p-n*c*p)*T,t[4]=x*T,t[5]=(h*m*r-g*d*r+g*s*p-e*m*p-h*s*f+e*d*f)*T,t[6]=(g*c*r-a*m*r-g*s*l+e*m*l+a*s*f-e*c*f)*T,t[7]=(a*d*r-h*c*r+h*s*l-e*d*l-a*s*p+e*c*p)*T,t[8]=A*T,t[9]=(g*u*r-h*_*r-g*n*p+e*_*p+h*n*f-e*u*f)*T,t[10]=(a*_*r-g*o*r+g*n*l-e*_*l-a*n*f+e*o*f)*T,t[11]=(h*o*r-a*u*r-h*n*l+e*u*l+a*n*p-e*o*p)*T,t[12]=L*T,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*T,t[14]=(g*o*s-a*_*s-g*n*c+e*_*c+a*n*m-e*o*m)*T,t[15]=(a*u*s-h*o*s+h*n*c-e*u*c-a*n*d+e*o*d)*T,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,d=r*l,p=r*h,g=r*u,_=a*h,m=a*u,f=o*u,b=c*l,x=c*h,A=c*u,L=n.x,w=n.y,T=n.z;return s[0]=(1-(_+f))*L,s[1]=(p+A)*L,s[2]=(g-x)*L,s[3]=0,s[4]=(p-A)*w,s[5]=(1-(d+f))*w,s[6]=(m+b)*w,s[7]=0,s[8]=(g+x)*T,s[9]=(m-b)*T,s[10]=(1-(d+_))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=vi.set(s[0],s[1],s[2]).length(),a=vi.set(s[4],s[5],s[6]).length(),o=vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],cn.copy(this);let l=1/r,h=1/a,u=1/o;return cn.elements[0]*=l,cn.elements[1]*=l,cn.elements[2]*=l,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=u,cn.elements[9]*=u,cn.elements[10]*=u,e.setFromRotationMatrix(cn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Cn){let c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),p,g;if(o===Cn)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===gr)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Cn){let c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(a-r),d=(e+t)*l,p=(n+s)*h,g,_;if(o===Cn)g=(a+r)*u,_=-2*u;else if(o===gr)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},vi=new P,cn=new Me,nu=new P(0,0,0),iu=new P(1,1,1),Hn=new P,Ws=new P,je=new P,yc=new Me,vc=new fn,Mr=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Te(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Te(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Te(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return yc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(yc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return vc.setFromEuler(this),this.setFromQuaternion(vc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Mr.DEFAULT_ORDER="XYZ";var vs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},su=0,Mc=new P,Mi=new fn,An=new Me,Xs=new P,ss=new P,ru=new P,ou=new fn,Sc=new P(1,0,0),bc=new P(0,1,0),Ec=new P(0,0,1),au={type:"added"},cu={type:"removed"},Xe=class i extends yn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new P,e=new Mr,n=new fn,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Me},normalMatrix:{value:new ie}}),this.matrix=new Me,this.matrixWorld=new Me,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.premultiply(Mi),this}rotateX(t){return this.rotateOnAxis(Sc,t)}rotateY(t){return this.rotateOnAxis(bc,t)}rotateZ(t){return this.rotateOnAxis(Ec,t)}translateOnAxis(t,e){return Mc.copy(t).applyQuaternion(this.quaternion),this.position.add(Mc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Sc,t)}translateY(t){return this.translateOnAxis(bc,t)}translateZ(t){return this.translateOnAxis(Ec,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(An.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Xs.copy(t):Xs.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?An.lookAt(ss,Xs,this.up):An.lookAt(Xs,ss,this.up),this.quaternion.setFromRotationMatrix(An),s&&(An.extractRotation(s.matrixWorld),Mi.setFromRotationMatrix(An),this.quaternion.premultiply(Mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(au)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(cu)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),An.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),An.multiply(t.parent.matrixWorld)),t.applyMatrix4(An),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,t,ru),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,ou,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Xe.DEFAULT_UP=new P(0,1,0);Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ln=new P,Tn=new P,mo=new P,wn=new P,Si=new P,bi=new P,Ac=new P,go=new P,_o=new P,xo=new P,Ys=!1,Li=class i{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),ln.subVectors(t,e),s.cross(ln);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){ln.subVectors(s,e),Tn.subVectors(n,e),mo.subVectors(t,e);let a=ln.dot(ln),o=ln.dot(Tn),c=ln.dot(mo),l=Tn.dot(Tn),h=Tn.dot(mo),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(l*c-o*h)*d,g=(a*h-o*c)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getUV(t,e,n,s,r,a,o,c){return Ys===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ys=!0),this.getInterpolation(t,e,n,s,r,a,o,c)}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,wn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,wn.x),c.addScaledVector(a,wn.y),c.addScaledVector(o,wn.z),c)}static isFrontFacing(t,e,n,s){return ln.subVectors(n,e),Tn.subVectors(t,e),ln.cross(Tn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ln.subVectors(this.c,this.b),Tn.subVectors(this.a,this.b),ln.cross(Tn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Ys===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ys=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;Si.subVectors(s,n),bi.subVectors(r,n),go.subVectors(t,n);let c=Si.dot(go),l=bi.dot(go);if(c<=0&&l<=0)return e.copy(n);_o.subVectors(t,s);let h=Si.dot(_o),u=bi.dot(_o);if(h>=0&&u<=h)return e.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(Si,a);xo.subVectors(t,r);let p=Si.dot(xo),g=bi.dot(xo);if(g>=0&&p<=g)return e.copy(r);let _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(bi,o);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Ac.subVectors(r,s),o=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(Ac,o);let f=1/(m+_+d);return a=_*f,o=d*f,e.copy(n).addScaledVector(Si,a).addScaledVector(bi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Ml={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},qs={h:0,s:0,l:0};function yo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var ne=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ee){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ce.workingColorSpace){return this.r=t,this.g=e,this.b=n,ce.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ce.workingColorSpace){if(t=Ea(t,1),e=Te(e,0,1),n=Te(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=yo(a,r,t+1/3),this.g=yo(a,r,t),this.b=yo(a,r,t-1/3)}return ce.toWorkingColorSpace(this,s),this}setStyle(t,e=Ee){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ee){let n=Ml[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}copyLinearToSRGB(t){return this.r=oo(t.r),this.g=oo(t.g),this.b=oo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ee){return ce.fromWorkingColorSpace(Ne.copy(this),t),Math.round(Te(Ne.r*255,0,255))*65536+Math.round(Te(Ne.g*255,0,255))*256+Math.round(Te(Ne.b*255,0,255))}getHexString(t=Ee){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ce.workingColorSpace){ce.fromWorkingColorSpace(Ne.copy(this),e);let n=Ne.r,s=Ne.g,r=Ne.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ce.workingColorSpace){return ce.fromWorkingColorSpace(Ne.copy(this),e),t.r=Ne.r,t.g=Ne.g,t.b=Ne.b,t}getStyle(t=Ee){ce.fromWorkingColorSpace(Ne.copy(this),t);let e=Ne.r,n=Ne.g,s=Ne.b;return t!==Ee?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Vn),this.setHSL(Vn.h+t,Vn.s+e,Vn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Vn),t.getHSL(qs);let n=cs(Vn.h,qs.h,e),s=cs(Vn.s,qs.s,e),r=cs(Vn.l,qs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ne=new ne;ne.NAMES=Ml;var lu=0,Kn=class extends yn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:lu++}),this.uuid=pi(),this.name="",this.type="Material",this.blending=Oi,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uo,this.blendDst=Do,this.blendEquation=ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ne(0,0,0),this.blendAlpha=0,this.depthFunc=hr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mi,this.stencilZFail=mi,this.stencilZPass=mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Oi&&(n.blending=this.blending),this.side!==Zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Uo&&(n.blendSrc=this.blendSrc),this.blendDst!==Do&&(n.blendDst=this.blendDst),this.blendEquation!==ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==hr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==uc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Gi=class extends Kn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=cl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var be=new P,Zs=new at,Be=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=dc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Wn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Zs.fromBufferAttribute(this,e),Zs.applyMatrix3(t),this.setXY(e,Zs.x,Zs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ii(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ii(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ii(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ii(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ii(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),s=Ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),s=Ve(s,this.array),r=Ve(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==dc&&(t.usage=this.usage),t}};var Sr=class extends Be{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var br=class extends Be{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var he=class extends Be{constructor(t,e,n){super(new Float32Array(t),e,n)}};var hu=0,tn=new Me,vo=new Xe,Ei=new P,Qe=new Un,rs=new Un,Pe=new P,ze=class i extends yn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hu++}),this.uuid=pi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vl(t)?br:Sr)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ie().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,n){return tn.makeTranslation(t,e,n),this.applyMatrix4(tn),this}scale(t,e,n){return tn.makeScale(t,e,n),this.applyMatrix4(tn),this}lookAt(t){return vo.lookAt(t),vo.updateMatrix(),this.applyMatrix4(vo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new he(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Un);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ys);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(t){let n=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];rs.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(Qe.min,rs.min),Qe.expandByPoint(Pe),Pe.addVectors(Qe.max,rs.max),Qe.expandByPoint(Pe)):(Qe.expandByPoint(rs.min),Qe.expandByPoint(rs.max))}Qe.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Pe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Pe.fromBufferAttribute(o,l),c&&(Ei.fromBufferAttribute(t,l),Pe.add(Ei)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Be(new Float32Array(4*o),4));let c=this.getAttribute("tangent").array,l=[],h=[];for(let E=0;E<o;E++)l[E]=new P,h[E]=new P;let u=new P,d=new P,p=new P,g=new at,_=new at,m=new at,f=new P,b=new P;function x(E,B,K){u.fromArray(s,E*3),d.fromArray(s,B*3),p.fromArray(s,K*3),g.fromArray(a,E*2),_.fromArray(a,B*2),m.fromArray(a,K*2),d.sub(u),p.sub(u),_.sub(g),m.sub(g);let ot=1/(_.x*m.y-m.x*_.y);isFinite(ot)&&(f.copy(d).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(ot),b.copy(p).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(ot),l[E].add(f),l[B].add(f),l[K].add(f),h[E].add(b),h[B].add(b),h[K].add(b))}let A=this.groups;A.length===0&&(A=[{start:0,count:n.length}]);for(let E=0,B=A.length;E<B;++E){let K=A[E],ot=K.start,U=K.count;for(let F=ot,Y=ot+U;F<Y;F+=3)x(n[F+0],n[F+1],n[F+2])}let L=new P,w=new P,T=new P,W=new P;function v(E){T.fromArray(r,E*3),W.copy(T);let B=l[E];L.copy(B),L.sub(T.multiplyScalar(T.dot(B))).normalize(),w.crossVectors(W,B);let ot=w.dot(h[E])<0?-1:1;c[E*4]=L.x,c[E*4+1]=L.y,c[E*4+2]=L.z,c[E*4+3]=ot}for(let E=0,B=A.length;E<B;++E){let K=A[E],ot=K.start,U=K.count;for(let F=ot,Y=ot+U;F<Y;F+=3)v(n[F+0]),v(n[F+1]),v(n[F+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Be(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new P,r=new P,a=new P,o=new P,c=new P,l=new P,h=new P,u=new P;if(t)for(let d=0,p=t.count;d<p;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,c){let l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h),p=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*h;for(let f=0;f<h;f++)d[g++]=l[p++]}return new Be(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=t(c,n);e.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){let d=l[h],p=t(d,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let l=0,h=a.length;l<h;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Tc=new Me,$n=new Vi,Ks=new ys,wc=new P,Ai=new P,Ti=new P,wi=new P,Mo=new P,Js=new P,js=new at,Qs=new at,$s=new at,Rc=new P,Cc=new P,Pc=new P,tr=new P,er=new P,le=class extends Xe{constructor(t=new ze,e=new Gi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){Js.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],u=r[c];h!==0&&(Mo.fromBufferAttribute(u,t),a?Js.addScaledVector(Mo,h):Js.addScaledVector(Mo.sub(e),h))}e.add(Js)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ks.copy(n.boundingSphere),Ks.applyMatrix4(r),$n.copy(t.ray).recast(t.near),!(Ks.containsPoint($n.origin)===!1&&($n.intersectSphere(Ks,wc)===null||$n.origin.distanceToSquared(wc)>(t.far-t.near)**2))&&(Tc.copy(r).invert(),$n.copy(t.ray).applyMatrix4(Tc),!(n.boundingBox!==null&&$n.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,$n)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],b=Math.max(m.start,p.start),x=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let A=b,L=x;A<L;A+=3){let w=o.getX(A),T=o.getX(A+1),W=o.getX(A+2);s=nr(this,f,t,n,l,h,u,w,T,W),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let b=o.getX(m),x=o.getX(m+1),A=o.getX(m+2);s=nr(this,a,t,n,l,h,u,b,x,A),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],b=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let A=b,L=x;A<L;A+=3){let w=A,T=A+1,W=A+2;s=nr(this,f,t,n,l,h,u,w,T,W),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let b=m,x=m+1,A=m+2;s=nr(this,a,t,n,l,h,u,b,x,A),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function uu(i,t,e,n,s,r,a,o){let c;if(t.side===Fe?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===Zn,o),c===null)return null;er.copy(o),er.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(er);return l<e.near||l>e.far?null:{distance:l,point:er.clone(),object:i}}function nr(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,Ai),i.getVertexPosition(c,Ti),i.getVertexPosition(l,wi);let h=uu(i,t,e,n,Ai,Ti,wi,tr);if(h){s&&(js.fromBufferAttribute(s,o),Qs.fromBufferAttribute(s,c),$s.fromBufferAttribute(s,l),h.uv=Li.getInterpolation(tr,Ai,Ti,wi,js,Qs,$s,new at)),r&&(js.fromBufferAttribute(r,o),Qs.fromBufferAttribute(r,c),$s.fromBufferAttribute(r,l),h.uv1=Li.getInterpolation(tr,Ai,Ti,wi,js,Qs,$s,new at),h.uv2=h.uv1),a&&(Rc.fromBufferAttribute(a,o),Cc.fromBufferAttribute(a,c),Pc.fromBufferAttribute(a,l),h.normal=Li.getInterpolation(tr,Ai,Ti,wi,Rc,Cc,Pc,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:c,c:l,normal:new P,materialIndex:0};Li.getNormal(Ai,Ti,wi,u.normal),h.face=u}return h}var Dn=class i extends ze{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],u=[],d=0,p=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new he(l,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(u,2));function g(_,m,f,b,x,A,L,w,T,W,v){let E=A/T,B=L/W,K=A/2,ot=L/2,U=w/2,F=T+1,Y=W+1,$=0,J=0,q=new P;for(let tt=0;tt<Y;tt++){let k=tt*B-ot;for(let ct=0;ct<F;ct++){let H=ct*E-K;q[_]=H*b,q[m]=k*x,q[f]=U,l.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[f]=w>0?1:-1,h.push(q.x,q.y,q.z),u.push(ct/T),u.push(1-tt/W),$+=1}}for(let tt=0;tt<W;tt++)for(let k=0;k<T;k++){let ct=d+k+F*tt,H=d+k+F*(tt+1),Q=d+(k+1)+F*(tt+1),xt=d+(k+1)+F*tt;c.push(ct,H,xt),c.push(H,Q,xt),J+=6}o.addGroup(p,J,v),p+=J,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Wi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ge(i){let t={};for(let e=0;e<i.length;e++){let n=Wi(i[e]);for(let s in n)t[s]=n[s]}return t}function du(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Sl(i){return i.getRenderTarget()===null?i.outputColorSpace:ce.workingColorSpace}var fu={clone:Wi,merge:Ge},pu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Nn=class extends Kn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pu,this.fragmentShader=mu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Wi(t.uniforms),this.uniformsGroups=du(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Er=class extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Me,this.projectionMatrix=new Me,this.projectionMatrixInverse=new Me,this.coordinateSystem=Cn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},qe=class extends Er{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=_s*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(as*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return _s*2*Math.atan(Math.tan(as*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(as*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Ri=-90,Ci=1,Vo=class extends Xe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new qe(Ri,Ci,t,e);s.layers=this.layers,this.add(s);let r=new qe(Ri,Ci,t,e);r.layers=this.layers,this.add(r);let a=new qe(Ri,Ci,t,e);a.layers=this.layers,this.add(a);let o=new qe(Ri,Ci,t,e);o.layers=this.layers,this.add(o);let c=new qe(Ri,Ci,t,e);c.layers=this.layers,this.add(c);let l=new qe(Ri,Ci,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(let l of e)this.remove(l);if(t===Cn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===gr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Ar=class extends $e{constructor(t,e,n,s,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:zi,super(t,e,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Go=class extends Ln{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(ls("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===oi?Ee:nn),this.texture=new Ar(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:en}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Dn(5,5,5),r=new Nn({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Fe,blending:Xn});r.uniforms.tEquirect.value=e;let a=new le(s,r),o=e.minFilter;return e.minFilter===ms&&(e.minFilter=en),new Vo(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}},So=new P,gu=new P,_u=new ie,hn=class{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=So.subVectors(n,e).cross(gu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(So),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||_u.getNormalMatrix(t),s=this.coplanarPoint(So).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ti=new ys,ir=new P,Ms=class{constructor(t=new hn,e=new hn,n=new hn,s=new hn,r=new hn,a=new hn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Cn){let n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],b=s[13],x=s[14],A=s[15];if(n[0].setComponents(c-r,d-l,m-p,A-f).normalize(),n[1].setComponents(c+r,d+l,m+p,A+f).normalize(),n[2].setComponents(c+a,d+h,m+g,A+b).normalize(),n[3].setComponents(c-a,d-h,m-g,A-b).normalize(),n[4].setComponents(c-o,d-u,m-_,A-x).normalize(),e===Cn)n[5].setComponents(c+o,d+u,m+_,A+x).normalize();else if(e===gr)n[5].setComponents(o,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ti.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ti.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ti)}intersectsSprite(t){return ti.center.set(0,0,0),ti.radius=.7071067811865476,ti.applyMatrix4(t.matrixWorld),this.intersectsSphere(ti)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(ir.x=s.normal.x>0?t.max.x:t.min.x,ir.y=s.normal.y>0?t.max.y:t.min.y,ir.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ir)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function bl(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function xu(i,t){let e=t.isWebGL2,n=new WeakMap;function s(l,h){let u=l.array,d=l.usage,p=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),l.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:p}}function r(l,h,u){let d=h.array,p=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,l),p.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let _=0,m=g.length;_<m;_++){let f=g[_];e?i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}p.count!==-1&&(e?i.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d,p.offset,p.count):i.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);let h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){let d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);let u=n.get(l);if(u===void 0)n.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:a,remove:o,update:c}}var Ss=class i extends ze{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=t/o,d=e/c,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){let b=f*d-a;for(let x=0;x<l;x++){let A=x*u-r;g.push(A,-b,0),_.push(0,0,1),m.push(x/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let b=0;b<o;b++){let x=b+l*f,A=b+l*(f+1),L=b+1+l*(f+1),w=b+1+l*f;p.push(x,A,w),p.push(A,L,w)}this.setIndex(p),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(_,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},yu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Mu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Su=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Eu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Au=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Tu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wu=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ru=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Cu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Iu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Lu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Uu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Du=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Nu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ou=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Fu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,zu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ku=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Hu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Vu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Gu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Wu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Xu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ku="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ju=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,ju=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Qu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,$u=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,td=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ed=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,nd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,id=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,od=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ad=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,cd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ld=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ud=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,dd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,fd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,md=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_d=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,xd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,vd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Md=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ed=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Ad=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Td=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Cd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Id=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ld=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ud=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Dd=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Nd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Od=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Fd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Bd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Hd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Vd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Yd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Zd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$d=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,ef=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,nf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,sf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,rf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,of=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,af=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,lf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,uf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,df=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ff=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_f=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,yf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,vf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ef=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Af=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Tf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,wf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Rf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Cf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,If=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Lf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Uf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Df=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Of=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ff=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Bf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,kf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Hf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Wf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Zf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Kf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Jf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Qf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:yu,alphahash_pars_fragment:vu,alphamap_fragment:Mu,alphamap_pars_fragment:Su,alphatest_fragment:bu,alphatest_pars_fragment:Eu,aomap_fragment:Au,aomap_pars_fragment:Tu,batching_pars_vertex:wu,batching_vertex:Ru,begin_vertex:Cu,beginnormal_vertex:Pu,bsdfs:Iu,iridescence_fragment:Lu,bumpmap_pars_fragment:Uu,clipping_planes_fragment:Du,clipping_planes_pars_fragment:Nu,clipping_planes_pars_vertex:Ou,clipping_planes_vertex:Fu,color_fragment:Bu,color_pars_fragment:zu,color_pars_vertex:ku,color_vertex:Hu,common:Vu,cube_uv_reflection_fragment:Gu,defaultnormal_vertex:Wu,displacementmap_pars_vertex:Xu,displacementmap_vertex:Yu,emissivemap_fragment:qu,emissivemap_pars_fragment:Zu,colorspace_fragment:Ku,colorspace_pars_fragment:Ju,envmap_fragment:ju,envmap_common_pars_fragment:Qu,envmap_pars_fragment:$u,envmap_pars_vertex:td,envmap_physical_pars_fragment:dd,envmap_vertex:ed,fog_vertex:nd,fog_pars_vertex:id,fog_fragment:sd,fog_pars_fragment:rd,gradientmap_pars_fragment:od,lightmap_fragment:ad,lightmap_pars_fragment:cd,lights_lambert_fragment:ld,lights_lambert_pars_fragment:hd,lights_pars_begin:ud,lights_toon_fragment:fd,lights_toon_pars_fragment:pd,lights_phong_fragment:md,lights_phong_pars_fragment:gd,lights_physical_fragment:_d,lights_physical_pars_fragment:xd,lights_fragment_begin:yd,lights_fragment_maps:vd,lights_fragment_end:Md,logdepthbuf_fragment:Sd,logdepthbuf_pars_fragment:bd,logdepthbuf_pars_vertex:Ed,logdepthbuf_vertex:Ad,map_fragment:Td,map_pars_fragment:wd,map_particle_fragment:Rd,map_particle_pars_fragment:Cd,metalnessmap_fragment:Pd,metalnessmap_pars_fragment:Id,morphcolor_vertex:Ld,morphnormal_vertex:Ud,morphtarget_pars_vertex:Dd,morphtarget_vertex:Nd,normal_fragment_begin:Od,normal_fragment_maps:Fd,normal_pars_fragment:Bd,normal_pars_vertex:zd,normal_vertex:kd,normalmap_pars_fragment:Hd,clearcoat_normal_fragment_begin:Vd,clearcoat_normal_fragment_maps:Gd,clearcoat_pars_fragment:Wd,iridescence_pars_fragment:Xd,opaque_fragment:Yd,packing:qd,premultiplied_alpha_fragment:Zd,project_vertex:Kd,dithering_fragment:Jd,dithering_pars_fragment:jd,roughnessmap_fragment:Qd,roughnessmap_pars_fragment:$d,shadowmap_pars_fragment:tf,shadowmap_pars_vertex:ef,shadowmap_vertex:nf,shadowmask_pars_fragment:sf,skinbase_vertex:rf,skinning_pars_vertex:of,skinning_vertex:af,skinnormal_vertex:cf,specularmap_fragment:lf,specularmap_pars_fragment:hf,tonemapping_fragment:uf,tonemapping_pars_fragment:df,transmission_fragment:ff,transmission_pars_fragment:pf,uv_pars_fragment:mf,uv_pars_vertex:gf,uv_vertex:_f,worldpos_vertex:xf,background_vert:yf,background_frag:vf,backgroundCube_vert:Mf,backgroundCube_frag:Sf,cube_vert:bf,cube_frag:Ef,depth_vert:Af,depth_frag:Tf,distanceRGBA_vert:wf,distanceRGBA_frag:Rf,equirect_vert:Cf,equirect_frag:Pf,linedashed_vert:If,linedashed_frag:Lf,meshbasic_vert:Uf,meshbasic_frag:Df,meshlambert_vert:Nf,meshlambert_frag:Of,meshmatcap_vert:Ff,meshmatcap_frag:Bf,meshnormal_vert:zf,meshnormal_frag:kf,meshphong_vert:Hf,meshphong_frag:Vf,meshphysical_vert:Gf,meshphysical_frag:Wf,meshtoon_vert:Xf,meshtoon_frag:Yf,points_vert:qf,points_frag:Zf,shadow_vert:Kf,shadow_frag:Jf,sprite_vert:jf,sprite_frag:Qf},Mt={common:{diffuse:{value:new ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ie}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ie},normalScale:{value:new at(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0},uvTransform:{value:new ie}},sprite:{diffuse:{value:new ne(16777215)},opacity:{value:1},center:{value:new at(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}}},xn={basic:{uniforms:Ge([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Ge([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new ne(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Ge([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new ne(0)},specular:{value:new ne(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Ge([Mt.common,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.roughnessmap,Mt.metalnessmap,Mt.fog,Mt.lights,{emissive:{value:new ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Ge([Mt.common,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.gradientmap,Mt.fog,Mt.lights,{emissive:{value:new ne(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Ge([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Ge([Mt.points,Mt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Ge([Mt.common,Mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Ge([Mt.common,Mt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Ge([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Ge([Mt.sprite,Mt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Ge([Mt.common,Mt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Ge([Mt.lights,Mt.fog,{color:{value:new ne(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};xn.physical={uniforms:Ge([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ie},clearcoatNormalScale:{value:new at(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ie},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ie},sheen:{value:0},sheenColor:{value:new ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ie},transmissionSamplerSize:{value:new at},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ie},attenuationDistance:{value:0},attenuationColor:{value:new ne(0)},specularColor:{value:new ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ie},anisotropyVector:{value:new at},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ie}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};var sr={r:0,b:0,g:0};function $f(i,t,e,n,s,r,a){let o=new ne(0),c=r===!0?0:1,l,h,u=null,d=0,p=null;function g(m,f){let b=!1,x=f.isScene===!0?f.background:null;x&&x.isTexture&&(x=(f.backgroundBlurriness>0?e:t).get(x)),x===null?_(o,c):x&&x.isColor&&(_(x,1),b=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||b)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Vr)?(h===void 0&&(h=new le(new Dn(1,1,1),new Nn({name:"BackgroundCubeMaterial",uniforms:Wi(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Fe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=ce.getTransfer(x.colorSpace)!==de,(u!==x||d!==x.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,p=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new le(new Ss(2,2),new Nn({name:"BackgroundMaterial",uniforms:Wi(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,l.material.toneMapped=ce.getTransfer(x.colorSpace)!==de,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,p=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function _(m,f){m.getRGB(sr,Sl(i)),n.buffers.color.setClear(sr.r,sr.g,sr.b,f,a)}return{getClearColor:function(){return o},setClearColor:function(m,f=1){o.set(m),c=f,_(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,_(o,c)},render:g}}function tp(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},c=m(null),l=c,h=!1;function u(U,F,Y,$,J){let q=!1;if(a){let tt=_($,Y,F);l!==tt&&(l=tt,p(l.object)),q=f(U,$,Y,J),q&&b(U,$,Y,J)}else{let tt=F.wireframe===!0;(l.geometry!==$.id||l.program!==Y.id||l.wireframe!==tt)&&(l.geometry=$.id,l.program=Y.id,l.wireframe=tt,q=!0)}J!==null&&e.update(J,i.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,W(U,F,Y,$),J!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(J).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function p(U){return n.isWebGL2?i.bindVertexArray(U):r.bindVertexArrayOES(U)}function g(U){return n.isWebGL2?i.deleteVertexArray(U):r.deleteVertexArrayOES(U)}function _(U,F,Y){let $=Y.wireframe===!0,J=o[U.id];J===void 0&&(J={},o[U.id]=J);let q=J[F.id];q===void 0&&(q={},J[F.id]=q);let tt=q[$];return tt===void 0&&(tt=m(d()),q[$]=tt),tt}function m(U){let F=[],Y=[],$=[];for(let J=0;J<s;J++)F[J]=0,Y[J]=0,$[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:Y,attributeDivisors:$,object:U,attributes:{},index:null}}function f(U,F,Y,$){let J=l.attributes,q=F.attributes,tt=0,k=Y.getAttributes();for(let ct in k)if(k[ct].location>=0){let Q=J[ct],xt=q[ct];if(xt===void 0&&(ct==="instanceMatrix"&&U.instanceMatrix&&(xt=U.instanceMatrix),ct==="instanceColor"&&U.instanceColor&&(xt=U.instanceColor)),Q===void 0||Q.attribute!==xt||xt&&Q.data!==xt.data)return!0;tt++}return l.attributesNum!==tt||l.index!==$}function b(U,F,Y,$){let J={},q=F.attributes,tt=0,k=Y.getAttributes();for(let ct in k)if(k[ct].location>=0){let Q=q[ct];Q===void 0&&(ct==="instanceMatrix"&&U.instanceMatrix&&(Q=U.instanceMatrix),ct==="instanceColor"&&U.instanceColor&&(Q=U.instanceColor));let xt={};xt.attribute=Q,Q&&Q.data&&(xt.data=Q.data),J[ct]=xt,tt++}l.attributes=J,l.attributesNum=tt,l.index=$}function x(){let U=l.newAttributes;for(let F=0,Y=U.length;F<Y;F++)U[F]=0}function A(U){L(U,0)}function L(U,F){let Y=l.newAttributes,$=l.enabledAttributes,J=l.attributeDivisors;Y[U]=1,$[U]===0&&(i.enableVertexAttribArray(U),$[U]=1),J[U]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](U,F),J[U]=F)}function w(){let U=l.newAttributes,F=l.enabledAttributes;for(let Y=0,$=F.length;Y<$;Y++)F[Y]!==U[Y]&&(i.disableVertexAttribArray(Y),F[Y]=0)}function T(U,F,Y,$,J,q,tt){tt===!0?i.vertexAttribIPointer(U,F,Y,J,q):i.vertexAttribPointer(U,F,Y,$,J,q)}function W(U,F,Y,$){if(n.isWebGL2===!1&&(U.isInstancedMesh||$.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();let J=$.attributes,q=Y.getAttributes(),tt=F.defaultAttributeValues;for(let k in q){let ct=q[k];if(ct.location>=0){let H=J[k];if(H===void 0&&(k==="instanceMatrix"&&U.instanceMatrix&&(H=U.instanceMatrix),k==="instanceColor"&&U.instanceColor&&(H=U.instanceColor)),H!==void 0){let Q=H.normalized,xt=H.itemSize,Tt=e.get(H);if(Tt===void 0)continue;let yt=Tt.buffer,Nt=Tt.type,kt=Tt.bytesPerElement,At=n.isWebGL2===!0&&(Nt===i.INT||Nt===i.UNSIGNED_INT||H.gpuType===hl);if(H.isInterleavedBufferAttribute){let Bt=H.data,I=Bt.stride,ht=H.offset;if(Bt.isInstancedInterleavedBuffer){for(let Z=0;Z<ct.locationSize;Z++)L(ct.location+Z,Bt.meshPerAttribute);U.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=Bt.meshPerAttribute*Bt.count)}else for(let Z=0;Z<ct.locationSize;Z++)A(ct.location+Z);i.bindBuffer(i.ARRAY_BUFFER,yt);for(let Z=0;Z<ct.locationSize;Z++)T(ct.location+Z,xt/ct.locationSize,Nt,Q,I*kt,(ht+xt/ct.locationSize*Z)*kt,At)}else{if(H.isInstancedBufferAttribute){for(let Bt=0;Bt<ct.locationSize;Bt++)L(ct.location+Bt,H.meshPerAttribute);U.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let Bt=0;Bt<ct.locationSize;Bt++)A(ct.location+Bt);i.bindBuffer(i.ARRAY_BUFFER,yt);for(let Bt=0;Bt<ct.locationSize;Bt++)T(ct.location+Bt,xt/ct.locationSize,Nt,Q,xt*kt,xt/ct.locationSize*Bt*kt,At)}}else if(tt!==void 0){let Q=tt[k];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(ct.location,Q);break;case 3:i.vertexAttrib3fv(ct.location,Q);break;case 4:i.vertexAttrib4fv(ct.location,Q);break;default:i.vertexAttrib1fv(ct.location,Q)}}}}w()}function v(){K();for(let U in o){let F=o[U];for(let Y in F){let $=F[Y];for(let J in $)g($[J].object),delete $[J];delete F[Y]}delete o[U]}}function E(U){if(o[U.id]===void 0)return;let F=o[U.id];for(let Y in F){let $=F[Y];for(let J in $)g($[J].object),delete $[J];delete F[Y]}delete o[U.id]}function B(U){for(let F in o){let Y=o[F];if(Y[U.id]===void 0)continue;let $=Y[U.id];for(let J in $)g($[J].object),delete $[J];delete Y[U.id]}}function K(){ot(),h=!0,l!==c&&(l=c,p(l.object))}function ot(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:K,resetDefaultState:ot,dispose:v,releaseStatesOfGeometry:E,releaseStatesOfProgram:B,initAttributes:x,enableAttribute:A,disableUnusedAttributes:w}}function ep(i,t,e,n){let s=n.isWebGL2,r;function a(h){r=h}function o(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,d){if(d===0)return;let p,g;if(s)p=i,g="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](r,h,u,d),e.update(u,r,d)}function l(h,u,d){if(d===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{p.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];e.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l}function np(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let T=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",o=e.precision!==void 0?e.precision:"highp",c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);let l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),f=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,A=a||t.has("OES_texture_float"),L=x&&A,w=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:p,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:f,maxFragmentUniforms:b,vertexTextures:x,floatFragmentTextures:A,floatVertexTextures:L,maxSamples:w}}function ip(i){let t=this,e=null,n=0,s=!1,r=!1,a=new hn,o=new ie,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{let b=r?0:n,x=b*4,A=f.clippingState||null;c.value=A,A=h(g,d,x,p);for(let L=0;L!==x;++L)A[L]=e[L];f.clippingState=A,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let f=p+_*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,A=p;x!==_;++x,A+=4)a.copy(u[x]).applyMatrix4(b,o),a.normal.toArray(m,A),m[A+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function sp(i){let t=new WeakMap;function e(a,o){return o===No?a.mapping=zi:o===Oo&&(a.mapping=ki),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===No||o===Oo)if(t.has(a)){let c=t.get(a).texture;return e(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new Go(c.height/2);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Xi=class extends Er{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ui=4,Ic=[.125,.215,.35,.446,.526,.582],ii=20,bo=new Xi,Lc=new ne,Eo=null,Ao=0,To=0,ei=(1+Math.sqrt(5))/2,Pi=1/ei,Uc=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,ei,Pi),new P(0,ei,-Pi),new P(Pi,0,ei),new P(-Pi,0,ei),new P(ei,Pi,0),new P(-ei,Pi,0)],Yi=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Eo=this._renderer.getRenderTarget(),Ao=this._renderer.getActiveCubeFace(),To=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Eo,Ao,To),t.scissorTest=!1,rr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zi||t.mapping===ki?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Eo=this._renderer.getRenderTarget(),Ao=this._renderer.getActiveCubeFace(),To=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:en,minFilter:en,generateMipmaps:!1,type:gs,format:dn,colorSpace:In,depthBuffer:!1},s=Dc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dc(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=rp(r)),this._blurMaterial=op(r,t,e)}return s}_compileMaterial(t){let e=new le(this._lodPlanes[0],t);this._renderer.compile(e,bo)}_sceneToCubeUV(t,e,n,s){let o=new qe(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Lc),h.toneMapping=Yn,h.autoClear=!1;let p=new Gi({name:"PMREM.Background",side:Fe,depthWrite:!1,depthTest:!1}),g=new le(new Dn,p),_=!1,m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(Lc),_=!0);for(let f=0;f<6;f++){let b=f%3;b===0?(o.up.set(0,c[f],0),o.lookAt(l[f],0,0)):b===1?(o.up.set(0,0,c[f]),o.lookAt(0,l[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,l[f]));let x=this._cubeSize;rr(s,b*x,f>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===zi||t.mapping===ki;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nc());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new le(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;rr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,bo)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Uc[(s-1)%Uc.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new le(this._lodPlanes[s],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ii-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):ii;m>ii&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ii}`);let f=[],b=0;for(let T=0;T<ii;++T){let W=T/_,v=Math.exp(-W*W/2);f.push(v),T===0?b+=v:T<m&&(b+=2*v)}for(let T=0;T<f.length;T++)f[T]=f[T]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;let A=this._sizeLods[s],L=3*A*(s>x-Ui?s-x+Ui:0),w=4*(this._cubeSize-A);rr(e,L,w,3*A,2*A),c.setRenderTarget(e),c.render(u,bo)}};function rp(i){let t=[],e=[],n=[],s=i,r=i-Ui+1+Ic.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let c=1/o;a>i-Ui?c=Ic[a-i+Ui-1]:a===0&&(c=0),n.push(c);let l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,f=1,b=new Float32Array(_*g*p),x=new Float32Array(m*g*p),A=new Float32Array(f*g*p);for(let w=0;w<p;w++){let T=w%3*2/3-1,W=w>2?0:-1,v=[T,W,0,T+2/3,W,0,T+2/3,W+1,0,T,W,0,T+2/3,W+1,0,T,W+1,0];b.set(v,_*g*w),x.set(d,m*g*w);let E=[w,w,w,w,w,w];A.set(E,f*g*w)}let L=new ze;L.setAttribute("position",new Be(b,_)),L.setAttribute("uv",new Be(x,m)),L.setAttribute("faceIndex",new Be(A,f)),t.push(L),s>Ui&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Dc(i,t,e){let n=new Ln(i,t,e);return n.texture.mapping=Vr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function rr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function op(i,t,e){let n=new Float32Array(ii),s=new P(0,1,0);return new Nn({name:"SphericalGaussianBlur",defines:{n:ii,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Nc(){return new Nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Oc(){return new Nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Aa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ap(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let c=o.mapping,l=c===No||c===Oo,h=c===zi||c===ki;if(l||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new Yi(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{let u=o.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new Yi(i));let d=l?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,d),o.addEventListener("dispose",r),d.texture}else return null}}}return o}function s(o){let c=0,l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function cp(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function lp(i,t,e,n){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);for(let g in d.morphAttributes){let _=d.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)t.remove(_[m])}d.removeEventListener("dispose",a),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){let d=u.attributes;for(let g in d)t.update(d[g],i.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,f=_.length;m<f;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(u){let d=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let b=p.array;_=p.version;for(let x=0,A=b.length;x<A;x+=3){let L=b[x+0],w=b[x+1],T=b[x+2];d.push(L,w,w,T,T,L)}}else if(g!==void 0){let b=g.array;_=g.version;for(let x=0,A=b.length/3-1;x<A;x+=3){let L=x+0,w=x+1,T=x+2;d.push(L,w,w,T,T,L)}}else return;let m=new(vl(d)?br:Sr)(d,1);m.version=_;let f=r.get(u);f&&t.remove(f),r.set(u,m)}function h(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function hp(i,t,e,n){let s=n.isWebGL2,r;function a(p){r=p}let o,c;function l(p){o=p.type,c=p.bytesPerElement}function h(p,g){i.drawElements(r,g,o,p*c),e.update(g,r,1)}function u(p,g,_){if(_===0)return;let m,f;if(s)m=i,f="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[f](r,g,o,p*c,_),e.update(g,r,_)}function d(p,g,_){if(_===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<_;f++)this.render(p[f]/c,g[f]);else{m.multiDrawElementsWEBGL(r,g,0,o,p,0,_);let f=0;for(let b=0;b<_;b++)f+=g[b];e.update(f,r,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function up(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function dp(i,t){return i[0]-t[0]}function fp(i,t){return Math.abs(t[1])-Math.abs(i[1])}function pp(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,a=new ge,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,h,u){let d=l.morphTargetInfluences;if(t.isWebGL2===!0){let p=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=p!==void 0?p.length:0,_=r.get(h);if(_===void 0||_.count!==g){let U=function(){K.dispose(),r.delete(h),h.removeEventListener("dispose",U)};_!==void 0&&_.texture.dispose();let b=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,A=h.morphAttributes.color!==void 0,L=h.morphAttributes.position||[],w=h.morphAttributes.normal||[],T=h.morphAttributes.color||[],W=0;b===!0&&(W=1),x===!0&&(W=2),A===!0&&(W=3);let v=h.attributes.position.count*W,E=1;v>t.maxTextureSize&&(E=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let B=new Float32Array(v*E*4*g),K=new vr(B,v,E,g);K.type=Wn,K.needsUpdate=!0;let ot=W*4;for(let F=0;F<g;F++){let Y=L[F],$=w[F],J=T[F],q=v*E*4*F;for(let tt=0;tt<Y.count;tt++){let k=tt*ot;b===!0&&(a.fromBufferAttribute(Y,tt),B[q+k+0]=a.x,B[q+k+1]=a.y,B[q+k+2]=a.z,B[q+k+3]=0),x===!0&&(a.fromBufferAttribute($,tt),B[q+k+4]=a.x,B[q+k+5]=a.y,B[q+k+6]=a.z,B[q+k+7]=0),A===!0&&(a.fromBufferAttribute(J,tt),B[q+k+8]=a.x,B[q+k+9]=a.y,B[q+k+10]=a.z,B[q+k+11]=J.itemSize===4?a.w:1)}}_={count:g,texture:K,size:new at(v,E)},r.set(h,_),h.addEventListener("dispose",U)}let m=0;for(let b=0;b<d.length;b++)m+=d[b];let f=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(i,"morphTargetBaseInfluence",f),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",_.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",_.size)}else{let p=d===void 0?0:d.length,g=n[h.id];if(g===void 0||g.length!==p){g=[];for(let x=0;x<p;x++)g[x]=[x,0];n[h.id]=g}for(let x=0;x<p;x++){let A=g[x];A[0]=x,A[1]=d[x]}g.sort(fp);for(let x=0;x<8;x++)x<p&&g[x][1]?(o[x][0]=g[x][0],o[x][1]=g[x][1]):(o[x][0]=Number.MAX_SAFE_INTEGER,o[x][1]=0);o.sort(dp);let _=h.morphAttributes.position,m=h.morphAttributes.normal,f=0;for(let x=0;x<8;x++){let A=o[x],L=A[0],w=A[1];L!==Number.MAX_SAFE_INTEGER&&w?(_&&h.getAttribute("morphTarget"+x)!==_[L]&&h.setAttribute("morphTarget"+x,_[L]),m&&h.getAttribute("morphNormal"+x)!==m[L]&&h.setAttribute("morphNormal"+x,m[L]),s[x]=w,f+=w):(_&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),m&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}let b=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(i,"morphTargetBaseInfluence",b),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function mp(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}var Tr=class extends $e{constructor(t,e,n,s,r,a,o,c,l,h){if(h=h!==void 0?h:ri,h!==ri&&h!==Hi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ri&&(n=Gn),n===void 0&&h===Hi&&(n=si),super(null,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:We,this.minFilter=c!==void 0?c:We,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},El=new $e,Al=new Tr(1,1);Al.compareFunction=yl;var Tl=new vr,wl=new Ho,Rl=new Ar,Fc=[],Bc=[],zc=new Float32Array(16),kc=new Float32Array(9),Hc=new Float32Array(4);function Qi(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Fc[s];if(r===void 0&&(r=new Float32Array(s),Fc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Re(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Wr(i,t){let e=Bc[t];e===void 0&&(e=new Int32Array(t),Bc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function gp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function _p(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Re(e,t)}}function xp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Re(e,t)}}function yp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Re(e,t)}}function vp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(we(e,n))return;Hc.set(n),i.uniformMatrix2fv(this.addr,!1,Hc),Re(e,n)}}function Mp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(we(e,n))return;kc.set(n),i.uniformMatrix3fv(this.addr,!1,kc),Re(e,n)}}function Sp(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(we(e,n))return;zc.set(n),i.uniformMatrix4fv(this.addr,!1,zc),Re(e,n)}}function bp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Ep(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Re(e,t)}}function Ap(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Re(e,t)}}function Tp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Re(e,t)}}function wp(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Rp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Re(e,t)}}function Cp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Re(e,t)}}function Pp(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Re(e,t)}}function Ip(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?Al:El;e.setTexture2D(t||r,s)}function Lp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||wl,s)}function Up(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Rl,s)}function Dp(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Tl,s)}function Np(i){switch(i){case 5126:return gp;case 35664:return _p;case 35665:return xp;case 35666:return yp;case 35674:return vp;case 35675:return Mp;case 35676:return Sp;case 5124:case 35670:return bp;case 35667:case 35671:return Ep;case 35668:case 35672:return Ap;case 35669:case 35673:return Tp;case 5125:return wp;case 36294:return Rp;case 36295:return Cp;case 36296:return Pp;case 35678:case 36198:case 36298:case 36306:case 35682:return Ip;case 35679:case 36299:case 36307:return Lp;case 35680:case 36300:case 36308:case 36293:return Up;case 36289:case 36303:case 36311:case 36292:return Dp}}function Op(i,t){i.uniform1fv(this.addr,t)}function Fp(i,t){let e=Qi(t,this.size,2);i.uniform2fv(this.addr,e)}function Bp(i,t){let e=Qi(t,this.size,3);i.uniform3fv(this.addr,e)}function zp(i,t){let e=Qi(t,this.size,4);i.uniform4fv(this.addr,e)}function kp(i,t){let e=Qi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Hp(i,t){let e=Qi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Vp(i,t){let e=Qi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Gp(i,t){i.uniform1iv(this.addr,t)}function Wp(i,t){i.uniform2iv(this.addr,t)}function Xp(i,t){i.uniform3iv(this.addr,t)}function Yp(i,t){i.uniform4iv(this.addr,t)}function qp(i,t){i.uniform1uiv(this.addr,t)}function Zp(i,t){i.uniform2uiv(this.addr,t)}function Kp(i,t){i.uniform3uiv(this.addr,t)}function Jp(i,t){i.uniform4uiv(this.addr,t)}function jp(i,t,e){let n=this.cache,s=t.length,r=Wr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||El,r[a])}function Qp(i,t,e){let n=this.cache,s=t.length,r=Wr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||wl,r[a])}function $p(i,t,e){let n=this.cache,s=t.length,r=Wr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Rl,r[a])}function tm(i,t,e){let n=this.cache,s=t.length,r=Wr(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Tl,r[a])}function em(i){switch(i){case 5126:return Op;case 35664:return Fp;case 35665:return Bp;case 35666:return zp;case 35674:return kp;case 35675:return Hp;case 35676:return Vp;case 5124:case 35670:return Gp;case 35667:case 35671:return Wp;case 35668:case 35672:return Xp;case 35669:case 35673:return Yp;case 5125:return qp;case 36294:return Zp;case 36295:return Kp;case 36296:return Jp;case 35678:case 36198:case 36298:case 36306:case 35682:return jp;case 35679:case 36299:case 36307:return Qp;case 35680:case 36300:case 36308:case 36293:return $p;case 36289:case 36303:case 36311:case 36292:return tm}}var Wo=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Np(e.type)}},Xo=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=em(e.type)}},Yo=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},wo=/(\w+)(\])?(\[|\.)?/g;function Vc(i,t){i.seq.push(t),i.map[t.id]=t}function nm(i,t,e){let n=i.name,s=n.length;for(wo.lastIndex=0;;){let r=wo.exec(n),a=wo.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Vc(e,l===void 0?new Wo(o,i,t):new Xo(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Yo(o),Vc(e,u)),e=u}}}var Bi=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);nm(r,a,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function Gc(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var im=37297,sm=0;function rm(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function om(i){let t=ce.getPrimaries(ce.workingColorSpace),e=ce.getPrimaries(i),n;switch(t===e?n="":t===mr&&e===pr?n="LinearDisplayP3ToLinearSRGB":t===pr&&e===mr&&(n="LinearSRGBToLinearDisplayP3"),i){case In:case Gr:return[n,"LinearTransferOETF"];case Ee:case ba:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Wc(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+rm(i.getShaderSource(t),a)}else return s}function am(i,t){let e=om(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function cm(i,t){let e;switch(t){case fh:e="Linear";break;case ph:e="Reinhard";break;case mh:e="OptimizedCineon";break;case Ma:e="ACESFilmic";break;case _h:e="AgX";break;case gh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function lm(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Di).join(`
`)}function hm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Di).join(`
`)}function um(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function dm(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Di(i){return i!==""}function Xc(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Yc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var fm=/^[ \t]*#include +<([\w\d./]+)>/gm;function qo(i){return i.replace(fm,mm)}var pm=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function mm(i,t){let e=$t[t];if(e===void 0){let n=pm.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return qo(e)}var gm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qc(i){return i.replace(gm,_m)}function _m(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zc(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function xm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===al?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===va?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Rn&&(t="SHADOWMAP_TYPE_VSM"),t}function ym(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case zi:case ki:t="ENVMAP_TYPE_CUBE";break;case Vr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function vm(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ki:t="ENVMAP_MODE_REFRACTION";break}return t}function Mm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case cl:t="ENVMAP_BLENDING_MULTIPLY";break;case uh:t="ENVMAP_BLENDING_MIX";break;case dh:t="ENVMAP_BLENDING_ADD";break}return t}function Sm(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function bm(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=xm(e),l=ym(e),h=vm(e),u=Mm(e),d=Sm(e),p=e.isWebGL2?"":lm(e),g=hm(e),_=um(r),m=s.createProgram(),f,b,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Di).join(`
`),f.length>0&&(f+=`
`),b=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Di).join(`
`),b.length>0&&(b+=`
`)):(f=[Zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Di).join(`
`),b=[p,Zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Yn?"#define TONE_MAPPING":"",e.toneMapping!==Yn?$t.tonemapping_pars_fragment:"",e.toneMapping!==Yn?cm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,am("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Di).join(`
`)),a=qo(a),a=Xc(a,e),a=Yc(a,e),o=qo(o),o=Xc(o,e),o=Yc(o,e),a=qc(a),o=qc(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,b=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===fc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===fc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+b);let A=x+f+a,L=x+b+o,w=Gc(s,s.VERTEX_SHADER,A),T=Gc(s,s.FRAGMENT_SHADER,L);s.attachShader(m,w),s.attachShader(m,T),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function W(K){if(i.debug.checkShaderErrors){let ot=s.getProgramInfoLog(m).trim(),U=s.getShaderInfoLog(w).trim(),F=s.getShaderInfoLog(T).trim(),Y=!0,$=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(Y=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,w,T);else{let J=Wc(s,w,"vertex"),q=Wc(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+ot+`
`+J+`
`+q)}else ot!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ot):(U===""||F==="")&&($=!1);$&&(K.diagnostics={runnable:Y,programLog:ot,vertexShader:{log:U,prefix:f},fragmentShader:{log:F,prefix:b}})}s.deleteShader(w),s.deleteShader(T),v=new Bi(s,m),E=dm(s,m)}let v;this.getUniforms=function(){return v===void 0&&W(this),v};let E;this.getAttributes=function(){return E===void 0&&W(this),E};let B=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return B===!1&&(B=s.getProgramParameter(m,im)),B},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=sm++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=w,this.fragmentShader=T,this}var Em=0,Zo=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Ko(t),e.set(t,n)),n}},Ko=class{constructor(t){this.id=Em++,this.code=t,this.usedTimes=0}};function Am(i,t,e,n,s,r,a){let o=new vs,c=new Zo,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return v===0?"uv":`uv${v}`}function m(v,E,B,K,ot){let U=K.fog,F=ot.geometry,Y=v.isMeshStandardMaterial?K.environment:null,$=(v.isMeshStandardMaterial?e:t).get(v.envMap||Y),J=$&&$.mapping===Vr?$.image.height:null,q=g[v.type];v.precision!==null&&(p=s.getMaxPrecision(v.precision),p!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",p,"instead."));let tt=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,k=tt!==void 0?tt.length:0,ct=0;F.morphAttributes.position!==void 0&&(ct=1),F.morphAttributes.normal!==void 0&&(ct=2),F.morphAttributes.color!==void 0&&(ct=3);let H,Q,xt,Tt;if(q){let Se=xn[q];H=Se.vertexShader,Q=Se.fragmentShader}else H=v.vertexShader,Q=v.fragmentShader,c.update(v),xt=c.getVertexShaderID(v),Tt=c.getFragmentShaderID(v);let yt=i.getRenderTarget(),Nt=ot.isInstancedMesh===!0,kt=ot.isBatchedMesh===!0,At=!!v.map,Bt=!!v.matcap,I=!!$,ht=!!v.aoMap,Z=!!v.lightMap,ut=!!v.bumpMap,j=!!v.normalMap,wt=!!v.displacementMap,bt=!!v.emissiveMap,M=!!v.metalnessMap,y=!!v.roughnessMap,N=v.anisotropy>0,rt=v.clearcoat>0,st=v.iridescence>0,et=v.sheen>0,Ct=v.transmission>0,vt=N&&!!v.anisotropyMap,Et=rt&&!!v.clearcoatMap,Ot=rt&&!!v.clearcoatNormalMap,Xt=rt&&!!v.clearcoatRoughnessMap,nt=st&&!!v.iridescenceMap,qt=st&&!!v.iridescenceThicknessMap,C=et&&!!v.sheenColorMap,it=et&&!!v.sheenRoughnessMap,gt=!!v.specularMap,ft=!!v.specularColorMap,Pt=!!v.specularIntensityMap,Zt=Ct&&!!v.transmissionMap,Yt=Ct&&!!v.thicknessMap,Qt=!!v.gradientMap,_t=!!v.alphaMap,D=v.alphaTest>0,pt=!!v.alphaHash,mt=!!v.extensions,Ft=!!F.attributes.uv1,Lt=!!F.attributes.uv2,Kt=!!F.attributes.uv3,se=Yn;return v.toneMapped&&(yt===null||yt.isXRRenderTarget===!0)&&(se=i.toneMapping),{isWebGL2:h,shaderID:q,shaderType:v.type,shaderName:v.name,vertexShader:H,fragmentShader:Q,defines:v.defines,customVertexShaderID:xt,customFragmentShaderID:Tt,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:p,batching:kt,instancing:Nt,instancingColor:Nt&&ot.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:yt===null?i.outputColorSpace:yt.isXRRenderTarget===!0?yt.texture.colorSpace:In,map:At,matcap:Bt,envMap:I,envMapMode:I&&$.mapping,envMapCubeUVHeight:J,aoMap:ht,lightMap:Z,bumpMap:ut,normalMap:j,displacementMap:d&&wt,emissiveMap:bt,normalMapObjectSpace:j&&v.normalMapType===Ch,normalMapTangentSpace:j&&v.normalMapType===xl,metalnessMap:M,roughnessMap:y,anisotropy:N,anisotropyMap:vt,clearcoat:rt,clearcoatMap:Et,clearcoatNormalMap:Ot,clearcoatRoughnessMap:Xt,iridescence:st,iridescenceMap:nt,iridescenceThicknessMap:qt,sheen:et,sheenColorMap:C,sheenRoughnessMap:it,specularMap:gt,specularColorMap:ft,specularIntensityMap:Pt,transmission:Ct,transmissionMap:Zt,thicknessMap:Yt,gradientMap:Qt,opaque:v.transparent===!1&&v.blending===Oi,alphaMap:_t,alphaTest:D,alphaHash:pt,combine:v.combine,mapUv:At&&_(v.map.channel),aoMapUv:ht&&_(v.aoMap.channel),lightMapUv:Z&&_(v.lightMap.channel),bumpMapUv:ut&&_(v.bumpMap.channel),normalMapUv:j&&_(v.normalMap.channel),displacementMapUv:wt&&_(v.displacementMap.channel),emissiveMapUv:bt&&_(v.emissiveMap.channel),metalnessMapUv:M&&_(v.metalnessMap.channel),roughnessMapUv:y&&_(v.roughnessMap.channel),anisotropyMapUv:vt&&_(v.anisotropyMap.channel),clearcoatMapUv:Et&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:Ot&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Xt&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:nt&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:qt&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:C&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:it&&_(v.sheenRoughnessMap.channel),specularMapUv:gt&&_(v.specularMap.channel),specularColorMapUv:ft&&_(v.specularColorMap.channel),specularIntensityMapUv:Pt&&_(v.specularIntensityMap.channel),transmissionMapUv:Zt&&_(v.transmissionMap.channel),thicknessMapUv:Yt&&_(v.thicknessMap.channel),alphaMapUv:_t&&_(v.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(j||N),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Ft,vertexUv2s:Lt,vertexUv3s:Kt,pointsUvs:ot.isPoints===!0&&!!F.attributes.uv&&(At||_t),fog:!!U,useFog:v.fog===!0,fogExp2:U&&U.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:ot.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:k,morphTextureStride:ct,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&B.length>0,shadowMapType:i.shadowMap.type,toneMapping:se,useLegacyLights:i._useLegacyLights,decodeVideoTexture:At&&v.map.isVideoTexture===!0&&ce.getTransfer(v.map.colorSpace)===de,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Oe,flipSided:v.side===Fe,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionDerivatives:mt&&v.extensions.derivatives===!0,extensionFragDepth:mt&&v.extensions.fragDepth===!0,extensionDrawBuffers:mt&&v.extensions.drawBuffers===!0,extensionShaderTextureLOD:mt&&v.extensions.shaderTextureLOD===!0,extensionClipCullDistance:mt&&v.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()}}function f(v){let E=[];if(v.shaderID?E.push(v.shaderID):(E.push(v.customVertexShaderID),E.push(v.customFragmentShaderID)),v.defines!==void 0)for(let B in v.defines)E.push(B),E.push(v.defines[B]);return v.isRawShaderMaterial===!1&&(b(E,v),x(E,v),E.push(i.outputColorSpace)),E.push(v.customProgramCacheKey),E.join()}function b(v,E){v.push(E.precision),v.push(E.outputColorSpace),v.push(E.envMapMode),v.push(E.envMapCubeUVHeight),v.push(E.mapUv),v.push(E.alphaMapUv),v.push(E.lightMapUv),v.push(E.aoMapUv),v.push(E.bumpMapUv),v.push(E.normalMapUv),v.push(E.displacementMapUv),v.push(E.emissiveMapUv),v.push(E.metalnessMapUv),v.push(E.roughnessMapUv),v.push(E.anisotropyMapUv),v.push(E.clearcoatMapUv),v.push(E.clearcoatNormalMapUv),v.push(E.clearcoatRoughnessMapUv),v.push(E.iridescenceMapUv),v.push(E.iridescenceThicknessMapUv),v.push(E.sheenColorMapUv),v.push(E.sheenRoughnessMapUv),v.push(E.specularMapUv),v.push(E.specularColorMapUv),v.push(E.specularIntensityMapUv),v.push(E.transmissionMapUv),v.push(E.thicknessMapUv),v.push(E.combine),v.push(E.fogExp2),v.push(E.sizeAttenuation),v.push(E.morphTargetsCount),v.push(E.morphAttributeCount),v.push(E.numDirLights),v.push(E.numPointLights),v.push(E.numSpotLights),v.push(E.numSpotLightMaps),v.push(E.numHemiLights),v.push(E.numRectAreaLights),v.push(E.numDirLightShadows),v.push(E.numPointLightShadows),v.push(E.numSpotLightShadows),v.push(E.numSpotLightShadowsWithMaps),v.push(E.numLightProbes),v.push(E.shadowMapType),v.push(E.toneMapping),v.push(E.numClippingPlanes),v.push(E.numClipIntersection),v.push(E.depthPacking)}function x(v,E){o.disableAll(),E.isWebGL2&&o.enable(0),E.supportsVertexTextures&&o.enable(1),E.instancing&&o.enable(2),E.instancingColor&&o.enable(3),E.matcap&&o.enable(4),E.envMap&&o.enable(5),E.normalMapObjectSpace&&o.enable(6),E.normalMapTangentSpace&&o.enable(7),E.clearcoat&&o.enable(8),E.iridescence&&o.enable(9),E.alphaTest&&o.enable(10),E.vertexColors&&o.enable(11),E.vertexAlphas&&o.enable(12),E.vertexUv1s&&o.enable(13),E.vertexUv2s&&o.enable(14),E.vertexUv3s&&o.enable(15),E.vertexTangents&&o.enable(16),E.anisotropy&&o.enable(17),E.alphaHash&&o.enable(18),E.batching&&o.enable(19),v.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.skinning&&o.enable(4),E.morphTargets&&o.enable(5),E.morphNormals&&o.enable(6),E.morphColors&&o.enable(7),E.premultipliedAlpha&&o.enable(8),E.shadowMapEnabled&&o.enable(9),E.useLegacyLights&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),v.push(o.mask)}function A(v){let E=g[v.type],B;if(E){let K=xn[E];B=fu.clone(K.uniforms)}else B=v.uniforms;return B}function L(v,E){let B;for(let K=0,ot=l.length;K<ot;K++){let U=l[K];if(U.cacheKey===E){B=U,++B.usedTimes;break}}return B===void 0&&(B=new bm(i,E,v,r),l.push(B)),B}function w(v){if(--v.usedTimes===0){let E=l.indexOf(v);l[E]=l[l.length-1],l.pop(),v.destroy()}}function T(v){c.remove(v)}function W(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:A,acquireProgram:L,releaseProgram:w,releaseShaderCache:T,programs:l,dispose:W}}function Tm(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function wm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Kc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Jc(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,d,p,g,_,m){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),t++,f}function o(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||wm),n.length>1&&n.sort(d||Kc),s.length>1&&s.sort(d||Kc)}function h(){for(let u=t,d=i.length;u<d;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function Rm(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new Jc,i.set(n,[a])):s>=r.length?(a=new Jc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Cm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new ne};break;case"SpotLight":e={position:new P,direction:new P,color:new ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new ne,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new ne,groundColor:new ne};break;case"RectAreaLight":e={color:new ne,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function Pm(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Im=0;function Lm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Um(i,t){let e=new Cm,n=Pm(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new P);let r=new P,a=new Me,o=new Me;function c(h,u){let d=0,p=0,g=0;for(let K=0;K<9;K++)s.probe[K].set(0,0,0);let _=0,m=0,f=0,b=0,x=0,A=0,L=0,w=0,T=0,W=0,v=0;h.sort(Lm);let E=u===!0?Math.PI:1;for(let K=0,ot=h.length;K<ot;K++){let U=h[K],F=U.color,Y=U.intensity,$=U.distance,J=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)d+=F.r*Y*E,p+=F.g*Y*E,g+=F.b*Y*E;else if(U.isLightProbe){for(let q=0;q<9;q++)s.probe[q].addScaledVector(U.sh.coefficients[q],Y);v++}else if(U.isDirectionalLight){let q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity*E),U.castShadow){let tt=U.shadow,k=n.get(U);k.shadowBias=tt.bias,k.shadowNormalBias=tt.normalBias,k.shadowRadius=tt.radius,k.shadowMapSize=tt.mapSize,s.directionalShadow[_]=k,s.directionalShadowMap[_]=J,s.directionalShadowMatrix[_]=U.shadow.matrix,A++}s.directional[_]=q,_++}else if(U.isSpotLight){let q=e.get(U);q.position.setFromMatrixPosition(U.matrixWorld),q.color.copy(F).multiplyScalar(Y*E),q.distance=$,q.coneCos=Math.cos(U.angle),q.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),q.decay=U.decay,s.spot[f]=q;let tt=U.shadow;if(U.map&&(s.spotLightMap[T]=U.map,T++,tt.updateMatrices(U),U.castShadow&&W++),s.spotLightMatrix[f]=tt.matrix,U.castShadow){let k=n.get(U);k.shadowBias=tt.bias,k.shadowNormalBias=tt.normalBias,k.shadowRadius=tt.radius,k.shadowMapSize=tt.mapSize,s.spotShadow[f]=k,s.spotShadowMap[f]=J,w++}f++}else if(U.isRectAreaLight){let q=e.get(U);q.color.copy(F).multiplyScalar(Y),q.halfWidth.set(U.width*.5,0,0),q.halfHeight.set(0,U.height*.5,0),s.rectArea[b]=q,b++}else if(U.isPointLight){let q=e.get(U);if(q.color.copy(U.color).multiplyScalar(U.intensity*E),q.distance=U.distance,q.decay=U.decay,U.castShadow){let tt=U.shadow,k=n.get(U);k.shadowBias=tt.bias,k.shadowNormalBias=tt.normalBias,k.shadowRadius=tt.radius,k.shadowMapSize=tt.mapSize,k.shadowCameraNear=tt.camera.near,k.shadowCameraFar=tt.camera.far,s.pointShadow[m]=k,s.pointShadowMap[m]=J,s.pointShadowMatrix[m]=U.shadow.matrix,L++}s.point[m]=q,m++}else if(U.isHemisphereLight){let q=e.get(U);q.skyColor.copy(U.color).multiplyScalar(Y*E),q.groundColor.copy(U.groundColor).multiplyScalar(Y*E),s.hemi[x]=q,x++}}b>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Mt.LTC_FLOAT_1,s.rectAreaLTC2=Mt.LTC_FLOAT_2):(s.rectAreaLTC1=Mt.LTC_HALF_1,s.rectAreaLTC2=Mt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Mt.LTC_FLOAT_1,s.rectAreaLTC2=Mt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Mt.LTC_HALF_1,s.rectAreaLTC2=Mt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=p,s.ambient[2]=g;let B=s.hash;(B.directionalLength!==_||B.pointLength!==m||B.spotLength!==f||B.rectAreaLength!==b||B.hemiLength!==x||B.numDirectionalShadows!==A||B.numPointShadows!==L||B.numSpotShadows!==w||B.numSpotMaps!==T||B.numLightProbes!==v)&&(s.directional.length=_,s.spot.length=f,s.rectArea.length=b,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=A,s.directionalShadowMap.length=A,s.pointShadow.length=L,s.pointShadowMap.length=L,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=A,s.pointShadowMatrix.length=L,s.spotLightMatrix.length=w+T-W,s.spotLightMap.length=T,s.numSpotLightShadowsWithMaps=W,s.numLightProbes=v,B.directionalLength=_,B.pointLength=m,B.spotLength=f,B.rectAreaLength=b,B.hemiLength=x,B.numDirectionalShadows=A,B.numPointShadows=L,B.numSpotShadows=w,B.numSpotMaps=T,B.numLightProbes=v,s.version=Im++)}function l(h,u){let d=0,p=0,g=0,_=0,m=0,f=u.matrixWorldInverse;for(let b=0,x=h.length;b<x;b++){let A=h[b];if(A.isDirectionalLight){let L=s.directional[d];L.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),L.direction.sub(r),L.direction.transformDirection(f),d++}else if(A.isSpotLight){let L=s.spot[g];L.position.setFromMatrixPosition(A.matrixWorld),L.position.applyMatrix4(f),L.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),L.direction.sub(r),L.direction.transformDirection(f),g++}else if(A.isRectAreaLight){let L=s.rectArea[_];L.position.setFromMatrixPosition(A.matrixWorld),L.position.applyMatrix4(f),o.identity(),a.copy(A.matrixWorld),a.premultiply(f),o.extractRotation(a),L.halfWidth.set(A.width*.5,0,0),L.halfHeight.set(0,A.height*.5,0),L.halfWidth.applyMatrix4(o),L.halfHeight.applyMatrix4(o),_++}else if(A.isPointLight){let L=s.point[p];L.position.setFromMatrixPosition(A.matrixWorld),L.position.applyMatrix4(f),p++}else if(A.isHemisphereLight){let L=s.hemi[m];L.direction.setFromMatrixPosition(A.matrixWorld),L.direction.transformDirection(f),m++}}}return{setup:c,setupView:l,state:s}}function jc(i,t){let e=new Um(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function o(u){s.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function Dm(i,t){let e=new WeakMap;function n(r,a=0){let o=e.get(r),c;return o===void 0?(c=new jc(i,t),e.set(r,[c])):a>=o.length?(c=new jc(i,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:n,dispose:s}}var Jo=class extends Kn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=wh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},jo=class extends Kn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Nm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Om=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Fm(i,t,e){let n=new Ms,s=new at,r=new at,a=new ge,o=new Jo({depthPacking:Rh}),c=new jo,l={},h=e.maxTextureSize,u={[Zn]:Fe,[Fe]:Zn,[Oe]:Oe},d=new Nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new at},radius:{value:4}},vertexShader:Nm,fragmentShader:Om}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new ze;g.setAttribute("position",new Be(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new le(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=al;let f=this.type;this.render=function(w,T,W){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let v=i.getRenderTarget(),E=i.getActiveCubeFace(),B=i.getActiveMipmapLevel(),K=i.state;K.setBlending(Xn),K.buffers.color.setClear(1,1,1,1),K.buffers.depth.setTest(!0),K.setScissorTest(!1);let ot=f!==Rn&&this.type===Rn,U=f===Rn&&this.type!==Rn;for(let F=0,Y=w.length;F<Y;F++){let $=w[F],J=$.shadow;if(J===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);let q=J.getFrameExtents();if(s.multiply(q),r.copy(J.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/q.x),s.x=r.x*q.x,J.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/q.y),s.y=r.y*q.y,J.mapSize.y=r.y)),J.map===null||ot===!0||U===!0){let k=this.type!==Rn?{minFilter:We,magFilter:We}:{};J.map!==null&&J.map.dispose(),J.map=new Ln(s.x,s.y,k),J.map.texture.name=$.name+".shadowMap",J.camera.updateProjectionMatrix()}i.setRenderTarget(J.map),i.clear();let tt=J.getViewportCount();for(let k=0;k<tt;k++){let ct=J.getViewport(k);a.set(r.x*ct.x,r.y*ct.y,r.x*ct.z,r.y*ct.w),K.viewport(a),J.updateMatrices($,k),n=J.getFrustum(),A(T,W,J.camera,$,this.type)}J.isPointLightShadow!==!0&&this.type===Rn&&b(J,W),J.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(v,E,B)};function b(w,T){let W=t.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Ln(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(T,null,W,d,_,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(T,null,W,p,_,null)}function x(w,T,W,v){let E=null,B=W.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(B!==void 0)E=B;else if(E=W.isPointLight===!0?c:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){let K=E.uuid,ot=T.uuid,U=l[K];U===void 0&&(U={},l[K]=U);let F=U[ot];F===void 0&&(F=E.clone(),U[ot]=F,T.addEventListener("dispose",L)),E=F}if(E.visible=T.visible,E.wireframe=T.wireframe,v===Rn?E.side=T.shadowSide!==null?T.shadowSide:T.side:E.side=T.shadowSide!==null?T.shadowSide:u[T.side],E.alphaMap=T.alphaMap,E.alphaTest=T.alphaTest,E.map=T.map,E.clipShadows=T.clipShadows,E.clippingPlanes=T.clippingPlanes,E.clipIntersection=T.clipIntersection,E.displacementMap=T.displacementMap,E.displacementScale=T.displacementScale,E.displacementBias=T.displacementBias,E.wireframeLinewidth=T.wireframeLinewidth,E.linewidth=T.linewidth,W.isPointLight===!0&&E.isMeshDistanceMaterial===!0){let K=i.properties.get(E);K.light=W}return E}function A(w,T,W,v,E){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&E===Rn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,w.matrixWorld);let ot=t.update(w),U=w.material;if(Array.isArray(U)){let F=ot.groups;for(let Y=0,$=F.length;Y<$;Y++){let J=F[Y],q=U[J.materialIndex];if(q&&q.visible){let tt=x(w,q,v,E);w.onBeforeShadow(i,w,T,W,ot,tt,J),i.renderBufferDirect(W,null,ot,tt,w,J),w.onAfterShadow(i,w,T,W,ot,tt,J)}}}else if(U.visible){let F=x(w,U,v,E);w.onBeforeShadow(i,w,T,W,ot,F,null),i.renderBufferDirect(W,null,ot,F,w,null),w.onAfterShadow(i,w,T,W,ot,F,null)}}let K=w.children;for(let ot=0,U=K.length;ot<U;ot++)A(K[ot],T,W,v,E)}function L(w){w.target.removeEventListener("dispose",L);for(let W in l){let v=l[W],E=w.target.uuid;E in v&&(v[E].dispose(),delete v[E])}}}function Bm(i,t,e){let n=e.isWebGL2;function s(){let D=!1,pt=new ge,mt=null,Ft=new ge(0,0,0,0);return{setMask:function(Lt){mt!==Lt&&!D&&(i.colorMask(Lt,Lt,Lt,Lt),mt=Lt)},setLocked:function(Lt){D=Lt},setClear:function(Lt,Kt,se,ue,Se){Se===!0&&(Lt*=ue,Kt*=ue,se*=ue),pt.set(Lt,Kt,se,ue),Ft.equals(pt)===!1&&(i.clearColor(Lt,Kt,se,ue),Ft.copy(pt))},reset:function(){D=!1,mt=null,Ft.set(-1,0,0,0)}}}function r(){let D=!1,pt=null,mt=null,Ft=null;return{setTest:function(Lt){Lt?kt(i.DEPTH_TEST):At(i.DEPTH_TEST)},setMask:function(Lt){pt!==Lt&&!D&&(i.depthMask(Lt),pt=Lt)},setFunc:function(Lt){if(mt!==Lt){switch(Lt){case sh:i.depthFunc(i.NEVER);break;case rh:i.depthFunc(i.ALWAYS);break;case oh:i.depthFunc(i.LESS);break;case hr:i.depthFunc(i.LEQUAL);break;case ah:i.depthFunc(i.EQUAL);break;case ch:i.depthFunc(i.GEQUAL);break;case lh:i.depthFunc(i.GREATER);break;case hh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}mt=Lt}},setLocked:function(Lt){D=Lt},setClear:function(Lt){Ft!==Lt&&(i.clearDepth(Lt),Ft=Lt)},reset:function(){D=!1,pt=null,mt=null,Ft=null}}}function a(){let D=!1,pt=null,mt=null,Ft=null,Lt=null,Kt=null,se=null,ue=null,Se=null;return{setTest:function(re){D||(re?kt(i.STENCIL_TEST):At(i.STENCIL_TEST))},setMask:function(re){pt!==re&&!D&&(i.stencilMask(re),pt=re)},setFunc:function(re,Ce,Ke){(mt!==re||Ft!==Ce||Lt!==Ke)&&(i.stencilFunc(re,Ce,Ke),mt=re,Ft=Ce,Lt=Ke)},setOp:function(re,Ce,Ke){(Kt!==re||se!==Ce||ue!==Ke)&&(i.stencilOp(re,Ce,Ke),Kt=re,se=Ce,ue=Ke)},setLocked:function(re){D=re},setClear:function(re){Se!==re&&(i.clearStencil(re),Se=re)},reset:function(){D=!1,pt=null,mt=null,Ft=null,Lt=null,Kt=null,se=null,ue=null,Se=null}}}let o=new s,c=new r,l=new a,h=new WeakMap,u=new WeakMap,d={},p={},g=new WeakMap,_=[],m=null,f=!1,b=null,x=null,A=null,L=null,w=null,T=null,W=null,v=new ne(0,0,0),E=0,B=!1,K=null,ot=null,U=null,F=null,Y=null,$=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),J=!1,q=0,tt=i.getParameter(i.VERSION);tt.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(tt)[1]),J=q>=1):tt.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]),J=q>=2);let k=null,ct={},H=i.getParameter(i.SCISSOR_BOX),Q=i.getParameter(i.VIEWPORT),xt=new ge().fromArray(H),Tt=new ge().fromArray(Q);function yt(D,pt,mt,Ft){let Lt=new Uint8Array(4),Kt=i.createTexture();i.bindTexture(D,Kt),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let se=0;se<mt;se++)n&&(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)?i.texImage3D(pt,0,i.RGBA,1,1,Ft,0,i.RGBA,i.UNSIGNED_BYTE,Lt):i.texImage2D(pt+se,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Lt);return Kt}let Nt={};Nt[i.TEXTURE_2D]=yt(i.TEXTURE_2D,i.TEXTURE_2D,1),Nt[i.TEXTURE_CUBE_MAP]=yt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Nt[i.TEXTURE_2D_ARRAY]=yt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Nt[i.TEXTURE_3D]=yt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),kt(i.DEPTH_TEST),c.setFunc(hr),bt(!1),M(Pa),kt(i.CULL_FACE),j(Xn);function kt(D){d[D]!==!0&&(i.enable(D),d[D]=!0)}function At(D){d[D]!==!1&&(i.disable(D),d[D]=!1)}function Bt(D,pt){return p[D]!==pt?(i.bindFramebuffer(D,pt),p[D]=pt,n&&(D===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=pt),D===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=pt)),!0):!1}function I(D,pt){let mt=_,Ft=!1;if(D)if(mt=g.get(pt),mt===void 0&&(mt=[],g.set(pt,mt)),D.isWebGLMultipleRenderTargets){let Lt=D.texture;if(mt.length!==Lt.length||mt[0]!==i.COLOR_ATTACHMENT0){for(let Kt=0,se=Lt.length;Kt<se;Kt++)mt[Kt]=i.COLOR_ATTACHMENT0+Kt;mt.length=Lt.length,Ft=!0}}else mt[0]!==i.COLOR_ATTACHMENT0&&(mt[0]=i.COLOR_ATTACHMENT0,Ft=!0);else mt[0]!==i.BACK&&(mt[0]=i.BACK,Ft=!0);Ft&&(e.isWebGL2?i.drawBuffers(mt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(mt))}function ht(D){return m!==D?(i.useProgram(D),m=D,!0):!1}let Z={[ni]:i.FUNC_ADD,[Gl]:i.FUNC_SUBTRACT,[Wl]:i.FUNC_REVERSE_SUBTRACT};if(n)Z[Da]=i.MIN,Z[Na]=i.MAX;else{let D=t.get("EXT_blend_minmax");D!==null&&(Z[Da]=D.MIN_EXT,Z[Na]=D.MAX_EXT)}let ut={[Xl]:i.ZERO,[Yl]:i.ONE,[ql]:i.SRC_COLOR,[Uo]:i.SRC_ALPHA,[$l]:i.SRC_ALPHA_SATURATE,[jl]:i.DST_COLOR,[Kl]:i.DST_ALPHA,[Zl]:i.ONE_MINUS_SRC_COLOR,[Do]:i.ONE_MINUS_SRC_ALPHA,[Ql]:i.ONE_MINUS_DST_COLOR,[Jl]:i.ONE_MINUS_DST_ALPHA,[th]:i.CONSTANT_COLOR,[eh]:i.ONE_MINUS_CONSTANT_COLOR,[nh]:i.CONSTANT_ALPHA,[ih]:i.ONE_MINUS_CONSTANT_ALPHA};function j(D,pt,mt,Ft,Lt,Kt,se,ue,Se,re){if(D===Xn){f===!0&&(At(i.BLEND),f=!1);return}if(f===!1&&(kt(i.BLEND),f=!0),D!==Vl){if(D!==b||re!==B){if((x!==ni||w!==ni)&&(i.blendEquation(i.FUNC_ADD),x=ni,w=ni),re)switch(D){case Oi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ia:i.blendFunc(i.ONE,i.ONE);break;case La:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ua:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Oi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ia:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case La:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ua:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}A=null,L=null,T=null,W=null,v.set(0,0,0),E=0,b=D,B=re}return}Lt=Lt||pt,Kt=Kt||mt,se=se||Ft,(pt!==x||Lt!==w)&&(i.blendEquationSeparate(Z[pt],Z[Lt]),x=pt,w=Lt),(mt!==A||Ft!==L||Kt!==T||se!==W)&&(i.blendFuncSeparate(ut[mt],ut[Ft],ut[Kt],ut[se]),A=mt,L=Ft,T=Kt,W=se),(ue.equals(v)===!1||Se!==E)&&(i.blendColor(ue.r,ue.g,ue.b,Se),v.copy(ue),E=Se),b=D,B=!1}function wt(D,pt){D.side===Oe?At(i.CULL_FACE):kt(i.CULL_FACE);let mt=D.side===Fe;pt&&(mt=!mt),bt(mt),D.blending===Oi&&D.transparent===!1?j(Xn):j(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),c.setFunc(D.depthFunc),c.setTest(D.depthTest),c.setMask(D.depthWrite),o.setMask(D.colorWrite);let Ft=D.stencilWrite;l.setTest(Ft),Ft&&(l.setMask(D.stencilWriteMask),l.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),l.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),N(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?kt(i.SAMPLE_ALPHA_TO_COVERAGE):At(i.SAMPLE_ALPHA_TO_COVERAGE)}function bt(D){K!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),K=D)}function M(D){D!==kl?(kt(i.CULL_FACE),D!==ot&&(D===Pa?i.cullFace(i.BACK):D===Hl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):At(i.CULL_FACE),ot=D}function y(D){D!==U&&(J&&i.lineWidth(D),U=D)}function N(D,pt,mt){D?(kt(i.POLYGON_OFFSET_FILL),(F!==pt||Y!==mt)&&(i.polygonOffset(pt,mt),F=pt,Y=mt)):At(i.POLYGON_OFFSET_FILL)}function rt(D){D?kt(i.SCISSOR_TEST):At(i.SCISSOR_TEST)}function st(D){D===void 0&&(D=i.TEXTURE0+$-1),k!==D&&(i.activeTexture(D),k=D)}function et(D,pt,mt){mt===void 0&&(k===null?mt=i.TEXTURE0+$-1:mt=k);let Ft=ct[mt];Ft===void 0&&(Ft={type:void 0,texture:void 0},ct[mt]=Ft),(Ft.type!==D||Ft.texture!==pt)&&(k!==mt&&(i.activeTexture(mt),k=mt),i.bindTexture(D,pt||Nt[D]),Ft.type=D,Ft.texture=pt)}function Ct(){let D=ct[k];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function vt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Et(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ot(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Xt(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function nt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function qt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function C(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function it(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function gt(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ft(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Pt(D){xt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),xt.copy(D))}function Zt(D){Tt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),Tt.copy(D))}function Yt(D,pt){let mt=u.get(pt);mt===void 0&&(mt=new WeakMap,u.set(pt,mt));let Ft=mt.get(D);Ft===void 0&&(Ft=i.getUniformBlockIndex(pt,D.name),mt.set(D,Ft))}function Qt(D,pt){let Ft=u.get(pt).get(D);h.get(pt)!==Ft&&(i.uniformBlockBinding(pt,Ft,D.__bindingPointIndex),h.set(pt,Ft))}function _t(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},k=null,ct={},p={},g=new WeakMap,_=[],m=null,f=!1,b=null,x=null,A=null,L=null,w=null,T=null,W=null,v=new ne(0,0,0),E=0,B=!1,K=null,ot=null,U=null,F=null,Y=null,xt.set(0,0,i.canvas.width,i.canvas.height),Tt.set(0,0,i.canvas.width,i.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:kt,disable:At,bindFramebuffer:Bt,drawBuffers:I,useProgram:ht,setBlending:j,setMaterial:wt,setFlipSided:bt,setCullFace:M,setLineWidth:y,setPolygonOffset:N,setScissorTest:rt,activeTexture:st,bindTexture:et,unbindTexture:Ct,compressedTexImage2D:vt,compressedTexImage3D:Et,texImage2D:gt,texImage3D:ft,updateUBOMapping:Yt,uniformBlockBinding:Qt,texStorage2D:C,texStorage3D:it,texSubImage2D:Ot,texSubImage3D:Xt,compressedTexSubImage2D:nt,compressedTexSubImage3D:qt,scissor:Pt,viewport:Zt,reset:_t}}function zm(i,t,e,n,s,r,a){let o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(M,y){return p?new OffscreenCanvas(M,y):xs("canvas")}function _(M,y,N,rt){let st=1;if((M.width>rt||M.height>rt)&&(st=rt/Math.max(M.width,M.height)),st<1||y===!0)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap){let et=y?_r:Math.floor,Ct=et(st*M.width),vt=et(st*M.height);u===void 0&&(u=g(Ct,vt));let Et=N?g(Ct,vt):u;return Et.width=Ct,Et.height=vt,Et.getContext("2d").drawImage(M,0,0,Ct,vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+M.width+"x"+M.height+") to ("+Ct+"x"+vt+")."),Et}else return"data"in M&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+M.width+"x"+M.height+")."),M;return M}function m(M){return zo(M.width)&&zo(M.height)}function f(M){return o?!1:M.wrapS!==un||M.wrapT!==un||M.minFilter!==We&&M.minFilter!==en}function b(M,y){return M.generateMipmaps&&y&&M.minFilter!==We&&M.minFilter!==en}function x(M){i.generateMipmap(M)}function A(M,y,N,rt,st=!1){if(o===!1)return y;if(M!==null){if(i[M]!==void 0)return i[M];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let et=y;if(y===i.RED&&(N===i.FLOAT&&(et=i.R32F),N===i.HALF_FLOAT&&(et=i.R16F),N===i.UNSIGNED_BYTE&&(et=i.R8)),y===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(et=i.R8UI),N===i.UNSIGNED_SHORT&&(et=i.R16UI),N===i.UNSIGNED_INT&&(et=i.R32UI),N===i.BYTE&&(et=i.R8I),N===i.SHORT&&(et=i.R16I),N===i.INT&&(et=i.R32I)),y===i.RG&&(N===i.FLOAT&&(et=i.RG32F),N===i.HALF_FLOAT&&(et=i.RG16F),N===i.UNSIGNED_BYTE&&(et=i.RG8)),y===i.RGBA){let Ct=st?fr:ce.getTransfer(rt);N===i.FLOAT&&(et=i.RGBA32F),N===i.HALF_FLOAT&&(et=i.RGBA16F),N===i.UNSIGNED_BYTE&&(et=Ct===de?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(et=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(et=i.RGB5_A1)}return(et===i.R16F||et===i.R32F||et===i.RG16F||et===i.RG32F||et===i.RGBA16F||et===i.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function L(M,y,N){return b(M,N)===!0||M.isFramebufferTexture&&M.minFilter!==We&&M.minFilter!==en?Math.log2(Math.max(y.width,y.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?y.mipmaps.length:1}function w(M){return M===We||M===Oa||M===Qr?i.NEAREST:i.LINEAR}function T(M){let y=M.target;y.removeEventListener("dispose",T),v(y),y.isVideoTexture&&h.delete(y)}function W(M){let y=M.target;y.removeEventListener("dispose",W),B(y)}function v(M){let y=n.get(M);if(y.__webglInit===void 0)return;let N=M.source,rt=d.get(N);if(rt){let st=rt[y.__cacheKey];st.usedTimes--,st.usedTimes===0&&E(M),Object.keys(rt).length===0&&d.delete(N)}n.remove(M)}function E(M){let y=n.get(M);i.deleteTexture(y.__webglTexture);let N=M.source,rt=d.get(N);delete rt[y.__cacheKey],a.memory.textures--}function B(M){let y=M.texture,N=n.get(M),rt=n.get(y);if(rt.__webglTexture!==void 0&&(i.deleteTexture(rt.__webglTexture),a.memory.textures--),M.depthTexture&&M.depthTexture.dispose(),M.isWebGLCubeRenderTarget)for(let st=0;st<6;st++){if(Array.isArray(N.__webglFramebuffer[st]))for(let et=0;et<N.__webglFramebuffer[st].length;et++)i.deleteFramebuffer(N.__webglFramebuffer[st][et]);else i.deleteFramebuffer(N.__webglFramebuffer[st]);N.__webglDepthbuffer&&i.deleteRenderbuffer(N.__webglDepthbuffer[st])}else{if(Array.isArray(N.__webglFramebuffer))for(let st=0;st<N.__webglFramebuffer.length;st++)i.deleteFramebuffer(N.__webglFramebuffer[st]);else i.deleteFramebuffer(N.__webglFramebuffer);if(N.__webglDepthbuffer&&i.deleteRenderbuffer(N.__webglDepthbuffer),N.__webglMultisampledFramebuffer&&i.deleteFramebuffer(N.__webglMultisampledFramebuffer),N.__webglColorRenderbuffer)for(let st=0;st<N.__webglColorRenderbuffer.length;st++)N.__webglColorRenderbuffer[st]&&i.deleteRenderbuffer(N.__webglColorRenderbuffer[st]);N.__webglDepthRenderbuffer&&i.deleteRenderbuffer(N.__webglDepthRenderbuffer)}if(M.isWebGLMultipleRenderTargets)for(let st=0,et=y.length;st<et;st++){let Ct=n.get(y[st]);Ct.__webglTexture&&(i.deleteTexture(Ct.__webglTexture),a.memory.textures--),n.remove(y[st])}n.remove(y),n.remove(M)}let K=0;function ot(){K=0}function U(){let M=K;return M>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+s.maxTextures),K+=1,M}function F(M){let y=[];return y.push(M.wrapS),y.push(M.wrapT),y.push(M.wrapR||0),y.push(M.magFilter),y.push(M.minFilter),y.push(M.anisotropy),y.push(M.internalFormat),y.push(M.format),y.push(M.type),y.push(M.generateMipmaps),y.push(M.premultiplyAlpha),y.push(M.flipY),y.push(M.unpackAlignment),y.push(M.colorSpace),y.join()}function Y(M,y){let N=n.get(M);if(M.isVideoTexture&&wt(M),M.isRenderTargetTexture===!1&&M.version>0&&N.__version!==M.version){let rt=M.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{xt(N,M,y);return}}e.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+y)}function $(M,y){let N=n.get(M);if(M.version>0&&N.__version!==M.version){xt(N,M,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+y)}function J(M,y){let N=n.get(M);if(M.version>0&&N.__version!==M.version){xt(N,M,y);return}e.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+y)}function q(M,y){let N=n.get(M);if(M.version>0&&N.__version!==M.version){Tt(N,M,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+y)}let tt={[ps]:i.REPEAT,[un]:i.CLAMP_TO_EDGE,[Fo]:i.MIRRORED_REPEAT},k={[We]:i.NEAREST,[Oa]:i.NEAREST_MIPMAP_NEAREST,[Qr]:i.NEAREST_MIPMAP_LINEAR,[en]:i.LINEAR,[xh]:i.LINEAR_MIPMAP_NEAREST,[ms]:i.LINEAR_MIPMAP_LINEAR},ct={[Ph]:i.NEVER,[Oh]:i.ALWAYS,[Ih]:i.LESS,[yl]:i.LEQUAL,[Lh]:i.EQUAL,[Nh]:i.GEQUAL,[Uh]:i.GREATER,[Dh]:i.NOTEQUAL};function H(M,y,N){if(N?(i.texParameteri(M,i.TEXTURE_WRAP_S,tt[y.wrapS]),i.texParameteri(M,i.TEXTURE_WRAP_T,tt[y.wrapT]),(M===i.TEXTURE_3D||M===i.TEXTURE_2D_ARRAY)&&i.texParameteri(M,i.TEXTURE_WRAP_R,tt[y.wrapR]),i.texParameteri(M,i.TEXTURE_MAG_FILTER,k[y.magFilter]),i.texParameteri(M,i.TEXTURE_MIN_FILTER,k[y.minFilter])):(i.texParameteri(M,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(M,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(M===i.TEXTURE_3D||M===i.TEXTURE_2D_ARRAY)&&i.texParameteri(M,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(y.wrapS!==un||y.wrapT!==un)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(M,i.TEXTURE_MAG_FILTER,w(y.magFilter)),i.texParameteri(M,i.TEXTURE_MIN_FILTER,w(y.minFilter)),y.minFilter!==We&&y.minFilter!==en&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),y.compareFunction&&(i.texParameteri(M,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(M,i.TEXTURE_COMPARE_FUNC,ct[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let rt=t.get("EXT_texture_filter_anisotropic");if(y.magFilter===We||y.minFilter!==Qr&&y.minFilter!==ms||y.type===Wn&&t.has("OES_texture_float_linear")===!1||o===!1&&y.type===gs&&t.has("OES_texture_half_float_linear")===!1)return;(y.anisotropy>1||n.get(y).__currentAnisotropy)&&(i.texParameterf(M,rt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy)}}function Q(M,y){let N=!1;M.__webglInit===void 0&&(M.__webglInit=!0,y.addEventListener("dispose",T));let rt=y.source,st=d.get(rt);st===void 0&&(st={},d.set(rt,st));let et=F(y);if(et!==M.__cacheKey){st[et]===void 0&&(st[et]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,N=!0),st[et].usedTimes++;let Ct=st[M.__cacheKey];Ct!==void 0&&(st[M.__cacheKey].usedTimes--,Ct.usedTimes===0&&E(y)),M.__cacheKey=et,M.__webglTexture=st[et].texture}return N}function xt(M,y,N){let rt=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(rt=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(rt=i.TEXTURE_3D);let st=Q(M,y),et=y.source;e.bindTexture(rt,M.__webglTexture,i.TEXTURE0+N);let Ct=n.get(et);if(et.version!==Ct.__version||st===!0){e.activeTexture(i.TEXTURE0+N);let vt=ce.getPrimaries(ce.workingColorSpace),Et=y.colorSpace===nn?null:ce.getPrimaries(y.colorSpace),Ot=y.colorSpace===nn||vt===Et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ot);let Xt=f(y)&&m(y.image)===!1,nt=_(y.image,Xt,!1,s.maxTextureSize);nt=bt(y,nt);let qt=m(nt)||o,C=r.convert(y.format,y.colorSpace),it=r.convert(y.type),gt=A(y.internalFormat,C,it,y.colorSpace,y.isVideoTexture);H(rt,y,qt);let ft,Pt=y.mipmaps,Zt=o&&y.isVideoTexture!==!0&&gt!==gl,Yt=Ct.__version===void 0||st===!0,Qt=L(y,nt,qt);if(y.isDepthTexture)gt=i.DEPTH_COMPONENT,o?y.type===Wn?gt=i.DEPTH_COMPONENT32F:y.type===Gn?gt=i.DEPTH_COMPONENT24:y.type===si?gt=i.DEPTH24_STENCIL8:gt=i.DEPTH_COMPONENT16:y.type===Wn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),y.format===ri&&gt===i.DEPTH_COMPONENT&&y.type!==Sa&&y.type!==Gn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),y.type=Gn,it=r.convert(y.type)),y.format===Hi&&gt===i.DEPTH_COMPONENT&&(gt=i.DEPTH_STENCIL,y.type!==si&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),y.type=si,it=r.convert(y.type))),Yt&&(Zt?e.texStorage2D(i.TEXTURE_2D,1,gt,nt.width,nt.height):e.texImage2D(i.TEXTURE_2D,0,gt,nt.width,nt.height,0,C,it,null));else if(y.isDataTexture)if(Pt.length>0&&qt){Zt&&Yt&&e.texStorage2D(i.TEXTURE_2D,Qt,gt,Pt[0].width,Pt[0].height);for(let _t=0,D=Pt.length;_t<D;_t++)ft=Pt[_t],Zt?e.texSubImage2D(i.TEXTURE_2D,_t,0,0,ft.width,ft.height,C,it,ft.data):e.texImage2D(i.TEXTURE_2D,_t,gt,ft.width,ft.height,0,C,it,ft.data);y.generateMipmaps=!1}else Zt?(Yt&&e.texStorage2D(i.TEXTURE_2D,Qt,gt,nt.width,nt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,nt.width,nt.height,C,it,nt.data)):e.texImage2D(i.TEXTURE_2D,0,gt,nt.width,nt.height,0,C,it,nt.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Zt&&Yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Qt,gt,Pt[0].width,Pt[0].height,nt.depth);for(let _t=0,D=Pt.length;_t<D;_t++)ft=Pt[_t],y.format!==dn?C!==null?Zt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,_t,0,0,0,ft.width,ft.height,nt.depth,C,ft.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,_t,gt,ft.width,ft.height,nt.depth,0,ft.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,_t,0,0,0,ft.width,ft.height,nt.depth,C,it,ft.data):e.texImage3D(i.TEXTURE_2D_ARRAY,_t,gt,ft.width,ft.height,nt.depth,0,C,it,ft.data)}else{Zt&&Yt&&e.texStorage2D(i.TEXTURE_2D,Qt,gt,Pt[0].width,Pt[0].height);for(let _t=0,D=Pt.length;_t<D;_t++)ft=Pt[_t],y.format!==dn?C!==null?Zt?e.compressedTexSubImage2D(i.TEXTURE_2D,_t,0,0,ft.width,ft.height,C,ft.data):e.compressedTexImage2D(i.TEXTURE_2D,_t,gt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?e.texSubImage2D(i.TEXTURE_2D,_t,0,0,ft.width,ft.height,C,it,ft.data):e.texImage2D(i.TEXTURE_2D,_t,gt,ft.width,ft.height,0,C,it,ft.data)}else if(y.isDataArrayTexture)Zt?(Yt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Qt,gt,nt.width,nt.height,nt.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,C,it,nt.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,gt,nt.width,nt.height,nt.depth,0,C,it,nt.data);else if(y.isData3DTexture)Zt?(Yt&&e.texStorage3D(i.TEXTURE_3D,Qt,gt,nt.width,nt.height,nt.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,C,it,nt.data)):e.texImage3D(i.TEXTURE_3D,0,gt,nt.width,nt.height,nt.depth,0,C,it,nt.data);else if(y.isFramebufferTexture){if(Yt)if(Zt)e.texStorage2D(i.TEXTURE_2D,Qt,gt,nt.width,nt.height);else{let _t=nt.width,D=nt.height;for(let pt=0;pt<Qt;pt++)e.texImage2D(i.TEXTURE_2D,pt,gt,_t,D,0,C,it,null),_t>>=1,D>>=1}}else if(Pt.length>0&&qt){Zt&&Yt&&e.texStorage2D(i.TEXTURE_2D,Qt,gt,Pt[0].width,Pt[0].height);for(let _t=0,D=Pt.length;_t<D;_t++)ft=Pt[_t],Zt?e.texSubImage2D(i.TEXTURE_2D,_t,0,0,C,it,ft):e.texImage2D(i.TEXTURE_2D,_t,gt,C,it,ft);y.generateMipmaps=!1}else Zt?(Yt&&e.texStorage2D(i.TEXTURE_2D,Qt,gt,nt.width,nt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,C,it,nt)):e.texImage2D(i.TEXTURE_2D,0,gt,C,it,nt);b(y,qt)&&x(rt),Ct.__version=et.version,y.onUpdate&&y.onUpdate(y)}M.__version=y.version}function Tt(M,y,N){if(y.image.length!==6)return;let rt=Q(M,y),st=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,M.__webglTexture,i.TEXTURE0+N);let et=n.get(st);if(st.version!==et.__version||rt===!0){e.activeTexture(i.TEXTURE0+N);let Ct=ce.getPrimaries(ce.workingColorSpace),vt=y.colorSpace===nn?null:ce.getPrimaries(y.colorSpace),Et=y.colorSpace===nn||Ct===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let Ot=y.isCompressedTexture||y.image[0].isCompressedTexture,Xt=y.image[0]&&y.image[0].isDataTexture,nt=[];for(let _t=0;_t<6;_t++)!Ot&&!Xt?nt[_t]=_(y.image[_t],!1,!0,s.maxCubemapSize):nt[_t]=Xt?y.image[_t].image:y.image[_t],nt[_t]=bt(y,nt[_t]);let qt=nt[0],C=m(qt)||o,it=r.convert(y.format,y.colorSpace),gt=r.convert(y.type),ft=A(y.internalFormat,it,gt,y.colorSpace),Pt=o&&y.isVideoTexture!==!0,Zt=et.__version===void 0||rt===!0,Yt=L(y,qt,C);H(i.TEXTURE_CUBE_MAP,y,C);let Qt;if(Ot){Pt&&Zt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Yt,ft,qt.width,qt.height);for(let _t=0;_t<6;_t++){Qt=nt[_t].mipmaps;for(let D=0;D<Qt.length;D++){let pt=Qt[D];y.format!==dn?it!==null?Pt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,D,0,0,pt.width,pt.height,it,pt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,D,ft,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,D,0,0,pt.width,pt.height,it,gt,pt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,D,ft,pt.width,pt.height,0,it,gt,pt.data)}}}else{Qt=y.mipmaps,Pt&&Zt&&(Qt.length>0&&Yt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Yt,ft,nt[0].width,nt[0].height));for(let _t=0;_t<6;_t++)if(Xt){Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0,0,0,nt[_t].width,nt[_t].height,it,gt,nt[_t].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0,ft,nt[_t].width,nt[_t].height,0,it,gt,nt[_t].data);for(let D=0;D<Qt.length;D++){let mt=Qt[D].image[_t].image;Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,D+1,0,0,mt.width,mt.height,it,gt,mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,D+1,ft,mt.width,mt.height,0,it,gt,mt.data)}}else{Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0,0,0,it,gt,nt[_t]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0,ft,it,gt,nt[_t]);for(let D=0;D<Qt.length;D++){let pt=Qt[D];Pt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,D+1,0,0,it,gt,pt.image[_t]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,D+1,ft,it,gt,pt.image[_t])}}}b(y,C)&&x(i.TEXTURE_CUBE_MAP),et.__version=st.version,y.onUpdate&&y.onUpdate(y)}M.__version=y.version}function yt(M,y,N,rt,st,et){let Ct=r.convert(N.format,N.colorSpace),vt=r.convert(N.type),Et=A(N.internalFormat,Ct,vt,N.colorSpace);if(!n.get(y).__hasExternalTextures){let Xt=Math.max(1,y.width>>et),nt=Math.max(1,y.height>>et);st===i.TEXTURE_3D||st===i.TEXTURE_2D_ARRAY?e.texImage3D(st,et,Et,Xt,nt,y.depth,0,Ct,vt,null):e.texImage2D(st,et,Et,Xt,nt,0,Ct,vt,null)}e.bindFramebuffer(i.FRAMEBUFFER,M),j(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,rt,st,n.get(N).__webglTexture,0,ut(y)):(st===i.TEXTURE_2D||st>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,rt,st,n.get(N).__webglTexture,et),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Nt(M,y,N){if(i.bindRenderbuffer(i.RENDERBUFFER,M),y.depthBuffer&&!y.stencilBuffer){let rt=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(N||j(y)){let st=y.depthTexture;st&&st.isDepthTexture&&(st.type===Wn?rt=i.DEPTH_COMPONENT32F:st.type===Gn&&(rt=i.DEPTH_COMPONENT24));let et=ut(y);j(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,et,rt,y.width,y.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,et,rt,y.width,y.height)}else i.renderbufferStorage(i.RENDERBUFFER,rt,y.width,y.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,M)}else if(y.depthBuffer&&y.stencilBuffer){let rt=ut(y);N&&j(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,i.DEPTH24_STENCIL8,y.width,y.height):j(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,i.DEPTH24_STENCIL8,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,M)}else{let rt=y.isWebGLMultipleRenderTargets===!0?y.texture:[y.texture];for(let st=0;st<rt.length;st++){let et=rt[st],Ct=r.convert(et.format,et.colorSpace),vt=r.convert(et.type),Et=A(et.internalFormat,Ct,vt,et.colorSpace),Ot=ut(y);N&&j(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ot,Et,y.width,y.height):j(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ot,Et,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Et,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function kt(M,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,M),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(y.depthTexture).__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),Y(y.depthTexture,0);let rt=n.get(y.depthTexture).__webglTexture,st=ut(y);if(y.depthTexture.format===ri)j(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0,st):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0);else if(y.depthTexture.format===Hi)j(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0,st):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function At(M){let y=n.get(M),N=M.isWebGLCubeRenderTarget===!0;if(M.depthTexture&&!y.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");kt(y.__webglFramebuffer,M)}else if(N){y.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[rt]),y.__webglDepthbuffer[rt]=i.createRenderbuffer(),Nt(y.__webglDepthbuffer[rt],M,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer=i.createRenderbuffer(),Nt(y.__webglDepthbuffer,M,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bt(M,y,N){let rt=n.get(M);y!==void 0&&yt(rt.__webglFramebuffer,M,M.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&At(M)}function I(M){let y=M.texture,N=n.get(M),rt=n.get(y);M.addEventListener("dispose",W),M.isWebGLMultipleRenderTargets!==!0&&(rt.__webglTexture===void 0&&(rt.__webglTexture=i.createTexture()),rt.__version=y.version,a.memory.textures++);let st=M.isWebGLCubeRenderTarget===!0,et=M.isWebGLMultipleRenderTargets===!0,Ct=m(M)||o;if(st){N.__webglFramebuffer=[];for(let vt=0;vt<6;vt++)if(o&&y.mipmaps&&y.mipmaps.length>0){N.__webglFramebuffer[vt]=[];for(let Et=0;Et<y.mipmaps.length;Et++)N.__webglFramebuffer[vt][Et]=i.createFramebuffer()}else N.__webglFramebuffer[vt]=i.createFramebuffer()}else{if(o&&y.mipmaps&&y.mipmaps.length>0){N.__webglFramebuffer=[];for(let vt=0;vt<y.mipmaps.length;vt++)N.__webglFramebuffer[vt]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(et)if(s.drawBuffers){let vt=M.texture;for(let Et=0,Ot=vt.length;Et<Ot;Et++){let Xt=n.get(vt[Et]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&M.samples>0&&j(M)===!1){let vt=et?y:[y];N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let Et=0;Et<vt.length;Et++){let Ot=vt[Et];N.__webglColorRenderbuffer[Et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[Et]);let Xt=r.convert(Ot.format,Ot.colorSpace),nt=r.convert(Ot.type),qt=A(Ot.internalFormat,Xt,nt,Ot.colorSpace,M.isXRRenderTarget===!0),C=ut(M);i.renderbufferStorageMultisample(i.RENDERBUFFER,C,qt,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,N.__webglColorRenderbuffer[Et])}i.bindRenderbuffer(i.RENDERBUFFER,null),M.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),Nt(N.__webglDepthRenderbuffer,M,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(st){e.bindTexture(i.TEXTURE_CUBE_MAP,rt.__webglTexture),H(i.TEXTURE_CUBE_MAP,y,Ct);for(let vt=0;vt<6;vt++)if(o&&y.mipmaps&&y.mipmaps.length>0)for(let Et=0;Et<y.mipmaps.length;Et++)yt(N.__webglFramebuffer[vt][Et],M,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Et);else yt(N.__webglFramebuffer[vt],M,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0);b(y,Ct)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(et){let vt=M.texture;for(let Et=0,Ot=vt.length;Et<Ot;Et++){let Xt=vt[Et],nt=n.get(Xt);e.bindTexture(i.TEXTURE_2D,nt.__webglTexture),H(i.TEXTURE_2D,Xt,Ct),yt(N.__webglFramebuffer,M,Xt,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,0),b(Xt,Ct)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let vt=i.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(o?vt=M.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(vt,rt.__webglTexture),H(vt,y,Ct),o&&y.mipmaps&&y.mipmaps.length>0)for(let Et=0;Et<y.mipmaps.length;Et++)yt(N.__webglFramebuffer[Et],M,y,i.COLOR_ATTACHMENT0,vt,Et);else yt(N.__webglFramebuffer,M,y,i.COLOR_ATTACHMENT0,vt,0);b(y,Ct)&&x(vt),e.unbindTexture()}M.depthBuffer&&At(M)}function ht(M){let y=m(M)||o,N=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let rt=0,st=N.length;rt<st;rt++){let et=N[rt];if(b(et,y)){let Ct=M.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,vt=n.get(et).__webglTexture;e.bindTexture(Ct,vt),x(Ct),e.unbindTexture()}}}function Z(M){if(o&&M.samples>0&&j(M)===!1){let y=M.isWebGLMultipleRenderTargets?M.texture:[M.texture],N=M.width,rt=M.height,st=i.COLOR_BUFFER_BIT,et=[],Ct=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,vt=n.get(M),Et=M.isWebGLMultipleRenderTargets===!0;if(Et)for(let Ot=0;Ot<y.length;Ot++)e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let Ot=0;Ot<y.length;Ot++){et.push(i.COLOR_ATTACHMENT0+Ot),M.depthBuffer&&et.push(Ct);let Xt=vt.__ignoreDepthValues!==void 0?vt.__ignoreDepthValues:!1;if(Xt===!1&&(M.depthBuffer&&(st|=i.DEPTH_BUFFER_BIT),M.stencilBuffer&&(st|=i.STENCIL_BUFFER_BIT)),Et&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,vt.__webglColorRenderbuffer[Ot]),Xt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Ct]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Ct])),Et){let nt=n.get(y[Ot]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,nt,0)}i.blitFramebuffer(0,0,N,rt,0,0,N,rt,st,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,et)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Et)for(let Ot=0;Ot<y.length;Ot++){e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.RENDERBUFFER,vt.__webglColorRenderbuffer[Ot]);let Xt=n.get(y[Ot]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,vt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ot,i.TEXTURE_2D,Xt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}}function ut(M){return Math.min(s.maxSamples,M.samples)}function j(M){let y=n.get(M);return o&&M.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function wt(M){let y=a.render.frame;h.get(M)!==y&&(h.set(M,y),M.update())}function bt(M,y){let N=M.colorSpace,rt=M.format,st=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||M.format===Bo||N!==In&&N!==nn&&(ce.getTransfer(N)===de?o===!1?t.has("EXT_sRGB")===!0&&rt===dn?(M.format=Bo,M.minFilter=en,M.generateMipmaps=!1):y=xr.sRGBToLinear(y):(rt!==dn||st!==qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),y}this.allocateTextureUnit=U,this.resetTextureUnits=ot,this.setTexture2D=Y,this.setTexture2DArray=$,this.setTexture3D=J,this.setTextureCube=q,this.rebindTextures=Bt,this.setupRenderTarget=I,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=At,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=j}function km(i,t,e){let n=e.isWebGL2;function s(r,a=nn){let o,c=ce.getTransfer(a);if(r===qn)return i.UNSIGNED_BYTE;if(r===ul)return i.UNSIGNED_SHORT_4_4_4_4;if(r===dl)return i.UNSIGNED_SHORT_5_5_5_1;if(r===yh)return i.BYTE;if(r===vh)return i.SHORT;if(r===Sa)return i.UNSIGNED_SHORT;if(r===hl)return i.INT;if(r===Gn)return i.UNSIGNED_INT;if(r===Wn)return i.FLOAT;if(r===gs)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===Mh)return i.ALPHA;if(r===dn)return i.RGBA;if(r===Sh)return i.LUMINANCE;if(r===bh)return i.LUMINANCE_ALPHA;if(r===ri)return i.DEPTH_COMPONENT;if(r===Hi)return i.DEPTH_STENCIL;if(r===Bo)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Eh)return i.RED;if(r===fl)return i.RED_INTEGER;if(r===Ah)return i.RG;if(r===pl)return i.RG_INTEGER;if(r===ml)return i.RGBA_INTEGER;if(r===$r||r===to||r===eo||r===no)if(c===de)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===$r)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===to)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===eo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===no)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===$r)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===to)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===eo)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===no)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Fa||r===Ba||r===za||r===ka)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Fa)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ba)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===za)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===ka)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===gl)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Ha||r===Va)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===Ha)return c===de?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Va)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ga||r===Wa||r===Xa||r===Ya||r===qa||r===Za||r===Ka||r===Ja||r===ja||r===Qa||r===$a||r===tc||r===ec||r===nc)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Ga)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Wa)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Xa)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ya)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===qa)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Za)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ka)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Ja)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===ja)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Qa)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===$a)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===tc)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===ec)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===nc)return c===de?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===io||r===ic||r===sc)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===io)return c===de?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===ic)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===sc)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Th||r===rc||r===oc||r===ac)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===io)return o.COMPRESSED_RED_RGTC1_EXT;if(r===rc)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===oc)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===ac)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===si?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Qo=class extends qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Pn=class extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Hm={type:"move"},hs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),f=this._getHandJoint(l,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hm)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Pn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},$o=class extends yn{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,p=null,g=null,_=e.getContextAttributes(),m=null,f=null,b=[],x=[],A=new at,L=null,w=new qe;w.layers.enable(1),w.viewport=new ge;let T=new qe;T.layers.enable(2),T.viewport=new ge;let W=[w,T],v=new Qo;v.layers.enable(1),v.layers.enable(2);let E=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let Q=b[H];return Q===void 0&&(Q=new hs,b[H]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(H){let Q=b[H];return Q===void 0&&(Q=new hs,b[H]=Q),Q.getGripSpace()},this.getHand=function(H){let Q=b[H];return Q===void 0&&(Q=new hs,b[H]=Q),Q.getHandSpace()};function K(H){let Q=x.indexOf(H.inputSource);if(Q===-1)return;let xt=b[Q];xt!==void 0&&(xt.update(H.inputSource,H.frame,l||a),xt.dispatchEvent({type:H.type,data:H.inputSource}))}function ot(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",ot),s.removeEventListener("inputsourceschange",U);for(let H=0;H<b.length;H++){let Q=x[H];Q!==null&&(x[H]=null,b[H].disconnect(Q))}E=null,B=null,t.setRenderTarget(m),p=null,d=null,u=null,s=null,f=null,ct.stop(),n.isPresenting=!1,t.setPixelRatio(L),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){r=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){o=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(H){l=H},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(H){if(s=H,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",ot),s.addEventListener("inputsourceschange",U),_.xrCompatible!==!0&&await e.makeXRCompatible(),L=t.getPixelRatio(),t.getSize(A),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let Q={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,Q),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),f=new Ln(p.framebufferWidth,p.framebufferHeight,{format:dn,type:qn,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let Q=null,xt=null,Tt=null;_.depth&&(Tt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=_.stencil?Hi:ri,xt=_.stencil?si:Gn);let yt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(yt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),f=new Ln(d.textureWidth,d.textureHeight,{format:dn,type:qn,depthTexture:new Tr(d.textureWidth,d.textureHeight,xt,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});let Nt=t.properties.get(f);Nt.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),ct.setContext(s),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function U(H){for(let Q=0;Q<H.removed.length;Q++){let xt=H.removed[Q],Tt=x.indexOf(xt);Tt>=0&&(x[Tt]=null,b[Tt].disconnect(xt))}for(let Q=0;Q<H.added.length;Q++){let xt=H.added[Q],Tt=x.indexOf(xt);if(Tt===-1){for(let Nt=0;Nt<b.length;Nt++)if(Nt>=x.length){x.push(xt),Tt=Nt;break}else if(x[Nt]===null){x[Nt]=xt,Tt=Nt;break}if(Tt===-1)break}let yt=b[Tt];yt&&yt.connect(xt)}}let F=new P,Y=new P;function $(H,Q,xt){F.setFromMatrixPosition(Q.matrixWorld),Y.setFromMatrixPosition(xt.matrixWorld);let Tt=F.distanceTo(Y),yt=Q.projectionMatrix.elements,Nt=xt.projectionMatrix.elements,kt=yt[14]/(yt[10]-1),At=yt[14]/(yt[10]+1),Bt=(yt[9]+1)/yt[5],I=(yt[9]-1)/yt[5],ht=(yt[8]-1)/yt[0],Z=(Nt[8]+1)/Nt[0],ut=kt*ht,j=kt*Z,wt=Tt/(-ht+Z),bt=wt*-ht;Q.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(bt),H.translateZ(wt),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert();let M=kt+wt,y=At+wt,N=ut-bt,rt=j+(Tt-bt),st=Bt*At/y*M,et=I*At/y*M;H.projectionMatrix.makePerspective(N,rt,st,et,M,y),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}function J(H,Q){Q===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(Q.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(s===null)return;v.near=T.near=w.near=H.near,v.far=T.far=w.far=H.far,(E!==v.near||B!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),E=v.near,B=v.far);let Q=H.parent,xt=v.cameras;J(v,Q);for(let Tt=0;Tt<xt.length;Tt++)J(xt[Tt],Q);xt.length===2?$(v,w,T):v.projectionMatrix.copy(w.projectionMatrix),q(H,v,Q)};function q(H,Q,xt){xt===null?H.matrix.copy(Q.matrixWorld):(H.matrix.copy(xt.matrixWorld),H.matrix.invert(),H.matrix.multiply(Q.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(Q.projectionMatrix),H.projectionMatrixInverse.copy(Q.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=_s*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(H){c=H,d!==null&&(d.fixedFoveation=H),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=H)};let tt=null;function k(H,Q){if(h=Q.getViewerPose(l||a),g=Q,h!==null){let xt=h.views;p!==null&&(t.setRenderTargetFramebuffer(f,p.framebuffer),t.setRenderTarget(f));let Tt=!1;xt.length!==v.cameras.length&&(v.cameras.length=0,Tt=!0);for(let yt=0;yt<xt.length;yt++){let Nt=xt[yt],kt=null;if(p!==null)kt=p.getViewport(Nt);else{let Bt=u.getViewSubImage(d,Nt);kt=Bt.viewport,yt===0&&(t.setRenderTargetTextures(f,Bt.colorTexture,d.ignoreDepthValues?void 0:Bt.depthStencilTexture),t.setRenderTarget(f))}let At=W[yt];At===void 0&&(At=new qe,At.layers.enable(yt),At.viewport=new ge,W[yt]=At),At.matrix.fromArray(Nt.transform.matrix),At.matrix.decompose(At.position,At.quaternion,At.scale),At.projectionMatrix.fromArray(Nt.projectionMatrix),At.projectionMatrixInverse.copy(At.projectionMatrix).invert(),At.viewport.set(kt.x,kt.y,kt.width,kt.height),yt===0&&(v.matrix.copy(At.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),Tt===!0&&v.cameras.push(At)}}for(let xt=0;xt<b.length;xt++){let Tt=x[xt],yt=b[xt];Tt!==null&&yt!==void 0&&yt.update(Tt,Q,l||a)}tt&&tt(H,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}let ct=new bl;ct.setAnimationLoop(k),this.setAnimationLoop=function(H){tt=H},this.dispose=function(){}}};function Vm(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Sl(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,b,x,A){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,A)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,b,x):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Fe&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Fe&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let b=t.get(f).envMap;if(b&&(m.envMap.value=b,m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap){m.lightMap.value=f.lightMap;let x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=f.lightMapIntensity*x,e(f.lightMap,m.lightMapTransform)}f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,b,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*b,m.scale.value=x*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),t.get(f).envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,b){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Fe&&m.clearcoatNormalScale.value.negate())),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let b=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Gm(i,t,e,n){let s={},r={},a=[],o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(b,x){let A=x.program;n.uniformBlockBinding(b,A)}function l(b,x){let A=s[b.id];A===void 0&&(g(b),A=h(b),s[b.id]=A,b.addEventListener("dispose",m));let L=x.program;n.updateUBOMapping(b,L);let w=t.render.frame;r[b.id]!==w&&(d(b),r[b.id]=w)}function h(b){let x=u();b.__bindingPointIndex=x;let A=i.createBuffer(),L=b.__size,w=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,A),i.bufferData(i.UNIFORM_BUFFER,L,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,A),A}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let x=s[b.id],A=b.uniforms,L=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let w=0,T=A.length;w<T;w++){let W=Array.isArray(A[w])?A[w]:[A[w]];for(let v=0,E=W.length;v<E;v++){let B=W[v];if(p(B,w,v,L)===!0){let K=B.__offset,ot=Array.isArray(B.value)?B.value:[B.value],U=0;for(let F=0;F<ot.length;F++){let Y=ot[F],$=_(Y);typeof Y=="number"||typeof Y=="boolean"?(B.__data[0]=Y,i.bufferSubData(i.UNIFORM_BUFFER,K+U,B.__data)):Y.isMatrix3?(B.__data[0]=Y.elements[0],B.__data[1]=Y.elements[1],B.__data[2]=Y.elements[2],B.__data[3]=0,B.__data[4]=Y.elements[3],B.__data[5]=Y.elements[4],B.__data[6]=Y.elements[5],B.__data[7]=0,B.__data[8]=Y.elements[6],B.__data[9]=Y.elements[7],B.__data[10]=Y.elements[8],B.__data[11]=0):(Y.toArray(B.__data,U),U+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,K,B.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(b,x,A,L){let w=b.value,T=x+"_"+A;if(L[T]===void 0)return typeof w=="number"||typeof w=="boolean"?L[T]=w:L[T]=w.clone(),!0;{let W=L[T];if(typeof w=="number"||typeof w=="boolean"){if(W!==w)return L[T]=w,!0}else if(W.equals(w)===!1)return W.copy(w),!0}return!1}function g(b){let x=b.uniforms,A=0,L=16;for(let T=0,W=x.length;T<W;T++){let v=Array.isArray(x[T])?x[T]:[x[T]];for(let E=0,B=v.length;E<B;E++){let K=v[E],ot=Array.isArray(K.value)?K.value:[K.value];for(let U=0,F=ot.length;U<F;U++){let Y=ot[U],$=_(Y),J=A%L;J!==0&&L-J<$.boundary&&(A+=L-J),K.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=A,A+=$.storage}}}let w=A%L;return w>0&&(A+=L-w),b.__size=A,b.__cache={},this}function _(b){let x={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(x.boundary=4,x.storage=4):b.isVector2?(x.boundary=8,x.storage=8):b.isVector3||b.isColor?(x.boundary=16,x.storage=12):b.isVector4?(x.boundary=16,x.storage=16):b.isMatrix3?(x.boundary=48,x.storage=48):b.isMatrix4?(x.boundary=64,x.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),x}function m(b){let x=b.target;x.removeEventListener("dispose",m);let A=a.indexOf(x.__bindingPointIndex);a.splice(A,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function f(){for(let b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:c,update:l,dispose:f}}var bs=class{constructor(t={}){let{canvas:e=jh(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=a;let p=new Uint32Array(4),g=new Int32Array(4),_=null,m=null,f=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ee,this._useLegacyLights=!1,this.toneMapping=Yn,this.toneMappingExposure=1;let x=this,A=!1,L=0,w=0,T=null,W=-1,v=null,E=new ge,B=new ge,K=null,ot=new ne(0),U=0,F=e.width,Y=e.height,$=1,J=null,q=null,tt=new ge(0,0,F,Y),k=new ge(0,0,F,Y),ct=!1,H=new Ms,Q=!1,xt=!1,Tt=null,yt=new Me,Nt=new at,kt=new P,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Bt(){return T===null?$:1}let I=n;function ht(S,O){for(let G=0;G<S.length;G++){let X=S[G],V=e.getContext(X,O);if(V!==null)return V}return null}try{let S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",_t,!1),e.addEventListener("webglcontextrestored",D,!1),e.addEventListener("webglcontextcreationerror",pt,!1),I===null){let O=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&O.shift(),I=ht(O,S),I===null)throw ht(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&I instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),I.getShaderPrecisionFormat===void 0&&(I.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Z,ut,j,wt,bt,M,y,N,rt,st,et,Ct,vt,Et,Ot,Xt,nt,qt,C,it,gt,ft,Pt,Zt;function Yt(){Z=new cp(I),ut=new np(I,Z,t),Z.init(ut),ft=new km(I,Z,ut),j=new Bm(I,Z,ut),wt=new up(I),bt=new Tm,M=new zm(I,Z,j,bt,ut,ft,wt),y=new sp(x),N=new ap(x),rt=new xu(I,ut),Pt=new tp(I,Z,rt,ut),st=new lp(I,rt,wt,Pt),et=new mp(I,st,rt,wt),C=new pp(I,ut,M),Xt=new ip(bt),Ct=new Am(x,y,N,Z,ut,Pt,Xt),vt=new Vm(x,bt),Et=new Rm,Ot=new Dm(Z,ut),qt=new $f(x,y,N,j,et,d,c),nt=new Fm(x,et,ut),Zt=new Gm(I,wt,ut,j),it=new ep(I,Z,wt,ut),gt=new hp(I,Z,wt,ut),wt.programs=Ct.programs,x.capabilities=ut,x.extensions=Z,x.properties=bt,x.renderLists=Et,x.shadowMap=nt,x.state=j,x.info=wt}Yt();let Qt=new $o(x,I);this.xr=Qt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let S=Z.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=Z.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(S){S!==void 0&&($=S,this.setSize(F,Y,!1))},this.getSize=function(S){return S.set(F,Y)},this.setSize=function(S,O,G=!0){if(Qt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=S,Y=O,e.width=Math.floor(S*$),e.height=Math.floor(O*$),G===!0&&(e.style.width=S+"px",e.style.height=O+"px"),this.setViewport(0,0,S,O)},this.getDrawingBufferSize=function(S){return S.set(F*$,Y*$).floor()},this.setDrawingBufferSize=function(S,O,G){F=S,Y=O,$=G,e.width=Math.floor(S*G),e.height=Math.floor(O*G),this.setViewport(0,0,S,O)},this.getCurrentViewport=function(S){return S.copy(E)},this.getViewport=function(S){return S.copy(tt)},this.setViewport=function(S,O,G,X){S.isVector4?tt.set(S.x,S.y,S.z,S.w):tt.set(S,O,G,X),j.viewport(E.copy(tt).multiplyScalar($).floor())},this.getScissor=function(S){return S.copy(k)},this.setScissor=function(S,O,G,X){S.isVector4?k.set(S.x,S.y,S.z,S.w):k.set(S,O,G,X),j.scissor(B.copy(k).multiplyScalar($).floor())},this.getScissorTest=function(){return ct},this.setScissorTest=function(S){j.setScissorTest(ct=S)},this.setOpaqueSort=function(S){J=S},this.setTransparentSort=function(S){q=S},this.getClearColor=function(S){return S.copy(qt.getClearColor())},this.setClearColor=function(){qt.setClearColor.apply(qt,arguments)},this.getClearAlpha=function(){return qt.getClearAlpha()},this.setClearAlpha=function(){qt.setClearAlpha.apply(qt,arguments)},this.clear=function(S=!0,O=!0,G=!0){let X=0;if(S){let V=!1;if(T!==null){let St=T.texture.format;V=St===ml||St===pl||St===fl}if(V){let St=T.texture.type,Ut=St===qn||St===Gn||St===Sa||St===si||St===ul||St===dl,Dt=qt.getClearColor(),Ht=qt.getClearAlpha(),Jt=Dt.r,Vt=Dt.g,Gt=Dt.b;Ut?(p[0]=Jt,p[1]=Vt,p[2]=Gt,p[3]=Ht,I.clearBufferuiv(I.COLOR,0,p)):(g[0]=Jt,g[1]=Vt,g[2]=Gt,g[3]=Ht,I.clearBufferiv(I.COLOR,0,g))}else X|=I.COLOR_BUFFER_BIT}O&&(X|=I.DEPTH_BUFFER_BIT),G&&(X|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",_t,!1),e.removeEventListener("webglcontextrestored",D,!1),e.removeEventListener("webglcontextcreationerror",pt,!1),Et.dispose(),Ot.dispose(),bt.dispose(),y.dispose(),N.dispose(),et.dispose(),Pt.dispose(),Zt.dispose(),Ct.dispose(),Qt.dispose(),Qt.removeEventListener("sessionstart",Se),Qt.removeEventListener("sessionend",re),Tt&&(Tt.dispose(),Tt=null),Ce.stop()};function _t(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function D(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let S=wt.autoReset,O=nt.enabled,G=nt.autoUpdate,X=nt.needsUpdate,V=nt.type;Yt(),wt.autoReset=S,nt.enabled=O,nt.autoUpdate=G,nt.needsUpdate=X,nt.type=V}function pt(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function mt(S){let O=S.target;O.removeEventListener("dispose",mt),Ft(O)}function Ft(S){Lt(S),bt.remove(S)}function Lt(S){let O=bt.get(S).programs;O!==void 0&&(O.forEach(function(G){Ct.releaseProgram(G)}),S.isShaderMaterial&&Ct.releaseShaderCache(S))}this.renderBufferDirect=function(S,O,G,X,V,St){O===null&&(O=At);let Ut=V.isMesh&&V.matrixWorld.determinant()<0,Dt=ts(S,O,G,X,V);j.setMaterial(X,Ut);let Ht=G.index,Jt=1;if(X.wireframe===!0){if(Ht=st.getWireframeAttribute(G),Ht===void 0)return;Jt=2}let Vt=G.drawRange,Gt=G.attributes.position,xe=Vt.start*Jt,Ue=(Vt.start+Vt.count)*Jt;St!==null&&(xe=Math.max(xe,St.start*Jt),Ue=Math.min(Ue,(St.start+St.count)*Jt)),Ht!==null?(xe=Math.max(xe,0),Ue=Math.min(Ue,Ht.count)):Gt!=null&&(xe=Math.max(xe,0),Ue=Math.min(Ue,Gt.count));let fe=Ue-xe;if(fe<0||fe===1/0)return;Pt.setup(V,X,Dt,G,Ht);let Je,R=it;if(Ht!==null&&(Je=rt.get(Ht),R=gt,R.setIndex(Je)),V.isMesh)X.wireframe===!0?(j.setLineWidth(X.wireframeLinewidth*Bt()),R.setMode(I.LINES)):R.setMode(I.TRIANGLES);else if(V.isLine){let z=X.linewidth;z===void 0&&(z=1),j.setLineWidth(z*Bt()),V.isLineSegments?R.setMode(I.LINES):V.isLineLoop?R.setMode(I.LINE_LOOP):R.setMode(I.LINE_STRIP)}else V.isPoints?R.setMode(I.POINTS):V.isSprite&&R.setMode(I.TRIANGLES);if(V.isBatchedMesh)R.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else if(V.isInstancedMesh)R.renderInstances(xe,fe,V.count);else if(G.isInstancedBufferGeometry){let z=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,dt=Math.min(G.instanceCount,z);R.renderInstances(xe,fe,dt)}else R.render(xe,fe)};function Kt(S,O,G){S.transparent===!0&&S.side===Oe&&S.forceSinglePass===!1?(S.side=Fe,S.needsUpdate=!0,Jn(S,O,G),S.side=Zn,S.needsUpdate=!0,Jn(S,O,G),S.side=Oe):Jn(S,O,G)}this.compile=function(S,O,G=null){G===null&&(G=S),m=Ot.get(G),m.init(),b.push(m),G.traverseVisible(function(V){V.isLight&&V.layers.test(O.layers)&&(m.pushLight(V),V.castShadow&&m.pushShadow(V))}),S!==G&&S.traverseVisible(function(V){V.isLight&&V.layers.test(O.layers)&&(m.pushLight(V),V.castShadow&&m.pushShadow(V))}),m.setupLights(x._useLegacyLights);let X=new Set;return S.traverse(function(V){let St=V.material;if(St)if(Array.isArray(St))for(let Ut=0;Ut<St.length;Ut++){let Dt=St[Ut];Kt(Dt,G,V),X.add(Dt)}else Kt(St,G,V),X.add(St)}),b.pop(),m=null,X},this.compileAsync=function(S,O,G=null){let X=this.compile(S,O,G);return new Promise(V=>{function St(){if(X.forEach(function(Ut){bt.get(Ut).currentProgram.isReady()&&X.delete(Ut)}),X.size===0){V(S);return}setTimeout(St,10)}Z.get("KHR_parallel_shader_compile")!==null?St():setTimeout(St,10)})};let se=null;function ue(S){se&&se(S)}function Se(){Ce.stop()}function re(){Ce.start()}let Ce=new bl;Ce.setAnimationLoop(ue),typeof self<"u"&&Ce.setContext(self),this.setAnimationLoop=function(S){se=S,Qt.setAnimationLoop(S),S===null?Ce.stop():Ce.start()},Qt.addEventListener("sessionstart",Se),Qt.addEventListener("sessionend",re),this.render=function(S,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Qt.enabled===!0&&Qt.isPresenting===!0&&(Qt.cameraAutoUpdate===!0&&Qt.updateCamera(O),O=Qt.getCamera()),S.isScene===!0&&S.onBeforeRender(x,S,O,T),m=Ot.get(S,b.length),m.init(),b.push(m),yt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),H.setFromProjectionMatrix(yt),xt=this.localClippingEnabled,Q=Xt.init(this.clippingPlanes,xt),_=Et.get(S,f.length),_.init(),f.push(_),Ke(S,O,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(J,q),this.info.render.frame++,Q===!0&&Xt.beginShadows();let G=m.state.shadowsArray;if(nt.render(G,S,O),Q===!0&&Xt.endShadows(),this.info.autoReset===!0&&this.info.reset(),qt.render(_,S),m.setupLights(x._useLegacyLights),O.isArrayCamera){let X=O.cameras;for(let V=0,St=X.length;V<St;V++){let Ut=X[V];Ae(_,S,Ut,Ut.viewport)}}else Ae(_,S,O);T!==null&&(M.updateMultisampleRenderTarget(T),M.updateRenderTargetMipmap(T)),S.isScene===!0&&S.onAfterRender(x,S,O),Pt.resetDefaultState(),W=-1,v=null,b.pop(),b.length>0?m=b[b.length-1]:m=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function Ke(S,O,G,X){if(S.visible===!1)return;if(S.layers.test(O.layers)){if(S.isGroup)G=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(O);else if(S.isLight)m.pushLight(S),S.castShadow&&m.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||H.intersectsSprite(S)){X&&kt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(yt);let Ut=et.update(S),Dt=S.material;Dt.visible&&_.push(S,Ut,Dt,G,kt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||H.intersectsObject(S))){let Ut=et.update(S),Dt=S.material;if(X&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),kt.copy(S.boundingSphere.center)):(Ut.boundingSphere===null&&Ut.computeBoundingSphere(),kt.copy(Ut.boundingSphere.center)),kt.applyMatrix4(S.matrixWorld).applyMatrix4(yt)),Array.isArray(Dt)){let Ht=Ut.groups;for(let Jt=0,Vt=Ht.length;Jt<Vt;Jt++){let Gt=Ht[Jt],xe=Dt[Gt.materialIndex];xe&&xe.visible&&_.push(S,Ut,xe,G,kt.z,Gt)}}else Dt.visible&&_.push(S,Ut,Dt,G,kt.z,null)}}let St=S.children;for(let Ut=0,Dt=St.length;Ut<Dt;Ut++)Ke(St[Ut],O,G,X)}function Ae(S,O,G,X){let V=S.opaque,St=S.transmissive,Ut=S.transparent;m.setupLightsView(G),Q===!0&&Xt.setGlobalState(x.clippingPlanes,G),St.length>0&&Ns(V,St,O,G),X&&j.viewport(E.copy(X)),V.length>0&&Ie(V,O,G),St.length>0&&Ie(St,O,G),Ut.length>0&&Ie(Ut,O,G),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function Ns(S,O,G,X){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;let St=ut.isWebGL2;Tt===null&&(Tt=new Ln(1,1,{generateMipmaps:!0,type:Z.has("EXT_color_buffer_half_float")?gs:qn,minFilter:ms,samples:St?4:0})),x.getDrawingBufferSize(Nt),St?Tt.setSize(Nt.x,Nt.y):Tt.setSize(_r(Nt.x),_r(Nt.y));let Ut=x.getRenderTarget();x.setRenderTarget(Tt),x.getClearColor(ot),U=x.getClearAlpha(),U<1&&x.setClearColor(16777215,.5),x.clear();let Dt=x.toneMapping;x.toneMapping=Yn,Ie(S,G,X),M.updateMultisampleRenderTarget(Tt),M.updateRenderTargetMipmap(Tt);let Ht=!1;for(let Jt=0,Vt=O.length;Jt<Vt;Jt++){let Gt=O[Jt],xe=Gt.object,Ue=Gt.geometry,fe=Gt.material,Je=Gt.group;if(fe.side===Oe&&xe.layers.test(X.layers)){let R=fe.side;fe.side=Fe,fe.needsUpdate=!0,_n(xe,G,X,Ue,fe,Je),fe.side=R,fe.needsUpdate=!0,Ht=!0}}Ht===!0&&(M.updateMultisampleRenderTarget(Tt),M.updateRenderTargetMipmap(Tt)),x.setRenderTarget(Ut),x.setClearColor(ot,U),x.toneMapping=Dt}function Ie(S,O,G){let X=O.isScene===!0?O.overrideMaterial:null;for(let V=0,St=S.length;V<St;V++){let Ut=S[V],Dt=Ut.object,Ht=Ut.geometry,Jt=X===null?Ut.material:X,Vt=Ut.group;Dt.layers.test(G.layers)&&_n(Dt,O,G,Ht,Jt,Vt)}}function _n(S,O,G,X,V,St){S.onBeforeRender(x,O,G,X,V,St),S.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),V.onBeforeRender(x,O,G,X,S,St),V.transparent===!0&&V.side===Oe&&V.forceSinglePass===!1?(V.side=Fe,V.needsUpdate=!0,x.renderBufferDirect(G,O,X,V,S,St),V.side=Zn,V.needsUpdate=!0,x.renderBufferDirect(G,O,X,V,S,St),V.side=Oe):x.renderBufferDirect(G,O,X,V,S,St),S.onAfterRender(x,O,G,X,V,St)}function Jn(S,O,G){O.isScene!==!0&&(O=At);let X=bt.get(S),V=m.state.lights,St=m.state.shadowsArray,Ut=V.state.version,Dt=Ct.getParameters(S,V.state,St,O,G),Ht=Ct.getProgramCacheKey(Dt),Jt=X.programs;X.environment=S.isMeshStandardMaterial?O.environment:null,X.fog=O.fog,X.envMap=(S.isMeshStandardMaterial?N:y).get(S.envMap||X.environment),Jt===void 0&&(S.addEventListener("dispose",mt),Jt=new Map,X.programs=Jt);let Vt=Jt.get(Ht);if(Vt!==void 0){if(X.currentProgram===Vt&&X.lightsStateVersion===Ut)return ee(S,Dt),Vt}else Dt.uniforms=Ct.getUniforms(S),S.onBuild(G,Dt,x),S.onBeforeCompile(Dt,x),Vt=Ct.acquireProgram(Dt,Ht),Jt.set(Ht,Vt),X.uniforms=Dt.uniforms;let Gt=X.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Gt.clippingPlanes=Xt.uniform),ee(S,Dt),X.needsLights=Os(S),X.lightsStateVersion=Ut,X.needsLights&&(Gt.ambientLightColor.value=V.state.ambient,Gt.lightProbe.value=V.state.probe,Gt.directionalLights.value=V.state.directional,Gt.directionalLightShadows.value=V.state.directionalShadow,Gt.spotLights.value=V.state.spot,Gt.spotLightShadows.value=V.state.spotShadow,Gt.rectAreaLights.value=V.state.rectArea,Gt.ltc_1.value=V.state.rectAreaLTC1,Gt.ltc_2.value=V.state.rectAreaLTC2,Gt.pointLights.value=V.state.point,Gt.pointLightShadows.value=V.state.pointShadow,Gt.hemisphereLights.value=V.state.hemi,Gt.directionalShadowMap.value=V.state.directionalShadowMap,Gt.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Gt.spotShadowMap.value=V.state.spotShadowMap,Gt.spotLightMatrix.value=V.state.spotLightMatrix,Gt.spotLightMap.value=V.state.spotLightMap,Gt.pointShadowMap.value=V.state.pointShadowMap,Gt.pointShadowMatrix.value=V.state.pointShadowMatrix),X.currentProgram=Vt,X.uniformsList=null,Vt}function te(S){if(S.uniformsList===null){let O=S.currentProgram.getUniforms();S.uniformsList=Bi.seqWithValue(O.seq,S.uniforms)}return S.uniformsList}function ee(S,O){let G=bt.get(S);G.outputColorSpace=O.outputColorSpace,G.batching=O.batching,G.instancing=O.instancing,G.instancingColor=O.instancingColor,G.skinning=O.skinning,G.morphTargets=O.morphTargets,G.morphNormals=O.morphNormals,G.morphColors=O.morphColors,G.morphTargetsCount=O.morphTargetsCount,G.numClippingPlanes=O.numClippingPlanes,G.numIntersection=O.numClipIntersection,G.vertexAlphas=O.vertexAlphas,G.vertexTangents=O.vertexTangents,G.toneMapping=O.toneMapping}function ts(S,O,G,X,V){O.isScene!==!0&&(O=At),M.resetTextureUnits();let St=O.fog,Ut=X.isMeshStandardMaterial?O.environment:null,Dt=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:In,Ht=(X.isMeshStandardMaterial?N:y).get(X.envMap||Ut),Jt=X.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Vt=!!G.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Gt=!!G.morphAttributes.position,xe=!!G.morphAttributes.normal,Ue=!!G.morphAttributes.color,fe=Yn;X.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(fe=x.toneMapping);let Je=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,R=Je!==void 0?Je.length:0,z=bt.get(X),dt=m.state.lights;if(Q===!0&&(xt===!0||S!==v)){let ae=S===v&&X.id===W;Xt.setState(X,S,ae)}let lt=!1;X.version===z.__version?(z.needsLights&&z.lightsStateVersion!==dt.state.version||z.outputColorSpace!==Dt||V.isBatchedMesh&&z.batching===!1||!V.isBatchedMesh&&z.batching===!0||V.isInstancedMesh&&z.instancing===!1||!V.isInstancedMesh&&z.instancing===!0||V.isSkinnedMesh&&z.skinning===!1||!V.isSkinnedMesh&&z.skinning===!0||V.isInstancedMesh&&z.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&z.instancingColor===!1&&V.instanceColor!==null||z.envMap!==Ht||X.fog===!0&&z.fog!==St||z.numClippingPlanes!==void 0&&(z.numClippingPlanes!==Xt.numPlanes||z.numIntersection!==Xt.numIntersection)||z.vertexAlphas!==Jt||z.vertexTangents!==Vt||z.morphTargets!==Gt||z.morphNormals!==xe||z.morphColors!==Ue||z.toneMapping!==fe||ut.isWebGL2===!0&&z.morphTargetsCount!==R)&&(lt=!0):(lt=!0,z.__version=X.version);let Rt=z.currentProgram;lt===!0&&(Rt=Jn(X,O,V));let It=!1,zt=!1,jt=!1,Wt=Rt.getUniforms(),pe=z.uniforms;if(j.useProgram(Rt.program)&&(It=!0,zt=!0,jt=!0),X.id!==W&&(W=X.id,zt=!0),It||v!==S){Wt.setValue(I,"projectionMatrix",S.projectionMatrix),Wt.setValue(I,"viewMatrix",S.matrixWorldInverse);let ae=Wt.map.cameraPosition;ae!==void 0&&ae.setValue(I,kt.setFromMatrixPosition(S.matrixWorld)),ut.logarithmicDepthBuffer&&Wt.setValue(I,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Wt.setValue(I,"isOrthographic",S.isOrthographicCamera===!0),v!==S&&(v=S,zt=!0,jt=!0)}if(V.isSkinnedMesh){Wt.setOptional(I,V,"bindMatrix"),Wt.setOptional(I,V,"bindMatrixInverse");let ae=V.skeleton;ae&&(ut.floatVertexTextures?(ae.boneTexture===null&&ae.computeBoneTexture(),Wt.setValue(I,"boneTexture",ae.boneTexture,M)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}V.isBatchedMesh&&(Wt.setOptional(I,V,"batchingTexture"),Wt.setValue(I,"batchingTexture",V._matricesTexture,M));let ye=G.morphAttributes;if((ye.position!==void 0||ye.normal!==void 0||ye.color!==void 0&&ut.isWebGL2===!0)&&C.update(V,G,Rt),(zt||z.receiveShadow!==V.receiveShadow)&&(z.receiveShadow=V.receiveShadow,Wt.setValue(I,"receiveShadow",V.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(pe.envMap.value=Ht,pe.flipEnvMap.value=Ht.isCubeTexture&&Ht.isRenderTargetTexture===!1?-1:1),zt&&(Wt.setValue(I,"toneMappingExposure",x.toneMappingExposure),z.needsLights&&es(pe,jt),St&&X.fog===!0&&vt.refreshFogUniforms(pe,St),vt.refreshMaterialUniforms(pe,X,$,Y,Tt),Bi.upload(I,te(z),pe,M)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Bi.upload(I,te(z),pe,M),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Wt.setValue(I,"center",V.center),Wt.setValue(I,"modelViewMatrix",V.modelViewMatrix),Wt.setValue(I,"normalMatrix",V.normalMatrix),Wt.setValue(I,"modelMatrix",V.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){let ae=X.uniformsGroups;for(let Sn=0,jr=ae.length;Sn<jr;Sn++)if(ut.isWebGL2){let Fs=ae[Sn];Zt.update(Fs,Rt),Zt.bind(Fs,Rt)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Rt}function es(S,O){S.ambientLightColor.needsUpdate=O,S.lightProbe.needsUpdate=O,S.directionalLights.needsUpdate=O,S.directionalLightShadows.needsUpdate=O,S.pointLights.needsUpdate=O,S.pointLightShadows.needsUpdate=O,S.spotLights.needsUpdate=O,S.spotLightShadows.needsUpdate=O,S.rectAreaLights.needsUpdate=O,S.hemisphereLights.needsUpdate=O}function Os(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(S,O,G){bt.get(S.texture).__webglTexture=O,bt.get(S.depthTexture).__webglTexture=G;let X=bt.get(S);X.__hasExternalTextures=!0,X.__hasExternalTextures&&(X.__autoAllocateDepthBuffer=G===void 0,X.__autoAllocateDepthBuffer||Z.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(S,O){let G=bt.get(S);G.__webglFramebuffer=O,G.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(S,O=0,G=0){T=S,L=O,w=G;let X=!0,V=null,St=!1,Ut=!1;if(S){let Ht=bt.get(S);Ht.__useDefaultFramebuffer!==void 0?(j.bindFramebuffer(I.FRAMEBUFFER,null),X=!1):Ht.__webglFramebuffer===void 0?M.setupRenderTarget(S):Ht.__hasExternalTextures&&M.rebindTextures(S,bt.get(S.texture).__webglTexture,bt.get(S.depthTexture).__webglTexture);let Jt=S.texture;(Jt.isData3DTexture||Jt.isDataArrayTexture||Jt.isCompressedArrayTexture)&&(Ut=!0);let Vt=bt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Vt[O])?V=Vt[O][G]:V=Vt[O],St=!0):ut.isWebGL2&&S.samples>0&&M.useMultisampledRTT(S)===!1?V=bt.get(S).__webglMultisampledFramebuffer:Array.isArray(Vt)?V=Vt[G]:V=Vt,E.copy(S.viewport),B.copy(S.scissor),K=S.scissorTest}else E.copy(tt).multiplyScalar($).floor(),B.copy(k).multiplyScalar($).floor(),K=ct;if(j.bindFramebuffer(I.FRAMEBUFFER,V)&&ut.drawBuffers&&X&&j.drawBuffers(S,V),j.viewport(E),j.scissor(B),j.setScissorTest(K),St){let Ht=bt.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ht.__webglTexture,G)}else if(Ut){let Ht=bt.get(S.texture),Jt=O||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ht.__webglTexture,G||0,Jt)}W=-1},this.readRenderTargetPixels=function(S,O,G,X,V,St,Ut){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=bt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ut!==void 0&&(Dt=Dt[Ut]),Dt){j.bindFramebuffer(I.FRAMEBUFFER,Dt);try{let Ht=S.texture,Jt=Ht.format,Vt=Ht.type;if(Jt!==dn&&ft.convert(Jt)!==I.getParameter(I.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Gt=Vt===gs&&(Z.has("EXT_color_buffer_half_float")||ut.isWebGL2&&Z.has("EXT_color_buffer_float"));if(Vt!==qn&&ft.convert(Vt)!==I.getParameter(I.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Vt===Wn&&(ut.isWebGL2||Z.has("OES_texture_float")||Z.has("WEBGL_color_buffer_float")))&&!Gt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=S.width-X&&G>=0&&G<=S.height-V&&I.readPixels(O,G,X,V,ft.convert(Jt),ft.convert(Vt),St)}finally{let Ht=T!==null?bt.get(T).__webglFramebuffer:null;j.bindFramebuffer(I.FRAMEBUFFER,Ht)}}},this.copyFramebufferToTexture=function(S,O,G=0){let X=Math.pow(2,-G),V=Math.floor(O.image.width*X),St=Math.floor(O.image.height*X);M.setTexture2D(O,0),I.copyTexSubImage2D(I.TEXTURE_2D,G,0,0,S.x,S.y,V,St),j.unbindTexture()},this.copyTextureToTexture=function(S,O,G,X=0){let V=O.image.width,St=O.image.height,Ut=ft.convert(G.format),Dt=ft.convert(G.type);M.setTexture2D(G,0),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,G.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,G.unpackAlignment),O.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,X,S.x,S.y,V,St,Ut,Dt,O.image.data):O.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,X,S.x,S.y,O.mipmaps[0].width,O.mipmaps[0].height,Ut,O.mipmaps[0].data):I.texSubImage2D(I.TEXTURE_2D,X,S.x,S.y,Ut,Dt,O.image),X===0&&G.generateMipmaps&&I.generateMipmap(I.TEXTURE_2D),j.unbindTexture()},this.copyTextureToTexture3D=function(S,O,G,X,V=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let St=S.max.x-S.min.x+1,Ut=S.max.y-S.min.y+1,Dt=S.max.z-S.min.z+1,Ht=ft.convert(X.format),Jt=ft.convert(X.type),Vt;if(X.isData3DTexture)M.setTexture3D(X,0),Vt=I.TEXTURE_3D;else if(X.isDataArrayTexture||X.isCompressedArrayTexture)M.setTexture2DArray(X,0),Vt=I.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,X.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,X.unpackAlignment);let Gt=I.getParameter(I.UNPACK_ROW_LENGTH),xe=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ue=I.getParameter(I.UNPACK_SKIP_PIXELS),fe=I.getParameter(I.UNPACK_SKIP_ROWS),Je=I.getParameter(I.UNPACK_SKIP_IMAGES),R=G.isCompressedTexture?G.mipmaps[V]:G.image;I.pixelStorei(I.UNPACK_ROW_LENGTH,R.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,R.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,S.min.x),I.pixelStorei(I.UNPACK_SKIP_ROWS,S.min.y),I.pixelStorei(I.UNPACK_SKIP_IMAGES,S.min.z),G.isDataTexture||G.isData3DTexture?I.texSubImage3D(Vt,V,O.x,O.y,O.z,St,Ut,Dt,Ht,Jt,R.data):G.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),I.compressedTexSubImage3D(Vt,V,O.x,O.y,O.z,St,Ut,Dt,Ht,R.data)):I.texSubImage3D(Vt,V,O.x,O.y,O.z,St,Ut,Dt,Ht,Jt,R),I.pixelStorei(I.UNPACK_ROW_LENGTH,Gt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,xe),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ue),I.pixelStorei(I.UNPACK_SKIP_ROWS,fe),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Je),V===0&&X.generateMipmaps&&I.generateMipmap(Vt),j.unbindTexture()},this.initTexture=function(S){S.isCubeTexture?M.setTextureCube(S,0):S.isData3DTexture?M.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?M.setTexture2DArray(S,0):M.setTexture2D(S,0),j.unbindTexture()},this.resetState=function(){L=0,w=0,T=null,j.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===ba?"display-p3":"srgb",e.unpackColorSpace=ce.workingColorSpace===Gr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ee?oi:_l}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===oi?Ee:In}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},ta=class extends bs{};ta.prototype.isWebGL1Renderer=!0;var qi=class extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var wr=class extends $e{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},sn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,p=(a-h)/d;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new at:new P);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new P,s=[],r=[],a=[],o=new P,c=new Me;for(let p=0;p<=t;p++){let g=p/t;s[p]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Te(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Te(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Es=class extends sn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e){let n=e||new at,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,p=l-this.aY;c=d*h-p*u+this.aX,l=d*u+p*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},ea=class extends Es{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Ta(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,p=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,p*=h,s(a,o,d,p)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var or=new P,Ro=new Ta,Co=new Ta,Po=new Ta,ai=class extends sn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(or.subVectors(s[0],s[1]).add(s[0]),l=or);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(or.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=or),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Ro.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,m),Co.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,m),Po.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Ro.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Co.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Po.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Ro.calc(c),Co.calc(c),Po.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Qc(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function Wm(i,t){let e=1-i;return e*e*t}function Xm(i,t){return 2*(1-i)*i*t}function Ym(i,t){return i*i*t}function us(i,t,e,n){return Wm(i,t)+Xm(i,e)+Ym(i,n)}function qm(i,t){let e=1-i;return e*e*e*t}function Zm(i,t){let e=1-i;return 3*e*e*i*t}function Km(i,t){return 3*(1-i)*i*i*t}function Jm(i,t){return i*i*i*t}function ds(i,t,e,n,s){return qm(i,t)+Zm(i,e)+Km(i,n)+Jm(i,s)}var Rr=class extends sn{constructor(t=new at,e=new at,n=new at,s=new at){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new at){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ds(t,s.x,r.x,a.x,o.x),ds(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},na=class extends sn{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ds(t,s.x,r.x,a.x,o.x),ds(t,s.y,r.y,a.y,o.y),ds(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Cr=class extends sn{constructor(t=new at,e=new at){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new at){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new at){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ia=class extends sn{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Pr=class extends sn{constructor(t=new at,e=new at,n=new at){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new at){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(us(t,s.x,r.x,a.x),us(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ir=class extends sn{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(us(t,s.x,r.x,a.x),us(t,s.y,r.y,a.y),us(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ci=class extends sn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new at){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Qc(o,c.x,l.x,h.x,u.x),Qc(o,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new at().fromArray(s))}return this}},Lr=Object.freeze({__proto__:null,ArcCurve:ea,CatmullRomCurve3:ai,CubicBezierCurve:Rr,CubicBezierCurve3:na,EllipseCurve:Es,LineCurve:Cr,LineCurve3:ia,QuadraticBezierCurve:Pr,QuadraticBezierCurve3:Ir,SplineCurve:ci}),sa=class extends sn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Lr[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Lr[s.type]().fromJSON(s))}return this}},Zi=class extends sa{constructor(t){super(),this.type="Path",this.currentPoint=new at,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Cr(this.currentPoint.clone(),new at(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Pr(this.currentPoint.clone(),new at(t,e),new at(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new Rr(this.currentPoint.clone(),new at(t,e),new at(n,s),new at(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new ci(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){let l=new Es(t,e,n,s,r,a,o,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},As=class i extends ze{constructor(t=[new at(0,-.5),new at(.5,0),new at(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Te(s,0,Math.PI*2);let r=[],a=[],o=[],c=[],l=[],h=1/e,u=new P,d=new at,p=new P,g=new P,_=new P,m=0,f=0;for(let b=0;b<=t.length-1;b++)switch(b){case 0:m=t[b+1].x-t[b].x,f=t[b+1].y-t[b].y,p.x=f*1,p.y=-m,p.z=f*0,_.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case t.length-1:c.push(_.x,_.y,_.z);break;default:m=t[b+1].x-t[b].x,f=t[b+1].y-t[b].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),c.push(p.x,p.y,p.z),_.copy(g)}for(let b=0;b<=e;b++){let x=n+b*h*s,A=Math.sin(x),L=Math.cos(x);for(let w=0;w<=t.length-1;w++){u.x=t[w].x*A,u.y=t[w].y,u.z=t[w].x*L,a.push(u.x,u.y,u.z),d.x=b/e,d.y=w/(t.length-1),o.push(d.x,d.y);let T=c[3*w+0]*A,W=c[3*w+1],v=c[3*w+0]*L;l.push(T,W,v)}}for(let b=0;b<e;b++)for(let x=0;x<t.length-1;x++){let A=x+b*t.length,L=A,w=A+t.length,T=A+t.length+1,W=A+1;r.push(L,w,W),r.push(T,W,w)}this.setIndex(r),this.setAttribute("position",new he(a,3)),this.setAttribute("uv",new he(o,2)),this.setAttribute("normal",new he(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var Ur=class i extends ze{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],p=[],g=0,_=[],m=n/2,f=0;b(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(p,2));function b(){let A=new P,L=new P,w=0,T=(e-t)/n;for(let W=0;W<=r;W++){let v=[],E=W/r,B=E*(e-t)+t;for(let K=0;K<=s;K++){let ot=K/s,U=ot*c+o,F=Math.sin(U),Y=Math.cos(U);L.x=B*F,L.y=-E*n+m,L.z=B*Y,u.push(L.x,L.y,L.z),A.set(F,T,Y).normalize(),d.push(A.x,A.y,A.z),p.push(ot,1-E),v.push(g++)}_.push(v)}for(let W=0;W<s;W++)for(let v=0;v<r;v++){let E=_[v][W],B=_[v+1][W],K=_[v+1][W+1],ot=_[v][W+1];h.push(E,B,ot),h.push(B,K,ot),w+=6}l.addGroup(f,w,0),f+=w}function x(A){let L=g,w=new at,T=new P,W=0,v=A===!0?t:e,E=A===!0?1:-1;for(let K=1;K<=s;K++)u.push(0,m*E,0),d.push(0,E,0),p.push(.5,.5),g++;let B=g;for(let K=0;K<=s;K++){let U=K/s*c+o,F=Math.cos(U),Y=Math.sin(U);T.x=v*Y,T.y=m*E,T.z=v*F,u.push(T.x,T.y,T.z),d.push(0,E,0),w.x=F*.5+.5,w.y=Y*.5*E+.5,p.push(w.x,w.y),g++}for(let K=0;K<s;K++){let ot=L+K,U=B+K;A===!0?h.push(U,U+1,ot):h.push(U+1,U,ot),W+=3}l.addGroup(f,W,A===!0?1:2),f+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Ki=class extends Zi{constructor(t){super(t),this.uuid=pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Zi().fromJSON(s))}return this}},jm={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Cl(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l,h,u,d,p;if(n&&(r=n0(i,t,r,e)),i.length>80*e){o=l=i[0],c=h=i[1];for(let g=e;g<s;g+=e)u=i[g],d=i[g+1],u<o&&(o=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);p=Math.max(l-o,h-c),p=p!==0?32767/p:0}return Ts(r,a,e,o,c,p,0),a}};function Cl(i,t,e,n,s){let r,a;if(s===f0(i,t,e,n)>0)for(r=t;r<e;r+=n)a=$c(r,i[r],i[r+1],a);else for(r=e-n;r>=t;r-=n)a=$c(r,i[r],i[r+1],a);return a&&Xr(a,a.next)&&(Rs(a),a=a.next),a}function li(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Xr(e,e.next)||ve(e.prev,e,e.next)===0)){if(Rs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ts(i,t,e,n,s,r,a){if(!i)return;!a&&r&&a0(i,n,s,r);let o=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?$m(i,n,s,r):Qm(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),Rs(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=t0(li(i),t,e),Ts(i,t,e,n,s,r,2)):a===2&&e0(i,t,e,n,s,r):Ts(li(i),t,e,n,s,r,1);break}}}function Qm(i){let t=i.prev,e=i,n=i.next;if(ve(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,c=e.y,l=n.y,h=s<r?s<a?s:a:r<a?r:a,u=o<c?o<l?o:l:c<l?c:l,d=s>r?s>a?s:a:r>a?r:a,p=o>c?o>l?o:l:c>l?c:l,g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&Ni(s,o,r,c,a,l,g.x,g.y)&&ve(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function $m(i,t,e,n){let s=i.prev,r=i,a=i.next;if(ve(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,d=a.y,p=o<c?o<l?o:l:c<l?c:l,g=h<u?h<d?h:d:u<d?u:d,_=o>c?o>l?o:l:c>l?c:l,m=h>u?h>d?h:d:u>d?u:d,f=ra(p,g,t,e,n),b=ra(_,m,t,e,n),x=i.prevZ,A=i.nextZ;for(;x&&x.z>=f&&A&&A.z<=b;){if(x.x>=p&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&Ni(o,h,c,u,l,d,x.x,x.y)&&ve(x.prev,x,x.next)>=0||(x=x.prevZ,A.x>=p&&A.x<=_&&A.y>=g&&A.y<=m&&A!==s&&A!==a&&Ni(o,h,c,u,l,d,A.x,A.y)&&ve(A.prev,A,A.next)>=0))return!1;A=A.nextZ}for(;x&&x.z>=f;){if(x.x>=p&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&Ni(o,h,c,u,l,d,x.x,x.y)&&ve(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;A&&A.z<=b;){if(A.x>=p&&A.x<=_&&A.y>=g&&A.y<=m&&A!==s&&A!==a&&Ni(o,h,c,u,l,d,A.x,A.y)&&ve(A.prev,A,A.next)>=0)return!1;A=A.nextZ}return!0}function t0(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!Xr(s,r)&&Pl(s,n,n.next,r)&&ws(s,r)&&ws(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Rs(n),Rs(n.next),n=i=r),n=n.next}while(n!==i);return li(n)}function e0(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&h0(a,o)){let c=Il(a,o);a=li(a,a.next),c=li(c,c.next),Ts(a,t,e,n,s,r,0),Ts(c,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function n0(i,t,e,n){let s=[],r,a,o,c,l;for(r=0,a=t.length;r<a;r++)o=t[r]*n,c=r<a-1?t[r+1]*n:i.length,l=Cl(i,o,c,n,!1),l===l.next&&(l.steiner=!0),s.push(l0(l));for(s.sort(i0),r=0;r<s.length;r++)e=s0(s[r],e);return e}function i0(i,t){return i.x-t.x}function s0(i,t){let e=r0(i,t);if(!e)return t;let n=Il(e,i);return li(n,n.next),li(e,e.next)}function r0(i,t){let e=t,n=-1/0,s,r=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){let d=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;let o=s,c=s.x,l=s.y,h=1/0,u;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&Ni(a<l?r:n,a,c,l,a<l?n:r,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(r-e.x),ws(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&o0(s,e)))&&(s=e,h=u)),e=e.next;while(e!==o);return s}function o0(i,t){return ve(i.prev,i,t.prev)<0&&ve(t.next,i,i.next)<0}function a0(i,t,e,n){let s=i;do s.z===0&&(s.z=ra(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,c0(s)}function c0(i){let t,e,n,s,r,a,o,c,l=1;do{for(e=i,i=null,r=null,a=0;e;){for(a++,n=e,o=0,t=0;t<l&&(o++,n=n.nextZ,!!n);t++);for(c=l;o>0||c>0&&n;)o!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,o--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,l*=2}while(a>1);return i}function ra(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function l0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Ni(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function h0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!u0(i,t)&&(ws(i,t)&&ws(t,i)&&d0(i,t)&&(ve(i.prev,i,t.prev)||ve(i,t.prev,t))||Xr(i,t)&&ve(i.prev,i,i.next)>0&&ve(t.prev,t,t.next)>0)}function ve(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Xr(i,t){return i.x===t.x&&i.y===t.y}function Pl(i,t,e,n){let s=cr(ve(i,t,e)),r=cr(ve(i,t,n)),a=cr(ve(e,n,i)),o=cr(ve(e,n,t));return!!(s!==r&&a!==o||s===0&&ar(i,e,t)||r===0&&ar(i,n,t)||a===0&&ar(e,i,n)||o===0&&ar(e,t,n))}function ar(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function cr(i){return i>0?1:i<0?-1:0}function u0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Pl(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ws(i,t){return ve(i.prev,i,i.next)<0?ve(i,t,i.next)>=0&&ve(i,i.prev,t)>=0:ve(i,t,i.prev)<0||ve(i,i.next,t)<0}function d0(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Il(i,t){let e=new oa(i.i,i.x,i.y),n=new oa(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function $c(i,t,e,n){let s=new oa(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Rs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function oa(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function f0(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var fs=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];tl(t),el(n,t);let a=t.length;e.forEach(tl);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,el(n,e[c]);let o=jm.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function tl(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function el(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Cs=class i extends ze{constructor(t=new Ki([new at(.5,.5),new at(-.5,.5),new at(-.5,-.5),new at(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let o=0,c=t.length;o<c;o++){let l=t[o];a(l)}this.setAttribute("position",new he(s,3)),this.setAttribute("uv",new he(r,2)),this.computeVertexNormals();function a(o){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,f=e.extrudePath,b=e.UVGenerator!==void 0?e.UVGenerator:p0,x,A=!1,L,w,T,W;f&&(x=f.getSpacedPoints(h),A=!0,d=!1,L=f.computeFrenetFrames(h,!1),w=new P,T=new P,W=new P),d||(m=0,p=0,g=0,_=0);let v=o.extractPoints(l),E=v.shape,B=v.holes;if(!fs.isClockWise(E)){E=E.reverse();for(let I=0,ht=B.length;I<ht;I++){let Z=B[I];fs.isClockWise(Z)&&(B[I]=Z.reverse())}}let ot=fs.triangulateShape(E,B),U=E;for(let I=0,ht=B.length;I<ht;I++){let Z=B[I];E=E.concat(Z)}function F(I,ht,Z){return ht||console.error("THREE.ExtrudeGeometry: vec does not exist"),I.clone().addScaledVector(ht,Z)}let Y=E.length,$=ot.length;function J(I,ht,Z){let ut,j,wt,bt=I.x-ht.x,M=I.y-ht.y,y=Z.x-I.x,N=Z.y-I.y,rt=bt*bt+M*M,st=bt*N-M*y;if(Math.abs(st)>Number.EPSILON){let et=Math.sqrt(rt),Ct=Math.sqrt(y*y+N*N),vt=ht.x-M/et,Et=ht.y+bt/et,Ot=Z.x-N/Ct,Xt=Z.y+y/Ct,nt=((Ot-vt)*N-(Xt-Et)*y)/(bt*N-M*y);ut=vt+bt*nt-I.x,j=Et+M*nt-I.y;let qt=ut*ut+j*j;if(qt<=2)return new at(ut,j);wt=Math.sqrt(qt/2)}else{let et=!1;bt>Number.EPSILON?y>Number.EPSILON&&(et=!0):bt<-Number.EPSILON?y<-Number.EPSILON&&(et=!0):Math.sign(M)===Math.sign(N)&&(et=!0),et?(ut=-M,j=bt,wt=Math.sqrt(rt)):(ut=bt,j=M,wt=Math.sqrt(rt/2))}return new at(ut/wt,j/wt)}let q=[];for(let I=0,ht=U.length,Z=ht-1,ut=I+1;I<ht;I++,Z++,ut++)Z===ht&&(Z=0),ut===ht&&(ut=0),q[I]=J(U[I],U[Z],U[ut]);let tt=[],k,ct=q.concat();for(let I=0,ht=B.length;I<ht;I++){let Z=B[I];k=[];for(let ut=0,j=Z.length,wt=j-1,bt=ut+1;ut<j;ut++,wt++,bt++)wt===j&&(wt=0),bt===j&&(bt=0),k[ut]=J(Z[ut],Z[wt],Z[bt]);tt.push(k),ct=ct.concat(k)}for(let I=0;I<m;I++){let ht=I/m,Z=p*Math.cos(ht*Math.PI/2),ut=g*Math.sin(ht*Math.PI/2)+_;for(let j=0,wt=U.length;j<wt;j++){let bt=F(U[j],q[j],ut);yt(bt.x,bt.y,-Z)}for(let j=0,wt=B.length;j<wt;j++){let bt=B[j];k=tt[j];for(let M=0,y=bt.length;M<y;M++){let N=F(bt[M],k[M],ut);yt(N.x,N.y,-Z)}}}let H=g+_;for(let I=0;I<Y;I++){let ht=d?F(E[I],ct[I],H):E[I];A?(T.copy(L.normals[0]).multiplyScalar(ht.x),w.copy(L.binormals[0]).multiplyScalar(ht.y),W.copy(x[0]).add(T).add(w),yt(W.x,W.y,W.z)):yt(ht.x,ht.y,0)}for(let I=1;I<=h;I++)for(let ht=0;ht<Y;ht++){let Z=d?F(E[ht],ct[ht],H):E[ht];A?(T.copy(L.normals[I]).multiplyScalar(Z.x),w.copy(L.binormals[I]).multiplyScalar(Z.y),W.copy(x[I]).add(T).add(w),yt(W.x,W.y,W.z)):yt(Z.x,Z.y,u/h*I)}for(let I=m-1;I>=0;I--){let ht=I/m,Z=p*Math.cos(ht*Math.PI/2),ut=g*Math.sin(ht*Math.PI/2)+_;for(let j=0,wt=U.length;j<wt;j++){let bt=F(U[j],q[j],ut);yt(bt.x,bt.y,u+Z)}for(let j=0,wt=B.length;j<wt;j++){let bt=B[j];k=tt[j];for(let M=0,y=bt.length;M<y;M++){let N=F(bt[M],k[M],ut);A?yt(N.x,N.y+x[h-1].y,x[h-1].x+Z):yt(N.x,N.y,u+Z)}}}Q(),xt();function Q(){let I=s.length/3;if(d){let ht=0,Z=Y*ht;for(let ut=0;ut<$;ut++){let j=ot[ut];Nt(j[2]+Z,j[1]+Z,j[0]+Z)}ht=h+m*2,Z=Y*ht;for(let ut=0;ut<$;ut++){let j=ot[ut];Nt(j[0]+Z,j[1]+Z,j[2]+Z)}}else{for(let ht=0;ht<$;ht++){let Z=ot[ht];Nt(Z[2],Z[1],Z[0])}for(let ht=0;ht<$;ht++){let Z=ot[ht];Nt(Z[0]+Y*h,Z[1]+Y*h,Z[2]+Y*h)}}n.addGroup(I,s.length/3-I,0)}function xt(){let I=s.length/3,ht=0;Tt(U,ht),ht+=U.length;for(let Z=0,ut=B.length;Z<ut;Z++){let j=B[Z];Tt(j,ht),ht+=j.length}n.addGroup(I,s.length/3-I,1)}function Tt(I,ht){let Z=I.length;for(;--Z>=0;){let ut=Z,j=Z-1;j<0&&(j=I.length-1);for(let wt=0,bt=h+m*2;wt<bt;wt++){let M=Y*wt,y=Y*(wt+1),N=ht+ut+M,rt=ht+j+M,st=ht+j+y,et=ht+ut+y;kt(N,rt,st,et)}}}function yt(I,ht,Z){c.push(I),c.push(ht),c.push(Z)}function Nt(I,ht,Z){At(I),At(ht),At(Z);let ut=s.length/3,j=b.generateTopUV(n,s,ut-3,ut-2,ut-1);Bt(j[0]),Bt(j[1]),Bt(j[2])}function kt(I,ht,Z,ut){At(I),At(ht),At(ut),At(ht),At(Z),At(ut);let j=s.length/3,wt=b.generateSideWallUV(n,s,j-6,j-3,j-2,j-1);Bt(wt[0]),Bt(wt[1]),Bt(wt[3]),Bt(wt[1]),Bt(wt[2]),Bt(wt[3])}function At(I){s.push(c[I*3+0]),s.push(c[I*3+1]),s.push(c[I*3+2])}function Bt(I){r.push(I.x),r.push(I.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return m0(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Lr[s.type]().fromJSON(s)),new i(n,t.options)}},p0={generateTopUV:function(i,t,e,n,s){let r=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new at(r,a),new at(o,c),new at(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){let a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],p=t[s*3+1],g=t[s*3+2],_=t[r*3],m=t[r*3+1],f=t[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new at(a,1-c),new at(l,1-u),new at(d,1-g),new at(_,1-f)]:[new at(o,1-c),new at(h,1-u),new at(p,1-g),new at(m,1-f)]}};function m0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Dr=class i extends ze{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],u=new P,d=new P,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){let b=[],x=f/n,A=0;f===0&&a===0?A=.5/e:f===n&&c===Math.PI&&(A=-.5/e);for(let L=0;L<=e;L++){let w=L/e;u.x=-t*Math.cos(s+w*r)*Math.sin(a+x*o),u.y=t*Math.cos(a+x*o),u.z=t*Math.sin(s+w*r)*Math.sin(a+x*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(w+A,1-x),b.push(l++)}h.push(b)}for(let f=0;f<n;f++)for(let b=0;b<e;b++){let x=h[f][b+1],A=h[f][b],L=h[f+1][b],w=h[f+1][b+1];(f!==0||a>0)&&p.push(x,A,w),(f!==n-1||c<Math.PI)&&p.push(A,L,w)}this.setIndex(p),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(_,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Nr=class i extends ze{constructor(t=new Ir(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new P,c=new P,l=new at,h=new P,u=[],d=[],p=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(p,2));function _(){for(let x=0;x<e;x++)m(x);m(r===!1?e:0),b(),f()}function m(x){h=t.getPointAt(x/e,h);let A=a.normals[x],L=a.binormals[x];for(let w=0;w<=s;w++){let T=w/s*Math.PI*2,W=Math.sin(T),v=-Math.cos(T);c.x=v*A.x+W*L.x,c.y=v*A.y+W*L.y,c.z=v*A.z+W*L.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function f(){for(let x=1;x<=e;x++)for(let A=1;A<=s;A++){let L=(s+1)*(x-1)+(A-1),w=(s+1)*x+(A-1),T=(s+1)*x+A,W=(s+1)*(x-1)+A;g.push(L,w,W),g.push(w,T,W)}}function b(){for(let x=0;x<=e;x++)for(let A=0;A<=s;A++)l.x=x/e,l.y=A/s,p.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new Lr[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};var Or=class extends Kn{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new ne(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}};var pn=class extends Kn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xl,this.normalScale=new at(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function lr(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function g0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Ji=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},aa=class extends Ji{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:cc,endingEnd:cc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case lc:r=t,o=2*e-n;break;case hc:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case lc:a=t,c=2*n-e;break;case hc:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-e)/(s-e),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,b=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,x=(-1-p)*m+(1.5+p)*_+.5*g,A=p*m-p*_;for(let L=0;L!==o;++L)r[L]=f*a[h+L]+b*a[l+L]+x*a[c+L]+A*a[u+L];return r}},ca=class extends Ji{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}},la=class extends Ji{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},mn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=lr(e,this.TimeBufferType),this.values=lr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:lr(t.times,Array),values:lr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new la(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ca(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new aa(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case ur:e=this.InterpolantFactoryMethodDiscrete;break;case dr:e=this.InterpolantFactoryMethodLinear;break;case so:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ur;case this.InterpolantFactoryMethodLinear:return dr;case this.InterpolantFactoryMethodSmooth:return so}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&g0(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===so,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=t[o],h=t[o+1];if(l!==h&&(o!==1||l!==t[0]))if(s)c=!0;else{let u=o*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[p+g]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let u=o*n,d=a*n;for(let p=0;p!==n;++p)e[d+p]=e[u+p]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};mn.prototype.TimeBufferType=Float32Array;mn.prototype.ValueBufferType=Float32Array;mn.prototype.DefaultInterpolation=dr;var hi=class extends mn{};hi.prototype.ValueTypeName="bool";hi.prototype.ValueBufferType=Array;hi.prototype.DefaultInterpolation=ur;hi.prototype.InterpolantFactoryMethodLinear=void 0;hi.prototype.InterpolantFactoryMethodSmooth=void 0;var ha=class extends mn{};ha.prototype.ValueTypeName="color";var ua=class extends mn{};ua.prototype.ValueTypeName="number";var da=class extends Ji{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e),l=t*o;for(let h=l+o;l!==h;l+=4)fn.slerpFlat(r,0,a,l-o,a,l,c);return r}},Ps=class extends mn{InterpolantFactoryMethodLinear(t){return new da(this.times,this.values,this.getValueSize(),t)}};Ps.prototype.ValueTypeName="quaternion";Ps.prototype.DefaultInterpolation=dr;Ps.prototype.InterpolantFactoryMethodSmooth=void 0;var ui=class extends mn{};ui.prototype.ValueTypeName="string";ui.prototype.ValueBufferType=Array;ui.prototype.DefaultInterpolation=ur;ui.prototype.InterpolantFactoryMethodLinear=void 0;ui.prototype.InterpolantFactoryMethodSmooth=void 0;var fa=class extends mn{};fa.prototype.ValueTypeName="vector";var nl={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},pa=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let p=l[u],g=l[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}},_0=new pa,Is=class{constructor(t){this.manager=t!==void 0?t:_0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Is.DEFAULT_MATERIAL_NAME="__DEFAULT";var ma=class extends Is{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,a=nl.get(t);if(a!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0),a;let o=xs("img");function c(){h(),nl.add(t,this),e&&e(this),r.manager.itemEnd(t)}function l(u){h(),s&&s(u),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(t),o.src=t,o}};var Fr=class extends Is{constructor(t){super(t)}load(t,e,n,s){let r=new $e,a=new ma(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},Ls=class extends Xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ne(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},Br=class extends Ls{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ne(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Io=new Me,il=new P,sl=new P,zr=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new at(512,512),this.map=null,this.mapPass=null,this.matrix=new Me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ms,this._frameExtents=new at(1,1),this._viewportCount=1,this._viewports=[new ge(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;il.setFromMatrixPosition(t.matrixWorld),e.position.copy(il),sl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(sl),e.updateMatrixWorld(),Io.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Io),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Io)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var rl=new Me,os=new P,Lo=new P,ga=class extends zr{constructor(){super(new qe(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new at(4,2),this._viewportCount=6,this._viewports=[new ge(2,1,1,1),new ge(0,1,1,1),new ge(3,1,1,1),new ge(1,1,1,1),new ge(3,0,1,1),new ge(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),os.setFromMatrixPosition(t.matrixWorld),n.position.copy(os),Lo.copy(n.position),Lo.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Lo),n.updateMatrixWorld(),s.makeTranslation(-os.x,-os.y,-os.z),rl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rl)}},kr=class extends Ls{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ga}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},_a=class extends zr{constructor(){super(new Xi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ji=class extends Ls{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.target=new Xe,this.shadow=new _a}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var wa="\\[\\]\\.:\\/",x0=new RegExp("["+wa+"]","g"),Ra="[^"+wa+"]",y0="[^"+wa.replace("\\.","")+"]",v0=/((?:WC+[\/:])*)/.source.replace("WC",Ra),M0=/(WCOD+)?/.source.replace("WCOD",y0),S0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ra),b0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ra),E0=new RegExp("^"+v0+M0+S0+b0+"$"),A0=["material","materials","bones","map"],xa=class{constructor(t,e,n){let s=n||me.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},me=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(x0,"")}static parseTrackName(t){let e=E0.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);A0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let a=t[s];if(a===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};me.Composite=xa;me.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};me.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};me.prototype.GetterByBindingType=[me.prototype._getValue_direct,me.prototype._getValue_array,me.prototype._getValue_arrayElement,me.prototype._getValue_toArray];me.prototype.SetterByBindingTypeAndVersioning=[[me.prototype._setValue_direct,me.prototype._setValue_direct_setNeedsUpdate,me.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[me.prototype._setValue_array,me.prototype._setValue_array_setNeedsUpdate,me.prototype._setValue_array_setMatrixWorldNeedsUpdate],[me.prototype._setValue_arrayElement,me.prototype._setValue_arrayElement_setNeedsUpdate,me.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[me.prototype._setValue_fromArray,me.prototype._setValue_fromArray_setNeedsUpdate,me.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var C0=new Float32Array(1);var Hr=class{constructor(t,e,n=0,s=1/0){this.ray=new Vi(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new vs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ya(t,this,n,e),n.sort(ol),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ya(t[s],this,n,e);return n.sort(ol),n}};function ol(i,t){return i.distance-t.distance}function ya(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,a=s.length;r<a;r++)ya(s[r],t,e,!0)}}var Us=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Te(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var Ul={type:"change"},Ca={type:"start"},Dl={type:"end"},Yr=new Vi,Nl=new hn,T0=Math.cos(70*Ye.DEG2RAD),qr=class extends yn{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:di.ROTATE,MIDDLE:di.DOLLY,RIGHT:di.PAN},this.touches={ONE:fi.ROTATE,TWO:fi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(C){C.addEventListener("keydown",et),this._domElementKeyEvents=C},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",et),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Ul),n.update(),r=s.NONE},this.update=(function(){let C=new P,it=new fn().setFromUnitVectors(t.up,new P(0,1,0)),gt=it.clone().invert(),ft=new P,Pt=new fn,Zt=new P,Yt=2*Math.PI;return function(_t=null){let D=n.object.position;C.copy(D).sub(n.target),C.applyQuaternion(it),o.setFromVector3(C),n.autoRotate&&r===s.NONE&&B(v(_t)),n.enableDamping?(o.theta+=c.theta*n.dampingFactor,o.phi+=c.phi*n.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let pt=n.minAzimuthAngle,mt=n.maxAzimuthAngle;isFinite(pt)&&isFinite(mt)&&(pt<-Math.PI?pt+=Yt:pt>Math.PI&&(pt-=Yt),mt<-Math.PI?mt+=Yt:mt>Math.PI&&(mt-=Yt),pt<=mt?o.theta=Math.max(pt,Math.min(mt,o.theta)):o.theta=o.theta>(pt+mt)/2?Math.max(pt,o.theta):Math.min(mt,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&w||n.object.isOrthographicCamera?o.radius=q(o.radius):o.radius=q(o.radius*l),C.setFromSpherical(o),C.applyQuaternion(gt),D.copy(n.target).add(C),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let Ft=!1;if(n.zoomToCursor&&w){let Lt=null;if(n.object.isPerspectiveCamera){let Kt=C.length();Lt=q(Kt*l);let se=Kt-Lt;n.object.position.addScaledVector(A,se),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let Kt=new P(L.x,L.y,0);Kt.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Ft=!0;let se=new P(L.x,L.y,0);se.unproject(n.object),n.object.position.sub(se).add(Kt),n.object.updateMatrixWorld(),Lt=C.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Lt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Lt).add(n.object.position):(Yr.origin.copy(n.object.position),Yr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Yr.direction))<T0?t.lookAt(n.target):(Nl.setFromNormalAndCoplanarPoint(n.object.up,n.target),Yr.intersectPlane(Nl,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Ft=!0);return l=1,w=!1,Ft||ft.distanceToSquared(n.object.position)>a||8*(1-Pt.dot(n.object.quaternion))>a||Zt.distanceToSquared(n.target)>0?(n.dispatchEvent(Ul),ft.copy(n.object.position),Pt.copy(n.object.quaternion),Zt.copy(n.target),!0):!1}})(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Et),n.domElement.removeEventListener("pointerdown",bt),n.domElement.removeEventListener("pointercancel",y),n.domElement.removeEventListener("wheel",st),n.domElement.removeEventListener("pointermove",M),n.domElement.removeEventListener("pointerup",y),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",et),n._domElementKeyEvents=null)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,a=1e-6,o=new Us,c=new Us,l=1,h=new P,u=new at,d=new at,p=new at,g=new at,_=new at,m=new at,f=new at,b=new at,x=new at,A=new P,L=new at,w=!1,T=[],W={};function v(C){return C!==null?2*Math.PI/60*n.autoRotateSpeed*C:2*Math.PI/60/60*n.autoRotateSpeed}function E(C){let it=Math.abs(C)/(100*(window.devicePixelRatio|0));return Math.pow(.95,n.zoomSpeed*it)}function B(C){c.theta-=C}function K(C){c.phi-=C}let ot=(function(){let C=new P;return function(gt,ft){C.setFromMatrixColumn(ft,0),C.multiplyScalar(-gt),h.add(C)}})(),U=(function(){let C=new P;return function(gt,ft){n.screenSpacePanning===!0?C.setFromMatrixColumn(ft,1):(C.setFromMatrixColumn(ft,0),C.crossVectors(n.object.up,C)),C.multiplyScalar(gt),h.add(C)}})(),F=(function(){let C=new P;return function(gt,ft){let Pt=n.domElement;if(n.object.isPerspectiveCamera){let Zt=n.object.position;C.copy(Zt).sub(n.target);let Yt=C.length();Yt*=Math.tan(n.object.fov/2*Math.PI/180),ot(2*gt*Yt/Pt.clientHeight,n.object.matrix),U(2*ft*Yt/Pt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(ot(gt*(n.object.right-n.object.left)/n.object.zoom/Pt.clientWidth,n.object.matrix),U(ft*(n.object.top-n.object.bottom)/n.object.zoom/Pt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function Y(C){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function $(C){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=C:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function J(C,it){if(!n.zoomToCursor)return;w=!0;let gt=n.domElement.getBoundingClientRect(),ft=C-gt.left,Pt=it-gt.top,Zt=gt.width,Yt=gt.height;L.x=ft/Zt*2-1,L.y=-(Pt/Yt)*2+1,A.set(L.x,L.y,1).unproject(n.object).sub(n.object.position).normalize()}function q(C){return Math.max(n.minDistance,Math.min(n.maxDistance,C))}function tt(C){u.set(C.clientX,C.clientY)}function k(C){J(C.clientX,C.clientX),f.set(C.clientX,C.clientY)}function ct(C){g.set(C.clientX,C.clientY)}function H(C){d.set(C.clientX,C.clientY),p.subVectors(d,u).multiplyScalar(n.rotateSpeed);let it=n.domElement;B(2*Math.PI*p.x/it.clientHeight),K(2*Math.PI*p.y/it.clientHeight),u.copy(d),n.update()}function Q(C){b.set(C.clientX,C.clientY),x.subVectors(b,f),x.y>0?Y(E(x.y)):x.y<0&&$(E(x.y)),f.copy(b),n.update()}function xt(C){_.set(C.clientX,C.clientY),m.subVectors(_,g).multiplyScalar(n.panSpeed),F(m.x,m.y),g.copy(_),n.update()}function Tt(C){J(C.clientX,C.clientY),C.deltaY<0?$(E(C.deltaY)):C.deltaY>0&&Y(E(C.deltaY)),n.update()}function yt(C){let it=!1;switch(C.code){case n.keys.UP:C.ctrlKey||C.metaKey||C.shiftKey?K(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):F(0,n.keyPanSpeed),it=!0;break;case n.keys.BOTTOM:C.ctrlKey||C.metaKey||C.shiftKey?K(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):F(0,-n.keyPanSpeed),it=!0;break;case n.keys.LEFT:C.ctrlKey||C.metaKey||C.shiftKey?B(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):F(n.keyPanSpeed,0),it=!0;break;case n.keys.RIGHT:C.ctrlKey||C.metaKey||C.shiftKey?B(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):F(-n.keyPanSpeed,0),it=!0;break}it&&(C.preventDefault(),n.update())}function Nt(C){if(T.length===1)u.set(C.pageX,C.pageY);else{let it=qt(C),gt=.5*(C.pageX+it.x),ft=.5*(C.pageY+it.y);u.set(gt,ft)}}function kt(C){if(T.length===1)g.set(C.pageX,C.pageY);else{let it=qt(C),gt=.5*(C.pageX+it.x),ft=.5*(C.pageY+it.y);g.set(gt,ft)}}function At(C){let it=qt(C),gt=C.pageX-it.x,ft=C.pageY-it.y,Pt=Math.sqrt(gt*gt+ft*ft);f.set(0,Pt)}function Bt(C){n.enableZoom&&At(C),n.enablePan&&kt(C)}function I(C){n.enableZoom&&At(C),n.enableRotate&&Nt(C)}function ht(C){if(T.length==1)d.set(C.pageX,C.pageY);else{let gt=qt(C),ft=.5*(C.pageX+gt.x),Pt=.5*(C.pageY+gt.y);d.set(ft,Pt)}p.subVectors(d,u).multiplyScalar(n.rotateSpeed);let it=n.domElement;B(2*Math.PI*p.x/it.clientHeight),K(2*Math.PI*p.y/it.clientHeight),u.copy(d)}function Z(C){if(T.length===1)_.set(C.pageX,C.pageY);else{let it=qt(C),gt=.5*(C.pageX+it.x),ft=.5*(C.pageY+it.y);_.set(gt,ft)}m.subVectors(_,g).multiplyScalar(n.panSpeed),F(m.x,m.y),g.copy(_)}function ut(C){let it=qt(C),gt=C.pageX-it.x,ft=C.pageY-it.y,Pt=Math.sqrt(gt*gt+ft*ft);b.set(0,Pt),x.set(0,Math.pow(b.y/f.y,n.zoomSpeed)),Y(x.y),f.copy(b);let Zt=(C.pageX+it.x)*.5,Yt=(C.pageY+it.y)*.5;J(Zt,Yt)}function j(C){n.enableZoom&&ut(C),n.enablePan&&Z(C)}function wt(C){n.enableZoom&&ut(C),n.enableRotate&&ht(C)}function bt(C){n.enabled!==!1&&(T.length===0&&(n.domElement.setPointerCapture(C.pointerId),n.domElement.addEventListener("pointermove",M),n.domElement.addEventListener("pointerup",y)),Ot(C),C.pointerType==="touch"?Ct(C):N(C))}function M(C){n.enabled!==!1&&(C.pointerType==="touch"?vt(C):rt(C))}function y(C){Xt(C),T.length===0&&(n.domElement.releasePointerCapture(C.pointerId),n.domElement.removeEventListener("pointermove",M),n.domElement.removeEventListener("pointerup",y)),n.dispatchEvent(Dl),r=s.NONE}function N(C){let it;switch(C.button){case 0:it=n.mouseButtons.LEFT;break;case 1:it=n.mouseButtons.MIDDLE;break;case 2:it=n.mouseButtons.RIGHT;break;default:it=-1}switch(it){case di.DOLLY:if(n.enableZoom===!1)return;k(C),r=s.DOLLY;break;case di.ROTATE:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enablePan===!1)return;ct(C),r=s.PAN}else{if(n.enableRotate===!1)return;tt(C),r=s.ROTATE}break;case di.PAN:if(C.ctrlKey||C.metaKey||C.shiftKey){if(n.enableRotate===!1)return;tt(C),r=s.ROTATE}else{if(n.enablePan===!1)return;ct(C),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ca)}function rt(C){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;H(C);break;case s.DOLLY:if(n.enableZoom===!1)return;Q(C);break;case s.PAN:if(n.enablePan===!1)return;xt(C);break}}function st(C){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(C.preventDefault(),n.dispatchEvent(Ca),Tt(C),n.dispatchEvent(Dl))}function et(C){n.enabled===!1||n.enablePan===!1||yt(C)}function Ct(C){switch(nt(C),T.length){case 1:switch(n.touches.ONE){case fi.ROTATE:if(n.enableRotate===!1)return;Nt(C),r=s.TOUCH_ROTATE;break;case fi.PAN:if(n.enablePan===!1)return;kt(C),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case fi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Bt(C),r=s.TOUCH_DOLLY_PAN;break;case fi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;I(C),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ca)}function vt(C){switch(nt(C),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;ht(C),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Z(C),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;j(C),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;wt(C),n.update();break;default:r=s.NONE}}function Et(C){n.enabled!==!1&&C.preventDefault()}function Ot(C){T.push(C.pointerId)}function Xt(C){delete W[C.pointerId];for(let it=0;it<T.length;it++)if(T[it]==C.pointerId){T.splice(it,1);return}}function nt(C){let it=W[C.pointerId];it===void 0&&(it=new at,W[C.pointerId]=it),it.set(C.pageX,C.pageY)}function qt(C){let it=C.pointerId===T[0]?T[1]:T[0];return W[it]}n.domElement.addEventListener("contextmenu",Et),n.domElement.addEventListener("pointerdown",bt),n.domElement.addEventListener("pointercancel",y),n.domElement.addEventListener("wheel",st,{passive:!1}),this.update()}};var Zr=class extends qi{constructor(t=null){super();let e=new Dn;e.deleteAttribute("uv");let n=new pn({side:Fe}),s=new pn,r=5;t!==null&&t._useLegacyLights===!1&&(r=900);let a=new kr(16777215,r,28,2);a.position.set(.418,16.199,.3),this.add(a);let o=new le(e,n);o.position.set(-.757,13.219,.717),o.scale.set(31.713,28.305,28.591),this.add(o);let c=new le(e,s);c.position.set(-10.906,2.009,1.846),c.rotation.set(0,-.195,0),c.scale.set(2.328,7.905,4.651),this.add(c);let l=new le(e,s);l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),this.add(l);let h=new le(e,s);h.position.set(6.167,.857,7.803),h.rotation.set(0,.561,0),h.scale.set(3.927,6.285,3.687),this.add(h);let u=new le(e,s);u.position.set(-2.017,.018,6.124),u.rotation.set(0,.333,0),u.scale.set(2.002,4.566,2.064),this.add(u);let d=new le(e,s);d.position.set(2.291,-.756,-2.621),d.rotation.set(0,-.286,0),d.scale.set(1.546,1.552,1.496),this.add(d);let p=new le(e,s);p.position.set(-2.193,-.369,-5.547),p.rotation.set(0,.516,0),p.scale.set(3.875,3.487,2.986),this.add(p);let g=new le(e,$i(50));g.position.set(-16.116,14.37,8.208),g.scale.set(.1,2.428,2.739),this.add(g);let _=new le(e,$i(50));_.position.set(-16.109,18.021,-8.207),_.scale.set(.1,2.425,2.751),this.add(_);let m=new le(e,$i(17));m.position.set(14.904,12.198,-1.832),m.scale.set(.15,4.265,6.331),this.add(m);let f=new le(e,$i(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);let b=new le(e,$i(20));b.position.set(3.235,11.486,-12.541),b.scale.set(2.5,2,.1),this.add(b);let x=new le(e,$i(100));x.position.set(0,20,0),x.scale.set(1,.1,1),this.add(x)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function $i(i){let t=new Gi;return t.color.setScalar(i),t}var Ol={skin:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAB7CAIAAAAjRZPfAAATxElEQVR42t1dbXrbTI6sAluZ3evtCfZIe94RG7U/AHQ3ZdmvbYmyM548GSdvLJHFAhofBYj/97//g2d/SYLiy+P/IOEXfrF+J7n+8YEve9ll//avJ12lnXNtBAkul8nfjOpycQ9fZjvraStgBUAB1O+z+Wnvz3xVO/FqeXzov5SkxJO855kMDfgUGOo3knSh53Ofs51/3fzFJH0yPc9kKEBSv5Okp9HzJWHT7yXp8+l5LkN/KUnPpOeLAvtfRNLJx6elRi9l6O/1pKc9U3vhDfw0Sc+n5ysY+htJyv8Ahv44SW8KS6cZfntV+eGXkPSUUOmHGPqDJD05VPoBhv4Okp5Oz5cz9EdI+kJ6BkPHu+g/mqSvoCeAtp550itgBQFxPkLyxI7Ta+kJoJlZtNUkkNJ6q/85JH0RPQG0tm0SJHdpMFTiuVR9DUlfTk8A7c/lIqm7u3v8Lok8EdMXkfQlieYdQP/1549Lvfe9d/begeRqmr/OPe6H1z7vrV6bkQWgvu9mxmucUHR3z1sVdYJLTZKOlijAeCv93fQE0C6Xi+RmZruRV5Lc956guiCe51LHvabFn/AufDlD27ZJxvwCaUbu3PcOOM5zqZOkEFie9Clv8qo6yLthU0BWmNpA9xUudRpkuBbiaYb/ulDpNrAnKRlAgkaudD3VpQZJwTibKIB4+Lz/iVDpCGg9STMmTwdZ47tTXWowkstxj6eQ9GfoCaAtOiQRBlN4HySu+6kulUC+3Djyg6Tfe3lWwYU/Jvlr83GKIoygjADZ0qee61IDUpYHRfiAByyfPyuibLfWB5Iwe7lLDRup1Pe7hv+GmfxBQAvTuKzXulQeRWZh+F/CdIHyx+yd9yr2L3epZeYQMU3+a5jyzXGkF9KTa/jX3j0hX+dS8xlCGYorw9FPYsp5U1z/rBfimCkEwfYPAc1LXGqaORlF2cnZuNqP0nzeSrr5KkrmOx9cIsj2j0Hia1xqxaMT04JUVTrBsWZ66ErNW4ROs/RbSlZmaUZaJZjt02r501wqZ8FZS/69klSY2dS0gVlI4huf/FwHeo+SRqOZ2bbZ+PoEoK90qWSlnvcj8+EBwHeiTp6A431KJpSb2bZtW4H6OUBPdqmcljutPY/8fNf6VZ506SVyxknFbC2sP4+SgeI24NzM+CVAX+BSBytFHcgRqBZ/tR77uq178pFawBcomTButtlms0L3VeXISS6V5Q+5Yjv+GEgKYgAKVWo6jv+lDqLvVgG+QMlt/PXq9gCwfbOO8yyXyoVeHMd7waN0BYFp2nMMjgbCx5BKpSz4glF8m5K23Ozy7NtDZbeHXSqPBGFiyiVSP5xBBzRzLBfDy2ak8Kme9FMoeRuyPSYW+6xLhbs+dKkTTRs/ecD0UNRHknQMPMsFCZ5z0B+z8/mU5DPVdx+51NGeYu+9l0vNVuc9zc+gSQI7iSku3xZPBUkuT5mGR9/0Nvw/n5LPljO+41KNNFo4gT1cKtOlDlhv88U8h2iWh9IaUXGNA8LwHTIEM8HEU1ir07yh5RmUPEcfes+lxpPdSCPN2Hfu7O5yucdJvVxgpsJp7bPWkFittbk3eTzznaNFNQikpdCK8yh5muD24FIxTNeIzbDv2Enr7N67s7tLsyxfx9BEMysNd+9FB2KTokiKwuoolqiUBdEplDxTwbyMycd9GLkBbmzkbtw69869++50z/UZcck2z7Ri66QqZxI/AqSK3o2EQU4YoQydVPXVbIuPZPsESp4sCS+XCookRMBENGLbuHVeu21739z37h47SQBCjFDBUhZgh4CBpS+pQx2ZpwqQRWRldBg0iU8wvY1Z5IZJxfrfkyj5so0OOTBPMxIymGMzmPlmtO6beR9nVFguaRHNDs3FqI6RAaW7Cy5XdZ4hMV/GuHjmpHyiuW20+t22oKSNR/YYJV+2gCDN3xYHkHZN0KwHoKlK1XCZI7wPOMIwaZTk3XuHT7uXYBF7qnSt+TLpvuMljGbcNpjRDM+m5CunQPKojasXCOMGChvpRloBysrMM6mPIN+YB3HbjCaps1Pq7rKsTIGMECytvEIFq9CCJDeDmcxAy8c1woe/fazGQBkNEEwQIafgcbooqyhMtpLcjG2zbTPSMpI3yphutDKpEkFnbGRINK2ciIwyE03HSt9fNad0zIUO8u/MMuEGc8AYifgS4SvPk/KkZvTokJAZy8963Qxkk5sLQ+OdRHpFtjq5F9qgH5hbTQ5m41hrKXQkr6Oslwe+bi2VGCUYYrzmiOHX8IBLoH9TbXk6oDpJSD8bQXonvSYzUZyZYiU6Wu3yLQAzkeKST2GprPDoIBURaj47nUmidupQi6qAGbczSTpCdR67xcMnFqIa8WeWPyfEsy5FLGnVYQdfPKS6jKojnmry7jrNtOVVbrPgKVUtHx4y9Gp4lv0PJKOiBCtEaythFE9steslQKiYKkQTkEAXndRIuc4DtPd+5nxQldgpQqz46MCmCNFtaEYGjFh2PEJCxayz9hLZzjoHOBvNVXN2wsFOerL1ZIb2vZ95/siIDRJkETIexCvMfMdGcUmS4B7sUuFoXuQcBhvJTgRHRUVInE9BkBxwoIMdjO91tslf9/0sNAkCGxBoGlRhNUGjlSOs4tKotauaxwDkkmVbauSVdeCzws2wcYdXN88FuVwOudDBHehCYHqqG237GQzljI0EGLRRXoCSRhMxEsGj5ngkkhUxZsDEQyV6yEPCkUICTHCBkkuunrUXB3ZhB3ahazZMT4K17Wf4UMYoPo3jrA4fmumiKcogSx2eHLfI5XVGbA9ARpHKEd/4dXhLkQKKnTm/2oGu+KXu6AnoWdFN6+5Pn/6bRcwIhKg4bSgRMCNAM42eL7k21jVc7Eh4bGMeVxshuIsA04JtxpwV9zpQu4rh+Tvc1aWsw9a59Uvj0Duxd52no/cT5wFH1q76Y3qHCjQJEIZxjFvohgIuOmEcrRHCCU+PoOL/SCdCy4elfa3lK/ONJ+8IaHrSQOoaP87zhZiahEUFoqM2ScMzjGKRYMhjPAAl4BDc5MM7LLhNt5211UBTdS1LVXDtjGrIJ1ZQ9aPFEeFOC61SSWkOHS/50NIdviezG33o7F1wswQ+v48uPMNn3mDKJaufk49Rmd0oGOmgIc6rpa3yHA/wteLIxIt3pe3Hv1y68OTE/r2ZAo10J1PQg/ohjNxID6JpDQLu6/Bu2gdRY4WTJkqMWj+Uwek6D/0AtO2TEyi8x8fPfB9o6na87UOpbCrsZ17JZdpwCEt0axBL3sA3xkta7QGKDNQEJ11itgszSVUJJr4Ha/scju/T8Gu1sNuu+ndKaXz3bW/SynWxwZBHWyYOjE6BCU640w8fYjBh/eqZ3T49qXKn/cL3H6GWItuEoKZdxDXnrpvWcShkAWhWjd4m4xqJ+0jhpbcC0iE9Y+pcDrBSrvuw5jSavsBQu4emPmblP7CTByF8NJRvddyJTrV9j6K8BUoNTYRjxgeaOdQoyqXUSYuIbGChdV1MuQ7hLawpGPg2rA1mH5qXPij06hOmKXI0NjI+mWVnKbJFXx7rCIpIByh4/CNk/uMp4VtFThLdHd3l3burD2SrkKfb6vSsCLyBNXnq/h1Ym7btLdl0FBByoit8Y8aaq3EKhJhFCkTpQ4CXDmfq7QGgRzs+/rnLpb4kqMxrkhzu6t337vvee/exNqnCkjmfVb5I1ZPN8TJV7GoBKG9gXYZ83oe1oTW8xW6tkz0S6LIKdBzVtxQ1elyUK9qcZkMeF46AlVaFVJEIi/bwj7WkqILz7urue/fr7nv3HqI0DdRZ9egZg6Fef+w5YvkWSYnpgDV9COdn7/B+gNVQDL1VYj1lI14VMMTQHPk0dSA0eHBZ6SHBGUstTY9x0CgfR6b7oVZGlEF697773vvevQf0JW+iwciNG0OTM0bEtJxiWPTQC09lPrzqwb1W+4E4EPZdH/qsvR/BNRCJpmeaoxB3RqUz732pG1VKmFXiutGRxlqJQrNmmt7TvXvv3qPInxVuGghu3Jq1toUUZ4zpLUroKrmq/trHB0KVClPuimVhK7ILWmpnTkcuZdFqrCkVZFN2L3FMI2SBY0wgaARFs1PHCqy4xJ7jXHfJBY+jDKHqM9pmW9vapbVL6FBqSHe89Dx+BltVBcD6zx5o9gDX/UjYeBhsdxv/fEY57zYqIG+Dw8rr7zh4VuHe52F+PJyP0fyhaKzcspES221rl3a5tMuf1i4hY2RV+euf+w09MQTnSyTmSiBjp11g2pOyier9TOl56wQeflKHTOf9/USVGWiGRqTZtm2ttdYu7fKnXf5srW220ew4V4LpQzFqpbd+YHA2MZ2E7Z7STNdJyhFVRiUds/p7b6b3v1n6zLojfODh9XVbrQo0L5fLn8vlz6X9aa1tWxv05ELrOliGBY0AdjiB6hm60uIluXfJ03lnANLO2t2nec86thp1N0+YmWPlVbyx/2y0L1lrLDyt7gqmZsxAmG1bcPPSLpcWx1F6z7U3tTgocvEpK8SavmSTLeRtcUAVnoIaz9u9ClDrJJyGTWrULXTrCYeJRy9/BEdVsdCS9g89iBbZVMASSsi2tda2QUwbiar4jw6OI96dipYUEWt+MKQd8AXUtjN3IIzWPLXQUFnsUKbWhwNHN1svxr4HTRtcCu0SXNn2qGJqKHqzfZIeU5kY8JOyUL2H9OFcnSMAYwKjXYwny+1oSN3nwdVnuFRFijI1Hxrkg9CuSD1+NiPryLSopVA/xkZZIa27S3B+caWT8FnN5lLdaf9qp2puK+N0h+gp75C7IE3pbTqDLCtXP2CWVZatwqPDFyOkFoVL0UQfpZVSPngIjZzOFywjEQC0//5zOenlK89xyUV4TzfoSZkYprVO0XKWQ0vpdCgcRnQ0DyvFBn7PdhItppTG0aTYgowOwHui+RohbPuv5wM6JYju7kTv6hPlDIylqi8ZXbbmoLUL602dRvfWiizVuCXrQWdeANlH4+kFC8nbn7adQc6kSFpmWHVlIxUXY3TeTPTsgYYNc9bpV2HoYUeT5kFf578qjxEIl4kWpdaSr+gVG27tWe5jsEBAD52Wd++99x7ZGlS/3D0AJelu3d3cR9fch05vJpJjIclSINahFOXynm8YpTszp22M+Y9arKeTFCPLQlY+70AfuYW7e+993/e+773vcoc7vEPOhDUiGQalGJ6OFMzMZ81yBgZzfmmAqnLR8SKZYvfuWeE3mmzbSMVMzdJ4OgvT9hQ4NbUckqsHltfrfr3ufffeIcEd7pSzpF7ScKqBA6tSkQf8WvYZSXrWiOsJeg6EzYpFvGS0LUwCkByFvWCBW3uu53T33vd936/X63699v3qvcNLLxuY1nzmKCSN+EaSmSZiS5lnDIgcZlzjv3bve+/ZSMKoIEHdK3c0NBpQeufDRr2netb2xEN9mPl+vfZAc98nmgGohsx+ljWSU2XCNvh5KFXOGfAxMZeNprByDxqz9uPnkT+u0rAdMF0m/Z6IaXsimt5736/7fu37gqaXu5zgLAuWailL1L5cMGY8tXrkKftaNM+c/Q+fPbmcj881epkmYX561MR0lFueiml7zMgnv4Kc/br367Vf97R0dw40l9L2IaIc7V4X6Xg70D06Slx2k4zNmIJG9Vyl4DFj7ozyaFX38p5nY9oeGzxcjpR979frfr36vqvvGK5zyd99qohuVGVxJ46YVbwJaDFbjXditaV9MfS7A1MUT+Hd60dOxbQ9lAkdHOe+X6++X33f5T1EbWO5mnRsv2AM2g3h67K6QFVKWRueY4ZR1Zdefv6Ad6AJWKgi6jFSHefbfnssryxL3/dwmoFmzhVpjBytaC4Zy83a1VVHqrsFn1RwvUlNj/rJIQgwo6KaV0+/z39+Eqbte04ziZloXgPTiAYHmpXsTWP3DIDeyio+r/P5QK+3fJRQ1lUsyibZQhcE9w5gPw/T9i2nKffuRcxEM1RFh65Wjm2t9FzVW3fBWjr038h+j/taQy5ioiwDCgknY9q+7TSPaKYMYJ7hKtnNavLQ2Z8jqMOsTS7NYUwxuVfH7URM2yNOM82897EzbUk+bk729TB6QZ13XUdGmiGdaR36immi52Pavu00Q+UWKGOJLj8w9lcuOzjuFaPMFhG9wp06AD0Z0/a407xBc0luXmrsH0oqjblAyrAqR3Po7ZmYtged5rEWVvVJ/Iyxf/ApI7DQ0kpGeJa1qIL0eZi2R53msbP6G4z9na18pBGw+kTBmrzPsszTMG2PO03gdxr72+WhBoJWYsj50bDPxLQ96DSPP/3LjP2t9C9XD0LUIr+Cnodpe8xp/nJjv7NKB7Q8nYqkZZrPwbQ94jR/u7HzzgptErEz1sOZ0kYReqmdfh/TprWo+RWn+XcY+xHTFHtVmh9qCTgXniqyqG9j2g460i84zb/I2O99PquBVXcVQF+6UZWZfg/T5r0HoF9ymn/Dyf6u4S/ONIe/5xryuvZ/wHROOd3eZev7nl3HvX/Saf4tJ/tHzpSgAf7mgCLfx5Q3fdNE9PjJI22//nt4z885zVtj119h7LwVjasOqAz1q3SytmUOmBJLL5olrrzFtO3//vc43L1G+v4RzSUPiDGWwyTF73Sf9yLTnG2YF5yakzlel5iysyOxnKoArmLswdCrSiceUySfk6osH8ExpB2/+DB6x5mOlVoG5kduz30khancvRZvKRaicFYHb33oOJQClk8Kf3QQ1M5KvH45Nd+LTKOR/86qQUHIGfPYqGFHKeDhpv8fh7PbvThRLSwAAAAASUVORK5CYII=",badge:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAMCAIAAAAGWbGvAAACaklEQVR42gXBW27bRhQA0HvnzREpSxWcV53mp/vqHrK2bCZAkaAoKruSTYqkZjjPOzkHv339S1MVvmIizLW2GgQt2aGRiKxDLolnX6hhkzq0dk9hMJ2q8Gj3HeOEbHSbyM9vGTAXqkyFhqR1dzqg0Y2jaHUZ57j6h9OxOz6sjN0pEtWrc3Qel6v7onsV0mdjBQslApsq8YM1795Xo4vWBM359XF4KJ6mcTHaKGvXEjwoEKyzvTHD8v1HaMVKjH4WSFgYvvi76PuTlk2p1hBq3R9OjSoxFmvdtqBi5EiSWi4QSy0uXt39cJDEm1UkoABonlDMYUvTyLru1O93xmzLfB3fNFSlRW3Ru6Uxtm5bE7vow3Z5UVyKwd6mtwbAlNAUW6bKpOCa90YNWoCf0+2VpaXTCBiX9TZPE6vlaHcxuFRiiNlvm5s3AZqDEoSYWtFKqcN+P+yM1rqUy/PlOHTd8F5asS4TY8JqI4FJJv749PQ23WTMseZUa2u4bHdxp61pRqUMO90ryamNz5ey+tt6XyX//c8nF3JnRCkwXl/HZRmePv/28V3H4eflBQAKZdZIaGtGf++l/nQ4riGezy/hMqtCFDcUmLB471iDujgZ2q6y/3/8RCTCmuMGSmshuVKixqwrspwuf/9zXVbnXA/K2q4JagxCXI0SCoileOQdGUapuvN/ueUdZQuIMULJAlK1UvObf/33DEqeuh5S2ZY5BCc6HuYEvMXaTEVOMucsO5tbYUBDYxbJcs4ZCokMiCnGIactp5xix+XDznz58Ljf97bX1hohsLe2bplCXaab835ab+G+8pKpgZD8Fyr5pinMSkKuAAAAAElFTkSuQmCC",stock:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATwAAABRCAIAAADAeo1hAAAeHElEQVR42u1dbWLjPM4jNHPF9x7vTfbCO8b+sCSClOTYaZJ+JTvbmSdtE0cWRBIESfzn///P7n1g/588SilAQfFn+o8dPRi/7M+RRiO5cRseJDcy/Px+RUC/tvTy/V/775FmbI/6ZmYwmlkBAAMMZoCZ0frv1N/Xl4W/rLwm/TPY5Jr6hfTv+JLVNd2fpv5me+/2hvXa+1/7s/3VClAKSil/SikFf0qpN2d/yXaN+29v7dU2f732j/AmHK/dlx6QxYYv1noPnd1pskJlf/ypX/Ztt98zyK2un2DLW4jbFm7SuI++9qPYt33g5jN4+TXxxDM3Lw/r/8KFZcHsl/CkBcK9cDz/6vp5UHFcwTxddT9iadQ/DdLfdud/Y9AebB3UIx968F/d9A9GPZZPI7gI1aIsQHfHuyE7Ia86zvCgd4I6dugmFW2d/EZDEFstrfo+7N5bRy35Bu1XgCyik3bTN/+Y47Y2rJxsCHSULoINNGzt/rnuxXuWolmi9qL2XEMLPM/MoodjEpA5iM0MoCC2gnXbNnKrPr+GQt/X0FrBYI2+K2QxQ+w9GwjXjMX9IVE7TpD/U5B7xT+eArwyCm678TCPYeIOZPcGH3xDyJL0iBY7aVKcNUE+K3eUVvZj47ZxU9wamRiCb2ZpoRzIJzx4Jv4770NhYtBwHUh3fxQeeoqN4Erbul9wvw+disIdF+WUkKC/UTkPc1vT8kJdnYca3B7ENsAWKNep3JcituG2M5ebY9Yesuk+zdKWQPTiG5ldzMxsP9yhex24ywSe23b8MPUkkDVFKe46QjpkO/rzp8IT7gPkqPjY0Rfv6u4PW7SzxWHr9zYjdueMubnNVczy+/rHO19e2nLUiOH1vCs/sGEUm1ig9sSei0CFZS/v3PUzbAcuMDtndvv7OsuSGaQLlikiGHiCCbzGYt/rGCfAwndr+FA755QRy+0IsfymoG0PCe0N9vUtLpJZFK7lQ9yrGmdkz++sn885kzI15pLfrFbFUefO7Mz5vLnrkZzvGKQ/koeSdYI9Lv3TQuTkGPesbD9YU1bWEbv9NMSa2d/ypxgTLb7tnwzgF/chMKOiOvcBGg37X4bDRD+aiGGgQfu3rlLHBxfMw1xV34swrBL/RxcVc1bB4wbs4V4U5lEtL63cece4Y7bdI6qmpTFPPxixZvb3T/lTMbvVT21Weg7rq+MWoy8VjSwnwLxxx3CFaeWp7yCqwvIVqJnqxgqoG/8SP93dDiVVoTE/Lp5EdyTG0AVR7cvjHGMJZusP9mTs70Cswf6WUpoEjhu3YmXbNjUYX9/eWiZA0DYK920TjOzSCsDAYC78FckTRpeHNlQuk1UxacQE1ugUEuv7VfjSeNL0Q17HMLjnOPI17l//dMzxY68ojjGmjrGQTz8ZsZi6xwJaa5/vLG7xBaioQfID3YS3zWr7PgJz1Ww2L21orhI+0AQyDAR1V0NkAwK6RHLeYbNsnqSFGYF7CVQ9T3KqB00vHS72wpVPHOOSHeP2hj8VsbdUfH9RsG8hFhptM+4iqY2bbc+3tzzY6+fApvxqdEMdGji5j4Jzed95w2GdYFlnwIXComdo9gtg85Jp6m+eE2CqiR2StI/ZWMwxxIfJy1uO8ZR8+hmIvc3sQ0C730ia0cpWrGzctY2bbeXJuOU9cI1HvReX4EiFsG/9CoAxpAQndFaCzA17sVwaDIkp8dH7GyPAtp49jYaC+8anjjAhnkTIiJzi4kMQlk7NcIPusubRMUaQUgzqYkfsdiMfy28HVNjiNPwLITysWNnKVjZYKU/F7U248oyd3S89n/SdaeHuh+LsyQALySPDkuy95upDOW2YZd/YKShIprkFwDCQdDr8JgGe+LgXJd5jcMKHOcYlyp+cfKKR3xCx9wJVhWx/e5CluLWybYZixTbbkOJb+yhws46s25OLgkPP7cBzkjOOFidpEUTLeDGgPbJGisLoYHqRmcTmFQGsQHWDdSOXEm/5oEzF/CD6yCfETGcMRj7hBIt82zGGMOns6Y5vgdiPAHUmYvurtecdzcWKwbayFSsDL0U4BXodsOTk3ztucc/uQS6Ulm+FiPYgCRQTtY16xc0g+KwBB4IpcuOP7BMqynYfiAkB8Sg6swHQX/thnvHCT5Zj1E75N7jtGGtrgJCR/eKIvROo6mjl2qn+g3+z2ewmq2B3lae4vaQu3fMVgXDyxg6Zh9L8otcsH5/1CPUyYkp6bNXjq+HQ79FlUlU9gvt2PWUu9xzd2QDWSkTRfQSF+iktlANAJczP8JMx21eXDoYjx7hqa3sTj6+M2EcDFdM1Nvu7bVuoMlboeoiLIX/Li1saCbHs7VF6fpM4T9vCvcvAGyOSVWNyc3TVonDZ1NUO6L+J0ol40cZS3ybUEi7NQqlVZs92k1vD2ht81FB0IOfGQb7nGsQ0U+UmEhg5hzPB7Q2NcegI8AUR+yqgBiLq3/avO2/EcCZHV1lxu+Pt5NE9Q+ym3ZSa3ygVaUeRGz30zPKB/ot0apiTqGrqNGvFQdf1HFOgPbzgqq499qYIbPBQ7Koe+h6J3MEgqOrYa/HwOCXF4mSqqW2eU23gyDHOhXeeku2Q/TzEvhioOe9gf//9++c9s9zXDPXZ1VXGVorjlpy9/Ambq7LuBNpKDxYhZjgtlfFAz9LlJmvS0RqfmQA3fmLH1xkV7XHyNDDHNtViialNnSZoOHFyzPpjafZaT8KHN6tALGa4kudZOcae44kp2c9D7KcBFTNL+++f9rnzBwcDVmBb/XqHsZVOhTkLvh8AMKvql61okoLTAjeGutPRPRbns0aDSIGu0kIaHkv7EsH4gDXegq9W5rSjkGL2QWmk4kGtWN0WhZ8QLnrWWmV+uXrNHiVgxLgfMaSedlVoXPzJTs0dPTsDpdRTSMm+CrFfCagRtP/958tW4hcgFsB5nLvjthtbpPLTEMwmxLJ3ReUuYulkE1BAWAGsFHj/Kk5CaIRodtLeoXr7pHrJwdZpSOnla4hBs53I1c7KZ6HUMYTbzls4RJ4jAS5WC2u6i5M+MBOr/fFagZnjAZv1RTzJH2fHOCifbJaSfTJivypQc0zrJzT3LwWFgWtHOl0nxnVxolfUsjWw3Fv27G17NgftHuiBQDHbLTpSUS/XwRsSKTJYPJHoVxSgpZiEqoJuoMqM3fD0GD2BaMyhOzJ53G7h/QfgSog7JArSw02qTREFjHhUOAsE3xghC714D8QuzxPHOOd3Brr4OYj9DkANoN3+bdrlblcig83eluAqJ79vsafZy1cIbz/binY3MvSNbpZ2Z8GwtTco4jWSIfeDnr5JbrF2AyTF2CKIFAS9vSjIpfrey/vOXI967PDunrucmIiJcd/8AVlRNHX8jkEGrL2l/BjQ0J+4T7G0IMOjCOtM8XLoZBe9YiniQYfsUxD73YAaQctt38H7AlZby2ZvWY/AoIXrprfZ0XqjhjI1tBtIs9DonQ2x+01o+v7m0hFWRGwAtn7Tzk8CoTpmkPnTUtxahY37ZVdMW2eovI5NfVnyuKCPh1VD7hw7hdsD6P2SvIZOW4Rm9xL1Wrh6a7RoAHFUgYWvk1e+u0bDfLkQ6qNwQoIqmajEGHvCyhJd/AjEfmegBtC2WRJAUxc3T9ntLQuEVjYp0q6inXRVTPbMPZzoGPeboCrJzW0dCrSBifBFzNlZTApXuzgBzfajkUC0rtxkx1RgodqB5Mid075MiK56aGefhBPejzfN/AQj2z8HovJCHfD1FfjgjAkMlrv0gwWR0KapWNXRenkEGLqiKmadL0YLOh6B2J8C1ARaC1tzx6BDt+K36HZo+2Ryl8jgHTUNUgtmxSnuA3nS4nPbyg5dcxBJaxHktkux2yADutVJNqAeMN1B8M3O3SEXBqSCfq+SSJ5orxgKQiWID5CJJanLCGeA92Dw1lyQAnla9Bj2J6RWSSuFELrhylwg+VDnxIVLxquFG2pmlYY8qTE2TDhjP5yrX7VtOTl4DrE/EagBtL7NVYEQoQv9FxD8vdEn7vLkusH8yKQ6xmwzn8Z138ywbXpbDbm/WUBrVq13U18lCoLbPenZdn80GHCTu0uQ0JRayquB9R2QLDa1IiC0v4frDrzYV3pjQPgvXEnQuCxsv/7cEFiMvGnS8yNmVuvwBuZ4jMVTBJ3HBeT6nUQ+HSL2woSibw/UqaUdp5xxp02iw2UTzyuoibuPCPZi7tZzq6E1jy0bCoCaFd/0NBdtj7R3SCvniGl5IlUiJT+2G3dofZzFQNibwmCQQ06zt6FYJ2oT5cc9rZrG5fU3qgcp2C6Mbn57fXA/CjRpN4zNyLDKfZxuSpcGAyoF6frynNYxz3QfgwuPLHFln44YEbvuiPeTgbqwtN5chaE4RsArO8xKyCoyJD8qyYLK9nhhhg5VYf8dFQh3D5e7xqKSyCU348dkHdk/A43Wrb0D0yNc77uk/hpN/LyYqK12laKMVKY0S513oxl1PaScGMjA1uQVk+a5+fnhUmDaBwBhtmVoWDjG/J1GR8SB1DoxdbSqK6oHYTgSIM1ChldOKzOBrObPWigriLUZYn8VUCeWtgenZrmcre3tHbeWmiNjUnYX+2PDTa2A1eeWhePBawuajdmAUmhb9dGtoESO1/0E38ZOjTkmaa5o7JkoxSWx0EpICgg9bmWNeD3DxeY7x3mzdZX2y9uCNNKCmkBS0yHfuy+E5904jhlykriM1nalXsSs4Kgdtk501CYaetni/MemGIyt8PLrClUeHWPtRuF7RRBLnnKHfzBQR/Y4HcKK3MQyVehARX+5yAUh4qEL0Yybkb2KXnlRTFORNcW7wbD3rgI2sGDs/O3o1MAx3R+qh2lB2czFzDuG2LHLgGNbRWoGdqiwUxyWKKaeudC5Sw1ZcVuqqQdnSn1vXFhMm7PgHM8kB8v+hjXqrh8Mk59WiqMhutX/tuO/Enn9xWwkt/uZS5G5NsSaIpa/GaiHoF3d30a87qEUNKxRjkNcP+3GUOf5Gruhmsnz3Cv0clLb7YwZN0PZe0U6c9QxFBmWdSKAXZ8FP0qYK+vIMDV+3psbnbl1Yx3srGejaGnmu7Vl7MNYZAzIED2mQnNy1ualnaFBBYjlgYjUbaKzdIZiJNAHQoY+tIgXpYcNbD/TfUU67KsGTMmn2HA896MIw+3eQB1Au2398nda1CJZmpROPXbcyCLYmdTGyGmtrir6La1Ej1hJkx5rcEttHbdKWRokl6luwoK0NOHKfFRpf8aSCU5O2Ww2c0IFiFE0ht6xak9qsxntHkUU2fsIgiK3cNXMtrz4qhIYUA+nZa24oKRjjeP4c3sozdYcjBj7NCPull760emDdPQk2i12RKDMtZPk9Ozifx1QJ+KKIJBofA4Yw0WPGFlouw6imOgTmNIQKotvQSxYqo9HmEgORga2WZjS5MuCPbQLDq2CSVsJoIWbdjfMRdEZrjZvr9gqELTYbsZhToevU6lt392SnOyxSVtmo3JjzSWfjAJMk26ri7t2ouj+AeG+axeIsWVu2M+PThHSJrWQjadSNpuecYPOKMnkk1STWP9jZ4A65B1/LlCP3GNaFB+0W0S3o4TZ1ibb0qWyXgXdA8iwiXTnW6eFeiC0Ihn2W8zOaPXy8L7LObaHsmkmSETQ/f+JltRq/eRwi3iCTfi5mJ1MFZ5owx2pXoBE/05Gj+V/Qgc5J74IZqinGsXv9Tg/h/SBX3IWCdm77epPYkEGSfKw/W48mcTa6riTOEcqGVisJpn9NqAO7HG2dpE6tqgj8p/oraLoengLuO17sZsIb0CsXvVhozgE1hRCETUrINJBO9EHkj0bOLHxsx7GzdVny3rAmvQCyL+gJoSKbGrzmrGrR6a9MyHHsfJnQs9oNpOh93BFDGchQ7ytCOU4VT2i7tcQSKTfggTCqYvHWCDILoA6Ukv+eqBG0Jp2BoRptdrB3Lcgi6tOFvQ7ZGKE+pALVIsRjn1OzWIko30npl/SmtkbvcR7TZEkiS/dZP9ccMMDKcu/0bWBs4OkOx+LUyQ6tAe9fNJflDlEMrRAI5h5HVEwvyohlQ59kDcPu4LjvchyGOpsCcablGRvc+/41wE1iSsGQ8CwGhShuyTfUPmcqDKSbQ3jVODOVRsEJWKP8nJkDATT5j3a1QGxQ64WN2YE2ECku0ZjNoLrdKvzK32gwjUnhAfPPskm9gikUg81xhgWa2pFbdIZzzAZSsZxTmgmk8Iidz0cY7OLVRh7OO/3Nz3+nmjFpudoZ5cDOQVlP1r0Mz/+bthwROplInVYTP+BiqGms+xkKzv15PSZ1BfifMerFuzhXKntzR41lzu2RuyKzCxYRAeqt3ecsP7zrjm2Hg24OJeZZJ+gyLiOCgx5YDfxiGlBPxu0s5jOCEbPSjLyUZDOGzf/nCCecweQ60NmdC4FqpYA7KQtjAPpgRs9YVOm4/SgQnvAYEEumrdSROAMjeA9AQdXmdowcnMW5s6YZ87H8A4+BnPn6+GEYCpYXgxCej8ugnbsHrNaxpk6fOkW37DEzF+4nAKE2VbOYBKVM271LJu4xJPYFuuFOKqSvwbIM3M1VcAdZpZK+lmn3KL28TAfTbm4GpCTAOWSHzGE7ruoy9UT5FRT8qST7/eBdjqJY6BotIqF0ce2ITeyTqom7DXWOFMh88k0Oeu6MpTAbCJ71usS2ZLDi4VnysClm8eDdNT55tH6qVKU7hPlktND9y8Rx7DMTidkJuLEJznvKrBq5Hg8jW8Uur0fF0CLoTlw6ls/uqm9Oi7TlJwrg+f2jClUU03wdNtwPTxoPoQMscLzwDdmOkaApYPBkLO+P5AdwgJyNK3qD+vRli6LUIL2RgiwHN57q2P5QQ7AO2Sx6mUaDcVF6PGQoeO/E7Q47zlr3Biz7it/FoMltiQSbx1xWsXHbEsM8KeNRpDys6LriX10YgGRVzRwlDaSXFAmB9pBu0UvY8G5BSva1VzuCbt15YKtQzpUeOnE5nF8iUMGKR2wHNI9Ae7E27AegfbE8nBk7cOsmNsmwnLkxByIYsH5ssc+tGB1o3/bClOSzMDG9EQU7uUZjcMEDeipo/75jGsz7SuDlc3AjSCBw0BQ0tTRYFB0JcaYuaMULY7fNrPZMXlk0IiznSKmxBHz2IZJURXCHDRTkev7cYelDYI76aO3ks1PJwPcoi04c60UpVWUGkQ5CJkFYGXG6AWeSOUM1Jk98NLbHKsLbjn2KEJSFEF24NCpMioOr8NVhbpMljYpSRaBwlGLWC7lLcH/WKCYUb6ZBhl6gQJHGgJd+goXh/FNRk1Bi7O+Mex48DO1kp3qpR3Ty1g5isxbtrZeCZRRy9BiHh8juO50IS0k8BaD6qUAQSZImJOdY4Wnt0Xtad8wnp7583OBlcwwaVEDa0dRYyx4IOeEG4dDBQfZ1cM8wFTLMgwCGU5fr9qiI5MjtcSxBV/2kt8R7UX3ODi50053qZ5PEcthw87uPJezf8TgcNIbG9PObrH/jDSDCUU3csKHkghMRq6K2Igif2Q6fZJVJUaBvk3+yZTa4szMbmpgNZ6dHY+zwoNbAu3lrCLOM6icMkcqoMsa82g5Q0GJt3qsBRl4R7cfZI+lce9k8mxoMxpE+TYtJNeTNjltWIyJV+uaxmdkERMGyaPb0RgpuSKKppUOofv2uD059XBDhzybKAaYcRDlD6nuPpxW1MA+1hWGIJYHoSdvRbPH9ox2MGksHhfwGIMhPMBMzErvmtFme/Yxn2/cfoA9XuRYpXSLWu5CnfG+njXHozSmadFIyzH2/kLFZHryguDx6FKguKRAm7GF9j+USQo0I0HUvhlufNLYagbRDzlRfoSYleNfcURQhGs/EbMXM2cNcKRCwRHHkBu+TUv7pvpi6a9nsSHHonyyNVL2IvqO2xr7vHF7EbTAjRQPUqJ/2IJnMkkYTW1qJ+w2tgzT2hfkSJ0EAkrJPVb9PWPZS2v13AtgaUaUIbHY+9AFKGob2FBOMDjBnCRvklJacCs/boPS4kCAGn2Lsep3Fs9yrjjmOj3LMH60LUDIra2lq82yGhW3TXH5xu0F0AK3k7YqPRdpzgWZW2gEgVVaIY21w9Ju6HtjbCk4jK2K9s3SRG2ZXGW2mf1pFcK9Iyq9x0TsCguOkoQoiTApxs94xGBymWTGZyd8rLc87X7lxyo+HUdZxmWIykm+cXsPEXWvqAK20C+tNtbEe8M4PXGWZuAI2nZ4x/YYgwXlsmZh4r/Texr3VuCxTrH0YqfQiZWSeKTWrHkV/NBeRfuZBRo4ttKIi8mkNIxB9lmsPWnrx6buejuBQVY1b5b+xu0HLC1uP3dTKM+DaKvxvVqyNeYDGWesUUaahoQqldCoDSFjjdpst0oEqbu+DzbZWLu2ThwPDqNehedWiwhtcSfpS3WPWzYnihPFgThcyTyB9/V7iLaanoMxBjocXvDG7YPytGPnF6TjctaiM+sNR06DwSPmrD7L68laZ1+2OUJao1Lvpbe25w2PjgtfHma0zazQtm0rpWyZi+bQEymKQCg6eK2JE9I0cMkC1Mgx2VDMdlCRbsMEv899IAvW7SDF/8btkwsGtHSttU/lrKOLK/4Yh8WBWe7GUd0ae53oATFlItv0utwBYs6EMfI/MU2KNrevFNu2bdJEPOmWvAU+vXhlFiFwLVzMfu/Y0WXSRydZ148Pin4QUKV9+rUa6jdun1GaB9wuTOYgjWjgQO47EkSFCIMBOGmGMtTj1GgxTdOZzFqMVGiALOVgkaSzADY0454IGHTSCb2Fcn5PeBcp79cftUwjaXyxwOXeYdGPxCwWSSa8cftpVT57F2wMzWC0pwu15Ep6EUtvl9pbn94dVxVubbxk07MFAcWkIBCTJr88QKwPKnENCMPgok0mewa9VZYD9qaOWtEwte6EtI/gLR7gbH+eHMp+cnA7840vTpp/4/Yxedq1ukbn7Wko274i2g2w96QXBlilx9QBP5T5MubMcZ/uJfLD2vvI+4Uaj/R5LYZUvX0sWQX2/ZIGzU/XInRilSGtYCxxIta1K7wbISNKPz24XfnGeOP2U2Ja2Exv7HwOLRVJylaKU4QNPr8G3mSKTMnTYaSX82DaKqyhlcc9jJk7dwbBZQxAq6hOx9Aw5HebpIAqlFcRbaSr0Lzvo36xjzB0fDFu160DLlvbN24fIa6Ylt5R5Uqc6mg4UQz24cHQccpB4isNL1Yp+yBehBLHdkIN0OgiZXnHcoZuufsEHrSuCxgat4chj0072Y+gPAI2aVEeApmZS/xKQ/vgdk5v3H4AtFj/Y2g0zNCLgKn0BRAHN82UH2rXOO2j3Wd9wQfOdqE5OG3POW0ZyCN9kud8tZHgeHyEIaDINfAudu8zT7ojAARe7hnWFsnuv5Q3NmRlxRu3j36U24hdrv98xuvcTjfYDuNJHcraCNEGN3vVPxxXqs04LYubvRFVaDHK9UNfo3F2H8LYGuR2GM/yT+8JI5+A2VmLgjtfF0mfnNo7H3fX+WWgnSIWWOVAeVjMGWeAW9dn+FT5RifbyRMal/YBTz/ptef+pzNssSwgN05TL8IH1Oog15ju4suQhNdYIBgefkq8cXsatMeIhR32yT0equFUkiHMpraDpqPL5sG4UYd0jxieo63lAreH9Q+O2P75gEVnKD7AR8b5sQiPJopzBPNh3/iN24ugnXvFOGpMfNg2KI0Tbbe0EVJhQ68z9Ef29hUDmObSqlsdz6XPsKSqLAylfc0Ww/M8Ztzyjd+4fS5oV4jF0fgsu9x8FY8yi8+OzwbY8sJVCW49vn2hVcQLzeyzPfA3bhegvR+xvJLK+7ZbVIrvzjq1GbeuDnkGL/VJHnL2jZ90CW/cDqB9vI09oXIb2xl8ac7+rtSq6y/dNca1Mscv6RVPDh3p9/6cD/XGbQMtXonYub4KXxmnC5KcpwZ3pr4cPcWFldwPj13ZZx8NePWk2Dduk3v8KsTO+9J/fRM794tpl3DbyWXg2azQC6OIV97AN26t9ETpSxH7HZrG0z7OjyG7k1C7+wLiG8/P9DxQCPXG7V1EFF6B2G8lN2OY8vqRYBKe/5Gxde4k4xmxx9N5+BzA4iW3+Apu7afhtuh+ibNa35MYjijkOwX1ilvPU9uD1Qif5Kfa6/NzGbcccWv8abgtrnV7I/ZCpZB9GLfSCSS4N1/fDcGXOUUm3ngwuDbrEf1jYtrpRLf34y4B8/m9huApP1+m9BzM4sscI2Mbn6BA/TGwLasZjO+HPVinhdxAFmN7pe9cXIZPgTBW/X1WfRB+nozxjdglOvkckeUT+Fa83AbCvrC7nlzjH7DF/wcu3DAKjnL9MgAAAABJRU5ErkJggg==",packLid:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAARCAIAAAApAtklAAADrElEQVR42o2VSXrbOBCF/1cFSraTtG7WN+mL9G2deJBIVL1eUHSc/rIIFhxAkKx6E/TvP3+7LJkYdNmtMSDo7m4FEMh0g9olFJlINNBEQrx8fy6zjAdlbDUlM505FFrX98vlGzQMPo3n5+fzl78ylTBQaDQkQC76WKVQSgKru4QUmUTP6TkVQZ4AMFBmnM7L6YxRDlGlyohuAxBgaIiPCgDT29a5LANkxvFvg+5HSQhARA4o5gRiBBI2FPsCGshIQTVjEQ5ZOfL69n70FMdiXn983y/WdT0tp/VWo2YbZYZketv/+fPreycCgvt0Qh0XfBQBiiCT2bRtsQRVxS+jIWzf77bV47zeXsY2mwiCqIqx7Ei4p5Qg20hz3SS6JoqRZcgc9MQmjRKQYhaRuA3ubpGmDox14EGMrO1e3Ha9EmNEZo5IQQxga97ucOkgKPN8fnxYpiNQjDS0UeDaanYkQGTUpNsaEunZB8H6PxLdPydcEadxWsIw4fVq1g1/sHiARtXt7eV2ghW41V+c9JgsDinl2tYVMB6LFNpmh9Rdn77T+IYe2VaWBxHw8TS+fT2PXah/MNbj/J2Vd3gHwcPDIgF0u5GaqooMPoiHt5cfW3G5PBJ34o4idtf86l0gYowlM1MK8A5Hd8+qqnL/IjTD+3W7vyjtMyOzqmz3UUYGs4C+3q4PT8sntTYahnG5XP4Eh/NvZ93P33/ci0iFuN5aYUNGxt3gOj99O3v9UJmkjFE1gR2wgAabBh+R0geR/kTe74bicrl8/fYEzHVbr30+hTByxN0OmQlij95MICK+fv2Sy95XN4zqGTEEVJmWwzqOhPfAlkUYCyEQKD7i796TME4xFZ8U0bMaz6qZY8mxa8Lg0xjv2w28loert21FDGRZboTtPiARUgjagFsR9+xqTCu0u2OP19vqSDdYd2dKAeyCOeiI15fX08PTftfdw41Aply7rQWmd9dhIqS9ALeQ3DLyarJcY2hOgOU0utm2om0scO+qHGBJ0HYLQsyqs5GGPSNiSGGruk1IxnaE7nsHglklJNm2IkIhOxRzlinIFGXW65axjMzqzW5beybZbWNbyO5dEzsp9gTW9/ex3rbIYVmKdhlRDTKWQljKHRWHkPatsNpzbpFS6E6/bFdN37Me7/6OSEXICUHEpyLiyMItnGphbLncbVBoZ9TY2F01243JiDlno+t6w87M23VTCLhdr5Oq3qqqu6t7b9Q9aeE49kBm927p0/kJyIcv/wEgKIR7TjG0WQAAAABJRU5ErkJggg==",packPocket:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAUCAIAAAAcIrrpAAACg0lEQVR42nWUUXLjOAxEXwOU5Tip9an2HHuNvba2Yse2RPR+UHYyUzX8UYkkGg10E/r3n78B4Hw+L8syqZ3+eoeCAB7X5WvlfD4Dy7IA8/F4v91BUCPqcr0cs3I+gdu4+lrKNr7jd10BNtP2De63GwB+hWzrlq1BQrXX7kj+9jb/hNsAuPy3nM/n3xL/XN1OgGjLstDE9swWUCYEHqCRUb2WZTm8n1MVQoq+1aZY7ze2O5Dzx4hup48PZV6WBYg8AU+sDgoYVQCPy8IfV4cE2vXz87U3TVMV4Y42ApgLQgEJ/c9YgTXaE7/oIBSQiQ2H0e+P03Gwo81xmPNwQJrmU84fMAHKEdaBlxSaDscp0XBIHl85vK3Hw3R7PCLVpikUU85CBJqO1891PuQutWg5tSmaQq1NIcp2VZB68hYOvIutKJERmHiaRTYYCrK9n960H4myXKIUAUMQbAsDEYR2vS0QkXo6cDdGwza2S5bdjYVkox3uibAHDRpjzx6mK4Aq0k0YLBUlYdumsCGHUEJDNoGGhEZVHicMPjXOGxLVRw9ACmm/FzupkGr0LSQJHKPagTYy7tU0quP41UY/sH48uNwJIlGS91qhTI3K1WwpEp6nHt3zN5Bk117Ut1HrRa67cD0riYaEVFB2Ye+9F9ACMqQAMtp4bt0gtuoDz7uLAojaKUshZSpS+lGpgIjjEVhri2/fx6sXESIb0cDtsa4hIbkwHrRES2nrt/fTB7B9XoE2tX1klUNS7Ii1ebvfUtp6b4/uqN6xBtxu8YACK3La6tJXoBHbmF6hAhH1mid9U8TXY2te7/238boPHIDb9ev2mrrw2Kq16N2Ycu9PYeb5RKbvy/9JVkxFzX0fTgAAAABJRU5ErkJggg=="};var Ds=new P;function rn(i,t,e,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Ds.copy(t),Ds[n]=0,Ds.normalize();let l=.5*a/(a+o),h=1-Ds.angleTo(i)/c;return Math.sign(Ds[e])===1?h*l:o/(a+o)+l+l*(1-h)}var Kr=class extends Dn{constructor(t=1,e=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(t/2,e/2,n/2,r),super(1,1,1,s,s,s),s===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let o=new P,c=new P,l=new P(t,e,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,p=h.length/6,g=new P,_=.5/s;for(let m=0,f=0;m<h.length;m+=3,f+=2)switch(o.fromArray(h,m),c.copy(o),c.x-=Math.sign(c.x)*_,c.y-=Math.sign(c.y)*_,c.z-=Math.sign(c.z)*_,c.normalize(),h[m+0]=l.x*Math.sign(o.x)+c.x*r,h[m+1]=l.y*Math.sign(o.y)+c.y*r,h[m+2]=l.z*Math.sign(o.z)+c.z*r,u[m+0]=c.x,u[m+1]=c.y,u[m+2]=c.z,Math.floor(m/p)){case 0:g.set(1,0,0),d[f+0]=rn(g,c,"z","y",r,n),d[f+1]=1-rn(g,c,"y","z",r,e);break;case 1:g.set(-1,0,0),d[f+0]=1-rn(g,c,"z","y",r,n),d[f+1]=1-rn(g,c,"y","z",r,e);break;case 2:g.set(0,1,0),d[f+0]=1-rn(g,c,"x","z",r,t),d[f+1]=rn(g,c,"z","x",r,n);break;case 3:g.set(0,-1,0),d[f+0]=1-rn(g,c,"x","z",r,t),d[f+1]=1-rn(g,c,"z","x",r,n);break;case 4:g.set(0,0,1),d[f+0]=1-rn(g,c,"x","y",r,t),d[f+1]=1-rn(g,c,"y","x",r,e);break;case 5:g.set(0,0,-1),d[f+0]=rn(g,c,"x","y",r,t),d[f+1]=1-rn(g,c,"y","x",r,e);break}}};function Bl(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new ze,l=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,h),l+=p}}if(e){let h=0,u=[];for(let d=0;d<i.length;++d){let p=i[d].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(let h in r){let u=Fl(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in a){let u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){let p=[];for(let _=0;_<a[h].length;++_)p.push(a[h][_][d]);let g=Fl(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function Fl(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){let h=i[l];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}let a=new t(r),o=0;for(let l=0;l<i.length;++l)a.set(i[l].array,o),o+=i[l].array.length;let c=new Be(a,e,n);return s!==void 0&&(c.gpuType=s),c}var vn=Math.PI*2,Mn=i=>new P(...i),On=Ye.lerp,Ze=(i,t,e)=>Math.exp(-(((i-t)/e)**2)),Jr=Object.freeze({yaw:12,pitch:18.5,origin:[-1.03,3.08,-.38],scale:1.14});function on(i,t,e=[0,0,0]){let n=new Pn;return n.name=t,n.position.set(...e),i.add(n),n}function Le(i,t,e,n,s=[0,0,0]){let r=new le(e,n);return r.name=t,r.position.set(...s),r.castShadow=r.receiveShadow=!0,i.add(r),r}function oe(i,t,e,n,s,r=.035){return Le(i,t,new Kr(...s,2,r),e,n)}function ke(i,t,e,n,s){let r=Le(i,t,new Dr(1,28,20),e,n);return r.scale.set(...s),r}function He(i,t,e,n,s,r=!1){let a=new ai(n.map(Mn),r,"centripetal");return Le(i,t,new Nr(a,Math.max(14,n.length*4),s,9,r),e)}function gn(i,t,e,n,s,r,a=r){let o=Mn(n),c=Mn(s).sub(o),l=Le(i,t,new Ur(a,r,c.length(),24),e,o.clone().addScaledVector(c,.5).toArray());return l.quaternion.setFromUnitVectors(Mn([0,1,0]),c.normalize()),l}function Fn(i,t,e){let n=[],s=[],r=[];for(let c=0;c<=i;c++)for(let l=0;l<=t;l++){if(n.push(...e(c/i,l/t)),s.push(l/t,c/i),c===i||l===t)continue;let h=c*(t+1)+l,u=h+t+1;r.push(h,h+1,u,h+1,u+1,u)}let a=new ze;a.setAttribute("position",new he(n,3)),a.setAttribute("uv",new he(s,2)),a.setIndex(r),a.computeVertexNormals();let o=a.getAttribute("normal");for(let c=0;c<=i;c++){let l=c*(t+1),h=l+t,u=3*l,d=3*h;if(Math.hypot(n[u]-n[d],n[u+1]-n[d+1],n[u+2]-n[d+2])>1e-7)continue;let p=new P().fromBufferAttribute(o,l).add(new P().fromBufferAttribute(o,h)).normalize();o.setXYZ(l,p.x,p.y,p.z),o.setXYZ(h,p.x,p.y,p.z)}return a}function _e(i,t,e,n,s=32,r,a=[0,1]){let o=new ai(n.map(l=>Mn(l.slice(0,3))),!1,"catmullrom"),c=new ci(n.map(l=>new at(l[3],l[4])));return Le(i,t,Fn(s+2,32,(l,h)=>{let u=Math.round(l*(s+2)),d=On(a[0],a[1],Ye.clamp((u-1)/s,0,1)),p=o.getPoint(d);if(u===0||u===s+2)return p.toArray();let g=o.getTangent(d),_=Mn([g.y,-g.x,0]).normalize(),m=_.clone().cross(g).normalize(),f=h*vn,b=c.getPoint(d),x=r?.(d,f)??0;return p.addScaledVector(_,Math.sin(f)*Math.max(0,b.x+x)).addScaledVector(m,Math.cos(f)*Math.max(0,b.y+x)).toArray()}),e)}function w0(i,t){let e=Fn(26,56,(o,c)=>i(o,1-c)),n=Fn(26,56,(o,c)=>{let[l,h,u]=i(o,c);return[l,h-t,u]}),r=[e,n,...[o=>[1,1-o],o=>[0,o],o=>[1-o,0],o=>[o,1]].map(o=>Fn(1,56,(c,l)=>{let[h,u,d]=i(...o(l));return[h,u-c*t,d]}))],a=Bl(r);for(let o of r)o.dispose();return a}async function zl(){let i=new Pn;i.name="Red Cap Marksman MK3";let t=(R,z,dt=.75,lt=0)=>new pn({name:R,color:z,roughness:dt,metalness:lt}),e=t("Warm complexion",12882291,.67),n=t("Brown hair",3154718,.7),s=t("Exposed hair ridges",4469034,.63),r=t("Near-black mustache",3023646,.63),a=t("Dark eyeglass acetate",2104603,.35),o=t("Sclera",14468525,.41),c=t("Dark iris",3549473,.38),l=t("Pupil",1578e3,.27),h=t("Lid margin",7951685,.76),u=t("Worn red cap canvas",9650233),d=t("Red seam binding",11360592),p=t("Red neckerchief cotton",9583155,.82),g=t("Patinated dark metal",4539713,.39,.45),_=t("Olive polymer",4474433,.56),m=t("Dark rubber",2697254,.8),f=t("Dark brown sleeve band",5257521,.74),b=t("Desert canvas",10849399,.85),x=t("Cuff weave",5787722,.8),A=t("Charcoal plate carrier",4473667,.81),L=t("Dark leather belt",5259574,.74),w=t("Canvas webbing",9204310,.83),T=t("Dark canvas",7428678,.85),W=t("Faded stitching",10717806,.83),v=t("Aged buckle alloy",10388317,.43,.5),E=t("Olive trousers",5986375,.84),B=t("Olive pockets",6906702,.8),K=t("Brown boot leather",4930098,.61),ot=t("Worn welt",7100489,.73),U=t("Red canister",10701120,.66,.13),F=t("Radio glass",3490625,.42,.19),Y=new Fr,[$,J,q,tt,k]=await Promise.all(["skin","badge","stock","packLid","packPocket"].map(R=>Y.loadAsync(Ol[R])));for(let R of[J,q,tt,k])R.colorSpace=Ee,R.anisotropy=4;function ct(R,z,dt,lt){let Rt=document.createElement("canvas");Rt.width=Rt.height=R;let It=Rt.getContext("2d"),zt=It.createImageData(R,R);for(let Wt=0;Wt<R;Wt++)for(let pe=0;pe<R;pe++)zt.data.set(z(pe,Wt),(Wt*R+pe)*4);It.putImageData(zt,0,0);let jt=new wr(Rt);return jt.name=dt,jt.wrapS=jt.wrapT=ps,jt.repeat.set(lt,lt),jt}let H=ct(64,(R,z)=>{let dt=Math.sin(R*Math.PI/2)*(10+4*Math.cos(z*Math.PI/2)),lt=Math.sin(z*Math.PI/2)*(12+4*Math.cos(R*Math.PI/2));return[128+dt,128+lt,253,255]},"Woven canvas tangent normals",5),Q=ct(64,(R,z)=>[255,214+11*Math.sin((3*R+z)*vn/64)+8*Math.cos((R-4*z)*vn/64),255,255],"Canvas roughness variation",5);for(let R of[u,p,b,f,x,A,w,T,E,B])R.normalMap=H,R.normalScale.set(.27,.27),R.roughnessMap=Q,R.roughness=Math.min(1,R.roughness+.1);function xt(R,z,dt){let lt=z.clone();lt.name=z.name+" / MK3 fixed patch",lt.color.set(16777215),lt.map=dt,R.material=[z,z,z,z,lt,z]}let Tt={},yt=(R,z,dt,lt)=>{let Rt=on(z,dt,lt);return Rt.userData.componentId=R,Tt[R]=Rt,Rt};function Nt(R,z,dt,lt,Rt=v){let It=on(R,"Buckle",z);for(let zt of[-dt/2,dt/2])oe(It,"Frame side",Rt,[zt,0,0],[.028,lt,.026],.007);for(let zt of[-lt/2,lt/2])oe(It,"Frame crossbar",Rt,[0,zt,0],[dt,.027,.026],.007);oe(It,"Tongue",Rt,[0,0,.014],[.026,lt*.77,.018],.005)}function kt(R,z,dt,lt,Rt,It,zt,jt){let Wt=on(R,z,dt);Wt.rotation.y=Rt;let[pe,ye,ae]=lt;return oe(Wt,"Pouch body",It,[0,0,0],lt,.058),oe(Wt,"Rolled closure flap",zt,[0,ye*.25,ae*.45],[pe*.95,ye*.48,ae*.26],.024),oe(Wt,"Retention tab",jt,[0,ye*.12,ae*.6],[pe*.24,ye*.52,.034],.011),Nt(Wt,[0,-ye*.09,ae*.66],pe*.23,ye*.17,g),Wt}let At=yt("torso",i,"Plate carrier and belt");_e(At,"Tunic beneath plate carrier",b,[[0,1.94,0,.58,.32],[0,2.35,-.01,.63,.4],[0,3.02,-.015,.613,.393],[0,3.55,-.035,.646,.404],[0,3.9,-.042,.741,.355],[0,4.15,-.04,.47,.3],[0,4.23,-.025,.3,.24]],46),_e(At,"Continuous fitted vest",A,[[0,2.36,-.015,.63,.41],[0,2.7,-.03,.686,.449],[0,3.28,-.025,.724,.476],[0,3.72,-.037,.728,.454],[0,3.88,-.041,.649,.407],[0,4.03,-.04,.565,.369]],43),oe(At,"Chest plate pocket",A,[0,3.42,.404],[1.03,.86,.13],.085);for(let R of[-1,1]){let z=R,dt=[[z*.44,3.1,.458],[z*.46,3.65,.443],[z*.52,3.95,.285],[z*.53,4.047,.052],[z*.52,4.01,-.247],[z*.49,3.82,-.415],[z*.47,3.27,-.483]];_e(At,"Dark harness pad",m,dt.map(lt=>[...lt,.133,.047])),_e(At,"Sand shoulder webbing",w,dt.map(([lt,Rt,It])=>[lt,Rt+.02,It*1.082,.096,.049])),Nt(At,[z*.46,3.65,.523],.133,.205,g);for(let lt of[3.25,3.4,3.55])for(let Rt of[.105,.25])oe(At,"Stitched webbing loop",x,[z*Rt,lt,.482],[.135,.067,.038],.01)}_e(At,"Beveled utility belt",L,[[0,2.16,-.006,.622,.391],[0,2.19,-.006,.665,.426],[0,2.36,-.006,.681,.438],[0,2.41,-.006,.628,.41]],24),Nt(At,[.044,2.286,.465],.238,.155);for(let R of[-1,1])kt(At,"Rear belt utility pouch",[R*.36,2.25,-.458],[.38,.51,.225],Math.PI,L,T,w);kt(At,"Left belt utility pouch",[.62,2.22,.12],[.3,.45,.23],1.26,L,T,w);let Bt=on(At,"Right holster",[-.66,1.98,.1]);Bt.rotation.set(.04,-1.04,-.18),oe(Bt,"Tapered holster body",m,[0,-.03,0],[.34,.8,.19],.06),oe(Bt,"Reinforced retention edge",_,[0,.31,.04],[.346,.18,.186],.034),oe(Bt,"Holster attachment",L,[0,.39,-.095],[.19,.2,.085],.021);for(let R of[.27,-.23])gn(Bt,"Holster rivet",g,[.1,R,.092],[.1,R,.106],.025);let I=on(At,"Red belt canister",[-.5,2.01,.362]);I.rotation.z=-.34,gn(I,"Crimped canister",U,[0,-.229,0],[0,.252,0],.094);for(let R of[-.18,.14])gn(I,"Retaining sleeve",x,[0,R,0],[0,R+.061,0],.102);let ht=yt("pack",At,"Canvas backpack and antenna",[0,3.41,-.59]);ht.rotation.y=Math.PI,oe(ht,"Soft main compartment",w,[0,0,0],[1.16,1.16,.54],.152),xt(oe(ht,"Curved pack lid",T,[0,.342,.226],[1.04,.41,.222],.086),T,tt),xt(oe(ht,"Central billow pocket",w,[0,-.137,.288],[.53,.63,.195],.072),w,k),oe(ht,"Central closure tab",T,[0,.071,.408],[.17,.73,.041],.015),Nt(ht,[0,-.004,.443],.183,.236);for(let R of[-1,1]){let z=[[R*.35,.526,.22],[R*.37,.36,.327],[R*.367,-.04,.363],[R*.368,-.38,.329],[R*.36,-.493,.199]];_e(ht,"Compression webbing",T,z.map(dt=>[...dt,.065,.03]),24),Nt(ht,[R*.369,-.137,.396],.121,.178,g),He(ht,"Pack piping",W,[[R*.5,-.44,.26],[R*.53,-.2,.258],[R*.53,.22,.241],[R*.49,.4,.206]],.012)}He(ht,"Pack carry handle",m,[[-.2,.49,-.028],[-.14,.617,-.015],[.14,.617,-.015],[.2,.49,-.028]],.028);let Z=on(ht,"MK3 right pack radio",[.59,.357,.128]);Z.rotation.z=-.19,oe(Z,"Radio",_,[0,.03,0],[.3,.47,.25],.037),oe(Z,"Screen bezel",m,[0,.12,.121],[.2,.126,.033],.017),oe(Z,"Screen",F,[0,.12,.141],[.163,.08,.014],.01);for(let R=0;R<9;R++)oe(Z,"Keypad",g,[(R%3-1)*.045,-.027-Math.floor(R/3)*.048,.137],[.031,.032,.018],.006);gn(Z,"Antenna base",m,[.07,.24,0],[.07,.42,0],.067,.044),gn(Z,"Antenna whip",_,[.07,.35,0],[.07,1.264,0],.038,.023),gn(Z,"Antenna cap",g,[.07,1.22,0],[.07,1.28,0],.037);let ut=yt("trousers",i,"Cargo trousers"),j=yt("boots",i,"Laced field boots");_e(ut,"Rounded seat and waist",E,[[0,1.59,-.032,.043,.052],[0,1.66,-.032,.25,.175],[0,1.76,-.046,.47,.329],[0,1.91,-.057,.612,.408],[0,2.01,-.057,.687,.413],[0,2.27,-.024,.604,.369]],34);let wt=new Ki;wt.moveTo(-.2,-.24),wt.quadraticCurveTo(-.262,-.18,-.235,.054),wt.quadraticCurveTo(-.242,.237,-.273,.417),wt.quadraticCurveTo(-.24,.6,0,.591),wt.quadraticCurveTo(.24,.6,.273,.417),wt.quadraticCurveTo(.242,.237,.235,.054),wt.quadraticCurveTo(.262,-.18,.2,-.24),wt.quadraticCurveTo(0,-.289,-.2,-.24);let bt=new Cs(wt,{depth:.095,bevelThickness:.017,bevelSize:.017,bevelSegments:3});bt.rotateX(Math.PI/2);for(let R of[-1,1]){let z=[R*1.055,.69,R<0?-.175:.425],dt=[R*.94,1.13,R<0?.008:.438];_e(ut,R<0?"Right trouser leg":"Left trouser leg",E,[[...z,.229,.22],[R*1.038,.79,z[2]+.016,.318,.308],[R*.988,.932,z[2]+.047,.37,.341],[...dt,.379,.364],[R*.743,1.47,.13+R*.124,.389,.375],[R*.492,1.78,-.005,.408,.397],[R*.361,2.095,-.032,.347,.363]],64,(zt,jt)=>.019*Ze(zt,.24,.25)*Math.sin(zt*51+2.3*Math.cos(jt))+.012*Math.sin(4*jt+zt*5)*Math.sin(Math.PI*zt));let lt=oe(ut,"Cloth knee insert",B,[dt[0],dt[1]+.048,dt[2]+.357],[.483,.442,.119],.094);lt.rotation.set(-.18,R*.13,-R*.2),He(lt,"Inset knee stitching",E,[[-.182,.127,.059],[-.164,-.142,.062],[.153,-.157,.063],[.179,.11,.059]],.009),kt(ut,"Thigh cargo pocket",[R*1.129,1.501,.123+R*.119],[.302,.444,.152],R*1.16,E,B,T).rotation.set(0,R*1.16,R*.33,"ZYX");let It=on(j,R<0?"Right boot":"Left boot",[z[0],0,z[2]]);It.rotation.y=R<0?-.14:.28,R<0&&It.scale.set(.94,1,.85),Le(It,"Rubber outsole",bt,m,[0,.112,0]),Le(It,"Stacked heel and welt",bt.clone().scale(.967,.48,.983),ot,[0,.149,0]),Le(It,"Leather lower last",bt.clone().scale(.933,.9,.948),K,[0,.228,-.006]),ke(It,"Rounded toe vamp",K,[0,.232,.216],[.247,.176,.382]),_e(It,"Shaped ankle shaft",K,[[0,.192,-.022,.216,.249],[0,.36,-.049,.189,.198],[0,.553,-.032,.2,.212],[0,.752,0,.209,.21]],28,(zt,jt)=>.009*Math.sin(zt*27+Math.cos(jt)*2)*Ze(zt,.58,.38));for(let zt=0;zt<5;zt++){let jt=.362+zt*.061,Wt=.283-zt*.026;He(It,"Leather lace",ot,[[-.107,jt,Wt],[.007,jt+.02,Wt+.009],[.104,jt-.009,Wt]],.015)}He(It,"Toe stitch",ot,[[-.195,.257,.43],[-.116,.343,.438],[0,.367,.452],[.116,.343,.438],[.195,.257,.43]],.01)}let M=yt("scarf",i,"Folded red neckerchief",[0,-.062,0]);_e(M,"Neck under bandana",e,[[0,4.03,-.049,.253,.243],[0,4.47,.05,.257,.268]],24);let y=p.clone();y.side=Oe,Le(M,"Wrapped continuous scarf",Fn(50,74,(R,z)=>{let dt=vn*z,lt=Math.max(0,Math.cos(dt)),Rt=4.1-.234*lt**3+.023*Math.sin(dt),It=4.415-.19*lt**2+.025*Math.sin(dt),zt=Math.sin(Math.PI*R)**.72,jt=.047*Math.sin(R*12.8-.5+1.1*Math.sin(dt))*zt,Wt=On(.437,.331,R)+.113*zt+jt,pe=On(.366+.144*lt**3,.305,R)+.11*zt+jt;return[Wt*Math.sin(dt),On(Rt,It,R),.018+pe*Math.cos(dt)]}),y);let N=yt("head",i,"MK3 face and cranium",[0,4.235,.009]),rt=[[.026,.139,.14,.182],[.088,.136,.307,.282],[.218,.093,.377,.365],[.372,.043,.416,.402],[.53,-.004,.46,.421],[.665,-.02,.473,.442],[.851,-.035,.462,.448],[1.038,-.058,.459,.443],[1.256,-.086,.388,.372],[1.452,-.111,.221,.223],[1.55,-.12,0,0]],st=new ai(rt.map(([R,z,dt])=>Mn([R,z,dt])),!1,"catmullrom"),et=new ci(rt.map((R,z)=>new at(z,R[3])));function Ct(R,z){let{x:dt,y:lt,z:Rt}=st.getPoint(R),It=z*vn,zt=Math.max(0,Math.cos(It)),jt=Math.sin(It)*Rt,Wt=.211*Ze(jt,0,.09)*Ze(dt,.518,.078),pe=.111*Ze(jt,0,.087)*Ze(dt,.63,.188),ye=.032*Ze(Math.abs(jt),.299,.13)*Ze(dt,.493,.141),ae=.061*Ze(Math.abs(jt),.214,.125)*Ze(dt,.689,.069),Sn=.029*Ze(Math.abs(jt),.201,.119)*Ze(dt,.794,.057),jr=.025*Ze(jt,0,.172)*Ze(dt,.306,.063),Fs=Math.cos(It)<0?Math.cos(It):zt**.7;return[jt,dt,lt+et.getPoint(R).y*Fs+zt*(Wt+pe+ye-ae+Sn+jr)]}let vt=Le(N,"Sculpted jaw, cheekbones and nose",Fn(104,112,Ct),e),Et=$.image,Ot=document.createElement("canvas");Ot.width=Et.width,Ot.height=Et.height;let Xt=Ot.getContext("2d");Xt.drawImage(Et,0,0);let{data:nt}=Xt.getImageData(0,0,Et.width,Et.height),qt=vt.geometry.getAttribute("position"),C=vt.geometry.getAttribute("normal"),it=new Float32Array(qt.count*3),gt=new ne,ft=e.color.clone();for(let R=0;R<qt.count;R++){let z=qt.getX(R),dt=qt.getY(R),lt=qt.getZ(R),Rt=Ye.clamp(Math.round(426+55.44*z-372),0,Et.width-1),zt=(Ye.clamp(Math.round(1013-55.44*(N.position.y+dt)-678),0,Et.height-1)*Et.width+Rt)*4;gt.setRGB(nt[zt]/255,nt[zt+1]/255,nt[zt+2]/255,Ee);let jt=Ye.smoothstep(lt,.09,.42)*Ye.smoothstep(C.getZ(R),.02,.48)*.88;gt.copy(ft.clone().lerp(gt,jt)),gt.toArray(it,R*3)}$.dispose(),vt.geometry.setAttribute("color",new Be(it,3));let Pt=e.clone();Pt.name="MK3 complexion baked onto cranium",Pt.color.set(16777215),Pt.vertexColors=!0,vt.material=Pt;let Zt=yt("glasses",N,"Black rectangular glasses");for(let R of[-1,1]){ke(N,"Ear beneath padded cup",e,[R*.437,.659,-.055],[.117,.169,.125]);let z=on(N,"Eye",[R*.198,.696,.378]);z.rotation.z=R*.095,z.rotation.y=R*.12,ke(z,"Inset almond sclera",o,[0,0,0],[.101,.045,.059]),ke(z,"Brown iris",c,[.011,-.001,.049],[.039,.038,.016]),ke(z,"Pupil",l,[.012,-.001,.06],[.021,.026,.009]),ke(z,"Catchlight",o,[.002,.014,.068],[.008,.01,.004]),He(z,"Overhanging upper lid",h,[[-.093,.001,.013],[-.052,.035,.045],[.021,.04,.053],[.079,.019,.033],[.099,-.003,.004]],.014),_e(N,"Inward-sloping eyebrow",r,[[R*.068,.749,.46,.022,.018],[R*.127,.772,.445,.035,.032],[R*.217,.815,.429,.039,.026],[R*.295,.832,.386,.03,.02],[R*.348,.816,.346,.016,.013],[R*.368,.791,.326,0,0]],40,(Rt,It)=>Math.sin(Rt*Math.PI)*.0035*Math.sin(7*It));let dt=[[.055,.741,.486],[.086,.764,.474],[.281,.775,.426],[.33,.758,.389],[.313,.649,.4],[.279,.623,.434],[.12,.622,.474],[.074,.655,.483]].map(([Rt,It,zt])=>[R*Rt,It,zt]);He(Zt,"Radius-cornered lens rim",a,dt,.0135,!0),He(Zt,"Glasses temple bar",a,[[R*.32,.742,.394],[R*.406,.746,.27],[R*.478,.723,.098],[R*.484,.695,-.023]],.016);let lt=R===1?.011:-.004;_e(N,"Turned mustache lobe",r,[[R*.002,.418,.523,.036,.046],[R*.092,.419+lt,.513,.067,.067],[R*.189,.381,.478,.064,.058],[R*.289,.354,.421,.051,.048],[R*.364,.376,.379,.029,.036],[R*.401,.424,.328,.015,.02],[R*.386,.47+lt,.324,0,0]],49,(Rt,It)=>.004*Math.sin(Rt*Math.PI)*Math.sin(12*It+5*Rt)),ke(N,"Nostril contour",h,[R*.074,.474,.543],[.028,.014,.022])}He(Zt,"Frame bridge",a,[[-.059,.733,.481],[0,.757,.517],[.059,.733,.481]],.013),He(N,"Mouth crease",h,[[-.129,.242,.423],[-.055,.259,.442],[.02,.254,.452],[.103,.229,.431]],.009),ke(N,"Lower lip volume",e,[0,.217,.426],[.09,.019,.028]);let Yt=yt("cap",N,"MK3 red cap and swept hair"),Qt=Fn(53,78,(R,z)=>{let dt=On(1.58,vn-1.58,z),lt=Math.max(0,-Math.cos(dt)),Rt=.47-lt*(.17+.024*Math.sin(15*Math.PI*z)),[It,zt,jt]=Ct(On(Rt,.72,R),dt/vn),Wt=(.05+.016*lt+.011*Math.cos(18*Math.PI*z+2*R))*Math.sin(Math.PI*z)**.27*(1-.9*R**7);return[It+Math.sin(dt)*Wt,zt-.024*(1-R),jt+Math.cos(dt)*Wt]});Le(Yt,"Tapered nape hair mass",Qt,n);let _t=R=>.076+.965*((1+Math.cos(R))*.5)**.61;function D(R,z,dt=0){let lt=Math.sin(R);return[(.513*lt+dt)*Math.sin(z),1.047+.539*Math.cos(R),-.106+((.583+.021*Math.max(0,-Math.cos(z)))*lt+dt)*Math.cos(z)]}Le(Yt,"Grooved exposed front hair",Fn(43,96,(R,z)=>{let dt=(1-z)*vn,[lt,Rt,It]=D(R*_t(dt),dt),zt=lt+.42*It-.23*It*It,jt=(.022*Math.sin(zt*29)**2+.007*Math.cos(zt*43))*Math.sin(Math.PI*R)**.67;return[lt+jt*Math.sin(dt),Rt+jt,It+jt*Math.cos(dt)]}),s);let pt=u.clone();pt.side=Oe;let mt=(R,z)=>{let[dt,lt,Rt]=D(On(_t(z),1.51+.17*Math.max(0,-Math.cos(z)),R),z,.006),It=.109*R*Math.sin(z)**2*Ye.smoothstep(Math.cos(z),0,.35);return[dt,lt-It,Rt]};Le(Yt,"Fitted red cap crown",Fn(42,96,(R,z)=>mt(R,(1-z)*vn)),pt);let Ft=(R,z)=>{let dt=(z*2-1)*1.42,lt=Math.cos(dt),Rt=R*lt**.65;return[(.485+.108*Rt)*Math.sin(dt),1.151-.173*Math.sin(dt)**2-.021*Rt,-.102+(.576+.435*Rt)*lt]};Le(Yt,"Single stiff curved visor",w0(Ft,.035),u),He(Yt,"Stitched visor lip",d,Array.from({length:27},(R,z)=>{let[dt,lt,Rt]=Ft(1,z/26);return[dt,lt-.011,Rt]}),.016);for(let R of[-.45,.45,Math.PI])He(Yt,"Cap panel seam",d,Array.from({length:11},(z,dt)=>{let[lt,Rt,It]=mt(.09+dt*(R===Math.PI?.054:.078),R);return[lt+.006*Math.sin(R),Rt,It+.006*Math.cos(R)]}),.006);let Lt=oe(Yt,"MK3 cloth emblem",T,[.012,1.272,.444],[.186,.112,.017],.011);Lt.rotation.x=-.43,xt(Lt,T,J),ke(Yt,"Rear cap opening recess",n,[0,1.1,-.712],[.169,.087,.018]),oe(Yt,"Rear strap",u,[0,1.041,-.712],[.353,.063,.031],.02);let Kt=yt("headset",N,"Padded ear defenders and boom microphone"),se=[[-.544,.733,-.15],[-.564,1.044,-.15],[-.443,1.388,-.156],[-.213,1.591,-.149],[0,1.637,-.143],[.218,1.584,-.139],[.459,1.38,-.14],[.549,1.034,-.134],[.542,.752,-.134]];_e(Kt,"Padded headset band",m,se.map(R=>[...R,.056,.113]),52),_e(Kt,"Metal spring cover",g,se.map(R=>[...R,.064,.103]),39,(R,z)=>.005*Math.max(0,Math.sin(z)),[.24,.76]);for(let R of[-1,1]){ke(Kt,"Padded ear seal",m,[R*.512,.665,-.111],[.136,.282,.247]),ke(Kt,"Olive hard shell",_,[R*.618,.667,-.112],[.15,.266,.235]),ke(Kt,"Cup outer plate",g,[R*.704,.669,-.112],[.067,.204,.173]),oe(Kt,"Earcup embossing",_,[R*.764,.666,-.101],[.019,.062,.191],.009);let z=Array.from({length:28},(dt,lt)=>{let Rt=vn*lt/28;return[R*.73,.668+.18*Math.sin(Rt),-.112+.153*Math.cos(Rt)]});He(Kt,"Cup rolled edge",_,z,.012,!0)}He(Kt,"Curved boom arm",m,[[.687,.544,.018],[.665,.404,.162],[.545,.251,.411],[.294,.234,.56]],.024),ke(Kt,"Boom microphone foam",_,[.272,.235,.564],[.081,.054,.053]);let ue=on(i,"Original MK3 carry frame",Jr.origin),Se=Ye.degToRad(Jr.yaw),re=Ye.degToRad(Jr.pitch),Ce=Mn([Math.sin(Se)*Math.cos(re),-Math.sin(re),Math.cos(Se)*Math.cos(re)]),Ke=Mn([-Math.cos(Se),0,Math.sin(Se)]);ue.quaternion.setFromRotationMatrix(new Me().makeBasis(Ce,Ke.clone().cross(Ce),Ke)),ue.scale.setScalar(Jr.scale),ue.updateMatrix();let Ae=yt("rifle",ue,"MK3 rifle reconstructed from its equipment profile"),Ns=t("MK3 tan stock finish",10188109,.66),Ie=t("Parkerized rifle metal",3881787,.4,.57),_n=t("Rubbed metal edges",5460050,.43,.53),Jn=t("Dark scope lens",2240818,.18,.27),te=R=>(R-711)/63,ee=R=>(668-R)/63,ts=R=>{let z=new Ki;return R.forEach(([dt,lt],Rt)=>z[Rt?"lineTo":"moveTo"](te(dt),ee(lt))),z.closePath(),z};function es(R,z,dt,lt,Rt){let It=new Cs(z,{depth:dt,bevelThickness:lt,bevelSize:lt,bevelSegments:3});return It.translate(0,0,-dt/2),Le(Ae,R,It,Rt)}let Os=ts([[723,657],[756,656],[769,660],[790,660],[800,657],[833,657],[859,659],[901,661],[915,663],[918,667],[918,675],[913,678],[870,679],[844,679],[831,683],[782,683],[775,684],[762,690],[747,690],[737,686],[724,689]]),S=new Zi;S.moveTo(te(736),ee(675)),S.quadraticCurveTo(te(746),ee(671),te(759),ee(674)),S.quadraticCurveTo(te(769),ee(676),te(763),ee(681)),S.quadraticCurveTo(te(754),ee(688),te(744),ee(684)),S.quadraticCurveTo(te(736),ee(681),te(736),ee(675)),Os.holes.push(S);let O=Ns.clone();O.name="MK3 equipment-profile bake",O.color.set(16777215),O.map=q;let G=es("Beveled stock and fore-end with opening",Os,.172,.021,[O,Ns]),X=G.geometry.getAttribute("position"),V=G.geometry.getAttribute("uv");for(let R=0;R<X.count;R++)V.setXY(R,(X.getX(R)*63+6)/316,1-(40-63*X.getY(R))/81);oe(Ae,"Rubber recoil pad",m,[te(719),ee(673),0],[.183,.54,.224],.043).rotation.z=.052,oe(Ae,"Raised cheek rest",_,[te(744),ee(655),0],[.516,.098,.214],.031),es("Pistol grip",ts([[759,674],[772,676],[769,685],[762,698],[752,697],[749,692],[754,684]]),.159,.028,m),es("Magazine",ts([[800,679],[830,677],[830,692],[806,696],[801,691]]),.157,.025,Ie),He(Ae,"Trigger guard",Ie,[[te(771),ee(680),0],[te(775),ee(689),0],[te(786),ee(689),0],[te(793),ee(684),0],[te(794),ee(680),0]],.031),He(Ae,"Recessed trigger",m,[[te(780),ee(680),0],[te(782),ee(684),0],[te(786),ee(685),0]],.016),oe(Ae,"Receiver",Ie,[te(821),ee(657.5),0],[.846,.134,.18],.032),oe(Ae,"Scope rail",_n,[te(821),ee(653.6),0],[1.08,.065,.164],.012);let St=(R,z,dt,lt,Rt,It,zt=It)=>gn(Ae,R,z,[te(dt),ee(Rt),0],[te(lt),ee(Rt),0],It,zt);St("Main barrel",Ie,846,954,663.4,.064,.06),St("Suppressor shoulder",_n,942,952,663.4,.082,.111),St("Suppressor",Ie,950,1009,663.4,.143,.146);let Ut=new As([[.086,0],[.144,0],[.147,.05],[.136,.079],[.089,.079],[.086,0]].map(R=>new at(...R)),36);Ut.rotateZ(-Math.PI/2),Le(Ae,"Recessed suppressor mouth",Ut,Ie,[te(1008.7),ee(663.4),0]);let Dt=644;St("Scope center tube",Ie,779,877,Dt,.096,.094),St("Eyepiece",Ie,775,792,Dt,.138,.123),St("Scope objective bell",Ie,845,870,Dt,.094,.183),St("Objective hood",Ie,867,886,Dt,.183,.176);let Ht=new As([[.149,0],[.177,0],[.178,.04],[.173,.064],[.149,.064],[.149,0]].map(R=>new at(...R)),36);Ht.rotateZ(-Math.PI/2),Le(Ae,"Beveled optic rim",Ht,_n,[te(886),ee(Dt),0]),St("Inset objective lens",Jn,886.1,886.5,Dt,.15),St("Inset eyepiece lens",Jn,774.8,775.1,Dt,.101);for(let R of[800,839])oe(Ae,"Scope mount",_n,[te(R),ee(651.5),0],[.131,.142,.151],.026),St("Scope ring",_n,R-2,R+1.4,Dt,.125);gn(Ae,"Elevation turret",Ie,[te(822),ee(644),0],[te(822),ee(632),0],.076),gn(Ae,"Turret cap",_n,[te(822),ee(635),0],[te(822),ee(631),0],.093);for(let R of[-1,1]){gn(Ae,"Lateral turret",Ie,[te(822),ee(644),R*.05],[te(822),ee(644),R*.139],.083);for(let z of[852,862,872,882,892,902])oe(Ae,"Fore-end recessed slot",m,[te(z),ee(670),R*.109],[.074,.039,.01],.006);for(let z of[733,791,900])gn(Ae,"Stock screw",_n,[te(z),ee(669),R*.103],[te(z),ee(669),R*.111],.02)}let Jt=R=>Mn(R).applyMatrix4(ue.matrix).toArray(),Vt=[[.641,-.305,.116],[2.546,-.337,-.151]],Gt=[[.777,-.364,.129],[2.525,-.246,-.043]],xe=yt("sleeves",i,"Right and left sleeves and forearms");for(let[R,z]of[-1,1].entries()){let dt=on(xe,z<0?"Right bent arm":"Left bent arm"),lt=Jt(Vt[R]),Rt=Jt(Gt[R]),It=z<0?[-1.55,2.962,-.16]:[.959,2.756,.55],zt=z<0?[[-.478,3.907,-.117,.215,.205],[-.708,3.841,-.16,.285,.268],[-.933,3.753,-.197,.33,.305],[-1.208,3.571,-.21,.326,.304],[-1.456,3.255,-.223,.29,.266],[...It,.221,.216]]:[[.471,3.895,-.108,.216,.205],[.684,3.833,-.138,.278,.261],[.895,3.716,-.128,.323,.3],[1.109,3.504,.141,.326,.289],[1.098,3.153,.405,.272,.246],[...It,.218,.21]],jt=(ye,ae)=>(.014*Math.sin(ye*32+1.7*Math.cos(ae*1.8))+.009*Math.sin(ae*3+ye*5))*Math.sin(Math.PI*ye)*(.68+.28*ye);_e(dt,"Shaped sleeve with radial cloth folds",b,zt,62,jt),_e(dt,"Upper-arm brown canvas band",f,zt,19,(ye,ae)=>.016+jt(ye,ae),[.365,.525]);let Wt=ye=>It.map((ae,Sn)=>On(ae,lt[Sn],ye)),pe=ye=>lt.map((ae,Sn)=>On(ae,Rt[Sn],ye));ke(dt,"Elbow continuity",b,It,[.239,.224,.231]),_e(dt,"Shaped skin forearm",e,[[...It,.203,.204],[...Wt(.31),.192,.178],[...Wt(.62),.154,.145],[...lt,.108,.106],[...pe(.46),.08,.081]],36),_e(dt,"Turned sleeve cuff",x,[[...Wt(.013),.239,.229],[...Wt(.17),.222,.212],[...Wt(.24),.21,.196]],21),_e(dt,"Glove cuff running into palm",m,[[...Wt(.78),.156,.146],[...Wt(.88),.141,.136],[...lt,.133,.121],[...pe(.6),.096,.096],[...pe(.97),.054,.053]],26)}let Ue=yt("gloves",ue,"Fingerless gloves and grip contacts"),fe=on(Ue,"Right hand on the pistol grip");_e(fe,"Right leather palm",m,[[...Vt[0],.11,.102],[...Gt[0],.137,.105],[.859,-.415,.124,.118,.079],[.922,-.423,.086,.087,.05]],34),oe(fe,"Right hand knuckle panel",_,[.799,-.358,.206],[.203,.181,.054],.038).rotation.z=-.29;for(let R=0;R<3;R++){let z=-.388-R*.063,dt=.887-R*.026;_e(fe,"Right curled finger",e,[[dt,z,.143,.043,.037],[dt+.08,z-.008,.13,.038,.035],[dt+.1,z-.02,.06,.034,.031],[dt+.08,z-.023,.014,.01,.012]],20)}_e(fe,"Index finger alongside the guard",e,[[.839,-.304,.145,.042,.037],[.964,-.29,.129,.036,.033],[1.08,-.309,.093,.03,.028],[1.112,-.32,.062,.01,.011]],23),ke(fe,"Thumb on grip far side",e,[.848,-.31,-.076],[.084,.057,.047]);let Je=on(Ue,"Left hand cupped below the fore-end");_e(Je,"Left leather palm",m,[[...Vt[1],.113,.109],[...Gt[1],.146,.107],[2.536,-.219,.07,.158,.076],[2.54,-.181,.092,.132,.05]],36);for(let R=0;R<4;R++){let z=2.394+R*.081;_e(Je,"Left curled support finger",e,[[z,-.238,.069,.041,.039],[z+.009,-.214,.134,.037,.035],[z+.018,-.129-.009*R,.138,.034,.033],[z+.009,-.096-.009*R,.1,.011,.013]],19)}return ke(Je,"Thumb resting along far side of fore-end",e,[2.65,-.149,-.11],[.067,.079,.05]),i.userData.sculptRuntime={pose:"fixed",parts:Tt,sockets:{rightWrist:Vt[0],leftWrist:Vt[1],rightGrip:Gt[0],leftForeEnd:Gt[1]}},i}async function R0(){let i=await zl(),t=new URLSearchParams(location.search).has("capture"),e=document.querySelector("[data-figure-stage]"),n=document.querySelector("output"),s=new bs({antialias:!0,preserveDrawingBuffer:t});s.setPixelRatio(Math.min(devicePixelRatio,2)),s.toneMapping=Ma,s.toneMappingExposure=1.06,s.shadowMap.enabled=!0,s.shadowMap.type=va,e.append(s.domElement);let r=new qi;r.background=new ne(6841705);let a=new Yi(s),o=new Zr;r.environment=a.fromScene(o,.038).texture,o.dispose(),a.dispose(),r.environmentIntensity=.68;let c=new ji(16771031,2.25);c.position.set(-5,10,6),c.castShadow=!0,c.shadow.mapSize.set(1024,1024),c.shadow.camera.left=c.shadow.camera.bottom=-5,c.shadow.camera.right=c.shadow.camera.top=5,c.shadow.normalBias=.02,c.shadow.bias=-2e-4;let l=new ji(15788799,1.4);l.position.set(4,7,-5);let h=new ji(15787230,.68);h.position.set(-.5,3,8),r.add(c,h,l,new Br(15855350,10980986,.87));let u=new le(new Ss(80,80),new Or({opacity:.19}));u.rotation.x=-Math.PI/2,u.position.y=-.009,u.receiveShadow=!0,r.add(u,i),i.updateMatrixWorld(!0);let d=new Xi(-4,4,4,-4,.05,70),p=new qr(d,s.domElement);p.enablePan=!1,p.minZoom=.61,p.maxZoom=5.5;let g=()=>s.render(r,d);p.addEventListener("change",g),s.domElement.addEventListener("webglcontextrestored",g);let _={hero:[-53,1.5],front:[0,5],right:[-90,6,[0,2.95,1.55],7.25],rear:[180,6],left:[90,6,[0,2.95,1.55],7.25],overhead:[-15,89.95,[0,2.75,1.4],6.5],portrait:[0,1,[0,5.1,0],2.52]},m=6.94;function f(){let k=e.clientWidth/e.clientHeight,ct=Math.max(m,m*.83/k);d.top=ct/2,d.bottom=-d.top,d.right=ct*k/2,d.left=-d.right,d.updateProjectionMatrix()}function b(k,ct,H=[0,3,1.02],Q=6.75){m=Q,d.zoom=1;let xt=Ye.degToRad(k),Tt=Ye.degToRad(90-ct);p.target.set(...H),d.position.setFromSphericalCoords(15,Tt,xt).add(p.target),f(),p.update(),g()}for(let k of document.querySelectorAll("[data-view]"))k.addEventListener("click",()=>{document.querySelector('[data-view][aria-pressed="true"]')?.setAttribute("aria-pressed","false"),k.setAttribute("aria-pressed","true"),b(..._[k.dataset.view])});new ResizeObserver(()=>{s.setSize(e.clientWidth,e.clientHeight),f(),g()}).observe(e);let x={head:"\u982D\u8207\u4E94\u5B98",glasses:"\u773C\u93E1",cap:"\u7D05\u5E3D\u8207\u982D\u9AEE",headset:"\u8033\u7F69\u8207\u9EA5\u514B\u98A8",scarf:"\u9818\u5DFE",torso:"\u80CC\u5FC3\u8207\u8170\u5E36",pack:"\u80CC\u5305\u8207\u5929\u7DDA",sleeves:"\u8896\u5B50\u8207\u524D\u81C2",gloves:"\u96D9\u624B\u8207\u624B\u5957",trousers:"\u5DE5\u4F5C\u8932",boots:"\u76AE\u9774",rifle:"\u72D9\u64CA\u69CD"},A=i.userData.sculptRuntime.parts,L=new Map(Object.entries(A).map(([k,ct])=>[ct,k])),w=new Map(Object.values(A).map(k=>[k,k.position.clone()])),T=new P(0,2.98,.28),W=new Map(Object.values(A).map(k=>[k,new Un().setFromObject(k).getCenter(new P)])),v=[];function E(k){for(;k&&!L.has(k);)k=k.parent;return k}i.traverse(k=>{k.isMesh&&v.push(k)});let B=new Map(v.map(k=>[k,k.material])),K=[new pn({color:11053224,roughness:.8}),new pn({color:11053224,roughness:.8,side:Oe})],ot=new pn({color:9552846,roughness:.65,side:Oe}),U,F=!1;function Y(){for(let k of v){let ct=B.get(k);k.material=U&&E(k)===U?ot:F?K[+(ct.side===Oe)]:ct}g()}function $(k){F=k,document.querySelector("[data-clay]").setAttribute("aria-pressed",String(k)),Y()}document.querySelector("[data-clay]").addEventListener("click",()=>$(!F));let J=document.querySelector("[data-split]");J.addEventListener("click",()=>{let k=J.getAttribute("aria-pressed")==="false";J.setAttribute("aria-pressed",String(k));let ct=new Map;for(let H of Object.values(A))H.position.copy(w.get(H)),ct.set(H,W.get(H).clone().sub(T).multiplyScalar(.3));if(i.updateMatrixWorld(!0),k){let H=new Map;for(let Q of Object.values(A)){let xt=ct.get(Q).clone(),Tt=E(Q.parent);Tt&&xt.sub(ct.get(Tt));let yt=Q.parent.getWorldPosition(new P);H.set(Q,Q.parent.worldToLocal(yt.add(xt)))}for(let[Q,xt]of H)Q.position.add(xt)}b(..._.hero.slice(0,2),void 0,k?8.75:6.75)});let q=new Hr,tt;s.domElement.addEventListener("pointerdown",k=>{tt=[k.clientX,k.clientY]}),s.domElement.addEventListener("pointerup",k=>{if(!tt||Math.hypot(k.clientX-tt[0],k.clientY-tt[1])>5)return;let ct=s.domElement.getBoundingClientRect();q.setFromCamera(new at(2*(k.clientX-ct.left)/ct.width-1,1-2*(k.clientY-ct.top)/ct.height),d);let H=q.intersectObject(i,!0)[0],Q=H&&E(H.object);U=U===Q?void 0:Q,n.textContent=U?x[L.get(U)]:"\u9EDE\u9078\u96F6\u4EF6\u53EF\u67E5\u770B\u540D\u7A31",Y()}),b(..._.hero),t&&(window.__marksmanCapture={setView:b,setGray:$,model:i,camera:d,renderer:s,draw:g})}R0().catch(i=>{document.querySelector("[data-figure-stage]").textContent="\u7121\u6CD5\u8F09\u5165 MK3",console.error(i)});})();
