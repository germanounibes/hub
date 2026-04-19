// ============================================================
//  OS.JS — lógica do sistema
//  Você não precisa mexer aqui normalmente.
//  Toda personalização fica no apps.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  aplicarWallpaper()
  construirGrupoTabs()
  construirDock(0)
  iniciarRelogio()
  registrarAtalhos()
})

// -------------------------------------------------------
// WALLPAPER
// -------------------------------------------------------

function aplicarWallpaper() {
  if (WALLPAPER) {
    document.getElementById("wallpaper").style.backgroundImage = `url(${WALLPAPER})`
  }
}

// -------------------------------------------------------
// GRUPO TABS
// -------------------------------------------------------

let grupoAtivo = 0

function construirGrupoTabs() {
  const container = document.getElementById("grupo-tabs")
  container.innerHTML = ""

  GRUPOS.forEach((grupo, index) => {
    const tab = document.createElement("button")
    tab.className = "grupo-tab" + (index === grupoAtivo ? " ativo" : "")
    tab.innerHTML = `${grupo.icone} ${grupo.nome}`

    tab.addEventListener("click", () => {
      grupoAtivo = index
      construirGrupoTabs()
      construirDock(index)
    })

    container.appendChild(tab)
  })
}

// -------------------------------------------------------
// DOCK — com transição suave na troca de grupo
// -------------------------------------------------------

function construirDock(grupoIndex) {
  const dock = document.getElementById("dock")

  // Animação de saída
  dock.style.transition = "opacity 0.15s ease, transform 0.15s ease"
  dock.style.opacity = "0"
  dock.style.transform = "translateY(8px)"

  setTimeout(() => {
    dock.innerHTML = ""

    const grupo = GRUPOS[grupoIndex]

    // Apps do grupo selecionado
    grupo.apps.forEach(app => {
      const item = criarIconeDock(app, () => {
        abrirSite(app.url, app.name)
      })
      dock.appendChild(item)
    })

    // Separador
    const sep = document.createElement("div")
    sep.className = "dock-separador"
    dock.appendChild(sep)

    // Apps nativos (sempre aparecem)
    const nativos = [
      { icon: "🕐", name: "Relógio",     key: "",  acao: () => abrirJanela("relogio") },
      { icon: "🔢", name: "Calculadora", key: "",  acao: () => abrirJanela("calc")    },
      { icon: "📝", name: "Notas",       key: "N", acao: () => abrirJanela("notas")   },
      { icon: "⌨️", name: "Atalhos",     key: "?", acao: () => mostrarAtalhos()       },
    ]

    nativos.forEach(app => {
      const item = criarIconeDock(app, app.acao)
      item.classList.add("dock-nativo")
      dock.appendChild(item)
    })

    document.querySelector("#menubar .app-ativo").textContent = grupo.nome

    // Animação de entrada
    requestAnimationFrame(() => {
      dock.style.opacity = "1"
      dock.style.transform = "translateY(0)"
    })
  }, 150)
}

function criarIconeDock(app, onClick) {
  const item = document.createElement("div")
  item.className = "dock-app"

  // Se o app tiver logo (URL de imagem), usa ela.
  // Se não tiver, usa o emoji + cor de fundo como antes.
  const iconeHTML = app.logo
    ? `<img src="${app.logo}" alt="${app.name}" style="width:36px;height:36px;object-fit:contain;border-radius:8px;">`
    : app.icon

  const bgStyle = app.logo
    ? `background: rgba(255,255,255,0.06)`
    : `background: ${app.color || "rgba(60,60,60,0.8)"}`

  item.innerHTML = `
    <div class="dock-icone" style="${bgStyle}">
      ${iconeHTML}
      ${app.key ? `<span class="dock-atalho">${app.key}</span>` : ""}
    </div>
    <span class="dock-nome">${app.name}</span>
  `

  item.addEventListener("click", onClick)
  return item
}

// -------------------------------------------------------
// ABRIR SITE
// -------------------------------------------------------

function abrirSite(url, nome) {
  document.querySelector("#menubar .app-ativo").textContent = nome
  window.open(url, "_blank")
}

// -------------------------------------------------------
// JANELAS NATIVAS
// -------------------------------------------------------

