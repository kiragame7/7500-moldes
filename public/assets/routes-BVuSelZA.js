import {
    n as e,
    r as t,
    t as n
} from "./index-GPbydzP9.js";
var r = (...e) => e.filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t).join(` `).trim(),
    i = e => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase(),
    a = e => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()),
    o = e => {
        let t = a(e);
        return t.charAt(0).toUpperCase() + t.slice(1)
    },
    s = {
        xmlns: `http://www.w3.org/2000/svg`,
        width: 24,
        height: 24,
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        strokeWidth: 2,
        strokeLinecap: `round`,
        strokeLinejoin: `round`
    },
    ee = e => {
        for (let t in e)
            if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
        return !1
    },
    c = t(e()),
    l = (0, c.forwardRef)(({
        color: e = `currentColor`,
        size: t = 24,
        strokeWidth: n = 2,
        absoluteStrokeWidth: i,
        className: a = ``,
        children: o,
        iconNode: l,
        ...u
    }, d) => (0, c.createElement)(`svg`, {
        ref: d,
        ...s,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: i ? Number(n) * 24 / Number(t) : n,
        className: r(`lucide`, a),
        ...!o && !ee(u) && {
            "aria-hidden": `true`
        },
        ...u
    }, [...l.map(([e, t]) => (0, c.createElement)(e, t)), ...Array.isArray(o) ? o : [o]])),
    u = (e, t) => {
        let n = (0, c.forwardRef)(({
            className: n,
            ...a
        }, s) => (0, c.createElement)(l, {
            ref: s,
            iconNode: t,
            className: r(`lucide-${i(o(e))}`, `lucide-${e}`, n),
            ...a
        }));
        return n.displayName = o(e), n
    },
    d = u(`chevron-down`, [
        [`path`, {
            d: `m6 9 6 6 6-6`,
            key: `qrunsl`
        }]
    ]),
    f = u(`circle-check`, [
        [`circle`, {
            cx: `12`,
            cy: `12`,
            r: `10`,
            key: `1mglay`
        }],
        [`path`, {
            d: `m9 12 2 2 4-4`,
            key: `dzmm74`
        }]
    ]),
    p = u(`circle-x`, [
        [`circle`, {
            cx: `12`,
            cy: `12`,
            r: `10`,
            key: `1mglay`
        }],
        [`path`, {
            d: `m15 9-6 6`,
            key: `1uzhvr`
        }],
        [`path`, {
            d: `m9 9 6 6`,
            key: `z0biqf`
        }]
    ]),
    m = u(`clock`, [
        [`circle`, {
            cx: `12`,
            cy: `12`,
            r: `10`,
            key: `1mglay`
        }],
        [`path`, {
            d: `M12 6v6l4 2`,
            key: `mmk7yg`
        }]
    ]),
    h = u(`crown`, [
        [`path`, {
            d: `M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z`,
            key: `1vdc57`
        }],
        [`path`, {
            d: `M5 21h14`,
            key: `11awu3`
        }]
    ]),
    g = u(`download`, [
        [`path`, {
            d: `M12 15V3`,
            key: `m9g1x1`
        }],
        [`path`, {
            d: `M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,
            key: `ih7n3h`
        }],
        [`path`, {
            d: `m7 10 5 5 5-5`,
            key: `brsn70`
        }]
    ]),
    _ = u(`file-text`, [
        [`path`, {
            d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
            key: `1oefj6`
        }],
        [`path`, {
            d: `M14 2v5a1 1 0 0 0 1 1h5`,
            key: `wfsgrz`
        }],
        [`path`, {
            d: `M10 9H8`,
            key: `b1mrlr`
        }],
        [`path`, {
            d: `M16 13H8`,
            key: `t4e002`
        }],
        [`path`, {
            d: `M16 17H8`,
            key: `z1uh3a`
        }]
    ]),
    v = u(`gift`, [
        [`path`, {
            d: `M12 7v14`,
            key: `1akyts`
        }],
        [`path`, {
            d: `M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8`,
            key: `1sqzm4`
        }],
        [`path`, {
            d: `M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5`,
            key: `kc0143`
        }],
        [`rect`, {
            x: `3`,
            y: `7`,
            width: `18`,
            height: `4`,
            rx: `1`,
            key: `1hberx`
        }]
    ]),
    y = u(`pen-tool`, [
        [`path`, {
            d: `M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z`,
            key: `nt11vn`
        }],
        [`path`, {
            d: `m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18`,
            key: `15qc1e`
        }],
        [`path`, {
            d: `m2.3 2.3 7.286 7.286`,
            key: `1wuzzi`
        }],
        [`circle`, {
            cx: `11`,
            cy: `11`,
            r: `2`,
            key: `xmgehs`
        }]
    ]),
    b = u(`play`, [
        [`path`, {
            d: `M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z`,
            key: `10ikf1`
        }]
    ]),
    te = u(`printer`, [
        [`path`, {
            d: `M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2`,
            key: `143wyd`
        }],
        [`path`, {
            d: `M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6`,
            key: `1itne7`
        }],
        [`rect`, {
            x: `6`,
            y: `14`,
            width: `12`,
            height: `8`,
            rx: `1`,
            key: `1ue0tg`
        }]
    ]),
    x = u(`search`, [
        [`path`, {
            d: `m21 21-4.34-4.34`,
            key: `14j7rj`
        }],
        [`circle`, {
            cx: `11`,
            cy: `11`,
            r: `8`,
            key: `4ej97u`
        }]
    ]),
    S = u(`shield-check`, [
        [`path`, {
            d: `M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,
            key: `oel41y`
        }],
        [`path`, {
            d: `m9 12 2 2 4-4`,
            key: `dzmm74`
        }]
    ]),
    ne = u(`smartphone`, [
        [`rect`, {
            width: `14`,
            height: `20`,
            x: `5`,
            y: `2`,
            rx: `2`,
            ry: `2`,
            key: `1yt0o3`
        }],
        [`path`, {
            d: `M12 18h.01`,
            key: `mhygvu`
        }]
    ]),
    C = u(`sparkles`, [
        [`path`, {
            d: `M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,
            key: `1s2grr`
        }],
        [`path`, {
            d: `M20 2v4`,
            key: `1rf3ol`
        }],
        [`path`, {
            d: `M22 4h-4`,
            key: `gwowj6`
        }],
        [`circle`, {
            cx: `4`,
            cy: `20`,
            r: `2`,
            key: `6kqj1y`
        }]
    ]),
    w = u(`star`, [
        [`path`, {
            d: `M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z`,
            key: `r04s7s`
        }]
    ]),
    T = u(`x`, [
        [`path`, {
            d: `M18 6 6 18`,
            key: `1bl5f8`
        }],
        [`path`, {
            d: `m6 6 12 12`,
            key: `d8bk6v`
        }]
    ]),
    E = u(`zap`, [
        [`path`, {
            d: `M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z`,
            key: `1xq2db`
        }]
    ]),
    D = {
        version: 1,
        asset_id: `3dea6674-3493-4887-8a37-6c0468a794db`,
        project_id: `5016f5ee-2497-43ad-8e1d-9c51cb507b8f`,
        url: `/__l5e/assets-v1/3dea6674-3493-4887-8a37-6c0468a794db/hero-mockup.png`,
        r2_key: `a/v1/5016f5ee-2497-43ad-8e1d-9c51cb507b8f/3dea6674-3493-4887-8a37-6c0468a794db/hero-mockup.png`,
        original_filename: `hero-mockup.png`,
        size: 2570273,
        content_type: `image/png`,
        created_at: `2026-07-18T03:37:36Z`
    },
    O = `/assets/kit-infantil-B8-OF8XV.webp`,
    k = `/assets/kit-adulto-29CDo1ka.webp`,
    A = `/assets/convites-CdZN-1nQ.webp`,
    j = `/assets/caixas-Dz_X9ztD.webp`,
    M = `/assets/sacolinhas-DavjCciZ.webp`,
    N = `/assets/tubetes-Bi1xO-HX.webp`,
    P = `/assets/topos-B1K_85-1.webp`,
    F = `/assets/toppers-Badg83HN.webp`,
    I = `/assets/rotulos-E8WG0Yxv.webp`,
    L = `/assets/bandeirolas-Cj-cazMZ.webp`,
    R = `/assets/etiquetas-DP121LHR.webp`,
    z = `/assets/step1-DDgFXI8r.png`,
    B = `/assets/step2-CUBoFAqM.png`,
    V = `/assets/step3-Ctesdp7S.png`,
    H = `/assets/dep1-DSnUMMTv.jpeg`,
    U = `/assets/dep2-DhUsClRG.jpeg`,
    W = `/assets/dep3-DVpL1Bx4.jpeg`,
    G = `/assets/dep4-B1P8ZZrG.jpeg`,
    K = {
        version: 1,
        asset_id: `72f91bf3-9607-40b3-be9b-a3a2804055ab`,
        project_id: `5016f5ee-2497-43ad-8e1d-9c51cb507b8f`,
        url: `/__l5e/assets-v1/72f91bf3-9607-40b3-be9b-a3a2804055ab/whatsapp-pedidos.png`,
        r2_key: `a/v1/5016f5ee-2497-43ad-8e1d-9c51cb507b8f/72f91bf3-9607-40b3-be9b-a3a2804055ab/whatsapp-pedidos.png`,
        original_filename: `whatsapp-pedidos.png`,
        size: 1333943,
        content_type: `image/png`,
        created_at: `2026-07-18T03:34:57Z`
    },
    q = n(),
    J = [{
        img: O,
        label: `Kit Festa Infantil`
    }, {
        img: k,
        label: `Kit Festa Adulto`
    }, {
        img: A,
        label: `Convites`
    }, {
        img: P,
        label: `Topo de Bolo`
    }, {
        img: j,
        label: `Caixa Milk`
    }, {
        img: N,
        label: `Tubetes`
    }, {
        img: M,
        label: `Sacolinhas`
    }, {
        img: L,
        label: `Bandeirolas`
    }, {
        img: I,
        label: `Rótulos`
    }, {
        img: R,
        label: `Lembrancinhas`
    }, {
        img: F,
        label: `Topper`
    }, {
        img: O,
        label: `Muito mais...`
    }],
    Y = [`Quem já vende personalizados`, `Quem recebe pedidos todos os dias`, `Quem trabalha pelo WhatsApp`, `Quem quer responder clientes rapidamente`, `Quem quer aumentar as vendas`, `Quem quer montar um grande acervo profissional`],
    X = [{
        n: `1`,
        title: `ENCONTRE O TEMA`,
        desc: `Pesquise entre milhares de modelos organizados.`,
        badge: `MILHARES DE TEMAS`,
        img: z
    }, {
        n: `2`,
        title: `EDITE EM MINUTOS`,
        desc: `Abra no Canva, CorelDraw ou Silhouette Studio.`,
        badge: `PRONTO PARA EDITAR`,
        img: B
    }, {
        n: `3`,
        title: `IMPRIMA E VENDA`,
        desc: `Produza o pedido e entregue ao cliente.`,
        badge: `COMECE A FATURAR`,
        img: V
    }],
    Z = [G, U, W, H],
    Q = [{
        icon: _,
        title: `Arquivos organizados`
    }, {
        icon: C,
        title: `Milhares de temas`
    }, {
        icon: E,
        title: `Atualizações`
    }, {
        icon: f,
        title: `Compatível com programas populares`
    }, {
        icon: v,
        title: `Ideal para uso profissional`
    }, {
        icon: g,
        title: `Produto digital • Acesso imediato`
    }],
    re = [{
        title: `Convites Editáveis`,
        desc: `Modelos prontos para personalizar`
    }, {
        title: `8.000 Caixinhas`,
        desc: `Variedade de temas e formatos`
    }, {
        title: `1.500 Topos`,
        desc: `Prontos para imprimir`
    }, {
        title: `Kit Festa Adulto`,
        desc: `Temas exclusivos para adultos`
    }, {
        title: `Guia Organização`,
        desc: `Organize seus arquivos e pedidos`
    }, {
        title: `360 mil arquivos`,
        desc: `Acervo extra gigante`
    }],
    ie = [{
        q: `Posso usar os moldes para vender personalizados?`,
        a: `Sim. Você pode usar os arquivos para montar produtos físicos personalizados para seus clientes, como kits, convites, caixinhas, toppers e lembrancinhas.`
    }, {
        q: `Tem vários temas disponíveis?`,
        a: `Sim. O pacote reúne uma grande variedade de temas e categorias para facilitar sua produção e aumentar suas opções de atendimento.`
    }, {
        q: `Funciona no Canva?`,
        a: `Parte dos materiais é compatível com Canva, além de arquivos para CorelDraw e Silhouette Studio. Na descrição do pacote Premium, destacamos essa compatibilidade.`
    }, {
        q: `Preciso saber design?`,
        a: `Não precisa criar do zero. Os modelos já vêm prontos para usar como base. Você pode editar e adaptar conforme o pedido, quando o arquivo for editável.`
    }, {
        q: `Recebo o acesso quando?`,
        a: `O acesso é liberado após a confirmação do pagamento e enviado para o e-mail cadastrado.`
    }, {
        q: `É produto físico?`,
        a: `Não. É um produto 100% digital. Você recebe os arquivos para baixar, editar, imprimir e usar na sua produção.`
    }, {
        q: `Tem garantia?`,
        a: `Sim. Você tem 7 dias de garantia, conforme informado na página.`
    }, {
        q: `Serve para quem está começando?`,
        a: `Sim. O pacote ajuda quem está começando porque evita que você precise criar todos os modelos do zero.`
    }, {
        q: `Serve para quem já trabalha com papelaria?`,
        a: `Sim. O objetivo é justamente ampliar seu acervo e dar mais velocidade para atender pedidos variados.`
    }];

function ae() {
    let [e, t] = (0, c.useState)(!1);
    return (0, q.jsxs)(`div`, {
        className: `min-h-screen bg-background overflow-x-hidden`,
        children: [(0, q.jsx)(oe, {}), (0, q.jsx)(se, {}), (0, q.jsx)(ce, {}), (0, q.jsx)(le, {}), (0, q.jsx)(ue, {}), (0, q.jsx)(de, {}), (0, q.jsx)(fe, {}), (0, q.jsx)(pe, {}), (0, q.jsx)($, {
            onOpenUpgrade: () => t(!0)
        }), (0, q.jsx)(me, {}), (0, q.jsx)(he, {}), (0, q.jsx)(ge, {}), (0, q.jsx)(_e, {}), (0, q.jsx)(ve, {}), e && (0, q.jsx)(ye, {
            onClose: () => t(!1)
        })]
    })
}

function oe() {
    return (0, q.jsxs)(`div`, {
        className: `bg-gradient-brand text-white text-center text-xs sm:text-sm font-semibold py-2.5 px-4 flex flex-wrap items-center justify-center gap-2`,
        children: [(0, q.jsx)(E, {
            className: `w-4 h-4 fill-white`
        }), (0, q.jsxs)(`span`, {
            className: `inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-2.5 py-0.5`,
            children: [(0, q.jsx)(`span`, {
                className: `w-2 h-2 rounded-full bg-accent-mint animate-pulse`
            }), `OFERTA VÁLIDA SOMENTE HOJE (17/07/2026)`]
        }), (0, q.jsx)(E, {
            className: `w-4 h-4 fill-white`
        })]
    })
}

function se() {
    return (0, q.jsx)(`section`, {
        className: `bg-gradient-hero pt-12 md:pt-20 pb-16 md:pb-24 px-4`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-4xl mx-auto text-center`,
            children: [(0, q.jsxs)(`div`, {
                className: `inline-flex items-center gap-2 bg-accent-mint-bg backdrop-blur border border-accent-mint/30 rounded-full px-4 py-1.5 text-sm font-medium text-foreground shadow-sm`,
                children: [(0, q.jsx)(`span`, {
                    className: `w-7 h-7 rounded-full bg-gradient-mint flex items-center justify-center`,
                    children: (0, q.jsx)(_, {
                        className: `w-4 h-4 text-white`
                    })
                }), `Acervo Profissional de Moldes`]
            }), (0, q.jsxs)(`h1`, {
                className: `mt-6 text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] text-foreground`,
                children: [`Tenha acesso a um `, (0, q.jsx)(`span`, {
                    className: `text-gradient-brand italic`,
                    children: `acervo profissional`
                }), ` com milhares de moldes prontos para responder qualquer cliente em poucos minutos`]
            }), (0, q.jsxs)(`p`, {
                className: `mt-6 md:mt-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed`,
                children: [`Mais de `, (0, q.jsx)(`strong`, {
                    className: `text-foreground`,
                    children: `7.500 artes e moldes editáveis`
                }), `, compatíveis com Canva, CorelDraw e Silhouette Studio.`]
            }), (0, q.jsx)(`div`, {
                className: `mt-10 md:mt-12`,
                children: (0, q.jsx)(`div`, {
                    className: `relative mx-auto max-w-3xl`,
                    children: (0, q.jsx)(`img`, {
                        src: D.url,
                        alt: `Acervo de moldes para papelaria personalizada mostrado em notebook, tablet e celular`,
                        width: 1600,
                        height: 900,
                        className: `w-full rounded-3xl shadow-card`
                    })
                })
            }), (0, q.jsxs)(`div`, {
                className: `mt-10`,
                children: [(0, q.jsxs)(`a`, {
                    href: `#oferta`,
                    className: `inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-bold text-base md:text-lg px-6 py-4 md:px-10 md:py-5 rounded-full shadow-green hover:scale-[1.02] transition-transform`,
                    children: [(0, q.jsx)(b, {
                        className: `w-5 h-5 fill-white`
                    }), `QUERO RECEBER O ACERVO COMPLETO`]
                }), (0, q.jsx)(`p`, {
                    className: `mt-4 text-sm text-muted-foreground`,
                    children: `Acesso imediato • Produto digital • Pix ou Cartão`
                })]
            })]
        })
    })
}

