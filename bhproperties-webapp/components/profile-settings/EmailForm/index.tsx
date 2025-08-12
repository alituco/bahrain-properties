import { Form, Row, Col } from "react-bootstrap";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";

type Role = "admin" | "staff";

interface Props {
  email: string;
  setEmail: (v: string) => void;
  role: Role;
  firmCode: string;
  setFirmCode: (v: string) => void;
  requestOtp: () => void;
  saveCode: () => void;
}

const EmailForm = ({
  email,
  setEmail,
  role,
  firmCode,
  setFirmCode,
  requestOtp,
  saveCode,
}: Props) => (
  <Form onSubmit={(e) => e.preventDefault()}>
    <Form.Group as={Row} className="mb-3 px-4">
      <Form.Label column sm={3}>
        Email address
      </Form.Label>
      <Col sm={9}>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />
      </Col>
    </Form.Group>

    {role === "admin" && (
      <>
        <Form.Group as={Row} className="mb-2 px-4">
          <Form.Label column sm={3}>
            Firm registration code
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="text"
              value={firmCode}
              onChange={(e) => setFirmCode(e.target.value)}
              placeholder="e.g. BH-FIRM-001"
            />
          </Col>
        </Form.Group>
        <div className="text-end mb-3">
          <SpkButton
            Buttontype="button"
            Size="sm"
            Buttonvariant="primary1-light"
            onClickfunc={saveCode}
          >
            Save code
          </SpkButton>
        </div>
      </>
    )}

    <div className="text-end">
      <SpkButton
        Buttontype="button"
        Buttonvariant="primary"
        onClickfunc={requestOtp}
      >
        Save email
      </SpkButton>
    </div>
  </Form>
);

export default EmailForm;
