import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export function GoogleTagManager() {
  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return { gtmId: null };
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const gtmId = settings?.gtmId;
    if (!gtmId || typeof window === "undefined") return;

    if (document.getElementById("gtm-script")) return;

    const script = document.createElement("script");
    script.id = "gtm-script";
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script);

    const noscript = document.createElement("noscript");
    noscript.id = "gtm-noscript";
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);

    return () => {
      const existingScript = document.getElementById("gtm-script");
      const existingNoscript = document.getElementById("gtm-noscript");
      if (existingScript) existingScript.remove();
      if (existingNoscript) existingNoscript.remove();
    };
  }, [settings?.gtmId]);

  return null;
}
