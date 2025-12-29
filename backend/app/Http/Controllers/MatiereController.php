<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\MatiereRepositoryInterface;
use Illuminate\Http\Request;

class MatiereController extends Controller
{
    protected $matiereRepository;

    public function __construct(MatiereRepositoryInterface $matiereRepository)
    {
        $this->matiereRepository = $matiereRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json($this->matiereRepository->getAll());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'filiere_id' => 'required|exists:filieres,id',
            'enseignant_id' => 'nullable|exists:users,id',
        ]);

        $matiere = Matiere::create($request->all());

        return response()->json($matiere, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Matiere $matiere)
    {
        return response()->json($matiere->load('filiere'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Matiere $matiere)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:matieres,code,' . $matiere->id,
            'filiere_id' => 'required|exists:filieres,id',
        ]);

        $matiere->update($request->all());

        return response()->json($matiere);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Matiere $matiere)
    {
        $matiere->delete();

        return response()->json(['message' => 'Matiere deleted successfully']);
    }
}
