<?php

namespace App\Http\Controllers;

use App\Http\Requests\Contact\ContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $userAuth = Auth::user()->id;
        $contactos = Contact::where('user_id', $userAuth)->get();
        return Inertia::render('Contact/index', compact('contactos'));
        // return Inertia::render('Contact/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContactRequest $request)
    {
        // user autenticado
         // Obtén el ID del usuario autenticado
        $userId = Auth::id(); // Utiliza Auth::id() para obtener el ID del usuario autenticado

        // Inicializa la variable para la ruta de la imagen
        $routeImage = '';

        // Verifica si se ha subido un archivo
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');

            // Almacena el archivo y guarda la ruta
            $routeImage = $file->store('avatars', ['disk' => 'public']);
        }

        // Crea el arreglo de datos con la información del contacto
        $contacto = Contact::create( [
            'nombre' => $request->nombre,
            'telefono' => $request->telefono,
            'avatar' => $routeImage, // Usa $routeImage en lugar de $request->routeImage
            'visible' => $request->visibilidad,
            'user_id' => $userId, // Usa $userId en lugar de $user
        ]);
        return redirect()->back()->with('success', 'Cliente registrado exitosamente');

    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        //
        return response()->json([
            'contacto' => $contact,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        //
        //  dd($request->all());
        // Inicializa la variable para la ruta de la imagen
        $routeImage = '';

        // Verifica si se ha subido un archivo
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');

            // Almacena el archivo y guarda la ruta
            $routeImage = $file->store('avatars', ['disk' => 'public']);

            if ($contact->avatar) {
                # code...
                Storage::delete('public/'. $contact->avatar);
            }
        }

        $contact->update([
            'nombre' => $request->nombre,
            'telefono' => $request->telefono,
            'avatar' => $routeImage, // Usa $routeImage en lugar de $request->routeImage
            'visible' => $request->visibilidad,
        ]);
        return redirect()->back()->with('success', 'Cliente modificado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        //
        // return $contact;
        // primero borrar la imagen del sistema luego por completo el registro de la base de datos
        if ($contact->avatar) {
            # code...
            Storage::delete('public/'. $contact->avatar);
        }
        $contact->delete();
        // Redirige a la página de índice con un mensaje de éxito
        // return response()->noContent();
        return redirect()->back();
    }
}
