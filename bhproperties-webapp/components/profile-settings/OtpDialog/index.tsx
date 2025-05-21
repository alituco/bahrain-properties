import { useState } from "react";
import SpkAlert from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";

interface Props {
  targetEmail: string;
  verifyFn: (otp: string) => Promise<void>;
  onCancel: () => void;
}

const OtpDialog = ({ targetEmail, verifyFn, onCancel }: Props) => {
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    await verifyFn(otp);
    setBusy(false);
  };

  return (
    <div className="overlay-backdrop d-flex align-items-center justify-content-center">
      <SpkAlert variant="info" CustomClass="p-4">
        <p className="fw-medium mb-3">
          Enter the OTP sent to <b>{targetEmail}</b>
        </p>
        <input
          className="form-control mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
          disabled={busy}
        />
        <div className="d-flex gap-2 justify-content-end">
          <SpkButton
            Buttontype="button"
            Size="sm"
            Buttonvariant="secondary"
            onClickfunc={onCancel}
            Disabled={busy}
          >
            Cancel
          </SpkButton>
          <SpkButton
            Buttontype="button"
            Size="sm"
            Buttonvariant="primary"
            onClickfunc={submit}
            Disabled={otp.length !== 6 || busy}
          >
            Verify
          </SpkButton>
        </div>
      </SpkAlert>
    </div>
  );
};

export default OtpDialog;
