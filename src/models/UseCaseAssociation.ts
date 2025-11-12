import DiagramAssociation from "./DiagramAssociation";
import { DiagramComponent } from "./DiagramComponent";

export type UseCaseAssocType = "extends" | "includes";

export class UseCaseAssociation extends DiagramAssociation {
  assocType: UseCaseAssocType;

  constructor(source: DiagramComponent, target: DiagramComponent, assocType: UseCaseAssocType = "includes") {
    super(source, target, assocType === "includes" ? "<<includes>>" : "<<extends>>");
    this.assocType = assocType;
    (this as any).type = "usecase-association";
  }

  draw(ctx: CanvasRenderingContext2D, scale = 1) {
    // custom styling based on assocType: dashed for <<includes>>, solid for <<extends>>
    const sa = this.getSourceAnchor();
    const ta = this.getTargetAnchor();
    const sx = sa.x * scale;
    const sy = sa.y * scale;
    const tx = ta.x * scale;
    const ty = ta.y * scale;

    ctx.save();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = Math.max(1, 2 * scale);

    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    // arrow head at target (hollow for extends, filled for includes)
    const ang = Math.atan2(ty - sy, tx - sx);
    const ah = 8 * (scale || 1);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - ah * Math.cos(ang - Math.PI / 6), ty - ah * Math.sin(ang - Math.PI / 6));
    ctx.lineTo(tx - ah * Math.cos(ang + Math.PI / 6), ty - ah * Math.sin(ang + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.stroke();

    // draw label (<<includes>> / <<extends>>) near middle
    if (this.name) {
      const mx = (sx + tx) / 2;
      const my = (sy + ty) / 2;
      ctx.fillStyle = "#111";
      ctx.font = `${12 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.name, mx, my - 10 * scale);
    }

    ctx.restore();
  }

  toJSON() {
    const base = super.toJSON();
    return { ...base, assocType: this.assocType } as any;
  }

  static fromJSON(json: any, resolver: (id: string) => DiagramComponent | undefined) {
    const src = resolver(json.sourceId);
    const tgt = resolver(json.targetId);
    if (!src || !tgt) return null;
    const assoc = new UseCaseAssociation(src, tgt, json.assocType ?? "includes");
    assoc.id = json.id ?? assoc.id;
    return assoc;
  }
}

export default UseCaseAssociation;
