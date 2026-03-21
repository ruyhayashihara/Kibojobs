---
name: landing-page-creator
description: Cria landing pages otimizadas com React, Tailwind CSS, SEO e performance. Use quando usuário solicitar criar landing page, página de captura, ou página de destino.
---

# Landing Page Creator

Cria landing pages profissionais e otimizadas seguindo as melhores práticas.

## Estrutura de Landing Page

Toda landing page deve conter:

1. **SEO Header** - Meta tags, título, descrição
2. **Hero Section** - Headline, subheadline, CTA principal
3. **Benefícios/Features** - 3-6 cards com ícones
4. **Social Proof** - Depoimentos, logos de clientes, números
5. **FAQ** - Perguntas frequentes (accordion)
6. **CTA Final** - Chamada para ação com formulário
7. **Footer** - Links, redes sociais, copyright

## Stack Técnica

- **React 18** com functional components e hooks
- **Tailwind CSS** para estilização
- **lucide-react** para ícones
- **react-helmet-async** para SEO
- **react-hook-form + zod** para formulários
- **react-i18next** para internacionalização

## Estrutura de Arquivos

```
src/pages/LandingPage.jsx
src/components/landing/
  ├── LandingHero.jsx
  ├── LandingFeatures.jsx
  ├── LandingTestimonials.jsx
  ├── LandingFaq.jsx
  ├── LandingCta.jsx
  └── LandingFooter.jsx
```

## Checklist de Implementação

### SEO
- [ ] Meta title e description únicos
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Schema.org markup (Organization ou Product)
- [ ] Alt text em todas imagens
- [ ] Headings hierárquicos (h1 > h2 > h3)
- [ ] Canonical URL

### Performance
- [ ] Lazy loading de imagens
- [ ] Uso de componentes lazy para seções abaixo da dobra
- [ ] Imagens otimizadas (WebP quando possível)
- [ ] CSS crítico inline (hero section)

### Acessibilidade
- [ ] Contraste WCAG AA mínimo
- [ ] Focus states visíveis
- [ ] ARIA labels em elementos interativos
- [ ] Keyboard navigation funcional
- [ ] Skip to content link

### UX
- [ ] Mobile-first responsive
- [ ] CTAs com cores destacadas
- [ ] Microinterações em hover
- [ ] Loading states em botões
- [ ] Feedback visual de sucesso/erro

### Formulários
- [ ] Validação em tempo real
- [ ] Mensagens de erro claras
- [ ] Indicador de progresso
- [ ] Honeypot anti-spam
- [ ] Rate limiting

## Template Base

```jsx
import { Helmet } from 'react-helmet-async';

export function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Título da Landing Page | Empresa</title>
        <meta name="description" content="Descrição única da página" />
        <meta property="og:title" content="Título para redes sociais" />
        <meta property="og:description" content="Descrição para redes sociais" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://site.com/landing" />
      </Helmet>
      
      <main className="min-h-screen">
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingFaq />
        <LandingCta />
        <LandingFooter />
      </main>
    </>
  );
}
```

## Padrões de Design

### Cores
```jsx
// primary: azul/roxo para CTAs
// secondary: cinza para textos secundários
// accent: verde para sucesso, vermelho para erros
// neutral: tons de cinza para backgrounds
```

### Espaçamento
```jsx
// Seções: py-16 md:py-24 (80-96px)
// Cards: p-6 md:p-8 (24-32px)
// Gap entre elementos: gap-4 a gap-8
```

### Tipografia
```jsx
// Headlines: text-3xl md:text-4xl lg:text-5xl, font-bold
// Subheadlines: text-xl md:text-2xl, font-semibold
// Body: text-base md:text-lg
// Small: text-sm
```

## Testes

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] Lighthouse SEO > 95
- [ ] Teste em Chrome DevTools mobile
- [ ] Teste com axe DevTools
- [ ] Verificar foco com Tab
