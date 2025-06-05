/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Box,
  Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { type TransitionProps } from '@mui/material/transitions';

const ModalTransition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} timeout={300} />;
});

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  itemName,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={ModalTransition}
      PaperProps={{
        sx: {
          background: 'white',
          borderRadius: '16px',
          padding: '0px',
          width: '90%',
          maxWidth: '450px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          m: 0,
          p: 3,
          pb: 2,
          borderBottom: '2px solid #f1f5f9',
        }}>
        <Typography
          sx={{
            fontSize: '1.4rem',
            fontWeight: 600,
            color: '#1e293b',
          }}>
          Confirm Deletion
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#94a3b8',
            p: '4px',
            '&:hover': { background: '#f1f5f9', color: '#667eea' },
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2.5 }}>
        <DialogContentText
          sx={{ color: '#374151', fontSize: '1rem', lineHeight: 1.6 }}>
          Are you sure you want to delete the task{' '}
          {itemName ? (
            <Box component='strong' sx={{ color: '#1e293b' }}>
              "{itemName}"
            </Box>
          ) : (
            'this task'
          )}
          ?
          <br />
          <Typography
            component='span'
            sx={{
              color: '#64748b',
              fontSize: '0.9rem',
              mt: 0.5,
              display: 'block',
            }}>
            This action cannot be undone.
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2.5,
          borderTop: '2px solid #f1f5f9',
          gap: 1.5,
        }}>
        <Button
          onClick={onClose}
          sx={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '0.95rem',
            background: '#f8fafc',
            color: '#64748b',
            textTransform: 'none',
            '&:hover': { background: '#e2e8f0' },
          }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          sx={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '0.95rem',
            background: '#ef4444',
            color: 'white',
            textTransform: 'none',
            '&:hover': {
              background: '#dc2626',
            },
            '&:disabled': {
              opacity: 0.5,
              background: '#fca5a5',
              cursor: 'not-allowed',
            },
          }}>
          Delete Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
