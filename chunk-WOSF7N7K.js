import{P as s,S,Z as r,aa as M}from"./chunk-YGL3YCXZ.js";import{j as C,p as w}from"./chunk-3KHYFKH4.js";import{$a as f,S as a,T as m,W as p,X as u,Zb as b,_b as k,a as l,ab as g,b as c,db as h,jc as v,pa as d,qb as y}from"./chunk-G6MH4OCE.js";var j=class e{constructor(o){this.http=o}getCompanyBySlug(o){let n=r.getUrl(o,"companies");return this.http.get(n)}followCompany(o){let n=r.getUrl(`${o}/follow`,"companies");return this.http.post(n,{})}unfollowCompany(o){let n=r.getUrl(`${o}/follow`,"companies");return this.http.post(n,{})}getCompanyJobs(o){let n=r.getUrl(`${o}/jobs`,"companies");return this.http.get(n)}static \u0275fac=function(n){return new(n||e)(p(w))};static \u0275prov=a({token:e,factory:e.\u0275fac,providedIn:"root"})};var F=`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;var _={root:{position:"relative"}},z={root:({instance:e})=>["p-skeleton p-component",{"p-skeleton-circle":e.shape==="circle","p-skeleton-animation-none":e.animation==="none"}]},I=(()=>{class e extends S{name="skeleton";theme=F;classes=z;inlineStyles=_;static \u0275fac=(()=>{let n;return function(i){return(n||(n=d(e)))(i||e)}})();static \u0275prov=a({token:e,factory:e.\u0275fac})}return e})();var B=(()=>{class e extends M{styleClass;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=u(I);get containerStyle(){let n=this._componentStyle?.inlineStyles.root,t;return this.size?t=c(l({},n),{width:this.size,height:this.size,borderRadius:this.borderRadius}):t=c(l({},n),{width:this.width,height:this.height,borderRadius:this.borderRadius}),t}static \u0275fac=(()=>{let n;return function(i){return(n||(n=d(e)))(i||e)}})();static \u0275cmp=f({type:e,selectors:[["p-skeleton"]],hostVars:7,hostBindings:function(t,i){t&2&&(y("aria-hidden",!0)("data-pc-name","skeleton")("data-pc-section","root"),b(i.containerStyle),k(i.cn(i.cx("root"),i.styleClass)))},inputs:{styleClass:"styleClass",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},features:[v([I]),h],decls:0,vars:0,template:function(t,i){},dependencies:[C,s],encapsulation:2,changeDetection:0})}return e})(),K=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=g({type:e});static \u0275inj=m({imports:[B,s,s]})}return e})();export{j as a,B as b,K as c};