function ce() {
    return (0, q.jsx)(`section`, {
        className: `py-12 px-4 border-y border-border bg-white`,
        children: (0, q.jsx)(`div`, {
            className: `max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4`,
            children: [{
                icon: _,
                value: `7.500+`,
                label: `arquivos profissionais`
            }, {
                icon: f,
                value: `3`,
                label: `programas compatíveis`
            }, {
                icon: C,
                value: `12+`,
                label: `categorias organizadas`
            }, {
                icon: S,
                value: `0s`,
                label: `acesso imediato`
            }].map((e, t) => (0, q.jsxs)(`div`, {
                className: `relative overflow-hidden rounded-2xl bg-gradient-soft p-5 border border-border shadow-card flex flex-col items-center text-center gap-3`,
                children: [(0, q.jsx)(`div`, {
                    className: `w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-cta`,
                    children: (0, q.jsx)(e.icon, {
                        className: `w-6 h-6 text-white shrink-0`
                    })
                }), (0, q.jsxs)(`div`, {
                    children: [(0, q.jsx)(`p`, {
                        className: `text-2xl font-black text-gradient-brand`,
                        children: e.value
                    }), (0, q.jsx)(`p`, {
                        className: `text-xs font-medium text-muted-foreground leading-tight`,
                        children: e.label
                    })]
                })]
            }, t))
        })
    })
}

