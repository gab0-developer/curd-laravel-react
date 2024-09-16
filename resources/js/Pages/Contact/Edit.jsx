import React, { useEffect } from 'react'
import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2';
import { useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

import { SnackbarProvider, useSnackbar } from 'notistack';

function Edit({idData,onClose}) {

    const { enqueueSnackbar } = useSnackbar();
    const { flash } = usePage().props;  // Accede a los mensajes de flash

    const inertiaContacto={
        nombre: idData.nombre,
        telefono: idData.telefono,
        avatar: null,
        visibilidad: idData.visible
    }
    const {data,setData,post,errors,reset} = useForm(inertiaContacto)

    // ! ATENCION: ----------------------------------------------------------------
    // aca deberia ser metodo put porque se actualizan los datos
    // pero debido a que el metodo put con useForm de iniertia no soporta la modificacion de archivos
    // preferiblemente se decicio optar por el metodo post y obviamente se definio la ruta como post en web.php. 
    // Sin embargo el metodo put funciona perfectamente con los datos pero no con archivos
    // ----------------------------------------------------------------

    const SubmitUpdateContacto = (e) => {
        e.preventDefault();

        post(route('contact.update',idData.id), {
            // respuesta del redireccionamiento
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
        <Box component='form' onSubmit={SubmitUpdateContacto} encType="multipart/form-data">
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
                <Grid size={{xs:12, md:6,sm:6}}>
                    <img  src={`/storage/${idData.avatar}`} alt="Avatar" style={{width: 100, height: 100, borderRadius: '50%'}} />
                </Grid>
                <Grid size={{xs:12, md:6,sm:6}}>
                        <Box>
                            <Typography variant="p" color="info">Cambiar imagen:</Typography>
                        </Box>
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

export default Edit


