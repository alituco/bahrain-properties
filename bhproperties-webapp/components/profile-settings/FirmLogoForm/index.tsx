'use client';

import React, { useRef, useState, ChangeEvent } from 'react';
import AvatarEditor  from 'react-avatar-editor';           // yarn add react-avatar-editor
import { Card, Button, Form, Row, Col, Modal, Spinner } from 'react-bootstrap';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Props {
  firmId       : number;
  initialUrl   : string | null;
  onUploaded   : (newUrl: string) => void;
}

const FirmLogoForm: React.FC<Props> = ({ firmId, initialUrl, onUploaded }) => {
  const editor  = useRef<AvatarEditor>(null);
  const [file , setFile ] = useState<File|null>(null);
  const [scale, setScale] = useState(1);
  const [busy , setBusy ] = useState(false);

  /* ------------- choose file ---------------------------------- */
  const handleChoose = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };


  // '/firms/:firmId/logo',

  /* ------------- upload --------------------------------------- */
  const handleUpload = async () => {
    if (!editor.current) return;
    setBusy(true);
    const canvas = editor.current.getImageScaledToCanvas();
    canvas.toBlob(async blob => {
      if (!blob) return setBusy(false);

      const fd = new FormData();
      fd.append('file', blob, 'logo.jpg');

      const r  = await fetch(`${API}/user/firms/${firmId}/logo`, {
        method: 'PUT',
        credentials: 'include',
        body: fd,
      });
      const j = await r.json();
      setBusy(false);
      if (!j.success) return alert(j.message || 'Upload failed');
      onUploaded(j.logo_url);
      setFile(null);                       // close modal
    }, 'image/jpeg', 0.9);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="card-title">Firm Logo</div>
      </Card.Header>

      <Card.Body>
        <Row className="g-4">
          {/* current logo -------------------------------------- */}
          <Col xs={12} md={4} className="text-center">
            <img
              src={initialUrl || 'https://placehold.co/200?text=Logo'}
              alt="logo"
              className="rounded border"
              style={{ width: 128, height: 128, objectFit: 'cover' }}
            />
          </Col>

          {/* controls ----------------------------------------- */}
          <Col xs={12} md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Choose image&nbsp;(.png/.jpg)</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleChoose} />
            </Form.Group>

            {file && (
              <>
                <AvatarEditor
                  ref={editor}
                  image={file}
                  width={200}
                  height={200}
                  border={20}
                  borderRadius={100}
                  scale={scale}
                  rotate={0}
                />

                <Form.Range
                  min={1}
                  max={3}
                  step={0.1}
                  value={scale}
                  className="mt-3"
                  onChange={e => setScale(+e.target.value)}
                />

                <Button
                  variant="primary"
                  disabled={busy}
                  onClick={handleUpload}
                >
                  {busy && <Spinner animation="border" size="sm" className="me-1" />}
                  Upload Logo
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FirmLogoForm;