function abrirJanela(id) {
  const existente = document.getElementById("janela-" + id)
  if (existente) {
    // Animação de saída ao fechar
    existente.style.transition = "opacity 0.1s ease, transform 0.1s ease"
    existente.style.opacity = "0"
    existente.style.transform = "scale(0.96)"
    setTimeout(() => existente.remove(), 100)
    return
  }

  let janela
  if (id === "calc")    janela = criarJanelaCalc()
  if (id === "relogio") janela = criarJanelaRelogio()
  if (id === "notas")   janela = criarJanelaNotas()

  if (janela) {
    // Começa invisível
    janela.style.opacity = "0"
    janela.style.transform = "translate(-50%, -48%) scale(0.97)"
    document.body.appendChild(janela)
    tornarArrastavel(janela)

    // Animação de entrada
    requestAnimationFrame(() => {
      janela.style.transition = "opacity 0.15s ease, transform 0.15s ease"
      janela.style.opacity = "1"
      janela.style.transform = "translate(-50%, -50%) scale(1)"
    })
  }
}

function criarJanela(id, titulo, conteudo) {
  const janela = document.createElement("div")
  janela.className = "janela"
  janela.id = "janela-" + id

  janela.innerHTML = `
    <div class="janela-titulo">
      <div class="botoes">
        <button class="btn-janela btn-fechar" onclick="fecharJanela('${id}')"></button>
      </div>
      <span class="titulo-texto">${titulo}</span>
    </div>
    <div class="janela-corpo">
      ${conteudo}
    </div>
  `

  return janela
}

function fecharJanela(id) {
  const janela = document.getElementById("janela-" + id)
  if (!janela) return
  janela.style.transition = "opacity 0.1s ease, transform 0.1s ease"
  janela.style.opacity = "0"
  janela.style.transform = "translate(-50%, -48%) scale(0.97)"
  setTimeout(() => janela.remove(), 100)
}

// --- Calculadora ---
function criarJanelaCalc() {
  const conteudo = `
    <div id="calc-visor">0</div>
    <div class="calc-grid">
      <button class="calc-btn especial" onclick="calcAcao('limpar')">AC</button>
      <button class="calc-btn especial" onclick="calcAcao('sinal')">+/-</button>
      <button class="calc-btn especial" onclick="calcAcao('porcento')">%</button>
      <button class="calc-btn operador" onclick="calcAcao('÷')">÷</button>

      <button class="calc-btn" onclick="calcDigito('7')">7</button>
      <button class="calc-btn" onclick="calcDigito('8')">8</button>
      <button class="calc-btn" onclick="calcDigito('9')">9</button>
      <button class="calc-btn operador" onclick="calcAcao('×')">×</button>

      <button class="calc-btn" onclick="calcDigito('4')">4</button>
      <button class="calc-btn" onclick="calcDigito('5')">5</button>
      <button class="calc-btn" onclick="calcDigito('6')">6</button>
      <button class="calc-btn operador" onclick="calcAcao('-')">−</button>

      <button class="calc-btn" onclick="calcDigito('1')">1</button>
      <button class="calc-btn" onclick="calcDigito('2')">2</button>
      <button class="calc-btn" onclick="calcDigito('3')">3</button>
      <button class="calc-btn operador" onclick="calcAcao('+')">+</button>

      <button class="calc-btn zero" onclick="calcDigito('0')">0</button>
      <button class="calc-btn" onclick="calcDigito('.')">.</button>
      <button class="calc-btn igual" onclick="calcAcao('=')">=</button>
    </div>
  `
  return criarJanela("calc", "Calculadora", conteudo)
}

let calcEstado = { visor: "0", acumulado: null, operacao: null, novoNumero: true }

function calcDigito(d) {
  const v = document.getElementById("calc-visor")
  if (!v) return
  if (calcEstado.novoNumero) {
    calcEstado.visor = d === "." ? "0." : d
    calcEstado.novoNumero = false
  } else {
    if (d === "." && calcEstado.visor.includes(".")) return
    calcEstado.visor = calcEstado.visor === "0" && d !== "." ? d : calcEstado.visor + d
  }
  v.textContent = calcEstado.visor
}

