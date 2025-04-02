import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getSounds, Sound, addSound, deleteSound } from '@/services/soundService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SoundsTable } from '@/components/SoundsTable';
import { PageHeader } from '@/components/PageHeader';
import { Music } from 'lucide-react';

const DashboardPage = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSoundUrl, setNewSoundUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSounds = async () => {
    try {
      const data = await getSounds();
      console.log('Fetched sounds:', data);
      setSounds(data);
    } catch (error) {
      console.error('Error fetching sounds:', error);
      toast({
        title: "Error",
        description: "Failed to load your sounds. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSounds();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRowClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddSound = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSoundUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a TikTok sound URL.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newSound = await addSound(newSoundUrl.trim());
      setSounds(prev => [...prev, newSound]);
      setNewSoundUrl('');
      toast({
        title: "Success",
        description: "Sound added successfully!",
      });
    } catch (error) {
      console.error('Error adding sound:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add sound. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSound = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    
    try {
      const success = await deleteSound(id);
      if (success) {
        setSounds(prev => prev.filter(sound => sound.id !== id));
        toast({
          title: "Success",
          description: "Sound deleted successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete sound. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting sound:', error);
      toast({
        title: "Error",
        description: "Failed to delete sound. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading sounds...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Please log in to view your sounds.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {sounds.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
            <div className="mb-8">
              <Music className="h-16 w-16 text-primary mx-auto" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              Start tracking your TikTok sounds
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Add your first TikTok sound URL to begin monitoring its performance and growth metrics.
            </p>
            <form onSubmit={handleAddSound} className="w-full max-w-md flex gap-2">
              <Input
                placeholder="Enter TikTok sound URL"
                value={newSoundUrl}
                onChange={(e) => setNewSoundUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Sound"}
              </Button>
            </form>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <PageHeader 
                title="Dashboard" 
                description="Track your TikTok sounds and monitor their performance."
              />
            </div>
            <SoundsTable 
              data={sounds}
              onRowClick={handleRowClick}
              onDelete={handleDeleteSound}
              onAddSound={handleAddSound}
              isSubmitting={isSubmitting}
              newSoundUrl={newSoundUrl}
              setNewSoundUrl={setNewSoundUrl}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
