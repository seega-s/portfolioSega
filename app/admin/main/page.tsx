"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

type SectionItem = {
  key: string;
  label: string;
  visible: boolean;
  order: number;
};

const DEFAULT_SECTIONS: SectionItem[] = [
  { key: "hero", label: "Hero", visible: true, order: 0 },
  { key: "about", label: "About Me", visible: true, order: 1 },
  { key: "experience", label: "Experience", visible: true, order: 2 },
  { key: "tech", label: "Tech Stack", visible: true, order: 3 },
  { key: "projects", label: "Projects", visible: true, order: 4 },
  { key: "marquee", label: "Tech Marquee", visible: true, order: 5 },
  { key: "contact", label: "Contact", visible: true, order: 6 },
];

export default function AdminMain() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [config, setConfig] = useState({
    site_name: "",
    favicon_url: "",
    titles: [] as string[],
    subtitle_es: "",
    subtitle_en: "",
    github: "",
    linkedin: "",
    email: "",
    youtube: "",
    x: "",
    instagram: "",
    reddit: "",
    section_order: DEFAULT_SECTIONS as SectionItem[],
  });

  useEffect(() => {
    fetch('/api/admin/main', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setConfig({
            ...data,
            site_name: data.site_name || "",
            favicon_url: data.favicon_url || "",
            section_order: data.section_order && Array.isArray(data.section_order) 
              ? data.section_order 
              : DEFAULT_SECTIONS,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof config) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "main");

    setUploading({ ...uploading, [fieldName]: true });

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setConfig({ ...config, [fieldName]: data.url });
      } else {
        alert("Error uploading file");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading file");
    } finally {
      setUploading({ ...uploading, [fieldName]: false });
    }
  };

  const handleTitleChange = (index: number, value: string) => {
    const newTitles = [...config.titles];
    newTitles[index] = value;
    setConfig({ ...config, titles: newTitles });
  };

  const addTitle = () => {
    setConfig({ ...config, titles: [...config.titles, ""] });
  };

  const removeTitle = (index: number) => {
    const newTitles = config.titles.filter((_, i) => i !== index);
    setConfig({ ...config, titles: newTitles });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...config.section_order];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    
    [sections[index], sections[targetIndex]] = [sections[targetIndex], sections[index]];
    sections.forEach((s, i) => s.order = i);
    setConfig({ ...config, section_order: sections });
  };

  const toggleSectionVisibility = (index: number) => {
    const sections = [...config.section_order];
    sections[index] = { ...sections[index], visible: !sections[index].visible };
    setConfig({ ...config, section_order: sections });
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/main', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Configuración guardada exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-zinc-500 p-8 font-mono">CARGANDO...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PÁGINA PRINCIPAL</h1>
          <p className="text-zinc-500 mt-2">Configura los títulos, subtítulo y redes sociales del hero</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="border border-zinc-800 text-zinc-400 px-5 py-3 font-bold flex items-center gap-2 hover:text-[#f07635] hover:border-[#f07635] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            VOLVER AL PANEL
          </Link>
          <button
            onClick={saveConfig}
            disabled={saving}
            className="bg-[#f07635] text-white px-6 py-3 font-bold flex items-center gap-2 hover:bg-[#d86a30] transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Configuración Global del Sitio */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-xl font-bold mb-6 border-b border-zinc-800 pb-4">CONFIGURACIÓN GLOBAL DEL SITIO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Nombre Principal del Sitio (Pestaña / SEO)</label>
              <input
                type="text"
                name="site_name"
                value={config.site_name || ''}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 focus:border-[#f07635] outline-none"
                placeholder="Ej. Jaime Cegarra"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Favicon del Sitio</label>
              {config.favicon_url && (
                <div className="mb-2">
                  <img src={config.favicon_url} alt="Favicon Preview" className="w-12 h-12 object-contain border border-zinc-800 p-1" />
                </div>
              )}
              <input
                type="file"
                accept="image/*,.ico"
                onChange={(e) => handleFileUpload(e, 'favicon_url')}
                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:border file:border-zinc-800 file:bg-zinc-900 file:text-zinc-300 file:font-bold file:text-xs file:uppercase hover:file:bg-zinc-800 file:transition-colors file:cursor-pointer"
              />
              {uploading.favicon_url && <p className="text-[#f07635] text-xs font-mono mt-1">SUBIENDO...</p>}
            </div>
          </div>
        </div>
        {/* Títulos animados */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-bold">TÍTULOS ANIMADOS</h2>
            <button
              onClick={addTitle}
              className="border border-zinc-800 text-zinc-400 px-4 py-2 text-sm font-bold hover:text-[#f07635] hover:border-[#f07635] transition-colors"
            >
              + AÑADIR TÍTULO
            </button>
          </div>
          <div className="space-y-3">
            {config.titles.map((title, idx) => (
              <div key={idx} className="flex gap-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(idx, e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none"
                  placeholder="Ej. Software Engineer"
                />
                <button
                  onClick={() => removeTitle(idx)}
                  className="px-4 py-2 border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
            {config.titles.length === 0 && (
              <p className="text-zinc-500 text-sm font-mono">No hay títulos. Añade uno.</p>
            )}
          </div>
        </div>

        {/* Subtítulo */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-xl font-bold mb-6 border-b border-zinc-800 pb-4">SUBTÍTULO / BIO DEL HERO</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Español</label>
              <textarea
                name="subtitle_es"
                value={config.subtitle_es || ''}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 focus:border-[#f07635] outline-none h-32 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">English</label>
              <textarea
                name="subtitle_en"
                value={config.subtitle_en || ''}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 focus:border-[#f07635] outline-none h-32 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-xl font-bold mb-6 border-b border-zinc-800 pb-4">REDES SOCIALES Y ENLACES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'github', label: 'GitHub', placeholder: 'https://github.com/...' },
              { name: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
              { name: 'email', label: 'Email', placeholder: 'correo@ejemplo.com' },
              { name: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@...' },
              { name: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
              { name: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
              { name: 'reddit', label: 'Reddit', placeholder: 'https://reddit.com/u/...' }
            ].map(field => (
              <div key={field.name}>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={(config as any)[field.name] || ''}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section Ordering */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-xl font-bold mb-2 border-b border-zinc-800 pb-4">ORDEN DE SECCIONES</h2>
          <p className="text-zinc-500 text-sm font-mono mb-6">Reordena y muestra/oculta las secciones de la página principal.</p>
          <div className="space-y-2">
            {config.section_order
              .sort((a, b) => a.order - b.order)
              .map((section, idx) => (
              <div
                key={section.key}
                className={`flex items-center justify-between px-5 py-3 border transition-colors ${
                  section.visible 
                    ? 'border-zinc-700 bg-zinc-900/80' 
                    : 'border-zinc-800/50 bg-zinc-900/30 opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-zinc-600 font-mono text-xs w-6">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-bold text-sm uppercase tracking-wider ${
                    section.visible ? 'text-white' : 'text-zinc-600'
                  }`}>
                    {section.label}
                  </span>
                  <span className="text-zinc-700 font-mono text-xs">
                    ({section.key})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSectionVisibility(idx)}
                    className={`p-2 border transition-colors ${
                      section.visible
                        ? 'border-[#00A59B]/30 text-[#00A59B] hover:bg-[#00A59B]/10'
                        : 'border-zinc-800 text-zinc-600 hover:text-red-400 hover:border-red-900/50'
                    }`}
                    title={section.visible ? 'Ocultar sección' : 'Mostrar sección'}
                  >
                    {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => moveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 border border-zinc-800 text-zinc-500 hover:text-[#f07635] hover:border-[#f07635] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSection(idx, 'down')}
                    disabled={idx === config.section_order.length - 1}
                    className="p-2 border border-zinc-800 text-zinc-500 hover:text-[#f07635] hover:border-[#f07635] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
