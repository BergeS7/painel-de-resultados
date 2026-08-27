"use client";
import { useEffect, useMemo, useState } from "react";
import "./legend.css";

type Unit = "count" | "money";
type Metric = {
  name: string;
  target: number;
  actual: number;
  previous?: number | null;
  lastYear?: number | null;
  unit: Unit;
};
type Category = {
  id: string;
  label: string;
  short: string;
  icon: string;
  metrics: Metric[];
};
const categories: Category[] = [
  {
    id: "motos",
    label: "Motos",
    short: "MO",
    icon: "🏍",
    metrics: [
      {
        name: "Vendas 0 km",
        target: 490,
        actual: 283,
        previous: 287,
        lastYear: 296,
        unit: "count",
      },
      {
        name: "Seminovas",
        target: 10,
        actual: 4,
        previous: 6,
        lastYear: 2,
        unit: "count",
      },
    ],
  },
  {
    id: "forca",
    label: "Produtos de Força",
    short: "PF",
    icon: "⚡",
    metrics: [
      {
        name: "Produtos de força",
        target: 3,
        actual: 0,
        previous: 0,
        lastYear: 0,
        unit: "count",
      },
    ],
  },
  {
    id: "financeiro",
    label: "Financeiro",
    short: "FI",
    icon: "＄",
    metrics: [
      {
        name: "Banco Honda",
        target: 50,
        actual: 81,
        previous: 67,
        lastYear: 23,
        unit: "count",
      },
      {
        name: "Cartão parcelado",
        target: 10,
        actual: 4,
        previous: 2,
        lastYear: 5,
        unit: "count",
      },
      {
        name: "CDCT",
        target: 27,
        actual: 2,
        previous: 0,
        lastYear: 1,
        unit: "count",
      },
      {
        name: "À vista",
        target: 90,
        actual: 25,
        previous: 38,
        lastYear: 35,
        unit: "count",
      },
    ],
  },
  {
    id: "seguro",
    label: "Seguro Honda",
    short: "SH",
    icon: "◆",
    metrics: [
      {
        name: "Seguro Honda",
        target: 150,
        actual: 103,
        previous: null,
        lastYear: null,
        unit: "count",
      },
    ],
  },
  {
    id: "cnh",
    label: "CNH",
    short: "CN",
    icon: "▣",
    metrics: [
      {
        name: "Cotas",
        target: 460,
        actual: 344,
        previous: 376,
        lastYear: 314,
        unit: "count",
      },
      {
        name: "Entregas",
        target: 300,
        actual: 171,
        previous: 180,
        lastYear: 232,
        unit: "count",
      },
    ],
  },
  {
    id: "pecas",
    label: "Peças",
    short: "PE",
    icon: "⚙",
    metrics: [
      {
        name: "Peças oficina",
        target: 170000,
        actual: 112107,
        previous: 103850,
        lastYear: 114236,
        unit: "money",
      },
      {
        name: "Peças balcão",
        target: 45000,
        actual: 29432,
        previous: 39282,
        lastYear: 41169,
        unit: "money",
      },
      {
        name: "Peças atacado",
        target: 1300000,
        actual: 698846,
        previous: 901574,
        lastYear: 645323,
        unit: "money",
      },
    ],
  },
  {
    id: "oficina",
    label: "Oficina",
    short: "OF",
    icon: "🔧",
    metrics: [
      {
        name: "Passagens",
        target: 1214,
        actual: 812,
        previous: 798,
        lastYear: 887,
        unit: "count",
      },
      {
        name: "Faturamento",
        target: 100000,
        actual: 69913.12,
        previous: 65697,
        lastYear: 67353,
        unit: "money",
      },
    ],
  },
  {
    id: "outros",
    label: "Outros indicadores",
    short: "OI",
    icon: "✦",
    metrics: [
      {
        name: "Pacotes de serviços",
        target: 12,
        actual: 20,
        previous: null,
        lastYear: null,
        unit: "count",
      },
      {
        name: "Kit lubrificação",
        target: 1,
        actual: 0,
        previous: null,
        lastYear: null,
        unit: "count",
      },
    ],
  },
];
type DashboardData = {
  revenue: number;
  ticket: number;
  referenceDate: string;
  updatedAt: string;
  sourceFile?: string;
  categories: Category[];
};
type PeriodOption = { referenceDate: string; updatedAt: string };
const initialDashboard: DashboardData = {
  revenue: 0,
  ticket: 0,
  referenceDate: "",
  updatedAt: "",
  categories: [],
};
const nf = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
const fmt = (v: number, u: Unit) =>
  u === "money" ? brl.format(v) : nf.format(v);