function le() {
    let e = [{
        icon: ne,
        title: `Responda rápido`,
        desc: `Responda qualquer pedido em minutos`
    }, {
        icon: x,
        title: `Milhares de temas`,
        desc: `Encontre o personagem ou ocasião ideal`
    }, {
        icon: y,
        title: `Edite fácil`,
        desc: `Abra no Canva, Corel ou Silhouette`
    }, {
        icon: te,
        title: `Produza mais`,
        desc: `Imprima e venda no mesmo dia`
    }, {
        icon: S,
        title: `Segurança`,
        desc: `Trabalhe com um acervo completo`
    }];
    return (0, q.jsx)(`section`, {
        className: `py-16 md:py-24 px-4 bg-gradient-soft`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-3xl mx-auto`,
            children: [(0, q.jsx)(`p`, {
                className: `text-center text-sm font-semibold uppercase tracking-widest text-brand`,
                children: `O problema de quem trabalha com personalizados`
            }), (0, q.jsx)(`h2`, {
                className: `mt-4 text-3xl md:text-5xl font-black text-center leading-tight`,
                children: `Imagine receber esses pedidos no WhatsApp`
            }), (0, q.jsx)(`div`, {
                className: `mt-10 max-w-md mx-auto rounded-3xl border border-border shadow-card overflow-hidden bg-white`,
                children: (0, q.jsx)(`img`, {
                    src: K.url,
                    alt: `Print de conversa do WhatsApp com pedidos de clientes: Stitch, Sonic, caixa milk e outros personagens`,
                    width: 800,
                    height: 1600,
                    className: `w-full h-auto`,
                    loading: `lazy`
                })
            }), (0, q.jsxs)(`div`, {
                className: `mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto`,
                children: [(0, q.jsxs)(`div`, {
                    className: `rounded-2xl border border-border bg-white p-5 shadow-card text-center`,
                    children: [(0, q.jsx)(`div`, {
                        className: `w-10 h-10 mx-auto rounded-full bg-red-50 flex items-center justify-center`,
                        children: (0, q.jsx)(p, {
                            className: `w-5 h-5 text-red-500`
                        })
                    }), (0, q.jsx)(`p`, {
                        className: `mt-3 font-bold text-foreground`,
                        children: `Sem acervo`
                    }), (0, q.jsx)(`p`, {
                        className: `mt-1 text-sm text-muted-foreground`,
                        children: `Perde tempo, cria do zero ou perde a venda.`
                    })]
                }), (0, q.jsx)(`div`, {
                    className: `rounded-2xl border-2 border-transparent bg-white shadow-cta overflow-hidden`,
                    style: {
                        backgroundImage: `linear-gradient(white, white), var(--gradient-brand)`,
                        backgroundOrigin: `border-box`,
                        backgroundClip: `padding-box, border-box`
                    },
                    children: (0, q.jsxs)(`div`, {
                        className: `p-5 text-center`,
                        children: [(0, q.jsx)(`div`, {
                            className: `w-10 h-10 mx-auto rounded-full bg-gradient-brand flex items-center justify-center`,
                            children: (0, q.jsx)(f, {
                                className: `w-5 h-5 text-white`
                            })
                        }), (0, q.jsx)(`p`, {
                            className: `mt-3 font-bold text-foreground`,
                            children: `Com acervo`
                        }), (0, q.jsx)(`p`, {
                            className: `mt-1 text-sm text-muted-foreground`,
                            children: `Responde em minutos e fecha mais pedidos.`
                        })]
                    })
                })]
            }), (0, q.jsxs)(`h3`, {
                className: `mt-14 text-2xl md:text-4xl font-black text-center leading-tight`,
                children: [`Chega de dizer `, (0, q.jsx)(`span`, {
                    className: `text-gradient-brand italic`,
                    children: `"não tenho esse tema"`
                })]
            }), (0, q.jsx)(`p`, {
                className: `mt-4 text-center text-muted-foreground max-w-xl mx-auto`,
                children: `Este acervo foi criado para quem quer trabalhar com mais rapidez e atender praticamente qualquer pedido que aparecer.`
            }), (0, q.jsx)(`div`, {
                className: `mt-10 -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`,
                children: e.map((e, t) => (0, q.jsxs)(`div`, {
                    className: `snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] bg-white rounded-2xl p-5 border border-border shadow-card flex flex-col items-center text-center gap-3`,
                    children: [(0, q.jsx)(`div`, {
                        className: `w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center`,
                        children: (0, q.jsx)(e.icon, {
                            className: `w-6 h-6 text-white`
                        })
                    }), (0, q.jsxs)(`div`, {
                        children: [(0, q.jsx)(`p`, {
                            className: `font-bold text-foreground`,
                            children: e.title
                        }), (0, q.jsx)(`p`, {
                            className: `text-xs text-muted-foreground mt-0.5`,
                            children: e.desc
                        })]
                    })]
                }, t))
            }), (0, q.jsx)(`div`, {
                className: `mt-10 text-center`,
                children: (0, q.jsx)(`a`, {
                    href: `#oferta`,
                    className: `inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-bold px-6 py-4 rounded-full shadow-green`,
                    children: `QUERO TER ESSE ACERVO`
                })
            })]
        })
    })
}

