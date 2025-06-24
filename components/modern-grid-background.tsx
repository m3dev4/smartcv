export const ModernGridBackground = () => {
    return (
      <>
        {/* Grille de base */}
        <div
          className="absolute inset-0 opacity-20 bg-background w-full left-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
  
        {/* Grille secondaire plus fine */}
        <div
          className="absolute inset-0 opacity-10 bg-background w-full left-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
  
        {/* Effets de lumière radiale */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/5 to-transparent rounded-full blur-2xl" />
  
        {/* Lignes d'accentuation */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
  
        {/* Points décoratifs */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400/50 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-white/20 rounded-full animate-pulse delay-700" />
  
        {/* Overlay subtil pour adoucir */}
        {/* <div className="absolute inset-0 bg-background pointer-events-none" /> */}
      </>
    )
  }
  