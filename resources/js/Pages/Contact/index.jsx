import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, Container, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import ModalUI from '@/Components/ModalUI';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Register from './Register';
import Edit from './Edit';
import axios from 'axios';
import Swal from 'sweetalert2'

function index({ auth, contactos }) {

    const {data,setData,delete: deleteRequest ,errors,reset} = useForm({
        valueDelete:''
    })

    // events update
    const [valueUpdate, setValueUpdate] = useState('');
    const [openRegister, setOpenRegister] = useState(false);
    const handleOpenRegister = () => setOpenRegister(true);
    const handleCloseRegister = () => setOpenRegister(false);

    const [openUpdate, setOpenUpdate] = useState(false);
    const handleOpenUpdate = async (value) => {

        try {
            const url = route('contact.edit',value)
            const response = await axios.get(url)
            const resp_data = await response.data.contacto
            console.log('resp_data: ',resp_data)
            setValueUpdate(resp_data)
        } catch (error) {
            console.error('Error al obtener el contacto:', error);
        }
        
        setOpenUpdate(true)
    };
    const handleCloseUpdate = () => setOpenUpdate(false);
    
    // eventos delete con inertia useForm
    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Este registro será eliminado permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Usa el método delete del hook useForm
                deleteRequest(route('contact.destroy', id), {
                    onSuccess: () => {
                        Swal.fire(
                            'Eliminado!',
                            'El registro ha sido eliminado.',
                            'success'
                        );
                        // Opcional: Puedes actualizar la lista de registros aquí
                    },
                    onError: () => {
                        Swal.fire(
                            'Error!',
                            'No se pudo eliminar el registro.',
                            'error'
                        );
                    }
                });
            }
        });
    };
    // evento delete con axio
    // const handleDelete = (id) => {
    //     Swal.fire({
    //         title: '¿Estás seguro?',
    //         text: "¡Este registro será eliminado permanentemente!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Sí, eliminar',
    //         cancelButtonText: 'Cancelar'
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             try {
    //                 // Usa axios para enviar la solicitud de eliminación
    //                 const response = await axios.delete(route('contact.destroy', id));
                    
    //                 if (response) {
    //                     Swal.fire(
    //                         'Eliminado!',
    //                         'El registro ha sido eliminado.',
    //                         'success'
    //                     );
    //                     // Opcional: Actualiza la lista de registros aquí
    //                 } else {
    //                     Swal.fire(
    //                         'Error!',
    //                         'No se pudo eliminar el registro.',
    //                         'error'
    //                     );
    //                 }
    //             } catch (error) {
    //                 console.error('Error al eliminar el registro:', error);
    //                 Swal.fire(
    //                     'Ups!',
    //                     'Fallo la eliminación del registro.',
    //                     'error'
    //                 );
    //             }
    //         }
    //     });
    // };
    
    const columns = [
        // { field: 'id', headerName: 'ID', width: 70 },
        { field: 'nombre', headerName: 'Nombre', width: 130 },
        { field: 'telefono', headerName: 'Teléfono', width: 130 },
        {
            field: 'avatar',
            headerName: 'Avatars',
            width: 130,
            renderCell: (params) => (
                <img
                    src={`/storage/${params.value}`}  // Ajusta la ruta según tu configuración
                    alt='Avatar'
                    style={{ width: 50, height: 50, borderRadius: '50%' }}  // Ajusta el estilo según tu preferencia
                />
                
            ),
        },
        {
            field: 'action',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        color="primary"
                        onClick={() => handleOpenUpdate(params.row.id)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
      ];
      
      const rows = contactos;
      
      const paginationModel = { page: 0, pageSize: 5 };

    return (
        <>
           <SnackbarProvider maxSnack={1}>
                <AuthenticatedLayout
                        user={auth.user}
                        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Contactos</h2>}
                    >
                    <Head title="Contactos" />

                    {/* modal de registro */}
                    <ModalUI 
                        open={openRegister}
                        close={handleCloseRegister}
                        title='Registrar contacto'
                        body= {<Register onClose={handleCloseRegister}/>}
                    />
                    {/* modal de update */}
                    <ModalUI 
                        open={openUpdate}
                        close={handleCloseUpdate}
                        title='Modificar contacto'
                        body= {<Edit onClose={handleCloseUpdate} 
                                idData={valueUpdate} 
                            />}
                    />

                    <Container maxWidth="xl" sx={{mt:'2rem'}}>
                        <Box component='div' sx={{width:'100%',margin:'auto'}}>
                            <Button variant="contained" color="primary" onClick={handleOpenRegister}>
                                Registrar
                            </Button>
                            <Paper sx={{ height: 'auto', width: 'auto',mt:'1rem' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    initialState={{ pagination: { paginationModel } }}
                                    pageSizeOptions={[5, 10]}
                                    
                                    sx={{ border: 0 }}
                                />
                            </Paper>
                        </Box>
                    </Container>

                </AuthenticatedLayout>
            </SnackbarProvider>
        </>
    )
}

export default index