function ue() {
    return (0, q.jsx)(`section`, {
        className: `py-16 md:py-24 px-4 bg-white`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-6xl mx-auto`,
            children: [(0, q.jsx)(`div`, {
                className: `text-center max-w-2xl mx-auto`,
                children: (0, q.jsx)(`h2`, {
                    className: `text-3xl md:text-5xl font-black leading-tight`,
                    children: `Veja alguns arquivos disponíveis`
                })
            }), (0, q.jsx)(`div`, {
                className: `mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6`,
                children: J.map((e, t) => (0, q.jsxs)(`div`, {
                    className: `group relative overflow-hidden rounded-2xl bg-white border border-border shadow-card hover:shadow-cta transition-shadow`,
                    children: [(0, q.jsx)(`div`, {
                        className: `aspect-square overflow-hidden`,
                        children: (0, q.jsx)(`img`, {
                            src: e.img,
                            alt: e.label,
                            loading: `lazy`,
                            className: `w-full h-full object-cover group-hover:scale-105 transition-transform duration-500`
                        })
                    }), (0, q.jsx)(`h3`, {
                        className: `p-4 font-bold text-foreground text-center`,
                        children: e.label
                    })]
                }, t))
            }), (0, q.jsx)(`div`, {
                className: `mt-12 text-center`,
                children: (0, q.jsx)(`a`, {
                    href: `#oferta`,
                    className: `inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-bold px-6 py-4 rounded-full shadow-green`,
                    children: `VER TODO O ACERVO`
                })
            })]
        })
    })
}

