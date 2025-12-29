import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BookOpen, Users, Clock, Plus, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';

interface Subject {
    id: number;
    name: string;
    filiere: {
        name: string;
        nom: string;
        niveau: string;
    };
}

interface Filiere {
    id: number;
    name?: string;
    nom?: string;
    niveau: string;
}

export default function SubjectsPage() {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [filieres, setFilieres] = useState<Filiere[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [newName, setNewName] = useState('');
    const [selectedFiliereId, setSelectedFiliereId] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [subjectsRes, filieresRes] = await Promise.all([
                api.get('/matieres?my'),
                api.get('/filieres')
            ]);
            setSubjects(subjectsRes.data);
            setFilieres(filieresRes.data);
        } catch (error) {
            toast.error("Erreur lors de la récupération des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !selectedFiliereId) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        setIsSaving(true);
        try {
            const response = await api.post('/matieres', {
                name: newName,
                filiere_id: selectedFiliereId,
            });

            toast.success("Matière ajoutée avec succès !");
            setSubjects([response.data, ...subjects]);
            setIsDialogOpen(false);
            setNewName('');
            setSelectedFiliereId('');
        } catch (error) {
            toast.error("Erreur lors de l'ajout de la matière");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="animate-fade-in pb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">Mes Matières</h1>
                        <p className="text-muted-foreground">Consultez et gérez les matières qui vous sont assignées.</p>
                    </div>

                    {user?.role === 'teacher' && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-accent gap-2">
                                    <Plus className="w-4 h-4" />
                                    Ajouter une matière
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleAddSubject}>
                                    <DialogHeader>
                                        <DialogTitle>Nouvelle Matière</DialogTitle>
                                        <DialogDescription>
                                            Ajoutez une matière à votre catalogue d'enseignement.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nom de la matière</Label>
                                            <Input
                                                id="name"
                                                placeholder="ex: Algorithmique Avancée"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="filiere">Filière & Niveau</Label>
                                            <Select value={selectedFiliereId} onValueChange={setSelectedFiliereId} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez une filière" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filieres.map((f) => (
                                                        <SelectItem key={f.id} value={f.id.toString()}>
                                                            {f.name || f.nom} ({f.niveau})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isSaving} className="w-full">
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Enregistrement...
                                                </>
                                            ) : "Enregistrer la matière"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                                <div className="w-12 h-12 bg-muted rounded-lg mb-4" />
                                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                            </div>
                        ))}
                    </div>
                ) : subjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <div key={subject.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all group border-l-4 border-l-transparent hover:border-l-accent">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-muted rounded-full text-muted-foreground border border-border">
                                        {subject.filiere?.niveau || 'N/A'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                                    {subject.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    {subject.filiere?.name || subject.filiere?.nom || 'Filière non définie'}
                                </p>

                                <div className="flex items-center gap-4 pt-4 border-t border-border mt-auto">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        <span>Gpe standard</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>2024-2025</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-xl p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Aucune matière trouvée</h3>
                        <p className="text-muted-foreground">
                            Vous n'avez pas encore de matières assignées.
                        </p>
                        {user?.role === 'teacher' && (
                            <Button variant="outline" className="mt-6 font-semibold" onClick={() => setIsDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter ma première matière
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
