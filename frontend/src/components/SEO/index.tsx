import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schemaData?: object;
}

export function SEO({
  title = "Galloways Insurance Agencies & Consultancy Services | Kenya's Premier Insurance Provider",
  description = "Leading insurance agency in Kenya offering comprehensive insurance solutions - Health, Motor, Life, Property, Travel & Corporate packages. Licensed by IRA Kenya. Get instant quotes, file claims online & expert consultancy services.",
  keywords = "insurance Kenya, health insurance, motor insurance, life insurance, property insurance, travel insurance, corporate insurance, IRA licensed, insurance quotes, claims processing, consultancy services, Nairobi insurance, Kenya insurance agency",
  image = "https://galloways.co.ke/pictures/galloways-og-image.jpg",
  url = "https://galloways.co.ke",
  type = "website",
  schemaData
}: SEOProps) {
  const fullTitle = title.includes('Galloways') ? title : `${title} | Galloways Insurance Kenya`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Galloways Insurance" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional structured data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
}

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "Galloways Insurance Kenya | Health, Motor, Life & Property Insurance",
    description: "Kenya's trusted insurance agency offering Health, Motor, Life, Property, Travel & Corporate insurance. Licensed by IRA. Get instant quotes, file claims online. Expert consultancy services in Nairobi.",
    keywords: "insurance Kenya, health insurance Kenya, motor insurance Kenya, life insurance Kenya, property insurance Kenya, travel insurance Kenya, corporate insurance Kenya, IRA licensed insurance, Nairobi insurance agency, Kenya insurance quotes",
    url: "https://galloways.co.ke"
  },
  
  products: {
    title: "Insurance Products & Services Kenya | Health, Motor, Life Insurance",
    description: "Comprehensive insurance products in Kenya: Health Insurance, Motor Insurance, Life Insurance, Property Insurance, Travel Insurance, Corporate Packages. Licensed by IRA Kenya.",
    keywords: "insurance products Kenya, health insurance plans, motor insurance coverage, life insurance policies, property insurance Kenya, travel insurance Kenya, corporate insurance packages",
    url: "https://galloways.co.ke/products"
  },
  
  quotes: {
    title: "Get Insurance Quotes Online Kenya | Free Instant Insurance Quotes",
    description: "Get free instant insurance quotes online in Kenya. Compare Health, Motor, Life, Property & Travel insurance quotes. Licensed by IRA. Quick, easy & secure quote process.",
    keywords: "insurance quotes Kenya, free insurance quotes, online insurance quotes, motor insurance quotes Kenya, health insurance quotes, life insurance quotes, property insurance quotes",
    url: "https://galloways.co.ke/quotes"
  },
  
  claims: {
    title: "File Insurance Claims Online Kenya | Fast Claims Processing",
    description: "File insurance claims online in Kenya. Fast, secure claims processing for Health, Motor, Life & Property insurance. Track your claim status. Licensed by IRA Kenya.",
    keywords: "insurance claims Kenya, file insurance claim online, claims processing Kenya, motor insurance claims, health insurance claims, property insurance claims, claims status tracking",
    url: "https://galloways.co.ke/claims"
  },
  
  consultancy: {
    title: "Insurance Consultancy Services Kenya | Expert Insurance Advice",
    description: "Professional insurance consultancy services in Kenya. Expert advice on insurance planning, risk management, policy reviews. Book consultation with licensed insurance experts.",
    keywords: "insurance consultancy Kenya, insurance consultation, insurance advice Kenya, risk management consultation, insurance planning Kenya, professional insurance advisors",
    url: "https://galloways.co.ke/consultancy"
  },
  
  diaspora: {
    title: "Diaspora Insurance Services Kenya | International Insurance Solutions",
    description: "Specialized insurance services for Kenyan diaspora. International health insurance, travel insurance, property protection. Expert consultancy for overseas Kenyans.",
    keywords: "diaspora insurance Kenya, international insurance Kenya, overseas Kenyans insurance, diaspora health insurance, international travel insurance, property insurance for diaspora",
    url: "https://galloways.co.ke/diaspora"
  }
};

// Schema.org structured data templates
export const schemaTemplates = {
  insurance: (serviceName: string, description: string) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "InsuranceAgency",
      "name": "Galloways Insurance Agencies & Consultancy Services",
      "url": "https://galloways.co.ke"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "Kenya"
    }
  }),
  
  breadcrumb: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),
  
  faq: (faqs: Array<{question: string, answer: string}>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  })
};