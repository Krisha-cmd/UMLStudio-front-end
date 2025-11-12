import React, { useMemo, useState } from "react";
import InfiniteCanvas from "../components/InfiniteCanvas";
import LeftPanel from "../components/LeftPanel";
import { CanvasModel } from "../models/CanvasModel";
import type { DiagramComponent } from "../models/DiagramComponent";
import DiagramAssociation from "../models/DiagramAssociation";
import UseCaseAssociation from "../models/UseCaseAssociation";

export const EditorPage: React.FC = () => {
  const model = useMemo(() => new CanvasModel({ cellSize: 48, majorEvery: 8, initialScale: 1 }), []);
  const [components, setComponents] = useState<DiagramComponent[]>([]);
  const [associations, setAssociations] = useState<DiagramAssociation[]>([]);

  const handleAdd = (c: DiagramComponent) => {
    // special payload to create an association
    const anyc = c as any;
    if (anyc && anyc.__createAssoc) {
      const src = components.find((p) => (p as any).id === anyc.sourceId);
      const tgt = components.find((p) => (p as any).id === anyc.targetId);
      if (src && tgt) {
        const assoc = new UseCaseAssociation(src, tgt, anyc.assocType ?? "includes");
        setAssociations((s) => [...s, assoc]);
      }
      return;
    }

    setComponents((s) => [...s, c]);
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", background: "#f7f7fb" }}>
      <LeftPanel canvasModel={model} existing={components} onAdd={handleAdd} />
      <div style={{ flex: 1 }}>
  <InfiniteCanvas model={model} background="#fff" showControls={true} components={components} associations={associations} />
      </div>
    </div>
  );
};

export default EditorPage;
