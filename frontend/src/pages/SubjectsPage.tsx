import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BookOpen } from 'lucide-react';

export default function SubjectsPage() {
    return (
        <DashboardLayout>
            <div className="animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-1">Mes Matières</h1>
                    <p className="text-muted-foreground">Consultez les matières qui vous sont assignées.</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Liste prochainement disponible</h3>
                    <p className="text-muted-foreground">
                        L'intégration avec le système de répartition des charges horaires est en cours.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
