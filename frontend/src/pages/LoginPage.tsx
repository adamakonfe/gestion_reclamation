import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole, ROLE_LABELS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, ArrowRight, Mail, Lock, UserCircle, Shield, BookOpen, ClipboardCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ROLE_ICONS: Record<UserRole, any> = {
  student: User,
  teacher: BookOpen,
  registrar: ClipboardCheck,
  admin: Shield,
};

const ROLE_HINTS: Record<UserRole, string> = {
  student: "votre.nom@ibam.edu",
  teacher: "nom.professeur@ibam.edu",
  registrar: "service.scolarite@ibam.edu",
  admin: "admin@ibam.edu",
};

const ROLE_OPTIONS: { role: UserRole }[] = [
  { role: 'student' },
  { role: 'registrar' },
  { role: 'teacher' },
  { role: 'admin' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      toast.success(`Bienvenue, ${ROLE_LABELS[selectedRole]}`);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error("Identifiants incorrects ou rôle invalide");
    } finally {
      setIsLoading(false);
    }
  };

  const RoleIcon = ROLE_ICONS[selectedRole];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">IBAM</h1>
              <p className="text-white/60 text-sm">Institut Burkinabé des Arts et Métiers</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Système de Gestion des<br />
            <span className="text-accent">Réclamations de Notes</span>
          </h2>

          <p className="text-lg text-white/70 mb-10 max-w-md">
            Plateforme centralisée pour soumettre, suivre et traiter les demandes de révision de notes académiques.
          </p>

          <div className="space-y-4">
            {[
              'Soumission simplifiée des réclamations',
              'Suivi en temps réel du processus',
              'Workflow sécurisé et transparent',
              'Notifications automatiques',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">IBAM</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Connexion</h2>
            <p className="text-muted-foreground">
              Accédez à votre espace sécurisé
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground font-medium">Votre Profil</Label>
              <div className="relative group">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 group-focus-within:text-accent transition-colors" />
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)} required>
                  <SelectTrigger className="pl-10 h-12 bg-card border-border shadow-sm">
                    <SelectValue placeholder="Sélectionnez votre profil" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.role} value={option.role}>
                        {ROLE_LABELS[option.role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder={ROLE_HINTS[selectedRole]}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-card border-border transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground font-medium">Mot de passe</Label>
                <Link to="/forgot-password" className="text-xs text-accent hover:underline">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-card border-border transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-accent hover:opacity-90 text-accent-foreground font-bold shadow-lg shadow-accent/20 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authentification...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Se connecter en tant que {ROLE_LABELS[selectedRole]}
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-8 space-y-4 animate-in fade-in duration-1000">
            <p>
              Nouveau à l'IBAM ?{' '}
              <Link to="/register" className="text-accent hover:underline font-bold">
                Créer un compte
              </Link>
            </p>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs">
                Besoin d'aide ? <a href="#" className="text-accent hover:underline">Support technique</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
