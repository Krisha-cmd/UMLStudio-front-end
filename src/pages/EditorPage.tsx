import React, { useMemo, useState } from "react";
import InfiniteCanvas from "../components/InfiniteCanvas";
import LeftPanel from "../components/LeftPanel";
import { CanvasModel } from "../models/CanvasModel";
import type { DiagramComponent } from "../models/DiagramComponent";

export const EditorPage: React.FC = () => {
  const model = useMemo(() => new CanvasModel({ cellSize: 48, majorEvery: 8, initialScale: 1 }), []);
  const [components, setComponents] = useState<DiagramComponent[]>([]);

  const handleAdd = (c: DiagramComponent) => {
    setComponents((s) => [...s, c]);
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", background: "#f7f7fb" }}>
      <LeftPanel canvasModel={model} existing={components} onAdd={handleAdd} />
      <div style={{ flex: 1 }}>
        <InfiniteCanvas model={model} background="#fff" showControls={true} components={components} />
      </div>
    </div>
  );
};

export default EditorPage;
