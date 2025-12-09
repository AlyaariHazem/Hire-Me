import{d as z}from"./chunk-AMR4QFRP.js";import{Ka as y,P as v,ea as m}from"./chunk-7PSQEJNY.js";import{Bc as b,Ec as r,Kc as o,Mb as g,S as l,T as s,X as i,_b as x,ab as u,bb as p,db as c,hb as f,jc as h,pa as d}from"./chunk-G6MH4OCE.js";var M=`
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`;var F=`
    ${M}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`,w={root:({instance:e})=>["p-textarea p-component",{"p-filled":e.$filled(),"p-textarea-resizable ":e.autoResize,"p-variant-filled":e.$variant()==="filled","p-textarea-fluid":e.hasFluid,"p-inputfield-sm p-textarea-sm":e.pSize==="small","p-textarea-lg p-inputfield-lg":e.pSize==="large","p-invalid":e.invalid()}]},S=(()=>{class e extends v{name="textarea";theme=F;classes=w;static \u0275fac=(()=>{let t;return function(a){return(t||(t=d(e)))(a||e)}})();static \u0275prov=l({token:e,factory:e.\u0275fac})}return e})();var G=(()=>{class e extends z{autoResize;pSize;variant=r();fluid=r(void 0,{transform:o});invalid=r(void 0,{transform:o});$variant=b(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onResize=new f;ngModelSubscription;ngControlSubscription;_componentStyle=i(S);ngControl=i(m,{optional:!0,self:!0});pcFluid=i(y,{optional:!0,host:!0,skipSelf:!0});get hasFluid(){return this.fluid()??!!this.pcFluid}ngOnInit(){super.ngOnInit(),this.ngControl&&(this.ngControlSubscription=this.ngControl.valueChanges.subscribe(()=>{this.updateState()}))}ngAfterViewInit(){super.ngAfterViewInit(),this.autoResize&&this.resize(),this.cd.detectChanges()}ngAfterViewChecked(){this.autoResize&&this.resize()}onInput(t){this.writeModelValue(t.target.value),this.updateState()}resize(t){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(t||{})}updateState(){this.autoResize&&this.resize()}ngOnDestroy(){this.ngModelSubscription&&this.ngModelSubscription.unsubscribe(),this.ngControlSubscription&&this.ngControlSubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=(()=>{let t;return function(a){return(t||(t=d(e)))(a||e)}})();static \u0275dir=p({type:e,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostVars:2,hostBindings:function(n,a){n&1&&g("input",function(k){return a.onInput(k)}),n&2&&x(a.cx("root"))},inputs:{autoResize:[2,"autoResize","autoResize",o],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},outputs:{onResize:"onResize"},features:[h([S]),c]})}return e})(),L=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=u({type:e});static \u0275inj=s({})}return e})();export{G as a,L as b};
