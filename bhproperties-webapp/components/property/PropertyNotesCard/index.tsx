"use client";

import React, { useEffect, useState } from "react";
import { Card, Form, Button, ListGroup, Spinner } from "react-bootstrap";
import SpkPopovers from "@/shared/@spk-reusable-components/reusable-uielements/spk-popovers";

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Note {
  note_id:string; user_id:number; note_text:string; created_at:string;
  first_name?:string; last_name?:string;
}

interface Props {
  parcelNo:string;
  isAdmin:boolean;
  userFirstName:string;
  userLastName:string;
}

const PropertyNotesCard:React.FC<Props>=({parcelNo,isAdmin,userFirstName,userLastName})=>{
  const [notes,setNotes] = useState<Note[]>([]);
  const [text,setText]   = useState("");
  const [busy,setBusy]   = useState(false);

  useEffect(()=>{
    (async()=>{
      const r=await fetch(`${API}/property-notes?parcel_no=${parcelNo}`,{credentials:"include"});
      if(r.ok){ const {notes}=await r.json(); setNotes(notes); }
    })();
  },[parcelNo]);

  async function add(){
    if(!text.trim()) return;
    setBusy(true);
    const r=await fetch(`${API}/property-notes`,{
      method:"POST",credentials:"include",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({parcel_no:parcelNo,note_text:text})
    });
    const {note}=await r.json();
    setNotes([...notes,{...note,first_name:userFirstName,last_name:userLastName}]);
    setText(""); setBusy(false);
  }

  async function del(id:string){
    if(!isAdmin) return;
    if(!confirm("Delete this note?")) return;
    await fetch(`${API}/property-notes/${id}`,{method:"DELETE",credentials:"include"});
    setNotes(notes.filter(n=>n.note_id!==id));
  }

  return(
    <Card className="custom-card mb-4">
      <Card.Header><div className="card-title">Notes</div></Card.Header>
      <Card.Body>
        <Form.Group className="d-flex mb-3 gap-2">
          <Form.Control
            value={text}
            onChange={e=>setText(e.target.value)}
            placeholder="Add a note..."
          />
          <Button onClick={add} disabled={busy}>
            {busy && <Spinner size="sm" className="me-1"/>}Post
          </Button>
        </Form.Group>

        {notes.length===0 ? (
          <span className="text-muted">No notes yet.</span>
        ):(
          <ListGroup>
            {notes.map(n=>{
              const author = n.first_name||n.last_name
                ? `${n.first_name??""} ${n.last_name??""}`.trim()
                : `User #${n.user_id}`;
              return (
                <ListGroup.Item key={n.note_id}
                  className="d-flex justify-content-between align-items-start">
                  <div>
                    <b>{author}</b> — {n.note_text}
                    <div className="text-muted fs-12">
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                  <SpkPopovers
                    content={isAdmin?"Delete note":"Admins only"}
                    placement="left" trigger="hover" rootClose>
                    <span>
                      <Button size="sm" variant="link"
                        disabled={!isAdmin}
                        onClick={()=>del(n.note_id)}>
                        <i className="ri-delete-bin-line"></i>
                      </Button>
                    </span>
                  </SpkPopovers>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default PropertyNotesCard;
