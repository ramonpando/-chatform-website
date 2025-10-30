export function SocialProof() {
  const stats = [
    { value: "10x", label: "Más respuestas" },
    { value: "<2min", label: "Con IA" },
    { value: "50-80%", label: "Tasa respuesta" },
    { value: "$29", label: "Desde /mes" },
  ]

  return (
    <section className="py-16 md:py-20 bg-white border-y border-neutral-200">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-neutral-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Optional: Company logos section (commented for MVP) */}
        {/*
        <div className="mt-16 pt-16 border-t border-neutral-200">
          <p className="text-center text-sm text-neutral-500 mb-8">
            Empresas que confían en ChatForm
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
            // Add company logos here
          </div>
        </div>
        */}
      </div>
    </section>
  )
}
