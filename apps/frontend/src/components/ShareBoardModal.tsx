import { QRCodeCanvas } from "qrcode.react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

type Props = {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    borderRadius: "0.75rem",
  },
};

const ShareBoardModal = ({ boardId, isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  const shareUrl = `${import.meta.env.VITE_APP_URL}/board/${boardId}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <ReactModal style={customStyles} isOpen={true} onRequestClose={onClose}>
      <div className="bg-neutral-900 rounded-xl p-6 w-[360px] shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4">Share board</h2>

        <div className="flex justify-center mb-4 bg-white p-2 rounded w-fit m-auto">
          <QRCodeCanvas value={shareUrl} size={160} />
        </div>

        <div className="flex items-center gap-2">
          <input
            value={shareUrl}
            readOnly
            className="flex-1 bg-neutral-800 text-white px-3 py-2 rounded-lg text-sm"
          />
          <button
            onClick={copyLink}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Copy
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-neutral-300 hover:text-white"
        >
          Close
        </button>
      </div>
    </ReactModal>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-neutral-900 rounded-xl p-6 w-[360px] shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4">Share board</h2>

        <div className="flex justify-center mb-4 bg-white p-2 rounded">
          <QRCodeCanvas value={shareUrl} size={160} />
        </div>

        <div className="flex items-center gap-2">
          <input
            value={shareUrl}
            readOnly
            className="flex-1 bg-neutral-800 text-white px-3 py-2 rounded-lg text-sm"
          />
          <button
            onClick={copyLink}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
          >
            Copy
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-sm text-neutral-300 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareBoardModal;
