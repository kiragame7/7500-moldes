import { useState, useEffect, useRef } from 'react';
import { getCheckoutEventId, getViewContentEventId, useFacebookConversions, withHotmartAttribution } from '@/lib/facebook.hooks';
import heroAsset from "@/assets/hero_spanish_new.webp.asset.json";
import whatsappAsset from "@/assets/whatsapp_chat_new.webp.asset.json";
import dep1Asset from "@/assets/depoimento_1.webp.asset.json";
import dep2Asset from "@/assets/depoimento_2.webp.asset.json";
import dep3Asset from "@/assets/depoimento_3.webp.asset.json";
import dep4Asset from "@/assets/depoimento_4.webp.asset.json";
import rotulosAsset from "@/assets/rotulos.webp.asset.json";

export function HomeContent() {
  const { trackEvent } = useFacebookConversions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [diffActiveIndex, setDiffActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDiffPaused, setIsDiffPaused] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  
  const carouselRef = useRef<HTMLDivElement>(null);
  const diffCarouselRef = useRef<HTMLDivElement>(null);
  
  const autoCycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const diffAutoCycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const diffPauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const itemsCount = 6;
  const diffItemsCount = 6;

  const scrollToItem = (index: number, ref: React.RefObject<HTMLDivElement | null>, count: number, setter: (idx: number) => void) => {
    if (ref.current) {
      const itemWidth = ref.current.scrollWidth / count;
      ref.current.scrollTo({
        left: itemWidth * index,
        behavior: 'smooth'
      });
      setter(index);
    }
  };

  const startAutoCycle = () => {
    if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
    autoCycleTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % itemsCount;
        scrollToItem(next, carouselRef, itemsCount, setActiveIndex);
        return next;
      });
    }, 3000);
  };

  const startDiffAutoCycle = () => {
    if (diffAutoCycleTimerRef.current) clearInterval(diffAutoCycleTimerRef.current);
    diffAutoCycleTimerRef.current = setInterval(() => {
      setDiffActiveIndex((prev) => {
        const next = (prev + 1) % diffItemsCount;
        scrollToItem(next, diffCarouselRef, diffItemsCount, setDiffActiveIndex);
        return next;
      });
    }, 3000);
  };

  const handleInteraction = () => {
    if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsPaused(true);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      startAutoCycle();
    }, 5000);
  };

  const handleDiffInteraction = () => {
    if (diffAutoCycleTimerRef.current) clearInterval(diffAutoCycleTimerRef.current);
    if (diffPauseTimerRef.current) clearTimeout(diffPauseTimerRef.current);
    setIsDiffPaused(true);
    diffPauseTimerRef.current = setTimeout(() => {
      setIsDiffPaused(false);
      startDiffAutoCycle();
    }, 5000);
  };

  useEffect(() => {
    startAutoCycle();
    startDiffAutoCycle();
    return () => {
      if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (diffAutoCycleTimerRef.current) clearInterval(diffAutoCycleTimerRef.current);
      if (diffPauseTimerRef.current) clearTimeout(diffPauseTimerRef.current);
    };
  }, []);

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, count: number, setter: (idx: number) => void, activeIdx: number, paused: boolean) => {
    if (ref.current && !paused) {
      const scrollLeft = ref.current.scrollLeft;
      const itemWidth = ref.current.scrollWidth / count;
      const newIndex = Math.round(scrollLeft / itemWidth);
      if (newIndex !== activeIdx && newIndex < count) {
        setter(newIndex);
      }
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="site-wrapper">



    
    <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="bg-gradient-brand text-white text-center text-xs sm:text-sm font-semibold py-2.5 px-4 flex flex-wrap items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-zap w-4 h-4 fill-white" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
            <span
                className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-2.5 py-0.5"><span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></span>OFERTA VÁLIDA SOLO HOY ({new Date(Date.now()).toLocaleDateString('es-ES')})</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-zap w-4 h-4 fill-white" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg></div>
        <section
            className="bg-gradient-hero pt-12 md:pt-20 pb-16 md:pb-24 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-accent-mint-bg backdrop-blur border border-accent-mint/30 rounded-full px-4 py-1.5 text-sm font-medium text-foreground shadow-sm"><span className="w-7 h-7 rounded-full bg-gradient-mint flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text w-4 h-4 text-white" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg></span>Acervo
                    Profesional de Moldes</div>
                <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] text-foreground">Ten acceso a un <span className="text-gradient-brand italic">acervo profesional</span> con miles de moldes listos para responder a cualquier cliente en pocos minutos</h1>
                <p className="mt-6 md:mt-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">Más de <strong className="text-foreground">7.500 diseños y moldes editables</strong>, compatibles con Canva, CorelDraw y Silhouette Studio.</p>
                <div className="mt-10 md:mt-12">
                    <div className="relative mx-auto max-w-3xl"><img src={heroAsset.url} alt="Acervo de moldes para papelaria personalizada mostrado em notebook, tablet e celular" width="1600" height="900" className="w-full rounded-3xl shadow-card" fetchPriority="high"
                        /></div>
                </div>
                <div className="mt-10"><button onClick={(e) => { e.preventDefault(); void trackEvent('ViewContent', { section: 'Hero' }, getViewContentEventId('Hero')); document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-bold text-base md:text-lg px-6 py-4 md:px-10 md:py-5 rounded-full shadow-green hover:scale-[1.02] transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-play w-5 h-5 fill-white" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 0 5 19z"></path></svg>QUIERO RECIBIR EL ACERVO COMPLETO</button>
                    <p
                        className="mt-4 text-sm text-muted-foreground">Acceso inmediato • Producto digital • Pago con tarjeta o moneda local</p>
                </div>
            </div>
            </section>
            <section className="py-12 px-4 border-y border-border bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-soft p-5 border border-border shadow-card flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-cta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text w-6 h-6 text-white shrink-0"
                                aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg></div>
                        <div>
                            <p className="text-2xl font-black text-gradient-brand">7.500+</p>
                            <p className="text-xs font-medium text-muted-foreground leading-tight">archivos profesionales</p>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-soft p-5 border border-border shadow-card flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-cta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-6 h-6 text-white shrink-0"
                                aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></div>
                        <div>
                            <p className="text-2xl font-black text-gradient-brand">3</p>
                            <p className="text-xs font-medium text-muted-foreground leading-tight">programas compatibles</p>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-soft p-5 border border-border shadow-card flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-cta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles w-6 h-6 text-white shrink-0"
                                aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg></div>
                        <div>
                            <p className="text-2xl font-black text-gradient-brand">12+</p>
                            <p className="text-xs font-medium text-muted-foreground leading-tight">categorías organizadas</p>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-soft p-5 border border-border shadow-card flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-cta"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shield-check w-6 h-6 text-white shrink-0"
                                aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg></div>
                        <div>
                            <p className="text-2xl font-black text-gradient-brand">0s</p>
                            <p className="text-xs font-medium text-muted-foreground leading-tight">acceso inmediato</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 md:py-24 px-4 bg-gradient-soft">
                <div className="max-w-3xl mx-auto">
                    <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand">El problema de quienes trabajan con productos personalizados</p>
                    <h2 className="mt-4 text-3xl md:text-5xl font-black text-center leading-tight">Imagina recibir estos pedidos por WhatsApp</h2>
                    <div className="mt-10 max-w-md mx-auto rounded-3xl border border-border shadow-card overflow-hidden bg-white"><img src={whatsappAsset.url} alt="Print de conversa do WhatsApp com pedidos de clientes: Stitch, Sonic, caixa milk e outros personagens" width="800" height="1600" className="w-full h-auto"
                            loading="lazy" /></div>
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <div className="rounded-2xl border border-border bg-white p-5 shadow-card text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-red-50 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x w-5 h-5 text-red-500"
                                    aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg></div>
                            <p className="mt-3 font-bold text-foreground">Sin acervo</p>
                            <p className="mt-1 text-sm text-muted-foreground">Pierde tiempo, crea desde cero o pierde la venta.</p>
                        </div>
                        <div className="rounded-2xl border-2 border-transparent bg-white shadow-cta overflow-hidden" style={{backgroundImage: 'linear-gradient(white, white), var(--gradient-brand)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box'}}>
                            <div className="p-5 text-center">
                                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-brand flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-white"
                                        aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></div>
                                <p className="mt-3 font-bold text-foreground">Con acervo</p>
                                <p className="mt-1 text-sm text-muted-foreground">Responde en minutos y cierra más pedidos.</p>
                            </div>
                        </div>
                    </div>
                    <h3 className="mt-14 text-2xl md:text-4xl font-black text-center leading-tight">Deja de decir <span className="text-gradient-brand italic">&quot;no tengo este tema&quot;</span></h3>
                    <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">Este acervo fue creado para quienes quieren trabajar más rápido y atender prácticamente cualquier pedido que reciban.</p>
                    <div className="mt-10 -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
                        <div className="snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] bg-white rounded-2xl p-5 border border-border shadow-card flex flex-col items-center text-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-smartphone w-6 h-6 text-white"
                                    aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg></div>
                            <div>
                                <p className="font-bold text-foreground">Responde rápido</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Responde cualquier pedido en minutos</p>
                            </div>
                        </div>
                        <div className="snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] bg-white rounded-2xl p-5 border border-border shadow-card flex flex-col items-center text-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search w-6 h-6 text-white"
                                    aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg></div>
                            <div>
                                <p className="font-bold text-foreground">Miles de temas</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Encuentra el personaje o la ocasión ideal</p>
                            </div>
                        </div>
                        <div className="snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] bg-white rounded-2xl p-5 border border-border shadow-card flex flex-col items-center text-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pen-tool w-6 h-6 text-white"
                                    aria-hidden="true"><path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"></path><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"></path><path d="m2.3 2.3 7.286 7.286"></path><circle cx="11" cy="11" r="2"></circle></svg></div>
                            <div>
                                <p className="font-bold text-foreground">Edita fácilmente</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Ábrelo en Canva, Corel o Silhouette</p>
                            </div>
                        </div>
                        <div className="snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] bg-white rounded-2xl p-5 border border-border shadow-card flex flex-col items-center text-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-printer w-6 h-6 text-white"
                                    aria-hidden="true"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path><rect x="6" y="14" width="12" height="8" rx="1"></rect></svg></div>
                            <div>
                                <p className="font-bold text-foreground">Produce más</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Imprime y vende el mismo día</p>
                            </div>
                        </div>
                        <div className="snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] bg-white rounded-2xl p-5 border border-border shadow-card flex flex-col items-center text-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shield-check w-6 h-6 text-white"
                                    aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg></div>
                            <div>
                                <p className="font-bold text-foreground">Seguridad</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Trabaja con un acervo completo</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 text-center"><button onClick={(e) => { e.preventDefault(); document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-bold px-6 py-4 rounded-full shadow-green">QUIERO TENER ESTE ACERVO</button></div>
                </div>
            </section>
            <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black leading-tight">Mira algunos archivos disponibles</h2>
                    </div>
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Kit Festa Infantil.webp" alt="Kit de Fiesta Infantil" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Kit de Fiesta Infantil</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Kit Festa Adulto.webp" alt="Kit de Fiesta para Adultos" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Kit de Fiesta para Adultos</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Convites.webp" alt="Invitaciones" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Invitaciones</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Topo de Bolo.webp" alt="Topper para Pastel" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Topper para Pastel</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Caixa Milk.webp" alt="Cajas Tipo Milk" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Cajas Tipo Milk</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Tubetes.webp" alt="Tubetes" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Tubetes</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Sacolinhas.webp" alt="Bolsitas" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Bolsitas</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Bandeirolas.webp" alt="Banderines" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Banderines</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src={rotulosAsset.url} alt="Etiquetas" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Etiquetas</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Lembrancinhas.webp" alt="Recuerdos" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Recuerdos</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Topper-2.webp" alt="Toppers" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Toppers</h3>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow">
                            <div className="aspect-square overflow-hidden"><img src="/assets/Kit Festa Infantil.webp" alt="Mucho más..." loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                            <h3 className="p-4 font-bold text-foreground text-center">Mucho más...</h3>
                        </div>
                    </div>
                    <div className="mt-12 text-center"><button onClick={(e) => { e.preventDefault(); document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-bold px-6 py-4 rounded-full shadow-green">VER TODO EL ACERVO</button></div>
                </div>
            </section>
            <section className="py-16 md:py-24 px-4 bg-gradient-soft">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-center leading-tight">Para quién fue creado este material</h2>
                    <div 
                      ref={carouselRef}
                      onScroll={() => handleScroll(carouselRef, itemsCount, setActiveIndex, activeIndex, isPaused)}
                      onTouchStart={handleInteraction}
                      onMouseDown={handleInteraction}
                      className="mt-10 -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden"
                    >
                        <div className={`snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-5 border border-border shadow-card transition-all cursor-pointer ${activeIndex === 0 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-white"
                                    aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></div>
                            <p className="text-foreground font-medium">Quienes ya venden productos personalizados</p>
                        </div>
                        <div className={`snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-5 border border-border shadow-card transition-all cursor-pointer ${activeIndex === 1 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-white"
                                    aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></div>
                            <p className="text-foreground font-medium">Quienes reciben pedidos por WhatsApp</p>
                        </div>
                        <div className={`snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-5 border border-border shadow-card transition-all cursor-pointer ${activeIndex === 3 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-white"
                                    aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></div>
                            <p className="text-foreground font-medium">Quienes quieren responder a los clientes rápidamente</p>
                        </div>
                        <div className={`snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-5 border border-border shadow-card transition-all cursor-pointer ${activeIndex === 4 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-white"
                                    aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></div>
                            <p className="text-foreground font-medium">Quienes quieren aumentar las ventas</p>
                        </div>
                        <div className={`snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-5 border border-border shadow-card transition-all cursor-pointer ${activeIndex === 5 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-white"
                                    aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></div>
                            <p className="text-foreground font-medium">Quienes quieren crear un gran acervo profesional</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center gap-2">
                      {[...Array(itemsCount)].map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => { scrollToItem(i, carouselRef, itemsCount, setActiveIndex); handleInteraction(); }}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${activeIndex === i ? 'bg-brand w-6' : 'bg-brand/25'}`} 
                          aria-label={`Ir para slide ${i + 1}`}
                        />
                      ))}
                    </div>

                </div>
            </section>
            <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 text-accent-mint font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles w-4 h-4" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>                        Paso a Paso <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles w-4 h-4"
                            aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg></div>
                    <h2
                        className="mt-3 text-3xl md:text-5xl font-black text-center">CÓMO FUNCIONA</h2>
                        <div className="mt-14 grid md:grid-cols-3 gap-8">
                            <div className="relative bg-gradient-soft rounded-3xl p-8 pt-10 border border-border shadow-card">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-mint text-white text-2xl font-black flex items-center justify-center shadow-mint">1</div>
                                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-white mt-4"><img src="/assets/step1-DDgFXI8r.png" alt="ENCONTRE O TEMA" loading="lazy" className="w-full h-full object-cover" /></div>
                                <div className="mt-6 text-center">
                                    <div className="text-xs font-bold text-accent-mint tracking-wider">MILES DE TEMAS</div>
                                    <h3 className="mt-2 text-2xl font-black">ENCUENTRA EL TEMA</h3>
                                    <p className="mt-3 text-muted-foreground">Busca entre miles de modelos organizados.</p>
                                </div>
                            </div>
                            <div className="relative bg-gradient-soft rounded-3xl p-8 pt-10 border border-border shadow-card">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-mint text-white text-2xl font-black flex items-center justify-center shadow-mint">2</div>
                                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-white mt-4"><img src="/assets/step2-CUBoFAqM.png" alt="EDITE EM MINUTOS" loading="lazy" className="w-full h-full object-cover" /></div>
                                <div className="mt-6 text-center">
                                    <div className="text-xs font-bold text-accent-mint tracking-wider">LISTO PARA EDITAR</div>
                                    <h3 className="mt-2 text-2xl font-black">EDITA EN MINUTOS</h3>
                                    <p className="mt-3 text-muted-foreground">Ábrelo en Canva, CorelDraw o Silhouette Studio.</p>
                                </div>
                            </div>
                            <div className="relative bg-gradient-soft rounded-3xl p-8 pt-10 border border-border shadow-card">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-mint text-white text-2xl font-black flex items-center justify-center shadow-mint">3</div>
                                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-white mt-4"><img src="/assets/step3-Ctesdp7S.png" alt="IMPRIMA E VENDA" loading="lazy" className="w-full h-full object-cover" /></div>
                                <div className="mt-6 text-center">
                                    <div className="text-xs font-bold text-accent-mint tracking-wider">COMIENZA A FACTURAR</div>
                                    <h3 className="mt-2 text-2xl font-black">IMPRIME Y VENDE</h3>
                                    <p className="mt-3 text-muted-foreground">Prepara el pedido y entrégalo al cliente.</p>
                                </div>
                            </div>
                        </div>
                </div>
            </section>
            <section className="py-16 md:py-24 px-4 bg-gradient-soft">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-center leading-tight">Qué hace que este acervo sea diferente</h2>
                    <div 
                      ref={diffCarouselRef}
                      onScroll={() => handleScroll(diffCarouselRef, diffItemsCount, setDiffActiveIndex, diffActiveIndex, isDiffPaused)}
                      onTouchStart={handleDiffInteraction}
                      onMouseDown={handleDiffInteraction}
                      className="mt-12 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden"
                    >
                        <div className={`snap-center shrink-0 w-[80%] sm:w-[50%] lg:w-[33.333%] bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col items-center text-center gap-3 transition-all ${diffActiveIndex === 0 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text w-6 h-6 text-white"
                                    aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg></div>
                            <p
                                className="font-semibold text-foreground">Archivos organizados</p>
                        </div>
                        <div className={`snap-center shrink-0 w-[80%] sm:w-[50%] lg:w-[33.333%] bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col items-center text-center gap-3 transition-all ${diffActiveIndex === 1 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles w-6 h-6 text-white"
                                    aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg></div>
                            <p
                                className="font-semibold text-foreground">Miles de temas</p>
                        </div>
                        <div className={`snap-center shrink-0 w-[80%] sm:w-[50%] lg:w-[33.333%] bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col items-center text-center gap-3 transition-all ${diffActiveIndex === 2 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-zap w-6 h-6 text-white"
                                    aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg></div>
                            <p className="font-semibold text-foreground">Actualizaciones</p>
                        </div>
                        <div className={`snap-center shrink-0 w-[80%] sm:w-[50%] lg:w-[33.333%] bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col items-center text-center gap-3 transition-all ${diffActiveIndex === 3 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-6 h-6 text-white"
                                    aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg></div>
                            <p className="font-semibold text-foreground">Compatible con programas populares</p>
                        </div>
                        <div className={`snap-center shrink-0 w-[80%] sm:w-[50%] lg:w-[33.333%] bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col items-center text-center gap-3 transition-all ${diffActiveIndex === 4 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-gift w-6 h-6 text-white"
                                    aria-hidden="true"><path d="M12 7v14"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect></svg></div>
                            <p
                                className="font-semibold text-foreground">Ideal para uso profesional</p>
                        </div>
                        <div className={`snap-center shrink-0 w-[80%] sm:w-[50%] lg:w-[33.333%] bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col items-center text-center gap-3 transition-all ${diffActiveIndex === 5 ? 'scale-[1.02] border-brand/50' : ''}`}>
                            <div className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-download w-6 h-6 text-white"
                                    aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg></div>
                            <p className="font-semibold text-foreground">Producto digital • Acceso inmediato</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center gap-2">
                      {[...Array(diffItemsCount)].map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => { scrollToItem(i, diffCarouselRef, diffItemsCount, setDiffActiveIndex); handleDiffInteraction(); }}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${diffActiveIndex === i ? 'bg-brand w-6' : 'bg-brand/25'}`} 
                          aria-label={`Ir para slide ${i + 1}`}
                        />
                      ))}
                    </div>

                </div>
            </section>
            <section id="oferta" className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-brand">Oferta Especial</p>
                    <h2 className="mt-3 text-3xl md:text-5xl font-black">Elige el paquete ideal para ti</h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                        <div className="relative rounded-3xl border-2 border-transparent bg-white shadow-cta overflow-hidden" style={{backgroundImage: 'linear-gradient(white, white), var(--gradient-brand)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box'}}>
                            <div className="bg-gradient-mint text-white text-center text-xs font-black tracking-widest py-2 flex items-center justify-center gap-2 shadow-mint"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-crown w-4 h-4" aria-hidden="true"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path><path d="M5 21h14"></path></svg>                                MÁS COMPLETO</div>
                            <div className="p-6 md:p-8">
                                <h3 className="text-2xl font-black">Paquete Premium</h3>
                                <div className="mt-6 flex flex-col items-center gap-1"><span className="text-5xl font-black text-gradient-brand">US$9,99</span><span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">💳 Paga en tu moneda local o con tarjeta</span></div>
                                <ul className="mt-6 space-y-3 inline-block text-left mx-auto">
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Más de 7.500 diseños</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Canva</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Corel</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Silhouette</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Editables</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Invitaciones</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Toppers</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Cajitas</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Temas variados</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Todos los bonos</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>360 mil archivos</span></li>
                                    <li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Vitalicio</span></li>
                                </ul><a href={withHotmartAttribution("https://pay.hotmart.com/U107293780N?off=17nhtsq2&checkoutMode=10")} onClick={async (event) => { event.preventDefault(); const href = event.currentTarget.href; const xcod = new URL(href).searchParams.get('xcod'); await Promise.race([trackEvent('InitiateCheckout', { plan: 'Premium', value: 9.99, currency: 'USD', content_ids: ['premium'], content_type: 'product', hotmart_xcod: xcod }, getCheckoutEventId('Premium')), new Promise((resolve) => setTimeout(resolve, 300))]); window.open(href, '_blank', 'noopener'); }} target="_blank" rel="noopener" className="mt-6 inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-black px-6 py-4 rounded-full shadow-green hover:scale-[1.02] transition-transform animate-pulse-gentle">QUIERO EL PREMIUM</a>
                                <p
                                    className="mt-4 text-center text-xs text-muted-foreground">Acceso inmediato • Producto digital • Pago en moneda local o con tarjeta</p>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-border bg-white shadow-card overflow-hidden">
                            <div className="bg-muted text-muted-foreground text-center text-xs font-bold tracking-widest py-2">OPCIÓN SIMPLE</div>
                            <div className="p-6 md:p-8">
                                <h3 className="text-2xl font-black">Paquete Básico</h3>
                                <div className="mt-6 flex flex-col items-center gap-1"><span className="text-5xl font-black text-foreground">US$4,99</span><span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">💳 Paga en tu moneda local o con tarjeta</span></div>
                                <ul className="mt-6 space-y-3 text-sm inline-block text-left mx-auto">
                                    <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Kit de Fiesta listo</span></li>
                                    <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Garantía</span></li>
                                    <li className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check w-5 h-5 text-brand shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg><span>Acceso inmediato</span></li>
                                    <li className="flex items-center gap-2 opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-x w-5 h-5 shrink-0"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg><span>Sin bonos</span></li>
                                </ul><button onClick={() => { setShowUpgradeModal(true); void trackEvent('ViewContent', { plan: 'Basic', price: 4.99 }, getViewContentEventId('Basic')); }} className="mt-6 w-full border-2 border-foreground text-foreground font-bold px-6 py-4 rounded-full hover:bg-foreground hover:text-background transition text-center">QUIERO EL BÁSICO</button></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 md:py-24 px-4 bg-gradient-soft">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-center leading-tight">Quiénes ya lo usan</h2>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white rounded-2xl p-2 border border-border shadow-card overflow-hidden">
                          <img src={dep1Asset.url} alt="Depoimento 1" className="w-full h-auto rounded-xl" fetchPriority="high" />
                          <div className="flex gap-1 text-accent-mint justify-center py-3">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-star w-4 h-4 fill-current" aria-hidden="true">
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl p-2 border border-border shadow-card overflow-hidden">
                          <img src={dep2Asset.url} alt="Depoimento 2" loading="lazy" className="w-full h-auto rounded-xl" />
                          <div className="flex gap-1 text-accent-mint justify-center py-3">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-star w-4 h-4 fill-current" aria-hidden="true">
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl p-2 border border-border shadow-card overflow-hidden">
                          <img src={dep3Asset.url} alt="Depoimento 3" loading="lazy" className="w-full h-auto rounded-xl" />
                          <div className="flex gap-1 text-accent-mint justify-center py-3">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-star w-4 h-4 fill-current" aria-hidden="true">
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl p-2 border border-border shadow-card overflow-hidden">
                          <img src={dep4Asset.url} alt="Depoimento 4" loading="lazy" className="w-full h-auto rounded-xl" />
                          <div className="flex gap-1 text-accent-mint justify-center py-3">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-star w-4 h-4 fill-current" aria-hidden="true">
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                              </svg>
                            ))}
                          </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 md:py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto text-center"><span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-mint-bg text-accent-mint text-xs font-black uppercase tracking-widest"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-gift w-4 h-4" aria-hidden="true"><path d="M12 7v14"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect></svg> Contenido Extra</span>
                    <h2
                        className="mt-4 text-3xl md:text-5xl font-black">Bonos <span className="text-gradient-mint">Exclusivos</span></h2>
                        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Materiales complementarios que recibes junto con el acervo, sin costo adicional.</p>
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                            <div className="group relative w-full max-w-xs rounded-3xl p-8 pt-10 bg-gradient-soft border border-border shadow-card hover:shadow-mint transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-mint text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-mint tracking-widest whitespace-nowrap">BONO
                                    01</div><span className="w-16 h-16 rounded-2xl bg-accent-mint-bg flex items-center justify-center ring-4 ring-white shadow-mint"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-gift w-8 h-8 text-accent-mint" aria-hidden="true"><path d="M12 7v14"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect></svg></span>
                                <h3
                                    className="mt-5 text-xl font-black leading-tight">Invitaciones Editables</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">Modelos listos para personalizar</p>
                            </div>
                            <div className="group relative w-full max-w-xs rounded-3xl p-8 pt-10 bg-gradient-soft border border-border shadow-card hover:shadow-mint transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-mint text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-mint tracking-widest whitespace-nowrap">BONO
                                    02</div><span className="w-16 h-16 rounded-2xl bg-accent-mint-bg flex items-center justify-center ring-4 ring-white shadow-mint"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-gift w-8 h-8 text-accent-mint" aria-hidden="true"><path d="M12 7v14"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect></svg></span>
                                <h3
                                    className="mt-5 text-xl font-black leading-tight">8.000 Cajitas</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">Variedad de temas y formatos</p>
                            </div>
                            <div className="group relative w-full max-w-xs rounded-3xl p-8 pt-10 bg-gradient-soft border border-border shadow-card hover:shadow-mint transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-mint text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-mint tracking-widest whitespace-nowrap">BONO
                                    03</div><span className="w-16 h-16 rounded-2xl bg-accent-mint-bg flex items-center justify-center ring-4 ring-white shadow-mint"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-gift w-8 h-8 text-accent-mint" aria-hidden="true"><path d="M12 7v14"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect></svg></span>
                                <h3
                                    className="mt-5 text-xl font-black leading-tight">1.500 Toppers</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">Listos para imprimir</p>
                            </div>
                            <div className="group relative w-full max-w-xs rounded-3xl p-8 pt-10 bg-gradient-soft border border-border shadow-card hover:shadow-mint transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-mint text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-mint tracking-widest whitespace-nowrap">BONO
                                    04</div><span className="w-16 h-16 rounded-2xl bg-accent-mint-bg flex items-center justify-center ring-4 ring-white shadow-mint"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-gift w-8 h-8 text-accent-mint" aria-hidden="true"><path d="M12 7v14"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect></svg></span>
                                <h3
                                    className="mt-5 text-xl font-black leading-tight">Kit de Fiesta para Adultos</h3>
                                     <p className="mt-2 text-sm text-muted-foreground">Temas exclusivos para adultos</p>
                            </div>
                            <div className="group relative w-full max-w-xs rounded-3xl p-8 pt-10 bg-gradient-soft border border-border shadow-card hover:shadow-mint transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-mint text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-mint tracking-widest whitespace-nowrap">BONO
                                    05</div><span className="w-16 h-16 rounded-2xl bg-accent-mint-bg flex items-center justify-center ring-4 ring-white shadow-mint"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-gift w-8 h-8 text-accent-mint" aria-hidden="true"><path d="M12 7v14"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect></svg></span>
                                <h3
                                    className="mt-5 text-xl font-black leading-tight">Guía de Organización</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">Organiza tus archivos y pedidos</p>
                            </div>
                            <div className="group relative w-full max-w-xs rounded-3xl p-8 pt-10 bg-gradient-soft border border-border shadow-card hover:shadow-mint transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-mint text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-mint tracking-widest whitespace-nowrap">BONO
                                    06</div><span className="w-16 h-16 rounded-2xl bg-accent-mint-bg flex items-center justify-center ring-4 ring-white shadow-mint"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-gift w-8 h-8 text-accent-mint" aria-hidden="true"><path d="M12 7v14"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect></svg></span>
                                <h3
                                    className="mt-5 text-xl font-black leading-tight">360 mil archivos</h3>
                                     <p className="mt-2 text-sm text-muted-foreground">Acervo extra gigante</p>
                            </div>
                        </div>
                </div>
            </section>
            <section className="py-16 md:py-24 px-4 bg-gradient-soft">
                <div className="max-w-3xl mx-auto">
                    <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand">FAQ</p>
                    <h2 className="mt-3 text-3xl md:text-5xl font-black text-center">Preguntas frecuentes</h2>
                    <div className="mt-10 space-y-4">
                        {[
                          { q: "¿Puedo usar los moldes para vender personalizados?", a: "Sí. Puedes usar los archivos para crear productos físicos personalizados para tus clientes, como kits, invitaciones, cajitas, toppers y recuerdos." },
                          { q: "¿Hay varios temas disponibles?", a: "Sí. El paquete reúne una gran variedad de temas y categorías para facilitar tu producción y aumentar tus opciones de atención." },
                          { q: "¿Funciona en Canva?", a: "Parte de los materiales es compatible con Canva, además de archivos para CorelDraw y Silhouette Studio. En la descripción del paquete Premium, destacamos esa compatibilidad." },
                          { q: "¿Necesito saber diseño?", a: "No necesitas crear desde cero. Los modelos ya vienen listos para usar como base. Puedes editar y adaptar según el pedido, cuando el archivo sea editable." },
                          { q: "¿Cuándo recibo el acceso?", a: "El acceso se libera tras la confirmación del pago y se envía al correo electrónico registrado." },
                          { q: "¿Es un producto físico?", a: "No. Es un producto 100% digital. Recibes los archivos para descargar, editar, imprimir y usar en tu producción." },
                          { q: "¿Tiene garantía?", a: "Sí. Tienes 7 días de garantía, como se informa en la página." },
                          { q: "¿Sirve para quien está comenzando?", a: "Sí. El paquete ayuda a quien está empezando porque evita que tengas que crear todos los modelos desde cero." },
                          { q: "¿Sirve para quien ya trabaja con papelería?", a: "Sí. El objetivo es justamente ampliar tu acervo y dar más velocidad para atender pedidos variados." }
                        ].map((item, i) => (
                          <div key={i} className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
                            <button 
                              onClick={() => toggleFaq(i)}
                              className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                            >
                              <span className="font-bold text-foreground pr-4">{item.q}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={`lucide lucide-chevron-down w-5 h-5 text-accent-mint transition-transform shrink-0 ${openFaqIndex === i ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"></path></svg>
                            </button>
                            {openFaqIndex === i && (
                              <div className="px-6 pb-6 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                                {item.a}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                </div>
            </section>


                        <section className="py-20 md:py-28 px-4 bg-gradient-brand text-white">
                            <div className="max-w-3xl mx-auto text-center">
                                <p className="text-lg md:text-xl font-medium opacity-95">Toda venta comienza cuando logras responder:</p>
                                <h2 className="mt-4 text-3xl md:text-5xl font-black leading-tight italic">&quot;Sí, yo tengo ese tema.&quot;</h2>
                                <p className="mt-6 text-base md:text-lg opacity-95 leading-relaxed">Crea hoy tu acervo profesional y prepárate para atender prácticamente cualquier pedido que llegue a tu WhatsApp.</p>
                                <div className="mt-10"><button onClick={(e) => { e.preventDefault(); void trackEvent('ViewContent', { section: 'Footer' }, getViewContentEventId('Footer')); document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-black text-lg px-6 py-5 rounded-full shadow-green hover:scale-[1.02] transition">QUIERO ACCEDER AL ACERVO AHORA</button></div>
                                <div
                                    className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                                    <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock w-4 h-4"
                                            aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> Acceso inmediato</div>
                                    <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shield-check w-4 h-4"
                                            aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>                                        7 días de garantía</div>
                                    <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-download w-4 h-4"
                                            aria-hidden="true"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg> 100% digital</div>
                            </div>
                            </div>
                        </section>
                        <footer className="py-8 px-4 bg-foreground text-background/70 text-center text-xs">
                            <p>©
                                2026
                                Acervo de Moldes. Todos los derechos reservados.</p>
                            <p className="mt-2">Este producto es 100% digital. No se enviará ningún producto físico.</p>
                        </footer>

                        {showUpgradeModal && (
                          <div 
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => setShowUpgradeModal(false)}
                          >
                            <div 
                              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button 
                                onClick={() => setShowUpgradeModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition"
                                aria-label="Cerrar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x w-4 h-4 text-foreground"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                              </button>
                              
                              <div className="bg-gradient-brand text-white text-center px-6 py-4">
                                <p className="text-xs font-black uppercase tracking-widest">Oferta especial de mejora</p>
                                <p className="mt-1 text-sm font-medium opacity-95">Aprovecha antes de que termine</p>
                              </div>

                              <div className="p-6 md:p-8 text-center">
                                <div className="inline-flex items-center gap-1.5 bg-accent-mint-bg text-accent-mint text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-zap w-3.5 h-3.5"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
                                  Más completo
                                </div>

                                <h3 className="mt-4 text-2xl md:text-3xl font-black leading-tight text-foreground">
                                  Por solo <span className="text-gradient-brand">US$ 3,00 más</span>, llévate el acervo Premium
                                </h3>


                                <p className="mt-3 text-muted-foreground text-sm">
                                  Cambia el básico por el <strong className="text-foreground">Paquete Premium</strong> con más de 7.500 artes editables, todos los bonos y acceso vitalicio.
                                </p>

                                <div className="mt-6 rounded-2xl bg-gradient-soft border border-border p-4 text-left">
                                  <ul className="space-y-2 text-sm">
                                    {[
                                      "Más de 7.500 artes y moldes",
                                      "Compatible con Canva, Corel y Silhouette",
                                      "Todos los bonos incluidos",
                                      "Acceso vitalicio",
                                      "7 días de garantía"
                                    ].map((feature, i) => (
                                      <li key={i} className="flex items-center gap-2 text-foreground/80">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check w-5 h-5 text-brand shrink-0"><path d="M20 6 9 17l-5-5"></path></svg>
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-3">
                                  <span className="text-sm text-muted-foreground line-through">US$ 19,99</span>
                                  <span className="text-4xl font-black text-gradient-brand">US$ 7,99</span>

                                </div>

                                <p className="text-xs text-muted-foreground">Pago único • Acceso inmediato</p>

                                <div className="mt-6 space-y-3">
                                  <a 
                                    href={withHotmartAttribution("https://pay.hotmart.com/U107293780N?off=yqt91k4v&checkoutMode=10")}
                                    onClick={async (event) => { event.preventDefault(); const href = event.currentTarget.href; const xcod = new URL(href).searchParams.get('xcod'); await Promise.race([trackEvent('InitiateCheckout', { plan: 'Premium_Upgrade', value: 7.99, currency: 'USD', content_ids: ['premium_upgrade'], content_type: 'product', hotmart_xcod: xcod }, getCheckoutEventId('Premium_Upgrade')), new Promise((resolve) => setTimeout(resolve, 300))]); window.open(href, '_blank', 'noopener'); }}
                                    target="_blank" 
                                    rel="noopener"
                                    className="flex w-full justify-center items-center gap-2 bg-gradient-green text-white font-black text-base px-6 py-4 rounded-full shadow-green hover:scale-[1.02] transition-transform"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-zap w-5 h-5"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
                                    SÍ, QUIERO EL PREMIUM POR US$ 7,99
                                  </a>

                                  <a 
                                    href={withHotmartAttribution("https://pay.hotmart.com/K107291679I?checkoutMode=10")}
                                    onClick={async (event) => { event.preventDefault(); const href = event.currentTarget.href; const xcod = new URL(href).searchParams.get('xcod'); await Promise.race([trackEvent('InitiateCheckout', { plan: 'Basic', value: 4.99, currency: 'USD', content_ids: ['basic'], content_type: 'product', hotmart_xcod: xcod }, getCheckoutEventId('Basic')), new Promise((resolve) => setTimeout(resolve, 300))]); window.open(href, '_blank', 'noopener'); }}
                                    target="_blank" 
                                    rel="noopener"
                                    className="inline-block text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                                  >
                                    No, quiero continuar con el básico por US$ 4,99
                                  </a>

                                </div>
                              </div>
                            </div>
                          </div>
                        )}
        </div>
    </div>
  );
}
