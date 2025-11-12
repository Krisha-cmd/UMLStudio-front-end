import { DiagramComponent } from "./DiagramComponent";

export type AssociationJSON = {
  id: string;
  type?: string;
  name?: string;
  sourceId: string;
  targetId: string;
};

/**
 * Abstract base for associations/edges between two DiagramComponent instances.
 *
 * The base class provides anchor-point calculations (so the edge always attaches
 * to the component border) and a default visual renderer (line + arrow + label).
 * Subclasses may override drawing style or routing logic.
 */
export abstract class DiagramAssociation {
  id: string;
  name?: string;
  source: DiagramComponent;
  target: DiagramComponent;

  constructor(source: DiagramComponent, target: DiagramComponent, name?: string) {
    this.id = (typeof crypto !== "undefined" && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2, 9);
    this.source = source;
    this.target = target;
    this.name = name;
  }

  getCenterOf(rect: { x: number; y: number; width: number; height: number }) {
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }

  /**
   * Compute an anchor point on the border of `rect` that lies on the line from
   * the rectangle center to the `toward` point. Returns coordinates in world units.
   */
  pointOnRectEdge(rect: { x: number; y: number; width: number; height: number }, toward: { x: number; y: number }) {
    const center = this.getCenterOf(rect);
    const tx = toward.x - center.x;
    const ty = toward.y - center.y;
    // If the target is exactly at center, return center
    if (Math.abs(tx) < 1e-6 && Math.abs(ty) < 1e-6) return center;

    const hx = rect.width / 2;
    const hy = rect.height / 2;

    // scale factors to reach the border along x or y
    const sx = Math.abs(tx) < 1e-6 ? Infinity : hx / Math.abs(tx);
    const sy = Math.abs(ty) < 1e-6 ? Infinity : hy / Math.abs(ty);
    const s = Math.min(sx, sy);
    const ax = center.x + tx * s;
    const ay = center.y + ty * s;
    return { x: ax, y: ay };
  }

  getSourceAnchor() {
    const rect = this.source.boundingBox();
    const targetCenter = this.getCenterOf(this.target.boundingBox());
    return this.pointOnRectEdge(rect, targetCenter);
  }

  getTargetAnchor() {
    const rect = this.target.boundingBox();
    const sourceCenter = this.getCenterOf(this.source.boundingBox());
    return this.pointOnRectEdge(rect, sourceCenter);
  }

  /**
   * Default renderer for a unidirectional association: a stroked line with an
   * arrow head at the target and an optional name label near the middle.
   *
   * The method assumes world coordinates (component x/y/width/height are in
   * world units); the caller should pass the canvas context and the current
   * scale (so points are multiplied by scale to convert to screen space).
   */
  draw(ctx: CanvasRenderingContext2D, scale = 1) {
    const sa = this.getSourceAnchor();
    const ta = this.getTargetAnchor();

    const sx = sa.x * scale;
    const sy = sa.y * scale;
    const tx = ta.x * scale;
    const ty = ta.y * scale;

    ctx.save();
    ctx.strokeStyle = "#333";
    ctx.fillStyle = "#333";
    ctx.lineWidth = Math.max(1, 2 * (scale || 1));
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // draw arrowhead at target
    const ang = Math.atan2(ty - sy, tx - sx);
    const ah = 8 * (scale || 1); // arrow size in pixels
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - ah * Math.cos(ang - Math.PI / 6), ty - ah * Math.sin(ang - Math.PI / 6));
    ctx.lineTo(tx - ah * Math.cos(ang + Math.PI / 6), ty - ah * Math.sin(ang + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // label (if provided) — draw near midpoint with a small background
    if (this.name) {
      const mx = (sx + tx) / 2;
      const my = (sy + ty) / 2;
      const padding = 6 * (scale || 1);
      ctx.font = `${12 * (scale || 1)}px sans-serif`;
      ctx.textBaseline = "middle";
      const text = this.name;
      const w = ctx.measureText(text).width;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(mx - w / 2 - padding / 2, my - 10 * (scale || 1) / 2 - padding / 2, w + padding, 10 * (scale || 1) + padding / 2);
      ctx.fillStyle = "#111";
      ctx.fillText(text, mx - w / 2 + w / 2, my);
    }

    ctx.restore();
  }

  toJSON(): AssociationJSON {
    return {
      id: this.id,
      type: (this as any).type ?? undefined,
      name: this.name,
      sourceId: (this.source as any).id,
      targetId: (this.target as any).id,
    };
  }

  /**
   * Helper to revive associations from JSON. `resolver` must map a component id
   * to a live DiagramComponent instance.
   */
  static reviveFromJSON(json: AssociationJSON, resolver: (id: string) => DiagramComponent | undefined): DiagramAssociation | null {
    const src = resolver(json.sourceId);
    const tgt = resolver(json.targetId);
    if (!src || !tgt) return null;
    // The base class is abstract; callers should instantiate concrete subclasses.
    // Here we return a minimal anonymous subclass instance that uses base drawing.
    class _Assoc extends DiagramAssociation {}
    const a = new _Assoc(src, tgt, json.name);
    a.id = json.id;
    return a;
  }
}

export default DiagramAssociation;