function de() {
    let e = (0, c.useRef)(null),
        [t, n] = (0, c.useState)(0),
        [r, i] = (0, c.useState)(!1),
        a = Y.length;
    return (0, c.useEffect)(() => {
        if (r) return;
        let e = setInterval(() => {
            n(e => (e + 1) % a)
        }, 2500);
        return () => clearInterval(e)
    }, [r, a]), (0, c.useEffect)(() => {
        let n = e.current;
        if (!n) return;
        let r = n.children[t];
        r && n.scrollTo({
            left: r.offsetLeft - n.offsetLeft,
            behavior: `smooth`
        })
    }, [t]), (0, q.jsx)(`section`, {
        className: `py-16 md:py-24 px-4 bg-gradient-soft`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-4xl mx-auto`,
            children: [(0, q.jsx)(`h2`, {
                className: `text-3xl md:text-5xl font-black text-center leading-tight`,
                children: `Para quem esse material foi criado`
            }), (0, q.jsx)(`div`, {
                ref: e,
                onMouseEnter: () => i(!0),
                onMouseLeave: () => i(!1),
                className: `mt-10 -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`,
                children: Y.map((e, r) => (0, q.jsxs)(`div`, {
                    onClick: () => n(r),
                    className: `snap-center shrink-0 w-[75%] sm:w-[45%] lg:w-[30%] flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-5 border border-border shadow-card transition-transform cursor-pointer ${r===t?`scale-[1.02]`:``}`,
                    children: [(0, q.jsx)(`div`, {
                        className: `w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shrink-0`,
                        children: (0, q.jsx)(f, {
                            className: `w-5 h-5 text-white`
                        })
                    }), (0, q.jsx)(`p`, {
                        className: `text-foreground font-medium`,
                        children: e
                    })]
                }, r))
            }), (0, q.jsx)(`div`, {
                className: `mt-6 flex justify-center gap-2`,
                children: Y.map((e, r) => (0, q.jsx)(`button`, {
                    onClick: () => n(r),
                    className: `w-2.5 h-2.5 rounded-full transition-colors ${r===t?`bg-brand`:`bg-brand/25`}`,
                    "aria-label": `Ir para slide ${r+1}`
                }, r))
            })]
        })
    })
}

function fe() {
    return (0, q.jsx)(`section`, {
        className: `py-16 md:py-24 px-4 bg-white`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-6xl mx-auto text-center`,
            children: [(0, q.jsxs)(`div`, {
                className: `inline-flex items-center gap-2 text-accent-mint font-semibold`,
                children: [(0, q.jsx)(C, {
                    className: `w-4 h-4`
                }), ` Passo a Passo `, (0, q.jsx)(C, {
                    className: `w-4 h-4`
                })]
            }), (0, q.jsx)(`h2`, {
                className: `mt-3 text-3xl md:text-5xl font-black`,
                children: `COMO FUNCIONA`
            }), (0, q.jsx)(`div`, {
                className: `mt-14 grid md:grid-cols-3 gap-8`,
                children: X.map((e, t) => (0, q.jsxs)(`div`, {
                    className: `relative bg-gradient-soft rounded-3xl p-8 pt-10 border border-border shadow-card`,
                    children: [(0, q.jsx)(`div`, {
                        className: `absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-mint text-white text-2xl font-black flex items-center justify-center shadow-mint`,
                        children: e.n
                    }), (0, q.jsx)(`div`, {
                        className: `rounded-2xl overflow-hidden aspect-[4/3] bg-white mt-4`,
                        children: (0, q.jsx)(`img`, {
                            src: e.img,
                            alt: e.title,
                            loading: `lazy`,
                            className: `w-full h-full object-cover`
                        })
                    }), (0, q.jsxs)(`div`, {
                        className: `mt-6 text-center`,
                        children: [(0, q.jsx)(`div`, {
                            className: `text-xs font-bold text-accent-mint tracking-wider`,
                            children: e.badge
                        }), (0, q.jsx)(`h3`, {
                            className: `mt-2 text-2xl font-black`,
                            children: e.title
                        }), (0, q.jsx)(`p`, {
                            className: `mt-3 text-muted-foreground`,
                            children: e.desc
                        })]
                    })]
                }, t))
            })]
        })
    })
}

