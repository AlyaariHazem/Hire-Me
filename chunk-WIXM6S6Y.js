import{A as Fe,Aa as Ge,B as zt,Ba as _e,C as dt,Da as Qt,E as Lt,Ea as jt,F as Ke,Fa as Kt,G as Dt,H as At,I as ke,Ia as Re,J as ce,Ja as We,K as $e,L as J,La as $t,R as se,V as Rt,Z as Pt,b as rt,c as Tt,h as Ot,k as fe,l as oe,m as Vt,n as Et,o as Se,q as Ft,s as Te,t as at,u as Oe,ua as Y,v as kt,va as qe,x as ct,xa as Bt,y as Mt,ya as Ht,z as Ee,za as Nt}from"./chunk-ZVBFXH3G.js";import{c as St,d as it,f as nt,h as ot,i as lt,j as st}from"./chunk-OVMELZYD.js";import{b as It,c as je,d as Ce,e as Ie,f as we,j as ne,k as De,o as Ae,p as wt}from"./chunk-7IBYSJKF.js";import{$ as x,$a as pe,$b as gt,Ab as ae,Ac as v,Bb as M,Bc as Qe,Cb as z,Db as L,Eb as N,Fb as _t,Jb as D,Kb as r,Lb as ue,Mb as he,Na as c,Nb as w,Ob as Q,P as ht,Pb as u,Q as K,Qb as h,R as ve,Rb as ie,Sb as He,Ta as de,U as mt,Ub as ze,V as P,Vb as m,Wb as xe,Xb as Le,Yb as tt,Za as R,_ as b,_a as be,a as ee,aa as H,ac as yt,b as Me,bb as I,bc as vt,cb as p,dc as q,eb as V,ec as Ne,fb as Ve,fc as A,gc as me,hc as bt,ia as le,jc as xt,ma as ft,na as y,nb as k,nc as G,ob as Je,pb as Ye,sc as $,tc as Ct,ub as a,vb as f,vc as O,wb as _,xb as te,yb as Xe,zb as et}from"./chunk-L43F6PFV.js";var qt=class t{constructor(s){this.http=s}getApplications(s){let e=se.getUrl("","applications"),i=new Ae;return s&&Object.entries(s).forEach(([n,o])=>{o!=null&&(i=i.set(n,String(o)))}),this.http.get(e,{params:i})}getJobApplications(s,e){let i=se.getUrl("job-applications","applications"),n=new Ae;return n=n.set("job",String(s)),e&&Object.entries(e).forEach(([o,l])=>{l!=null&&(n=n.set(o,String(l)))}),this.http.get(i,{params:n})}getAllJobApplications(s){let e=se.getUrl("job-applications","applications"),i=new Ae;return s&&Object.entries(s).forEach(([n,o])=>{o!=null&&(i=i.set(n,String(o)))}),this.http.get(e,{params:i})}getMyApplications(s){let e=se.getUrl("my-applications","applications"),i=new Ae;return s&&Object.entries(s).forEach(([n,o])=>{o!=null&&(i=i.set(n,String(o)))}),this.http.get(e,{params:i})}applyToJob(s){let e=se.getUrl("apply","applications");return this.http.post(e,{job:s})}applyToJobWithData(s){let e=se.getUrl("apply","applications");return this.http.post(e,s)}getApplicationStatistics(){let s=se.getUrl("statistics","applications");return this.http.get(s)}getApplicationById(s){let e=se.getUrl(`${s}`,"applications");return this.http.get(e)}updateApplicationStatus(s,e){let i=se.getUrl(`${s}`,"applications")+"update/";return this.http.patch(i,{status:e})}static \u0275fac=function(e){return new(e||t)(mt(wt))};static \u0275prov=K({token:t,factory:t.\u0275fac,providedIn:"root"})};var Ue=(()=>{class t extends Y{modelValue=le(void 0);$filled=$(()=>Ee(this.modelValue()));writeModelValue(e){this.modelValue.set(e)}static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275dir=pe({type:t,features:[I]})}return t})();var Gt=`
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`;var bi=`
    ${Gt}

    /* For PrimeNG */
   .p-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,xi={root:({instance:t})=>["p-inputtext p-component",{"p-filled":t.$filled(),"p-inputtext-sm":t.pSize==="small","p-inputtext-lg":t.pSize==="large","p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-inputtext-fluid":t.hasFluid}]},Wt=(()=>{class t extends J{name="inputtext";theme=bi;classes=xi;static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275prov=K({token:t,factory:t.\u0275fac})}return t})();var Ut=(()=>{class t extends Ue{ngControl=P(Pt,{optional:!0,self:!0});pcFluid=P(Ge,{optional:!0,host:!0,skipSelf:!0});pSize;variant=O();fluid=O(void 0,{transform:v});invalid=O(void 0,{transform:v});$variant=$(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());_componentStyle=P(Wt);ngAfterViewInit(){super.ngAfterViewInit(),this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value),this.cd.detectChanges()}ngDoCheck(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275dir=pe({type:t,selectors:[["","pInputText",""]],hostVars:2,hostBindings:function(i,n){i&1&&D("input",function(l){return n.onInput(l)}),i&2&&m(n.cx("root"))},inputs:{pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},features:[q([Wt]),I]})}return t})(),wl=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=be({type:t});static \u0275inj=ve({})}return t})();var Zt=(()=>{class t extends Ue{required=O(void 0,{transform:v});invalid=O(void 0,{transform:v});disabled=O(void 0,{transform:v});name=O();_disabled=le(!1);$disabled=$(()=>this.disabled()||this._disabled());onModelChange=()=>{};onModelTouched=()=>{};writeDisabledState(e){this._disabled.set(e)}writeControlValue(e,i){}writeValue(e){this.writeControlValue(e,this.writeModelValue.bind(this))}registerOnChange(e){this.onModelChange=e}registerOnTouched(e){this.onModelTouched=e}setDisabledState(e){this.writeDisabledState(e),this.cd.markForCheck()}static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275dir=pe({type:t,inputs:{required:[1,"required"],invalid:[1,"invalid"],disabled:[1,"disabled"],name:[1,"name"]},features:[I]})}return t})();var Jt=(()=>{class t extends Zt{pcFluid=P(Ge,{optional:!0,host:!0,skipSelf:!0});fluid=O(void 0,{transform:v});variant=O();size=O();inputSize=O();pattern=O();min=O();max=O();step=O();minlength=O();maxlength=O();$variant=$(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275dir=pe({type:t,inputs:{fluid:[1,"fluid"],variant:[1,"variant"],size:[1,"size"],inputSize:[1,"inputSize"],pattern:[1,"pattern"],min:[1,"min"],max:[1,"max"],step:[1,"step"],minlength:[1,"minlength"],maxlength:[1,"maxlength"]},features:[I]})}return t})();var Yt=`
    .p-iconfield {
        position: relative;
        display: block;
    }

    .p-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .p-iconfield .p-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputtext:not(:first-child),
    .p-iconfield .p-inputwrapper:not(:first-child) .p-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield:has(.p-inputfield-sm) .p-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .p-iconfield:has(.p-inputfield-lg) .p-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`;var Ci=["*"],Ii={root:({instance:t})=>["p-iconfield",{"p-iconfield-left":t.iconPosition=="left","p-iconfield-right":t.iconPosition=="right"}]},Xt=(()=>{class t extends J{name="iconfield";theme=Yt;classes=Ii;static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275prov=K({token:t,factory:t.\u0275fac})}return t})();var ei=(()=>{class t extends Y{iconPosition="left";styleClass;_componentStyle=P(Xt);static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=R({type:t,selectors:[["p-iconfield"],["p-iconField"],["p-icon-field"]],hostVars:2,hostBindings:function(i,n){i&2&&m(n.cn(n.cx("root"),n.styleClass))},inputs:{iconPosition:"iconPosition",styleClass:"styleClass"},features:[q([Xt]),I],ngContentSelectors:Ci,decls:1,vars:0,template:function(i,n){i&1&&(ue(),he(0))},dependencies:[ne],encapsulation:2,changeDetection:0})}return t})();var wi=["data-p-icon","blank"],ti=(()=>{class t extends _e{static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=R({type:t,selectors:[["","data-p-icon","blank"]],features:[I],attrs:wi,decls:1,vars:0,consts:[["width","1","height","1","fill","currentColor","fill-opacity","0"]],template:function(i,n){i&1&&(H(),ae(0,"rect",0))},encapsulation:2})}return t})();var Si=["data-p-icon","check"],ii=(()=>{class t extends _e{static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=R({type:t,selectors:[["","data-p-icon","check"]],features:[I],attrs:Si,decls:1,vars:0,consts:[["d","M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z","fill","currentColor"]],template:function(i,n){i&1&&(H(),ae(0,"path",0))},encapsulation:2})}return t})();var Ti=["data-p-icon","chevron-down"],ni=(()=>{class t extends _e{static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=R({type:t,selectors:[["","data-p-icon","chevron-down"]],features:[I],attrs:Ti,decls:1,vars:0,consts:[["d","M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z","fill","currentColor"]],template:function(i,n){i&1&&(H(),ae(0,"path",0))},encapsulation:2})}return t})();var Oi=["data-p-icon","search"],oi=(()=>{class t extends _e{pathId;ngOnInit(){super.ngOnInit(),this.pathId="url(#"+Ke()+")"}static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=R({type:t,selectors:[["","data-p-icon","search"]],features:[I],attrs:Oi,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(i,n){i&1&&(H(),Xe(0,"g"),ae(1,"path",0),et(),Xe(2,"defs")(3,"clipPath",1),ae(4,"rect",2),et()()),i&2&&(k("clip-path",n.pathId),c(3),_t("id",n.pathId))},encapsulation:2})}return t})();var Vi=["*"],Ei={root:"p-inputicon"},li=(()=>{class t extends J{name="inputicon";classes=Ei;static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275prov=K({token:t,factory:t.\u0275fac})}return t})(),si=(()=>{class t extends Y{styleClass;_componentStyle=P(li);static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=R({type:t,selectors:[["p-inputicon"],["p-inputIcon"]],hostVars:2,hostBindings:function(i,n){i&2&&m(n.cn(n.cx("root"),n.styleClass))},inputs:{styleClass:"styleClass"},features:[q([li]),I],ngContentSelectors:Vi,decls:1,vars:0,template:function(i,n){i&1&&(ue(),he(0))},dependencies:[ne,ce],encapsulation:2,changeDetection:0})}return t})();var ri=["content"],ki=["overlay"],Mi=["*"],zi=(t,s,e,i,n,o,l,d,F,T,S,U,B,Z)=>({"p-overlay p-component":!0,"p-overlay-modal p-overlay-mask p-overlay-mask-enter":t,"p-overlay-center":s,"p-overlay-top":e,"p-overlay-top-start":i,"p-overlay-top-end":n,"p-overlay-bottom":o,"p-overlay-bottom-start":l,"p-overlay-bottom-end":d,"p-overlay-left":F,"p-overlay-left-start":T,"p-overlay-left-end":S,"p-overlay-right":U,"p-overlay-right-start":B,"p-overlay-right-end":Z}),Li=(t,s,e)=>({showTransitionParams:t,hideTransitionParams:s,transform:e}),Di=t=>({value:"visible",params:t}),Ai=t=>({mode:t}),Ri=t=>({$implicit:t});function Pi(t,s){t&1&&L(0)}function Bi(t,s){if(t&1){let e=N();f(0,"div",3,1),D("click",function(n){b(e);let o=r(2);return x(o.onOverlayContentClick(n))})("@overlayContentAnimation.start",function(n){b(e);let o=r(2);return x(o.onOverlayContentAnimationStart(n))})("@overlayContentAnimation.done",function(n){b(e);let o=r(2);return x(o.onOverlayContentAnimationDone(n))}),he(2),p(3,Pi,1,0,"ng-container",4),_()}if(t&2){let e=r(2);m(e.contentStyleClass),a("ngStyle",e.contentStyle)("ngClass","p-overlay-content")("@overlayContentAnimation",A(11,Di,bt(7,Li,e.showTransitionOptions,e.hideTransitionOptions,e.transformOptions[e.modal?e.overlayResponsiveDirection:"default"]))),c(3),a("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",A(15,Ri,A(13,Ai,e.overlayMode)))}}function Hi(t,s){if(t&1){let e=N();f(0,"div",3,0),D("click",function(){b(e);let n=r();return x(n.onOverlayClick())}),p(2,Bi,4,17,"div",2),_()}if(t&2){let e=r();m(e.styleClass),a("ngStyle",e.style)("ngClass",xt(5,zi,[e.modal,e.modal&&e.overlayResponsiveDirection==="center",e.modal&&e.overlayResponsiveDirection==="top",e.modal&&e.overlayResponsiveDirection==="top-start",e.modal&&e.overlayResponsiveDirection==="top-end",e.modal&&e.overlayResponsiveDirection==="bottom",e.modal&&e.overlayResponsiveDirection==="bottom-start",e.modal&&e.overlayResponsiveDirection==="bottom-end",e.modal&&e.overlayResponsiveDirection==="left",e.modal&&e.overlayResponsiveDirection==="left-start",e.modal&&e.overlayResponsiveDirection==="left-end",e.modal&&e.overlayResponsiveDirection==="right",e.modal&&e.overlayResponsiveDirection==="right-start",e.modal&&e.overlayResponsiveDirection==="right-end"])),c(2),a("ngIf",e.visible)}}var Ni=`
.p-overlay {
    position: absolute;
    top: 0;
}

.p-overlay-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-content {
    transform-origin: inherit;
}

/* Github Issue #18560 */
.p-component-overlay.p-component {
    position: relative;
}

.p-overlay-modal > .p-overlay-content {
    z-index: 1;
    width: 90%;
}

/* Position */
/* top */
.p-overlay-top {
    align-items: flex-start;
}
.p-overlay-top-start {
    align-items: flex-start;
    justify-content: flex-start;
}
.p-overlay-top-end {
    align-items: flex-start;
    justify-content: flex-end;
}