const compact = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const chartFmt = (v: number, u: Unit) =>
  u === "money" ? `R$ ${compact.format(v)}` : compact.format(v);
const pct = (v: number) => `${(v * 100).toFixed(1).replace(".", ",")}%`;
const tone = (v: number) => (v >= 1 ? "good" : v >= 0.85 ? "warn" : "bad");

function MetricCard({ m }: { m: Metric }) {
  const rate = m.target ? m.actual / m.target : 0,
    remaining = Math.max(0, m.target - m.actual);
  return (
    <article className={`metric-card ${tone(rate)}`}>
      <div>
        <span>{m.name}</span>
        <b className={`status ${tone(rate)}`}>
          {rate >= 1
            ? "Meta atingida"
            : rate >= 0.85
              ? "Atenção"
              : "Abaixo da meta"}
        </b>
      </div>
      <strong>{fmt(m.actual, m.unit)}</strong>
      <small>
        de {fmt(m.target, m.unit)} • faltam {fmt(remaining, m.unit)}
      </small>
      <div className="metric-track">
        <i
          className={tone(rate)}
          style={{ width: `${Math.min(rate * 100, 100)}%` }}
        />
      </div>
      <em>{pct(rate)}</em>
    </article>
  );
}

function ComparisonChart({ metrics }: { metrics: Metric[] }) {
  const series = ["Meta", "Real", "Mês anterior", "Mês do ano anterior"];
  const variation = (current: number, previous?: number | null) => {
    if (!previous) return { text: "Sem base para comparação", value: 0 };
    const value = current / previous - 1;
    return { text: `${value >= 0 ? "+" : ""}${pct(value)} vs.`, value };
  };
  return (
    <div className="comparison-chart">
      {metrics.map((m) => {
        const values = [m.target, m.actual, m.previous || 0, m.lastYear || 0],
          max = Math.max(...values, 1),
          rate = m.target ? m.actual / m.target : 0,
          monthVariation = variation(m.actual, m.previous),
          yearVariation = variation(m.actual, m.lastYear);
        return (
          <div className="chart-group" key={m.name}>
            <strong>{m.name}</strong>
            <div className="columns">
              {values.map((v, i) => (
                <div className="bar-slot" key={i} title={fmt(v, m.unit)}>
                  <b>{chartFmt(v, m.unit)}</b>
                  <div className="bar-well">
                    <span className="target-marker" style={{ bottom: `${(m.target / max) * 100}%` }} />
                    <i
                      className={`column ${i === 1 ? `actual-bar ${tone(rate)}` : `c${i}`}`}
                      style={{ height: `${Math.max((v / max) * 100, v ? 3 : 0)}%` }}
                    />
                  </div>
                  <span>{series[i]}</span>
                </div>
              ))}
            </div>
            <div className="trend-summary">
              <span className={monthVariation.value >= 0 ? "up" : "down"}>{monthVariation.text} mês anterior</span>
              <span className={yearVariation.value >= 0 ? "up" : "down"}>{yearVariation.text} mês do ano anterior</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CategoryView({ category, referenceDay, daysInMonth }: { category: Category; referenceDay: number; daysInMonth: number }) {
  const rates = category.metrics.map((m) =>
    m.target ? m.actual / m.target : 0,
  );
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
  return (
    <>
      <div className="category-summary">
        <div
          className={`gauge ${tone(avg)}`}
          style={
            { "--rate": `${Math.min(avg, 1) * 360}deg` } as React.CSSProperties
          }
        >
          <span>{pct(avg)}</span>
        </div>
        <div>
          <span>Índice médio da área</span>
          <h2>{category.label}</h2>
          <p>
            {avg >= 1
              ? "Resultado geral acima da meta."
              : avg >= 0.85
                ? "Área próxima da meta; acompanhe os desvios."
                : "Área requer plano de ação e acompanhamento."}
          </p>
        </div>
        <div className="method-note">
          <b>Projeção linear</b>
          <span>Baseada em {referenceDay} de {daysInMonth} dias corridos</span>
        </div>
      </div>
      <div className="metric-cards">
        {category.metrics.map((m) => (
          <MetricCard key={m.name} m={m} />
        ))}
      </div>
      <div className="detail-grid">
        <article className="panel">
          <div className="panel-title">
            <div>
              <span>COMPARAÇÃO DIRETA</span>
              <h2>Meta x realizado x históricos</h2>
            </div>
          </div>
          <ComparisonChart metrics={category.metrics} />
        </article>
        <article className="panel projection-list">
          <div className="panel-title">
            <div>
              <span>RITMO DE FECHAMENTO</span>
              <h2>Projeção por indicador</h2>
            </div>
          </div>
          {category.metrics.map((m) => {
            const projected = (m.actual / referenceDay) * daysInMonth,
              rate = m.target ? projected / m.target : 0;
            return (
              <div className="projection-row" key={m.name}>
                <div>
                  <strong>{m.name}</strong>
                  <small>Projeção: {fmt(projected, m.unit)}</small>
                </div>
                <b className={tone(rate)}>{pct(rate)}</b>
              </div>
            );
          })}
        </article>
      </div>
      <article className="panel measurement-table">
        <div className="panel-title">
          <div>
            <span>LEITURA GERENCIAL</span>
            <h2>Medição completa</h2>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Meta</th>
                <th>Real</th>
                <th>Atingimento</th>
                <th>Pendente</th>
                <th>Mês anterior</th>
                <th>Ano anterior</th>
              </tr>
            </thead>
            <tbody>
              {category.metrics.map((m) => (
                <tr key={m.name}>
                  <td>
                    <strong>{m.name}</strong>
                  </td>
                  <td>{fmt(m.target, m.unit)}</td>
                  <td>{fmt(m.actual, m.unit)}</td>
                  <td>
                    <b className={tone(m.actual / m.target)}>
                      {pct(m.actual / m.target)}
                    </b>
                  </td>
                  <td>{fmt(Math.max(0, m.target - m.actual), m.unit)}</td>
                  <td>{m.previous == null ? "—" : fmt(m.previous, m.unit)}</td>
                  <td>{m.lastYear == null ? "—" : fmt(m.lastYear, m.unit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}

function Overview({
  summary,
  onSelect,
  data,
}: {
  summary: Array<Category & { rate: number }>;
  onSelect: (id: string) => void;
  data: DashboardData;
}) {
  const motos = data.categories.find((c) => c.id === "motos");
  const motosReal = motos?.metrics.reduce((s, m) => s + m.actual, 0) ?? 0;
  const motosMeta = motos?.metrics.reduce((s, m) => s + m.target, 0) ?? 0;
  const best = data.categories
    .flatMap((c) => c.metrics)
    .reduce(
      (a, b) =>
        (b.target ? b.actual / b.target : 0) >
        (a.target ? a.actual / a.target : 0)
          ? b
          : a,
      data.categories[0].metrics[0],
    );
  return (
    <>
      <div className="headline-grid">
        <article>
          <span>Receita mensal</span>
          <strong>{brl.format(data.revenue)}</strong>
          <small>Informada na planilha</small>
        </article>
        <article>
          <span>Ticket médio</span>
          <strong>{brl.format(data.ticket)}</strong>
          <small>Por venda 0 km</small>
        </article>
        <article>
          <span>Motos realizadas</span>
          <strong>{nf.format(motosReal)}</strong>
          <small>
            {pct(motosMeta ? motosReal / motosMeta : 0)} da meta de{" "}
            {nf.format(motosMeta)}
          </small>
        </article>
        <article>
          <span>Melhor desempenho</span>
          <strong>{pct(best.target ? best.actual / best.target : 0)}</strong>
          <small>{best.name}</small>
        </article>
      </div>
      <div className="content-grid">
        <article className="panel performance">
          <div className="panel-title">
            <div>
              <span>ATINGIMENTO POR ÁREA</span>
              <h2>Mapa de desempenho</h2>
            </div>
            <div className="legend">
              <i className="good" />
              ≥100% <i className="warn" />
              85–99% <i className="bad" />
              &lt;85%
            </div>
          </div>
          <div className="bars">
            {summary.map((item) => (
              <div className="bar-row" key={item.id}>
                <button onClick={() => onSelect(item.id)}>{item.label}</button>
                <div className="track">
                  <span
                    className={tone(item.rate)}
                    style={{ width: `${Math.min(item.rate * 100, 100)}%` }}
                  />
                </div>
                <strong>{pct(item.rate)}</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="panel attention">
          <div className="panel-title">
            <div>
              <span>FOCO DA GESTÃO</span>
              <h2>Maiores desvios</h2>
            </div>
          </div>
          {[...summary]
            .sort((a, b) => a.rate - b.rate)
            .slice(0, 4)
            .map((item, i) => (
              <button key={item.id} onClick={() => onSelect(item.id)}>
                <span>{i + 1}</span>
                <div>
                  <strong>{item.label}</strong>
                  <small>Abrir medição detalhada</small>
                </div>
                <b>{pct(item.rate)}</b>
              </button>
            ))}
        </article>
      </div>
      <div className="area-grid">
        {summary.map((item) => (
          <button key={item.id} onClick={() => onSelect(item.id)}>
            <span>{item.short}</span>
            <div>
              <strong>{item.label}</strong>
              <small>
                {item.metrics.length} indicador
                {item.metrics.length > 1 ? "es" : ""}
              </small>
            </div>
            <b className={tone(item.rate)}>{pct(item.rate)}</b>
          </button>
        ))}
      </div>
    </>
  );
}

export default function Home() {
  const [selected, setSelected] = useState("overview");
  const [data, setData] = useState<DashboardData>(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState<PeriodOption[]>([]);
  const [periodBusy, setPeriodBusy] = useState(false);
  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => r.json() as Promise<DashboardData>)
      .then((d) => {
        if (d?.categories) {
          setData(d);
          setPeriods([{ referenceDate: d.referenceDate, updatedAt: d.updatedAt }]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    fetch("/api/dashboard/history", { cache: "no-store" })
      .then((r) => r.json() as Promise<{ periods?: PeriodOption[] }>)
      .then((result) => {
        if (result.periods?.length) setPeriods(result.periods);
      })
      .catch(() => {});
  }, []);
  async function changePeriod(referenceDate: string) {
    setPeriodBusy(true);
    try {
      const response = await fetch(`/api/dashboard/history?date=${encodeURIComponent(referenceDate)}`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      const next = await response.json() as DashboardData;
      if (next.categories?.length) setData(next);
    } finally {
      setPeriodBusy(false);
    }
  }
  const categories = data.categories;
  useEffect(() => {
    if (!loading && !categories.length) window.location.replace("/admin");
  }, [loading, categories.length]);
  const summary = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        rate:
          c.metrics.reduce(
            (s, m) => s + (m.target ? m.actual / m.target : 0),
            0,
          ) / c.metrics.length,
      })),
    [categories],
  );
  const current = categories.find((c) => c.id === selected);
  const pageIcon = current?.icon ?? "▦";
  if (loading || !categories.length) return null;
  const refDate = new Date(`${data.referenceDate}T12:00:00`);
  const referenceDay = refDate.getDate();
  const daysInMonth = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0).getDate();
  const month = refDate
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .toUpperCase();
  const updated = new Date(data.updatedAt).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">
          <img
            className="brand-logo"
            src="/maranhao-motos-logo.jpg"
            alt="Maranhão Motos"
          />
          <small>Santa Inês</small>
        </div>
        <nav aria-label="Categorias do painel">
          <button
            className={selected === "overview" ? "active" : ""}
            onClick={() => setSelected("overview")}
          >
            <span className="nav-icon" aria-hidden="true">
              ▦
            </span>
            <span>Visão geral</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={selected === c.id ? "active" : ""}
              onClick={() => setSelected(c.id)}
            >
              <span className="nav-icon" aria-hidden="true">
                {c.icon}
              </span>
              <span>{c.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span>Fonte oficial</span>
          <strong>{data.sourceFile ?? "PAINEL_DE_RESULTADOS"}</strong>
          <small>Aba Sta.Inês</small>
          <a className="admin-link" href="/admin">
            Atualizar dados
          </a>
          <a
            className="instagram-button"
            href="https://www.instagram.com/sergio_berge/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir Instagram de Sergio Berge"
          >
            <img src="/instagram.png" alt="Instagram" />
          </a>
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">PAINEL EXECUTIVO • {month}</p>
            <h1 className="page-heading">
              <span aria-hidden="true">{pageIcon}</span>
              {selected === "overview"
                ? "Visão geral da operação"
                : current?.label}
            </h1>
            <p>
              {selected === "overview"
                ? "Indicadores consolidados para acompanhamento de metas e tomada de decisão."
                : "Dashboard exclusivo da categoria com medição completa e projeção."}
            </p>
          </div>
          <div className="dashboard-actions">
            <label className="period-filter">
              <span>Período analisado</span>
              <select value={data.referenceDate} disabled={periodBusy} onChange={(e) => changePeriod(e.target.value)}>
                {periods.map((period) => (
                  <option key={period.referenceDate} value={period.referenceDate}>
                    {new Date(`${period.referenceDate}T12:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </option>
                ))}
              </select>
            </label>
            <div className="reference">
              <span>Dados de {refDate.toLocaleDateString("pt-BR")}</span>
              <strong>Atualizado em {updated}</strong>
            </div>
            <button className="print-button" onClick={() => window.print()}>Exportar PDF</button>
          </div>
        </header>
        {current ? (
          <CategoryView category={current} referenceDay={referenceDay} daysInMonth={daysInMonth} />
        ) : (
          <Overview summary={summary} onSelect={setSelected} data={data} />
        )}
      </section>
    </main>
  );
}