function pe() {
    let e = (0, c.useRef)(null),
        [t, n] = (0, c.useState)(0),
        [r, i] = (0, c.useState)(!1),
        a = Q.length;
    return (0, c.useEffect)(() => {
        if (r) return;
        let e = setInterval(() => {
            n(e => (e + 1) % a)
        }, 2500);
        return () => clearInterval(e)
    }, [r, a]), (0, c.useEffect)(() => {
        let n = e.current;
        if (!n) return;
        let r = n.children[t];
        r && n.scrollTo({
            left: r.offsetLeft - n.offsetLeft,
            behavior: `smooth`
        })
    }, [t]), (0, q.jsx)(`section`, {
        className: `py-16 md:py-24 px-4 bg-gradient-soft`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-5xl mx-auto`,
            children: [(0, q.jsx)(`h2`, {
                className: `text-3xl md:text-5xl font-black text-center leading-tight`,
                children: `O que torna esse acervo diferente`
            }), (0, q.jsx)(`div`, {
                ref: e,
                onMouseEnter: () => i(!0),
                onMouseLeave: () => i(!1),
                className: `mt-12 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`,
                children: Q.map((e, t) => (0, q.jsxs)(`div`, {
                    className: `snap-center shrink-0 w-[80%] sm:w-[50%] lg:w-[33.333%] bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col items-center text-center gap-3`,
                    children: [(0, q.jsx)(`div`, {
                        className: `w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0`,
                        children: (0, q.jsx)(e.icon, {
                            className: `w-6 h-6 text-white`
                        })
                    }), (0, q.jsx)(`p`, {
                        className: `font-semibold text-foreground`,
                        children: e.title
                    })]
                }, t))
            }), (0, q.jsx)(`div`, {
                className: `mt-6 flex justify-center gap-2`,
                children: Q.map((e, r) => (0, q.jsx)(`button`, {
                    "aria-label": `Ir para item ${r+1}`,
                    onClick: () => n(r),
                    className: `w-2.5 h-2.5 rounded-full transition-all ${r===t?`bg-gradient-brand w-6`:`bg-brand/30`}`
                }, r))
            })]
        })
    })
}

function $({
    onOpenUpgrade: e
}) {
    return (0, q.jsx)(`section`, {
        id: `oferta`,
        className: `py-16 md:py-24 px-4 bg-white`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-5xl mx-auto text-center`,
            children: [(0, q.jsx)(`p`, {
                className: `text-sm font-semibold uppercase tracking-widest text-brand`,
                children: `Oferta Especial`
            }), (0, q.jsx)(`h2`, {
                className: `mt-3 text-3xl md:text-5xl font-black`,
                children: `Escolha o pacote ideal para você`
            }), (0, q.jsxs)(`div`, {
                className: `mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-center`,
                children: [(0, q.jsxs)(`div`, {
                    className: `relative rounded-3xl border-2 border-transparent bg-white shadow-cta overflow-hidden`,
                    style: {
                        backgroundImage: `linear-gradient(white, white), var(--gradient-brand)`,
                        backgroundOrigin: `border-box`,
                        backgroundClip: `padding-box, border-box`
                    },
                    children: [(0, q.jsxs)(`div`, {
                        className: `bg-gradient-mint text-white text-center text-xs font-black tracking-widest py-2 flex items-center justify-center gap-2 shadow-mint`,
                        children: [(0, q.jsx)(h, {
                            className: `w-4 h-4`
                        }), ` MAIS COMPLETO`]
                    }), (0, q.jsxs)(`div`, {
                        className: `p-6 md:p-8`,
                        children: [(0, q.jsx)(`h3`, {
                            className: `text-2xl font-black`,
                            children: `Pacote Premium`
                        }), (0, q.jsx)(`div`, {
                            className: `mt-6 flex items-baseline justify-center gap-2`,
                            children: (0, q.jsx)(`span`, {
                                className: `text-5xl font-black text-gradient-brand`,
                                children: `R$19,90`
                            })
                        }), (0, q.jsx)(`ul`, {
                            className: `mt-6 space-y-3 inline-block text-left mx-auto`,
                            children: [`Mais de 7.500 artes`, `Canva`, `Corel`, `Silhouette`, `Editáveis`, `Convites`, `Topos`, `Caixinhas`, `Temas variados`, `Todos os bônus`, `360 mil arquivos`, `Vitalício`].map((e, t) => (0, q.jsxs)(`li`, {
                                className: `flex items-center gap-2 text-sm`,
                                children: [(0, q.jsx)(f, {
                                    className: `w-5 h-5 text-brand shrink-0`
                                }), (0, q.jsx)(`span`, {
                                    children: e
                                })]
                            }, t))
                        }), (0, q.jsx)(`a`, {
                            href: `https://pay.wiapy.com/9RRPPHsn5Nf`,
                            target: `_blank`,
                            rel: `noopener`,
                            className: `mt-8 inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-black px-6 py-4 rounded-full shadow-green hover:scale-[1.02] transition-transform`,
                            children: `QUERO O PREMIUM`
                        }), (0, q.jsx)(`p`, {
                            className: `mt-4 text-center text-xs text-muted-foreground`,
                            children: `Acesso imediato • Produto digital • Pix ou Cartão`
                        })]
                    })]
                }), (0, q.jsxs)(`div`, {
                    className: `rounded-3xl border border-border bg-white shadow-card overflow-hidden`,
                    children: [(0, q.jsx)(`div`, {
                        className: `bg-muted text-muted-foreground text-center text-xs font-bold tracking-widest py-2`,
                        children: `OPÇÃO SIMPLES`
                    }), (0, q.jsxs)(`div`, {
                        className: `p-6 md:p-8`,
                        children: [(0, q.jsx)(`h3`, {
                            className: `text-2xl font-black`,
                            children: `Pacote Básico`
                        }), (0, q.jsx)(`div`, {
                            className: `mt-6 flex items-baseline justify-center gap-2`,
                            children: (0, q.jsx)(`span`, {
                                className: `text-5xl font-black text-foreground`,
                                children: `R$10,00`
                            })
                        }), (0, q.jsxs)(`ul`, {
                            className: `mt-6 space-y-3 text-sm inline-block text-left mx-auto`,
                            children: [(0, q.jsxs)(`li`, {
                                className: `flex items-center gap-2`,
                                children: [(0, q.jsx)(f, {
                                    className: `w-5 h-5 text-brand shrink-0`
                                }), (0, q.jsx)(`span`, {
                                    children: `Kit Festa pronto`
                                })]
                            }), (0, q.jsxs)(`li`, {
                                className: `flex items-center gap-2`,
                                children: [(0, q.jsx)(f, {
                                    className: `w-5 h-5 text-brand shrink-0`
                                }), (0, q.jsx)(`span`, {
                                    children: `Garantia`
                                })]
                            }), (0, q.jsxs)(`li`, {
                                className: `flex items-center gap-2`,
                                children: [(0, q.jsx)(f, {
                                    className: `w-5 h-5 text-brand shrink-0`
                                }), (0, q.jsx)(`span`, {
                                    children: `Acesso imediato`
                                })]
                            }), (0, q.jsxs)(`li`, {
                                className: `flex items-center gap-2 opacity-50`,
                                children: [(0, q.jsx)(p, {
                                    className: `w-5 h-5 shrink-0`
                                }), (0, q.jsx)(`span`, {
                                    children: `Sem bônus`
                                })]
                            })]
                        }), (0, q.jsx)(`button`, {
                            onClick: e,
                            className: `mt-8 w-full border-2 border-foreground text-foreground font-bold px-6 py-4 rounded-full hover:bg-foreground hover:text-background transition text-center`,
                            children: `QUERO O BÁSICO`
                        })]
                    })]
                })]
            })]
        })
    })
}

