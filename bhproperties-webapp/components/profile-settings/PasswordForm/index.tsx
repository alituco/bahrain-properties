import { Form, Row, Col } from "react-bootstrap";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";

interface Props {
  currentPw: string;
  setCurrentPw: (v: string) => void;
  newPw: string;
  setNewPw: (v: string) => void;
  confirmPw: string;
  setConfirmPw: (v: string) => void;
  submit: () => void;
}

const PasswordForm = ({
  currentPw,
  setCurrentPw,
  newPw,
  setNewPw,
  confirmPw,
  setConfirmPw,
  submit,
}: Props) => (
  <Form onSubmit={(e) => e.preventDefault()}>
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm={4}>
        Current password
      </Form.Label>
      <Col sm={8}>
        <Form.Control
          type="password"
          value={currentPw}
          onChange={(e) => setCurrentPw(e.target.value)}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm={4}>
        New password
      </Form.Label>
      <Col sm={8}>
        <Form.Control
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
        />
      </Col>
    </Form.Group>

    <Form.Group as={Row} className="mb-4">
      <Form.Label column sm={4}>
        Confirm
      </Form.Label>
      <Col sm={8}>
        <Form.Control
          type="password"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
        />
      </Col>
    </Form.Group>

    <div className="text-end">
      <SpkButton
        Buttontype="button"
        Buttonvariant="primary"
        Disabled={!newPw || newPw !== confirmPw}
        onClickfunc={submit}
      >
        Change password
      </SpkButton>
    </div>
  </Form>
);

export default PasswordForm;