/* bottom */
.p-overlay-bottom {
    align-items: flex-end;
}
.p-overlay-bottom-start {
    align-items: flex-end;
    justify-content: flex-start;
}
.p-overlay-bottom-end {
    align-items: flex-end;
    justify-content: flex-end;
}

/* left */
.p-overlay-left {
    justify-content: flex-start;
}
.p-overlay-left-start {
    justify-content: flex-start;
    align-items: flex-start;
}
.p-overlay-left-end {
    justify-content: flex-start;
    align-items: flex-end;
}

/* right */
.p-overlay-right {
    justify-content: flex-end;
}
.p-overlay-right-start {
    justify-content: flex-end;
    align-items: flex-start;
}
.p-overlay-right-end {
    justify-content: flex-end;
    align-items: flex-end;
}
`,ai=(()=>{class t extends J{name="overlay";theme=Ni;static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275prov=K({token:t,factory:t.\u0275fac})}return t})(),Qi=lt([nt({transform:"{{transform}}",opacity:0}),it("{{showTransitionParams}}")]),ji=lt([it("{{hideTransitionParams}}",nt({transform:"{{transform}}",opacity:0}))]),di=(()=>{class t extends Y{overlayService;zone;get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.modalVisible&&(this.modalVisible=!0)}get mode(){return this._mode||this.overlayOptions?.mode}set mode(e){this._mode=e}get style(){return Re.merge(this._style,this.modal?this.overlayResponsiveOptions?.style:this.overlayOptions?.style)}set style(e){this._style=e}get styleClass(){return Re.merge(this._styleClass,this.modal?this.overlayResponsiveOptions?.styleClass:this.overlayOptions?.styleClass)}set styleClass(e){this._styleClass=e}get contentStyle(){return Re.merge(this._contentStyle,this.modal?this.overlayResponsiveOptions?.contentStyle:this.overlayOptions?.contentStyle)}set contentStyle(e){this._contentStyle=e}get contentStyleClass(){return Re.merge(this._contentStyleClass,this.modal?this.overlayResponsiveOptions?.contentStyleClass:this.overlayOptions?.contentStyleClass)}set contentStyleClass(e){this._contentStyleClass=e}get target(){let e=this._target||this.overlayOptions?.target;return e===void 0?"@prev":e}set target(e){this._target=e}get autoZIndex(){let e=this._autoZIndex||this.overlayOptions?.autoZIndex;return e===void 0?!0:e}set autoZIndex(e){this._autoZIndex=e}get baseZIndex(){let e=this._baseZIndex||this.overlayOptions?.baseZIndex;return e===void 0?0:e}set baseZIndex(e){this._baseZIndex=e}get showTransitionOptions(){let e=this._showTransitionOptions||this.overlayOptions?.showTransitionOptions;return e===void 0?".12s cubic-bezier(0, 0, 0.2, 1)":e}set showTransitionOptions(e){this._showTransitionOptions=e}get hideTransitionOptions(){let e=this._hideTransitionOptions||this.overlayOptions?.hideTransitionOptions;return e===void 0?".1s linear":e}set hideTransitionOptions(e){this._hideTransitionOptions=e}get listener(){return this._listener||this.overlayOptions?.listener}set listener(e){this._listener=e}get responsive(){return this._responsive||this.overlayOptions?.responsive}set responsive(e){this._responsive=e}get options(){return this._options}set options(e){this._options=e}appendTo=O(void 0);visibleChange=new V;onBeforeShow=new V;onShow=new V;onBeforeHide=new V;onHide=new V;onAnimationStart=new V;onAnimationDone=new V;overlayViewChild;contentViewChild;contentTemplate;templates;hostAttrSelector=O();$appendTo=$(()=>this.appendTo()||this.config.overlayAppendTo());_contentTemplate;_visible=!1;_mode;_style;_styleClass;_contentStyle;_contentStyleClass;_target;_autoZIndex;_baseZIndex;_showTransitionOptions;_hideTransitionOptions;_listener;_responsive;_options;modalVisible=!1;isOverlayClicked=!1;isOverlayContentClicked=!1;scrollHandler;documentClickListener;documentResizeListener;_componentStyle=P(ai);documentKeyboardListener;window;transformOptions={default:"scaleY(0.8)",center:"scale(0.7)",top:"translate3d(0px, -100%, 0px)","top-start":"translate3d(0px, -100%, 0px)","top-end":"translate3d(0px, -100%, 0px)",bottom:"translate3d(0px, 100%, 0px)","bottom-start":"translate3d(0px, 100%, 0px)","bottom-end":"translate3d(0px, 100%, 0px)",left:"translate3d(-100%, 0px, 0px)","left-start":"translate3d(-100%, 0px, 0px)","left-end":"translate3d(-100%, 0px, 0px)",right:"translate3d(100%, 0px, 0px)","right-start":"translate3d(100%, 0px, 0px)","right-end":"translate3d(100%, 0px, 0px)"};get modal(){if(De(this.platformId))return this.mode==="modal"||this.overlayResponsiveOptions&&this.document.defaultView?.matchMedia(this.overlayResponsiveOptions.media?.replace("@media","")||`(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches}get overlayMode(){return this.mode||(this.modal?"modal":"overlay")}get overlayOptions(){return ee(ee({},this.config?.overlayOptions),this.options)}get overlayResponsiveOptions(){return ee(ee({},this.overlayOptions?.responsive),this.responsive)}get overlayResponsiveDirection(){return this.overlayResponsiveOptions?.direction||"center"}get overlayEl(){return this.overlayViewChild?.nativeElement}get contentEl(){return this.contentViewChild?.nativeElement}get targetEl(){return Ot(this.target,this.el?.nativeElement)}constructor(e,i){super(),this.overlayService=e,this.zone=i}ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}show(e,i=!1){this.onVisibleChange(!0),this.handleEvents("onShow",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&oe(this.targetEl),this.modal&&rt(this.document?.body,"p-overflow-hidden")}hide(e,i=!1){if(this.visible)this.onVisibleChange(!1),this.handleEvents("onHide",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),i&&oe(this.targetEl),this.modal&&Tt(this.document?.body,"p-overflow-hidden");else return}alignOverlay(){!this.modal&&qe.alignOverlay(this.overlayEl,this.targetEl,this.$appendTo())}onVisibleChange(e){this._visible=e,this.visibleChange.emit(e)}onOverlayClick(){this.isOverlayClicked=!0}onOverlayContentClick(e){this.overlayService.add({originalEvent:e,target:this.targetEl}),this.isOverlayContentClicked=!0}onOverlayContentAnimationStart(e){switch(e.toState){case"visible":this.handleEvents("onBeforeShow",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.autoZIndex&&We.set(this.overlayMode,this.overlayEl,this.baseZIndex+this.config?.zIndex[this.overlayMode]),this.hostAttrSelector()&&this.overlayEl.setAttribute(this.hostAttrSelector(),""),qe.appendOverlay(this.overlayEl,this.$appendTo()==="body"?this.document.body:this.$appendTo(),this.$appendTo()),this.alignOverlay();break;case"void":this.handleEvents("onBeforeHide",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.modal&&rt(this.overlayEl,"p-overlay-mask-leave");break}this.handleEvents("onAnimationStart",e)}onOverlayContentAnimationDone(e){let i=this.overlayEl||e.element.parentElement;switch(e.toState){case"visible":this.visible&&(this.show(i,!0),this.bindListeners());break;case"void":if(!this.visible){this.hide(i,!0),this.modalVisible=!1,this.unbindListeners(),qe.appendOverlay(this.overlayEl,this.targetEl,this.$appendTo()),We.clear(i),this.cd.markForCheck();break}}this.handleEvents("onAnimationDone",e)}handleEvents(e,i){this[e].emit(i),this.options&&this.options[e]&&this.options[e](i),this.config?.overlayOptions&&(this.config?.overlayOptions)[e]&&(this.config?.overlayOptions)[e](i)}bindListeners(){this.bindScrollListener(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindDocumentKeyboardListener()}unbindListeners(){this.unbindScrollListener(),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindDocumentKeyboardListener()}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new Ht(this.targetEl,e=>{(this.listener?this.listener(e,{type:"scroll",mode:this.overlayMode,valid:!0}):!0)&&this.hide(e,!0)})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}bindDocumentClickListener(){this.documentClickListener||(this.documentClickListener=this.renderer.listen(this.document,"click",e=>{let n=!(this.targetEl&&(this.targetEl.isSameNode(e.target)||!this.isOverlayClicked&&this.targetEl.contains(e.target)))&&!this.isOverlayContentClicked;(this.listener?this.listener(e,{type:"outside",mode:this.overlayMode,valid:e.which!==3&&n}):n)&&this.hide(e),this.isOverlayClicked=this.isOverlayContentClicked=!1}))}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}bindDocumentResizeListener(){this.documentResizeListener||(this.documentResizeListener=this.renderer.listen(this.document.defaultView,"resize",e=>{(this.listener?this.listener(e,{type:"resize",mode:this.overlayMode,valid:!Oe()}):!Oe())&&this.hide(e,!0)}))}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindDocumentKeyboardListener(){this.documentKeyboardListener||this.zone.runOutsideAngular(()=>{this.documentKeyboardListener=this.renderer.listen(this.document.defaultView,"keydown",e=>{if(this.overlayOptions.hideOnEscape===!1||e.code!=="Escape")return;(this.listener?this.listener(e,{type:"keydown",mode:this.overlayMode,valid:!Oe()}):!Oe())&&this.zone.run(()=>{this.hide(e,!0)})})})}unbindDocumentKeyboardListener(){this.documentKeyboardListener&&(this.documentKeyboardListener(),this.documentKeyboardListener=null)}ngOnDestroy(){this.hide(this.overlayEl,!0),this.overlayEl&&this.$appendTo()!=="self"&&(this.renderer.appendChild(this.el.nativeElement,this.overlayEl),We.clear(this.overlayEl)),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.unbindListeners(),super.ngOnDestroy()}static \u0275fac=function(i){return new(i||t)(de(At),de(Ve))};static \u0275cmp=R({type:t,selectors:[["p-overlay"]],contentQueries:function(i,n,o){if(i&1&&(w(o,ri,4),w(o,ke,4)),i&2){let l;u(l=h())&&(n.contentTemplate=l.first),u(l=h())&&(n.templates=l)}},viewQuery:function(i,n){if(i&1&&(Q(ki,5),Q(ri,5)),i&2){let o;u(o=h())&&(n.overlayViewChild=o.first),u(o=h())&&(n.contentViewChild=o.first)}},inputs:{visible:"visible",mode:"mode",style:"style",styleClass:"styleClass",contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",target:"target",autoZIndex:"autoZIndex",baseZIndex:"baseZIndex",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",listener:"listener",responsive:"responsive",options:"options",appendTo:[1,"appendTo"],hostAttrSelector:[1,"hostAttrSelector"]},outputs:{visibleChange:"visibleChange",onBeforeShow:"onBeforeShow",onShow:"onShow",onBeforeHide:"onBeforeHide",onHide:"onHide",onAnimationStart:"onAnimationStart",onAnimationDone:"onAnimationDone"},features:[q([ai]),I],ngContentSelectors:Mi,decls:1,vars:1,consts:[["overlay",""],["content",""],[3,"ngStyle","class","ngClass","click",4,"ngIf"],[3,"click","ngStyle","ngClass"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,n){i&1&&(ue(),p(0,Hi,3,20,"div",2)),i&2&&a("ngIf",n.modalVisible)},dependencies:[ne,It,Ce,we,Ie,ce],encapsulation:2,data:{animation:[St("overlayContentAnimation",[ot(":enter",[st(Qi)]),ot(":leave",[st(ji)])])]},changeDetection:0})}return t})();var pi=["content"],Ki=["item"],$i=["loader"],qi=["loadericon"],Gi=["element"],Wi=["*"],pt=(t,s)=>({$implicit:t,options:s}),Ui=t=>({numCols:t}),hi=t=>({options:t}),Zi=()=>({styleClass:"p-virtualscroller-loading-icon"}),Ji=(t,s)=>({rows:t,columns:s});function Yi(t,s){t&1&&L(0)}function Xi(t,s){if(t&1&&(M(0),p(1,Yi,1,0,"ng-container",10),z()),t&2){let e=r(2);c(),a("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",me(2,pt,e.loadedItems,e.getContentOptions()))}}function en(t,s){t&1&&L(0)}function tn(t,s){if(t&1&&(M(0),p(1,en,1,0,"ng-container",10),z()),t&2){let e=s.$implicit,i=s.index,n=r(3);c(),a("ngTemplateOutlet",n.itemTemplate||n._itemTemplate)("ngTemplateOutletContext",me(2,pt,e,n.getOptions(i)))}}function nn(t,s){if(t&1&&(f(0,"div",null,3),p(2,tn,2,5,"ng-container",11),_()),t&2){let e=r(2);ze(e.contentStyle),m(e.cn(e.cx("content"),e.contentStyleClass)),k("data-pc-section","content"),c(2),a("ngForOf",e.loadedItems)("ngForTrackBy",e._trackBy)}}function on(t,s){if(t&1&&te(0,"div",12),t&2){let e=r(2);m(e.cx("spacer")),a("ngStyle",e.spacerStyle),k("data-pc-section","spacer")}}function ln(t,s){t&1&&L(0)}function sn(t,s){if(t&1&&(M(0),p(1,ln,1,0,"ng-container",10),z()),t&2){let e=s.index,i=r(4);c(),a("ngTemplateOutlet",i.loaderTemplate||i._loaderTemplate)("ngTemplateOutletContext",A(4,hi,i.getLoaderOptions(e,i.both&&A(2,Ui,i.numItemsInViewport.cols))))}}function rn(t,s){if(t&1&&(M(0),p(1,sn,2,6,"ng-container",13),z()),t&2){let e=r(3);c(),a("ngForOf",e.loaderArr)}}function an(t,s){t&1&&L(0)}function cn(t,s){if(t&1&&(M(0),p(1,an,1,0,"ng-container",10),z()),t&2){let e=r(4);c(),a("ngTemplateOutlet",e.loaderIconTemplate||e._loaderIconTemplate)("ngTemplateOutletContext",A(3,hi,Ne(2,Zi)))}}function dn(t,s){if(t&1&&(H(),te(0,"svg",14)),t&2){let e=r(4);m(e.cx("loadingIcon")),a("spin",!0),k("data-pc-section","loadingIcon")}}function pn(t,s){if(t&1&&p(0,cn,2,5,"ng-container",6)(1,dn,1,4,"ng-template",null,5,G),t&2){let e=ie(2),i=r(3);a("ngIf",i.loaderIconTemplate||i._loaderIconTemplate)("ngIfElse",e)}}function un(t,s){if(t&1&&(f(0,"div"),p(1,rn,2,1,"ng-container",6)(2,pn,3,2,"ng-template",null,4,G),_()),t&2){let e=ie(3),i=r(2);m(i.cx("loader")),k("data-pc-section","loader"),c(),a("ngIf",i.loaderTemplate||i._loaderTemplate)("ngIfElse",e)}}function hn(t,s){if(t&1){let e=N();M(0),f(1,"div",7,1),D("scroll",function(n){b(e);let o=r();return x(o.onContainerScroll(n))}),p(3,Xi,2,5,"ng-container",6)(4,nn,3,7,"ng-template",null,2,G)(6,on,1,4,"div",8)(7,un,4,5,"div",9),_(),z()}if(t&2){let e=ie(5),i=r();c(),m(i.cn(i.cx("root"),i.styleClass)),a("ngStyle",i._style),k("id",i._id)("tabindex",i.tabindex)("data-pc-name","scroller")("data-pc-section","root"),c(2),a("ngIf",i.contentTemplate||i._contentTemplate)("ngIfElse",e),c(3),a("ngIf",i._showSpacer),c(),a("ngIf",!i.loaderDisabled&&i._showLoader&&i.d_loading)}}function mn(t,s){t&1&&L(0)}function fn(t,s){if(t&1&&(M(0),p(1,mn,1,0,"ng-container",10),z()),t&2){let e=r(2);c(),a("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",me(5,pt,e.items,me(2,Ji,e._items,e.loadedColumns)))}}function _n(t,s){if(t&1&&(he(0),p(1,fn,2,8,"ng-container",15)),t&2){let e=r();c(),a("ngIf",e.contentTemplate||e._contentTemplate)}}var gn=`
.p-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.p-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.p-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.p-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: dt('virtualscroller.loader.mask.background');
    color: dt('virtualscroller.loader.mask.color');
}

.p-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-virtualscroller-loading-icon {
    font-size: dt('virtualscroller.loader.icon.size');
    width: dt('virtualscroller.loader.icon.size');
    height: dt('virtualscroller.loader.icon.size');
}

.p-virtualscroller-horizontal > .p-virtualscroller-content {
    display: flex;
}

.p-virtualscroller-inline .p-virtualscroller-content {
    position: static;
}
`,yn={root:({instance:t})=>["p-virtualscroller",{"p-virtualscroller-inline":t.inline,"p-virtualscroller-both p-both-scroll":t.both,"p-virtualscroller-horizontal p-horizontal-scroll":t.horizontal}],content:"p-virtualscroller-content",spacer:"p-virtualscroller-spacer",loader:({instance:t})=>["p-virtualscroller-loader",{"p-virtualscroller-loader-mask":!t.loaderTemplate}],loadingIcon:"p-virtualscroller-loading-icon"},ui=(()=>{class t extends J{name="virtualscroller";theme=gn;classes=yn;static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275prov=K({token:t,factory:t.\u0275fac})}return t})();var mi=(()=>{class t extends Y{zone;get id(){return this._id}set id(e){this._id=e}get style(){return this._style}set style(e){this._style=e}get styleClass(){return this._styleClass}set styleClass(e){this._styleClass=e}get tabindex(){return this._tabindex}set tabindex(e){this._tabindex=e}get items(){return this._items}set items(e){this._items=e}get itemSize(){return this._itemSize}set itemSize(e){this._itemSize=e}get scrollHeight(){return this._scrollHeight}set scrollHeight(e){this._scrollHeight=e}get scrollWidth(){return this._scrollWidth}set scrollWidth(e){this._scrollWidth=e}get orientation(){return this._orientation}set orientation(e){this._orientation=e}get step(){return this._step}set step(e){this._step=e}get delay(){return this._delay}set delay(e){this._delay=e}get resizeDelay(){return this._resizeDelay}set resizeDelay(e){this._resizeDelay=e}get appendOnly(){return this._appendOnly}set appendOnly(e){this._appendOnly=e}get inline(){return this._inline}set inline(e){this._inline=e}get lazy(){return this._lazy}set lazy(e){this._lazy=e}get disabled(){return this._disabled}set disabled(e){this._disabled=e}get loaderDisabled(){return this._loaderDisabled}set loaderDisabled(e){this._loaderDisabled=e}get columns(){return this._columns}set columns(e){this._columns=e}get showSpacer(){return this._showSpacer}set showSpacer(e){this._showSpacer=e}get showLoader(){return this._showLoader}set showLoader(e){this._showLoader=e}get numToleratedItems(){return this._numToleratedItems}set numToleratedItems(e){this._numToleratedItems=e}get loading(){return this._loading}set loading(e){this._loading=e}get autoSize(){return this._autoSize}set autoSize(e){this._autoSize=e}get trackBy(){return this._trackBy}set trackBy(e){this._trackBy=e}get options(){return this._options}set options(e){this._options=e,e&&typeof e=="object"&&(Object.entries(e).forEach(([i,n])=>this[`_${i}`]!==n&&(this[`_${i}`]=n)),Object.entries(e).forEach(([i,n])=>this[`${i}`]!==n&&(this[`${i}`]=n)))}onLazyLoad=new V;onScroll=new V;onScrollIndexChange=new V;elementViewChild;contentViewChild;height;_id;_style;_styleClass;_tabindex=0;_items;_itemSize=0;_scrollHeight;_scrollWidth;_orientation="vertical";_step=0;_delay=0;_resizeDelay=10;_appendOnly=!1;_inline=!1;_lazy=!1;_disabled=!1;_loaderDisabled=!1;_columns;_showSpacer=!0;_showLoader=!1;_numToleratedItems;_loading;_autoSize=!1;_trackBy;_options;d_loading=!1;d_numToleratedItems;contentEl;contentTemplate;itemTemplate;loaderTemplate;loaderIconTemplate;templates;_contentTemplate;_itemTemplate;_loaderTemplate;_loaderIconTemplate;first=0;last=0;page=0;isRangeChanged=!1;numItemsInViewport=0;lastScrollPos=0;lazyLoadState={};loaderArr=[];spacerStyle={};contentStyle={};scrollTimeout;resizeTimeout;initialized=!1;windowResizeListener;defaultWidth;defaultHeight;defaultContentWidth;defaultContentHeight;_contentStyleClass;get contentStyleClass(){return this._contentStyleClass}set contentStyleClass(e){this._contentStyleClass=e}get vertical(){return this._orientation==="vertical"}get horizontal(){return this._orientation==="horizontal"}get both(){return this._orientation==="both"}get loadedItems(){return this._items&&!this.d_loading?this.both?this._items.slice(this._appendOnly?0:this.first.rows,this.last.rows).map(e=>this._columns?e:e.slice(this._appendOnly?0:this.first.cols,this.last.cols)):this.horizontal&&this._columns?this._items:this._items.slice(this._appendOnly?0:this.first,this.last):[]}get loadedRows(){return this.d_loading?this._loaderDisabled?this.loaderArr:[]:this.loadedItems}get loadedColumns(){return this._columns&&(this.both||this.horizontal)?this.d_loading&&this._loaderDisabled?this.both?this.loaderArr[0]:this.loaderArr:this._columns.slice(this.both?this.first.cols:this.first,this.both?this.last.cols:this.last):this._columns}_componentStyle=P(ui);constructor(e){super(),this.zone=e}ngOnInit(){super.ngOnInit(),this.setInitialState()}ngOnChanges(e){super.ngOnChanges(e);let i=!1;if(this.scrollHeight=="100%"&&(this.height="100%"),e.loading){let{previousValue:n,currentValue:o}=e.loading;this.lazy&&n!==o&&o!==this.d_loading&&(this.d_loading=o,i=!0)}if(e.orientation&&(this.lastScrollPos=this.both?{top:0,left:0}:0),e.numToleratedItems){let{previousValue:n,currentValue:o}=e.numToleratedItems;n!==o&&o!==this.d_numToleratedItems&&(this.d_numToleratedItems=o)}if(e.options){let{previousValue:n,currentValue:o}=e.options;this.lazy&&n?.loading!==o?.loading&&o?.loading!==this.d_loading&&(this.d_loading=o.loading,i=!0),n?.numToleratedItems!==o?.numToleratedItems&&o?.numToleratedItems!==this.d_numToleratedItems&&(this.d_numToleratedItems=o.numToleratedItems)}this.initialized&&!i&&(e.items?.previousValue?.length!==e.items?.currentValue?.length||e.itemSize||e.scrollHeight||e.scrollWidth)&&(this.init(),this.calculateAutoSize())}ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;case"item":this._itemTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"loadericon":this._loaderIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}ngAfterViewInit(){super.ngAfterViewInit(),Promise.resolve().then(()=>{this.viewInit()})}ngAfterViewChecked(){this.initialized||this.viewInit()}ngOnDestroy(){this.unbindResizeListener(),this.contentEl=null,this.initialized=!1,super.ngOnDestroy()}viewInit(){De(this.platformId)&&!this.initialized&&at(this.elementViewChild?.nativeElement)&&(this.setInitialState(),this.setContentEl(this.contentEl),this.init(),this.defaultWidth=Te(this.elementViewChild?.nativeElement),this.defaultHeight=Se(this.elementViewChild?.nativeElement),this.defaultContentWidth=Te(this.contentEl),this.defaultContentHeight=Se(this.contentEl),this.initialized=!0)}init(){this._disabled||(this.setSize(),this.calculateOptions(),this.setSpacerSize(),this.bindResizeListener(),this.cd.detectChanges())}setContentEl(e){this.contentEl=e||this.contentViewChild?.nativeElement||fe(this.elementViewChild?.nativeElement,".p-virtualscroller-content")}setInitialState(){this.first=this.both?{rows:0,cols:0}:0,this.last=this.both?{rows:0,cols:0}:0,this.numItemsInViewport=this.both?{rows:0,cols:0}:0,this.lastScrollPos=this.both?{top:0,left:0}:0,this.d_loading=this._loading||!1,this.d_numToleratedItems=this._numToleratedItems,this.loaderArr=[]}getElementRef(){return this.elementViewChild}getPageByFirst(e){return Math.floor(((e??this.first)+this.d_numToleratedItems*4)/(this._step||1))}isPageChanged(e){return this._step?this.page!==this.getPageByFirst(e??this.first):!0}scrollTo(e){this.elementViewChild?.nativeElement?.scrollTo(e)}scrollToIndex(e,i="auto"){if(this.both?e.every(o=>o>-1):e>-1){let o=this.first,{scrollTop:l=0,scrollLeft:d=0}=this.elementViewChild?.nativeElement,{numToleratedItems:F}=this.calculateNumItems(),T=this.getContentPosition(),S=this.itemSize,U=(C=0,E)=>C<=E?0:C,B=(C,E,X)=>C*E+X,Z=(C=0,E=0)=>this.scrollTo({left:C,top:E,behavior:i}),j=this.both?{rows:0,cols:0}:0,ge=!1,g=!1;this.both?(j={rows:U(e[0],F[0]),cols:U(e[1],F[1])},Z(B(j.cols,S[1],T.left),B(j.rows,S[0],T.top)),g=this.lastScrollPos.top!==l||this.lastScrollPos.left!==d,ge=j.rows!==o.rows||j.cols!==o.cols):(j=U(e,F),this.horizontal?Z(B(j,S,T.left),l):Z(d,B(j,S,T.top)),g=this.lastScrollPos!==(this.horizontal?d:l),ge=j!==o),this.isRangeChanged=ge,g&&(this.first=j)}}scrollInView(e,i,n="auto"){if(i){let{first:o,viewport:l}=this.getRenderedRange(),d=(S=0,U=0)=>this.scrollTo({left:S,top:U,behavior:n}),F=i==="to-start",T=i==="to-end";if(F){if(this.both)l.first.rows-o.rows>e[0]?d(l.first.cols*this._itemSize[1],(l.first.rows-1)*this._itemSize[0]):l.first.cols-o.cols>e[1]&&d((l.first.cols-1)*this._itemSize[1],l.first.rows*this._itemSize[0]);else if(l.first-o>e){let S=(l.first-1)*this._itemSize;this.horizontal?d(S,0):d(0,S)}}else if(T){if(this.both)l.last.rows-o.rows<=e[0]+1?d(l.first.cols*this._itemSize[1],(l.first.rows+1)*this._itemSize[0]):l.last.cols-o.cols<=e[1]+1&&d((l.first.cols+1)*this._itemSize[1],l.first.rows*this._itemSize[0]);else if(l.last-o<=e+1){let S=(l.first+1)*this._itemSize;this.horizontal?d(S,0):d(0,S)}}}else this.scrollToIndex(e,n)}getRenderedRange(){let e=(o,l)=>l||o?Math.floor(o/(l||o)):0,i=this.first,n=0;if(this.elementViewChild?.nativeElement){let{scrollTop:o,scrollLeft:l}=this.elementViewChild.nativeElement;if(this.both)i={rows:e(o,this._itemSize[0]),cols:e(l,this._itemSize[1])},n={rows:i.rows+this.numItemsInViewport.rows,cols:i.cols+this.numItemsInViewport.cols};else{let d=this.horizontal?l:o;i=e(d,this._itemSize),n=i+this.numItemsInViewport}}return{first:this.first,last:this.last,viewport:{first:i,last:n}}}calculateNumItems(){let e=this.getContentPosition(),i=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetWidth-e.left:0)||0,n=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetHeight-e.top:0)||0,o=(T,S)=>S||T?Math.ceil(T/(S||T)):0,l=T=>Math.ceil(T/2),d=this.both?{rows:o(n,this._itemSize[0]),cols:o(i,this._itemSize[1])}:o(this.horizontal?i:n,this._itemSize),F=this.d_numToleratedItems||(this.both?[l(d.rows),l(d.cols)]:l(d));return{numItemsInViewport:d,numToleratedItems:F}}calculateOptions(){let{numItemsInViewport:e,numToleratedItems:i}=this.calculateNumItems(),n=(d,F,T,S=!1)=>this.getLast(d+F+(d<T?2:3)*T,S),o=this.first,l=this.both?{rows:n(this.first.rows,e.rows,i[0]),cols:n(this.first.cols,e.cols,i[1],!0)}:n(this.first,e,i);this.last=l,this.numItemsInViewport=e,this.d_numToleratedItems=i,this.showLoader&&(this.loaderArr=this.both?Array.from({length:e.rows}).map(()=>Array.from({length:e.cols})):Array.from({length:e})),this._lazy&&Promise.resolve().then(()=>{this.lazyLoadState={first:this._step?this.both?{rows:0,cols:o.cols}:0:o,last:Math.min(this._step?this._step:this.last,this.items.length)},this.handleEvents("onLazyLoad",this.lazyLoadState)})}calculateAutoSize(){this._autoSize&&!this.d_loading&&Promise.resolve().then(()=>{if(this.contentEl){this.contentEl.style.minHeight=this.contentEl.style.minWidth="auto",this.contentEl.style.position="relative",this.elementViewChild.nativeElement.style.contain="none";let[e,i]=[Te(this.contentEl),Se(this.contentEl)];e!==this.defaultContentWidth&&(this.elementViewChild.nativeElement.style.width=""),i!==this.defaultContentHeight&&(this.elementViewChild.nativeElement.style.height="");let[n,o]=[Te(this.elementViewChild.nativeElement),Se(this.elementViewChild.nativeElement)];(this.both||this.horizontal)&&(this.elementViewChild.nativeElement.style.width=n<this.defaultWidth?n+"px":this._scrollWidth||this.defaultWidth+"px"),(this.both||this.vertical)&&(this.elementViewChild.nativeElement.style.height=o<this.defaultHeight?o+"px":this._scrollHeight||this.defaultHeight+"px"),this.contentEl.style.minHeight=this.contentEl.style.minWidth="",this.contentEl.style.position="",this.elementViewChild.nativeElement.style.contain=""}})}getLast(e=0,i=!1){return this._items?Math.min(i?(this._columns||this._items[0]).length:this._items.length,e):0}getContentPosition(){if(this.contentEl){let e=getComputedStyle(this.contentEl),i=parseFloat(e.paddingLeft)+Math.max(parseFloat(e.left)||0,0),n=parseFloat(e.paddingRight)+Math.max(parseFloat(e.right)||0,0),o=parseFloat(e.paddingTop)+Math.max(parseFloat(e.top)||0,0),l=parseFloat(e.paddingBottom)+Math.max(parseFloat(e.bottom)||0,0);return{left:i,right:n,top:o,bottom:l,x:i+n,y:o+l}}return{left:0,right:0,top:0,bottom:0,x:0,y:0}}setSize(){if(this.elementViewChild?.nativeElement){let e=this.elementViewChild.nativeElement.parentElement.parentElement,i=this._scrollWidth||`${this.elementViewChild.nativeElement.offsetWidth||e.offsetWidth}px`,n=this._scrollHeight||`${this.elementViewChild.nativeElement.offsetHeight||e.offsetHeight}px`,o=(l,d)=>this.elementViewChild.nativeElement.style[l]=d;this.both||this.horizontal?(o("height",n),o("width",i)):o("height",n)}}setSpacerSize(){if(this._items){let e=this.getContentPosition(),i=(n,o,l,d=0)=>this.spacerStyle=Me(ee({},this.spacerStyle),{[`${n}`]:(o||[]).length*l+d+"px"});this.both?(i("height",this._items,this._itemSize[0],e.y),i("width",this._columns||this._items[1],this._itemSize[1],e.x)):this.horizontal?i("width",this._columns||this._items,this._itemSize,e.x):i("height",this._items,this._itemSize,e.y)}}setContentPosition(e){if(this.contentEl&&!this._appendOnly){let i=e?e.first:this.first,n=(l,d)=>l*d,o=(l=0,d=0)=>this.contentStyle=Me(ee({},this.contentStyle),{transform:`translate3d(${l}px, ${d}px, 0)`});if(this.both)o(n(i.cols,this._itemSize[1]),n(i.rows,this._itemSize[0]));else{let l=n(i,this._itemSize);this.horizontal?o(l,0):o(0,l)}}}onScrollPositionChange(e){let i=e.target,n=this.getContentPosition(),o=(g,C)=>g?g>C?g-C:g:0,l=(g,C)=>C||g?Math.floor(g/(C||g)):0,d=(g,C,E,X,re,ye)=>g<=re?re:ye?E-X-re:C+re-1,F=(g,C,E,X,re,ye,Be)=>g<=ye?0:Math.max(0,Be?g<C?E:g-ye:g>C?E:g-2*ye),T=(g,C,E,X,re,ye=!1)=>{let Be=C+X+2*re;return g>=re&&(Be+=re+1),this.getLast(Be,ye)},S=o(i.scrollTop,n.top),U=o(i.scrollLeft,n.left),B=this.both?{rows:0,cols:0}:0,Z=this.last,j=!1,ge=this.lastScrollPos;if(this.both){let g=this.lastScrollPos.top<=S,C=this.lastScrollPos.left<=U;if(!this._appendOnly||this._appendOnly&&(g||C)){let E={rows:l(S,this._itemSize[0]),cols:l(U,this._itemSize[1])},X={rows:d(E.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],g),cols:d(E.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],C)};B={rows:F(E.rows,X.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],g),cols:F(E.cols,X.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],C)},Z={rows:T(E.rows,B.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0]),cols:T(E.cols,B.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],!0)},j=B.rows!==this.first.rows||Z.rows!==this.last.rows||B.cols!==this.first.cols||Z.cols!==this.last.cols||this.isRangeChanged,ge={top:S,left:U}}}else{let g=this.horizontal?U:S,C=this.lastScrollPos<=g;if(!this._appendOnly||this._appendOnly&&C){let E=l(g,this._itemSize),X=d(E,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,C);B=F(E,X,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,C),Z=T(E,B,this.last,this.numItemsInViewport,this.d_numToleratedItems),j=B!==this.first||Z!==this.last||this.isRangeChanged,ge=g}}return{first:B,last:Z,isRangeChanged:j,scrollPos:ge}}onScrollChange(e){let{first:i,last:n,isRangeChanged:o,scrollPos:l}=this.onScrollPositionChange(e);if(o){let d={first:i,last:n};if(this.setContentPosition(d),this.first=i,this.last=n,this.lastScrollPos=l,this.handleEvents("onScrollIndexChange",d),this._lazy&&this.isPageChanged(i)){let F={first:this._step?Math.min(this.getPageByFirst(i)*this._step,this.items.length-this._step):i,last:Math.min(this._step?(this.getPageByFirst(i)+1)*this._step:n,this.items.length)};(this.lazyLoadState.first!==F.first||this.lazyLoadState.last!==F.last)&&this.handleEvents("onLazyLoad",F),this.lazyLoadState=F}}}onContainerScroll(e){if(this.handleEvents("onScroll",{originalEvent:e}),this._delay&&this.isPageChanged()){if(this.scrollTimeout&&clearTimeout(this.scrollTimeout),!this.d_loading&&this.showLoader){let{isRangeChanged:i}=this.onScrollPositionChange(e);(i||(this._step?this.isPageChanged():!1))&&(this.d_loading=!0,this.cd.detectChanges())}this.scrollTimeout=setTimeout(()=>{this.onScrollChange(e),this.d_loading&&this.showLoader&&(!this._lazy||this._loading===void 0)&&(this.d_loading=!1,this.page=this.getPageByFirst()),this.cd.detectChanges()},this._delay)}else!this.d_loading&&this.onScrollChange(e)}bindResizeListener(){De(this.platformId)&&(this.windowResizeListener||this.zone.runOutsideAngular(()=>{let e=this.document.defaultView,i=Oe()?"orientationchange":"resize";this.windowResizeListener=this.renderer.listen(e,i,this.onWindowResize.bind(this))}))}unbindResizeListener(){this.windowResizeListener&&(this.windowResizeListener(),this.windowResizeListener=null)}onWindowResize(){this.resizeTimeout&&clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>{if(at(this.elementViewChild?.nativeElement)){let[e,i]=[Te(this.elementViewChild?.nativeElement),Se(this.elementViewChild?.nativeElement)],[n,o]=[e!==this.defaultWidth,i!==this.defaultHeight];(this.both?n||o:this.horizontal?n:this.vertical?o:!1)&&this.zone.run(()=>{this.d_numToleratedItems=this._numToleratedItems,this.defaultWidth=e,this.defaultHeight=i,this.defaultContentWidth=Te(this.contentEl),this.defaultContentHeight=Se(this.contentEl),this.init()})}},this._resizeDelay)}handleEvents(e,i){return this.options&&this.options[e]?this.options[e](i):this[e].emit(i)}getContentOptions(){return{contentStyleClass:`p-virtualscroller-content ${this.d_loading?"p-virtualscroller-loading":""}`,items:this.loadedItems,getItemOptions:e=>this.getOptions(e),loading:this.d_loading,getLoaderOptions:(e,i)=>this.getLoaderOptions(e,i),itemSize:this._itemSize,rows:this.loadedRows,columns:this.loadedColumns,spacerStyle:this.spacerStyle,contentStyle:this.contentStyle,vertical:this.vertical,horizontal:this.horizontal,both:this.both}}getOptions(e){let i=(this._items||[]).length,n=this.both?this.first.rows+e:this.first+e;return{index:n,count:i,first:n===0,last:n===i-1,even:n%2===0,odd:n%2!==0}}getLoaderOptions(e,i){let n=this.loaderArr.length;return ee({index:e,count:n,first:e===0,last:e===n-1,even:e%2===0,odd:e%2!==0},i)}static \u0275fac=function(i){return new(i||t)(de(Ve))};static \u0275cmp=R({type:t,selectors:[["p-scroller"],["p-virtualscroller"],["p-virtual-scroller"],["p-virtualScroller"]],contentQueries:function(i,n,o){if(i&1&&(w(o,pi,4),w(o,Ki,4),w(o,$i,4),w(o,qi,4),w(o,ke,4)),i&2){let l;u(l=h())&&(n.contentTemplate=l.first),u(l=h())&&(n.itemTemplate=l.first),u(l=h())&&(n.loaderTemplate=l.first),u(l=h())&&(n.loaderIconTemplate=l.first),u(l=h())&&(n.templates=l)}},viewQuery:function(i,n){if(i&1&&(Q(Gi,5),Q(pi,5)),i&2){let o;u(o=h())&&(n.elementViewChild=o.first),u(o=h())&&(n.contentViewChild=o.first)}},hostVars:2,hostBindings:function(i,n){i&2&&He("height",n.height)},inputs:{id:"id",style:"style",styleClass:"styleClass",tabindex:"tabindex",items:"items",itemSize:"itemSize",scrollHeight:"scrollHeight",scrollWidth:"scrollWidth",orientation:"orientation",step:"step",delay:"delay",resizeDelay:"resizeDelay",appendOnly:"appendOnly",inline:"inline",lazy:"lazy",disabled:"disabled",loaderDisabled:"loaderDisabled",columns:"columns",showSpacer:"showSpacer",showLoader:"showLoader",numToleratedItems:"numToleratedItems",loading:"loading",autoSize:"autoSize",trackBy:"trackBy",options:"options"},outputs:{onLazyLoad:"onLazyLoad",onScroll:"onScroll",onScrollIndexChange:"onScrollIndexChange"},features:[q([ui]),I,ft],ngContentSelectors:Wi,decls:3,vars:2,consts:[["disabledContainer",""],["element",""],["buildInContent",""],["content",""],["buildInLoader",""],["buildInLoaderIcon",""],[4,"ngIf","ngIfElse"],[3,"scroll","ngStyle"],[3,"class","ngStyle",4,"ngIf"],[3,"class",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"ngStyle"],[4,"ngFor","ngForOf"],["data-p-icon","spinner",3,"spin"],[4,"ngIf"]],template:function(i,n){if(i&1&&(ue(),p(0,hn,8,11,"ng-container",6)(1,_n,2,1,"ng-template",null,0,G)),i&2){let o=ie(2);a("ngIf",!n._disabled)("ngIfElse",o)}},dependencies:[ne,je,Ce,we,Ie,Qt,ce],encapsulation:2})}return t})();var fi=`
    .p-select {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('select.background');
        border: 1px solid dt('select.border.color');
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            outline-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration');
        border-radius: dt('select.border.radius');
        outline-color: transparent;
        box-shadow: dt('select.shadow');
    }

    .p-select:not(.p-disabled):hover {
        border-color: dt('select.hover.border.color');
    }

    .p-select:not(.p-disabled).p-focus {
        border-color: dt('select.focus.border.color');
        box-shadow: dt('select.focus.ring.shadow');
        outline: dt('select.focus.ring.width') dt('select.focus.ring.style') dt('select.focus.ring.color');
        outline-offset: dt('select.focus.ring.offset');
    }

    .p-select.p-variant-filled {
        background: dt('select.filled.background');
    }

    .p-select.p-variant-filled:not(.p-disabled):hover {
        background: dt('select.filled.hover.background');
    }

    .p-select.p-variant-filled:not(.p-disabled).p-focus {
        background: dt('select.filled.focus.background');
    }

    .p-select.p-invalid {
        border-color: dt('select.invalid.border.color');
    }

    .p-select.p-disabled {
        opacity: 1;
        background: dt('select.disabled.background');
    }

    .p-select-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        color: dt('select.clear.icon.color');
        inset-inline-end: dt('select.dropdown.width');
    }

    .p-select-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('select.dropdown.color');
        width: dt('select.dropdown.width');
        border-start-end-radius: dt('select.border.radius');
        border-end-end-radius: dt('select.border.radius');
    }

    .p-select-label {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        flex: 1 1 auto;
        width: 1%;
        padding: dt('select.padding.y') dt('select.padding.x');
        text-overflow: ellipsis;
        cursor: pointer;
        color: dt('select.color');
        background: transparent;
        border: 0 none;
        outline: 0 none;
        font-size: 1rem;
    }

    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.p-invalid .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }

    .p-select:has(.p-select-clear-icon) .p-select-label {
        padding-inline-end: calc(1rem + dt('select.padding.x'));
    }

    .p-select.p-disabled .p-select-label {
        color: dt('select.disabled.color');
    }

    .p-select-label-empty {
        overflow: hidden;
        opacity: 0;
    }

    input.p-select-label {
        cursor: default;
    }

    .p-select-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('select.overlay.background');
        color: dt('select.overlay.color');
        border: 1px solid dt('select.overlay.border.color');
        border-radius: dt('select.overlay.border.radius');
        box-shadow: dt('select.overlay.shadow');
        min-width: 100%;
    }

    .p-select-header {
        padding: dt('select.list.header.padding');
    }

    .p-select-filter {
        width: 100%;
    }

    .p-select-list-container {
        overflow: auto;
    }

    .p-select-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('select.option.group.padding');
        background: dt('select.option.group.background');
        color: dt('select.option.group.color');
        font-weight: dt('select.option.group.font.weight');
    }

    .p-select-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('select.list.padding');
        gap: dt('select.list.gap');
        display: flex;
        flex-direction: column;
    }

    .p-select-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('select.option.padding');
        border: 0 none;
        color: dt('select.option.color');
        background: transparent;
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration'),
            outline-color dt('select.transition.duration');
        border-radius: dt('select.option.border.radius');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option.p-select-option-selected {
        background: dt('select.option.selected.background');
        color: dt('select.option.selected.color');
    }

    .p-select-option.p-select-option-selected.p-focus {
        background: dt('select.option.selected.focus.background');
        color: dt('select.option.selected.focus.color');
    }

    .p-select-option-blank-icon {
        flex-shrink: 0;
    }

    .p-select-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('select.checkmark.gutter.start');
        margin-inline-end: dt('select.checkmark.gutter.end');
        color: dt('select.checkmark.color');
    }

    .p-select-empty-message {
        padding: dt('select.empty.message.padding');
    }

    .p-select-fluid {
        display: flex;
        width: 100%;
    }

    .p-select-sm .p-select-label {
        font-size: dt('select.sm.font.size');
        padding-block: dt('select.sm.padding.y');
        padding-inline: dt('select.sm.padding.x');
    }

    .p-select-sm .p-select-dropdown .p-icon {
        font-size: dt('select.sm.font.size');
        width: dt('select.sm.font.size');
        height: dt('select.sm.font.size');
    }

    .p-select-lg .p-select-label {
        font-size: dt('select.lg.font.size');
        padding-block: dt('select.lg.padding.y');
        padding-inline: dt('select.lg.padding.x');
    }

    .p-select-lg .p-select-dropdown .p-icon {
        font-size: dt('select.lg.font.size');
        width: dt('select.lg.font.size');
        height: dt('select.lg.font.size');
    }
`;var Pe=t=>({height:t}),ut=t=>({$implicit:t});function vn(t,s){if(t&1&&(H(),te(0,"svg",5)),t&2){let e=r(2);m(e.cx("optionCheckIcon"))}}function bn(t,s){if(t&1&&(H(),te(0,"svg",6)),t&2){let e=r(2);m(e.cx("optionBlankIcon"))}}function xn(t,s){if(t&1&&(M(0),p(1,vn,1,2,"svg",3)(2,bn,1,2,"svg",4),z()),t&2){let e=r();c(),a("ngIf",e.selected),c(),a("ngIf",!e.selected)}}function Cn(t,s){if(t&1&&(f(0,"span"),xe(1),_()),t&2){let e=r();c(),Le(e.label??"empty")}}function In(t,s){t&1&&L(0)}var wn=["item"],Sn=["group"],Tn=["loader"],On=["selectedItem"],Vn=["header"],_i=["filter"],En=["footer"],Fn=["emptyfilter"],kn=["empty"],Mn=["dropdownicon"],zn=["loadingicon"],Ln=["clearicon"],Dn=["filtericon"],An=["onicon"],Rn=["officon"],Pn=["cancelicon"],Bn=["focusInput"],Hn=["editableInput"],Nn=["items"],Qn=["scroller"],jn=["overlay"],Kn=["firstHiddenFocusableEl"],$n=["lastHiddenFocusableEl"],gi=t=>({class:t}),yi=t=>({options:t}),vi=(t,s)=>({$implicit:t,options:s}),qn=()=>({});function Gn(t,s){if(t&1&&(M(0),xe(1),z()),t&2){let e=r(2);c(),Le(e.label()==="p-emptylabel"?"\xA0":e.label())}}function Wn(t,s){if(t&1&&L(0,24),t&2){let e=r(2);a("ngTemplateOutlet",e.selectedItemTemplate||e._selectedItemTemplate)("ngTemplateOutletContext",A(2,ut,e.selectedOption))}}function Un(t,s){if(t&1&&(f(0,"span"),xe(1),_()),t&2){let e=r(3);c(),Le(e.label()==="p-emptylabel"?"\xA0":e.label())}}function Zn(t,s){if(t&1&&p(0,Un,2,1,"span",18),t&2){let e=r(2);a("ngIf",e.isSelectedOptionEmpty())}}function Jn(t,s){if(t&1){let e=N();f(0,"span",22,3),D("focus",function(n){b(e);let o=r();return x(o.onInputFocus(n))})("blur",function(n){b(e);let o=r();return x(o.onInputBlur(n))})("keydown",function(n){b(e);let o=r();return x(o.onKeyDown(n))}),p(2,Gn,2,1,"ng-container",20)(3,Wn,1,4,"ng-container",23)(4,Zn,1,1,"ng-template",null,4,G),_()}if(t&2){let e=ie(5),i=r();m(i.cx("label")),a("pTooltip",i.tooltip)("tooltipPosition",i.tooltipPosition)("positionStyle",i.tooltipPositionStyle)("tooltipStyleClass",i.tooltipStyleClass)("pAutoFocus",i.autofocus),k("aria-disabled",i.$disabled())("id",i.inputId)("aria-label",i.ariaLabel||(i.label()==="p-emptylabel"?void 0:i.label()))("aria-labelledby",i.ariaLabelledBy)("aria-haspopup","listbox")("aria-expanded",i.overlayVisible??!1)("aria-controls",i.overlayVisible?i.id+"_list":null)("tabindex",i.$disabled()?-1:i.tabindex)("aria-activedescendant",i.focused?i.focusedOptionId:void 0)("aria-required",i.required())("required",i.required()?"":void 0)("disabled",i.$disabled()?"":void 0),c(2),a("ngIf",!i.selectedItemTemplate&&!i._selectedItemTemplate)("ngIfElse",e),c(),a("ngIf",(i.selectedItemTemplate||i._selectedItemTemplate)&&!i.isSelectedOptionEmpty())}}function Yn(t,s){if(t&1){let e=N();f(0,"input",25,5),D("input",function(n){b(e);let o=r();return x(o.onEditableInput(n))})("keydown",function(n){b(e);let o=r();return x(o.onKeyDown(n))})("focus",function(n){b(e);let o=r();return x(o.onInputFocus(n))})("blur",function(n){b(e);let o=r();return x(o.onInputBlur(n))}),_()}if(t&2){let e=r();m(e.cx("label")),a("pAutoFocus",e.autofocus),k("id",e.inputId)("aria-haspopup","listbox")("placeholder",e.modelValue()===void 0||e.modelValue()===null?e.placeholder():void 0)("aria-label",e.ariaLabel||(e.label()==="p-emptylabel"?void 0:e.label()))("aria-activedescendant",e.focused?e.focusedOptionId:void 0)("name",e.name())("minlength",e.minlength())("min",e.min())("max",e.max())("pattern",e.pattern())("size",e.inputSize())("maxlength",e.maxlength())("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)}}function Xn(t,s){if(t&1){let e=N();H(),f(0,"svg",28),D("click",function(n){b(e);let o=r(2);return x(o.clear(n))}),_()}if(t&2){let e=r(2);m(e.cx("clearIcon")),k("data-pc-section","clearicon")}}function eo(t,s){}function to(t,s){t&1&&p(0,eo,0,0,"ng-template")}function io(t,s){if(t&1){let e=N();f(0,"span",29),D("click",function(n){b(e);let o=r(2);return x(o.clear(n))}),p(1,to,1,0,null,30),_()}if(t&2){let e=r(2);m(e.cx("clearIcon")),k("data-pc-section","clearicon"),c(),a("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)("ngTemplateOutletContext",A(5,gi,e.cx("clearIcon")))}}function no(t,s){if(t&1&&(M(0),p(1,Xn,1,3,"svg",26)(2,io,2,7,"span",27),z()),t&2){let e=r();c(),a("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),c(),a("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function oo(t,s){t&1&&L(0)}function lo(t,s){if(t&1&&(M(0),p(1,oo,1,0,"ng-container",31),z()),t&2){let e=r(2);c(),a("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)}}function so(t,s){if(t&1&&te(0,"span",33),t&2){let e=r(3);m(e.cn(e.cx("loadingIcon"),"pi-spin"+e.loadingIcon))}}function ro(t,s){if(t&1&&te(0,"span",33),t&2){let e=r(3);m(e.cn(e.cx("loadingIcon"),"pi pi-spinner pi-spin"))}}function ao(t,s){if(t&1&&(M(0),p(1,so,1,2,"span",32)(2,ro,1,2,"span",32),z()),t&2){let e=r(2);c(),a("ngIf",e.loadingIcon),c(),a("ngIf",!e.loadingIcon)}}function co(t,s){if(t&1&&(M(0),p(1,lo,2,1,"ng-container",18)(2,ao,3,2,"ng-container",18),z()),t&2){let e=r();c(),a("ngIf",e.loadingIconTemplate||e._loadingIconTemplate),c(),a("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate)}}function po(t,s){if(t&1&&te(0,"span"),t&2){let e=r(3);m(e.cn(e.cx("dropdownIcon"),e.dropdownIcon))}}function uo(t,s){if(t&1&&(H(),te(0,"svg",36)),t&2){let e=r(3);m(e.cx("dropdownIcon"))}}function ho(t,s){if(t&1&&(M(0),p(1,po,1,2,"span",34)(2,uo,1,2,"svg",35),z()),t&2){let e=r(2);c(),a("ngIf",e.dropdownIcon),c(),a("ngIf",!e.dropdownIcon)}}function mo(t,s){}function fo(t,s){t&1&&p(0,mo,0,0,"ng-template")}function _o(t,s){if(t&1&&(f(0,"span"),p(1,fo,1,0,null,30),_()),t&2){let e=r(2);m(e.cx("dropdownIcon")),c(),a("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)("ngTemplateOutletContext",A(4,gi,e.cx("dropdownIcon")))}}function go(t,s){if(t&1&&p(0,ho,3,2,"ng-container",18)(1,_o,2,6,"span",34),t&2){let e=r();a("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),c(),a("ngIf",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function yo(t,s){t&1&&L(0)}function vo(t,s){t&1&&L(0)}function bo(t,s){if(t&1&&(M(0),p(1,vo,1,0,"ng-container",30),z()),t&2){let e=r(3);c(),a("ngTemplateOutlet",e.filterTemplate||e._filterTemplate)("ngTemplateOutletContext",A(2,yi,e.filterOptions))}}function xo(t,s){t&1&&(H(),te(0,"svg",42))}function Co(t,s){}function Io(t,s){t&1&&p(0,Co,0,0,"ng-template")}function wo(t,s){if(t&1&&(f(0,"span"),p(1,Io,1,0,null,31),_()),t&2){let e=r(4);c(),a("ngTemplateOutlet",e.filterIconTemplate||e._filterIconTemplate)}}function So(t,s){if(t&1){let e=N();f(0,"p-iconfield")(1,"input",40,10),D("input",function(n){b(e);let o=r(3);return x(o.onFilterInputChange(n))})("keydown",function(n){b(e);let o=r(3);return x(o.onFilterKeyDown(n))})("blur",function(n){b(e);let o=r(3);return x(o.onFilterBlur(n))}),_(),f(3,"p-inputicon"),p(4,xo,1,0,"svg",41)(5,wo,2,1,"span",18),_()()}if(t&2){let e=r(3);c(),m(e.cx("pcFilter")),a("pSize",e.size())("value",e._filterValue()||"")("variant",e.$variant()),k("placeholder",e.filterPlaceholder)("aria-owns",e.id+"_list")("aria-label",e.ariaFilterLabel)("aria-activedescendant",e.focusedOptionId),c(3),a("ngIf",!e.filterIconTemplate&&!e._filterIconTemplate),c(),a("ngIf",e.filterIconTemplate||e._filterIconTemplate)}}function To(t,s){if(t&1){let e=N();f(0,"div",29),D("click",function(n){return b(e),x(n.stopPropagation())}),p(1,bo,2,4,"ng-container",20)(2,So,6,11,"ng-template",null,9,G),_()}if(t&2){let e=ie(3),i=r(2);m(i.cx("header")),c(),a("ngIf",i.filterTemplate||i._filterTemplate)("ngIfElse",e)}}function Oo(t,s){t&1&&L(0)}function Vo(t,s){if(t&1&&p(0,Oo,1,0,"ng-container",30),t&2){let e=s.$implicit,i=s.options;r(2);let n=ie(9);a("ngTemplateOutlet",n)("ngTemplateOutletContext",me(2,vi,e,i))}}function Eo(t,s){t&1&&L(0)}function Fo(t,s){if(t&1&&p(0,Eo,1,0,"ng-container",30),t&2){let e=s.options,i=r(4);a("ngTemplateOutlet",i.loaderTemplate||i._loaderTemplate)("ngTemplateOutletContext",A(2,yi,e))}}function ko(t,s){t&1&&(M(0),p(1,Fo,1,4,"ng-template",null,12,G),z())}function Mo(t,s){if(t&1){let e=N();f(0,"p-scroller",43,11),D("onLazyLoad",function(n){b(e);let o=r(2);return x(o.onLazyLoad.emit(n))}),p(2,Vo,1,5,"ng-template",null,2,G)(4,ko,3,0,"ng-container",18),_()}if(t&2){let e=r(2);ze(A(8,Pe,e.scrollHeight)),a("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",!0)("lazy",e.lazy)("options",e.virtualScrollOptions),c(4),a("ngIf",e.loaderTemplate||e._loaderTemplate)}}function zo(t,s){t&1&&L(0)}function Lo(t,s){if(t&1&&(M(0),p(1,zo,1,0,"ng-container",30),z()),t&2){r();let e=ie(9),i=r();c(),a("ngTemplateOutlet",e)("ngTemplateOutletContext",me(3,vi,i.visibleOptions(),Ne(2,qn)))}}function Do(t,s){if(t&1&&(f(0,"span"),xe(1),_()),t&2){let e=r(2).$implicit,i=r(3);c(),Le(i.getOptionGroupLabel(e.optionGroup))}}function Ao(t,s){t&1&&L(0)}function Ro(t,s){if(t&1&&(M(0),f(1,"li",47),p(2,Do,2,1,"span",18)(3,Ao,1,0,"ng-container",30),_(),z()),t&2){let e=r(),i=e.$implicit,n=e.index,o=r().options,l=r(2);c(),m(l.cx("optionGroup")),a("ngStyle",A(7,Pe,o.itemSize+"px")),k("id",l.id+"_"+l.getOptionIndex(n,o)),c(),a("ngIf",!l.groupTemplate&&!l._groupTemplate),c(),a("ngTemplateOutlet",l.groupTemplate||l._groupTemplate)("ngTemplateOutletContext",A(9,ut,i.optionGroup))}}function Po(t,s){if(t&1){let e=N();M(0),f(1,"p-selectItem",48),D("onClick",function(n){b(e);let o=r().$implicit,l=r(3);return x(l.onOptionSelect(n,o))})("onMouseEnter",function(n){b(e);let o=r().index,l=r().options,d=r(2);return x(d.onOptionMouseEnter(n,d.getOptionIndex(o,l)))}),_(),z()}if(t&2){let e=r(),i=e.$implicit,n=e.index,o=r().options,l=r(2);c(),a("id",l.id+"_"+l.getOptionIndex(n,o))("option",i)("checkmark",l.checkmark)("selected",l.isSelected(i))("label",l.getOptionLabel(i))("disabled",l.isOptionDisabled(i))("template",l.itemTemplate||l._itemTemplate)("focused",l.focusedOptionIndex()===l.getOptionIndex(n,o))("ariaPosInset",l.getAriaPosInset(l.getOptionIndex(n,o)))("ariaSetSize",l.ariaSetSize)}}function Bo(t,s){if(t&1&&p(0,Ro,4,11,"ng-container",18)(1,Po,2,10,"ng-container",18),t&2){let e=s.$implicit,i=r(3);a("ngIf",i.isOptionGroup(e)),c(),a("ngIf",!i.isOptionGroup(e))}}function Ho(t,s){if(t&1&&xe(0),t&2){let e=r(4);tt(" ",e.emptyFilterMessageLabel," ")}}function No(t,s){t&1&&L(0,null,14)}function Qo(t,s){if(t&1&&p(0,No,2,0,"ng-container",31),t&2){let e=r(4);a("ngTemplateOutlet",e.emptyFilterTemplate||e._emptyFilterTemplate||e.emptyTemplate||e._emptyTemplate)}}function jo(t,s){if(t&1&&(f(0,"li",47),Je(1,Ho,1,1)(2,Qo,1,1,"ng-container"),_()),t&2){let e=r().options,i=r(2);m(i.cx("emptyMessage")),a("ngStyle",A(4,Pe,e.itemSize+"px")),c(),Ye(!i.emptyFilterTemplate&&!i._emptyFilterTemplate&&!i.emptyTemplate?1:2)}}function Ko(t,s){if(t&1&&xe(0),t&2){let e=r(4);tt(" ",e.emptyMessageLabel," ")}}function $o(t,s){t&1&&L(0,null,15)}function qo(t,s){if(t&1&&p(0,$o,2,0,"ng-container",31),t&2){let e=r(4);a("ngTemplateOutlet",e.emptyTemplate||e._emptyTemplate)}}function Go(t,s){if(t&1&&(f(0,"li",47),Je(1,Ko,1,1)(2,qo,1,1,"ng-container"),_()),t&2){let e=r().options,i=r(2);m(i.cx("emptyMessage")),a("ngStyle",A(4,Pe,e.itemSize+"px")),c(),Ye(!i.emptyTemplate&&!i._emptyTemplate?1:2)}}function Wo(t,s){if(t&1&&(f(0,"ul",44,13),p(2,Bo,2,2,"ng-template",45)(3,jo,3,6,"li",46)(4,Go,3,6,"li",46),_()),t&2){let e=s.$implicit,i=s.options,n=r(2);ze(i.contentStyle),m(n.cn(n.cx("list"),i.contentStyleClass)),k("id",n.id+"_list")("aria-label",n.listLabel),c(2),a("ngForOf",e),c(),a("ngIf",n.filterValue&&n.isEmpty()),c(),a("ngIf",!n.filterValue&&n.isEmpty())}}function Uo(t,s){t&1&&L(0)}function Zo(t,s){if(t&1){let e=N();f(0,"div",37)(1,"span",38,6),D("focus",function(n){b(e);let o=r();return x(o.onFirstHiddenFocus(n))}),_(),p(3,yo,1,0,"ng-container",31)(4,To,4,4,"div",27),f(5,"div"),p(6,Mo,5,10,"p-scroller",39)(7,Lo,2,6,"ng-container",18)(8,Wo,5,9,"ng-template",null,7,G),_(),p(10,Uo,1,0,"ng-container",31),f(11,"span",38,8),D("focus",function(n){b(e);let o=r();return x(o.onLastHiddenFocus(n))}),_()()}if(t&2){let e=r();m(e.cn(e.cx("overlay"),e.panelStyleClass)),a("ngStyle",e.panelStyle),c(),k("tabindex",0)("data-p-hidden-accessible",!0)("data-p-hidden-focusable",!0),c(2),a("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),c(),a("ngIf",e.filter),c(),m(e.cx("listContainer")),He("max-height",e.virtualScroll?"auto":e.scrollHeight||"auto"),c(),a("ngIf",e.virtualScroll),c(),a("ngIf",!e.virtualScroll),c(3),a("ngTemplateOutlet",e.footerTemplate||e._footerTemplate),c(),k("tabindex",0)("data-p-hidden-accessible",!0)("data-p-hidden-focusable",!0)}}var Jo=`
    ${fi}

    /* For PrimeNG */
    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.ng-invalid.ng-dirty {
        border-color: dt('select.invalid.border.color');
    }

    .p-dropdown.ng-invalid.ng-dirty .p-dropdown-label.p-placeholder,
    .p-select.ng-invalid.ng-dirty .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }
`,Yo={root:({instance:t})=>["p-select p-component p-inputwrapper",{"p-disabled":t.$disabled(),"p-variant-filled":t.$variant()==="filled","p-focus":t.focused,"p-invalid":t.invalid(),"p-inputwrapper-filled":t.$filled(),"p-inputwrapper-focus":t.focused||t.overlayVisible,"p-select-open":t.overlayVisible,"p-select-fluid":t.hasFluid,"p-select-sm p-inputfield-sm":t.size()==="small","p-select-lg p-inputfield-lg":t.size()==="large"}],label:({instance:t})=>["p-select-label",{"p-placeholder":t.placeholder()&&t.label()===t.placeholder(),"p-select-label-empty":!t.editable&&!t.selectedItemTemplate&&(t.label()===void 0||t.label()===null||t.label()==="p-emptylabel"||t.label().length===0)}],clearIcon:"p-select-clear-icon",dropdown:"p-select-dropdown",loadingIcon:"p-select-loading-icon",dropdownIcon:"p-select-dropdown-icon",overlay:"p-select-overlay p-component-overlay p-component",header:"p-select-header",pcFilter:"p-select-filter",listContainer:"p-select-list-container",list:"p-select-list",optionGroup:"p-select-option-group",optionGroupLabel:"p-select-option-group-label",option:({instance:t})=>["p-select-option",{"p-select-option-selected":t.selected&&!t.checkmark,"p-disabled":t.disabled,"p-focus":t.focused}],optionLabel:"p-select-option-label",optionCheckIcon:"p-select-option-check-icon",optionBlankIcon:"p-select-option-blank-icon",emptyMessage:"p-select-empty-message"},Ze=(()=>{class t extends J{name="select";theme=Jo;classes=Yo;static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275prov=K({token:t,factory:t.\u0275fac})}return t})();var Xo={provide:Rt,useExisting:ht(()=>tl),multi:!0},el=(()=>{class t extends Y{id;option;selected;focused;label;disabled;visible;itemSize;ariaPosInset;ariaSetSize;template;checkmark;onClick=new V;onMouseEnter=new V;_componentStyle=P(Ze);onOptionClick(e){this.onClick.emit(e)}onOptionMouseEnter(e){this.onMouseEnter.emit(e)}static \u0275fac=(()=>{let e;return function(n){return(e||(e=y(t)))(n||t)}})();static \u0275cmp=R({type:t,selectors:[["p-selectItem"]],inputs:{id:"id",option:"option",selected:[2,"selected","selected",v],focused:[2,"focused","focused",v],label:"label",disabled:[2,"disabled","disabled",v],visible:[2,"visible","visible",v],itemSize:[2,"itemSize","itemSize",Qe],ariaPosInset:"ariaPosInset",ariaSetSize:"ariaSetSize",template:"template",checkmark:[2,"checkmark","checkmark",v]},outputs:{onClick:"onClick",onMouseEnter:"onMouseEnter"},features:[q([Ze]),I],decls:4,vars:19,consts:[["role","option","pRipple","",3,"click","mouseenter","id","ngStyle"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","check",3,"class",4,"ngIf"],["data-p-icon","blank",3,"class",4,"ngIf"],["data-p-icon","check"],["data-p-icon","blank"]],template:function(i,n){i&1&&(f(0,"li",0),D("click",function(l){return n.onOptionClick(l)})("mouseenter",function(l){return n.onOptionMouseEnter(l)}),p(1,xn,3,2,"ng-container",1)(2,Cn,2,1,"span",1)(3,In,1,0,"ng-container",2),_()),i&2&&(m(n.cx("option")),a("id",n.id)("ngStyle",A(15,Pe,n.itemSize+"px")),k("aria-label",n.label)("aria-setsize",n.ariaSetSize)("aria-posinset",n.ariaPosInset)("aria-selected",n.selected)("data-p-focused",n.focused)("data-p-highlight",n.selected)("data-p-disabled",n.disabled),c(),a("ngIf",n.checkmark),c(),a("ngIf",!n.template),c(),a("ngTemplateOutlet",n.template)("ngTemplateOutletContext",A(17,ut,n.option)))},dependencies:[ne,Ce,we,Ie,ce,Kt,ii,ti],encapsulation:2})}return t})(),tl=(()=>{class t extends Jt{zone;filterService;id;scrollHeight="200px";filter;panelStyle;styleClass;panelStyleClass;readonly;editable;tabindex=0;set placeholder(e){this._placeholder.set(e)}get placeholder(){return this._placeholder.asReadonly()}loadingIcon;filterPlaceholder;filterLocale;inputId;dataKey;filterBy;filterFields;autofocus;resetFilterOnHide=!1;checkmark=!1;dropdownIcon;loading=!1;optionLabel;optionValue;optionDisabled;optionGroupLabel="label";optionGroupChildren="items";group;showClear;emptyFilterMessage="";emptyMessage="";lazy=!1;virtualScroll;virtualScrollItemSize;virtualScrollOptions;overlayOptions;ariaFilterLabel;ariaLabel;ariaLabelledBy;filterMatchMode="contains";tooltip="";tooltipPosition="right";tooltipPositionStyle="absolute";tooltipStyleClass;focusOnHover=!0;selectOnFocus=!1;autoOptionFocus=!1;autofocusFilter=!0;get filterValue(){return this._filterValue()}set filterValue(e){setTimeout(()=>{this._filterValue.set(e)})}get options(){return this._options()}set options(e){Mt(e,this._options())||this._options.set(e)}appendTo=O(void 0);onChange=new V;onFilter=new V;onFocus=new V;onBlur=new V;onClick=new V;onShow=new V;onHide=new V;onClear=new V;onLazyLoad=new V;_componentStyle=P(Ze);filterViewChild;focusInputViewChild;editableInputViewChild;itemsViewChild;scroller;overlayViewChild;firstHiddenFocusableElementOnOverlay;lastHiddenFocusableElementOnOverlay;itemsWrapper;$appendTo=$(()=>this.appendTo()||this.config.overlayAppendTo());itemTemplate;groupTemplate;loaderTemplate;selectedItemTemplate;headerTemplate;filterTemplate;footerTemplate;emptyFilterTemplate;emptyTemplate;dropdownIconTemplate;loadingIconTemplate;clearIconTemplate;filterIconTemplate;onIconTemplate;offIconTemplate;cancelIconTemplate;templates;_itemTemplate;_selectedItemTemplate;_headerTemplate;_filterTemplate;_footerTemplate;_emptyFilterTemplate;_emptyTemplate;_groupTemplate;_loaderTemplate;_dropdownIconTemplate;_loadingIconTemplate;_clearIconTemplate;_filterIconTemplate;_cancelIconTemplate;_onIconTemplate;_offIconTemplate;filterOptions;_options=le(null);_placeholder=le(void 0);value;hover;focused;overlayVisible;optionsChanged;panel;dimensionsUpdated;hoveredItem;selectedOptionUpdated;_filterValue=le(null);searchValue;searchIndex;searchTimeout;previousSearchChar;currentSearchChar;preventModelTouched;focusedOptionIndex=le(-1);labelId;listId;clicked=le(!1);get emptyMessageLabel(){return this.emptyMessage||this.config.getTranslation($e.EMPTY_MESSAGE)}get emptyFilterMessageLabel(){return this.emptyFilterMessage||this.config.getTranslation($e.EMPTY_FILTER_MESSAGE)}get isVisibleClearIcon(){return this.modelValue()!=null&&this.hasSelectedOption()&&this.showClear&&!this.$disabled()}get listLabel(){return this.config.getTranslation($e.ARIA).listLabel}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}visibleOptions=$(()=>{let e=this.getAllVisibleAndNonVisibleOptions();if(this._filterValue()){let n=!(this.filterBy||this.optionLabel)&&!this.filterFields&&!this.optionValue?this.options.filter(o=>o.label?o.label.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim())!==-1:o.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim())!==-1):this.filterService.filter(e,this.searchFields(),this._filterValue().trim(),this.filterMatchMode,this.filterLocale);if(this.group){let o=this.options||[],l=[];return o.forEach(d=>{let T=this.getOptionGroupChildren(d).filter(S=>n.includes(S));T.length>0&&l.push(Me(ee({},d),{[typeof this.optionGroupChildren=="string"?this.optionGroupChildren:"items"]:[...T]}))}),this.flatOptions(l)}return n}return e});label=$(()=>{let e=this.getAllVisibleAndNonVisibleOptions(),i=e.findIndex(n=>this.isOptionValueEqualsModelValue(n));return i!==-1?this.getOptionLabel(e[i]):this.placeholder()||"p-emptylabel"});selectedOption;constructor(e,i){super(),this.zone=e,this.filterService=i,Ct(()=>{let n=this.modelValue(),o=this.visibleOptions();if(o&&Ee(o)){let l=this.findSelectedOptionIndex();(l!==-1||n===void 0||typeof n=="string"&&n.length===0||this.isModelValueNotSet()||this.editable)&&(this.selectedOption=o[l])}ct(o)&&(n===void 0||this.isModelValueNotSet())&&Ee(this.selectedOption)&&(this.selectedOption=null),n!==void 0&&this.editable&&this.updateEditableLabel(),this.cd.markForCheck()})}isModelValueNotSet(){return this.modelValue()===null&&!this.isOptionValueEqualsModelValue(this.selectedOption)}getAllVisibleAndNonVisibleOptions(){return this.group?this.flatOptions(this.options):this.options||[]}ngOnInit(){super.ngOnInit(),this.id=this.id||Ke("pn_id_"),this.autoUpdateModel(),this.filterBy&&(this.filterOptions={filter:e=>this.onFilterInputChange(e),reset:()=>this.resetFilter()})}ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"item":this._itemTemplate=e.template;break;case"selectedItem":this._selectedItemTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"filter":this._filterTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"emptyfilter":this._emptyFilterTemplate=e.template;break;case"empty":this._emptyTemplate=e.template;break;case"group":this._groupTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"dropdownicon":this._dropdownIconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;case"clearicon":this._clearIconTemplate=e.template;break;case"filtericon":this._filterIconTemplate=e.template;break;case"cancelicon":this._cancelIconTemplate=e.template;break;case"onicon":this._onIconTemplate=e.template;break;case"officon":this._offIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}ngAfterViewChecked(){if(this.optionsChanged&&this.overlayVisible&&(this.optionsChanged=!1,this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild&&this.overlayViewChild.alignOverlay()},1)})),this.selectedOptionUpdated&&this.itemsWrapper){let e=fe(this.overlayViewChild?.overlayViewChild?.nativeElement,"li.p-select-option-selected");e&&kt(this.itemsWrapper,e),this.selectedOptionUpdated=!1}}flatOptions(e){return(e||[]).reduce((i,n,o)=>{i.push({optionGroup:n,group:!0,index:o});let l=this.getOptionGroupChildren(n);return l&&l.forEach(d=>i.push(d)),i},[])}autoUpdateModel(){this.selectOnFocus&&this.autoOptionFocus&&!this.hasSelectedOption()&&(this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex()),this.onOptionSelect(null,this.visibleOptions()[this.focusedOptionIndex()],!1))}onOptionSelect(e,i,n=!0,o=!1){if(!this.isSelected(i)){let l=this.getOptionValue(i);this.updateModel(l,e),this.focusedOptionIndex.set(this.findSelectedOptionIndex()),o===!1&&this.onChange.emit({originalEvent:e,value:l})}n&&this.hide(!0)}onOptionMouseEnter(e,i){this.focusOnHover&&this.changeFocusedOptionIndex(e,i)}updateModel(e,i){this.value=e,this.onModelChange(e),this.writeModelValue(e),this.selectedOptionUpdated=!0}allowModelChange(){return!!this.modelValue()&&!this.placeholder()&&(this.modelValue()===void 0||this.modelValue()===null)&&!this.editable&&this.options&&this.options.length}isSelected(e){return this.isOptionValueEqualsModelValue(e)}isOptionValueEqualsModelValue(e){return this.isValidOption(e)&&zt(this.modelValue(),this.getOptionValue(e),this.equalityKey())}ngAfterViewInit(){super.ngAfterViewInit(),this.editable&&this.updateEditableLabel(),this.updatePlaceHolderForFloatingLabel()}updatePlaceHolderForFloatingLabel(){let e=this.el.nativeElement.parentElement,i=e?.classList.contains("p-float-label");if(e&&i&&!this.selectedOption){let n=e.querySelector("label");n&&this._placeholder.set(n.textContent)}}updateEditableLabel(){this.editableInputViewChild&&(this.editableInputViewChild.nativeElement.value=this.getOptionLabel(this.selectedOption)||this.modelValue()||"")}clearEditableLabel(){this.editableInputViewChild&&(this.editableInputViewChild.nativeElement.value="")}getOptionIndex(e,i){return this.virtualScrollerDisabled?e:i&&i.getItemOptions(e).index}getOptionLabel(e){return this.optionLabel!==void 0&&this.optionLabel!==null?Fe(e,this.optionLabel):e&&e.label!==void 0?e.label:e}getOptionValue(e){return this.optionValue&&this.optionValue!==null?Fe(e,this.optionValue):!this.optionLabel&&e&&e.value!==void 0?e.value:e}isSelectedOptionEmpty(){return ct(this.selectedOption)}isOptionDisabled(e){return this.getOptionValue(this.modelValue())===this.getOptionValue(e)||this.getOptionLabel(this.modelValue()===this.getOptionLabel(e))&&e.disabled===!1?!1:this.optionDisabled?Fe(e,this.optionDisabled):e&&e.disabled!==void 0?e.disabled:!1}getOptionGroupLabel(e){return this.optionGroupLabel!==void 0&&this.optionGroupLabel!==null?Fe(e,this.optionGroupLabel):e&&e.label!==void 0?e.label:e}getOptionGroupChildren(e){return this.optionGroupChildren!==void 0&&this.optionGroupChildren!==null?Fe(e,this.optionGroupChildren):e.items}getAriaPosInset(e){return(this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(i=>this.isOptionGroup(i)).length:e)+1}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}resetFilter(){this._filterValue.set(null),this.filterViewChild&&this.filterViewChild.nativeElement&&(this.filterViewChild.nativeElement.value="")}onContainerClick(e){this.$disabled()||this.readonly||this.loading||(this.focusInputViewChild?.nativeElement.focus({preventScroll:!0}),!(e.target.tagName==="INPUT"||e.target.getAttribute("data-pc-section")==="clearicon"||e.target.closest('[data-pc-section="clearicon"]'))&&((!this.overlayViewChild||!this.overlayViewChild.el.nativeElement.contains(e.target))&&(this.overlayVisible?this.hide(!0):this.show(!0)),this.onClick.emit(e),this.clicked.set(!0),this.cd.detectChanges()))}isEmpty(){return!this._options()||this.visibleOptions()&&this.visibleOptions().length===0}onEditableInput(e){let i=e.target.value;this.searchValue="",!this.searchOptions(e,i)&&this.focusedOptionIndex.set(-1),this.onModelChange(i),this.updateModel(i||null,e),setTimeout(()=>{this.onChange.emit({originalEvent:e,value:i})},1),!this.overlayVisible&&Ee(i)&&this.show()}show(e){this.overlayVisible=!0,this.focusedOptionIndex.set(this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():this.editable?-1:this.findSelectedOptionIndex()),e&&oe(this.focusInputViewChild?.nativeElement),this.cd.markForCheck()}onOverlayAnimationStart(e){if(e.toState==="visible"){if(this.itemsWrapper=fe(this.overlayViewChild?.overlayViewChild?.nativeElement,this.virtualScroll?".p-scroller":".p-select-list-container"),this.virtualScroll&&this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.options&&this.options.length)if(this.virtualScroll){let i=this.modelValue()?this.focusedOptionIndex():-1;i!==-1&&this.scroller?.scrollToIndex(i)}else{let i=fe(this.itemsWrapper,".p-select-option.p-select-option-selected");i&&i.scrollIntoView({block:"nearest",inline:"nearest"})}this.filterViewChild&&this.filterViewChild.nativeElement&&(this.preventModelTouched=!0,this.autofocusFilter&&!this.editable&&this.filterViewChild.nativeElement.focus()),this.onShow.emit(e)}e.toState==="void"&&(this.itemsWrapper=null,this.onModelTouched(),this.onHide.emit(e))}hide(e){this.overlayVisible=!1,this.focusedOptionIndex.set(-1),this.clicked.set(!1),this.searchValue="",this.overlayOptions?.mode==="modal"&&Bt(),this.filter&&this.resetFilterOnHide&&this.resetFilter(),e&&(this.focusInputViewChild&&oe(this.focusInputViewChild?.nativeElement),this.editable&&this.editableInputViewChild&&oe(this.editableInputViewChild?.nativeElement)),this.cd.markForCheck()}onInputFocus(e){if(this.$disabled())return;this.focused=!0;let i=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(i),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit(e)}onInputBlur(e){this.focused=!1,this.onBlur.emit(e),this.preventModelTouched||this.onModelTouched(),this.preventModelTouched=!1}onKeyDown(e,i=!1){if(!(this.$disabled()||this.readonly||this.loading)){switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e,this.editable);break;case"ArrowLeft":case"ArrowRight":this.onArrowLeftKey(e,this.editable);break;case"Delete":this.onDeleteKey(e);break;case"Home":this.onHomeKey(e,this.editable);break;case"End":this.onEndKey(e,this.editable);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Space":this.onSpaceKey(e,i);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"Backspace":this.onBackspaceKey(e,this.editable);break;case"ShiftLeft":case"ShiftRight":break;default:!e.metaKey&&Lt(e.key)&&(!this.overlayVisible&&this.show(),!this.editable&&this.searchOptions(e,e.key));break}this.clicked.set(!1)}}onFilterKeyDown(e){switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e,!0);break;case"ArrowLeft":case"ArrowRight":this.onArrowLeftKey(e,!0);break;case"Home":this.onHomeKey(e,!0);break;case"End":this.onEndKey(e,!0);break;case"Enter":case"NumpadEnter":this.onEnterKey(e,!0);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e,!0);break;default:break}}onFilterBlur(e){this.focusedOptionIndex.set(-1)}onArrowDownKey(e){if(!this.overlayVisible)this.show(),this.editable&&this.changeFocusedOptionIndex(e,this.findSelectedOptionIndex());else{let i=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.clicked()?this.findFirstOptionIndex():this.findFirstFocusedOptionIndex();this.changeFocusedOptionIndex(e,i)}e.preventDefault(),e.stopPropagation()}changeFocusedOptionIndex(e,i){if(this.focusedOptionIndex()!==i&&(this.focusedOptionIndex.set(i),this.scrollInView(),this.selectOnFocus)){let n=this.visibleOptions()[i];this.onOptionSelect(e,n,!1)}}get virtualScrollerDisabled(){return!this.virtualScroll}scrollInView(e=-1){let i=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let n=fe(this.itemsViewChild.nativeElement,`li[id="${i}"]`);n?n.scrollIntoView&&n.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex())},0)}}hasSelectedOption(){return this.modelValue()!==void 0}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}equalityKey(){return this.optionValue?null:this.dataKey}findFirstFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextOptionIndex(e){let i=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(n=>this.isValidOption(n)):-1;return i>-1?i+e+1:e}findPrevOptionIndex(e){let i=e>0?dt(this.visibleOptions().slice(0,e),n=>this.isValidOption(n)):-1;return i>-1?i:e}findLastOptionIndex(){return dt(this.visibleOptions(),e=>this.isValidOption(e))}findLastFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}isValidOption(e){return e!=null&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionGroup(e){return this.optionGroupLabel!==void 0&&this.optionGroupLabel!==null&&e.optionGroup!==void 0&&e.optionGroup!==null&&e.group}onArrowUpKey(e,i=!1){if(e.altKey&&!i){if(this.focusedOptionIndex()!==-1){let n=this.visibleOptions()[this.focusedOptionIndex()];this.onOptionSelect(e,n)}this.overlayVisible&&this.hide()}else{let n=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.clicked()?this.findLastOptionIndex():this.findLastFocusedOptionIndex();this.changeFocusedOptionIndex(e,n),!this.overlayVisible&&this.show()}e.preventDefault(),e.stopPropagation()}onArrowLeftKey(e,i=!1){i&&this.focusedOptionIndex.set(-1)}onDeleteKey(e){this.showClear&&(this.clear(e),e.preventDefault())}onHomeKey(e,i=!1){if(i){let n=e.currentTarget;e.shiftKey?n.setSelectionRange(0,n.value.length):(n.setSelectionRange(0,0),this.focusedOptionIndex.set(-1))}else this.changeFocusedOptionIndex(e,this.findFirstOptionIndex()),!this.overlayVisible&&this.show();e.preventDefault()}onEndKey(e,i=!1){if(i){let n=e.currentTarget;if(e.shiftKey)n.setSelectionRange(0,n.value.length);else{let o=n.value.length;n.setSelectionRange(o,o),this.focusedOptionIndex.set(-1)}}else this.changeFocusedOptionIndex(e,this.findLastOptionIndex()),!this.overlayVisible&&this.show();e.preventDefault()}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault()}onPageUpKey(e){this.scrollInView(0),e.preventDefault()}onSpaceKey(e,i=!1){!this.editable&&!i&&this.onEnterKey(e)}onEnterKey(e,i=!1){if(!this.overlayVisible)this.focusedOptionIndex.set(-1),this.onArrowDownKey(e);else{if(this.focusedOptionIndex()!==-1){let n=this.visibleOptions()[this.focusedOptionIndex()];this.onOptionSelect(e,n)}!i&&this.hide()}e.preventDefault()}onEscapeKey(e){this.overlayVisible&&this.hide(!0),e.preventDefault(),e.stopPropagation()}onTabKey(e,i=!1){if(!i)if(this.overlayVisible&&this.hasFocusableElements())oe(e.shiftKey?this.lastHiddenFocusableElementOnOverlay.nativeElement:this.firstHiddenFocusableElementOnOverlay.nativeElement),e.preventDefault();else{if(this.focusedOptionIndex()!==-1&&this.overlayVisible){let n=this.visibleOptions()[this.focusedOptionIndex()];this.onOptionSelect(e,n)}this.overlayVisible&&this.hide(this.filter)}e.stopPropagation()}onFirstHiddenFocus(e){let i=e.relatedTarget===this.focusInputViewChild?.nativeElement?Et(this.overlayViewChild.el?.nativeElement,":not(.p-hidden-focusable)"):this.focusInputViewChild?.nativeElement;oe(i)}onLastHiddenFocus(e){let i=e.relatedTarget===this.focusInputViewChild?.nativeElement?Ft(this.overlayViewChild?.overlayViewChild?.nativeElement,':not([data-p-hidden-focusable="true"])'):this.focusInputViewChild?.nativeElement;oe(i)}hasFocusableElements(){return Vt(this.overlayViewChild.overlayViewChild.nativeElement,':not([data-p-hidden-focusable="true"])').length>0}onBackspaceKey(e,i=!1){i&&!this.overlayVisible&&this.show()}searchFields(){return this.filterBy?.split(",")||this.filterFields||[this.optionLabel]}searchOptions(e,i){this.searchValue=(this.searchValue||"")+i;let n=-1,o=!1;return n=this.visibleOptions().findIndex(l=>this.isOptionMatched(l)),n!==-1&&(o=!0),n===-1&&this.focusedOptionIndex()===-1&&(n=this.findFirstFocusedOptionIndex()),n!==-1&&setTimeout(()=>{this.changeFocusedOptionIndex(e,n)}),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(()=>{this.searchValue="",this.searchTimeout=null},500),o}isOptionMatched(e){return this.isValidOption(e)&&this.getOptionLabel(e).toString().toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale))}onFilterInputChange(e){let i=e.target.value;this._filterValue.set(i),this.focusedOptionIndex.set(-1),this.onFilter.emit({originalEvent:e,filter:this._filterValue()}),!this.virtualScrollerDisabled&&this.scroller.scrollToIndex(0),setTimeout(()=>{this.overlayViewChild.alignOverlay()}),this.cd.markForCheck()}applyFocus(){this.editable?fe(this.el.nativeElement,".p-dropdown-label.p-inputtext").focus():oe(this.focusInputViewChild?.nativeElement)}focus(){this.applyFocus()}clear(e){this.updateModel(null,e),this.clearEditableLabel(),this.onModelTouched(),this.onChange.emit({originalEvent:e,value:this.value}),this.onClear.emit(e),this.resetFilter()}writeControlValue(e,i){this.filter&&this.resetFilter(),this.value=e,this.allowModelChange()&&this.onModelChange(e),i(this.value),this.updateEditableLabel(),this.cd.markForCheck()}static \u0275fac=function(i){return new(i||t)(de(Ve),de(Dt))};static \u0275cmp=R({type:t,selectors:[["p-select"]],contentQueries:function(i,n,o){if(i&1&&(w(o,wn,4),w(o,Sn,4),w(o,Tn,4),w(o,On,4),w(o,Vn,4),w(o,_i,4),w(o,En,4),w(o,Fn,4),w(o,kn,4),w(o,Mn,4),w(o,zn,4),w(o,Ln,4),w(o,Dn,4),w(o,An,4),w(o,Rn,4),w(o,Pn,4),w(o,ke,4)),i&2){let l;u(l=h())&&(n.itemTemplate=l.first),u(l=h())&&(n.groupTemplate=l.first),u(l=h())&&(n.loaderTemplate=l.first),u(l=h())&&(n.selectedItemTemplate=l.first),u(l=h())&&(n.headerTemplate=l.first),u(l=h())&&(n.filterTemplate=l.first),u(l=h())&&(n.footerTemplate=l.first),u(l=h())&&(n.emptyFilterTemplate=l.first),u(l=h())&&(n.emptyTemplate=l.first),u(l=h())&&(n.dropdownIconTemplate=l.first),u(l=h())&&(n.loadingIconTemplate=l.first),u(l=h())&&(n.clearIconTemplate=l.first),u(l=h())&&(n.filterIconTemplate=l.first),u(l=h())&&(n.onIconTemplate=l.first),u(l=h())&&(n.offIconTemplate=l.first),u(l=h())&&(n.cancelIconTemplate=l.first),u(l=h())&&(n.templates=l)}},viewQuery:function(i,n){if(i&1&&(Q(_i,5),Q(Bn,5),Q(Hn,5),Q(Nn,5),Q(Qn,5),Q(jn,5),Q(Kn,5),Q($n,5)),i&2){let o;u(o=h())&&(n.filterViewChild=o.first),u(o=h())&&(n.focusInputViewChild=o.first),u(o=h())&&(n.editableInputViewChild=o.first),u(o=h())&&(n.itemsViewChild=o.first),u(o=h())&&(n.scroller=o.first),u(o=h())&&(n.overlayViewChild=o.first),u(o=h())&&(n.firstHiddenFocusableElementOnOverlay=o.first),u(o=h())&&(n.lastHiddenFocusableElementOnOverlay=o.first)}},hostVars:3,hostBindings:function(i,n){i&1&&D("click",function(l){return n.onContainerClick(l)}),i&2&&(k("id",n.id),m(n.cn(n.cx("root"),n.styleClass)))},inputs:{id:"id",scrollHeight:"scrollHeight",filter:[2,"filter","filter",v],panelStyle:"panelStyle",styleClass:"styleClass",panelStyleClass:"panelStyleClass",readonly:[2,"readonly","readonly",v],editable:[2,"editable","editable",v],tabindex:[2,"tabindex","tabindex",Qe],placeholder:"placeholder",loadingIcon:"loadingIcon",filterPlaceholder:"filterPlaceholder",filterLocale:"filterLocale",inputId:"inputId",dataKey:"dataKey",filterBy:"filterBy",filterFields:"filterFields",autofocus:[2,"autofocus","autofocus",v],resetFilterOnHide:[2,"resetFilterOnHide","resetFilterOnHide",v],checkmark:[2,"checkmark","checkmark",v],dropdownIcon:"dropdownIcon",loading:[2,"loading","loading",v],optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",optionGroupLabel:"optionGroupLabel",optionGroupChildren:"optionGroupChildren",group:[2,"group","group",v],showClear:[2,"showClear","showClear",v],emptyFilterMessage:"emptyFilterMessage",emptyMessage:"emptyMessage",lazy:[2,"lazy","lazy",v],virtualScroll:[2,"virtualScroll","virtualScroll",v],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",Qe],virtualScrollOptions:"virtualScrollOptions",overlayOptions:"overlayOptions",ariaFilterLabel:"ariaFilterLabel",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",filterMatchMode:"filterMatchMode",tooltip:"tooltip",tooltipPosition:"tooltipPosition",tooltipPositionStyle:"tooltipPositionStyle",tooltipStyleClass:"tooltipStyleClass",focusOnHover:[2,"focusOnHover","focusOnHover",v],selectOnFocus:[2,"selectOnFocus","selectOnFocus",v],autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",v],autofocusFilter:[2,"autofocusFilter","autofocusFilter",v],filterValue:"filterValue",options:"options",appendTo:[1,"appendTo"]},outputs:{onChange:"onChange",onFilter:"onFilter",onFocus:"onFocus",onBlur:"onBlur",onClick:"onClick",onShow:"onShow",onHide:"onHide",onClear:"onClear",onLazyLoad:"onLazyLoad"},features:[q([Xo,Ze]),I],decls:11,vars:14,consts:[["elseBlock",""],["overlay",""],["content",""],["focusInput",""],["defaultPlaceholder",""],["editableInput",""],["firstHiddenFocusableEl",""],["buildInItems",""],["lastHiddenFocusableEl",""],["builtInFilterElement",""],["filter",""],["scroller",""],["loader",""],["items",""],["emptyFilter",""],["empty",""],["role","combobox",3,"class","pTooltip","tooltipPosition","positionStyle","tooltipStyleClass","pAutoFocus","focus","blur","keydown",4,"ngIf"],["type","text",3,"class","pAutoFocus","input","keydown","focus","blur",4,"ngIf"],[4,"ngIf"],["role","button","aria-label","dropdown trigger","aria-haspopup","listbox"],[4,"ngIf","ngIfElse"],[3,"visibleChange","onAnimationStart","onHide","hostAttrSelector","visible","options","target","appendTo"],["role","combobox",3,"focus","blur","keydown","pTooltip","tooltipPosition","positionStyle","tooltipStyleClass","pAutoFocus"],[3,"ngTemplateOutlet","ngTemplateOutletContext",4,"ngIf"],[3,"ngTemplateOutlet","ngTemplateOutletContext"],["type","text",3,"input","keydown","focus","blur","pAutoFocus"],["data-p-icon","times",3,"class","click",4,"ngIf"],[3,"class","click",4,"ngIf"],["data-p-icon","times",3,"click"],[3,"click"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngTemplateOutlet"],["aria-hidden","true",3,"class",4,"ngIf"],["aria-hidden","true"],[3,"class",4,"ngIf"],["data-p-icon","chevron-down",3,"class",4,"ngIf"],["data-p-icon","chevron-down"],[3,"ngStyle"],["role","presentation",1,"p-hidden-accessible","p-hidden-focusable",3,"focus"],[3,"items","style","itemSize","autoSize","lazy","options","onLazyLoad",4,"ngIf"],["pInputText","","type","text","role","searchbox","autocomplete","off",3,"input","keydown","blur","pSize","value","variant"],["data-p-icon","search",4,"ngIf"],["data-p-icon","search"],[3,"onLazyLoad","items","itemSize","autoSize","lazy","options"],["role","listbox"],["ngFor","",3,"ngForOf"],["role","option",3,"class","ngStyle",4,"ngIf"],["role","option",3,"ngStyle"],[3,"onClick","onMouseEnter","id","option","checkmark","selected","label","disabled","template","focused","ariaPosInset","ariaSetSize"]],template:function(i,n){if(i&1){let o=N();p(0,Jn,6,22,"span",16)(1,Yn,2,18,"input",17)(2,no,3,2,"ng-container",18),f(3,"div",19),p(4,co,3,2,"ng-container",20)(5,go,2,2,"ng-template",null,0,G),_(),f(7,"p-overlay",21,1),vt("visibleChange",function(d){return b(o),yt(n.overlayVisible,d)||(n.overlayVisible=d),x(d)}),D("onAnimationStart",function(d){return b(o),x(n.onOverlayAnimationStart(d))})("onHide",function(){return b(o),x(n.hide())}),p(9,Zo,13,18,"ng-template",null,2,G),_()}if(i&2){let o=ie(6);a("ngIf",!n.editable),c(),a("ngIf",n.editable),c(),a("ngIf",n.isVisibleClearIcon),c(),m(n.cx("dropdown")),k("aria-expanded",n.overlayVisible??!1)("data-pc-section","trigger"),c(),a("ngIf",n.loading)("ngIfElse",o),c(3),a("hostAttrSelector",n.attrSelector),gt("visible",n.overlayVisible),a("options",n.overlayOptions)("target","@parent")("appendTo",n.$appendTo())}},dependencies:[ne,je,Ce,we,Ie,el,di,$t,Nt,jt,ni,oi,Ut,ei,si,mi,ce],encapsulation:2,changeDetection:0})}return t})();export{ni as a,qt as b,Ue as c,Ut as d,wl as e,Jt as f,tl as g};
