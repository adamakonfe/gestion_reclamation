import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserCog, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TeachersPage() {
    return (
        <DashboardLayout>
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">Gestion des Enseignants</h1>
                        <p className="text-muted-foreground">Liste et affectation des enseignants aux matières.</p>
                    </div>
                    <Button className="bg-gradient-accent text-accent-foreground gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Ajouter un Enseignant
                    </Button>
                </div>

                <div className="bg-card border border-border rounded-xl p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <UserCog className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Module en développement</h3>
                    <p className="text-muted-foreground mb-6">
                        La gestion centralisée des enseignants sera intégrée dans la prochaine version.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
