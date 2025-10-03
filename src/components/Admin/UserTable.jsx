import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, deleteUser, getAllUsers } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import Actions from './Actions';

const UserTable = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { users, error } = useSelector((state) => state.users);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.profile);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isDeleted) {
            enqueueSnackbar("User Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_USER_RESET });
        }
        dispatch(getAllUsers());
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }

    const columns = [
        {
            field: "name",
            headerName: "Name",
            minWidth: 200,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                            <img draggable="false" src={params.row.avatar} alt={params.row.name} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <span className="font-medium text-gray-800">{params.row.name}</span>
                    </div>
                )
            },
        },
        {
            field: "email",
            headerName: "Email",
            minWidth: 200,
            flex: 0.2,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <span className="text-gray-600">{params.row.email}</span>
            )
        },
        {
            field: "gender",
            headerName: "Gender",
            minWidth: 100,
            flex: 0.1,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <span className="text-gray-600">{params.row.gender}</span>
            )
        },
        {
            field: "role",
            headerName: "Role",
            minWidth: 100,
            flex: 0.2,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return (
                    <>
                        {
                            params.row.role === "admin" ? (
                                <span className="text-sm bg-green-100 p-1 px-2 font-medium rounded-full text-green-800 capitalize">{params.row.role}</span>
                            ) : (
                                <span className="text-sm bg-purple-100 p-1 px-2 font-medium rounded-full text-purple-800 capitalize">{params.row.role}</span>
                            )
                        }
                    </>
                )
            },
        },
        {
            field: "registeredOn",
            headerName: "Registered On",
            type: "date",
            minWidth: 150,
            flex: 0.2,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <span className="text-gray-600">{params.row.registeredOn}</span>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 200,
            flex: 0.3,
            type: "number",
            sortable: false,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return (
                    <Actions editRoute={"user"} deleteHandler={deleteUserHandler} id={params.row.id} name={params.row.name} />
                );
            },
        },
    ];

    const rows = [];

    users && users.forEach((item) => {
        rows.unshift({
            id: item._id,
            name: item.name,
            avatar: item.avatar.url,
            email: item.email,
            gender: item.gender.toUpperCase(),
            role: item.role,
            registeredOn: new Date(item.createdAt).toISOString().substring(0, 10),
        });
    });

    return (
        <>
            <MetaData title="Admin Users | EyeGears" />

            {loading && <BackdropLoader />}

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                <h1 className="text-xl font-medium uppercase mb-4 text-gray-800">Users</h1>
                <div className="bg-white rounded-xl shadow-lg w-full overflow-hidden" style={{ height: 470 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectIconOnClick
                        sx={{
                            boxShadow: 0,
                            border: 0,
                            '& .MuiDataGrid-cell': {
                                borderBottom: 'none',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'rgba(138, 57, 225, 0.08)',
                                borderBottom: 'none',
                            },
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                            '& .super-app-theme--header': {
                                fontWeight: 'bold',
                                color: '#6b21a8'
                            },
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default UserTable;