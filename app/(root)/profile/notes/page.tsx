"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Button, TextField, CircularProgress, IconButton } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';
import API_ENDPOINTS from '@/lib/apis';
import axios from '@/lib/axios';
import { useState } from 'react';

interface Note {
    id: string;
    content: string;
    created_at: string;
}

export default function NotesPage() {
    const t = useTranslations();
    const queryClient = useQueryClient();
    const [newNote, setNewNote] = useState('');
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const { data: notes, isLoading } = useQuery({
        queryKey: ['notes'],
        queryFn: async () => {
            const res = await axios.get(API_ENDPOINTS.notes.getAll({}));
            return res.data.data as Note[];
        }
    });

    const addNoteMutation = useMutation({
        mutationFn: async (content: string) => {
            const res = await axios.post(API_ENDPOINTS.notes.create({}), { content });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            setNewNote('');
        }
    });

    const deleteNoteMutation = useMutation({
        mutationFn: async (noteId: string) => {
            await axios.delete(API_ENDPOINTS.notes.delete(noteId, {}));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        }
    });

    const updateNoteMutation = useMutation({
        mutationFn: async ({ id, content }: { id: string; content: string }) => {
            const res = await axios.put(API_ENDPOINTS.notes.update(id, {}), { content });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            setEditingNote(null);
        }
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5">
                        {t('profile_tab.notes')}
                    </Typography>
                </Box>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder={t('notes.add_note_placeholder')}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<IconPlus size={20} />}
                        onClick={() => addNoteMutation.mutate(newNote)}
                        disabled={!newNote.trim()}
                    >
                        {t('notes.add_note')}
                    </Button>
                </Paper>

                <Box>
                    {(notes ?? []).map((note, index) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 2
                                }}
                            >
                                {editingNote?.id === note.id ? (
                                    <Box>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            value={editingNote.content}
                                            onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                            sx={{ mb: 2 }}
                                        />
                                        <Box display="flex" gap={1}>
                                            <Button
                                                variant="contained"
                                                onClick={() => updateNoteMutation.mutate({ id: note.id, content: editingNote.content })}
                                            >
                                                {t('common.save')}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setEditingNote(null)}
                                            >
                                                {t('common.cancel')}
                                            </Button>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {note.content}
                                        </Typography>
                                        <Box display="flex" justifyContent="flex-end" gap={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => setEditingNote(note)}
                                            >
                                                <IconEdit size={18} />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => deleteNoteMutation.mutate(note.id)}
                                            >
                                                <IconTrash size={18} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                )}
                            </Paper>
                        </motion.div>
                    ))}
                </Box>
            </motion.div>
        </Box>
    );
} 