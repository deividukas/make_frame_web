<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Sitemap - make-frame.com</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Inter, system-ui, -apple-system, sans-serif; color: #0f172a; background: #f8fafc; padding: 2rem; }
          h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem; }
          p.sub { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
          th { background: #7c3aed; color: #fff; text-align: left; padding: 0.75rem 1rem; font-size: 0.8125rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
          td { padding: 0.625rem 1rem; font-size: 0.875rem; border-top: 1px solid #e2e8f0; }
          tr:hover td { background: #f1f5f9; }
          a { color: #7c3aed; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .priority { text-align: center; }
          .freq { text-align: center; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p class="sub">
          This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)" /> URLs.
        </p>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
            <th class="freq">Change Freq</th>
            <th class="priority">Priority</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc" /></a></td>
              <td><xsl:value-of select="sitemap:lastmod" /></td>
              <td class="freq"><xsl:value-of select="sitemap:changefreq" /></td>
              <td class="priority"><xsl:value-of select="sitemap:priority" /></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
