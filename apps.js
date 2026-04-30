// ============================================================
//  APPS.JS — edite este arquivo para personalizar seu portal
// ============================================================
//
//  Cada app tem:
//    name  → nome que aparece embaixo do ícone
//    url   → endereço do site que vai abrir
//    logo  → URL da imagem/logo (PNG, SVG, etc)
//    key   → tecla de atalho (opcional, deixe "" pra não ter)
//
//  Dica: clique direito na logo de um site > "Copiar endereço
//  da imagem" e cole no campo logo.
//
//  Se não quiser usar logo, você ainda pode usar emoji + cor:
//    icon: "🎨", color: "#7d2ae8"
//  (os dois sistemas funcionam ao mesmo tempo)
//
// ============================================================

const GRUPOS = [
  {
    // 1º grupo — login e comunicação
    // Proton primeiro porque é a primeira coisa que você abre
    nome: "Início",
    icone: "🔑",
    apps: [
      { name: "Proton", url: "https://mail.proton.me", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Proton_AG_Logo_01.svg/960px-Proton_AG_Logo_01.svg.png", key: "P" },
      { name: "YouTube", url: "https://youtube.com", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png", key: "Y" },
      { name: "Spotify", url: "https://open.spotify.com", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/3840px-Spotify_logo_without_text.svg.png", key: "S" },
    ]
  },
  {
    // 2º grupo — trabalho criativo
    nome: "Criativo",
    icone: "🎨",
    apps: [
      { name: "Canva", url: "https://canva.com", logo: "https://markzware.com/wp-content/uploads/2024/11/Canva_logo_C_blue_purple_WikiMedia_Commons_transparent_780x780.png", key: "C" },
      { name: "Miro", url: "https://miro.com", logo: "https://static.wikia.nocookie.net/logopedia/images/a/aa/Miro_2019_I.svg/revision/latest?cb=20230907183508", key: "M" },
      { name: "CapCut", url: "https://capcut.com", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Capcut-icon.png", key: "" },
       { name: "Bandlab", url: "https://Bandlab.com", logo: "https://img.icons8.com/color/512/bandlab.png", key: "" },
      { name: "Pinterest", url: "https://pinterest.com", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png", key: "" },
    ]
  },
  {
    // 3º grupo — dev e IA
    nome: "Dev",
    icone: "💻",
    apps: [
      { name: "GitHub", url: "https://github.com", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg", key: "G" },
      { name: "Claude", url: "https://claude.ai", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Claude-ai-icon.svg/3840px-Claude-ai-icon.svg.png", key: "A" },
      { name: "G.Drive", url: "https://drive.google.com", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/3840px-Google_Drive_icon_%282020%29.svg.png", key: "" },
      { name: "code", url: "https://code.org", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Code.org_logo.svg/1280px-Code.org_logo.svg.png", key: "" },
      { name: "mobbin", url: "https://mobbin.com", logo: "https://cdn.prod.website-files.com/641dbcef477f73480e723aa5/68a99e34cdfcfa959589dc89_Logo_Mobbin.png", key: "" },
      { name: "stitch", url: "https://stitch.withgoogle.com/", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", key: "" },
     
    ]
  },
]

// ============================================================
//  WALLPAPER — URL de imagem ou deixe "" pro fundo escuro padrão
// ============================================================

const WALLPAPER = "https://images7.alphacoders.com/135/thumb-1920-1354305.jpeg"

// ============================================================
//  FUSOS HORÁRIOS — aparece na menu bar e na janela do relógio
// ============================================================

const FUSOS = [
  { label: "SP", timezone: "America/Sao_Paulo" },
  { label: "NY", timezone: "America/New_York" },
  { label: "LDN", timezone: "Europe/London" },
]
