import { CanvasModel } from "./CanvasModel";
import { DiagramComponent } from "./DiagramComponent";

/**
 * LayoutManager finds an empty spot near the canvas center to place new components.
 * It uses a simple outward-spiral search over a grid (based on cellSize) and
 * checks for intersections with existing components' bounding boxes.
 */
export class LayoutManager {
  static findEmptySpot(opts: {
    canvasModel: CanvasModel;
    existing: DiagramComponent[];
    desiredWidth?: number;
    desiredHeight?: number;
    // screen size in CSS pixels (optional). If omitted we fall back to window.innerWidth/innerHeight.
    screenWidth?: number;
    screenHeight?: number;
    // padding around the placed component in world units
    padding?: number;
  }): { x: number; y: number } {
    const { canvasModel, existing, desiredWidth = 80, desiredHeight = 80 } = opts;
    const screenW = opts.screenWidth ?? (typeof window !== "undefined" ? window.innerWidth : 800);
    const screenH = opts.screenHeight ?? (typeof window !== "undefined" ? window.innerHeight : 600);
    const padding = opts.padding ?? Math.min(canvasModel.cellSize, 16);

    const scale = canvasModel.scale;
    const offsetX = canvasModel.offsetX;
    const offsetY = canvasModel.offsetY;

    // Convert screen center to world coordinates
    const centerScreenX = screenW / 2;
    const centerScreenY = screenH / 2;
    const centerWorldX = (centerScreenX - offsetX) / scale;
    const centerWorldY = (centerScreenY - offsetY) / scale;

    // grid step (in world units) — use cellSize to keep placements aligned
    const step = Math.max(8, canvasModel.cellSize / 2);

    const maxRadius = Math.max(screenW, screenH) * 2; // in pixels; but we iterate in world units
    const maxSteps = Math.ceil(maxRadius / step);

    const rectIntersects = (x: number, y: number, w: number, h: number) => {
      const aLeft = x - padding;
      const aTop = y - padding;
      const aRight = x + w + padding;
      const aBottom = y + h + padding;
      for (const c of existing || []) {
        const b = c.boundingBox();
        if (aLeft <= b.x + b.width && aRight >= b.x && aTop <= b.y + b.height && aBottom >= b.y) {
          return true;
        }
      }
      return false;
    };

    // Spiral search starting at centerWorldX, centerWorldY
    if (!rectIntersects(centerWorldX, centerWorldY, desiredWidth, desiredHeight)) {
      return { x: Math.round(centerWorldX), y: Math.round(centerWorldY) };
    }

    for (let layer = 1; layer <= maxSteps; layer++) {
      // iterate around the square ring
      for (let i = -layer; i <= layer; i++) {
        const candidates = [
          { x: centerWorldX + i * step, y: centerWorldY - layer * step },
          { x: centerWorldX + i * step, y: centerWorldY + layer * step },
          { x: centerWorldX - layer * step, y: centerWorldY + i * step },
          { x: centerWorldX + layer * step, y: centerWorldY + i * step },
        ];
        for (const pt of candidates) {
          if (!rectIntersects(pt.x, pt.y, desiredWidth, desiredHeight)) {
            return { x: Math.round(pt.x), y: Math.round(pt.y) };
          }
        }
      }
    }

    // Fallback: place at center
    return { x: Math.round(centerWorldX), y: Math.round(centerWorldY) };
  }
}

export default LayoutManager;
