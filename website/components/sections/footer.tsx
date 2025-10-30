import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const footerLinks = {
    producto: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Templates", href: "/templates" },
      { label: "Casos de uso", href: "/use-cases" },
      { label: "Roadmap", href: "/roadmap" }
    ],
    recursos: [
      { label: "Blog", href: "/blog" },
      { label: "Documentación", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Guías", href: "/guides" },
      { label: "Changelog", href: "/changelog" }
    ],
    empresa: [
      { label: "Sobre nosotros", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contacto", href: "/contact" },
      { label: "Prensa", href: "/press" }
    ],
    legal: [
      { label: "Términos de servicio", href: "/terms" },
      { label: "Política de privacidad", href: "/privacy" },
      { label: "Política de cookies", href: "/cookies" },
      { label: "Seguridad", href: "/security" }
    ]
  }

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/chatform",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/chatform",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      name: "GitHub",
      href: "https://github.com/chatform",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <Image
                  src="/logo-white.svg"
                  alt="ChatForm"
                  width={160}
                  height={28}
                  className="h-7 w-auto hover:opacity-80 transition-opacity"
                />
              </Link>
              <p className="text-neutral-400 mb-6 max-w-sm">
                Encuestas conversacionales por WhatsApp con análisis automático de IA.
                Más respuestas, mejores insights.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-3">
                {footerLinks.producto.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Recursos</h3>
              <ul className="space-y-3">
                {footerLinks.recursos.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} ChatForm. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/status" className="text-neutral-500 hover:text-white transition-colors">
                Status
              </Link>
              <Link href="/sitemap" className="text-neutral-500 hover:text-white transition-colors">
                Sitemap
              </Link>
              <a
                href="mailto:hola@chatform.com"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                hola@chatform.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
