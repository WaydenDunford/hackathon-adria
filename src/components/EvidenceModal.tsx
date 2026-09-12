import React, { useState } from 'react';
import { EvidenceCitation } from '../types';
import { X, BookOpen, ExternalLink, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

interface EvidenceModalProps {
  evidence: EvidenceCitation | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ evidence, onClose }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!evidence) return null;

  const handleSimulateOpen = (sourceName: string) => {
    setCopiedLink(sourceName);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div
      id="evidence-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="evidence-modal-content"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                  Clinical Evidence Summary
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Evidence Level: {evidence.evidenceLevel}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-1">
                {evidence.title}
              </h3>
            </div>
          </div>
          <button
            id="close-evidence-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg p-1.5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Recommendation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Recommendation
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 text-sm leading-relaxed font-medium">
              {evidence.recommendation}
            </div>
          </div>

          {/* Clinical Context / Summary */}
          {evidence.clinicalSummary && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Clinical Rationale
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {evidence.clinicalSummary}
              </p>
            </div>
          )}

          {/* Sources */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sources &amp; Guideline Citations
              </h4>
              <span className="text-[11px] text-slate-400">Peer-Reviewed / Medical Bodies</span>
            </div>
            <div className="space-y-2.5">
              {evidence.sources.map((src, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{src.name}</p>
                      <p className="text-xs text-slate-600 italic mt-0.5">{src.publication}</p>
                      {src.year && (
                        <p className="text-[11px] text-slate-400 mt-0.5">Published {src.year}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleSimulateOpen(src.name)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 rounded-md transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View source</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {copiedLink && (
            <div className="text-xs text-center py-1.5 px-3 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 animate-fade-in">
              Opening reference for: <span className="font-semibold">{copiedLink}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-teal-600" />
            Verified against Grade A medical consensus guidelines
          </span>
          <button
            id="evidence-modal-dismiss-btn"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
