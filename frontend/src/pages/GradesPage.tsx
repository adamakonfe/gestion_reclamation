import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import api from '@/lib/axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function GradesPage() {
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await api.get('/demandes');
                // Filter for validated claims that might need grade update
                const validated = response.data.filter((c: any) => c.statut === 'VALIDEE');
                setClaims(validated);
            } catch (error) {
                console.error('Failed to fetch claims', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClaims();
    }, []);

    const filtered = claims.filter(c =>
        c.nom_prenom.toLowerCase().includes(search.toLowerCase()) ||
        c.matiere?.nom.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Gestion des notes</h1>
                    <p className="text-muted-foreground">
                        Réclamations validées nécessitant une mise à jour dans le système académique.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-xl">
                    <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un étudiant ou une matière..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-background"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {filtered.length} réclamation(s) validée(s)
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Étudiant</TableHead>
                                <TableHead>Matière</TableHead>
                                <TableHead className="text-center">Note Actuelle</TableHead>
                                <TableHead className="text-center">Note Demandée</TableHead>
                                <TableHead className="text-center">Note Finale</TableHead>
                                <TableHead>Objectif</TableHead>
                                <TableHead>Date Validation</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">Chargement...</TableCell>
                                </TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Aucune note à mettre à jour.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((claim) => (
                                    <TableRow key={claim.id}>
                                        <TableCell className="font-medium">{claim.nom_prenom}</TableCell>
                                        <TableCell>{claim.matiere?.name || claim.matiere?.nom}</TableCell>
                                        <TableCell className="text-center">{claim.note_actuelle ?? '-'}/20</TableCell>
                                        <TableCell className="text-center font-medium text-accent">{claim.note_demandee ?? '-'}/20</TableCell>
                                        <TableCell className="text-center font-bold text-status-success">{claim.note_finale ?? '-'}/20</TableCell>
                                        <TableCell className="max-w-[200px] truncate text-muted-foreground italic text-xs">{claim.objectif}</TableCell>
                                        <TableCell>{format(new Date(claim.updated_at), 'dd MMM yyyy', { locale: fr })}</TableCell>
                                        <TableCell className="text-right">
                                            <Link to={`/claims/${claim.id}`}>
                                                <Button variant="ghost" size="sm" className="gap-2">
                                                    <FileText className="w-4 h-4" />
                                                    Détails
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </DashboardLayout>
    );
}
