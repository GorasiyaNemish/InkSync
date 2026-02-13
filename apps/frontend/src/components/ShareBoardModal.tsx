import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
};

const ShareBoardModal = ({ boardId, isOpen, onClose }: Props) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/board/${boardId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Share Board</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition p-1"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <QRCodeCanvas value={shareUrl} size={200} level="H" />
          </div>
        </div>

        <p className="text-center text-sm text-neutral-400 mb-6">
          Scan QR code or copy the link below to share this board
        </p>

        {/* Link Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-1">
            <input
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-white px-3 py-2 text-sm outline-none select-all"
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              onClick={copyLink}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${copied
                  ? "bg-green-600 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 text-xs text-neutral-500 bg-neutral-800/50 rounded-lg p-3">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Anyone with this link can join and collaborate on this board in real-time.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareBoardModal;
