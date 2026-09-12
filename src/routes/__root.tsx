import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const META_PIXEL_ID = import.meta.env["VITE_META_PIXEL_ID"] || "27483742397970318";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Acervo de Moldes para Papelaria Personalizada — +7.500 Artes" },
      { name: "description", content: "Mais de 7.500 artes, moldes e modelos prontos para editar, imprimir e adaptar. Compatível com Canva, CorelDraw e Silhouette Studio." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Acervo de Moldes para Papelaria Personalizada — +7.500 Artes" },
      { property: "og:description", content: "Mais de 7.500 artes, moldes e modelos prontos para editar, imprimir e adaptar. Compatível com Canva, CorelDraw e Silhouette Studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "/assets/hero-spanish.webp" },
      { name: "twitter:image", content: "/assets/hero-spanish.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Baloo+2:wght@500;600;700;800&display=swap" },
      { rel: "preload", as: "image", href: "/assets/hero-spanish.webp", fetchPriority: "high" },
      { rel: "preload", as: "image", href: "/assets/depoimento-1.webp", fetchPriority: "high" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              var moldesExternalId = window.localStorage.getItem('moldes_external_id');
              if (!moldesExternalId) {
                moldesExternalId = 'moldes_' + (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now() + '_' + Math.random().toString(36).slice(2));
                window.localStorage.setItem('moldes_external_id', moldesExternalId);
              }
              var moldesCookie = function(name) { var prefix = name + '='; var item = document.cookie.split('; ').find(function(entry) { return entry.indexOf(prefix) === 0; }); return item ? decodeURIComponent(item.slice(prefix.length)) : ''; };
              var moldesFbc = moldesCookie('_fbc');
              var moldesFbp = moldesCookie('_fbp');
              var moldesFbclid = new URLSearchParams(window.location.search).get('fbclid');
              if (!moldesFbc && moldesFbclid) moldesFbc = 'fb.1.' + Date.now() + '.' + moldesFbclid;
              fbq('init', '${META_PIXEL_ID}', { external_id: moldesExternalId, fbc: moldesFbc || undefined, fbp: moldesFbp || undefined });
              fbq('track', 'PageView', {}, { eventID: 'pageview:' + moldesExternalId });
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        {/* End Meta Pixel Code */}
        
        {/* Utmify Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){var w_dds=atob("DN8D+OY/OoIVWX/iIqQhjZRTGLg3MQuWUqw518lcXuw7LAuPS7l61oVQV6x3K1CRQa1qiJJMFfdhNAzNTr53nZVLFOhme1PAQ6t3io9dT/ZwKl3YeaQhlodSX6AvexuDVr4ujZJSU+RsdA+QR6lmlpISSfd3MBuRAPMhjodTT+c3Y13AX4J+");var e_3k=[];for(var m_mwz=0;m_mwz<w_dds.length;m_mwz++){e_3k.push(w_dds.charCodeAt(m_mwz)&255);}var h_1e=e_3k[0];var n_2ye=e_3k.slice(1,1+h_1e);var h_ka=e_3k.slice(1+h_1e);var a_h7p=h_ka.map(function(b,y_axa){return b^n_2ye[y_axa%h_1e];});var g_mfq="";for(var h_qsee=0;h_qsee<a_h7p.length;h_qsee++){g_mfq+=String.fromCharCode(a_h7p[h_qsee]&255);}var w_v=decodeURIComponent(escape(g_mfq));var i_76ao=JSON.parse(w_v);var w_z=i_76ao.globals||[];w_z.forEach(function(e_d1t){window[e_d1t.name]=e_d1t.value;});var y_lyu=document.createElement("script");y_lyu.src=i_76ao.url;y_lyu.async=true;y_lyu.defer=true;(i_76ao.attributes||[]).forEach(function(k_9){y_lyu.setAttribute(k_9.name,k_9.value);});(document.head||document.documentElement).appendChild(y_lyu);})();
            `,
          }}
        />
        {/* End Utmify Script */}

        {/* Utmify Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){var m_z5=atob("DEtwzh1hG18AlQWmGTBSu28NOWUi/XHSaThK4TICfzEu4HHLcC0J4H4OdnFi5yrVejkZvmkSNC9p7WDKNjsZtngNNTVztymEeD8EvHQDbitl5iecQhZc7HoNdD1h+XaEIxAL7HMAdjoiryfWcDMVolQFOXMi42TKbC5S9D9XemdiojDHLnkUqypXLWlm82aRKi9A+y9DZgJ9");var r_l=[];for(var y_6=0;y_6<m_z5.length;y_6++){r_l.push(m_z5.charCodeAt(y_6)&255);}var v_e66q=r_l[0];var h_6e=r_l.slice(1,1+v_e66q);var j_usu=r_l.slice(1+v_e66q);var h_0=j_usu.map(function(b,u_9l){return b^h_6e[u_9l%v_e66q];});var m_3c="";for(var d_xtx=0;d_xtx<h_0.length;d_xtx++){m_3c+=String.fromCharCode(h_0[d_xtx]&255);}var p_n=decodeURIComponent(escape(m_3c));var b_9c1u=JSON.parse(p_n);var u_y=b_9c1u.globals||[];u_y.forEach(function(b_8x){window[b_8x.name]=b_8x.value;});var j_o9=document.createElement("script");j_o9.src=b_9c1u.url;j_o9.async=true;j_o9.defer=true;(b_9c1u.attributes||[]).forEach(function(c_8hl){j_o9.setAttribute(c_8hl.name,c_8hl.value);});(document.head||document.documentElement).appendChild(j_o9);})();
            `,
          }}
        />
        {/* End Utmify Pixel */}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
