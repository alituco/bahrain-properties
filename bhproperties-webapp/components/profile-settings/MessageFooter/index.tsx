import SpkAlert from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";

interface Props {
  success?: string | null;
  error?: string | null;
}

const MessageFooter = ({ success, error }: Props) =>
  success || error ? (
    <SpkAlert variant={success ? "success" : "danger"} CustomClass="mb-0">
      {success || error}
    </SpkAlert>
  ) : null;

export default MessageFooter;
