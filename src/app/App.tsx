import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, FolderOpen, Box, AlertCircle, Bell, Brain,
  BookOpen, Calendar, BarChart3, User, ChevronRight, Search,
  Plus, Upload, Filter, MoreHorizontal, CheckCircle2, Clock,
  XCircle, AlertTriangle, TrendingUp, TrendingDown, Users,
  FileText, Layers, Settings, LogOut, ChevronDown, Send,
  Paperclip, Sparkles, Building2, Activity, Lock, Tag, Eye,
  DownloadCloud, GitBranch, MessageSquare, Check, X, Zap,
  BarChart2, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight,
  Star, Award, Hash, Play, Video, BookMarked, Lightbulb,
  GraduationCap, Shield, ChevronLeft, RefreshCw, Maximize2,
  Target, Gauge
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart,
  Line, Legend
} from "recharts";

// ─── Colors ────────────────────────────────────────────────────────────────
const C = {
  bg: "#0F172A",
  sidebar: "#080E1C",
  card: "#1E293B",
  cardHover: "#243044",
  border: "rgba(148,163,184,0.1)",
  borderLight: "rgba(148,163,184,0.07)",
  blue: "#2563EB",
  blueLight: "#3B82F6",
  blueDim: "rgba(37,99,235,0.15)",
  blueDim2: "rgba(37,99,235,0.08)",
  text: "#F1F5F9",
  textMuted: "#64748B",
  textSub: "#94A3B8",
  green: "#22C55E",
  greenDim: "rgba(34,197,94,0.15)",
  orange: "#F97316",
  orangeDim: "rgba(249,115,22,0.15)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.15)",
  purple: "#A855F7",
  purpleDim: "rgba(168,85,247,0.15)",
  yellow: "#EAB308",
  yellowDim: "rgba(234,179,8,0.15)",
};

// ─── Types ─────────────────────────────────────────────────────────────────
type Module =
  | "dashboard" | "proyectos" | "archivos" | "bim"
  | "observaciones" | "notificaciones" | "ia" | "conocimiento"
  | "calendario" | "gerente" | "perfil";

// ─── Shared primitives ──────────────────────────────────────────────────────
function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ color, background: bg, fontFamily: "'JetBrains Mono',monospace" }}
      className="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
      {label}
    </span>
  );
}

