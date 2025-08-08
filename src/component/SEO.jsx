import { Helmet } from 'react-helmet-async';
import { seoConfig } from '../config/seo.config';

const SEO = ({ 
  title, 
  description, 
  keywords = [], 
  ogImage, 
  canonicalUrl,
  structuredData = null,
  noIndex = false,
  type = 'website',
  locale = 'en_IN'
}) => {
  const pageTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
  const pageDescription = description || seoConfig.defaultDescription;
  const pageKeywords = [...seoConfig.keywords, ...keywords].join(', ');
  const imageUrl = ogImage || seoConfig.ogImage;
  const url = canonicalUrl || seoConfig.siteUrl;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={seoConfig.author} />
      <meta name="publisher" content={seoConfig.siteName} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${seoConfig.siteName}`} />
      
      {/* Verification and Social */}
      <meta name="facebook-domain-verification" content="your-verification-code" />
      <meta name="twitter:site" content={seoConfig.twitterHandle} />
      <meta name="twitter:creator" content={seoConfig.twitterHandle} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content={locale} />
      {seoConfig.facebookAppId && (
        <meta property="fb:app_id" content={seoConfig.facebookAppId} />
      )}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={pageTitle} />
      <meta name="twitter:url" content={url} />
      
      {/* Additional Twitter */}
      <meta name="twitter:label1" content="Category" />
      <meta name="twitter:data1" content="Professional Services" />
      <meta name="twitter:label2" content="Location" />
      <meta name="twitter:data2" content="India" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Indexing */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={pageTitle} />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-TileImage" content="/favicon.png" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <link rel="shortcut icon" href="/favicon.png" />
      
      {/* Language and region */}
      <html lang="en" />
      <html prefix="og: https://ogp.me/ns#" />
      
      {/* Article specific (for blog posts) */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={seoConfig.author} />
          <meta property="article:publisher" content={seoConfig.siteName} />
          <meta property="article:published_time" content={new Date().toISOString()} />
          <meta property="article:modified_time" content={new Date().toISOString()} />
          <meta property="article:section" content="Professional Services" />
          <meta property="article:tag" content={pageKeywords} />
        </>
      )}
    </Helmet>
  );
};

export default SEO;