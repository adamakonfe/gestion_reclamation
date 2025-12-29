import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="animate-fade-in">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-1">Paramètres</h1>
                    <p className="text-muted-foreground">Configuration générale du système de réclamations.</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                        <Settings className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">En cours de maintenance</h3>
                    <p className="text-muted-foreground">
                        Les réglages du système sont actuellement gérés via les fichiers de configuration backend.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
