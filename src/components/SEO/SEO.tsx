interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  structuredData?: any;
}

export function SEO({ 
  title = "SEU MARKETING | Agência Digital #1 em Resultados | Marketing que Converte",
  description = "🚀 Agência de Marketing Digital com ROI comprovado. Aumentamos suas vendas em 300%+ com Google Ads, SEO e Redes Sociais. Consultoria GRATUITA. Resultados em 30 dias!",
  keywords = "agência marketing digital recife, consultoria marketing digital pernambuco, google ads recife, seo recife, redes sociais empresas, marketing digital resultados, agência digital roi comprovado",
  canonical = "https://seumarketing.com.br/",
  structuredData
}: SEOProps) {
  
  // Website structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://seumarketing.com.br/#website",
        "url": "https://seumarketing.com.br/",
        "name": "SEU MARKETING",
        "description": "Agência de Marketing Digital",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://seumarketing.com.br/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://seumarketing.com.br/#organization",
        "name": "SEU MARKETING",
        "url": "https://seumarketing.com.br/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://seumarketing.com.br/logo-seu-marketing.png"
        },
        "sameAs": [
          "https://instagram.com/seumarketing",
          "https://facebook.com/seumarketing",
          "https://linkedin.com/company/seumarketing"
        ]
      }
    ]
  };

  const finalStructuredData = structuredData || websiteStructuredData;

  return (
    <>
      {/* Dynamic meta tags would go in document head in a real Next.js app */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(finalStructuredData) 
          }}
        />
      )}
    </>
  );
}

// Structured data for services
export const servicesStructuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "provider": {
    "@type": "Organization",
    "name": "SEU MARKETING"
  },
  "serviceType": "Marketing Digital",
  "description": "Serviços completos de marketing digital incluindo Google Ads, SEO, Redes Sociais e Consultoria",
  "offers": [
    {
      "@type": "Offer",
      "name": "Google Ads",
      "description": "Gestão profissional de campanhas Google Ads com ROI garantido"
    },
    {
      "@type": "Offer", 
      "name": "SEO",
      "description": "Otimização para motores de busca e posicionamento orgânico"
    },
    {
      "@type": "Offer",
      "name": "Social Media",
      "description": "Gestão completa de redes sociais e criação de conteúdo"
    },
    {
      "@type": "Offer",
      "name": "Consultoria Marketing",
      "description": "Consultoria estratégica personalizada para seu negócio"
    }
  ]
};

// FAQ structured data
export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quanto custa uma consultoria de marketing digital?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oferecemos consultoria gratuita inicial. Nossos planos são personalizados conforme suas necessidades e objetivos."
      }
    },
    {
      "@type": "Question", 
      "name": "Em quanto tempo vejo resultados?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Os primeiros resultados aparecem em 30 dias. Resultados significativos em 90 dias com ROI médio de 300%."
      }
    },
    {
      "@type": "Question",
      "name": "Vocês trabalham com qual tipo de empresa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Atendemos empresas de todos os portes: pequenas, médias e grandes empresas que buscam crescimento digital."
      }
    }
  ]
};