"use client";

import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Note {
  note_id: string;
  parcel_no: string | null;
  firm_id: number;
  listing_id: number | null;
  user_id: number;
  note_text: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
}

interface NotesSectionProps {
  parcelNo: string;
  isAdmin: boolean;
  userFirstName: string;
  userLastName: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  parcelNo,
  isAdmin,
  userFirstName,
  userLastName
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState("");

  // Fetch notes (firm-specific on the backend via getNotesByFirm)
  useEffect(() => {
    if (!parcelNo) return;
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_URL}/property-notes?parcel_no=${parcelNo}`, {
          credentials: "include",
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          setNotes(data.notes); // only notes for the user's firm
        } else {
          console.error("Error fetching notes:", data.message);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };
    fetchNotes();
  }, [parcelNo]);

  // Add a new note
  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    try {
      const response = await fetch(`${API_URL}/property-notes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcel_no: parcelNo,
          note_text: newNoteText
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // The backend returns data.note with its user_id, etc.
        // We'll enhance it with userFirstName/LastName so it displays immediately.
        const newLocalNote: Note = {
          ...data.note,
          first_name: userFirstName,
          last_name: userLastName,
        };
        setNotes((prev) => [...prev, newLocalNote]);
        setNewNoteText("");
      } else {
        console.error("Error adding note:", data.message);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId: string) => {
    if (isAdmin) {
      const confirmDelete = window.confirm("Are you sure you want to delete this note?");
      if (!confirmDelete) return;
      try {
        const response = await fetch(`${API_URL}/property-notes/${noteId}`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          setNotes((prev) => prev.filter((note) => note.note_id !== noteId));
        } else {
          console.error("Error deleting note:", data.message);
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Property Notes
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Add a new note"
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddNote}>
          Add Note
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {notes && notes.length > 0 ? (
        <List>
          {notes.map((note) => {
            const authorName =
              note.first_name || note.last_name
                ? `${note.first_name || ""} ${note.last_name || ""}`.trim()
                : `User #${note.user_id}`;

            return (
              <ListItem
                key={note.note_id}
                secondaryAction={
                  <Tooltip
                    title={isAdmin ? "Delete this note" : "Only admins can remove properties"}
                  >
                    <span>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteNote(note.note_id)}
                        disabled={!isAdmin}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                }
              >
                <ListItemText
                  primary={`${authorName}: ${note.note_text}`}
                  secondary={`Created At: ${new Date(note.created_at).toLocaleString()}`}
                />
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography>No notes found for this parcel.</Typography>
      )}
    </Paper>
  );
};

export default NotesSection;
