import React, { useState } from "react";
import LayoutManager from "../models/LayoutManager";
import { CanvasModel } from "../models/CanvasModel";
import { ActorComponent } from "../models/ActorComponent";
import type { DiagramComponent } from "../models/DiagramComponent";

type Props = {
  canvasModel: CanvasModel;
  existing?: DiagramComponent[];
  onAdd?: (c: DiagramComponent) => void;
};

export const LeftPanel: React.FC<Props> = ({ canvasModel, existing = [], onAdd }) => {
  const [name, setName] = useState("Actor");

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

  return (
    <div style={{ width: 260, padding: 12, borderRight: "1px solid #eee", background: "#fafafa", height: "100vh" }}>
      <h3 style={{ marginTop: 2 }}>Toolbox</h3>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 12, color: "#333" }}>Actor name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 8 }} />
      </div>
      <button onClick={onAddActor} style={{ padding: "8px 12px", width: "100%" }}>
        Add Actor
      </button>
    </div>
  );
};

export default LeftPanel;
