import{B as G,M as J,N as K,O as N,P as _,S as O,xa as R}from"./chunk-WV7HDYMM.js";import{b as $,d as E,f as B,j as q}from"./chunk-TEBZMD4A.js";import{Bb as b,Cb as C,Db as h,Jc as H,Kb as f,Lb as w,Ma as i,Mb as v,Nb as p,P as k,Pb as s,Q as I,Qb as m,U as F,Wb as A,Xb as d,Ya as Q,Yb as x,Za as D,Zb as M,ab as S,cb as l,gc as j,ha as z,ma as T,nb as P,ub as r,vb as g,wb as y,xb as V}from"./chunk-MZZQOAKI.js";var L=`
    .p-card {
        background: dt('card.background');
        color: dt('card.color');
        box-shadow: dt('card.shadow');
        border-radius: dt('card.border.radius');
        display: flex;
        flex-direction: column;
    }

    .p-card-caption {
        display: flex;
        flex-direction: column;
        gap: dt('card.caption.gap');
    }

    .p-card-body {
        padding: dt('card.body.padding');
        display: flex;
        flex-direction: column;
        gap: dt('card.body.gap');
    }

    .p-card-title {
        font-size: dt('card.title.font.size');
        font-weight: dt('card.title.font.weight');
    }

    .p-card-subtitle {
        color: dt('card.subtitle.color');
    }
`;var ee=["header"],te=["title"],ne=["subtitle"],ae=["content"],ie=["footer"],oe=["*",[["p-header"]],[["p-footer"]]],re=["*","p-header","p-footer"];function ce(e,c){e&1&&h(0)}function le(e,c){if(e&1&&(g(0,"div"),v(1,1),l(2,ce,1,0,"ng-container",1),y()),e&2){let t=f();d(t.cx("header")),i(2),r("ngTemplateOutlet",t.headerTemplate||t._headerTemplate)}}function de(e,c){if(e&1&&(b(0),x(1),C()),e&2){let t=f(2);i(),M(t.header)}}function pe(e,c){e&1&&h(0)}function se(e,c){if(e&1&&(g(0,"div"),l(1,de,2,1,"ng-container",2)(2,pe,1,0,"ng-container",1),y()),e&2){let t=f();d(t.cx("title")),i(),r("ngIf",t.header&&!t._titleTemplate&&!t.titleTemplate),i(),r("ngTemplateOutlet",t.titleTemplate||t._titleTemplate)}}function me(e,c){if(e&1&&(b(0),x(1),C()),e&2){let t=f(2);i(),M(t.subheader)}}function ue(e,c){e&1&&h(0)}function fe(e,c){if(e&1&&(g(0,"div"),l(1,me,2,1,"ng-container",2)(2,ue,1,0,"ng-container",1),y()),e&2){let t=f();d(t.cx("subtitle")),i(),r("ngIf",t.subheader&&!t._subtitleTemplate&&!t.subtitleTemplate),i(),r("ngTemplateOutlet",t.subtitleTemplate||t._subtitleTemplate)}}function ge(e,c){e&1&&h(0)}function ye(e,c){e&1&&h(0)}function _e(e,c){if(e&1&&(g(0,"div"),v(1,2),l(2,ye,1,0,"ng-container",1),y()),e&2){let t=f();d(t.cx("footer")),i(2),r("ngTemplateOutlet",t.footerTemplate||t._footerTemplate)}}var Te=`
    ${L}

    .p-card {
        display: block;
    }
`,he={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},U=(()=>{class e extends O{name="card";theme=Te;classes=he;static \u0275fac=(()=>{let t;return function(n){return(t||(t=T(e)))(n||e)}})();static \u0275prov=k({token:e,factory:e.\u0275fac})}return e})();var ve=(()=>{class e extends R{header;subheader;set style(t){G(this._style(),t)||this._style.set(t)}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=z(null);_componentStyle=F(U);getBlockableElement(){return this.el.nativeElement.children[0]}templates;ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"header":this._headerTemplate=t.template;break;case"title":this._titleTemplate=t.template;break;case"subtitle":this._subtitleTemplate=t.template;break;case"content":this._contentTemplate=t.template;break;case"footer":this._footerTemplate=t.template;break;default:this._contentTemplate=t.template;break}})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=T(e)))(n||e)}})();static \u0275cmp=Q({type:e,selectors:[["p-card"]],contentQueries:function(a,n,u){if(a&1&&(p(u,J,5),p(u,K,5),p(u,ee,4),p(u,te,4),p(u,ne,4),p(u,ae,4),p(u,ie,4),p(u,N,4)),a&2){let o;s(o=m())&&(n.headerFacet=o.first),s(o=m())&&(n.footerFacet=o.first),s(o=m())&&(n.headerTemplate=o.first),s(o=m())&&(n.titleTemplate=o.first),s(o=m())&&(n.subtitleTemplate=o.first),s(o=m())&&(n.contentTemplate=o.first),s(o=m())&&(n.footerTemplate=o.first),s(o=m())&&(n.templates=o)}},hostVars:5,hostBindings:function(a,n){a&2&&(P("data-pc-name","card"),A(n._style()),d(n.cn(n.cx("root"),n.styleClass)))},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[j([U]),S],ngContentSelectors:re,decls:8,vars:9,consts:[[3,"class",4,"ngIf"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(a,n){a&1&&(w(oe),l(0,le,3,3,"div",0),g(1,"div"),l(2,se,3,4,"div",0)(3,fe,3,4,"div",0),g(4,"div"),v(5),l(6,ge,1,0,"ng-container",1),y(),l(7,_e,3,3,"div",0),y()),a&2&&(r("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),i(),d(n.cx("body")),i(),r("ngIf",n.header||n.titleTemplate||n._titleTemplate),i(),r("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),i(),d(n.cx("content")),i(2),r("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),i(),r("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate))},dependencies:[q,E,B,_],encapsulation:2,changeDetection:0})}return e})(),Je=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=D({type:e});static \u0275inj=I({imports:[ve,_,_]})}return e})();var W=`
    .p-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: dt('tag.primary.background');
        color: dt('tag.primary.color');
        font-size: dt('tag.font.size');
        font-weight: dt('tag.font.weight');
        padding: dt('tag.padding');
        border-radius: dt('tag.border.radius');
        gap: dt('tag.gap');
    }

    .p-tag-icon {
        font-size: dt('tag.icon.size');
        width: dt('tag.icon.size');
        height: dt('tag.icon.size');
    }

    .p-tag-rounded {
        border-radius: dt('tag.rounded.border.radius');
    }

    .p-tag-success {
        background: dt('tag.success.background');
        color: dt('tag.success.color');
    }

    .p-tag-info {
        background: dt('tag.info.background');
        color: dt('tag.info.color');
    }

    .p-tag-warn {
        background: dt('tag.warn.background');
        color: dt('tag.warn.color');
    }

    .p-tag-danger {
        background: dt('tag.danger.background');
        color: dt('tag.danger.color');
    }

    .p-tag-secondary {
        background: dt('tag.secondary.background');
        color: dt('tag.secondary.color');
    }

    .p-tag-contrast {
        background: dt('tag.contrast.background');
        color: dt('tag.contrast.color');
    }
`;var be=["icon"],Ce=["*"];function xe(e,c){if(e&1&&V(0,"span",3),e&2){let t=f(2);d(t.cx("icon")),r("ngClass",t.icon)}}function Me(e,c){if(e&1&&(b(0),l(1,xe,1,3,"span",2),C()),e&2){let t=f();i(),r("ngIf",t.icon)}}function ke(e,c){}function Ie(e,c){e&1&&l(0,ke,0,0,"ng-template")}function Fe(e,c){if(e&1&&(g(0,"span"),l(1,Ie,1,0,null,4),y()),e&2){let t=f();d(t.cx("icon")),i(),r("ngTemplateOutlet",t.iconTemplate||t._iconTemplate)}}var Qe={root:({instance:e})=>["p-tag p-component",{"p-tag-info":e.severity==="info","p-tag-success":e.severity==="success","p-tag-warn":e.severity==="warn","p-tag-danger":e.severity==="danger","p-tag-secondary":e.severity==="secondary","p-tag-contrast":e.severity==="contrast","p-tag-rounded":e.rounded}],icon:"p-tag-icon",label:"p-tag-label"},X=(()=>{class e extends O{name="tag";theme=W;classes=Qe;static \u0275fac=(()=>{let t;return function(n){return(t||(t=T(e)))(n||e)}})();static \u0275prov=k({token:e,factory:e.\u0275fac})}return e})();var De=(()=>{class e extends R{styleClass;severity;value;icon;rounded;iconTemplate;templates;_iconTemplate;_componentStyle=F(X);ngAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"icon":this._iconTemplate=t.template;break}})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=T(e)))(n||e)}})();static \u0275cmp=Q({type:e,selectors:[["p-tag"]],contentQueries:function(a,n,u){if(a&1&&(p(u,be,4),p(u,N,4)),a&2){let o;s(o=m())&&(n.iconTemplate=o.first),s(o=m())&&(n.templates=o)}},hostVars:2,hostBindings:function(a,n){a&2&&d(n.cn(n.cx("root"),n.styleClass))},inputs:{styleClass:"styleClass",severity:"severity",value:"value",icon:"icon",rounded:[2,"rounded","rounded",H]},features:[j([X]),S],ngContentSelectors:Ce,decls:5,vars:5,consts:[[4,"ngIf"],[3,"class",4,"ngIf"],[3,"class","ngClass",4,"ngIf"],[3,"ngClass"],[4,"ngTemplateOutlet"]],template:function(a,n){a&1&&(w(),v(0),l(1,Me,2,1,"ng-container",0)(2,Fe,2,3,"span",1),g(3,"span"),x(4),y()),a&2&&(i(),r("ngIf",!n.iconTemplate&&!n._iconTemplate),i(),r("ngIf",n.iconTemplate||n._iconTemplate),i(),d(n.cx("label")),i(),M(n.value))},dependencies:[q,$,E,B,_],encapsulation:2,changeDetection:0})}return e})(),dt=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=D({type:e});static \u0275inj=I({imports:[De,_,_]})}return e})();export{ve as a,Je as b,De as c,dt as d};