function calcAcao(acao) {
  const v = document.getElementById("calc-visor")
  if (!v) return
  const atual = parseFloat(calcEstado.visor)

  if (acao === "limpar") {
    calcEstado = { visor: "0", acumulado: null, operacao: null, novoNumero: true }
    v.textContent = "0"
    return
  }
  if (acao === "sinal") {
    calcEstado.visor = String(atual * -1)
    v.textContent = calcEstado.visor
    return
  }
  if (acao === "porcento") {
    calcEstado.visor = String(atual / 100)
    v.textContent = calcEstado.visor
    return
  }
  if (acao === "=") {
    if (calcEstado.acumulado !== null && calcEstado.operacao) {
      const resultado = calcular(calcEstado.acumulado, atual, calcEstado.operacao)
      calcEstado.visor = String(resultado)
      calcEstado.acumulado = null
      calcEstado.operacao = null
      calcEstado.novoNumero = true
      v.textContent = calcEstado.visor
    }
    return
  }
  if (calcEstado.acumulado !== null && !calcEstado.novoNumero) {
    const resultado = calcular(calcEstado.acumulado, atual, calcEstado.operacao)
    calcEstado.visor = String(resultado)
    v.textContent = calcEstado.visor
    calcEstado.acumulado = resultado
  } else {
    calcEstado.acumulado = atual
  }
  calcEstado.operacao = acao
  calcEstado.novoNumero = true
}

function calcular(a, b, op) {
  if (op === "+") return parseFloat((a + b).toPrecision(12))
  if (op === "-") return parseFloat((a - b).toPrecision(12))
  if (op === "×") return parseFloat((a * b).toPrecision(12))
  if (op === "÷") return b !== 0 ? parseFloat((a / b).toPrecision(12)) : "Erro"
}

// --- Relógio ---
function criarJanelaRelogio() {
  const fusoHTML = FUSOS.map(f => `
    <div class="fuso-item">
      <span class="fuso-label">${f.label}</span>
      <span class="fuso-hora" id="fuso-${f.label}">--:--</span>
    </div>
  `).join("")

  const conteudo = `
    <div id="relogio-display">
      <div id="relogio-hora">--:--:--</div>
      <div id="relogio-data">--</div>
    </div>
    <div class="fusos-lista">${fusoHTML}</div>
  `
  return criarJanela("relogio", "Relógio", conteudo)
}

function criarJanelaNotas() {
  const conteudo = `
    <textarea
      id="notas-area"
      placeholder="Escreva algo aqui... (desaparece ao fechar)"
    ></textarea>
    <div id="notas-aviso">As notas não são salvas — use para rascunhos rápidos.</div>
  `
  return criarJanela("notas", "Notas rápidas", conteudo)
}

// -------------------------------------------------------
// DRAG
// -------------------------------------------------------

function tornarArrastavel(janela) {
  const titulo = janela.querySelector(".janela-titulo")
  let arrastando = false
  let offsetX = 0
  let offsetY = 0

  titulo.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("btn-janela")) return
    arrastando = true
    const rect = janela.getBoundingClientRect()

    // Troca o transform pelo top/left absoluto pra poder arrastar
    janela.style.transition = "none"
    janela.style.transform = "none"
    janela.style.top  = rect.top  + "px"
    janela.style.left = rect.left + "px"

    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top
  })

  document.addEventListener("mousemove", (e) => {
    if (!arrastando) return
    janela.style.left = (e.clientX - offsetX) + "px"
    janela.style.top  = (e.clientY - offsetY) + "px"
  })

  document.addEventListener("mouseup", () => { arrastando = false })
}

// -------------------------------------------------------
// RELÓGIO EM TEMPO REAL
//
// Fluxo:
//   1. Ao carregar, busca a hora certa na worldtimeapi.org
//      usando o primeiro fuso definido em apps.js (ex: SP).
//      Isso garante a hora correta mesmo em PC com fuso errado.
//   2. Calcula o "offset" entre a API e o Date() local,
//      e usa esse offset pra corrigir todos os ticks seguintes.
//   3. Se a API falhar (sem internet, fora do ar), cai no
//      fallback e usa o Date() do navegador normalmente.
// -------------------------------------------------------

// Guarda quantos ms de diferença existe entre a API e o relógio local
let offsetMs = 0

