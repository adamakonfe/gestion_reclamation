import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ClaimCard } from '@/components/claims/ClaimCard';
import { FileText, Clock, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get('/demandes');
        setClaims(response.data);
      } catch (error) {
        console.error('Failed to fetch claims', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const myClaims = claims;
  const pendingClaims = myClaims.filter(c => !['VALIDEE', 'NON_VALIDEE', 'REJETEE_SCOLARITE'].includes(c.statut));
  const resolvedClaims = myClaims.filter(c => c.statut === 'VALIDEE');
  const rejectedClaims = myClaims.filter(c => ['NON_VALIDEE', 'REJETEE_SCOLARITE'].includes(c.statut));

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Bonjour, {user?.name.split(' ')[0]} 👋
            </h1>
            <p className="text-muted-foreground">
              Gérez vos réclamations de notes depuis votre espace personnel
            </p>
          </div>
          <Link to="/claims/new">
            <Button className="bg-gradient-accent hover:opacity-90 text-accent-foreground gap-2">
              <PlusCircle className="w-5 h-5" />
              Nouvelle réclamation
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total réclamations"
            value={myClaims.length}
            icon={FileText}
            variant="default"
          />
          <StatCard
            title="En cours"
            value={pendingClaims.length}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Validées"
            value={resolvedClaims.length}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Rejetées"
            value={rejectedClaims.length}
            icon={XCircle}
            variant="error"
          />
        </div>

        {/* Recent Claims */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Réclamations récentes</h2>
            <Link to="/claims" className="text-sm text-accent hover:underline font-medium">
              Voir tout →
            </Link>
          </div>

          {myClaims.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Aucune réclamation</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore soumis de réclamation de note.
              </p>
              <Link to="/claims/new">
                <Button className="bg-gradient-accent hover:opacity-90 text-accent-foreground">
                  Créer une réclamation
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {myClaims.slice(0, 4).map((claim, index) => (
                <div
                  key={claim.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ClaimCard claim={claim} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
