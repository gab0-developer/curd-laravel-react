import React, { useEffect } from 'react'
import { Box, Button, FormControl, MenuItem, Select, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2';
import { useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

import { SnackbarProvider, useSnackbar } from 'notistack';

function Register({onClose}) {

    const { enqueueSnackbar } = useSnackbar();
    const { flash } = usePage().props;  // Accede a los mensajes de flash

    const inertiaContacto={
        nombre: '',
        telefono: '',
        avatar: null,
        visibilidad: ''
    }
    const {data,setData,post,errors,reset} = useForm(inertiaContacto)

    
    const SubmitContacto = (e) => {
        e.preventDefault();

        post(route('contact.store'), {
            onSuccess: (page) => {
                // Accede al mensaje desde page.props.flash.success
                const successMessage = page.props.flash?.success;
                if (successMessage) {
                    enqueueSnackbar(successMessage, { variant: 'success' });
                    // cerrar modal
                    onClose()
                }
                // Resetear el formulario
                reset();
            },
            onError: (errors) => {
                // Si ocurre algún error
                enqueueSnackbar('Ocurrió un error', { variant: 'error' });
            }
        });
        
    };

  return (
    <>
        <Box component='form' onSubmit={SubmitContacto}>
            <Grid container spacing={2}>
                <Grid size={{xs:12, md:6,sm:6}}>
                        <TextField
                            fullWidth
                            type='text'
                            name='nombre'
                            id="nombre"
                            label="Nombre del cliente"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            variant="outlined" 
                        />
                        <InputError message={errors.nombre} className="mt-2" />
                </Grid>
                <Grid size={{xs:12, md:6,sm:6}}>
                        <TextField
                            fullWidth
                            type='number'
                            name='telefono'
                            id="telefono"
                            label="Telefono"
                            value={data.telefono}
                            onChange={(e) => setData('telefono', e.target.value)}
                            variant="outlined" 
                        />
                        <InputError message={errors.telefono} className="mt-2" />
                </Grid>
                <Grid size={{xs:12, md:6,sm:6}}>
                        <TextField
                            fullWidth
                            type='file'
                            name='avatar'
                            accept=".jpg,.jpeg,.png"
                            id="avatar"
                            label="avatar"
                            onChange={(e) => setData('avatar', e.target.files[0])}
                            variant="outlined" 
                        />
                        <InputError message={errors.avatar} className="mt-2" />
                </Grid>
                <Grid size={{xs:12, md:6,sm:6}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Seleccionar visibilidad</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name='visibilidad'
                            value={data.visibilidad}
                            label="Seleccionar visibilidad"
                            onChange={(e) => setData('visibilidad', e.target.value)}
                        >
                            <MenuItem value='public'>Público</MenuItem>
                            <MenuItem value='private'>Privado</MenuItem>
                        </Select>
                    </FormControl>
                    <InputError message={errors.visibilidad} className="mt-2" />
                </Grid>
            </Grid>
            <Box component='div' sx={{my:2,float:'right'}}>
                <Button type='submit' variant="contained" color="success" sx={{mr:1}} >
                    Registrar
                </Button>
                <Button variant="contained" color="error" onClick ={onClose}>
                    cerrar
                </Button>
            </Box>

        </Box>
    </>
  )
}

export default Register

