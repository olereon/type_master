import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useAppStore } from '../store/useAppStore';
import { TextSource } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1000,
  margin: '0 auto',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const TextList = styled(Paper)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const TextListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TextPreview = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '400px',
}));

const TextSourceTab: React.FC = () => {
  const { textSources, activeTextSourceId, addTextSource, removeTextSource, setActiveTextSource } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<TextSource | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
  });

  const handleOpenDialog = (source?: TextSource) => {
    if (source) {
      setEditingSource(source);
      setFormData({ name: source.name, content: source.content });
    } else {
      setEditingSource(null);
      setFormData({ name: '', content: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSource(null);
    setFormData({ name: '', content: '' });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.content.trim()) return;

    if (editingSource) {
      // Update existing source
      const updatedSource: TextSource = {
        ...editingSource,
        name: formData.name,
        content: formData.content,
      };
      // Remove old and add updated
      removeTextSource(editingSource.id);
      addTextSource(updatedSource);
    } else {
      // Create new source
      const newSource: TextSource = {
        id: uuidv4(),
        name: formData.name,
        content: formData.content,
        type: 'custom',
        createdAt: new Date(),
      };
      addTextSource(newSource);
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (textSources.length > 1) {
      removeTextSource(id);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newSource: TextSource = {
          id: uuidv4(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          content: content.trim(),
          type: 'imported',
          createdAt: new Date(),
        };
        addTextSource(newSource);
      };
      reader.readAsText(file);
    }
  };

  const generateRandomText = () => {
    const sentences = [
      'The quick brown fox jumps over the lazy dog.',
      'Pack my box with five dozen liquor jugs.',
      'How vexingly quick daft zebras jump!',
      'The five boxing wizards jump quickly.',
      'Jackdaws love my big sphinx of quartz.',
      'We promptly judged antique ivory buckles for the next prize.',
      'A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent.',
      'The job requires extra pluck and zeal from every young wage earner.',
      'Jaded zombies acted quaintly but kept driving their oxen forward.',
      'All questions asked by five watched experts amaze the judge.',
    ];

    const numSentences = Math.floor(Math.random() * 5) + 5;
    const randomText = Array.from({ length: numSentences }, () =>
      sentences[Math.floor(Math.random() * sentences.length)]
    ).join(' ');

    const newSource: TextSource = {
      id: uuidv4(),
      name: `Random Text ${new Date().toLocaleString()}`,
      content: randomText,
      type: 'generated',
      createdAt: new Date(),
    };
    addTextSource(newSource);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Text Sources
      </Typography>

      <HeaderSection>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Custom Text
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            component="label"
          >
            Import from File
            <input
              type="file"
              hidden
              accept=".txt"
              onChange={handleFileUpload}
            />
          </Button>
          <Button
            variant="outlined"
            onClick={generateRandomText}
          >
            Generate Random
          </Button>
        </Box>
      </HeaderSection>

      <TextList elevation={0}>
        <List>
          {textSources.map((source) => (
            <TextListItem
              key={source.id}
              onClick={() => setActiveTextSource(source.id)}
              sx={{ cursor: 'pointer' }}
            >
              <IconButton
                edge="start"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTextSource(source.id);
                }}
              >
                {activeTextSourceId === source.id ? (
                  <RadioButtonCheckedIcon color="primary" />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
              </IconButton>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography>{source.name}</Typography>
                    <Chip
                      label={source.type}
                      size="small"
                      color={
                        source.type === 'custom'
                          ? 'primary'
                          : source.type === 'imported'
                          ? 'secondary'
                          : 'default'
                      }
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <TextPreview>{source.content}</TextPreview>
                    <Typography variant="caption" color="text.secondary">
                      {source.content.length} characters • {Math.ceil(source.content.split(/\s+/).length)} words
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDialog(source);
                  }}
                  disabled={source.id === 'default'}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(source.id);
                  }}
                  disabled={source.id === 'default' || textSources.length <= 1}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </TextListItem>
          ))}
        </List>
      </TextList>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSource ? 'Edit Text Source' : 'Add Custom Text Source'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Text Content"
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            helperText={`${formData.content.length} characters, ${Math.ceil(formData.content.split(/\s+/).filter(Boolean).length)} words`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.name.trim() || !formData.content.trim()}
          >
            {editingSource ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TextSourceTab;