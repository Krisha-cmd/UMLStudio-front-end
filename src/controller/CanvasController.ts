import type { DiagramComponent } from "../models/DiagramComponent";
import type DiagramAssociation from "../models/DiagramAssociation";

export type Selection =
  | { kind: "component"; id: string; component: DiagramComponent }
  | { kind: "association"; id: string; association: DiagramAssociation }
  | { kind: null };

export class CanvasController {
  selected: Selection = { kind: null };

  // Callbacks set by the host (EditorPage)
  onSelectionChange?: (sel: Selection) => void;
  onComponentMove?: (id: string, x: number, y: number) => void;
  onAssociationUpdated?: (assoc: DiagramAssociation) => void;

  setSelection(sel: Selection) {
    this.selected = sel;
    if (this.onSelectionChange) this.onSelectionChange(sel);
  }

  clearSelection() {
    this.setSelection({ kind: null });
  }

  notifyComponentMove(id: string, x: number, y: number) {
    if (this.onComponentMove) this.onComponentMove(id, x, y);
  }

  notifyAssociationUpdated(assoc: DiagramAssociation) {
    if (this.onAssociationUpdated) this.onAssociationUpdated(assoc);
  }
}

export default CanvasController;
