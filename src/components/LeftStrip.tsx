import React from "react";
import { useDiagramContext } from "../context/DiagramContext";
import "./LeftStrip.css";

const LeftStrip: React.FC = () => {
  const diagCtx = useDiagramContext();
  return (
    <div className="uml-leftstrip" aria-hidden={false}>
      <div className="uml-leftstrip-inner">
        <button className="ls-btn ls-pdf" data-tooltip="Export to PDF"><i className="fas fa-file-pdf" aria-hidden /></button>
        <button className="ls-btn ls-svg" data-tooltip="Export to SVG"><i className="fas fa-file-code" aria-hidden /></button>
        <button className="ls-btn ls-import" data-tooltip="Import"><i className="fas fa-upload" aria-hidden /></button>
        <div className="ls-sep" />
        <button className="ls-btn ls-undo" data-tooltip="Undo" onClick={() => diagCtx.undo()}><i className="fas fa-undo" aria-hidden /></button>
        <button className="ls-btn ls-redo" data-tooltip="Redo" onClick={() => diagCtx.redo()}><i className="fas fa-redo" aria-hidden /></button>
        <div className="ls-spacer" />
        <button className="ls-btn ls-save" data-tooltip="Save" onClick={() => diagCtx.saveCurrent && diagCtx.saveCurrent()}><i className="fas fa-save" aria-hidden /></button>
      </div>
    </div>
  );
};

export default LeftStrip;
