import React from "react";
import "./LeftStrip.css";

const LeftStrip: React.FC = () => {
  return (
    <div className="uml-leftstrip" aria-hidden={false}>
      <div className="uml-leftstrip-inner">
        <button className="ls-btn ls-pdf" title="Export to PDF"><i className="fas fa-file-pdf" aria-hidden /></button>
        <button className="ls-btn ls-svg" title="Export to SVG"><i className="fas fa-file-code" aria-hidden /></button>
        <button className="ls-btn ls-import" title="Import"><i className="fas fa-upload" aria-hidden /></button>
        <div className="ls-sep" />
        <button className="ls-btn ls-undo" title="Undo"><i className="fas fa-undo" aria-hidden /></button>
        <button className="ls-btn ls-redo" title="Redo"><i className="fas fa-redo" aria-hidden /></button>
        <div className="ls-spacer" />
        <button className="ls-btn ls-save" title="Save"><i className="fas fa-save" aria-hidden /></button>
      </div>
    </div>
  );
};

export default LeftStrip;