async function sincronizarComAPI() {
  try {
    const fuso = FUSOS[0].timezone  // usa o primeiro fuso do apps.js como referência
    const res  = await fetch(`https://worldtimeapi.org/api/timezone/${fuso}`)
    const data = await res.json()

    // A API retorna o unix timestamp em segundos — convertemos pra ms
    const horaAPI   = data.unixtime * 1000
    const horaLocal = Date.now()

    // Diferença entre a hora real (API) e o relógio do computador
    offsetMs = horaAPI - horaLocal

    console.log(`Relógio sincronizado via API. Offset: ${offsetMs}ms`)
  } catch (e) {
    // API falhou — offset fica 0, usa o Date() local como fallback
    console.warn("worldtimeapi.org indisponível, usando relógio local como fallback.")
    offsetMs = 0
  }
}

function iniciarRelogio() {
  // Sincroniza com a API uma vez ao carregar
  sincronizarComAPI()

  function atualizar() {
    // Aplica o offset pra ter a hora correta sempre
    const agora = new Date(Date.now() + offsetMs)

    // --- Menu bar ---
    const el = document.getElementById("menubar-hora")
    if (el) {
      el.textContent = agora.toLocaleTimeString("pt-BR", {
        timeZone: FUSOS[0].timezone,
        hour:     "2-digit",
        minute:   "2-digit",
      })
    }

    // --- Janela do relógio (se estiver aberta) ---
    const elHora = document.getElementById("relogio-hora")
    if (elHora) {
      elHora.textContent = agora.toLocaleTimeString("pt-BR", {
        timeZone: FUSOS[0].timezone,
        hour:     "2-digit",
        minute:   "2-digit",
        second:   "2-digit",
      })
    }

    const elData = document.getElementById("relogio-data")
    if (elData) {
      elData.textContent = agora.toLocaleDateString("pt-BR", {
        timeZone: FUSOS[0].timezone,
        weekday:  "long",
        day:      "numeric",
        month:    "long",
      })
    }

    // --- Fusos horários configurados em apps.js ---
    FUSOS.forEach(f => {
      const elFuso = document.getElementById("fuso-" + f.label)
      if (elFuso) {
        elFuso.textContent = agora.toLocaleTimeString("pt-BR", {
          timeZone: f.timezone,
          hour:     "2-digit",
          minute:   "2-digit",
        })
      }
    })
  }

  atualizar()
  setInterval(atualizar, 1000)
}

// -------------------------------------------------------
// ATALHOS DE TECLADO
// -------------------------------------------------------

function mostrarAtalhos() {
  const overlay = document.getElementById("overlay-atalhos")
  overlay.classList.toggle("visivel")
}

function registrarAtalhos() {
  const listaEl = document.getElementById("lista-atalhos")

  const fixos = [
    { key: "N",   desc: "Abrir notas rápidas" },
    { key: "?",   desc: "Ver esta tela de atalhos" },
    { key: "Esc", desc: "Fechar esta tela" },
    { key: "1–3", desc: "Trocar de grupo" },
  ]

  const deApps = []
  GRUPOS.forEach(grupo => {
    grupo.apps.forEach(app => {
      if (app.key) deApps.push({ key: app.key, desc: `Abrir ${app.name}` })
    })
  })

  listaEl.innerHTML = [...deApps, ...fixos].map(a => `
    <div class="atalho-linha">
      <span class="atalho-desc">${a.desc}</span>
      <span class="atalho-key">${a.key}</span>
    </div>
  `).join("")

  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement.tagName
    if (tag === "TEXTAREA" || tag === "INPUT") return

    const tecla = e.key.toUpperCase()

    if (e.key === "Escape") {
      document.getElementById("overlay-atalhos").classList.remove("visivel")
      return
    }
    if (e.key === "?") { mostrarAtalhos(); return }
    if (tecla === "N") { abrirJanela("notas"); return }

    const num = parseInt(e.key)
    if (num >= 1 && num <= GRUPOS.length) {
      grupoAtivo = num - 1
      construirGrupoTabs()
      construirDock(grupoAtivo)
      return
    }

    GRUPOS.forEach(grupo => {
      grupo.apps.forEach(app => {
        if (app.key && tecla === app.key.toUpperCase()) {
          abrirSite(app.url, app.name)
        }
      })
    })
  })
}
