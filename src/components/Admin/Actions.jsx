import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Actions = ({ id, deleteHandler, name, editRoute }) => {

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center gap-3">
                {editRoute !== "review" && (
                    <Link to={`/admin/${editRoute}/${id}`} className="text-blue-600 hover:bg-blue-200 p-1.5 rounded-full bg-blue-100 transition-all duration-200 shadow-sm hover:shadow">
                        <EditIcon />
                    </Link>
                )}
                <button onClick={() => setOpen(true)} className="text-red-600 hover:bg-red-200 p-1.5 rounded-full bg-red-100 transition-all duration-200 shadow-sm hover:shadow">
                    <DeleteIcon />
                </button>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        padding: '8px'
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" className="text-gray-800 font-bold">
                    {"Are you sure?"}
                </DialogTitle>
                <DialogContent>
                    <p className="text-gray-600">Do you really want to delete{name && <span className="font-medium text-gray-800">&nbsp;{name}</span>}? This process cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose} className="py-2 px-6 rounded-lg shadow-sm bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all duration-200 font-medium">Cancel</button>
                    <button onClick={() => deleteHandler(id)} className="py-2 px-6 ml-4 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow transition-all duration-200 font-medium">Delete</button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Actions;
