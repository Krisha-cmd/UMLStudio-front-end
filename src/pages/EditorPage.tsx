import React, { useMemo, useState } from "react";
import InfiniteCanvas from "../components/InfiniteCanvas";
import LeftPanel from "../components/LeftPanel";
import { CanvasModel } from "../models/CanvasModel";
import type { DiagramComponent } from "../models/DiagramComponent";
import DiagramAssociation from "../models/DiagramAssociation";
import UseCaseAssociation from "../models/UseCaseAssociation";
import { LayoutManager } from "../models/LayoutManager";
import CanvasController from "../controller/CanvasController";

export const EditorPage: React.FC = () => {
  const model = useMemo(() => new CanvasModel({ cellSize: 48, majorEvery: 8, initialScale: 1 }), []);
  const [components, setComponents] = useState<DiagramComponent[]>([]);
  const [associations, setAssociations] = useState<DiagramAssociation[]>([]);
  const [selection, setSelection] = useState<any>({ kind: null });

  const controller = useMemo(() => new CanvasController(), []);
  // wire controller callbacks to update React state
  controller.onSelectionChange = (sel) => setSelection(sel);
  controller.onComponentMove = (id: string, x: number, y: number) => {
    setComponents((prev) => {
      const next = prev.map((c) => {
        if ((c as any).id === id) {
          try {
            (c as any).moveTo?.(x, y);
          } catch {
            (c as any).x = x;
            (c as any).y = y;
          }
        }
        return c;
      });
      // recompute association offsets because positions changed (optional)
      LayoutManager.assignOffsetsForAll((associations as any) || []);
      return [...next];
    });
  };
  controller.onAssociationUpdated = (assoc) => {
    setAssociations((prev) => {
      const next = prev.map((a) => ((a as any).id === (assoc as any).id ? assoc : a));
      return [...next];
    });
  };

  const handleAdd = (c: DiagramComponent) => {
    // special payload to create an association
    const anyc = c as any;
    if (anyc && anyc.__createAssoc) {
      const src = components.find((p) => (p as any).id === anyc.sourceId);
      const tgt = components.find((p) => (p as any).id === anyc.targetId);
      if (src && tgt) {
        const assoc = new UseCaseAssociation(src, tgt, anyc.assocType ?? "includes");
        // Use functional update so we can compute offsets on the new array before setting state
        setAssociations((s) => {
          const next = [...s, assoc];
          // assign symmetric offsets for all pairs so parallel edges are spaced
          LayoutManager.assignOffsetsForAll(next);
          return next;
        });
      }
      return;
    }

    setComponents((s) => [...s, c]);
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", background: "#f7f7fb" }}>
      <LeftPanel canvasModel={model} existing={components} onAdd={handleAdd} selected={selection} onUpdateComponent={(id, patch) => {
        setComponents((prev) => {
          const next = prev.map((c) => {
            if ((c as any).id === id) {
              Object.assign(c as any, patch);
            }
            return c;
          });
          return [...next];
        });
      }} onUpdateAssociation={(assoc) => {
        setAssociations((prev) => prev.map((a) => ((a as any).id === (assoc as any).id ? assoc : a)));
      }} />
      <div style={{ flex: 1 }}>
  <InfiniteCanvas model={model} background="#fff" showControls={true} components={components} associations={associations} controller={controller} />
      </div>
    </div>
  );
};

export default EditorPage;
