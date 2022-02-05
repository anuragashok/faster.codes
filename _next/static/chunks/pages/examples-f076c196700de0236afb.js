(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[560],{4668:function(e,n,t){"use strict";t(7294);var r=t(1664),l=t(5893);n.Z=function(){return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)("footer",{className:"p-10 footer bg-neutral text-neutral-content footer-center mt-4",children:[(0,l.jsxs)("div",{className:"grid grid-flow-col gap-4",children:[(0,l.jsx)("a",{className:"",children:"Examples: "}),(0,l.jsx)(r.default,{href:"/?runId=31nq",children:(0,l.jsx)("a",{className:"link",children:"for-loop vs streams"})}),(0,l.jsx)(r.default,{href:"/?runId=31nr",children:(0,l.jsx)("a",{className:"link",children:"parallel vs serial streams"})})]}),(0,l.jsx)("div",{className:"grid grid-flow-col gap-4 grid-1",children:(0,l.jsx)("div",{children:(0,l.jsxs)("p",{className:"text-lg mb-4",children:["This app was created as an entry to the"," ",(0,l.jsx)("a",{className:"link",href:"https://blog.cloudflare.com/developer-summer-challenge/",children:"Cloudflare Developer Summer Challenge."})]})})})]})})}},5774:function(e,n,t){"use strict";var r=t(5893);n.Z=function(){return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)("div",{className:"navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box",children:(0,r.jsxs)("div",{className:"container mx-auto h-full",children:[(0,r.jsxs)("div",{className:"px-2 mx-2 navbar-start",children:[(0,r.jsx)("svg",{className:"fill-current inline-block",viewBox:"0 0 24 24",height:"48",width:"48",xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",clipRule:"evenodd",children:(0,r.jsx)("path",{d:"M16 10.174v-2.174h3v2.174c.689.163 1.335.436 1.92.799l.816-.973 1.532 1.286-.83.989c.974 1.137 1.562 2.613 1.562 4.225 0 3.587-2.913 6.5-6.5 6.5s-6.5-2.913-6.5-6.5c0-3.071 2.135-5.648 5-6.326zm7-9.174v7h-2v-2h-19v15h8.289c.472.754 1.059 1.429 1.736 2h-12.025v-22h23zm-5.5 11c2.484 0 4.5 2.016 4.5 4.5s-2.016 4.5-4.5 4.5-4.5-2.016-4.5-4.5 2.016-4.5 4.5-4.5zm2.368 1.49l-2.076 1.562c-.503-.103-1.045.051-1.413.461-.548.615-.496 1.558.119 2.107.614.55 1.558.497 2.107-.117.367-.412.459-.967.3-1.456l1.303-2.255-.34-.302z"})}),(0,r.jsx)("span",{className:"ml-6 align-middle inline-block text-2xl font-bold",children:"{\xa0faster.codes\xa0}"})]}),(0,r.jsx)("div",{className:"hidden px-2 mx-2 navbar-center lg:flex",children:(0,r.jsx)("h2",{className:" text-3xl  text-center"})}),(0,r.jsx)("div",{className:"navbar-end",children:(0,r.jsx)("div",{className:"text-right items-stretch",children:(0,r.jsxs)("a",{className:"btn btn-ghost btn-sm rounded-btn",href:"https://github.com/anuragashok/faster.codes",target:"_blank",rel:"noreferrer",children:[(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"inline-block w-5 mr-2 stroke-current",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"})}),"Github"]})})})]})})})}},2167:function(e,n,t){"use strict";var r=t(3038);n.default=void 0;var l,a=(l=t(7294))&&l.__esModule?l:{default:l},s=t(1063),o=t(4651),c=t(7426);var i={};function u(e,n,t,r){if(e&&s.isLocalURL(n)){e.prefetch(n,t,r).catch((function(e){0}));var l=r&&"undefined"!==typeof r.locale?r.locale:e&&e.locale;i[n+"%"+t+(l?"%"+l:"")]=!0}}var d=function(e){var n,t=!1!==e.prefetch,l=o.useRouter(),d=a.default.useMemo((function(){var n=s.resolveHref(l,e.href,!0),t=r(n,2),a=t[0],o=t[1];return{href:a,as:e.as?s.resolveHref(l,e.as):o||a}}),[l,e.href,e.as]),f=d.href,h=d.as,m=e.children,v=e.replace,p=e.shallow,x=e.scroll,g=e.locale;"string"===typeof m&&(m=a.default.createElement("a",null,m));var j=(n=a.default.Children.only(m))&&"object"===typeof n&&n.ref,b=c.useIntersection({rootMargin:"200px"}),N=r(b,2),w=N[0],k=N[1],y=a.default.useCallback((function(e){w(e),j&&("function"===typeof j?j(e):"object"===typeof j&&(j.current=e))}),[j,w]);a.default.useEffect((function(){var e=k&&t&&s.isLocalURL(f),n="undefined"!==typeof g?g:l&&l.locale,r=i[f+"%"+h+(n?"%"+n:"")];e&&!r&&u(l,f,h,{locale:n})}),[h,f,k,g,t,l]);var _={ref:y,onClick:function(e){n.props&&"function"===typeof n.props.onClick&&n.props.onClick(e),e.defaultPrevented||function(e,n,t,r,l,a,o,c){("A"!==e.currentTarget.nodeName||!function(e){var n=e.currentTarget.target;return n&&"_self"!==n||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)&&s.isLocalURL(t))&&(e.preventDefault(),null==o&&r.indexOf("#")>=0&&(o=!1),n[l?"replace":"push"](t,r,{shallow:a,locale:c,scroll:o}))}(e,l,f,h,v,p,x,g)},onMouseEnter:function(e){s.isLocalURL(f)&&(n.props&&"function"===typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),u(l,f,h,{priority:!0}))}};if(e.passHref||"a"===n.type&&!("href"in n.props)){var E="undefined"!==typeof g?g:l&&l.locale,L=l&&l.isLocaleDomain&&s.getDomainLocale(h,E,l&&l.locales,l&&l.domainLocales);_.href=L||s.addBasePath(s.addLocale(h,E,l&&l.defaultLocale))}return a.default.cloneElement(n,_)};n.default=d},7426:function(e,n,t){"use strict";var r=t(3038);Object.defineProperty(n,"__esModule",{value:!0}),n.useIntersection=function(e){var n=e.rootMargin,t=e.disabled||!s,c=l.useRef(),i=l.useState(!1),u=r(i,2),d=u[0],f=u[1],h=l.useCallback((function(e){c.current&&(c.current(),c.current=void 0),t||d||e&&e.tagName&&(c.current=function(e,n,t){var r=function(e){var n=e.rootMargin||"",t=o.get(n);if(t)return t;var r=new Map,l=new IntersectionObserver((function(e){e.forEach((function(e){var n=r.get(e.target),t=e.isIntersecting||e.intersectionRatio>0;n&&t&&n(t)}))}),e);return o.set(n,t={id:n,observer:l,elements:r}),t}(t),l=r.id,a=r.observer,s=r.elements;return s.set(e,n),a.observe(e),function(){s.delete(e),a.unobserve(e),0===s.size&&(a.disconnect(),o.delete(l))}}(e,(function(e){return e&&f(e)}),{rootMargin:n}))}),[t,n,d]);return l.useEffect((function(){if(!s&&!d){var e=a.requestIdleCallback((function(){return f(!0)}));return function(){return a.cancelIdleCallback(e)}}}),[d]),[h,d]};var l=t(7294),a=t(3447),s="undefined"!==typeof IntersectionObserver;var o=new Map},1489:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return u}});var r=t(9008),l=t(5774),a=t(4668),s=t(5893),o=function(e){var n=e.title,t=e.children;return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.default,{children:(0,s.jsxs)("title",{children:[n," | { faster.codes }"]})}),(0,s.jsx)(l.Z,{}),(0,s.jsxs)("div",{className:"container mx-auto h-full p-2",children:[(0,s.jsx)("h1",{className:"text-primary text-3xl",children:n}),t]}),(0,s.jsx)(a.Z,{})]})},c=t(1664),i=JSON.parse('[{"title":"Java : for loop vs streams","link":"/?runId=31nq"},{"title":"Java : serial streams vs parallel streams","link":"/?runId=31nr"},{"title":"Java vs Golang: factorial","link":"/?runId=31oo"}]'),u=function(){return(0,s.jsxs)(o,{title:"Examples",children:[(0,s.jsx)("div",{className:"text-lg font-medium underline mt-2",children:"Below are some examples to try out the faster.codes platform"}),(0,s.jsx)("ul",{className:"menu mt-2 px-3 border bg-base-100 menu-horizontal",children:i.map((function(e){return(0,s.jsx)("li",{className:"bordered mt-2 mb-2",children:(0,s.jsx)(c.default,{href:e.link,children:(0,s.jsx)("a",{className:"text-lg font-medium",children:e.title})})},e.title)}))})]})}},3374:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/examples",function(){return t(1489)}])},9008:function(e,n,t){e.exports=t(639)},1664:function(e,n,t){e.exports=t(2167)}},function(e){e.O(0,[774,888,179],(function(){return n=3374,e(e.s=n);var n}));var n=e.O();_N_E=n}]);