function me() {
    return (0, q.jsx)(`section`, {
        className: `py-16 md:py-24 px-4 bg-gradient-soft`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-5xl mx-auto`,
            children: [(0, q.jsx)(`h2`, {
                className: `text-3xl md:text-5xl font-black text-center leading-tight`,
                children: `Quem já usa`
            }), (0, q.jsx)(`div`, {
                className: `mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5`,
                children: Z.map((e, t) => (0, q.jsxs)(`div`, {
                    className: `bg-white rounded-2xl p-2 border border-border shadow-card overflow-hidden`,
                    children: [(0, q.jsx)(`img`, {
                        src: e,
                        alt: `Depoimento ${t+1}`,
                        loading: `lazy`,
                        className: `w-full h-auto rounded-xl`
                    }), (0, q.jsx)(`div`, {
                        className: `flex gap-1 text-accent-mint justify-center py-3`,
                        children: [...[, , , , , ]].map((e, t) => (0, q.jsx)(w, {
                            className: `w-4 h-4 fill-current`
                        }, t))
                    })]
                }, t))
            })]
        })
    })
}

function he() {
    return (0, q.jsx)(`section`, {
        className: `py-16 md:py-24 px-4 bg-white`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-6xl mx-auto text-center`,
            children: [(0, q.jsxs)(`span`, {
                className: `inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-mint-bg text-accent-mint text-xs font-black uppercase tracking-widest`,
                children: [(0, q.jsx)(v, {
                    className: `w-4 h-4`
                }), ` Conteúdo Extra`]
            }), (0, q.jsxs)(`h2`, {
                className: `mt-4 text-3xl md:text-5xl font-black`,
                children: [`Bônus `, (0, q.jsx)(`span`, {
                    className: `text-gradient-mint`,
                    children: `Exclusivos`
                })]
            }), (0, q.jsx)(`p`, {
                className: `mt-3 text-muted-foreground max-w-xl mx-auto`,
                children: `Materiais complementares que você recebe junto do acervo, sem custo adicional.`
            }), (0, q.jsx)(`div`, {
                className: `mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center`,
                children: re.map((e, t) => (0, q.jsxs)(`div`, {
                    className: `group relative w-full max-w-xs rounded-3xl p-8 pt-10 bg-gradient-soft border border-border shadow-card hover:shadow-mint transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center`,
                    children: [(0, q.jsxs)(`div`, {
                        className: `absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-mint text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-mint tracking-widest whitespace-nowrap`,
                        children: [`BÔNUS `, String(t + 1).padStart(2, `0`)]
                    }), (0, q.jsx)(`span`, {
                        className: `w-16 h-16 rounded-2xl bg-accent-mint-bg flex items-center justify-center ring-4 ring-white shadow-mint`,
                        children: (0, q.jsx)(v, {
                            className: `w-8 h-8 text-accent-mint`
                        })
                    }), (0, q.jsx)(`h3`, {
                        className: `mt-5 text-xl font-black leading-tight`,
                        children: e.title
                    }), (0, q.jsx)(`p`, {
                        className: `mt-2 text-sm text-muted-foreground`,
                        children: e.desc
                    })]
                }, t))
            })]
        })
    })
}

function ge() {
    let [e, t] = (0, c.useState)(0);
    return (0, q.jsx)(`section`, {
        className: `py-16 md:py-24 px-4 bg-gradient-soft`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-3xl mx-auto`,
            children: [(0, q.jsx)(`p`, {
                className: `text-center text-sm font-semibold uppercase tracking-widest text-brand`,
                children: `FAQ`
            }), (0, q.jsx)(`h2`, {
                className: `mt-3 text-3xl md:text-5xl font-black text-center`,
                children: `Perguntas frequentes`
            }), (0, q.jsx)(`div`, {
                className: `mt-10 space-y-3`,
                children: ie.map((n, r) => (0, q.jsxs)(`div`, {
                    className: `bg-white rounded-2xl border border-border shadow-card overflow-hidden`,
                    children: [(0, q.jsxs)(`button`, {
                        onClick: () => t(e === r ? null : r),
                        className: `w-full flex flex-col items-center text-center gap-2 p-5 font-bold text-foreground`,
                        children: [(0, q.jsx)(`span`, {
                            children: n.q
                        }), (0, q.jsx)(d, {
                            className: `w-5 h-5 text-accent-mint transition-transform shrink-0 ${e===r?`rotate-180`:``}`
                        })]
                    }), e === r && (0, q.jsx)(`div`, {
                        className: `px-5 pb-5 text-muted-foreground leading-relaxed text-center`,
                        children: n.a
                    })]
                }, r))
            })]
        })
    })
}

function _e() {
    return (0, q.jsx)(`section`, {
        className: `py-20 md:py-28 px-4 bg-gradient-brand text-white`,
        children: (0, q.jsxs)(`div`, {
            className: `max-w-3xl mx-auto text-center`,
            children: [(0, q.jsx)(`p`, {
                className: `text-lg md:text-xl font-medium opacity-95`,
                children: `Toda venda começa quando você consegue responder:`
            }), (0, q.jsx)(`h2`, {
                className: `mt-4 text-3xl md:text-5xl font-black leading-tight italic`,
                children: `"Sim, eu tenho esse tema."`
            }), (0, q.jsx)(`p`, {
                className: `mt-6 text-base md:text-lg opacity-95 leading-relaxed`,
                children: `Monte hoje seu acervo profissional e esteja preparado para atender praticamente qualquer pedido que chegar no seu WhatsApp.`
            }), (0, q.jsx)(`div`, {
                className: `mt-10`,
                children: (0, q.jsx)(`a`, {
                    href: `#oferta`,
                    className: `inline-flex flex-wrap justify-center items-center gap-2 bg-gradient-green text-white font-black text-lg px-6 py-5 rounded-full shadow-green hover:scale-[1.02] transition`,
                    children: `QUERO ACESSAR O ACERVO AGORA`
                })
            }), (0, q.jsxs)(`div`, {
                className: `mt-8 flex flex-wrap justify-center gap-6 text-sm`,
                children: [(0, q.jsxs)(`div`, {
                    className: `flex items-center gap-2`,
                    children: [(0, q.jsx)(m, {
                        className: `w-4 h-4`
                    }), ` Acesso imediato`]
                }), (0, q.jsxs)(`div`, {
                    className: `flex items-center gap-2`,
                    children: [(0, q.jsx)(S, {
                        className: `w-4 h-4`
                    }), ` 7 dias de garantia`]
                }), (0, q.jsxs)(`div`, {
                    className: `flex items-center gap-2`,
                    children: [(0, q.jsx)(g, {
                        className: `w-4 h-4`
                    }), ` 100% digital`]
                })]
            })]
        })
    })
}

