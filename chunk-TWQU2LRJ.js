import{g as xe}from"./chunk-HQQP4C7T.js";import{k as Ce}from"./chunk-CY4AZZNR.js";import{B as _e,Ga as O,Ka as ve,M as he,N as ye,O as j,P as C,S as Z,V as L,ca as be,fa as Te,va as Pe,xa as W}from"./chunk-R2IJ6MWT.js";import{b as ue,c as me,d as $,f as G,j as U,q as fe}from"./chunk-R73LBYZV.js";import{$a as y,$b as I,Ab as Q,Bc as ge,Db as D,Eb as F,Ec as de,Fb as R,Gb as P,Hb as A,Kc as w,Lc as X,Mb as x,Nb as c,Ob as K,Pa as r,Pb as H,Qb as m,S as k,Sb as f,T as B,Tb as _,W as te,X as N,Xb as oe,Zb as re,_b as g,aa as M,ab as z,ac as E,ba as S,bc as pe,ca as T,db as b,ec as se,fb as l,fc as le,gc as ce,hb as ie,jc as q,ka as ne,lc as J,oa as ae,pa as h,q as ee,qb as v,xb as o,yb as d,zb as u}from"./chunk-G6MH4OCE.js";var Ie=`
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
`;var Qe=["header"],Ae=["title"],Ve=["subtitle"],Be=["content"],Ne=["footer"],ze=["*",[["p-header"]],[["p-footer"]]],He=["*","p-header","p-footer"];function qe(t,i){t&1&&P(0)}function Je(t,i){if(t&1&&(d(0,"div"),H(1,1),l(2,qe,1,0,"ng-container",1),u()),t&2){let e=c();g(e.cx("header")),r(2),o("ngTemplateOutlet",e.headerTemplate||e._headerTemplate)}}function $e(t,i){if(t&1&&(F(0),I(1),R()),t&2){let e=c(2);r(),E(e.header)}}function Ge(t,i){t&1&&P(0)}function Ue(t,i){if(t&1&&(d(0,"div"),l(1,$e,2,1,"ng-container",2)(2,Ge,1,0,"ng-container",1),u()),t&2){let e=c();g(e.cx("title")),r(),o("ngIf",e.header&&!e._titleTemplate&&!e.titleTemplate),r(),o("ngTemplateOutlet",e.titleTemplate||e._titleTemplate)}}function Ze(t,i){if(t&1&&(F(0),I(1),R()),t&2){let e=c(2);r(),E(e.subheader)}}function We(t,i){t&1&&P(0)}function Ke(t,i){if(t&1&&(d(0,"div"),l(1,Ze,2,1,"ng-container",2)(2,We,1,0,"ng-container",1),u()),t&2){let e=c();g(e.cx("subtitle")),r(),o("ngIf",e.subheader&&!e._subtitleTemplate&&!e.subtitleTemplate),r(),o("ngTemplateOutlet",e.subtitleTemplate||e._subtitleTemplate)}}function Xe(t,i){t&1&&P(0)}function Ye(t,i){t&1&&P(0)}function et(t,i){if(t&1&&(d(0,"div"),H(1,2),l(2,Ye,1,0,"ng-container",1),u()),t&2){let e=c();g(e.cx("footer")),r(2),o("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}var tt=`
    ${Ie}

    .p-card {
        display: block;
    }
`,nt={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},we=(()=>{class t extends Z{name="card";theme=tt;classes=nt;static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275prov=k({token:t,factory:t.\u0275fac})}return t})();var at=(()=>{class t extends W{header;subheader;set style(e){_e(this._style(),e)||this._style.set(e)}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=ne(null);_componentStyle=N(we);getBlockableElement(){return this.el.nativeElement.children[0]}templates;ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"title":this._titleTemplate=e.template;break;case"subtitle":this._subtitleTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275cmp=y({type:t,selectors:[["p-card"]],contentQueries:function(a,n,p){if(a&1&&(m(p,he,5),m(p,ye,5),m(p,Qe,4),m(p,Ae,4),m(p,Ve,4),m(p,Be,4),m(p,Ne,4),m(p,j,4)),a&2){let s;f(s=_())&&(n.headerFacet=s.first),f(s=_())&&(n.footerFacet=s.first),f(s=_())&&(n.headerTemplate=s.first),f(s=_())&&(n.titleTemplate=s.first),f(s=_())&&(n.subtitleTemplate=s.first),f(s=_())&&(n.contentTemplate=s.first),f(s=_())&&(n.footerTemplate=s.first),f(s=_())&&(n.templates=s)}},hostVars:5,hostBindings:function(a,n){a&2&&(v("data-pc-name","card"),re(n._style()),g(n.cn(n.cx("root"),n.styleClass)))},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[q([we]),b],ngContentSelectors:He,decls:8,vars:9,consts:[[3,"class",4,"ngIf"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(a,n){a&1&&(K(ze),l(0,Je,3,3,"div",0),d(1,"div"),l(2,Ue,3,4,"div",0)(3,Ke,3,4,"div",0),d(4,"div"),H(5),l(6,Xe,1,0,"ng-container",1),u(),l(7,et,3,3,"div",0),u()),a&2&&(o("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),r(),g(n.cx("body")),r(),o("ngIf",n.header||n.titleTemplate||n._titleTemplate),r(),o("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),r(),g(n.cx("content")),r(2),o("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),r(),o("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate))},dependencies:[U,$,G,C],encapsulation:2,changeDetection:0})}return t})(),Mn=(()=>{class t{static \u0275fac=function(a){return new(a||t)};static \u0275mod=z({type:t});static \u0275inj=B({imports:[at,C,C]})}return t})();var ke=`
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
`;var it=["icon"],ot=["*"];function rt(t,i){if(t&1&&Q(0,"span",3),t&2){let e=c(2);g(e.cx("icon")),o("ngClass",e.icon)}}function pt(t,i){if(t&1&&(F(0),l(1,rt,1,3,"span",2),R()),t&2){let e=c();r(),o("ngIf",e.icon)}}function st(t,i){}function lt(t,i){t&1&&l(0,st,0,0,"ng-template")}function ct(t,i){if(t&1&&(d(0,"span"),l(1,lt,1,0,null,4),u()),t&2){let e=c();g(e.cx("icon")),r(),o("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}var gt={root:({instance:t})=>["p-tag p-component",{"p-tag-info":t.severity==="info","p-tag-success":t.severity==="success","p-tag-warn":t.severity==="warn","p-tag-danger":t.severity==="danger","p-tag-secondary":t.severity==="secondary","p-tag-contrast":t.severity==="contrast","p-tag-rounded":t.rounded}],icon:"p-tag-icon",label:"p-tag-label"},Me=(()=>{class t extends Z{name="tag";theme=ke;classes=gt;static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275prov=k({token:t,factory:t.\u0275fac})}return t})();var dt=(()=>{class t extends W{styleClass;severity;value;icon;rounded;iconTemplate;templates;_iconTemplate;_componentStyle=N(Me);ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"icon":this._iconTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275cmp=y({type:t,selectors:[["p-tag"]],contentQueries:function(a,n,p){if(a&1&&(m(p,it,4),m(p,j,4)),a&2){let s;f(s=_())&&(n.iconTemplate=s.first),f(s=_())&&(n.templates=s)}},hostVars:2,hostBindings:function(a,n){a&2&&g(n.cn(n.cx("root"),n.styleClass))},inputs:{styleClass:"styleClass",severity:"severity",value:"value",icon:"icon",rounded:[2,"rounded","rounded",w]},features:[q([Me]),b],ngContentSelectors:ot,decls:5,vars:5,consts:[[4,"ngIf"],[3,"class",4,"ngIf"],[3,"class","ngClass",4,"ngIf"],[3,"ngClass"],[4,"ngTemplateOutlet"]],template:function(a,n){a&1&&(K(),H(0),l(1,pt,2,1,"ng-container",0)(2,ct,2,3,"span",1),d(3,"span"),I(4),u()),a&2&&(r(),o("ngIf",!n.iconTemplate&&!n._iconTemplate),r(),o("ngIf",n.iconTemplate||n._iconTemplate),r(),g(n.cx("label")),r(),E(n.value))},dependencies:[U,ue,$,G,C],encapsulation:2,changeDetection:0})}return t})(),$n=(()=>{class t{static \u0275fac=function(a){return new(a||t)};static \u0275mod=z({type:t});static \u0275inj=B({imports:[dt,C,C]})}return t})();var Se=class t{constructor(i){this.http=i}createCompany(i){return this.http.post(L.getUrl("create","companies"),i)}getMyCompanies(){return this.http.get(L.getUrl("my-companies","companies")).pipe(ee(i=>i?.results??[]))}getBySlug(i){return this.http.get(L.getUrl(i,"companies"))}getAllCompanies(i){return this.http.get(L.getUrl("","companies"),{params:i}).pipe(ee(e=>e??{count:0,results:[],next:null,previous:null}))}updateCompany(i,e){return this.http.put(L.getUrl(`${i}/update`,"companies"),e)}patchCompany(i,e){return this.http.patch(L.getUrl(`${i}/update`,"companies"),e)}deleteCompany(i){return this.http.delete(L.getUrl(`${i}/delete`,"companies"))}getEmployerDashboardStats(){return this.http.get(L.getUrl("employer-dashboard-stats","companies"))}static \u0275fac=function(e){return new(e||t)(te(fe))};static \u0275prov=k({token:t,factory:t.\u0275fac,providedIn:"root"})};var ut=["data-p-icon","angle-double-left"],De=(()=>{class t extends O{static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275cmp=y({type:t,selectors:[["","data-p-icon","angle-double-left"]],features:[b],attrs:ut,decls:1,vars:0,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M5.71602 11.164C5.80782 11.2021 5.9063 11.2215 6.00569 11.221C6.20216 11.2301 6.39427 11.1612 6.54025 11.0294C6.68191 10.8875 6.76148 10.6953 6.76148 10.4948C6.76148 10.2943 6.68191 10.1021 6.54025 9.96024L3.51441 6.9344L6.54025 3.90855C6.624 3.76126 6.65587 3.59011 6.63076 3.42254C6.60564 3.25498 6.525 3.10069 6.40175 2.98442C6.2785 2.86815 6.11978 2.79662 5.95104 2.7813C5.78229 2.76598 5.61329 2.80776 5.47112 2.89994L1.97123 6.39983C1.82957 6.54167 1.75 6.73393 1.75 6.9344C1.75 7.13486 1.82957 7.32712 1.97123 7.46896L5.47112 10.9991C5.54096 11.0698 5.62422 11.1259 5.71602 11.164ZM11.0488 10.9689C11.1775 11.1156 11.3585 11.2061 11.5531 11.221C11.7477 11.2061 11.9288 11.1156 12.0574 10.9689C12.1815 10.8302 12.25 10.6506 12.25 10.4645C12.25 10.2785 12.1815 10.0989 12.0574 9.96024L9.03158 6.93439L12.0574 3.90855C12.1248 3.76739 12.1468 3.60881 12.1204 3.45463C12.0939 3.30045 12.0203 3.15826 11.9097 3.04765C11.7991 2.93703 11.6569 2.86343 11.5027 2.83698C11.3486 2.81053 11.19 2.83252 11.0488 2.89994L7.51865 6.36957C7.37699 6.51141 7.29742 6.70367 7.29742 6.90414C7.29742 7.1046 7.37699 7.29686 7.51865 7.4387L11.0488 10.9689Z","fill","currentColor"]],template:function(a,n){a&1&&(T(),D(0,"path",0))},encapsulation:2})}return t})();var mt=["data-p-icon","angle-double-right"],Fe=(()=>{class t extends O{static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275cmp=y({type:t,selectors:[["","data-p-icon","angle-double-right"]],features:[b],attrs:mt,decls:1,vars:0,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M7.68757 11.1451C7.7791 11.1831 7.8773 11.2024 7.9764 11.2019C8.07769 11.1985 8.17721 11.1745 8.26886 11.1312C8.36052 11.088 8.44238 11.0265 8.50943 10.9505L12.0294 7.49085C12.1707 7.34942 12.25 7.15771 12.25 6.95782C12.25 6.75794 12.1707 6.56622 12.0294 6.42479L8.50943 2.90479C8.37014 2.82159 8.20774 2.78551 8.04633 2.80192C7.88491 2.81833 7.73309 2.88635 7.6134 2.99588C7.4937 3.10541 7.41252 3.25061 7.38189 3.40994C7.35126 3.56927 7.37282 3.73423 7.44337 3.88033L10.4605 6.89748L7.44337 9.91463C7.30212 10.0561 7.22278 10.2478 7.22278 10.4477C7.22278 10.6475 7.30212 10.8393 7.44337 10.9807C7.51301 11.0512 7.59603 11.1071 7.68757 11.1451ZM1.94207 10.9505C2.07037 11.0968 2.25089 11.1871 2.44493 11.2019C2.63898 11.1871 2.81949 11.0968 2.94779 10.9505L6.46779 7.49085C6.60905 7.34942 6.68839 7.15771 6.68839 6.95782C6.68839 6.75793 6.60905 6.56622 6.46779 6.42479L2.94779 2.90479C2.80704 2.83757 2.6489 2.81563 2.49517 2.84201C2.34143 2.86839 2.19965 2.94178 2.08936 3.05207C1.97906 3.16237 1.90567 3.30415 1.8793 3.45788C1.85292 3.61162 1.87485 3.76975 1.94207 3.9105L4.95922 6.92765L1.94207 9.9448C1.81838 10.0831 1.75 10.2621 1.75 10.4477C1.75 10.6332 1.81838 10.8122 1.94207 10.9505Z","fill","currentColor"]],template:function(a,n){a&1&&(T(),D(0,"path",0))},encapsulation:2})}return t})();var ft=["data-p-icon","angle-left"],Re=(()=>{class t extends O{static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275cmp=y({type:t,selectors:[["","data-p-icon","angle-left"]],features:[b],attrs:ft,decls:1,vars:0,consts:[["d","M8.75 11.185C8.65146 11.1854 8.55381 11.1662 8.4628 11.1284C8.37179 11.0906 8.28924 11.0351 8.22 10.965L4.72 7.46496C4.57955 7.32433 4.50066 7.13371 4.50066 6.93496C4.50066 6.73621 4.57955 6.54558 4.72 6.40496L8.22 2.93496C8.36095 2.84357 8.52851 2.80215 8.69582 2.81733C8.86312 2.83252 9.02048 2.90344 9.14268 3.01872C9.26487 3.134 9.34483 3.28696 9.36973 3.4531C9.39463 3.61924 9.36303 3.78892 9.28 3.93496L6.28 6.93496L9.28 9.93496C9.42045 10.0756 9.49934 10.2662 9.49934 10.465C9.49934 10.6637 9.42045 10.8543 9.28 10.995C9.13526 11.1257 8.9448 11.1939 8.75 11.185Z","fill","currentColor"]],template:function(a,n){a&1&&(T(),D(0,"path",0))},encapsulation:2})}return t})();var _t=["data-p-icon","angle-right"],Ee=(()=>{class t extends O{static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275cmp=y({type:t,selectors:[["","data-p-icon","angle-right"]],features:[b],attrs:_t,decls:1,vars:0,consts:[["d","M5.25 11.1728C5.14929 11.1694 5.05033 11.1455 4.9592 11.1025C4.86806 11.0595 4.78666 10.9984 4.72 10.9228C4.57955 10.7822 4.50066 10.5916 4.50066 10.3928C4.50066 10.1941 4.57955 10.0035 4.72 9.86283L7.72 6.86283L4.72 3.86283C4.66067 3.71882 4.64765 3.55991 4.68275 3.40816C4.71785 3.25642 4.79932 3.11936 4.91585 3.01602C5.03238 2.91268 5.17819 2.84819 5.33305 2.83149C5.4879 2.81479 5.64411 2.84671 5.78 2.92283L9.28 6.42283C9.42045 6.56346 9.49934 6.75408 9.49934 6.95283C9.49934 7.15158 9.42045 7.34221 9.28 7.48283L5.78 10.9228C5.71333 10.9984 5.63193 11.0595 5.5408 11.1025C5.44966 11.1455 5.35071 11.1694 5.25 11.1728Z","fill","currentColor"]],template:function(a,n){a&1&&(T(),D(0,"path",0))},encapsulation:2})}return t})();var je=`
    .p-paginator {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        background: dt('paginator.background');
        color: dt('paginator.color');
        padding: dt('paginator.padding');
        border-radius: dt('paginator.border.radius');
        gap: dt('paginator.gap');
    }

    .p-paginator-content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: dt('paginator.gap');
    }

    .p-paginator-content-start {
        margin-inline-end: auto;
    }

    .p-paginator-content-end {
        margin-inline-start: auto;
    }

    .p-paginator-page,
    .p-paginator-next,
    .p-paginator-last,
    .p-paginator-first,
    .p-paginator-prev {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        user-select: none;
        overflow: hidden;
        position: relative;
        background: dt('paginator.nav.button.background');
        border: 0 none;
        color: dt('paginator.nav.button.color');
        min-width: dt('paginator.nav.button.width');
        height: dt('paginator.nav.button.height');
        transition:
            background dt('paginator.transition.duration'),
            color dt('paginator.transition.duration'),
            outline-color dt('paginator.transition.duration'),
            box-shadow dt('paginator.transition.duration');
        border-radius: dt('paginator.nav.button.border.radius');
        padding: 0;
        margin: 0;
    }

    .p-paginator-page:focus-visible,
    .p-paginator-next:focus-visible,
    .p-paginator-last:focus-visible,
    .p-paginator-first:focus-visible,
    .p-paginator-prev:focus-visible {
        box-shadow: dt('paginator.nav.button.focus.ring.shadow');
        outline: dt('paginator.nav.button.focus.ring.width') dt('paginator.nav.button.focus.ring.style') dt('paginator.nav.button.focus.ring.color');
        outline-offset: dt('paginator.nav.button.focus.ring.offset');
    }

    .p-paginator-page:not(.p-disabled):not(.p-paginator-page-selected):hover,
    .p-paginator-first:not(.p-disabled):hover,
    .p-paginator-prev:not(.p-disabled):hover,
    .p-paginator-next:not(.p-disabled):hover,
    .p-paginator-last:not(.p-disabled):hover {
        background: dt('paginator.nav.button.hover.background');
        color: dt('paginator.nav.button.hover.color');
    }

    .p-paginator-page.p-paginator-page-selected {
        background: dt('paginator.nav.button.selected.background');
        color: dt('paginator.nav.button.selected.color');
    }

    .p-paginator-current {
        color: dt('paginator.current.page.report.color');
    }

    .p-paginator-pages {
        display: flex;
        align-items: center;
        gap: dt('paginator.gap');
    }

    .p-paginator-jtp-input .p-inputtext {
        max-width: dt('paginator.jump.to.page.input.max.width');
    }

    .p-paginator-first:dir(rtl),
    .p-paginator-prev:dir(rtl),
    .p-paginator-next:dir(rtl),
    .p-paginator-last:dir(rtl) {
        transform: rotate(180deg);
    }
`;var ht=["dropdownicon"],yt=["firstpagelinkicon"],bt=["previouspagelinkicon"],Tt=["lastpagelinkicon"],Pt=["nextpagelinkicon"],Y=t=>({$implicit:t}),vt=t=>({pageLink:t});function Ct(t,i){t&1&&P(0)}function xt(t,i){if(t&1&&(d(0,"div"),l(1,Ct,1,0,"ng-container",9),u()),t&2){let e=c();g(e.cx("contentStart")),v("data-pc-section","start"),r(),o("ngTemplateOutlet",e.templateLeft)("ngTemplateOutletContext",J(5,Y,e.paginatorState))}}function It(t,i){if(t&1&&(d(0,"span"),I(1),u()),t&2){let e=c();g(e.cx("current")),r(),E(e.currentPageReport)}}function wt(t,i){if(t&1&&(T(),Q(0,"svg",12)),t&2){let e=c(2);g(e.cx("firstIcon"))}}function Lt(t,i){}function kt(t,i){t&1&&l(0,Lt,0,0,"ng-template")}function Mt(t,i){if(t&1&&(d(0,"span"),l(1,kt,1,0,null,13),u()),t&2){let e=c(2);g(e.cx("firstIcon")),r(),o("ngTemplateOutlet",e.firstPageLinkIconTemplate||e._firstPageLinkIconTemplate)}}function St(t,i){if(t&1){let e=A();d(0,"button",10),x("click",function(n){M(e);let p=c();return S(p.changePageToFirst(n))}),l(1,wt,1,2,"svg",11)(2,Mt,2,3,"span",0),u()}if(t&2){let e=c();g(e.cx("first")),v("aria-label",e.getAriaLabel("firstPageLabel")),r(),o("ngIf",!e.firstPageLinkIconTemplate&&!e._firstPageLinkIconTemplate),r(),o("ngIf",e.firstPageLinkIconTemplate||e._firstPageLinkIconTemplate)}}function Dt(t,i){if(t&1&&(T(),Q(0,"svg",14)),t&2){let e=c();g(e.cx("prevIcon"))}}function Ft(t,i){}function Rt(t,i){t&1&&l(0,Ft,0,0,"ng-template")}function Et(t,i){if(t&1&&(d(0,"span"),l(1,Rt,1,0,null,13),u()),t&2){let e=c();g(e.cx("prevIcon")),r(),o("ngTemplateOutlet",e.previousPageLinkIconTemplate||e._previousPageLinkIconTemplate)}}function jt(t,i){if(t&1){let e=A();d(0,"button",10),x("click",function(n){let p=M(e).$implicit,s=c(2);return S(s.onPageLinkClick(n,p-1))}),I(1),u()}if(t&2){let e=i.$implicit,a=c(2);g(a.cx("page",J(5,vt,e))),v("aria-label",a.getPageAriaLabel(e))("aria-current",e-1==a.getPage()?"page":void 0),r(),pe(" ",a.getLocalization(e)," ")}}function Ot(t,i){if(t&1&&(d(0,"span"),l(1,jt,2,7,"button",15),u()),t&2){let e=c();g(e.cx("pages")),r(),o("ngForOf",e.pageLinks)}}function Qt(t,i){if(t&1&&I(0),t&2){let e=c(2);E(e.currentPageReport)}}function At(t,i){t&1&&P(0)}function Vt(t,i){if(t&1&&l(0,At,1,0,"ng-container",9),t&2){let e=i.$implicit,a=c(3);o("ngTemplateOutlet",a.jumpToPageItemTemplate)("ngTemplateOutletContext",J(2,Y,e))}}function Bt(t,i){t&1&&(F(0),l(1,Vt,1,4,"ng-template",19),R())}function Nt(t,i){t&1&&P(0)}function zt(t,i){if(t&1&&l(0,Nt,1,0,"ng-container",13),t&2){let e=c(3);o("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Ht(t,i){t&1&&l(0,zt,1,1,"ng-template",20)}function qt(t,i){if(t&1){let e=A();d(0,"p-select",16),x("onChange",function(n){M(e);let p=c();return S(p.onPageDropdownChange(n))}),l(1,Qt,1,1,"ng-template",17)(2,Bt,2,0,"ng-container",18)(3,Ht,1,0,null,18),u()}if(t&2){let e=c();o("options",e.pageItems)("ngModel",e.getPage())("disabled",e.empty())("styleClass",e.cx("pcJumpToPageDropdown"))("appendTo",e.dropdownAppendTo||e.$appendTo())("scrollHeight",e.dropdownScrollHeight),v("aria-label",e.getAriaLabel("jumpToPageDropdownLabel")),r(2),o("ngIf",e.jumpToPageItemTemplate),r(),o("ngIf",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Jt(t,i){if(t&1&&(T(),Q(0,"svg",21)),t&2){let e=c();g(e.cx("nextIcon"))}}function $t(t,i){}function Gt(t,i){t&1&&l(0,$t,0,0,"ng-template")}function Ut(t,i){if(t&1&&(d(0,"span"),l(1,Gt,1,0,null,13),u()),t&2){let e=c();g(e.cx("nextIcon")),r(),o("ngTemplateOutlet",e.nextPageLinkIconTemplate||e._nextPageLinkIconTemplate)}}function Zt(t,i){if(t&1&&(T(),Q(0,"svg",23)),t&2){let e=c(2);g(e.cx("lastIcon"))}}function Wt(t,i){}function Kt(t,i){t&1&&l(0,Wt,0,0,"ng-template")}function Xt(t,i){if(t&1&&(d(0,"span"),l(1,Kt,1,0,null,13),u()),t&2){let e=c(2);g(e.cx("lastIcon")),r(),o("ngTemplateOutlet",e.lastPageLinkIconTemplate||e._lastPageLinkIconTemplate)}}function Yt(t,i){if(t&1){let e=A();d(0,"button",2),x("click",function(n){M(e);let p=c();return S(p.changePageToLast(n))}),l(1,Zt,1,2,"svg",22)(2,Xt,2,3,"span",0),u()}if(t&2){let e=c();g(e.cx("last")),o("disabled",e.isLastPage()||e.empty()),v("aria-label",e.getAriaLabel("lastPageLabel")),r(),o("ngIf",!e.lastPageLinkIconTemplate&&!e._lastPageLinkIconTemplate),r(),o("ngIf",e.lastPageLinkIconTemplate||e._lastPageLinkIconTemplate)}}function en(t,i){if(t&1){let e=A();d(0,"p-inputnumber",24),x("ngModelChange",function(n){M(e);let p=c();return S(p.changePage(n-1))}),u()}if(t&2){let e=c();g(e.cx("pcJumpToPageInput")),o("ngModel",e.currentPage())("disabled",e.empty())}}function tn(t,i){t&1&&P(0)}function nn(t,i){if(t&1&&l(0,tn,1,0,"ng-container",9),t&2){let e=i.$implicit,a=c(3);o("ngTemplateOutlet",a.dropdownItemTemplate)("ngTemplateOutletContext",J(2,Y,e))}}function an(t,i){t&1&&(F(0),l(1,nn,1,4,"ng-template",19),R())}function on(t,i){t&1&&P(0)}function rn(t,i){if(t&1&&l(0,on,1,0,"ng-container",13),t&2){let e=c(3);o("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function pn(t,i){t&1&&l(0,rn,1,1,"ng-template",20)}function sn(t,i){if(t&1){let e=A();d(0,"p-select",25),ce("ngModelChange",function(n){M(e);let p=c();return le(p.rows,n)||(p.rows=n),S(n)}),x("onChange",function(n){M(e);let p=c();return S(p.onRppChange(n))}),l(1,an,2,0,"ng-container",18)(2,pn,1,0,null,18),u()}if(t&2){let e=c();o("options",e.rowsPerPageItems),se("ngModel",e.rows),o("styleClass",e.cx("pcRowPerPageDropdown"))("disabled",e.empty())("appendTo",e.dropdownAppendTo||e.$appendTo())("scrollHeight",e.dropdownScrollHeight)("ariaLabel",e.getAriaLabel("rowsPerPageLabel")),r(),o("ngIf",e.dropdownItemTemplate),r(),o("ngIf",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function ln(t,i){t&1&&P(0)}function cn(t,i){if(t&1&&(d(0,"div"),l(1,ln,1,0,"ng-container",9),u()),t&2){let e=c();g(e.cx("contentEnd")),v("data-pc-section","end"),r(),o("ngTemplateOutlet",e.templateRight)("ngTemplateOutletContext",J(5,Y,e.paginatorState))}}var gn={paginator:({instance:t})=>["p-paginator p-component"],content:"p-paginator-content",contentStart:"p-paginator-content-start",contentEnd:"p-paginator-content-end",first:({instance:t})=>["p-paginator-first",{"p-disabled":t.isFirstPage()||t.empty()}],firstIcon:"p-paginator-first-icon",prev:({instance:t})=>["p-paginator-prev",{"p-disabled":t.isFirstPage()||t.empty()}],prevIcon:"p-paginator-prev-icon",next:({instance:t})=>["p-paginator-next",{"p-disabled":t.isLastPage()||t.empty()}],nextIcon:"p-paginator-next-icon",last:({instance:t})=>["p-paginator-last",{"p-disabled":t.isLastPage()||t.empty()}],lastIcon:"p-paginator-last-icon",pages:"p-paginator-pages",page:({instance:t,pageLink:i})=>["p-paginator-page",{"p-paginator-page-selected":i-1==t.getPage()}],current:"p-paginator-current",pcRowPerPageDropdown:"p-paginator-rpp-dropdown",pcJumpToPageDropdown:"p-paginator-jtp-dropdown",pcJumpToPageInput:"p-paginator-jtp-input"},Oe=(()=>{class t extends Z{name="paginator";theme=je;classes=gn;static \u0275fac=(()=>{let e;return function(n){return(e||(e=h(t)))(n||t)}})();static \u0275prov=k({token:t,factory:t.\u0275fac})}return t})();var dn=(()=>{class t extends W{pageLinkSize=5;styleClass;alwaysShow=!0;dropdownAppendTo;templateLeft;templateRight;dropdownScrollHeight="200px";currentPageReportTemplate="{currentPage} of {totalPages}";showCurrentPageReport;showFirstLastIcon=!0;totalRecords=0;rows=0;rowsPerPageOptions;showJumpToPageDropdown;showJumpToPageInput;jumpToPageItemTemplate;showPageLinks=!0;locale;dropdownItemTemplate;get first(){return this._first}set first(e){this._first=e}appendTo=de(void 0);onPageChange=new ie;dropdownIconTemplate;firstPageLinkIconTemplate;previousPageLinkIconTemplate;lastPageLinkIconTemplate;nextPageLinkIconTemplate;templates;_dropdownIconTemplate;_firstPageLinkIconTemplate;_previousPageLinkIconTemplate;_lastPageLinkIconTemplate;_nextPageLinkIconTemplate;pageLinks;pageItems;rowsPerPageItems;paginatorState;_first=0;_page=0;_componentStyle=N(Oe);$appendTo=ge(()=>this.appendTo()||this.config.overlayAppendTo());get display(){return this.alwaysShow||this.pageLinks&&this.pageLinks.length>1?null:"none"}constructor(){super()}ngOnInit(){super.ngOnInit(),this.updatePaginatorState()}ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"dropdownicon":this._dropdownIconTemplate=e.template;break;case"firstpagelinkicon":this._firstPageLinkIconTemplate=e.template;break;case"previouspagelinkicon":this._previousPageLinkIconTemplate=e.template;break;case"lastpagelinkicon":this._lastPageLinkIconTemplate=e.template;break;case"nextpagelinkicon":this._nextPageLinkIconTemplate=e.template;break}})}getAriaLabel(e){return this.config.translation.aria?this.config.translation.aria[e]:void 0}getPageAriaLabel(e){return this.config.translation.aria?this.config.translation.aria.pageLabel.replace(/{page}/g,`${e}`):void 0}getLocalization(e){let a=[...new Intl.NumberFormat(this.locale,{useGrouping:!1}).format(9876543210)].reverse(),n=new Map(a.map((p,s)=>[s,p]));return e>9?String(e).split("").map(s=>n.get(Number(s))).join(""):n.get(e)}ngOnChanges(e){super.ngOnChanges(e),e.totalRecords&&(this.updatePageLinks(),this.updatePaginatorState(),this.updateFirst(),this.updateRowsPerPageOptions()),e.first&&(this._first=e.first.currentValue,this.updatePageLinks(),this.updatePaginatorState()),e.rows&&(this.updatePageLinks(),this.updatePaginatorState()),e.rowsPerPageOptions&&this.updateRowsPerPageOptions(),e.pageLinkSize&&this.updatePageLinks()}updateRowsPerPageOptions(){if(this.rowsPerPageOptions){this.rowsPerPageItems=[];let e=null;for(let a of this.rowsPerPageOptions)typeof a=="object"&&a.showAll?e={label:a.showAll,value:this.totalRecords}:this.rowsPerPageItems.push({label:String(this.getLocalization(a)),value:a});e&&this.rowsPerPageItems.push(e)}}isFirstPage(){return this.getPage()===0}isLastPage(){return this.getPage()===this.getPageCount()-1}getPageCount(){return Math.ceil(this.totalRecords/this.rows)}calculatePageLinkBoundaries(){let e=this.getPageCount(),a=Math.min(this.pageLinkSize,e),n=Math.max(0,Math.ceil(this.getPage()-a/2)),p=Math.min(e-1,n+a-1);var s=this.pageLinkSize-(p-n+1);return n=Math.max(0,n-s),[n,p]}updatePageLinks(){this.pageLinks=[];let e=this.calculatePageLinkBoundaries(),a=e[0],n=e[1];for(let p=a;p<=n;p++)this.pageLinks.push(p+1);if(this.showJumpToPageDropdown){this.pageItems=[];for(let p=0;p<this.getPageCount();p++)this.pageItems.push({label:String(p+1),value:p})}}changePage(e){var a=this.getPageCount();if(e>=0&&e<a){this._first=this.rows*e;var n={page:e,first:this.first,rows:this.rows,pageCount:a};this.updatePageLinks(),this.onPageChange.emit(n),this.updatePaginatorState()}}updateFirst(){let e=this.getPage();e>0&&this.totalRecords&&this.first>=this.totalRecords&&Promise.resolve(null).then(()=>this.changePage(e-1))}getPage(){return Math.floor(this.first/this.rows)}changePageToFirst(e){this.isFirstPage()||this.changePage(0),e.preventDefault()}changePageToPrev(e){this.changePage(this.getPage()-1),e.preventDefault()}changePageToNext(e){this.changePage(this.getPage()+1),e.preventDefault()}changePageToLast(e){this.isLastPage()||this.changePage(this.getPageCount()-1),e.preventDefault()}onPageLinkClick(e,a){this.changePage(a),e.preventDefault()}onRppChange(e){this.changePage(this.getPage())}onPageDropdownChange(e){this.changePage(e.value)}updatePaginatorState(){this.paginatorState={page:this.getPage(),pageCount:this.getPageCount(),rows:this.rows,first:this.first,totalRecords:this.totalRecords}}empty(){return this.getPageCount()===0}currentPage(){return this.getPageCount()>0?this.getPage()+1:0}get currentPageReport(){return this.currentPageReportTemplate.replace("{currentPage}",String(this.currentPage())).replace("{totalPages}",String(this.getPageCount())).replace("{first}",String(this.totalRecords>0?this._first+1:0)).replace("{last}",String(Math.min(this._first+this.rows,this.totalRecords))).replace("{rows}",String(this.rows)).replace("{totalRecords}",String(this.totalRecords))}static \u0275fac=function(a){return new(a||t)};static \u0275cmp=y({type:t,selectors:[["p-paginator"]],contentQueries:function(a,n,p){if(a&1&&(m(p,ht,4),m(p,yt,4),m(p,bt,4),m(p,Tt,4),m(p,Pt,4),m(p,j,4)),a&2){let s;f(s=_())&&(n.dropdownIconTemplate=s.first),f(s=_())&&(n.firstPageLinkIconTemplate=s.first),f(s=_())&&(n.previousPageLinkIconTemplate=s.first),f(s=_())&&(n.lastPageLinkIconTemplate=s.first),f(s=_())&&(n.nextPageLinkIconTemplate=s.first),f(s=_())&&(n.templates=s)}},hostVars:6,hostBindings:function(a,n){a&2&&(v("data-pc-name","paginator")("data-pc-section","root"),g(n.cn(n.cx("paginator"),n.styleClass)),oe("display",n.display))},inputs:{pageLinkSize:[2,"pageLinkSize","pageLinkSize",X],styleClass:"styleClass",alwaysShow:[2,"alwaysShow","alwaysShow",w],dropdownAppendTo:"dropdownAppendTo",templateLeft:"templateLeft",templateRight:"templateRight",dropdownScrollHeight:"dropdownScrollHeight",currentPageReportTemplate:"currentPageReportTemplate",showCurrentPageReport:[2,"showCurrentPageReport","showCurrentPageReport",w],showFirstLastIcon:[2,"showFirstLastIcon","showFirstLastIcon",w],totalRecords:[2,"totalRecords","totalRecords",X],rows:[2,"rows","rows",X],rowsPerPageOptions:"rowsPerPageOptions",showJumpToPageDropdown:[2,"showJumpToPageDropdown","showJumpToPageDropdown",w],showJumpToPageInput:[2,"showJumpToPageInput","showJumpToPageInput",w],jumpToPageItemTemplate:"jumpToPageItemTemplate",showPageLinks:[2,"showPageLinks","showPageLinks",w],locale:"locale",dropdownItemTemplate:"dropdownItemTemplate",first:"first",appendTo:[1,"appendTo"]},outputs:{onPageChange:"onPageChange"},features:[q([Oe]),b,ae],decls:15,vars:21,consts:[[3,"class",4,"ngIf"],["type","button","pRipple","",3,"class","click",4,"ngIf"],["type","button","pRipple","",3,"click","disabled"],["data-p-icon","angle-left",3,"class",4,"ngIf"],[3,"options","ngModel","disabled","styleClass","appendTo","scrollHeight","onChange",4,"ngIf"],["data-p-icon","angle-right",3,"class",4,"ngIf"],["type","button","pRipple","",3,"disabled","class","click",4,"ngIf"],[3,"ngModel","class","disabled","ngModelChange",4,"ngIf"],[3,"options","ngModel","styleClass","disabled","appendTo","scrollHeight","ariaLabel","ngModelChange","onChange",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["type","button","pRipple","",3,"click"],["data-p-icon","angle-double-left",3,"class",4,"ngIf"],["data-p-icon","angle-double-left"],[4,"ngTemplateOutlet"],["data-p-icon","angle-left"],["type","button","pRipple","",3,"class","click",4,"ngFor","ngForOf"],[3,"onChange","options","ngModel","disabled","styleClass","appendTo","scrollHeight"],["pTemplate","selectedItem"],[4,"ngIf"],["pTemplate","item"],["pTemplate","dropdownicon"],["data-p-icon","angle-right"],["data-p-icon","angle-double-right",3,"class",4,"ngIf"],["data-p-icon","angle-double-right"],[3,"ngModelChange","ngModel","disabled"],[3,"ngModelChange","onChange","options","ngModel","styleClass","disabled","appendTo","scrollHeight","ariaLabel"]],template:function(a,n){a&1&&(l(0,xt,2,7,"div",0)(1,It,2,3,"span",0)(2,St,3,5,"button",1),d(3,"button",2),x("click",function(s){return n.changePageToPrev(s)}),l(4,Dt,1,2,"svg",3)(5,Et,2,3,"span",0),u(),l(6,Ot,2,3,"span",0)(7,qt,4,9,"p-select",4),d(8,"button",2),x("click",function(s){return n.changePageToNext(s)}),l(9,Jt,1,2,"svg",5)(10,Ut,2,3,"span",0),u(),l(11,Yt,3,6,"button",6)(12,en,1,4,"p-inputnumber",7)(13,sn,3,9,"p-select",8)(14,cn,2,7,"div",0)),a&2&&(o("ngIf",n.templateLeft),r(),o("ngIf",n.showCurrentPageReport),r(),o("ngIf",n.showFirstLastIcon),r(),g(n.cx("prev")),o("disabled",n.isFirstPage()||n.empty()),v("aria-label",n.getAriaLabel("prevPageLabel")),r(),o("ngIf",!n.previousPageLinkIconTemplate&&!n._previousPageLinkIconTemplate),r(),o("ngIf",n.previousPageLinkIconTemplate||n._previousPageLinkIconTemplate),r(),o("ngIf",n.showPageLinks),r(),o("ngIf",n.showJumpToPageDropdown),r(),g(n.cx("next")),o("disabled",n.isLastPage()||n.empty()),v("aria-label",n.getAriaLabel("nextPageLabel")),r(),o("ngIf",!n.nextPageLinkIconTemplate&&!n._nextPageLinkIconTemplate),r(),o("ngIf",n.nextPageLinkIconTemplate||n._nextPageLinkIconTemplate),r(),o("ngIf",n.showFirstLastIcon),r(),o("ngIf",n.showJumpToPageInput),r(),o("ngIf",n.rowsPerPageOptions),r(),o("ngIf",n.templateRight))},dependencies:[U,me,$,G,Ce,xe,Pe,be,Te,ve,De,Fe,Re,Ee,C,j],encapsulation:2,changeDetection:0})}return t})(),Sa=(()=>{class t{static \u0275fac=function(a){return new(a||t)};static \u0275mod=z({type:t});static \u0275inj=B({imports:[dn,C,C]})}return t})();export{at as a,Mn as b,dt as c,$n as d,Se as e,dn as f,Sa as g};
