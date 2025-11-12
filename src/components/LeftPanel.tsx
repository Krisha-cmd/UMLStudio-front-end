import React, { useState } from "react";
import LayoutManager from "../models/LayoutManager";
import { CanvasModel } from "../models/CanvasModel";
import { ActorComponent } from "../models/ActorComponent";
import type { DiagramComponent } from "../models/DiagramComponent";
import { UseCaseComponent } from "../models/UseCaseComponent";
import type { UseCaseAssocType } from "../models/UseCaseAssociation";

type Props = {
  canvasModel: CanvasModel;
  existing?: DiagramComponent[];
  onAdd?: (c: DiagramComponent) => void;
};

export const LeftPanel: React.FC<Props> = ({ canvasModel, existing = [], onAdd }) => {
  const [name, setName] = useState("Actor");
  const [mode, setMode] = useState<"actor" | "usecase" | "assoc">("actor");
  const [assocType, setAssocType] = useState<UseCaseAssocType>("includes");
  const [assocSource, setAssocSource] = useState<string | null>(null);
  const [assocTarget, setAssocTarget] = useState<string | null>(null);

  const onAddActor = () => {
    const spot = LayoutManager.findEmptySpot({
      canvasModel,
      existing: existing as DiagramComponent[],
      desiredWidth: 60,
      desiredHeight: 120,
    });

    const actor = new ActorComponent(name || "Actor", spot.x, spot.y);
    if (onAdd) onAdd(actor);
  };

  const onAddUseCase = () => {
    const spot = LayoutManager.findEmptySpot({
      canvasModel,
      existing: existing as DiagramComponent[],
      desiredWidth: 180,
      desiredHeight: 80,
    });
    const u = new UseCaseComponent(name || "UseCase", spot.x, spot.y);
    if (onAdd) onAdd(u);
  };

  const resetAssocSelection = () => {
    setAssocSource(null);
    setAssocTarget(null);
  };

  const onCreateAssoc = () => {
    if (!assocSource || !assocTarget) return;
    // emit a synthetic instruction via onAdd: we pass a special payload object
    if (onAdd) onAdd((() => {
      // placeholder: the EditorPage will intercept this special object and create the association
      return ({ __createAssoc: true, sourceId: assocSource, targetId: assocTarget, assocType } as any) as unknown as DiagramComponent;
    })());
    resetAssocSelection();
  };

  return (
    <div style={{ width: 260, padding: 12, borderRight: "1px solid #eee", background: "#fafafa", height: "100vh" }}>
      <h3 style={{ marginTop: 2 }}>Toolbox</h3>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 12, color: "#333" }}>Mode</label>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setMode("actor")} style={{ flex: 1 }} disabled={mode === "actor"}>Actor</button>
          <button onClick={() => setMode("usecase")} style={{ flex: 1 }} disabled={mode === "usecase"}>Use Case</button>
          <button onClick={() => setMode("assoc")} style={{ flex: 1 }} disabled={mode === "assoc"}>Association</button>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 12, color: "#333" }}>{mode === "assoc" ? "Association label/ type" : "Name"}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 8 }} />
      </div>

      {mode === "assoc" && (
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12, color: "#333" }}>Type</label>
          <select value={assocType} onChange={(e) => setAssocType(e.target.value as UseCaseAssocType)} style={{ width: "100%", padding: 8 }}>
            <option value="includes">&lt;&lt;includes&gt;&gt;</option>
            <option value="extends">&lt;&lt;extends&gt;&gt;</option>
          </select>
          <div style={{ marginTop: 8 }}>
            <label style={{ display: "block", fontSize: 12 }}>Source</label>
            <select value={assocSource ?? ""} onChange={(e) => setAssocSource(e.target.value || null)} style={{ width: "100%", padding: 8 }}>
              <option value="">-- select --</option>
              {existing.map((c: any) => {
                const id = (c as any).id ?? (c as any).model?.id ?? "";
                const name = (c as any).name ?? (c as any).model?.name ?? null;
                const typeLabel = (c as any).type ?? (c as any).model?.type ?? "component";
                const label = name ? `${typeLabel}: ${name}` : id ? `${typeLabel}: ${id.slice ? id.slice(0, 6) : id}` : "component";
                return (
                  <option key={id} value={id}>{label}</option>
                );
              })}
            </select>
            <label style={{ display: "block", fontSize: 12, marginTop: 6 }}>Target</label>
            <select value={assocTarget ?? ""} onChange={(e) => setAssocTarget(e.target.value || null)} style={{ width: "100%", padding: 8 }}>
              <option value="">-- select --</option>
              {existing.map((c: any) => {
                const id = (c as any).id ?? (c as any).model?.id ?? "";
                const name = (c as any).name ?? (c as any).model?.name ?? null;
                const typeLabel = (c as any).type ?? (c as any).model?.type ?? "component";
                const label = name ? `${typeLabel}: ${name}` : id ? `${typeLabel}: ${id.slice ? id.slice(0, 6) : id}` : "component";
                return (
                  <option key={id} value={id}>{label}</option>
                );
              })}
            </select>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={onCreateAssoc} style={{ flex: 1 }} disabled={!assocSource || !assocTarget}>Create</button>
              <button onClick={resetAssocSelection} style={{ flex: 1 }}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {mode === "actor" && <button onClick={onAddActor} style={{ padding: "8px 12px", width: "100%" }}>Add Actor</button>}
      {mode === "usecase" && <button onClick={onAddUseCase} style={{ padding: "8px 12px", width: "100%" }}>Add Use Case</button>}
    </div>
  );
};

export default LeftPanel;
