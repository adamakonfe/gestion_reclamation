<?php

namespace App\Http\Controllers;

use App\Models\HistoriqueAction;
use App\Models\Notification;
use App\Models\Note;
use App\Repositories\Interfaces\DemandeRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DemandeController extends Controller
{
    protected $demandeRepository;

    public function __construct(DemandeRepositoryInterface $demandeRepository)
    {
        $this->demandeRepository = $demandeRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role->name;

        if ($role === 'student') {
            $demandes = $this->demandeRepository->getByUser($user->id);
        } elseif ($role === 'teacher') {
            $demandes = $this->demandeRepository->getByEnseignant($user->id);
        } else {
            // registrar and admin can see all
            $demandes = $this->demandeRepository->getAll();
        }

        return response()->json($demandes);
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
    public function store(Request $request)
    {
        $request->validate([
            'nom_prenom' => 'required|string',
            'filiere_niveau' => 'required|string',
            'matiere_id' => 'required|exists:matieres,id',
            'enseignant_nom' => 'nullable|string',
            'objet' => 'required|string',
            'objectif' => 'required|string',
            'motif' => 'required|string',
            'note_actuelle' => 'nullable|numeric|min:0|max:20',
            'note_demandee' => 'nullable|numeric|min:0|max:20',
            'justification' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $data = $request->all();
        $data['user_id'] = $request->user()->id;
        $data['statut'] = 'SOUMISE';

        if ($request->hasFile('justification')) {
            $data['justification'] = $request->file('justification')->store('justifications', 'public');
        }

        $demande = $this->demandeRepository->create($data);

        HistoriqueAction::create([
            'demande_id' => $demande->id,
            'user_id' => $request->user()->id,
            'action' => 'Création de la demande',
            'details' => 'Demande soumise',
        ]);

        return response()->json($demande->load(['user', 'matiere', 'enseignant']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $demande = $this->demandeRepository->findById($id);
        if (!$demande) {
            return response()->json(['message' => 'Demande introuvable'], 404);
        }
        return response()->json($demande->load(['user', 'matiere', 'enseignant', 'historiques.user']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function valider(Request $request, $id)
    {
        $demande = \App\Models\Demande::findOrFail($id);
        $user = $request->user();
        $role = $user->role->name;

        if ($role === 'registrar' && $demande->statut === 'SOUMISE') {
            $demande->update(['statut' => 'RECUE_SCOLARITE']);
            HistoriqueAction::create([
                'demande_id' => $demande->id,
                'user_id' => $user->id,
                'action' => 'Réception scolarité',
                'details' => $request->input('commentaire', 'Demande reçue par la scolarité'),
            ]);
            $demande->update(['commentaire_scolarite' => $request->input('commentaire')]);
            Notification::create([
                'user_id' => $demande->user_id,
                'message' => 'Votre demande a été reçue par la scolarité.',
                'type' => 'status_update',
                'demande_id' => $demande->id,
            ]);
        } elseif ($role === 'teacher' && $demande->statut === 'IMPUTEE_ENSEIGNANT') {
            $demande->update(['statut' => 'VALIDEE']);
            HistoriqueAction::create([
                'demande_id' => $demande->id,
                'user_id' => $user->id,
                'action' => 'Validation enseignant',
                'details' => $request->input('commentaire', 'Demande validée par l\'enseignant'),
            ]);
            $demande->update(['commentaire_enseignant' => $request->input('commentaire')]);
            Notification::create([
                'user_id' => $demande->user_id,
                'message' => 'Votre demande a été validée par l\'enseignant.',
                'type' => 'status_update',
                'demande_id' => $demande->id,
            ]);
        }

        return response()->json($demande);
    }

    public function envoyerAuDA(Request $request, $id)
    {
        $demande = \App\Models\Demande::findOrFail($id);
        $user = $request->user();

        if ($user->role->name === 'registrar' && in_array($demande->statut, ['SOUMISE', 'RECUE_SCOLARITE'])) {
            $demande->update(['statut' => 'ENVOYEE_DA']);
            HistoriqueAction::create([
                'demande_id' => $demande->id,
                'user_id' => $user->id,
                'action' => 'Transfert au DA',
                'details' => $request->input('commentaire', 'Demande transférée au Directeur Académique'),
            ]);
            $demande->update(['commentaire_scolarite' => $request->input('commentaire')]);
            return response()->json($demande);
        }

        return response()->json(['error' => 'Action non autorisée'], 403);
    }

    public function rejeter(Request $request, $id)
    {
        $demande = \App\Models\Demande::findOrFail($id);
        $user = $request->user();
        $role = $user->role->name;

        if ($role === 'registrar' && $demande->statut === 'SOUMISE') {
            $demande->update(['statut' => 'REJETEE_SCOLARITE']);
        } elseif ($role === 'teacher' && $demande->statut === 'IMPUTEE_ENSEIGNANT') {
            $demande->update(['statut' => 'NON_VALIDEE']);
        }

        HistoriqueAction::create([
            'demande_id' => $demande->id,
            'user_id' => $user->id,
            'action' => 'Rejet',
            'details' => $request->input('commentaire', 'Rejetée'),
        ]);

        if ($role === 'registrar') {
            $demande->update(['commentaire_scolarite' => $request->input('commentaire')]);
        } elseif ($role === 'teacher') {
            $demande->update(['commentaire_enseignant' => $request->input('commentaire')]);
        }

        return response()->json($demande);
    }

    public function imputer(Request $request, $id)
    {
        $request->validate(['enseignant_id' => 'required|exists:users,id']);
        $demande = \App\Models\Demande::findOrFail($id);
        $user = $request->user();

        if ($user->role->name === 'admin' && $demande->statut === 'ENVOYEE_DA') {
            $demande->update([
                'statut' => 'IMPUTEE_ENSEIGNANT',
                'enseignant_id' => $request->enseignant_id,
            ]);
            HistoriqueAction::create([
                'demande_id' => $demande->id,
                'user_id' => $user->id,
                'action' => 'Imputation',
                'details' => $request->input('commentaire', 'Demande imputée à l\'enseignant'),
            ]);
            Notification::create([
                'user_id' => $request->enseignant_id,
                'message' => 'Une nouvelle demande de correction vous a été assignée.',
                'type' => 'assignment',
                'demande_id' => $demande->id,
            ]);
        }

        return response()->json($demande);
    }

    public function corriger(Request $request, $id)
    {
        $request->validate(['nouvelle_note' => 'required|numeric|min:0|max:20']);
        $demande = \App\Models\Demande::findOrFail($id);
        $user = $request->user();

        if ($user->role->name === 'teacher' && $demande->statut === 'IMPUTEE_ENSEIGNANT') {
            $demande->update([
                'statut' => 'VALIDEE',
                'note_finale' => $request->nouvelle_note,
                'commentaire_enseignant' => $request->input('commentaire')
            ]);
            HistoriqueAction::create([
                'demande_id' => $demande->id,
                'user_id' => $user->id,
                'action' => 'Correction note',
                'details' => 'Note corrigée à ' . $request->nouvelle_note . '. ' . $request->input('commentaire'),
            ]);
            Notification::create([
                'user_id' => $demande->user_id,
                'message' => 'Votre note a été corrigée par l\'enseignant.',
                'type' => 'status_update',
                'demande_id' => $demande->id,
            ]);
        }

        return response()->json($demande);
    }
}
