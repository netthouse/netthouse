export default function HomePageRU() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
           <a href="/" className="flex items-center">
            <img src="/netthouse-horizontal-color.svg" alt="Netthouse" className="h-8 w-auto" />
          </a>
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#how" className="text-slate-600 hover:text-slate-900">РљР°Рє СЂР°Р±РѕС‚Р°РµС‚</a>
            <a href="#features" className="text-slate-600 hover:text-slate-900">Р’РѕР·РјРѕР¶РЅРѕСЃС‚Рё</a>
            <a href="#use-cases" className="text-slate-600 hover:text-slate-900">РџСЂРёРјРµРЅРµРЅРёРµ</a>
            <a href="/docs" className="text-slate-600 hover:text-slate-900">Р”РѕРєСѓРјРµРЅС‚Р°С†РёСЏ</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900">РўР°СЂРёС„С‹</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 text-xs">
              <a href="/" className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200">EN</a>
              <a href="/ru" className="px-2 py-1 bg-slate-900 text-white rounded">RU</a>
            </div>
            <a
              href="https://app.netthouse.com"
              className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800"
            >
              Р’РѕР№С‚Рё
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Р Р°Р±РѕС‚Р°РµС‚ РЅР° netthouse.com
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            РџР»Р°С‚С‘Р¶РЅР°СЏ РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР°
            <br />
            <span className="text-slate-400">РґР»СЏ AI-Р°РіРµРЅС‚РѕРІ</span>
          </h1>
          <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Р”РІРѕР№РЅР°СЏ Р·Р°РїРёСЃСЊ, HTTP-native РїР»Р°С‚РµР¶Рё (x402) Рё Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРёР№ РєР»РёСЂРёРЅРі. Р’Р°С€Рё Р°РіРµРЅС‚С‹ РїР»Р°С‚СЏС‚, РїРѕР»СѓС‡Р°СЋС‚ Рё СЃРІРѕРґСЏС‚ РѕСЃС‚Р°С‚РєРё вЂ” РІС‹ РЅРµ РїРµСЂРµРІРѕРґРёС‚Рµ РЅРё С†РµРЅС‚Р°.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <a
              href="https://app.netthouse.com"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 shadow-sm"
            >
              РћС‚РєСЂС‹С‚СЊ РґР°С€Р±РѕСЂРґ в†’
            </a>
            <a
              href="/docs"
              className="px-6 py-3 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
            >
              Р§РёС‚Р°С‚СЊ РґРѕРєСѓРјРµРЅС‚Р°С†РёСЋ
            </a>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-slate-200 py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">РљР°Рє СЌС‚Рѕ СЂР°Р±РѕС‚Р°РµС‚</h2>
            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
              Р§РµС‚С‹СЂРµ С€Р°РіР° РѕС‚ СЂРµРіРёСЃС‚СЂР°С†РёРё РґРѕ РїСЂРѕРІРµРґС‘РЅРЅС‹С… РїР»Р°С‚РµР¶РµР№. Р‘РµР· SDK, Р±РµР· РёРЅС‚РµРіСЂР°С†РёР№ вЂ” С‚РѕР»СЊРєРѕ HTTP.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Step num="1" title="РЎРѕР·РґР°Р№С‚Рµ РѕСЂРіР°РЅРёР·Р°С†РёСЋ" text="РћРґРЅРѕ СЂР°Р±РѕС‡РµРµ РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІРѕ РЅР° РєРѕРјР°РЅРґСѓ. РР·РѕР»РёСЂРѕРІР°РЅРЅС‹Рµ РґР°РЅРЅС‹Рµ, РѕРіСЂР°РЅРёС‡РµРЅРЅС‹Рµ РєР»СЋС‡Рё." />
              <Step num="2" title="Р’С‹РїСѓСЃС‚РёС‚Рµ API-РєР»СЋС‡Рё" text="Admin, write, read, transact вЂ” РіСЂР°РЅСѓР»СЏСЂРЅС‹Рµ РїСЂР°РІР° РёР· РєРѕСЂРѕР±РєРё." />
              <Step num="3" title="РђРіРµРЅС‚С‹ СЃРѕРІРµСЂС€Р°СЋС‚ С‚СЂР°РЅР·Р°РєС†РёРё" text="РЎР±Р°Р»Р°РЅСЃРёСЂРѕРІР°РЅРЅС‹Рµ РїСЂРѕРІРѕРґРєРё С‡РµСЂРµР· REST РёР»Рё x402-Р·Р°РіРѕР»РѕРІРєРё РЅР° Р»СЋР±РѕРј HTTP-РІС‹Р·РѕРІРµ." />
              <Step num="4" title="РЎРІРµРґРёС‚Рµ РѕСЃС‚Р°С‚РєРё" text="Р’СЃС‚СЂРµС‡РЅС‹Рµ РїРѕС‚РѕРєРё Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё РєР»РёСЂСЏС‚СЃСЏ. РџР»Р°С‚РёС‚Рµ С‚РѕР»СЊРєРѕ СЂР°Р·РЅРёС†Сѓ." />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">РЎРѕР·РґР°РЅРѕ РґР»СЏ СЌРєРѕРЅРѕРјРёРєРё Р°РіРµРЅС‚РѕРІ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Feature
                emoji="рџ“’"
                title="Р”РІРѕР№РЅР°СЏ Р·Р°РїРёСЃСЊ"
                description="РљР°Р¶РґР°СЏ С‚СЂР°РЅР·Р°РєС†РёСЏ СЃР±Р°Р»Р°РЅСЃРёСЂРѕРІР°РЅР°. Р”РµРЅСЊРіРё РЅРµ СЃРѕР·РґР°СЋС‚СЃСЏ Рё РЅРµ СѓРЅРёС‡С‚РѕР¶Р°СЋС‚СЃСЏ вЂ” С‚РѕР»СЊРєРѕ РїРµСЂРµРјРµС‰Р°СЋС‚СЃСЏ РјРµР¶РґСѓ СЃС‡РµС‚Р°РјРё. Р“РѕС‚РѕРІРѕ Рє Р°СѓРґРёС‚Сѓ СЃ РїРµСЂРІРѕРіРѕ РґРЅСЏ."
              />
              <Feature
                emoji="вљЎ"
                title="x402 HTTP-РїР»Р°С‚РµР¶Рё"
                description="РђРіРµРЅС‚С‹ РїР»Р°С‚СЏС‚ Р·Р° HTTP-Р·Р°РїСЂРѕСЃС‹ Р·Р° РѕРґРёРЅ round-trip. Р‘РµР· СЃРµСЃСЃРёР№, Р±РµР· С‚РѕРєРµРЅРѕРІ, Р±РµР· СЃС‡РµС‚РѕРІ. РџСЂРѕСЃС‚Рѕ 402 Рё Р·Р°РіРѕР»РѕРІРѕРє X-PAYMENT."
              />
              <Feature
                emoji="вљ–пёЏ"
                title="РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРёР№ РєР»РёСЂРёРЅРі"
                description="Р’СЃС‚СЂРµС‡РЅС‹Рµ РїРѕС‚РѕРєРё РјРµР¶РґСѓ СЃС‡РµС‚Р°РјРё СЃРІРѕРґСЏС‚СЃСЏ. Р­РєРѕРЅРѕРјРёСЏ 30вЂ“70% РЅР° РІР°Р»РѕРІС‹С… РїРµСЂРµРІРѕРґР°С… Р±РµР· С‚Р°Р±Р»РёС†."
              />
              <Feature
                emoji="рџ”‘"
                title="API-РєР»СЋС‡Рё СЃ РїСЂР°РІР°РјРё"
                description="Р’С‹РїСѓСЃРєР°Р№С‚Рµ РєР»СЋС‡Рё СЃ РіСЂР°РЅСѓР»СЏСЂРЅС‹РјРё РїСЂР°РІР°РјРё: admin, write, read, transact. РћС‚Р·С‹РІР°Р№С‚Рµ РІ Р»СЋР±РѕР№ РјРѕРјРµРЅС‚. РќРёРєР°РєРёС… РѕР±С‰РёС… СЃРµРєСЂРµС‚РѕРІ."
              />
              <Feature
                emoji="рџ’±"
                title="РњСѓР»СЊС‚РёРІР°Р»СЋС‚РЅРѕСЃС‚СЊ"
                description="USD, EUR, С‚РѕРєРµРЅС‹ вЂ” Сѓ РєР°Р¶РґРѕРіРѕ СЃС‡С‘С‚Р° СЃРІРѕСЏ РІР°Р»СЋС‚Р°. Р‘Р°Р»Р°РЅСЃС‹ РѕСЃС‚Р°СЋС‚СЃСЏ С‚РѕС‡РЅС‹РјРё, Р±РµР· РїСѓС‚Р°РЅРёС†С‹ СЃ РєСЂРѕСЃСЃ-РєСѓСЂСЃР°РјРё."
              />
              <Feature
                emoji="рџ›ЎпёЏ"
                title="РђСѓС‚РµРЅС‚РёС„РёРєР°С†РёСЏ Рё Р°СѓРґРёС‚"
                description="РљР°Р¶РґРѕРµ РёР·РјРµРЅРµРЅРёРµ РїСЂРёРІСЏР·Р°РЅРѕ Рє РїРѕР»СЊР·РѕРІР°С‚РµР»СЋ Clerk. РџРѕР»РЅР°СЏ РёСЃС‚РѕСЂРёСЏ РєС‚Рѕ, С‡С‚Рѕ, РєРѕРіРґР° Рё РїРѕС‡РµРјСѓ СЃРґРµР»Р°Р»."
              />
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" className="py-24 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">РџСЂРёРјРµРЅРµРЅРёРµ</h2>
            <p className="text-center text-slate-400 max-w-2xl mx-auto mb-16">
              Р“РґРµ Netthouse РѕРєСѓРїР°РµС‚СЃСЏ РІ РїРµСЂРІСѓСЋ РЅРµРґРµР»СЋ.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UseCase
                title="РЁР»СЋР·С‹ РґР»СЏ AI-Р°РіРµРЅС‚РѕРІ"
                text="Р‘РµСЂРёС‚Рµ РїР»Р°С‚Сѓ СЃ LLM-РїСЂРѕРІР°Р№РґРµСЂРѕРІ, API-РёРЅСЃС‚СЂСѓРјРµРЅС‚РѕРІ Рё РёСЃС‚РѕС‡РЅРёРєРѕРІ РґР°РЅРЅС‹С… Р·Р° РєР°Р¶РґС‹Р№ РІС‹Р·РѕРІ. РђРіРµРЅС‚С‹ СЂР°СЃСЃС‡РёС‚С‹РІР°СЋС‚СЃСЏ РІ СЂРµР°Р»СЊРЅРѕРј РІСЂРµРјРµРЅРё вЂ” Р±РµР· РїСЂРµРґРѕРїР»Р°С‚С‹, Р±РµР· СЃРІРµСЂРєРё."
              />
              <UseCase
                title="MCP-СЃРµСЂРІРµСЂС‹"
                text="РњРѕРЅРµС‚РёР·РёСЂСѓР№С‚Рµ СЃРІРѕР№ Model Context Protocol СЃРµСЂРІРµСЂ. РљР»РёРµРЅС‚С‹ РїР»Р°С‚СЏС‚ С‡РµСЂРµР· x402, РІС‹ РІРµРґС‘С‚Рµ С‡РёСЃС‚С‹Р№ СЂРµРµСЃС‚СЂ Рё СЃРІРѕРґРёС‚Рµ РѕСЃС‚Р°С‚РєРё РІ РєРѕРЅС†Рµ РјРµСЃСЏС†Р°."
              />
              <UseCase
                title="РњР°СЂРєРµС‚РїР»РµР№СЃС‹ Р°РіРµРЅС‚-Р°РіРµРЅС‚"
                text="РџРѕР·РІРѕР»СЊС‚Рµ Р°РіРµРЅС‚Р°Рј РїРѕРєСѓРїР°С‚СЊ СѓСЃР»СѓРіРё РґСЂСѓРі Сѓ РґСЂСѓРіР°. Netthouse РєР»РёСЂРёСЂСѓРµС‚ РґРІСѓСЃС‚РѕСЂРѕРЅРЅРёРµ РїРѕС‚РѕРєРё, С‚Р°Рє С‡С‚Рѕ РґРІРёР¶РµС‚СЃСЏ С‚РѕР»СЊРєРѕ С‡РёСЃС‚Р°СЏ СЃСѓРјРјР°."
              />
              <UseCase
                title="РђС‚СЂРёР±СѓС†РёСЏ Р·Р°С‚СЂР°С‚"
                text="Р’РёРґРёС‚Рµ С‚РѕС‡РЅРѕ СЃРєРѕР»СЊРєРѕ РїРѕС‚СЂР°С‚РёР» РєР°Р¶РґС‹Р№ Р°РіРµРЅС‚, Р·Р°РґР°С‡Р° РёР»Рё РїСЂРѕРµРєС‚. РЎРІРѕСЂР°С‡РёРІР°Р№С‚Рµ РїРѕ РѕСЂРіР°РЅРёР·Р°С†РёРё, Р°РіРµРЅС‚Сѓ РёР»Рё СЃС‡С‘С‚Сѓ вЂ” РіРѕС‚РѕРІРѕ РґР»СЏ С„РёРЅРѕС‚РґРµР»Р°."
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">РџСЂРѕСЃС‚С‹Рµ С‚Р°СЂРёС„С‹</h2>
            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
              Р‘РµСЃРїР»Р°С‚РЅРѕ РїРѕРєР° РІС‹ СЂР°Р·СЂР°Р±Р°С‚С‹РІР°РµС‚Рµ. РџР»Р°С‚РёС‚Рµ РєРѕРіРґР° РјР°СЃС€С‚Р°Р±РёСЂСѓРµС‚РµСЃСЊ.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Price
                name="Hobby"
                price="Р‘РµСЃРїР»Р°С‚РЅРѕ"
                desc="Р”Р»СЏ СЌРєСЃРїРµСЂРёРјРµРЅС‚РѕРІ Рё РїРµС‚-РїСЂРѕРµРєС‚РѕРІ"
                features={["1 РѕСЂРіР°РЅРёР·Р°С†РёСЏ", "10k С‚СЂР°РЅР·Р°РєС†РёР№/РјРµСЃСЏС†", "РџРѕРґРґРµСЂР¶РєР° СЃРѕРѕР±С‰РµСЃС‚РІР°"]}
                highlight={false}
              />
              <Price
                name="Pro"
                price="$29"
                desc="Р’ РјРµСЃСЏС†, Р·Р° РѕСЂРіР°РЅРёР·Р°С†РёСЋ"
                features={["РќРµРѕРіСЂР°РЅРёС‡РµРЅРЅРѕ РѕСЂРіР°РЅРёР·Р°С†РёР№", "1M С‚СЂР°РЅР·Р°РєС†РёР№/РјРµСЃСЏС†", "РџСЂРёРѕСЂРёС‚РµС‚РЅР°СЏ РїРѕРґРґРµСЂР¶РєР°", "РЎРІРѕРё РґРѕРјРµРЅС‹"]}
                highlight={false}
              />
              <Price
                name="Startup"
                price="$99"
                desc="Р”Р»СЏ РєРѕРјР°РЅРґ, Р·Р°РїСѓСЃРєР°СЋС‰РёС… РїСЂРѕРґСѓРєС‚С‹ СЃ Р°РіРµРЅС‚Р°РјРё"
                features={["Р’СЃС‘ РёР· Pro", "10M С‚СЂР°РЅР·Р°РєС†РёР№/РјРµСЃСЏС†", "Р–СѓСЂРЅР°Р»С‹ Р°СѓРґРёС‚Р°", "РџРѕРґРґРµСЂР¶РєР° РІ Slack"]}
                highlight={true}
              />
              <Price
                name="Enterprise"
                price="РџРѕ Р·Р°РїСЂРѕСЃСѓ"
                desc="Р”Р»СЏ СЂРµРіСѓР»РёСЂСѓРµРјС‹С… РЅР°РіСЂСѓР·РѕРє"
                features={["SLA Рё on-prem", "SSO / SAML", "Р’С‹РґРµР»РµРЅРЅС‹Р№ CSM", "РџРѕР»СЊР·РѕРІР°С‚РµР»СЊСЃРєРёРµ РїСЂР°РІРёР»Р° РєР»РёСЂРёРЅРіР°"]}
                highlight={false}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">РќР°С‡РЅРёС‚Рµ Р·Р° 5 РјРёРЅСѓС‚</h2>
            <p className="text-slate-600 mb-8">
              Р‘РµР· РєР°СЂС‚С‹. Р‘РµР· Р·РІРѕРЅРєР° РјРµРЅРµРґР¶РµСЂСѓ. Р—Р°СЂРµРіРёСЃС‚СЂРёСЂСѓР№С‚РµСЃСЊ, СЃРѕР·РґР°Р№С‚Рµ РѕСЂРіР°РЅРёР·Р°С†РёСЋ Рё РїСЂРѕРІРµРґРёС‚Рµ РїРµСЂРІСѓСЋ С‚СЂР°РЅР·Р°РєС†РёСЋ.
            </p>
            <a
              href="https://app.netthouse.com"
              className="inline-block px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
            >
              РЎРѕР·РґР°С‚СЊ РѕСЂРіР°РЅРёР·Р°С†РёСЋ в†’
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
        <img src="/netthouse-horizontal-color.svg" alt="Netthouse" className="h-7 w-auto mb-3" />
              <p className="text-sm text-slate-500">
                РџР»Р°С‚С‘Р¶РЅР°СЏ РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР° РґР»СЏ AI-Р°РіРµРЅС‚РѕРІ.
              </p>
            </div>
            <FooterCol title="РџСЂРѕРґСѓРєС‚" links={["Р’РѕР·РјРѕР¶РЅРѕСЃС‚Рё", "РўР°СЂРёС„С‹", "Р”РѕРєСѓРјРµРЅС‚Р°С†РёСЏ", "РСЃС‚РѕСЂРёСЏ РёР·РјРµРЅРµРЅРёР№"]} />
            <FooterCol title="РљРѕРјРїР°РЅРёСЏ" links={["Рћ РЅР°СЃ", "Р‘Р»РѕРі", "РљРѕРЅС‚Р°РєС‚С‹"]} />
            <FooterCol title="Р®СЂРёРґРёС‡РµСЃРєРѕРµ" links={["РљРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚СЊ", "РЈСЃР»РѕРІРёСЏ", "Р‘РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ"]} />
          </div>
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            В© 2026 Netthouse. РЎРґРµР»Р°РЅРѕ СЃ вќ¤пёЏ РґР»СЏ СЌРєРѕРЅРѕРјРёРєРё Р°РіРµРЅС‚РѕРІ.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ num, title, text }: { num: string; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
        {num}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}

function Feature({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function UseCase({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function Price({
  name,
  price,
  desc,
  features,
  highlight,
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlight: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-lg border ${
        highlight
          ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-105"
          : "bg-white border-slate-200"
      }`}
    >
      <h3 className={`text-lg font-semibold ${highlight ? "text-white" : "text-slate-900"}`}>{name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-4xl font-bold ${highlight ? "text-white" : "text-slate-900"}`}>{price}</span>
        {price !== "Р‘РµСЃРїР»Р°С‚РЅРѕ" && price !== "РџРѕ Р·Р°РїСЂРѕСЃСѓ" && (
          <span className={`text-sm ${highlight ? "text-slate-400" : "text-slate-500"}`}>/РјРµСЃ</span>
        )}
      </div>
      <p className={`mt-2 text-sm ${highlight ? "text-slate-400" : "text-slate-600"}`}>{desc}</p>
      <ul className={`mt-6 space-y-2 text-sm ${highlight ? "text-slate-300" : "text-slate-600"}`}>
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className={highlight ? "text-green-400" : "text-green-600"}>вњ“</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