function Avatar({ name, size = 28, color = C.blue }: { name: string; size?: number; color?: string }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, background: color + "33", border: `1px solid ${color}40`, fontSize: size * 0.36, color }}
      className="rounded-full flex items-center justify-center font-semibold flex-shrink-0"
      title={name}>
      {initials}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, delta, deltaUp, accent = C.blue }:
  { icon: any; label: string; value: string; delta?: string; deltaUp?: boolean; accent?: string }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}` }}
      className="rounded-xl p-5 flex flex-col gap-3 hover:border-blue-500/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide uppercase" style={{ color: C.textMuted }}>{label}</span>
        <div style={{ background: accent + "18", color: accent }} className="w-8 h-8 rounded-lg flex items-center justify-center">
          <Icon size={15} />
        </div>
      </div>
      <div className="text-2xl font-bold" style={{ color: C.text, fontFamily: "'Outfit',sans-serif" }}>{value}</div>
      {delta && (
        <div className="flex items-center gap-1 text-xs" style={{ color: deltaUp ? C.green : C.red }}>
          {deltaUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700 }}>{title}</h2>
        {subtitle && <p style={{ color: C.textMuted }} className="text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, icon: Icon, size: sz = "md" }:
  { children?: React.ReactNode; variant?: "primary" | "ghost" | "outline"; onClick?: () => void; icon?: any; size?: "sm" | "md" }) {
  const base = "inline-flex items-center gap-2 font-medium rounded-lg cursor-pointer transition-all";
  const pad = sz === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: C.blue, color: "#fff" },
    ghost: { background: "transparent", color: C.textSub },
    outline: { background: "transparent", color: C.textSub, border: `1px solid ${C.border}` },
  };
  return (
    <button className={`${base} ${pad}`} style={styles[variant]} onClick={onClick}>
      {Icon && <Icon size={sz === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

const progressColors: Record<string, string> = {
  "En ejecución": C.blue,
  "En revisión": C.orange,
  "Retrasado": C.red,
  "Terminado": C.green,
  "Aprobado": C.green,
  "Pendiente": C.textMuted,
  "En proceso": C.blue,
  "Resuelto": C.green,
  "Observado nuevamente": C.orange,
};

function StatusBadge({ status }: { status: string }) {
  const color = progressColors[status] || C.textMuted;
  return <Badge label={status} color={color} bg={color + "20"} />;
}

// ─── Dashboard Ejecutivo ────────────────────────────────────────────────────
const weeklyData = [
  { day: "Lun", avance: 62, carga: 78 },
  { day: "Mar", avance: 68, carga: 82 },
  { day: "Mié", avance: 71, carga: 75 },
  { day: "Jue", avance: 74, carga: 88 },
  { day: "Vie", avance: 79, carga: 91 },
  { day: "Sáb", avance: 80, carga: 70 },
  { day: "Dom", avance: 80, carga: 45 },
];

const proyectosPie = [
  { name: "En ejecución", value: 12, color: C.blue },
  { name: "En revisión", value: 4, color: C.orange },
  { name: "Retrasados", value: 3, color: C.red },
  { name: "Terminados", value: 7, color: C.green },
];

const activity = [
  { user: "Juan Pérez", action: "subió Plano Estructural V3", time: "hace 12 min", icon: Upload, color: C.blue },
  { user: "Carlos Mendoza", action: "respondió observación #OB-041", time: "hace 28 min", icon: MessageSquare, color: C.orange },
  { user: "IA ArcBIM", action: "resolvió consulta sobre normativa E.030", time: "hace 45 min", icon: Sparkles, color: C.purple },
  { user: "Sistema", action: "Proyecto Hospital Norte pasó a revisión", time: "hace 1h", icon: RefreshCw, color: C.green },
  { user: "Ana Torres", action: "aprobó plano arquitectónico R-07", time: "hace 2h", icon: CheckCircle2, color: C.green },
  { user: "Roberto Silva", action: "creó nueva observación en Torre Lima", time: "hace 3h", icon: AlertCircle, color: C.red },
];

function DashboardEjecutivo() {
  const tooltipStyle = { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 12 };
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard Ejecutivo"
        subtitle="Resumen general de la organización — julio 2026"
        action={<Btn icon={DownloadCloud} variant="outline" size="sm">Exportar</Btn>}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={FolderOpen} label="Proyectos Activos" value="12" delta="+2 este mes" deltaUp />
        <KpiCard icon={AlertTriangle} label="Proyectos Retrasados" value="3" delta="+1 esta semana" deltaUp={false} accent={C.red} />
        <KpiCard icon={CheckCircle2} label="Proyectos Terminados" value="7" delta="+1 esta semana" deltaUp accent={C.green} />
        <KpiCard icon={Clock} label="Horas Trabajadas" value="1,847" delta="+12% vs semana ant." deltaUp />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Activity} label="Tareas Pendientes" value="84" delta="-6 hoy" deltaUp accent={C.orange} />
        <KpiCard icon={AlertCircle} label="Observaciones Abiertas" value="31" delta="-3 esta semana" deltaUp accent={C.red} />
        <KpiCard icon={Sparkles} label="Consultas IA (semana)" value="218" delta="+34% vs semana ant." deltaUp accent={C.purple} />
        <KpiCard icon={TrendingUp} label="Productividad Semanal" value="87%" delta="+5 pts" deltaUp accent={C.green} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-5 md:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15 }}>Avance & Carga Semanal</h3>
            <div className="flex gap-3 text-xs" style={{ color: C.textMuted }}>
              <span className="flex items-center gap-1.5"><span style={{ background: C.blue }} className="w-2 h-2 rounded-full inline-block" />Avance</span>
              <span className="flex items-center gap-1.5"><span style={{ background: C.orange }} className="w-2 h-2 rounded-full inline-block" />Carga</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.orange} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: C.border }} />
              <Area type="monotone" dataKey="avance" stroke={C.blue} strokeWidth={2} fill="url(#gBlue)" dot={false} />
              <Area type="monotone" dataKey="carga" stroke={C.orange} strokeWidth={2} fill="url(#gOrange)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-5">
          <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15 }} className="mb-5">Estado de Proyectos</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={proyectosPie} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {proyectosPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {proyectosPie.map(p => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span style={{ background: p.color }} className="w-2 h-2 rounded-full" />
                  <span style={{ color: C.textSub }}>{p.name}</span>
                </div>
                <span style={{ color: C.text, fontFamily: "'JetBrains Mono',monospace" }} className="font-medium">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-5">
        <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15 }} className="mb-4">Actividad Reciente</h3>
        <div className="space-y-0">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b last:border-b-0" style={{ borderColor: C.borderLight }}>
              <div style={{ background: a.color + "18", color: a.color }} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <a.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: C.text }}>
                  <span className="font-semibold">{a.user}</span>{" "}
                  <span style={{ color: C.textSub }}>{a.action}</span>
                </p>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Gestión de Proyectos ───────────────────────────────────────────────────
const proyectos = [
  { id: "PRY-001", nombre: "Hospital Norte Lima", cliente: "Gobierno Regional Lima", responsable: "Ana Torres", estado: "En revisión", avance: 72, entrega: "15 ago 2026", prioridad: "Alta", archivos: 148, obs: 8 },
  { id: "PRY-002", nombre: "Torre Empresarial Miraflores", cliente: "Grupo Inversiones Sur", responsable: "Carlos Mendoza", estado: "En ejecución", avance: 45, entrega: "30 nov 2026", prioridad: "Media", archivos: 96, obs: 3 },
  { id: "PRY-003", nombre: "Puente Vial Sur Arequipa", cliente: "MTC Perú", responsable: "Roberto Silva", estado: "Retrasado", avance: 28, entrega: "01 jul 2026", prioridad: "Crítica", archivos: 62, obs: 14 },
  { id: "PRY-004", nombre: "Planta Industrial Callao", cliente: "Almacenes Rímac S.A.", responsable: "Juan Pérez", estado: "En ejecución", avance: 91, entrega: "20 ago 2026", prioridad: "Media", archivos: 211, obs: 2 },
  { id: "PRY-005", nombre: "Residencial Las Palmas", cliente: "Constructora Pacífico", responsable: "María Quispe", estado: "Terminado", avance: 100, entrega: "10 jun 2026", prioridad: "Baja", archivos: 334, obs: 0 },
  { id: "PRY-006", nombre: "Viaducto Huancayo", cliente: "Región Junín", responsable: "Diego Flores", estado: "En ejecución", avance: 58, entrega: "15 dic 2026", prioridad: "Alta", archivos: 77, obs: 5 },
];

const prioridadColors: Record<string, string> = {
  "Crítica": C.red, "Alta": C.orange, "Media": C.blue, "Baja": C.textMuted
};

function GestionProyectos() {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("resumen");
  const tabs = ["Resumen", "Cronograma", "Archivos", "Visor BIM", "Observaciones", "Versiones", "IA", "Indicadores"];

  if (selected) {
    const p = proyectos.find(x => x.id === selected)!;
    return (
      <div>
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm mb-5 hover:opacity-80 transition-opacity" style={{ color: C.textSub }}>
          <ChevronLeft size={15} /> Volver a proyectos
        </button>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs">{p.id}</span>
              <StatusBadge status={p.estado} />
            </div>
            <h1 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 700 }}>{p.nombre}</h1>
            <p style={{ color: C.textMuted }} className="text-sm mt-1">{p.cliente} · Responsable: {p.responsable}</p>
          </div>
          <div className="flex gap-2">
            <Btn variant="outline" icon={Users} size="sm">Equipo</Btn>
            <Btn icon={Plus} size="sm">Nueva tarea</Btn>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 overflow-x-auto" style={{ borderBottom: `1px solid ${C.border}` }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t.toLowerCase())}
              className="px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                color: activeTab === t.toLowerCase() ? C.blue : C.textMuted,
                borderBottom: activeTab === t.toLowerCase() ? `2px solid ${C.blue}` : "2px solid transparent",
                marginBottom: -1,
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab content: Resumen */}
        {activeTab === "resumen" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-5 md:col-span-2">
              <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }} className="mb-4">Avance del Proyecto</h3>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: C.textSub }}>Progreso general</span>
                  <span style={{ color: C.text, fontFamily: "'JetBrains Mono',monospace" }} className="font-medium">{p.avance}%</span>
                </div>
                <div style={{ background: C.border, borderRadius: 99 }} className="h-2">
                  <div style={{ width: `${p.avance}%`, background: p.avance < 40 ? C.red : p.avance < 70 ? C.orange : C.blue, borderRadius: 99, transition: "width 0.6s ease" }} className="h-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: "Fecha de entrega", v: p.entrega },
                  { l: "Prioridad", v: p.prioridad },
                  { l: "Archivos", v: `${p.archivos} archivos` },
                  { l: "Observaciones", v: `${p.obs} abiertas` },
                ].map(({ l, v }) => (
                  <div key={l} style={{ background: C.bg, borderRadius: 8, padding: "12px 14px" }}>
                    <p style={{ color: C.textMuted }} className="text-xs mb-1">{l}</p>
                    <p style={{ color: C.text }} className="text-sm font-medium">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-5">
              <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }} className="mb-4">Equipo</h3>
              {["Ana Torres", "Juan Pérez", "Carlos Mendoza", "María Quispe", "Luis Herrera"].map(name => (
                <div key={name} className="flex items-center gap-3 mb-3">
                  <Avatar name={name} size={32} />
                  <div>
                    <p style={{ color: C.text }} className="text-sm font-medium">{name}</p>
                    <p style={{ color: C.textMuted }} className="text-xs">Ingeniero Senior</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cronograma" && (
          <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-5">
            <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }} className="mb-5">Cronograma de Actividades</h3>
            {[
              { fase: "Estudios preliminares", inicio: "01 Feb", fin: "28 Feb", pct: 100, estado: "Terminado" },
              { fase: "Diseño estructural", inicio: "01 Mar", fin: "15 May", pct: 100, estado: "Terminado" },
              { fase: "Diseño arquitectónico", inicio: "01 Abr", fin: "30 Jun", pct: 85, estado: "En ejecución" },
              { fase: "Diseño MEP", inicio: "15 May", fin: "31 Jul", pct: 60, estado: "En ejecución" },
              { fase: "Revisión y aprobación", inicio: "01 Jul", fin: "31 Ago", pct: 30, estado: "En revisión" },
              { fase: "Documentación final", inicio: "01 Sep", fin: "30 Sep", pct: 0, estado: "Pendiente" },
            ].map(f => (
              <div key={f.fase} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ color: C.text }} className="text-sm font-medium">{f.fase}</span>
                  <div className="flex items-center gap-3">
                    <span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs">{f.inicio} → {f.fin}</span>
                    <StatusBadge status={f.estado} />
                  </div>
                </div>
                <div style={{ background: C.borderLight, borderRadius: 99 }} className="h-1.5">
                  <div style={{ width: `${f.pct}%`, background: progressColors[f.estado] || C.blue, borderRadius: 99 }} className="h-1.5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {(activeTab !== "resumen" && activeTab !== "cronograma") && (
          <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-12 flex flex-col items-center justify-center">
            <Layers size={40} style={{ color: C.textMuted }} className="mb-3" />
            <p style={{ color: C.textMuted }} className="text-sm">Vista "{tabs.find(t => t.toLowerCase() === activeTab)}" disponible</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Gestión de Proyectos" subtitle={`${proyectos.length} proyectos · 3 retrasados`}
        action={<Btn icon={Plus}>Nuevo proyecto</Btn>} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {proyectos.map(p => (
          <div key={p.id} onClick={() => setSelected(p.id)}
            style={{ background: C.card, border: `1px solid ${C.border}`, cursor: "pointer" }}
            className="rounded-xl p-5 hover:border-blue-500/40 transition-all hover:translate-y-[-1px]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs">{p.id}</span>
                  <span style={{ color: prioridadColors[p.prioridad], background: prioridadColors[p.prioridad] + "18" }}
                    className="text-[10px] px-1.5 py-0.5 rounded font-medium">{p.prioridad}</span>
                </div>
                <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{p.nombre}</h3>
              </div>
              <StatusBadge status={p.estado} />
            </div>
            <p style={{ color: C.textMuted }} className="text-xs mb-4">{p.cliente}</p>

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: C.textMuted }}>Avance</span>
                <span style={{ color: C.text, fontFamily: "'JetBrains Mono',monospace" }}>{p.avance}%</span>
              </div>
              <div style={{ background: C.borderLight, borderRadius: 99 }} className="h-1">
                <div style={{ width: `${p.avance}%`, background: p.avance < 40 ? C.red : p.avance < 70 ? C.orange : C.blue, borderRadius: 99 }} className="h-1" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name={p.responsable} size={24} />
                <span style={{ color: C.textMuted }} className="text-xs">{p.responsable}</span>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: C.textMuted }}>
                <span className="flex items-center gap-1"><FileText size={11} />{p.archivos}</span>
                <span className="flex items-center gap-1"><AlertCircle size={11} />{p.obs}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{p.entrega}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Centro de Archivos ─────────────────────────────────────────────────────
const archivos = [
  { nombre: "EST-001_Plano_Cimientos_V3.dwg", tipo: "DWG", tam: "18.4 MB", modificado: "30 jun 2026", estado: "Aprobado", version: "V3", responsable: "Ana Torres", bloqueado: false },
  { nombre: "ARQ-012_Fachada_Principal_V2.pdf", tipo: "PDF", tam: "4.1 MB", modificado: "29 jun 2026", estado: "En revisión", version: "V2", responsable: "Carlos Mendoza", bloqueado: true },
  { nombre: "MEP-003_Instalaciones_Sanitarias.rvt", tipo: "RVT", tam: "142 MB", modificado: "28 jun 2026", estado: "Borrador", version: "V1", responsable: "Juan Pérez", bloqueado: false },
  { nombre: "EST-002_Memoria_Calculo_V4.docx", tipo: "DOCX", tam: "2.8 MB", modificado: "27 jun 2026", estado: "Publicado", version: "V4", responsable: "Roberto Silva", bloqueado: false },
  { nombre: "ARQ-015_Cortes_Longitudinales.dwg", tipo: "DWG", tam: "9.7 MB", modificado: "26 jun 2026", estado: "Obsoleto", version: "V1", responsable: "María Quispe", bloqueado: false },
  { nombre: "COORD_BIM_Modelo_Integrado.ifc", tipo: "IFC", tam: "284 MB", modificado: "25 jun 2026", estado: "En revisión", version: "V5", responsable: "Diego Flores", bloqueado: true },
  { nombre: "INF-001_Estudio_Suelos.pdf", tipo: "PDF", tam: "8.3 MB", modificado: "24 jun 2026", estado: "Aprobado", version: "V2", responsable: "Ana Torres", bloqueado: false },
];

const tipoColors: Record<string, string> = {
  DWG: C.blue, PDF: C.red, RVT: C.purple, DOCX: C.blue, IFC: C.green, XLSX: C.green
};

function CentroArchivos() {
  const [view, setView] = useState<"list" | "grid">("list");
  return (
    <div>
      <SectionHeader title="Centro de Archivos" subtitle="Hospital Norte Lima · 148 archivos · 4 carpetas"
        action={<div className="flex gap-2"><Btn icon={Upload} size="sm">Subir</Btn><Btn icon={FolderOpen} variant="outline" size="sm">Nueva carpeta</Btn></div>} />

      {/* Breadcrumb + search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: C.textMuted }}>
          <span style={{ color: C.text }}>Hospital Norte Lima</span>
          <ChevronRight size={14} />
          <span style={{ color: C.text }}>Estructuras</span>
          <ChevronRight size={14} />
          <span style={{ color: C.blue }}>Planos</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg">
            <Search size={13} style={{ color: C.textMuted }} />
            <input placeholder="Buscar archivos..." className="bg-transparent text-sm outline-none w-40" style={{ color: C.text }} />
          </div>
          <Btn variant="outline" icon={Filter} size="sm">Filtrar</Btn>
        </div>
      </div>

      {/* Files table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
              {["Nombre", "Tipo", "Versión", "Estado", "Tamaño", "Modificado", "Responsable", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: C.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {archivos.map((f, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }}
                className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    {f.bloqueado && <Lock size={12} style={{ color: C.orange }} />}
                    <span style={{ color: C.text }} className="font-medium">{f.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span style={{ color: tipoColors[f.tipo] || C.blue, background: (tipoColors[f.tipo] || C.blue) + "18" }}
                    className="text-xs px-2 py-0.5 rounded font-mono font-medium">{f.tipo}</span>
                </td>
                <td className="px-4 py-3">
                  <span style={{ color: C.textSub, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs">{f.version}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={f.estado} /></td>
                <td className="px-4 py-3">
                  <span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs">{f.tam}</span>
                </td>
                <td className="px-4 py-3">
                  <span style={{ color: C.textMuted }} className="text-xs">{f.modificado}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={f.responsable} size={22} />
                    <span style={{ color: C.textMuted }} className="text-xs">{f.responsable.split(" ")[0]}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-white/10 transition-colors" style={{ color: C.textMuted }}><Eye size={13} /></button>
                    <button className="p-1 rounded hover:bg-white/10 transition-colors" style={{ color: C.textMuted }}><DownloadCloud size={13} /></button>
                    <button className="p-1 rounded hover:bg-white/10 transition-colors" style={{ color: C.textMuted }}><MoreHorizontal size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Visor BIM ──────────────────────────────────────────────────────────────
function VisorBIM() {
  const [selected, setSelected] = useState<string | null>("Columna C-07");
  const elementos = ["Columna C-07", "Viga V-12", "Losa L-03", "Muro M-08", "Zapata Z-02"];
  return (
    <div>
      <SectionHeader title="Visor BIM" subtitle="COORD_BIM_Modelo_Integrado.ifc · V5"
        action={<div className="flex gap-2">
          <Btn variant="outline" icon={Maximize2} size="sm">Pantalla completa</Btn>
          <Btn icon={MessageSquare} size="sm">Comentar</Btn>
        </div>} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
        {/* Tree panel */}
        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-4 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.textMuted }}>Árbol del Proyecto</p>
          {["Estructuras", "Arquitectura", "Instalaciones", "MEP"].map(cat => (
            <div key={cat} className="mb-2">
              <div className="flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-white/5" style={{ color: C.textSub }}>
                <ChevronDown size={12} />
                <Layers size={13} />
                <span className="text-xs font-medium">{cat}</span>
              </div>
              <div className="ml-5">
                {elementos.map(el => (
                  <div key={el} onClick={() => setSelected(el)}
                    className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs"
                    style={{ color: selected === el ? C.blue : C.textMuted, background: selected === el ? C.blueDim2 : "transparent" }}>
                    <Box size={11} />
                    <span>{el}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 3D Viewport */}
        <div style={{ background: "#0A111F", border: `1px solid ${C.border}` }} className="rounded-xl md:col-span-2 relative overflow-hidden">
          {/* Simulated 3D grid */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(37,99,235,0.08)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Building outline */}
              <g transform="translate(50%, 50%) translate(-120,-100)">
                <rect x="40" y="60" width="160" height="140" fill="none" stroke={C.blue + "40"} strokeWidth="1.5" />
                <rect x="60" y="20" width="120" height="50" fill="none" stroke={C.blue + "30"} strokeWidth="1" />
                <rect x="80" y="0" width="80" height="30" fill="none" stroke={C.blue + "25"} strokeWidth="1" />
                {/* Columns */}
                {[60, 100, 140, 180].map(x => (
                  <rect key={x} x={x} y="60" width="8" height="140" fill={C.blue + "20"} stroke={C.blue + "50"} strokeWidth="1" />
                ))}
                {/* Selected element highlight */}
                <rect x="96" y="56" width="16" height="148" fill={C.blue + "40"} stroke={C.blue} strokeWidth="2" />
                <circle cx="104" cy="52" r="6" fill={C.blue} />
                <line x1="104" y1="46" x2="130" y2="20" stroke={C.blue} strokeWidth="1" strokeDasharray="4 2" />
                <text x="135" y="18" fill={C.blue} fontSize="11" fontFamily="JetBrains Mono">C-07</text>
              </g>
            </svg>
          </div>

          {/* Toolbar */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {[{ icon: Eye, label: "Vista" }, { icon: Layers, label: "Capas" }, { icon: Target, label: "Aislar" }, { icon: Gauge, label: "Medir" }].map(({ icon: I, label }) => (
              <button key={label} title={label} style={{ background: C.card + "ee", border: `1px solid ${C.border}`, color: C.textSub }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-colors">
                <I size={14} />
              </button>
            ))}
          </div>

          <div className="absolute bottom-3 left-3 text-xs" style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>
            IFC 2x3 · 3,847 elementos
          </div>
        </div>

        {/* Properties panel */}
        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-4 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.textMuted }}>Propiedades</p>
          {selected ? (
            <div>
              <div style={{ background: C.blueDim2, border: `1px solid ${C.blue}30`, borderRadius: 8 }} className="p-3 mb-4">
                <p style={{ color: C.blue }} className="text-xs font-semibold">{selected}</p>
                <p style={{ color: C.textMuted }} className="text-xs mt-0.5">IfcColumn · Estructuras</p>
              </div>
              {[
                { l: "Código IFC", v: "2P9NKQG7P" },
                { l: "Material", v: "Concreto f'c=280" },
                { l: "Área sección", v: "0.50 × 0.50 m" },
                { l: "Altura", v: "3.00 m" },
                { l: "Volumen", v: "0.75 m³" },
                { l: "Peso", v: "1,875 kg" },
                { l: "Responsable", v: "Ana Torres" },
                { l: "Última mod.", v: "28 jun 2026" },
              ].map(({ l, v }) => (
                <div key={l} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <span style={{ color: C.textMuted }} className="text-xs">{l}</span>
                  <span style={{ color: C.text, fontFamily: l === "Código IFC" ? "'JetBrains Mono',monospace" : "inherit" }} className="text-xs font-medium">{v}</span>
                </div>
              ))}
              <div className="mt-4">
                <p className="text-xs font-medium mb-2" style={{ color: C.textMuted }}>Observaciones vinculadas</p>
                <div style={{ background: C.orangeDim, border: `1px solid ${C.orange}30`, borderRadius: 6 }} className="p-2 text-xs" style={{ color: C.orange } as any}>
                  OB-022 · Fisura en base — Pendiente
                </div>
              </div>
            </div>
          ) : <p style={{ color: C.textMuted }} className="text-xs">Selecciona un elemento</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Sistema de Observaciones ───────────────────────────────────────────────
const obs = [
  { id: "OB-041", titulo: "Fisura en columna C-07 nivel 2", prioridad: "Alta", responsable: "Carlos Mendoza", vence: "05 jul 2026", estado: "Pendiente", proyecto: "Hospital Norte" },
  { id: "OB-040", titulo: "Inconsistencia en plano de cimientos vs modelo IFC", prioridad: "Crítica", responsable: "Ana Torres", vence: "03 jul 2026", estado: "En proceso", proyecto: "Hospital Norte" },
  { id: "OB-039", titulo: "Detalle de armadura no especificado en viga V-12", prioridad: "Media", responsable: "Juan Pérez", vence: "10 jul 2026", estado: "En proceso", proyecto: "Torre Miraflores" },
  { id: "OB-038", titulo: "Revisión de carga de viento — normativa E.020", prioridad: "Alta", responsable: "Roberto Silva", vence: "08 jul 2026", estado: "Resuelto", proyecto: "Puente Vial Sur" },
  { id: "OB-037", titulo: "Plano de ubicación desactualizado respecto a levantamiento", prioridad: "Baja", responsable: "María Quispe", vence: "15 jul 2026", estado: "Aprobado", proyecto: "Residencial Las Palmas" },
  { id: "OB-036", titulo: "Falta firma de especialista en memoria de cálculo", prioridad: "Media", responsable: "Diego Flores", vence: "07 jul 2026", estado: "Observado nuevamente", proyecto: "Viaducto Huancayo" },
];

const kanbanCols = ["Pendiente", "En proceso", "Resuelto", "Aprobado"];

function SistemaObservaciones() {
  const [viewMode, setViewMode] = useState<"kanban" | "tabla">("kanban");
  return (
    <div>
      <SectionHeader title="Sistema de Observaciones" subtitle={`${obs.length} observaciones · 2 críticas`}
        action={<div className="flex items-center gap-2">
          <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="flex rounded-lg overflow-hidden">
            {(["kanban", "tabla"] as const).map(m => (
              <button key={m} onClick={() => setViewMode(m)} className="px-3 py-1.5 text-xs font-medium capitalize transition-colors"
                style={{ background: viewMode === m ? C.blue : "transparent", color: viewMode === m ? "#fff" : C.textMuted }}>
                {m}
              </button>
            ))}
          </div>
          <Btn icon={Plus}>Nueva observación</Btn>
        </div>} />

      {viewMode === "kanban" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kanbanCols.map(col => {
            const items = obs.filter(o => o.estado === col);
            const colColor = progressColors[col] || C.textMuted;
            return (
              <div key={col}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: colColor }} className="text-xs font-semibold uppercase tracking-wide">{col}</span>
                  <span style={{ background: colColor + "20", color: colColor }} className="text-xs px-1.5 py-0.5 rounded-full font-mono">{items.length}</span>
                </div>
                <div className="space-y-3">
                  {items.map(o => (
                    <div key={o.id} style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-4 cursor-pointer hover:border-blue-500/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-[10px]">{o.id}</span>
                        <span style={{ color: prioridadColors[o.prioridad], background: prioridadColors[o.prioridad] + "18" }} className="text-[10px] px-1.5 py-0.5 rounded font-medium">{o.prioridad}</span>
                      </div>
                      <p style={{ color: C.text }} className="text-xs font-medium leading-relaxed mb-3">{o.titulo}</p>
                      <div className="flex items-center justify-between">
                        <Avatar name={o.responsable} size={22} />
                        <span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-[10px]">{o.vence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
                {["ID", "Título", "Proyecto", "Prioridad", "Responsable", "Vence", "Estado"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide" style={{ color: C.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {obs.map((o, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-4 py-3"><span style={{ color: C.blue, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs">{o.id}</span></td>
                  <td className="px-4 py-3"><span style={{ color: C.text }} className="font-medium">{o.titulo}</span></td>
                  <td className="px-4 py-3"><span style={{ color: C.textMuted }} className="text-xs">{o.proyecto}</span></td>
                  <td className="px-4 py-3"><span style={{ color: prioridadColors[o.prioridad] }} className="text-xs font-medium">{o.prioridad}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2"><Avatar name={o.responsable} size={22} />
                      <span style={{ color: C.textMuted }} className="text-xs">{o.responsable}</span></div>
                  </td>
                  <td className="px-4 py-3"><span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs">{o.vence}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={o.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Centro de Notificaciones ───────────────────────────────────────────────
const notifs = [
  { user: "Juan Pérez", action: "subió un nuevo archivo", detail: "EST-001_Plano_Cimientos_V3.dwg", time: "hace 12 min", icon: Upload, color: C.blue, read: false },
  { user: "Sistema", action: "Plano arquitectónico R-07 aprobado", detail: "Hospital Norte Lima", time: "hace 28 min", icon: CheckCircle2, color: C.green, read: false },
  { user: "Ana Torres", action: "Nueva versión disponible", detail: "ARQ-012 ahora en V3", time: "hace 45 min", icon: GitBranch, color: C.purple, read: false },
  { user: "Carlos Mendoza", action: "Observación asignada", detail: "OB-041 · Fisura en columna C-07", time: "hace 1h", icon: AlertCircle, color: C.orange, read: true },
  { user: "María Quispe", action: "Comentó en Memoria de Cálculo", detail: "\"Revisar sección 4.2 antes de aprobar\"", time: "hace 2h", icon: MessageSquare, color: C.blue, read: true },
  { user: "IA ArcBIM", action: "Consulta respondida", detail: "NTP E.060 concreto armado · confianza 94%", time: "hace 3h", icon: Sparkles, color: C.purple, read: true },
  { user: "Sistema", action: "Proyecto Puente Vial Sur — alerta de retraso", detail: "Fecha de entrega vencida hace 1 día", time: "hace 5h", icon: AlertTriangle, color: C.red, read: true },
];

function CentroNotificaciones() {
  const [filter, setFilter] = useState("todas");
  return (
    <div>
      <SectionHeader title="Centro de Notificaciones" subtitle={`${notifs.filter(n => !n.read).length} sin leer`}
        action={<Btn variant="outline" icon={Check} size="sm">Marcar todo leído</Btn>} />

      <div className="flex gap-2 mb-5">
        {["todas", "sin leer", "archivos", "observaciones", "IA"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors"
            style={{ background: filter === f ? C.blue : C.card, color: filter === f ? "#fff" : C.textMuted, border: `1px solid ${filter === f ? C.blue : C.border}` }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl overflow-hidden">
        {notifs.map((n, i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
            style={{ borderBottom: i < notifs.length - 1 ? `1px solid ${C.borderLight}` : "none", opacity: n.read ? 0.65 : 1 }}>
            {!n.read && <div style={{ background: C.blue }} className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" />}
            {n.read && <div className="w-1.5 flex-shrink-0" />}
            <div style={{ background: n.color + "18", color: n.color }} className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
              <n.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: C.text }} className="text-sm">
                <span className="font-semibold">{n.user}</span>{" "}
                <span style={{ color: C.textSub }}>{n.action}</span>
              </p>
              <p style={{ color: C.textMuted }} className="text-xs mt-0.5">{n.detail}</p>
            </div>
            <span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs flex-shrink-0">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── IA Empresarial ─────────────────────────────────────────────────────────
const chatHistory = [
  { role: "user", text: "¿Cuáles son los requisitos de la norma E.030 para diseño sismorresistente en zona 4?" },
  { role: "ai", text: "Según la NTP E.030 (2018) para zona sísmica 4, los parámetros principales son:\n\n**Factor de zona:** Z = 0.45\n**Uso de la estructura:** Depende de la categoría (A1, A2, B, C)\n**Coeficiente de amplificación sísmica (C):** C = 2.5 × (Tp/T) para T > Tp\n**Sistema estructural:** Se recomienda muros de concreto armado o pórticos especiales.\n\nEl cortante basal mínimo es V = (ZUCS/R) × P.", sources: ["NTP E.030-2018 §4.2", "Ejemplo de aplicación PRY-003", "Manual Diseño Sismorresistente v2.1"], confidence: 94 },
  { role: "user", text: "¿Tenemos proyectos similares en la base de conocimiento?" },
  { role: "ai", text: "Sí, encontré 3 proyectos relacionados en tu base de conocimiento:\n\n1. **Puente Vial Sur Arequipa** — Zona sísmica 3, uso similar\n2. **Hospital Norte Lima** — Zona sísmica 4, categoría A2\n3. **Torre Empresarial Miraflores** — Zona sísmica 4, pórticos especiales\n\nTe recomiendo revisar la memoria de cálculo de Hospital Norte Lima (PRY-001) como referencia directa.", sources: ["PRY-001 Memoria de Cálculo V4", "PRY-003 Informe Preliminar"], confidence: 88 },
];

function IAEmpresarial() {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, []);

  return (
    <div>
      <SectionHeader title="IA Empresarial" subtitle="Conectada a la base de conocimiento interno · 1,247 documentos indexados" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-4 h-fit">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.textMuted }}>Consultas recientes</p>
          {["Normativa E.030 zona sísmica 4", "Proceso de aprobación de planos", "Estándares BIM LOD 300", "Plantilla de memoria descriptiva"].map(q => (
            <button key={q} className="w-full text-left text-xs py-2 px-3 rounded-lg mb-1 hover:bg-white/5 transition-colors" style={{ color: C.textSub }}>
              {q}
            </button>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} className="mt-3 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.textMuted }}>Categorías</p>
            {["Normativas", "Procedimientos", "Proyectos", "Plantillas"].map(c => (
              <div key={c} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                <span className="text-xs" style={{ color: C.textSub }}>{c}</span>
                <ChevronRight size={11} style={{ color: C.textMuted }} />
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl flex flex-col md:col-span-3" style={{ height: 540 } as any}>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "ai"
                  ? <div style={{ background: C.purpleDim, color: C.purple }} className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"><Sparkles size={14} /></div>
                  : <Avatar name="Tú" size={32} color={C.blue} />}
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                  <div style={{ background: msg.role === "user" ? C.blue : C.bg, color: C.text, borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px" }}
                    className="p-4 text-sm leading-relaxed">
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  {msg.role === "ai" && "sources" in msg && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span style={{ color: C.green, background: C.greenDim }} className="text-[10px] px-2 py-0.5 rounded-full font-mono">Confianza: {(msg as any).confidence}%</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(msg as any).sources.map((s: string) => (
                          <span key={s} style={{ color: C.blue, background: C.blueDim2, border: `1px solid ${C.blue}20` }} className="text-[10px] px-2 py-0.5 rounded font-mono cursor-pointer hover:bg-blue-500/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div style={{ borderTop: `1px solid ${C.border}` }} className="p-4">
            <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12 }} className="flex items-center gap-3 px-4 py-3">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Consulta procedimientos, normativas, proyectos anteriores..."
                className="flex-1 bg-transparent text-sm outline-none" style={{ color: C.text }} />
              <button style={{ color: C.textMuted }} className="hover:text-blue-400 transition-colors"><Paperclip size={15} /></button>
              <button style={{ background: C.blue, color: "#fff" }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Send size={13} />
              </button>
            </div>
            <p className="text-[10px] mt-2 text-center" style={{ color: C.textMuted }}>
              Solo accede a información interna · Si no encuentra respuesta, escala al gerente automáticamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gestión del Conocimiento ───────────────────────────────────────────────
const conocimiento = [
  { titulo: "Procedimiento de Control de Calidad BIM", cat: "Procedimientos", tipo: "PDF", rating: 4.8, vistas: 234, actualizado: "jun 2026" },
  { titulo: "NTP E.030 — Diseño Sismorresistente 2018", cat: "Normativas", tipo: "PDF", rating: 4.9, vistas: 512, actualizado: "may 2026" },
  { titulo: "Curso: Coordinación BIM LOD 300-400", cat: "Capacitaciones", tipo: "Video", rating: 4.7, vistas: 89, actualizado: "jun 2026" },
  { titulo: "Hospital Norte Lima — Lecciones Aprendidas", cat: "Lecciones aprendidas", tipo: "DOCX", rating: 4.5, vistas: 67, actualizado: "may 2026" },
  { titulo: "Plantilla Memoria Descriptiva Estructural", cat: "Plantillas", tipo: "DOCX", rating: 4.6, vistas: 178, actualizado: "abr 2026" },
  { titulo: "Manual de Usuario ArcBIM v3.0", cat: "Manuales", tipo: "PDF", rating: 4.4, vistas: 145, actualizado: "mar 2026" },
];

const catIcons: Record<string, any> = {
  "Procedimientos": Shield, "Normativas": BookOpen, "Capacitaciones": GraduationCap,
  "Lecciones aprendidas": Lightbulb, "Plantillas": FileText, "Manuales": BookMarked
};
const catColors: Record<string, string> = {
  "Procedimientos": C.blue, "Normativas": C.red, "Capacitaciones": C.purple,
  "Lecciones aprendidas": C.yellow, "Plantillas": C.green, "Manuales": C.orange
};

function GestionConocimiento() {
  const [activecat, setActiveCat] = useState("Todos");
  const cats = ["Todos", "Procedimientos", "Normativas", "Capacitaciones", "Lecciones aprendidas", "Plantillas", "Manuales"];
  const filtered = activecat === "Todos" ? conocimiento : conocimiento.filter(k => k.cat === activecat);

  return (
    <div>
      <SectionHeader title="Gestión del Conocimiento" subtitle="Biblioteca inteligente · 1,247 documentos indexados"
        action={<div className="flex items-center gap-2" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px" }}>
          <Search size={14} style={{ color: C.textMuted }} />
          <input placeholder="Búsqueda semántica..." className="bg-transparent text-sm outline-none w-48" style={{ color: C.text }} />
        </div>} />

      <div className="flex gap-2 flex-wrap mb-6">
        {cats.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            style={{ background: activecat === c ? C.blue : C.card, color: activecat === c ? "#fff" : C.textMuted, border: `1px solid ${activecat === c ? C.blue : C.border}` }}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((k, i) => {
          const Icon = catIcons[k.cat] || FileText;
          const color = catColors[k.cat] || C.blue;
          return (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}` }}
              className="rounded-xl p-5 cursor-pointer hover:border-blue-500/30 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div style={{ background: color + "18", color }} className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                  {k.tipo === "Video" ? <Video size={16} /> : <Icon size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: C.text }} className="text-sm font-semibold leading-tight">{k.titulo}</p>
                  <span style={{ color, background: color + "18" }} className="text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block font-medium">{k.cat}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: C.textMuted }}>
                <div className="flex items-center gap-1">
                  <Star size={11} style={{ color: C.yellow }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{k.rating}</span>
                  <span>· {k.vistas} vistas</span>
                </div>
                <span>Act. {k.actualizado}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Calendario ─────────────────────────────────────────────────────────────
const calEvents: Record<number, { label: string; color: string }[]> = {
  3: [{ label: "Entrega ARQ-012", color: C.blue }],
  5: [{ label: "Revisión BIM Hospital Norte", color: C.orange }],
  7: [{ label: "Reunión MTC Perú", color: C.purple }],
  10: [{ label: "Entrega EST-002 V4", color: C.blue }],
  14: [{ label: "Alerta: Puente Vial Sur", color: C.red }],
  17: [{ label: "Capacitación BIM LOD", color: C.green }],
  21: [{ label: "Revisión mensual", color: C.orange }],
  25: [{ label: "Entrega Planta Industrial", color: C.blue }],
  28: [{ label: "Reunión directiva", color: C.purple }],
};

function Calendario() {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const firstDay = 2; // July 2026 starts on Wednesday
  const totalDays = 31;

  return (
    <div>
      <SectionHeader title="Calendario" subtitle="Julio 2026 · 9 eventos programados"
        action={<div className="flex gap-2">
          <Btn variant="outline" icon={ChevronLeft} size="sm" />
          <Btn variant="outline" icon={ChevronRight} size="sm" />
        </div>} />

      <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl overflow-hidden">
        <div className="grid grid-cols-7" style={{ borderBottom: `1px solid ${C.border}` }}>
          {days.map(d => (
            <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-wide" style={{ color: C.textMuted }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} style={{ borderBottom: `1px solid ${C.borderLight}`, borderRight: `1px solid ${C.borderLight}` }} className="min-h-[80px] p-2" />
          ))}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const events = calEvents[day] || [];
            const isToday = day === 1;
            return (
              <div key={day} style={{ borderBottom: `1px solid ${C.borderLight}`, borderRight: `1px solid ${C.borderLight}` }}
                className="min-h-[80px] p-2 hover:bg-white/[0.02] cursor-pointer transition-colors">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${isToday ? "bg-blue-500 text-white" : ""}`}
                  style={{ color: isToday ? "#fff" : C.textSub }}>
                  {day}
                </div>
                {events.map((ev, ei) => (
                  <div key={ei} style={{ background: ev.color + "20", color: ev.color, borderLeft: `2px solid ${ev.color}` }}
                    className="text-[9px] px-1.5 py-0.5 rounded-r mb-0.5 leading-tight font-medium truncate">
                    {ev.label}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard del Gerente ──────────────────────────────────────────────────
const retrabajosData = [
  { mes: "Feb", horas: 28 }, { mes: "Mar", horas: 34 }, { mes: "Abr", horas: 22 },
  { mes: "May", horas: 18 }, { mes: "Jun", horas: 25 }, { mes: "Jul", horas: 12 },
];

const cargaEquipo = [
  { nombre: "Ana Torres", carga: 92, horas: 48 },
  { nombre: "Carlos Mendoza", carga: 87, horas: 44 },
  { nombre: "Juan Pérez", carga: 78, horas: 40 },
  { nombre: "Roberto Silva", carga: 95, horas: 52 },
  { nombre: "María Quispe", carga: 65, horas: 33 },
];

function DashboardGerente() {
  const tooltipStyle = { background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 12 };
  return (
    <div>
      <SectionHeader title="Dashboard del Gerente" subtitle="Resumen ejecutivo · julio 2026" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Clock} label="Tiempo promedio revisión" value="2.4 días" delta="-0.3 días vs mes ant." deltaUp accent={C.green} />
        <KpiCard icon={AlertTriangle} label="Proyectos en riesgo" value="3" delta="+1 nuevo" deltaUp={false} accent={C.red} />
        <KpiCard icon={RefreshCw} label="Índice de retrabajo" value="8.2%" delta="-2.1% vs mes ant." deltaUp accent={C.green} />
        <KpiCard icon={Sparkles} label="Consultas IA resueltas" value="94%" delta="+3% vs mes ant." deltaUp accent={C.purple} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-5">
          <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15 }} className="mb-4">Horas de Retrabajo</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={retrabajosData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="horas" fill={C.orange} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-5">
          <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15 }} className="mb-4">Carga del Equipo</h3>
          <div className="space-y-3">
            {cargaEquipo.map(e => (
              <div key={e.nombre}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Avatar name={e.nombre} size={24} color={e.carga > 90 ? C.red : e.carga > 80 ? C.orange : C.blue} />
                    <span style={{ color: C.text }} className="text-xs font-medium">{e.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs">{e.horas}h</span>
                    <span style={{ color: e.carga > 90 ? C.red : e.carga > 80 ? C.orange : C.green, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs font-semibold">{e.carga}%</span>
                  </div>
                </div>
                <div style={{ background: C.borderLight, borderRadius: 99 }} className="h-1">
                  <div style={{ width: `${e.carga}%`, background: e.carga > 90 ? C.red : e.carga > 80 ? C.orange : C.blue, borderRadius: 99 }} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Star} label="Satisfacción cliente" value="4.7/5" delta="+0.2 vs trim. ant." deltaUp accent={C.yellow} />
        <KpiCard icon={Award} label="Indicador de calidad" value="91%" delta="+4% vs mes ant." deltaUp accent={C.green} />
        <KpiCard icon={Users} label="Ingenieros activos" value="18" delta="Estable" accent={C.blue} />
        <KpiCard icon={TrendingUp} label="Horas extras semana" value="142h" delta="+18h vs semana ant." deltaUp={false} accent={C.orange} />
      </div>
    </div>
  );
}

// ─── Perfil del Colaborador ─────────────────────────────────────────────────
function PerfilColaborador() {
  const [tab, setTab] = useState("proyectos");
  return (
    <div>
      <SectionHeader title="Perfil del Colaborador" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Profile card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-6 flex flex-col items-center text-center">
          <div style={{ background: C.blueDim, border: `2px solid ${C.blue}40` }} className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4">
            <span style={{ color: C.blue, fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 28 }}>AT</span>
          </div>
          <h3 style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 18 }}>Ana Torres</h3>
          <p style={{ color: C.textMuted }} className="text-sm mt-0.5">Ing. Civil Senior · BIM Manager</p>
          <div className="flex gap-2 mt-3">
            <Badge label="BIM Nivel 3" color={C.blue} bg={C.blueDim} />
            <Badge label="Senior" color={C.green} bg={C.greenDim} />
          </div>
          <div className="w-full mt-5 space-y-3">
            {[
              { l: "Especialidad", v: "Estructural / BIM" },
              { l: "Proyectos activos", v: "4" },
              { l: "Horas este mes", v: "168 h" },
              { l: "Productividad", v: "94%" },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between text-xs py-2" style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                <span style={{ color: C.textMuted }}>{l}</span>
                <span style={{ color: C.text, fontFamily: "'JetBrains Mono',monospace" }} className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="md:col-span-3">
          <div className="flex gap-0 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
            {["proyectos", "tareas", "capacitaciones", "certificaciones"].map(t => (
              <button key={t} onClick={() => setTab(t)} className="px-4 py-2.5 text-sm font-medium capitalize"
                style={{ color: tab === t ? C.blue : C.textMuted, borderBottom: tab === t ? `2px solid ${C.blue}` : "2px solid transparent", marginBottom: -1 }}>
                {t}
              </button>
            ))}
          </div>

          {tab === "proyectos" && (
            <div className="space-y-3">
              {proyectos.filter(p => p.responsable === "Ana Torres").concat(proyectos.slice(0, 2)).map(p => (
                <div key={p.id} style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-4 flex items-center gap-4">
                  <div style={{ background: C.blueDim2, color: C.blue }} className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: C.text }} className="text-sm font-medium">{p.nombre}</p>
                    <p style={{ color: C.textMuted }} className="text-xs">{p.cliente}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={p.estado} />
                    <p style={{ color: C.textMuted, fontFamily: "'JetBrains Mono',monospace" }} className="text-xs mt-1">{p.avance}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "capacitaciones" && (
            <div className="space-y-3">
              {[
                { titulo: "Coordinación BIM LOD 300-400", estado: "Completado", fecha: "may 2026", horas: 16 },
                { titulo: "NTP E.030 Actualización 2024", estado: "Completado", fecha: "abr 2026", horas: 8 },
                { titulo: "Gestión de Proyectos BIM", estado: "En progreso", fecha: "jul 2026", horas: 24 },
              ].map((c, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-4 flex items-center gap-4">
                  <div style={{ background: C.purpleDim, color: C.purple }} className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={16} />
                  </div>
                  <div className="flex-1">
                    <p style={{ color: C.text }} className="text-sm font-medium">{c.titulo}</p>
                    <p style={{ color: C.textMuted }} className="text-xs">{c.fecha} · {c.horas}h</p>
                  </div>
                  <Badge label={c.estado} color={c.estado === "Completado" ? C.green : C.orange} bg={c.estado === "Completado" ? C.greenDim : C.orangeDim} />
                </div>
              ))}
            </div>
          )}

          {tab === "certificaciones" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { titulo: "BIM Manager Certified", emisor: "buildingSMART", año: 2025, color: C.blue },
                { titulo: "Revit Architecture Pro", emisor: "Autodesk", año: 2024, color: C.purple },
                { titulo: "PMP — Project Management", emisor: "PMI", año: 2023, color: C.green },
                { titulo: "NTP E.030 Specialist", emisor: "SENCICO Perú", año: 2024, color: C.orange },
              ].map((c, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl p-4">
                  <div style={{ color: c.color, background: c.color + "18" }} className="w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                    <Award size={16} />
                  </div>
                  <p style={{ color: C.text }} className="text-sm font-semibold">{c.titulo}</p>
                  <p style={{ color: C.textMuted }} className="text-xs mt-0.5">{c.emisor} · {c.año}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "tareas" && (
            <div className="space-y-2">
              {["Revisar plano estructural E-12", "Aprobar memoria de cálculo V3", "Responder observación OB-041", "Actualizar modelo IFC coordinado", "Presentar avance semanal"].map((t, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}` }} className="rounded-xl px-4 py-3 flex items-center gap-3">
                  <div style={{ border: `1.5px solid ${i < 2 ? C.green : C.border}`, background: i < 2 ? C.greenDim : "transparent" }}
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0">
                    {i < 2 && <Check size={9} style={{ color: C.green }} />}
                  </div>
                  <span style={{ color: i < 2 ? C.textMuted : C.text, textDecoration: i < 2 ? "line-through" : "none" }} className="text-sm">{t}</span>
                  {i === 2 && <Badge label="Urgente" color={C.red} bg={C.redDim} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────
const navItems: { id: Module; label: string; icon: any; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "proyectos", label: "Proyectos", icon: Building2, badge: 12 },
  { id: "archivos", label: "Archivos", icon: FolderOpen },
  { id: "bim", label: "Visor BIM", icon: Box },
  { id: "observaciones", label: "Observaciones", icon: AlertCircle, badge: 31 },
  { id: "notificaciones", label: "Notificaciones", icon: Bell, badge: 3 },
  { id: "ia", label: "IA Empresarial", icon: Sparkles },
  { id: "conocimiento", label: "Conocimiento", icon: BookOpen },
  { id: "calendario", label: "Calendario", icon: Calendar },
  { id: "gerente", label: "Dashboard Gerente", icon: BarChart3 },
  { id: "perfil", label: "Mi Perfil", icon: User },
];

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<Module>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const moduleMap: Record<Module, React.ReactNode> = {
    dashboard: <DashboardEjecutivo />,
    proyectos: <GestionProyectos />,
    archivos: <CentroArchivos />,
    bim: <VisorBIM />,
    observaciones: <SistemaObservaciones />,
    notificaciones: <CentroNotificaciones />,
    ia: <IAEmpresarial />,
    conocimiento: <GestionConocimiento />,
    calendario: <Calendario />,
    gerente: <DashboardGerente />,
    perfil: <PerfilColaborador />,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: C.bg, fontFamily: "'Inter',sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: collapsed ? 64 : 220, background: C.sidebar, borderRight: `1px solid ${C.borderLight}`, transition: "width 0.2s ease", flexShrink: 0 }}
        className="flex flex-col overflow-hidden">

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0" style={{ borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ background: C.blue, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Box size={16} color="#fff" />
          </div>
          {!collapsed && (
            <div>
              <p style={{ color: C.text, fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>ArcBIM</p>
              <p style={{ color: C.textMuted, fontSize: 10 }}>Plataforma AEC</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto hover:opacity-70 transition-opacity flex-shrink-0" style={{ color: C.textMuted }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
          {navItems.map(item => {
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => setActive(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left relative"
                style={{
                  background: isActive ? C.blueDim : "transparent",
                  color: isActive ? C.blue : C.textMuted,
                }}>
                <item.icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && <span className="text-sm font-medium flex-1 truncate">{item.label}</span>}
                {!collapsed && item.badge && item.badge > 0 && (
                  <span style={{ background: isActive ? C.blue : C.card, color: isActive ? "#fff" : C.textMuted, border: `1px solid ${C.border}` }}
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-mono leading-none">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && item.badge > 0 && (
                  <span style={{ background: C.blue, color: "#fff", position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", fontSize: 0 }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ borderTop: `1px solid ${C.borderLight}` }} className="p-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar name="Ana Torres" size={32} color={C.blue} />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p style={{ color: C.text }} className="text-xs font-semibold truncate">Ana Torres</p>
                <p style={{ color: C.textMuted }} className="text-[10px] truncate">BIM Manager</p>
              </div>
            )}
            {!collapsed && (
              <button style={{ color: C.textMuted }} className="hover:opacity-70 transition-opacity">
                <Settings size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header style={{ background: C.sidebar, borderBottom: `1px solid ${C.borderLight}` }}
          className="flex items-center justify-between px-6 py-3.5 flex-shrink-0">
          <div style={{ background: C.card, border: `1px solid ${C.border}` }} className="flex items-center gap-2 px-3 py-2 rounded-lg">
            <Search size={14} style={{ color: C.textMuted }} />
            <input placeholder="Buscar proyectos, archivos, observaciones..." className="bg-transparent text-sm outline-none w-64" style={{ color: C.text }} />
            <kbd style={{ color: C.textMuted, background: C.bg, border: `1px solid ${C.border}` }} className="text-[10px] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </div>
          <div className="flex items-center gap-3">
            <button style={{ color: C.textMuted, background: C.card, border: `1px solid ${C.border}` }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:border-blue-500/30 transition-colors relative"
              onClick={() => setActive("notificaciones")}>
              <Bell size={15} />
              <span style={{ background: C.red, position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", border: `1.5px solid ${C.sidebar}` }} />
            </button>
            <button style={{ color: C.textMuted, background: C.card, border: `1px solid ${C.border}` }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:border-blue-500/30 transition-colors"
              onClick={() => setActive("ia")}>
              <Sparkles size={15} />
            </button>
            <Avatar name="Ana Torres" size={32} color={C.blue} />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {moduleMap[active]}
        </main>
      </div>
    </div>
  );
}