function ve() {
    return (0, q.jsxs)(`footer`, {
        className: `py-8 px-4 bg-foreground text-background/70 text-center text-xs`,
        children: [(0, q.jsxs)(`p`, {
            children: [`© `, new Date().getFullYear(), ` Acervo de Moldes. Todos os direitos reservados.`]
        }), (0, q.jsx)(`p`, {
            className: `mt-2`,
            children: `Este produto é 100% digital. Nenhum item físico será enviado.`
        })]
    })
}

function ye({
    onClose: e
}) {
    return (0, q.jsx)(`div`, {
        className: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm`,
        onClick: e,
        role: `dialog`,
        "aria-modal": `true`,
        children: (0, q.jsxs)(`div`, {
            className: `relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200`,
            onClick: e => e.stopPropagation(),
            children: [(0, q.jsx)(`button`, {
                onClick: e,
                className: `absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition`,
                "aria-label": `Fechar`,
                children: (0, q.jsx)(T, {
                    className: `w-4 h-4 text-foreground`
                })
            }), (0, q.jsxs)(`div`, {
                className: `bg-gradient-brand text-white text-center px-6 py-4`,
                children: [(0, q.jsx)(`p`, {
                    className: `text-xs font-black uppercase tracking-widest`,
                    children: `Oferta especial de upgrade`
                }), (0, q.jsx)(`p`, {
                    className: `mt-1 text-sm font-medium opacity-95`,
                    children: `Aproveite antes que acabe`
                })]
            }), (0, q.jsxs)(`div`, {
                className: `p-6 md:p-8 text-center`,
                children: [(0, q.jsxs)(`div`, {
                    className: `inline-flex items-center gap-1.5 bg-accent-mint-bg text-accent-mint text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full`,
                    children: [(0, q.jsx)(h, {
                        className: `w-3.5 h-3.5`
                    }), ` Mais completo`]
                }), (0, q.jsxs)(`h3`, {
                    className: `mt-4 text-2xl md:text-3xl font-black leading-tight`,
                    children: [`Por apenas `, (0, q.jsx)(`span`, {
                        className: `text-gradient-brand`,
                        children: `R$4,90 a mais`
                    }), `, leve o acervo Premium`]
                }), (0, q.jsxs)(`p`, {
                    className: `mt-3 text-muted-foreground text-sm`,
                    children: [`Troque o básico pelo `, (0, q.jsx)(`strong`, {
                        className: `text-foreground`,
                        children: `Pacote Premium`
                    }), ` com mais de 7.500 artes editáveis, todos os bônus e acesso vitalício.`]
                }), (0, q.jsx)(`div`, {
                    className: `mt-6 rounded-2xl bg-gradient-soft border border-border p-4 text-left`,
                    children: (0, q.jsxs)(`ul`, {
                        className: `space-y-2 text-sm`,
                        children: [(0, q.jsxs)(`li`, {
                            className: `flex items-center gap-2`,
                            children: [(0, q.jsx)(f, {
                                className: `w-5 h-5 text-brand shrink-0`
                            }), (0, q.jsx)(`span`, {
                                children: `Mais de 7.500 artes e moldes`
                            })]
                        }), (0, q.jsxs)(`li`, {
                            className: `flex items-center gap-2`,
                            children: [(0, q.jsx)(f, {
                                className: `w-5 h-5 text-brand shrink-0`
                            }), (0, q.jsx)(`span`, {
                                children: `Compatível com Canva, Corel e Silhouette`
                            })]
                        }), (0, q.jsxs)(`li`, {
                            className: `flex items-center gap-2`,
                            children: [(0, q.jsx)(f, {
                                className: `w-5 h-5 text-brand shrink-0`
                            }), (0, q.jsx)(`span`, {
                                children: `Todos os bônus inclusos`
                            })]
                        }), (0, q.jsxs)(`li`, {
                            className: `flex items-center gap-2`,
                            children: [(0, q.jsx)(f, {
                                className: `w-5 h-5 text-brand shrink-0`
                            }), (0, q.jsx)(`span`, {
                                children: `Acesso vitalício`
                            })]
                        }), (0, q.jsxs)(`li`, {
                            className: `flex items-center gap-2`,
                            children: [(0, q.jsx)(f, {
                                className: `w-5 h-5 text-brand shrink-0`
                            }), (0, q.jsx)(`span`, {
                                children: `7 dias de garantia`
                            })]
                        })]
                    })
                }), (0, q.jsxs)(`div`, {
                    className: `mt-6 flex items-center justify-center gap-3`,
                    children: [(0, q.jsx)(`span`, {
                        className: `text-sm text-muted-foreground line-through`,
                        children: `R$97,00`
                    }), (0, q.jsx)(`span`, {
                        className: `text-4xl font-black text-gradient-brand`,
                        children: `R$14,90`
                    })]
                }), (0, q.jsx)(`p`, {
                    className: `text-xs text-muted-foreground`,
                    children: `Pagamento único • Acesso imediato`
                }), (0, q.jsxs)(`a`, {
                    href: `https://pay.wiapy.com/FrgmNmD80Wh7`,
                    target: `_blank`,
                    rel: `noopener`,
                    className: `mt-6 inline-flex w-full justify-center items-center gap-2 bg-gradient-green text-white font-black text-base px-6 py-4 rounded-full shadow-green hover:scale-[1.02] transition-transform`,
                    children: [(0, q.jsx)(h, {
                        className: `w-5 h-5`
                    }), `SIM, QUERO O PREMIUM POR R$14,90`]
                }), (0, q.jsx)(`a`, {
                    href: `https://pay.wiapy.com/RG5S_Ao2cQr7`,
                    target: `_blank`,
                    rel: `noopener`,
                    className: `mt-3 inline-block text-sm text-muted-foreground hover:text-foreground underline underline-offset-4`,
                    children: `Não, quero continuar com o básico por R$10,00`
                })]
            })]
        })
    })
}
export {
    ae as component
};