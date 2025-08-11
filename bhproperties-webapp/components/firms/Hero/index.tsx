'use client';

import React, { useEffect, useState } from 'react';
import { Container, Form, InputGroup, Button, Row, Col, Card } from 'react-bootstrap';

interface Props {
  query: string;
  setQuery: (val: string) => void;
  minChars?: number;
}

const Hero: React.FC<Props> = ({ query, setQuery, minChars = 2 }) => {
  const [input, setInput] = useState(query ?? '');

  useEffect(() => {
    setInput(query ?? '');
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      setQuery('');
      return;
    }
    if (trimmed.length < minChars) return;
    setQuery(trimmed);
  };

  const canSearch = input.trim().length === 0 || input.trim().length >= minChars;

  return (
    <section
      style={{
        position: 'relative',
        backgroundImage:
          "linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55)), url('https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '45vh',
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card
              className="shadow-lg border-0 rounded-4"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)' }}
            >
              <Card.Body className="p-4 p-md-5 text-center">
                <h1 className="fw-semibold text-white mb-2">Find a Broker</h1>
                <p className="text-white-50 mb-4">Search Bahrain’s licensed brokers by name. Submit to apply the filter.</p>

                <Form onSubmit={handleSubmit} noValidate>
                  <InputGroup className="mx-auto" style={{ maxWidth: 640 }} size="lg">
                    <InputGroup.Text aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </InputGroup.Text>

                    <Form.Control
                      type="search"
                      placeholder={`Search by broker name…${minChars > 1 ? ` (min ${minChars} chars)` : ''}`}
                      aria-label="Search by broker name"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="py-2"
                    />

                    <Button
                      type="submit"
                      disabled={!canSearch}
                      variant="link"
                      className="px-4"
                      style={{ backgroundColor: '#1B365D', textDecoration: 'none', color: '#fff' }}
                    >
                      Search
                    </Button>
                  </InputGroup>
                </Form>

                <div className="mt-3 small text-white-50">
                  {minChars > 1 ? `Press Enter or click Search. At least ${minChars} characters.` : 'Press Enter or click Search.'}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;
