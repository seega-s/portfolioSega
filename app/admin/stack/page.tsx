"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Save, ArrowLeft, Plus, Trash2, GripVertical, Upload } from "lucide-react";

type Certification = { id: string; name_es: string; name_en: string; issuer: string; url: string; display_order: number; image_url?: string };
type StackTech = { id: string; list_id: string; name: string; icon_url: string; display_order: number };
type StackList = { id: string; name_es: string; name_en: string; display_order: number; stack_techs?: StackTech[] };

export default function AdminStack() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [certs, setCerts] = useState<Certification[]>([]);
  const [lists, setLists] = useState<StackList[]>([]);

  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  // Track initial state for change detection
  const initialDataRef = useRef<{ certs: string; lists: string }>({ certs: '', lists: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/certifications').then(res => res.json()),
      fetch('/api/admin/stack/lists').then(res => res.json())
    ]).then(([certData, listData]) => {
      const c = Array.isArray(certData) ? certData : [];
      const l = Array.isArray(listData) ? listData : [];
      setCerts(c);
      setLists(l);
      initialDataRef.current = { certs: JSON.stringify(c), lists: JSON.stringify(l) };
    }).finally(() => setLoading(false));
  }, []);

  // Detect changes
  useEffect(() => {
    if (loading) return;
    const currentCerts = JSON.stringify(certs);
    const currentLists = JSON.stringify(lists);
    const changed = currentCerts !== initialDataRef.current.certs || currentLists !== initialDataRef.current.lists;
    setHasChanges(changed);
  }, [certs, lists, loading]);

  // --- SAVE ALL ---
  const saveAll = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      // Save certifications (upsert all with updated order)
      const certsToSave = certs.map((c, i) => ({ ...c, display_order: i }));
      const certRes = await fetch('/api/admin/certifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certsToSave)
      });
      if (!certRes.ok) throw new Error('Error al guardar certificaciones');

      // Save lists (upsert all with updated order)
      const listsToSave = lists.map((l, i) => ({ id: l.id, name_es: l.name_es, name_en: l.name_en, display_order: i }));
      const listRes = await fetch('/api/admin/stack/lists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listsToSave)
      });
      if (!listRes.ok) throw new Error('Error al guardar listas');

      // Save techs for each list
      for (const list of lists) {
        if (!list.stack_techs || list.stack_techs.length === 0) continue;
        const techsToSave = list.stack_techs.map((t, i) => ({ ...t, display_order: i }));
        const techRes = await fetch('/api/admin/stack/techs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(techsToSave)
        });
        if (!techRes.ok) throw new Error(`Error al guardar tecnologías de ${list.name_es}`);
      }

      // Update initial data ref
      initialDataRef.current = { certs: JSON.stringify(certs), lists: JSON.stringify(lists) };
      setHasChanges(false);
      setSaveMessage({ type: 'success', text: '✓ Todo guardado correctamente' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error(error);
      setSaveMessage({ type: 'error', text: error.message || 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers for Certifications (local-only) ---
  const handleDragEndCerts = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(certs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCerts(items);
  };

  const addCert = async () => {
    const newCert = { name_es: "Nueva", name_en: "New", issuer: "", url: "" };
    const res = await fetch('/api/admin/certifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCert)
    });
    const data = await res.json();
    setCerts(prevCerts => [...prevCerts, data]);
  };

  const updateCertLocal = (id: string, field: string, value: string) => {
    setCerts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteCert = async (id: string) => {
    if (!confirm("¿Eliminar certificación?")) return;
    await fetch(`/api/admin/certifications?id=${id}`, { method: 'DELETE' });
    setCerts(prevCerts => prevCerts.filter(c => c.id !== id));
    initialDataRef.current.certs = JSON.stringify(certs.filter(c => c.id !== id));
  };

  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, certId: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "certs");

    setUploading({ ...uploading, [certId]: true });

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        updateCertLocal(certId, 'image_url', data.url);
      }
    } catch (error) {
      console.error(error);
      alert("Error al subir imagen de certificación");
    } finally {
      setUploading({ ...uploading, [certId]: false });
    }
  };

  // --- Handlers for Stack Lists (local-only) ---
  const handleDragEndLists = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(lists);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLists(items);
  };

  const addList = async () => {
    const newList = { name_es: "Nueva Lista", name_en: "New List" };
    const res = await fetch('/api/admin/stack/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newList)
    });
    const data = await res.json();
    data.stack_techs = [];
    setLists(prevLists => [...prevLists, data]);
  };

  const updateListLocal = (id: string, field: string, value: string) => {
    setLists(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const deleteList = async (id: string) => {
    if (!confirm("¿Eliminar lista y todas sus tecnologías?")) return;
    await fetch(`/api/admin/stack/lists?id=${id}`, { method: 'DELETE' });
    const newLists = lists.filter(l => l.id !== id);
    setLists(newLists);
    initialDataRef.current.lists = JSON.stringify(newLists);
  };

  // --- Handlers for Techs (local-only) ---
  const handleDragEndTechs = (result: DropResult, listId: string) => {
    if (!result.destination) return;

    const listIndex = lists.findIndex(l => l.id === listId);
    if (listIndex === -1) return;

    const newLists = [...lists];
    const techs = Array.from(newLists[listIndex].stack_techs || []);

    const [reorderedItem] = techs.splice(result.source.index, 1);
    techs.splice(result.destination.index, 0, reorderedItem);

    newLists[listIndex] = { ...newLists[listIndex], stack_techs: techs };
    setLists(newLists);
  };

  const addTech = async (listId: string) => {
    const newTech = { list_id: listId, name: "Nueva Tecnología", icon_url: "" };
    const res = await fetch('/api/admin/stack/techs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTech)
    });
    const data = await res.json();

    setLists(prevLists => prevLists.map(l => {
      if (l.id === listId) {
        return { ...l, stack_techs: [...(l.stack_techs || []), data] };
      }
      return l;
    }));
  };

  const updateTechLocal = (listId: string, techId: string, field: string, value: string) => {
    setLists(prevLists => prevLists.map(l => {
      if (l.id === listId) {
        return {
          ...l,
          stack_techs: (l.stack_techs || []).map(t => t.id === techId ? { ...t, [field]: value } : t)
        };
      }
      return l;
    }));
  };

  const deleteTech = async (listId: string, techId: string) => {
    if (!confirm("¿Eliminar tecnología?")) return;
    await fetch(`/api/admin/stack/techs?id=${techId}`, { method: 'DELETE' });

    const newLists = lists.map(l => {
      if (l.id === listId) {
        return { ...l, stack_techs: (l.stack_techs || []).filter(t => t.id !== techId) };
      }
      return l;
    });
    setLists(newLists);
    initialDataRef.current.lists = JSON.stringify(newLists);
  };

  const handleTechIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, listId: string, techId: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "icons");

    setUploading({ ...uploading, [techId]: true });

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        updateTechLocal(listId, techId, 'icon_url', data.url);
      }
    } catch (error) {
      console.error(error);
      alert("Error al subir icono");
    } finally {
      setUploading({ ...uploading, [techId]: false });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-zinc-500 p-8 font-mono">CARGANDO...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">STACK Y CERTIFICACIONES</h1>
          <p className="text-zinc-500 mt-2">Gestiona tus tecnologías y certificaciones</p>
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
            onClick={saveAll}
            disabled={saving || !hasChanges}
            className={`px-6 py-3 font-bold flex items-center gap-2 transition-colors ${
              hasChanges
                ? 'bg-[#f07635] text-white hover:bg-[#d86a30]'
                : 'border border-zinc-800 text-zinc-600 cursor-not-allowed'
            } disabled:opacity-50`}
          >
            <Save className="w-5 h-5" />
            {saving ? "GUARDANDO..." : hasChanges ? "GUARDAR TODO" : "SIN CAMBIOS"}
          </button>
        </div>
      </div>

      {/* Save message toast */}
      {saveMessage && (
        <div className={`mb-8 p-4 text-sm font-mono border ${
          saveMessage.type === 'success'
            ? 'border-green-800/50 text-green-400 bg-green-900/10'
            : 'border-red-800/50 text-red-400 bg-red-900/10'
        }`}>
          {saveMessage.text}
        </div>
      )}

      {/* Unsaved changes warning */}
      {hasChanges && (
        <div className="mb-8 p-4 text-sm font-mono border border-[#f07635]/30 text-[#f07635] bg-[#f07635]/5 flex items-center gap-3">
          <span className="text-lg">⚠</span>
          <span>Tienes cambios sin guardar. Pulsa &quot;GUARDAR TODO&quot; para persistirlos.</span>
        </div>
      )}

      <div className="space-y-8">

        {/* Certificaciones */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-bold">CERTIFICACIONES</h2>
            <button
              onClick={addCert}
              className="border border-zinc-800 text-zinc-400 px-4 py-2 text-sm font-bold hover:text-[#f07635] hover:border-[#f07635] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              AÑADIR CERTIFICACIÓN
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEndCerts}>
            <Droppable droppableId="certs">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {certs.map((cert, index) => (
                    <Draggable key={cert.id} draggableId={cert.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-black border border-zinc-800 p-4 flex items-center gap-4"
                        >
                          <div {...provided.dragHandleProps} className="text-zinc-600 hover:text-zinc-400 cursor-grab">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="col-span-1 md:col-span-5 flex items-center gap-4 mb-2">
                              {cert.image_url ? (
                                <img src={cert.image_url} alt="cert" className="w-16 h-16 object-contain bg-white/5 border border-zinc-800" />
                              ) : (
                                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500 flex-shrink-0">IMG</div>
                              )}
                              <div className="w-48 flex-shrink-0">
                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Imagen (SVG/PNG)</label>
                                <input
                                  type="file"
                                  accept="image/*,.svg"
                                  onChange={(e) => handleCertImageUpload(e, cert.id)}
                                  className="w-full text-[10px] text-zinc-600 file:mr-1 file:py-1 file:px-2 file:border file:border-zinc-800 file:bg-zinc-900 file:text-[10px] file:text-zinc-400 file:cursor-pointer"
                                />
                                {uploading[cert.id] && <span className="text-[10px] text-[#f07635] font-mono">SUBIENDO...</span>}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nombre (ES)</label>
                              <input
                                type="text"
                                value={cert.name_es}
                                onChange={(e) => updateCertLocal(cert.id, 'name_es', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm focus:border-[#f07635] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nombre (EN)</label>
                              <input
                                type="text"
                                value={cert.name_en}
                                onChange={(e) => updateCertLocal(cert.id, 'name_en', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm focus:border-[#f07635] outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Emisor</label>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertLocal(cert.id, 'issuer', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm focus:border-[#f07635] outline-none"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">URL Verificación</label>
                              <input
                                type="text"
                                value={cert.url || ''}
                                onChange={(e) => updateCertLocal(cert.id, 'url', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm focus:border-[#f07635] outline-none"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => deleteCert(cert.id)}
                            className="p-2 border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {certs.length === 0 && (
                    <p className="text-zinc-500 text-sm font-mono py-4">No hay certificaciones.</p>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Listas de Stack */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-bold">LISTAS DE TECNOLOGÍAS</h2>
            <button
              onClick={addList}
              className="border border-zinc-800 text-zinc-400 px-4 py-2 text-sm font-bold hover:text-[#f07635] hover:border-[#f07635] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              AÑADIR LISTA
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEndLists}>
            <Droppable droppableId="lists">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                  {lists.map((list, index) => (
                    <Draggable key={list.id} draggableId={list.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-black border border-zinc-800"
                        >
                          {/* List header */}
                          <div className="flex items-center gap-4 p-4 border-b border-zinc-800 bg-zinc-900/30">
                            <div {...provided.dragHandleProps} className="text-zinc-600 hover:text-zinc-400 cursor-grab">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={list.name_es}
                                onChange={(e) => updateListLocal(list.id, 'name_es', e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 px-4 py-2 font-bold focus:border-[#f07635] outline-none"
                                placeholder="Nombre (ES)"
                              />
                              <input
                                type="text"
                                value={list.name_en}
                                onChange={(e) => updateListLocal(list.id, 'name_en', e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 px-4 py-2 font-bold focus:border-[#f07635] outline-none"
                                placeholder="Name (EN)"
                              />
                            </div>
                            <button
                              onClick={() => deleteList(list.id)}
                              className="px-4 py-2 border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors font-bold text-sm flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              ELIMINAR
                            </button>
                          </div>

                          {/* Technologies inside the list */}
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-xs font-bold text-zinc-500 uppercase">Tecnologías ({(list.stack_techs || []).length})</span>
                              <button
                                onClick={() => addTech(list.id)}
                                className="text-xs font-bold text-zinc-500 hover:text-[#f07635] transition-colors flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                AÑADIR TECH
                              </button>
                            </div>

                            <DragDropContext onDragEnd={(res) => handleDragEndTechs(res, list.id)}>
                              <Droppable droppableId={`techs-${list.id}`}>
                                {(providedTechs) => (
                                  <div {...providedTechs.droppableProps} ref={providedTechs.innerRef} className="space-y-2">
                                    {(list.stack_techs || []).map((tech, techIndex) => (
                                      <Draggable key={tech.id} draggableId={tech.id} index={techIndex}>
                                        {(providedTech) => (
                                          <div
                                            ref={providedTech.innerRef}
                                            {...providedTech.draggableProps}
                                            className="bg-zinc-900/50 border border-zinc-800/50 p-3 flex items-center gap-4"
                                          >
                                            <div {...providedTech.dragHandleProps} className="text-zinc-600 hover:text-zinc-400 cursor-grab">
                                              <GripVertical className="w-4 h-4" />
                                            </div>

                                            {tech.icon_url ? (
                                              <img src={tech.icon_url} alt="icon" className="w-6 h-6 object-contain flex-shrink-0" />
                                            ) : (
                                              <div className="w-6 h-6 bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 flex-shrink-0">?</div>
                                            )}

                                            <div className="w-28 flex-shrink-0">
                                              <input
                                                type="file"
                                                accept="image/*,.svg"
                                                onChange={(e) => handleTechIconUpload(e, list.id, tech.id)}
                                                className="w-full text-[10px] text-zinc-600 file:mr-1 file:py-1 file:px-2 file:border file:border-zinc-800 file:bg-zinc-900 file:text-[10px] file:text-zinc-400 file:cursor-pointer"
                                              />
                                              {uploading[tech.id] && <span className="text-[10px] text-[#f07635] font-mono">SUBIENDO...</span>}
                                            </div>

                                            <input
                                              type="text"
                                              value={tech.name}
                                              onChange={(e) => updateTechLocal(list.id, tech.id, 'name', e.target.value)}
                                              className="flex-1 bg-black border border-zinc-800 px-3 py-1.5 text-sm focus:border-[#f07635] outline-none"
                                              placeholder="Nombre"
                                            />

                                            <button
                                              onClick={() => deleteTech(list.id, tech.id)}
                                              className="p-1.5 text-red-400/60 hover:text-red-400 transition-colors"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {providedTechs.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {lists.length === 0 && (
                    <p className="text-zinc-500 text-sm font-mono py-4">No hay listas creadas.</p>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Floating save bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#f07635]/30 p-4 z-50 flex items-center justify-center gap-6 backdrop-blur-sm">
          <span className="text-[#f07635] text-sm font-bold flex items-center gap-2">
            <span className="text-lg">⚠</span>
            CAMBIOS SIN GUARDAR
          </span>
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-[#f07635] text-white px-8 py-2.5 font-bold flex items-center gap-2 hover:bg-[#d86a30] transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "GUARDANDO..." : "GUARDAR TODO"}
          </button>
        </div>
      )}
    </div>
  );
}
