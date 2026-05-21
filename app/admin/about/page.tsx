"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, ArrowLeft, Upload } from "lucide-react";

const defaultAboutEs = {
  title1: "HOLA,",
  title2: "SOY SEGA",
  p1: "Soy un desarrollador de software con sede en Murcia, especializado en construir productos digitales robustos y escalables.",
  p2: "Mi enfoque combina diseño funcional con ingeniería de alto rendimiento. Construyo interfaces que no solo se ven bien, sino que están optimizadas para la velocidad y la accesibilidad.",
  p3: "Actualmente enfocado en el ecosistema Next.js, React y Supabase.",
  philosophy: "FILOSOFÍA",
  philosophyText: "Menos es más. El código debe ser tan limpio y minimalista como el diseño.",
  experience: "EXPERIENCIA",
  experienceRole: "DESARROLLADOR FULL STACK",
  experienceDesc: "+3 años de experiencia construyendo aplicaciones web completas, desde la arquitectura de bases de datos hasta la interfaz de usuario."
};

const defaultAboutEn = {
  title1: "HELLO,",
  title2: "I AM SEGA",
  p1: "I am a software developer based in Murcia, specialized in building robust and scalable digital products.",
  p2: "My approach combines functional design with high-performance engineering. I build interfaces that not only look good but are optimized for speed and accessibility.",
  p3: "Currently focused on the Next.js, React, and Supabase ecosystem.",
  philosophy: "PHILOSOPHY",
  philosophyText: "Less is more. Code should be as clean and minimalist as the design.",
  experience: "EXPERIENCE",
  experienceRole: "FULL STACK DEVELOPER",
  experienceDesc: "+3 years of experience building full web applications, from database architecture to the user interface."
};

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [previewLang, setPreviewLang] = useState<'es' | 'en'>('es');

  const [config, setConfig] = useState({
    avatar_url: "",
    cv_url_es: "",
    cv_url_en: ""
  });
  
  const [contentEs, setContentEs] = useState(defaultAboutEs);
  const [contentEn, setContentEn] = useState(defaultAboutEn);

  useEffect(() => {
    fetch('/api/admin/about', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setConfig({
            avatar_url: data.avatar_url || "",
            cv_url_es: data.cv_url_es || "",
            cv_url_en: data.cv_url_en || ""
          });
          
          try {
            if (data.bio_es && data.bio_es.trim().startsWith("{")) {
              setContentEs(JSON.parse(data.bio_es));
            }
          } catch (e) { console.error("Error parsing bio_es"); }
          
          try {
            if (data.bio_en && data.bio_en.trim().startsWith("{")) {
              setContentEn(JSON.parse(data.bio_en));
            }
          } catch (e) { console.error("Error parsing bio_en"); }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof config) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "about");

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

  const saveConfig = async () => {
    setSaving(true);
    const payload = {
      ...config,
      bio_es: JSON.stringify(contentEs),
      bio_en: JSON.stringify(contentEn)
    };
    
    try {
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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

  const handleContentChange = (lang: 'es'|'en', field: keyof typeof defaultAboutEs, value: string) => {
    if (lang === 'es') setContentEs({ ...contentEs, [field]: value });
    else setContentEn({ ...contentEn, [field]: value });
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-zinc-500 p-8 font-mono">CARGANDO...</div>;
  }

  const currentContent = previewLang === 'es' ? contentEs : contentEn;

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SOBRE MÍ</h1>
          <p className="text-zinc-500 mt-2">Configura tu biografía, avatar y currículum</p>
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
        {/* Archivos multimedia */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-xl font-bold mb-6 border-b border-zinc-800 pb-4">ARCHIVOS MULTIMEDIA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-500 uppercase">Avatar (Foto de perfil)</label>
              {config.avatar_url && (
                <div className="mb-2">
                  <img src={config.avatar_url} alt="Avatar Preview" className="w-24 h-24 object-cover border border-zinc-800" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'avatar_url')}
                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:border file:border-zinc-800 file:bg-zinc-900 file:text-zinc-300 file:font-bold file:text-xs file:uppercase hover:file:bg-zinc-800 file:transition-colors file:cursor-pointer"
              />
              {uploading.avatar_url && <p className="text-[#f07635] text-xs font-mono">SUBIENDO...</p>}
            </div>

            {/* CV Español */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-500 uppercase">Curriculum (Español)</label>
              {config.cv_url_es && (
                <div className="mb-2">
                  <a href={config.cv_url_es} target="_blank" rel="noreferrer" className="text-sm text-[#f07635] hover:underline font-mono">
                    ↗ Ver archivo actual
                  </a>
                </div>
              )}
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, 'cv_url_es')}
                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:border file:border-zinc-800 file:bg-zinc-900 file:text-zinc-300 file:font-bold file:text-xs file:uppercase hover:file:bg-zinc-800 file:transition-colors file:cursor-pointer"
              />
              {uploading.cv_url_es && <p className="text-[#f07635] text-xs font-mono">SUBIENDO...</p>}
            </div>

            {/* CV Inglés */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-500 uppercase">Curriculum (English)</label>
              {config.cv_url_en && (
                <div className="mb-2">
                  <a href={config.cv_url_en} target="_blank" rel="noreferrer" className="text-sm text-[#f07635] hover:underline font-mono">
                    ↗ Ver archivo actual
                  </a>
                </div>
              )}
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, 'cv_url_en')}
                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:border file:border-zinc-800 file:bg-zinc-900 file:text-zinc-300 file:font-bold file:text-xs file:uppercase hover:file:bg-zinc-800 file:transition-colors file:cursor-pointer"
              />
              {uploading.cv_url_en && <p className="text-[#f07635] text-xs font-mono">SUBIENDO...</p>}
            </div>
          </div>
        </div>

        {/* Textos de la sección */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-bold">CONTENIDO DEL TEXTO (TEXTO Y FORMATO)</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewLang('es')}
                className={`px-4 py-2 font-bold text-sm transition-colors ${
                  previewLang === 'es'
                    ? 'bg-[#f07635] text-white'
                    : 'border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                }`}
              >
                ESPAÑOL
              </button>
              <button
                onClick={() => setPreviewLang('en')}
                className={`px-4 py-2 font-bold text-sm transition-colors ${
                  previewLang === 'en'
                    ? 'bg-[#f07635] text-white'
                    : 'border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                }`}
              >
                ENGLISH
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Título Principal */}
            <div className="space-y-4">
              <h3 className="text-[#f07635] font-bold text-sm border-b border-zinc-800 pb-2">TÍTULO PRINCIPAL</h3>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Parte 1 (Línea 1)</label>
                <input
                  type="text"
                  value={currentContent.title1}
                  onChange={(e) => handleContentChange(previewLang, 'title1', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Parte 2 (Línea 2 - Resaltada)</label>
                <input
                  type="text"
                  value={currentContent.title2}
                  onChange={(e) => handleContentChange(previewLang, 'title2', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none font-mono text-sm text-[#f07635]"
                />
              </div>
            </div>

            {/* Párrafos */}
            <div className="space-y-4">
              <h3 className="text-[#f07635] font-bold text-sm border-b border-zinc-800 pb-2">DESCRIPCIÓN (PÁRRAFOS)</h3>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Párrafo 1</label>
                <textarea
                  value={currentContent.p1}
                  onChange={(e) => handleContentChange(previewLang, 'p1', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none resize-none font-mono text-sm h-20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Párrafo 2</label>
                <textarea
                  value={currentContent.p2}
                  onChange={(e) => handleContentChange(previewLang, 'p2', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none resize-none font-mono text-sm h-20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Párrafo 3 (Destacado)</label>
                <textarea
                  value={currentContent.p3}
                  onChange={(e) => handleContentChange(previewLang, 'p3', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none resize-none font-mono text-sm h-16 font-bold"
                />
              </div>
            </div>

            {/* Filosofía */}
            <div className="space-y-4 lg:col-start-1">
              <h3 className="text-[#f07635] font-bold text-sm border-b border-zinc-800 pb-2">BLOQUE: FILOSOFÍA</h3>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Título de la sección</label>
                <input
                  type="text"
                  value={currentContent.philosophy}
                  onChange={(e) => handleContentChange(previewLang, 'philosophy', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none font-mono text-sm uppercase text-[#f07635]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Cita / Texto</label>
                <textarea
                  value={currentContent.philosophyText}
                  onChange={(e) => handleContentChange(previewLang, 'philosophyText', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none resize-none font-mono text-sm h-20 italic"
                />
              </div>
            </div>

            {/* Experiencia */}
            <div className="space-y-4">
              <h3 className="text-[#f07635] font-bold text-sm border-b border-zinc-800 pb-2">BLOQUE: EXPERIENCIA</h3>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Título de la sección</label>
                <input
                  type="text"
                  value={currentContent.experience}
                  onChange={(e) => handleContentChange(previewLang, 'experience', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none font-mono text-sm uppercase text-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Rol / Puesto (Efecto Scramble)</label>
                <input
                  type="text"
                  value={currentContent.experienceRole}
                  onChange={(e) => handleContentChange(previewLang, 'experienceRole', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none font-mono text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Descripción</label>
                <textarea
                  value={currentContent.experienceDesc}
                  onChange={(e) => handleContentChange(previewLang, 'experienceDesc', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none resize-none font-mono text-sm h-20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
