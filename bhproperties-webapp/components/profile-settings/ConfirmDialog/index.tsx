import SpkAlert from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";

interface Props {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ text, onConfirm, onCancel }: Props) => (
  <div className="overlay-backdrop d-flex align-items-center justify-content-center">
    <SpkAlert variant="warning" CustomClass="p-4">
      <p className="fw-medium mb-3">{text}</p>
      <div className="d-flex gap-2 justify-content-end">
        <SpkButton Buttontype="button" Size="sm" Buttonvariant="secondary" onClickfunc={onCancel}>
          Cancel
        </SpkButton>
        <SpkButton Buttontype="button" Size="sm" Buttonvariant="primary" onClickfunc={onConfirm}>
          Yes, save
        </SpkButton>
      </div>
    </SpkAlert>
  </div>
);

export default ConfirmDialog;
