import{d as fe,f as be}from"./chunk-ILCZY2JG.js";import{Ba as P,Ea as _e,I as ce,J as K,L as pe,V as me,Z as de,r as le,za as he}from"./chunk-HUELAIDB.js";import{b as re,d as oe,e as ue,f as ae,j as se}from"./chunk-7IBYSJKF.js";import{$ as m,Ab as G,Ac as V,Bb as R,Bc as O,Cb as L,Eb as S,Jb as E,Kb as a,Na as _,Nb as $,Ob as ne,P as W,Pb as U,Q as H,Qb as A,R as Z,Ta as ee,V as J,Vb as w,Za as k,_ as p,_a as te,a as Q,aa as I,b as q,bb as M,ca as X,cb as g,dc as ie,eb as F,ma as Y,na as N,nb as b,ub as d,vb as D,wb as B,xb as v}from"./chunk-L43F6PFV.js";var ve=["data-p-icon","angle-down"],xe=(()=>{class i extends P{static \u0275fac=(()=>{let e;return function(t){return(e||(e=N(i)))(t||i)}})();static \u0275cmp=k({type:i,selectors:[["","data-p-icon","angle-down"]],features:[M],attrs:ve,decls:1,vars:0,consts:[["d","M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z","fill","currentColor"]],template:function(n,t){n&1&&(I(),G(0,"path",0))},encapsulation:2})}return i})();var Ve=["data-p-icon","angle-up"],ye=(()=>{class i extends P{static \u0275fac=(()=>{let e;return function(t){return(e||(e=N(i)))(t||i)}})();static \u0275cmp=k({type:i,selectors:[["","data-p-icon","angle-up"]],features:[M],attrs:Ve,decls:1,vars:0,consts:[["d","M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z","fill","currentColor"]],template:function(n,t){n&1&&(I(),G(0,"path",0))},encapsulation:2})}return i})();var Ie=`
    .p-inputnumber {
        display: inline-flex;
        position: relative;
    }

    .p-inputnumber-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        cursor: pointer;
        background: dt('inputnumber.button.background');
        color: dt('inputnumber.button.color');
        width: dt('inputnumber.button.width');
        transition:
            background dt('inputnumber.transition.duration'),
            color dt('inputnumber.transition.duration'),
            border-color dt('inputnumber.transition.duration'),
            outline-color dt('inputnumber.transition.duration');
    }

    .p-inputnumber-button:disabled {
        cursor: auto;
    }

    .p-inputnumber-button:not(:disabled):hover {
        background: dt('inputnumber.button.hover.background');
        color: dt('inputnumber.button.hover.color');
    }

    .p-inputnumber-button:not(:disabled):active {
        background: dt('inputnumber.button.active.background');
        color: dt('inputnumber.button.active.color');
    }

    .p-inputnumber-stacked .p-inputnumber-button {
        position: relative;
        flex: 1 1 auto;
        border: 0 none;
    }

    .p-inputnumber-stacked .p-inputnumber-button-group {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset-block-start: 1px;
        inset-inline-end: 1px;
        height: calc(100% - 2px);
        z-index: 1;
    }

    .p-inputnumber-stacked .p-inputnumber-increment-button {
        padding: 0;
        border-start-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-decrement-button {
        padding: 0;
        border-end-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-horizontal .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-increment-button {
        order: 3;
        border-start-end-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        border-inline-start: 0 none;
    }

    .p-inputnumber-horizontal .p-inputnumber-input {
        order: 2;
        border-radius: 0;
    }

    .p-inputnumber-horizontal .p-inputnumber-decrement-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-inline-end: 0 none;
    }

    .p-floatlabel:has(.p-inputnumber-horizontal) label {
        margin-inline-start: dt('inputnumber.button.width');
    }

    .p-inputnumber-vertical {
        flex-direction: column;
    }

    .p-inputnumber-vertical .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
        padding: dt('inputnumber.button.vertical.padding');
    }

    .p-inputnumber-vertical .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-increment-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-start-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-end: 0 none;
    }

    .p-inputnumber-vertical .p-inputnumber-input {
        order: 2;
        border-radius: 0;
        text-align: center;
    }

    .p-inputnumber-vertical .p-inputnumber-decrement-button {
        order: 3;
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-start: 0 none;
    }

    .p-inputnumber-input {
        flex: 1 1 auto;
    }

    .p-inputnumber-fluid {
        width: 100%;
    }

    .p-inputnumber-fluid .p-inputnumber-input {
        width: 1%;
    }

    .p-inputnumber-fluid.p-inputnumber-vertical .p-inputnumber-input {
        width: 100%;
    }

    .p-inputnumber:has(.p-inputtext-sm) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-inputnumber:has(.p-inputtext-lg) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-inputnumber-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .p-inputnumber-stacked .p-inputnumber-clear-icon, 
    .p-inputnumber-horizontal .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }
`;var Te=["clearicon"],De=["incrementbuttonicon"],Be=["decrementbuttonicon"],Ee=["input"];function Se(i,h){if(i&1){let e=S();I(),D(0,"svg",7),E("click",function(){p(e);let t=a(2);return m(t.clear())}),B()}if(i&2){let e=a(2);w(e.cx("clearIcon")),b("data-pc-section","clearIcon")}}function Ne(i,h){}function ke(i,h){i&1&&g(0,Ne,0,0,"ng-template")}function Me(i,h){if(i&1){let e=S();D(0,"span",8),E("click",function(){p(e);let t=a(2);return m(t.clear())}),g(1,ke,1,0,null,9),B()}if(i&2){let e=a(2);w(e.cx("clearIcon")),b("data-pc-section","clearIcon"),_(),d("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)}}function Fe(i,h){if(i&1&&(R(0),g(1,Se,1,3,"svg",5)(2,Me,2,4,"span",6),L()),i&2){let e=a();_(),d("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),_(),d("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function Re(i,h){if(i&1&&v(0,"span",12),i&2){let e=a(2);d("ngClass",e.incrementButtonIcon),b("data-pc-section","incrementbuttonicon")}}function Le(i,h){i&1&&(I(),v(0,"svg",14)),i&2&&b("data-pc-section","incrementbuttonicon")}function Ue(i,h){}function Ae(i,h){i&1&&g(0,Ue,0,0,"ng-template")}function $e(i,h){if(i&1&&(R(0),g(1,Le,1,1,"svg",13)(2,Ae,1,0,null,9),L()),i&2){let e=a(2);_(),d("ngIf",!e.incrementButtonIconTemplate&&!e._incrementButtonIconTemplate),_(),d("ngTemplateOutlet",e.incrementButtonIconTemplate||e._incrementButtonIconTemplate)}}function ze(i,h){if(i&1&&v(0,"span",12),i&2){let e=a(2);d("ngClass",e.decrementButtonIcon),b("data-pc-section","decrementbuttonicon")}}function Ge(i,h){i&1&&(I(),v(0,"svg",16)),i&2&&b("data-pc-section","decrementbuttonicon")}function Oe(i,h){}function Ke(i,h){i&1&&g(0,Oe,0,0,"ng-template")}function Pe(i,h){if(i&1&&(R(0),g(1,Ge,1,1,"svg",15)(2,Ke,1,0,null,9),L()),i&2){let e=a(2);_(),d("ngIf",!e.decrementButtonIconTemplate&&!e._decrementButtonIconTemplate),_(),d("ngTemplateOutlet",e.decrementButtonIconTemplate||e._decrementButtonIconTemplate)}}function je(i,h){if(i&1){let e=S();D(0,"span")(1,"button",10),E("mousedown",function(t){p(e);let r=a();return m(r.onUpButtonMouseDown(t))})("mouseup",function(){p(e);let t=a();return m(t.onUpButtonMouseUp())})("mouseleave",function(){p(e);let t=a();return m(t.onUpButtonMouseLeave())})("keydown",function(t){p(e);let r=a();return m(r.onUpButtonKeyDown(t))})("keyup",function(){p(e);let t=a();return m(t.onUpButtonKeyUp())}),g(2,Re,1,2,"span",11)(3,$e,3,2,"ng-container",2),B(),D(4,"button",10),E("mousedown",function(t){p(e);let r=a();return m(r.onDownButtonMouseDown(t))})("mouseup",function(){p(e);let t=a();return m(t.onDownButtonMouseUp())})("mouseleave",function(){p(e);let t=a();return m(t.onDownButtonMouseLeave())})("keydown",function(t){p(e);let r=a();return m(r.onDownButtonKeyDown(t))})("keyup",function(){p(e);let t=a();return m(t.onDownButtonKeyUp())}),g(5,ze,1,2,"span",11)(6,Pe,3,2,"ng-container",2),B()()}if(i&2){let e=a();w(e.cx("buttonGroup")),b("data-pc-section","buttonGroup"),_(),w(e.cn(e.cx("incrementButton"),e.incrementButtonClass)),b("disabled",e.$disabled()?"":void 0)("aria-hidden",!0)("data-pc-section","incrementbutton"),_(),d("ngIf",e.incrementButtonIcon),_(),d("ngIf",!e.incrementButtonIcon),_(),w(e.cn(e.cx("decrementButton"),e.decrementButtonClass)),b("disabled",e.$disabled()?"":void 0)("aria-hidden",!0)("data-pc-section","decrementbutton"),_(),d("ngIf",e.decrementButtonIcon),_(),d("ngIf",!e.decrementButtonIcon)}}function Qe(i,h){if(i&1&&v(0,"span",12),i&2){let e=a(2);d("ngClass",e.incrementButtonIcon),b("data-pc-section","incrementbuttonicon")}}function qe(i,h){i&1&&(I(),v(0,"svg",14)),i&2&&b("data-pc-section","incrementbuttonicon")}function We(i,h){}function He(i,h){i&1&&g(0,We,0,0,"ng-template")}function Ze(i,h){if(i&1&&(R(0),g(1,qe,1,1,"svg",13)(2,He,1,0,null,9),L()),i&2){let e=a(2);_(),d("ngIf",!e.incrementButtonIconTemplate&&!e._incrementButtonIconTemplate),_(),d("ngTemplateOutlet",e.incrementButtonIconTemplate||e._incrementButtonIconTemplate)}}function Je(i,h){if(i&1){let e=S();D(0,"button",10),E("mousedown",function(t){p(e);let r=a();return m(r.onUpButtonMouseDown(t))})("mouseup",function(){p(e);let t=a();return m(t.onUpButtonMouseUp())})("mouseleave",function(){p(e);let t=a();return m(t.onUpButtonMouseLeave())})("keydown",function(t){p(e);let r=a();return m(r.onUpButtonKeyDown(t))})("keyup",function(){p(e);let t=a();return m(t.onUpButtonKeyUp())}),g(1,Qe,1,2,"span",11)(2,Ze,3,2,"ng-container",2),B()}if(i&2){let e=a();w(e.cx("incrementButton")),b("disabled",e.$disabled()?"":void 0)("aria-hidden",!0)("data-pc-section","incrementbutton"),_(),d("ngIf",e.incrementButtonIcon),_(),d("ngIf",!e.incrementButtonIcon)}}function Xe(i,h){if(i&1&&v(0,"span",12),i&2){let e=a(2);d("ngClass",e.decrementButtonIcon),b("data-pc-section","decrementbuttonicon")}}function Ye(i,h){i&1&&(I(),v(0,"svg",16)),i&2&&b("data-pc-section","decrementbuttonicon")}function et(i,h){}function tt(i,h){i&1&&g(0,et,0,0,"ng-template")}function nt(i,h){if(i&1&&(R(0),g(1,Ye,1,1,"svg",15)(2,tt,1,0,null,9),L()),i&2){let e=a(2);_(),d("ngIf",!e.decrementButtonIconTemplate&&!e._decrementButtonIconTemplate),_(),d("ngTemplateOutlet",e.decrementButtonIconTemplate||e._decrementButtonIconTemplate)}}function it(i,h){if(i&1){let e=S();D(0,"button",10),E("mousedown",function(t){p(e);let r=a();return m(r.onDownButtonMouseDown(t))})("mouseup",function(){p(e);let t=a();return m(t.onDownButtonMouseUp())})("mouseleave",function(){p(e);let t=a();return m(t.onDownButtonMouseLeave())})("keydown",function(t){p(e);let r=a();return m(r.onDownButtonKeyDown(t))})("keyup",function(){p(e);let t=a();return m(t.onDownButtonKeyUp())}),g(1,Xe,1,2,"span",11)(2,nt,3,2,"ng-container",2),B()}if(i&2){let e=a();w(e.cx("decrementButton")),b("disabled",e.$disabled()?"":void 0)("aria-hidden",!0)("data-pc-section","decrementbutton"),_(),d("ngIf",e.decrementButtonIcon),_(),d("ngIf",!e.decrementButtonIcon)}}var rt=`
    ${Ie}

    /* For PrimeNG */
    p-inputNumber.ng-invalid.ng-dirty > .p-inputtext,
    p-input-number.ng-invalid.ng-dirty > .p-inputtext,
    p-inputnumber.ng-invalid.ng-dirty > .p-inputtext {
        border-color: dt('inputtext.invalid.border.color');
    }

    p-inputNumber.ng-invalid.ng-dirty > .p-inputtext:enabled:focus,
    p-input-number.ng-invalid.ng-dirty > .p-inputtext:enabled:focus,
    p-inputnumber.ng-invalid.ng-dirty > .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
    }

    p-inputNumber.ng-invalid.ng-dirty > .p-inputtext::placeholder,
    p-input-number.ng-invalid.ng-dirty > .p-inputtext::placeholder,
    p-inputnumber.ng-invalid.ng-dirty > .p-inputtext::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,ot={root:({instance:i})=>["p-inputnumber p-component p-inputwrapper",{"p-inputwrapper-filled":i.$filled()||i.allowEmpty===!1,"p-inputwrapper-focus":i.focused,"p-inputnumber-stacked":i.showButtons&&i.buttonLayout==="stacked","p-inputnumber-horizontal":i.showButtons&&i.buttonLayout==="horizontal","p-inputnumber-vertical":i.showButtons&&i.buttonLayout==="vertical","p-inputnumber-fluid":i.hasFluid,"p-invalid":i.invalid()}],pcInputText:"p-inputnumber-input",buttonGroup:"p-inputnumber-button-group",incrementButton:({instance:i})=>["p-inputnumber-button p-inputnumber-increment-button",{"p-disabled":i.showButtons&&i.max()!=null&&i.maxlength()}],decrementButton:({instance:i})=>["p-inputnumber-button p-inputnumber-decrement-button",{"p-disabled":i.showButtons&&i.min()!=null&&i.minlength()}],clearIcon:"p-inputnumber-clear-icon"},we=(()=>{class i extends pe{name="inputnumber";theme=rt;classes=ot;static \u0275fac=(()=>{let e;return function(t){return(e||(e=N(i)))(t||i)}})();static \u0275prov=H({token:i,factory:i.\u0275fac})}return i})();var ut={provide:me,useExisting:W(()=>Ce),multi:!0},Ce=(()=>{class i extends be{injector;showButtons=!1;format=!0;buttonLayout="stacked";inputId;styleClass;placeholder;tabindex;title;ariaLabelledBy;ariaDescribedBy;ariaLabel;ariaRequired;autocomplete;incrementButtonClass;decrementButtonClass;incrementButtonIcon;decrementButtonIcon;readonly;allowEmpty=!0;locale;localeMatcher;mode="decimal";currency;currencyDisplay;useGrouping=!0;minFractionDigits;maxFractionDigits;prefix;suffix;inputStyle;inputStyleClass;showClear=!1;autofocus;onInput=new F;onFocus=new F;onBlur=new F;onKeyDown=new F;onClear=new F;clearIconTemplate;incrementButtonIconTemplate;decrementButtonIconTemplate;templates;input;_clearIconTemplate;_incrementButtonIconTemplate;_decrementButtonIconTemplate;value;focused;initialized;groupChar="";prefixChar="";suffixChar="";isSpecialChar;timer;lastValue;_numeral;numberFormat;_decimal;_decimalChar;_group;_minusSign;_currency;_prefix;_suffix;_index;_componentStyle=J(we);ngControl=null;constructor(e){super(),this.injector=e}ngOnChanges(e){super.ngOnChanges(e),["locale","localeMatcher","mode","currency","currencyDisplay","useGrouping","minFractionDigits","maxFractionDigits","prefix","suffix"].some(t=>!!e[t])&&this.updateConstructParser()}ngOnInit(){super.ngOnInit(),this.ngControl=this.injector.get(de,null,{optional:!0}),this.constructParser(),this.initialized=!0}ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"clearicon":this._clearIconTemplate=e.template;break;case"incrementbuttonicon":this._incrementButtonIconTemplate=e.template;break;case"decrementbuttonicon":this._decrementButtonIconTemplate=e.template;break}})}getOptions(){return{localeMatcher:this.localeMatcher,style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:this.useGrouping,minimumFractionDigits:this.minFractionDigits??void 0,maximumFractionDigits:this.maxFractionDigits??void 0}}constructParser(){this.numberFormat=new Intl.NumberFormat(this.locale,this.getOptions());let e=[...new Intl.NumberFormat(this.locale,{useGrouping:!1}).format(9876543210)].reverse(),n=new Map(e.map((t,r)=>[t,r]));this._numeral=new RegExp(`[${e.join("")}]`,"g"),this._group=this.getGroupingExpression(),this._minusSign=this.getMinusSignExpression(),this._currency=this.getCurrencyExpression(),this._decimal=this.getDecimalExpression(),this._decimalChar=this.getDecimalChar(),this._suffix=this.getSuffixExpression(),this._prefix=this.getPrefixExpression(),this._index=t=>n.get(t)}updateConstructParser(){this.initialized&&this.constructParser()}escapeRegExp(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}getDecimalExpression(){let e=this.getDecimalChar();return new RegExp(`[${e}]`,"g")}getDecimalChar(){return new Intl.NumberFormat(this.locale,q(Q({},this.getOptions()),{useGrouping:!1})).format(1.1).replace(this._currency,"").trim().replace(this._numeral,"")}getGroupingExpression(){let e=new Intl.NumberFormat(this.locale,{useGrouping:!0});return this.groupChar=e.format(1e6).trim().replace(this._numeral,"").charAt(0),new RegExp(`[${this.groupChar}]`,"g")}getMinusSignExpression(){let e=new Intl.NumberFormat(this.locale,{useGrouping:!1});return new RegExp(`[${e.format(-1).trim().replace(this._numeral,"")}]`,"g")}getCurrencyExpression(){if(this.currency){let e=new Intl.NumberFormat(this.locale,{style:"currency",currency:this.currency,currencyDisplay:this.currencyDisplay,minimumFractionDigits:0,maximumFractionDigits:0});return new RegExp(`[${e.format(1).replace(/\s/g,"").replace(this._numeral,"").replace(this._group,"")}]`,"g")}return new RegExp("[]","g")}getPrefixExpression(){if(this.prefix)this.prefixChar=this.prefix;else{let e=new Intl.NumberFormat(this.locale,{style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay});this.prefixChar=e.format(1).split("1")[0]}return new RegExp(`${this.escapeRegExp(this.prefixChar||"")}`,"g")}getSuffixExpression(){if(this.suffix)this.suffixChar=this.suffix;else{let e=new Intl.NumberFormat(this.locale,{style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay,minimumFractionDigits:0,maximumFractionDigits:0});this.suffixChar=e.format(1).split("1")[1]}return new RegExp(`${this.escapeRegExp(this.suffixChar||"")}`,"g")}formatValue(e){if(e!=null){if(e==="-")return e;if(this.format){let t=new Intl.NumberFormat(this.locale,this.getOptions()).format(e);return this.prefix&&e!=this.prefix&&(t=this.prefix+t),this.suffix&&e!=this.suffix&&(t=t+this.suffix),t}return e.toString()}return""}parseValue(e){let n=new RegExp(this._suffix,""),t=new RegExp(this._prefix,""),r=new RegExp(this._currency,""),o=e.replace(n,"").replace(t,"").trim().replace(/\s/g,"").replace(r,"").replace(this._group,"").replace(this._minusSign,"-").replace(this._decimal,".").replace(this._numeral,this._index);if(o){if(o==="-")return o;let u=+o;return isNaN(u)?null:u}return null}repeat(e,n,t){if(this.readonly)return;let r=n||500;this.clearTimer(),this.timer=setTimeout(()=>{this.repeat(e,40,t)},r),this.spin(e,t)}spin(e,n){let t=(this.step()??1)*n,r=this.parseValue(this.input?.nativeElement.value)||0,o=this.validateValue(r+t);this.maxlength()&&this.maxlength()<this.formatValue(o).length||(this.updateInput(o,null,"spin",null),this.updateModel(e,o),this.handleOnInput(e,r,o))}clear(){this.value=null,this.onModelChange(this.value),this.onClear.emit()}onUpButtonMouseDown(e){if(e.button===2){this.clearTimer();return}this.$disabled()||(this.input?.nativeElement.focus(),this.repeat(e,null,1),e.preventDefault())}onUpButtonMouseUp(){this.$disabled()||this.clearTimer()}onUpButtonMouseLeave(){this.$disabled()||this.clearTimer()}onUpButtonKeyDown(e){(e.keyCode===32||e.keyCode===13)&&this.repeat(e,null,1)}onUpButtonKeyUp(){this.$disabled()||this.clearTimer()}onDownButtonMouseDown(e){if(e.button===2){this.clearTimer();return}this.$disabled()||(this.input?.nativeElement.focus(),this.repeat(e,null,-1),e.preventDefault())}onDownButtonMouseUp(){this.$disabled()||this.clearTimer()}onDownButtonMouseLeave(){this.$disabled()||this.clearTimer()}onDownButtonKeyUp(){this.$disabled()||this.clearTimer()}onDownButtonKeyDown(e){(e.keyCode===32||e.keyCode===13)&&this.repeat(e,null,-1)}onUserInput(e){this.readonly||(this.isSpecialChar&&(e.target.value=this.lastValue),this.isSpecialChar=!1)}onInputKeyDown(e){if(this.readonly)return;if(this.lastValue=e.target.value,e.shiftKey||e.altKey){this.isSpecialChar=!0;return}let n=e.target.selectionStart,t=e.target.selectionEnd,r=e.target.value,o=null;switch(e.altKey&&e.preventDefault(),e.key){case"ArrowUp":this.spin(e,1),e.preventDefault();break;case"ArrowDown":this.spin(e,-1),e.preventDefault();break;case"ArrowLeft":for(let u=n;u<=r.length;u++){let l=u===0?0:u-1;if(this.isNumeralChar(r.charAt(l))){this.input.nativeElement.setSelectionRange(u,u);break}}break;case"ArrowRight":for(let u=t;u>=0;u--)if(this.isNumeralChar(r.charAt(u))){this.input.nativeElement.setSelectionRange(u,u);break}break;case"Tab":case"Enter":o=this.validateValue(this.parseValue(this.input.nativeElement.value)),this.input.nativeElement.value=this.formatValue(o),this.input.nativeElement.setAttribute("aria-valuenow",o),this.updateModel(e,o);break;case"Backspace":{if(e.preventDefault(),n===t){if(n==1&&this.prefix||n==r.length&&this.suffix)break;let u=r.charAt(n-1),{decimalCharIndex:l,decimalCharIndexWithoutPrefix:c}=this.getDecimalCharIndexes(r);if(this.isNumeralChar(u)){let s=this.getDecimalLength(r);if(this._group.test(u))this._group.lastIndex=0,o=r.slice(0,n-2)+r.slice(n-1);else if(this._decimal.test(u))this._decimal.lastIndex=0,s?this.input?.nativeElement.setSelectionRange(n-1,n-1):o=r.slice(0,n-1)+r.slice(n);else if(l>0&&n>l){let x=this.isDecimalMode()&&(this.minFractionDigits||0)<s?"":"0";o=r.slice(0,n-1)+x+r.slice(n)}else c===1?(o=r.slice(0,n-1)+"0"+r.slice(n),o=this.parseValue(o)>0?o:""):o=r.slice(0,n-1)+r.slice(n)}else this.mode==="currency"&&u.search(this._currency)!=-1&&(o=r.slice(1));this.updateValue(e,o,null,"delete-single")}else o=this.deleteRange(r,n,t),this.updateValue(e,o,null,"delete-range");break}case"Delete":if(e.preventDefault(),n===t){if(n==0&&this.prefix||n==r.length-1&&this.suffix)break;let u=r.charAt(n),{decimalCharIndex:l,decimalCharIndexWithoutPrefix:c}=this.getDecimalCharIndexes(r);if(this.isNumeralChar(u)){let s=this.getDecimalLength(r);if(this._group.test(u))this._group.lastIndex=0,o=r.slice(0,n)+r.slice(n+2);else if(this._decimal.test(u))this._decimal.lastIndex=0,s?this.input?.nativeElement.setSelectionRange(n+1,n+1):o=r.slice(0,n)+r.slice(n+1);else if(l>0&&n>l){let x=this.isDecimalMode()&&(this.minFractionDigits||0)<s?"":"0";o=r.slice(0,n)+x+r.slice(n+1)}else c===1?(o=r.slice(0,n)+"0"+r.slice(n+1),o=this.parseValue(o)>0?o:""):o=r.slice(0,n)+r.slice(n+1)}this.updateValue(e,o,null,"delete-back-single")}else o=this.deleteRange(r,n,t),this.updateValue(e,o,null,"delete-range");break;case"Home":this.min()&&(this.updateModel(e,this.min()),e.preventDefault());break;case"End":this.max()&&(this.updateModel(e,this.max()),e.preventDefault());break;default:break}this.onKeyDown.emit(e)}onInputKeyPress(e){if(this.readonly)return;let n=e.which||e.keyCode,t=String.fromCharCode(n),r=this.isDecimalSign(t),o=this.isMinusSign(t);n!=13&&e.preventDefault(),!r&&e.code==="NumpadDecimal"&&(r=!0,t=this._decimalChar,n=t.charCodeAt(0));let{value:u,selectionStart:l,selectionEnd:c}=this.input.nativeElement,s=this.parseValue(u+t),x=s!=null?s.toString():"",y=u.substring(l,c),f=this.parseValue(y),T=f!=null?f.toString():"";if(l!==c&&T.length>0){this.insert(e,t,{isDecimalSign:r,isMinusSign:o});return}this.maxlength()&&x.length>this.maxlength()||(48<=n&&n<=57||o||r)&&this.insert(e,t,{isDecimalSign:r,isMinusSign:o})}onPaste(e){if(!this.$disabled()&&!this.readonly){e.preventDefault();let n=(e.clipboardData||this.document.defaultView.clipboardData).getData("Text");if(n){this.maxlength()&&(n=n.toString().substring(0,this.maxlength()));let t=this.parseValue(n);t!=null&&this.insert(e,t.toString())}}}allowMinusSign(){return this.min()==null||this.min()<0}isMinusSign(e){return this._minusSign.test(e)||e==="-"?(this._minusSign.lastIndex=0,!0):!1}isDecimalSign(e){return this._decimal.test(e)?(this._decimal.lastIndex=0,!0):!1}isDecimalMode(){return this.mode==="decimal"}getDecimalCharIndexes(e){let n=e.search(this._decimal);this._decimal.lastIndex=0;let r=e.replace(this._prefix,"").trim().replace(/\s/g,"").replace(this._currency,"").search(this._decimal);return this._decimal.lastIndex=0,{decimalCharIndex:n,decimalCharIndexWithoutPrefix:r}}getCharIndexes(e){let n=e.search(this._decimal);this._decimal.lastIndex=0;let t=e.search(this._minusSign);this._minusSign.lastIndex=0;let r=e.search(this._suffix);this._suffix.lastIndex=0;let o=e.search(this._currency);return this._currency.lastIndex=0,{decimalCharIndex:n,minusCharIndex:t,suffixCharIndex:r,currencyCharIndex:o}}insert(e,n,t={isDecimalSign:!1,isMinusSign:!1}){let r=n.search(this._minusSign);if(this._minusSign.lastIndex=0,!this.allowMinusSign()&&r!==-1)return;let o=this.input?.nativeElement.selectionStart,u=this.input?.nativeElement.selectionEnd,l=this.input?.nativeElement.value.trim(),{decimalCharIndex:c,minusCharIndex:s,suffixCharIndex:x,currencyCharIndex:y}=this.getCharIndexes(l),f;if(t.isMinusSign)o===0&&(f=l,(s===-1||u!==0)&&(f=this.insertText(l,n,0,u)),this.updateValue(e,f,n,"insert"));else if(t.isDecimalSign)c>0&&o===c?this.updateValue(e,l,n,"insert"):c>o&&c<u?(f=this.insertText(l,n,o,u),this.updateValue(e,f,n,"insert")):c===-1&&this.maxFractionDigits&&(f=this.insertText(l,n,o,u),this.updateValue(e,f,n,"insert"));else{let T=this.numberFormat.resolvedOptions().maximumFractionDigits,C=o!==u?"range-insert":"insert";if(c>0&&o>c){if(o+n.length-(c+1)<=T){let z=y>=o?y-1:x>=o?x:l.length;f=l.slice(0,o)+n+l.slice(o+n.length,z)+l.slice(z),this.updateValue(e,f,n,C)}}else f=this.insertText(l,n,o,u),this.updateValue(e,f,n,C)}}insertText(e,n,t,r){if((n==="."?n:n.split(".")).length===2){let u=e.slice(t,r).search(this._decimal);return this._decimal.lastIndex=0,u>0?e.slice(0,t)+this.formatValue(n)+e.slice(r):e||this.formatValue(n)}else return r-t===e.length?this.formatValue(n):t===0?n+e.slice(r):r===e.length?e.slice(0,t)+n:e.slice(0,t)+n+e.slice(r)}deleteRange(e,n,t){let r;return t-n===e.length?r="":n===0?r=e.slice(t):t===e.length?r=e.slice(0,n):r=e.slice(0,n)+e.slice(t),r}initCursor(){let e=this.input?.nativeElement.selectionStart,n=this.input?.nativeElement.selectionEnd,t=this.input?.nativeElement.value,r=t.length,o=null,u=(this.prefixChar||"").length;t=t.replace(this._prefix,""),(e===n||e!==0||n<u)&&(e-=u);let l=t.charAt(e);if(this.isNumeralChar(l))return e+u;let c=e-1;for(;c>=0;)if(l=t.charAt(c),this.isNumeralChar(l)){o=c+u;break}else c--;if(o!==null)this.input?.nativeElement.setSelectionRange(o+1,o+1);else{for(c=e;c<r;)if(l=t.charAt(c),this.isNumeralChar(l)){o=c+u;break}else c++;o!==null&&this.input?.nativeElement.setSelectionRange(o,o)}return o||0}onInputClick(){let e=this.input?.nativeElement.value;!this.readonly&&e!==le()&&this.initCursor()}isNumeralChar(e){return e.length===1&&(this._numeral.test(e)||this._decimal.test(e)||this._group.test(e)||this._minusSign.test(e))?(this.resetRegex(),!0):!1}resetRegex(){this._numeral.lastIndex=0,this._decimal.lastIndex=0,this._group.lastIndex=0,this._minusSign.lastIndex=0}updateValue(e,n,t,r){let o=this.input?.nativeElement.value,u=null;n!=null&&(u=this.parseValue(n),u=!u&&!this.allowEmpty?0:u,this.updateInput(u,t,r,n),this.handleOnInput(e,o,u))}handleOnInput(e,n,t){this.isValueChanged(n,t)&&(this.input.nativeElement.value=this.formatValue(t),this.input?.nativeElement.setAttribute("aria-valuenow",t),this.updateModel(e,t),this.onInput.emit({originalEvent:e,value:t,formattedValue:n}))}isValueChanged(e,n){if(n===null&&e!==null)return!0;if(n!=null){let t=typeof e=="string"?this.parseValue(e):e;return n!==t}return!1}validateValue(e){return e==="-"||e==null?null:this.min()!=null&&e<this.min()?this.min():this.max()!=null&&e>this.max()?this.max():e}updateInput(e,n,t,r){n=n||"";let o=this.input?.nativeElement.value,u=this.formatValue(e),l=o.length;if(u!==r&&(u=this.concatValues(u,r)),l===0){this.input.nativeElement.value=u,this.input.nativeElement.setSelectionRange(0,0);let s=this.initCursor()+n.length;this.input.nativeElement.setSelectionRange(s,s)}else{let c=this.input.nativeElement.selectionStart,s=this.input.nativeElement.selectionEnd;if(this.maxlength()&&u.length>this.maxlength()&&(u=u.slice(0,this.maxlength()),c=Math.min(c,this.maxlength()),s=Math.min(s,this.maxlength())),this.maxlength()&&this.maxlength()<u.length)return;this.input.nativeElement.value=u;let x=u.length;if(t==="range-insert"){let y=this.parseValue((o||"").slice(0,c)),T=(y!==null?y.toString():"").split("").join(`(${this.groupChar})?`),C=new RegExp(T,"g");C.test(u);let z=n.split("").join(`(${this.groupChar})?`),j=new RegExp(z,"g");j.test(u.slice(C.lastIndex)),s=C.lastIndex+j.lastIndex,this.input.nativeElement.setSelectionRange(s,s)}else if(x===l)t==="insert"||t==="delete-back-single"?this.input.nativeElement.setSelectionRange(s+1,s+1):t==="delete-single"?this.input.nativeElement.setSelectionRange(s-1,s-1):(t==="delete-range"||t==="spin")&&this.input.nativeElement.setSelectionRange(s,s);else if(t==="delete-back-single"){let y=o.charAt(s-1),f=o.charAt(s),T=l-x,C=this._group.test(f);C&&T===1?s+=1:!C&&this.isNumeralChar(y)&&(s+=-1*T+1),this._group.lastIndex=0,this.input.nativeElement.setSelectionRange(s,s)}else if(o==="-"&&t==="insert"){this.input.nativeElement.setSelectionRange(0,0);let f=this.initCursor()+n.length+1;this.input.nativeElement.setSelectionRange(f,f)}else s=s+(x-l),this.input.nativeElement.setSelectionRange(s,s)}this.input.nativeElement.setAttribute("aria-valuenow",e)}concatValues(e,n){if(e&&n){let t=n.search(this._decimal);return this._decimal.lastIndex=0,this.suffixChar?t!==-1?e.replace(this.suffixChar,"").split(this._decimal)[0]+n.replace(this.suffixChar,"").slice(t)+this.suffixChar:e:t!==-1?e.split(this._decimal)[0]+n.slice(t):e}return e}getDecimalLength(e){if(e){let n=e.split(this._decimal);if(n.length===2)return n[1].replace(this._suffix,"").trim().replace(/\s/g,"").replace(this._currency,"").length}return 0}onInputFocus(e){this.focused=!0,this.onFocus.emit(e)}onInputBlur(e){this.focused=!1;let n=this.validateValue(this.parseValue(this.input.nativeElement.value)),t=n?.toString();this.input.nativeElement.value=this.formatValue(t),this.input.nativeElement.setAttribute("aria-valuenow",t),this.updateModel(e,n),this.onModelTouched(),this.onBlur.emit(e)}formattedValue(){let e=!this.value&&!this.allowEmpty?0:this.value;return this.formatValue(e)}updateModel(e,n){let t=this.ngControl?.control?.updateOn==="blur";this.value!==n?(this.value=n,t&&this.focused||this.onModelChange(n)):t&&this.onModelChange(n)}writeControlValue(e,n){this.value=e&&Number(e),n(e),this.cd.markForCheck()}clearTimer(){this.timer&&clearInterval(this.timer)}static \u0275fac=function(n){return new(n||i)(ee(X))};static \u0275cmp=k({type:i,selectors:[["p-inputNumber"],["p-inputnumber"],["p-input-number"]],contentQueries:function(n,t,r){if(n&1&&($(r,Te,4),$(r,De,4),$(r,Be,4),$(r,ce,4)),n&2){let o;U(o=A())&&(t.clearIconTemplate=o.first),U(o=A())&&(t.incrementButtonIconTemplate=o.first),U(o=A())&&(t.decrementButtonIconTemplate=o.first),U(o=A())&&(t.templates=o)}},viewQuery:function(n,t){if(n&1&&ne(Ee,5),n&2){let r;U(r=A())&&(t.input=r.first)}},hostVars:4,hostBindings:function(n,t){n&2&&(b("data-pc-name","inputnumber")("data-pc-section","root"),w(t.cn(t.cx("root"),t.styleClass)))},inputs:{showButtons:[2,"showButtons","showButtons",V],format:[2,"format","format",V],buttonLayout:"buttonLayout",inputId:"inputId",styleClass:"styleClass",placeholder:"placeholder",tabindex:[2,"tabindex","tabindex",O],title:"title",ariaLabelledBy:"ariaLabelledBy",ariaDescribedBy:"ariaDescribedBy",ariaLabel:"ariaLabel",ariaRequired:[2,"ariaRequired","ariaRequired",V],autocomplete:"autocomplete",incrementButtonClass:"incrementButtonClass",decrementButtonClass:"decrementButtonClass",incrementButtonIcon:"incrementButtonIcon",decrementButtonIcon:"decrementButtonIcon",readonly:[2,"readonly","readonly",V],allowEmpty:[2,"allowEmpty","allowEmpty",V],locale:"locale",localeMatcher:"localeMatcher",mode:"mode",currency:"currency",currencyDisplay:"currencyDisplay",useGrouping:[2,"useGrouping","useGrouping",V],minFractionDigits:[2,"minFractionDigits","minFractionDigits",e=>O(e,null)],maxFractionDigits:[2,"maxFractionDigits","maxFractionDigits",e=>O(e,null)],prefix:"prefix",suffix:"suffix",inputStyle:"inputStyle",inputStyleClass:"inputStyleClass",showClear:[2,"showClear","showClear",V],autofocus:[2,"autofocus","autofocus",V]},outputs:{onInput:"onInput",onFocus:"onFocus",onBlur:"onBlur",onKeyDown:"onKeyDown",onClear:"onClear"},features:[ie([ut,we]),M,Y],decls:6,vars:36,consts:[["input",""],["pInputText","","role","spinbutton","inputmode","decimal",3,"input","keydown","keypress","paste","click","focus","blur","value","ngStyle","variant","invalid","pSize","pAutoFocus","fluid"],[4,"ngIf"],[3,"class",4,"ngIf"],["type","button","tabindex","-1",3,"class","mousedown","mouseup","mouseleave","keydown","keyup",4,"ngIf"],["data-p-icon","times",3,"class","click",4,"ngIf"],[3,"class","click",4,"ngIf"],["data-p-icon","times",3,"click"],[3,"click"],[4,"ngTemplateOutlet"],["type","button","tabindex","-1",3,"mousedown","mouseup","mouseleave","keydown","keyup"],[3,"ngClass",4,"ngIf"],[3,"ngClass"],["data-p-icon","angle-up",4,"ngIf"],["data-p-icon","angle-up"],["data-p-icon","angle-down",4,"ngIf"],["data-p-icon","angle-down"]],template:function(n,t){if(n&1){let r=S();D(0,"input",1,0),E("input",function(u){return p(r),m(t.onUserInput(u))})("keydown",function(u){return p(r),m(t.onInputKeyDown(u))})("keypress",function(u){return p(r),m(t.onInputKeyPress(u))})("paste",function(u){return p(r),m(t.onPaste(u))})("click",function(){return p(r),m(t.onInputClick())})("focus",function(u){return p(r),m(t.onInputFocus(u))})("blur",function(u){return p(r),m(t.onInputBlur(u))}),B(),g(2,Fe,3,2,"ng-container",2)(3,je,7,17,"span",3)(4,Je,3,7,"button",4)(5,it,3,7,"button",4)}n&2&&(w(t.cn(t.cx("pcInputText"),t.inputStyleClass)),d("value",t.formattedValue())("ngStyle",t.inputStyle)("variant",t.$variant())("invalid",t.invalid())("pSize",t.size())("pAutoFocus",t.autofocus)("fluid",t.hasFluid),b("id",t.inputId)("aria-valuemin",t.min())("aria-valuemax",t.max())("aria-valuenow",t.value)("placeholder",t.placeholder)("aria-label",t.ariaLabel)("aria-labelledby",t.ariaLabelledBy)("aria-describedby",t.ariaDescribedBy)("title",t.title)("size",t.inputSize())("name",t.name())("autocomplete",t.autocomplete)("maxlength",t.maxlength())("minlength",t.minlength())("tabindex",t.tabindex)("aria-required",t.ariaRequired)("min",t.min())("max",t.max())("step",t.step()??1)("required",t.required()?"":void 0)("readonly",t.readonly?"":void 0)("disabled",t.$disabled()?"":void 0)("data-pc-section","input"),_(2),d("ngIf",t.buttonLayout!="vertical"&&t.showClear&&t.value),_(),d("ngIf",t.showButtons&&t.buttonLayout==="stacked"),_(),d("ngIf",t.showButtons&&t.buttonLayout!=="stacked"),_(),d("ngIf",t.showButtons&&t.buttonLayout!=="stacked"))},dependencies:[se,re,oe,ae,ue,fe,he,_e,ye,xe,K],encapsulation:2,changeDetection:0})}return i})(),Ft=(()=>{class i{static \u0275fac=function(n){return new(n||i)};static \u0275mod=te({type:i});static \u0275inj=Z({imports:[Ce,K,K]})}return i})();export{Ce as a,Ft as b};
