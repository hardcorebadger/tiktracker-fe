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
import { withPageTracking } from '@/components/withPageTracking';
import { track } from '@/services/mixpanel';
import { TestSoundsTable } from '@/components/TestSoundsTable';

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSoundUrl, setNewSoundUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSounds();
  }, []);

  const loadSounds = async () => {
    try {
      const fetchedSounds = await getSounds();
      setSounds(fetchedSounds);
    } catch (error) {
      toast({
        title: "Error loading sounds",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSound = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newSound = await addSound(newSoundUrl);
      setSounds([...sounds, newSound]);
      setNewSoundUrl("");
      toast({
        title: "Sound added",
        description: "The sound has been added to your tracking list",
      });
      track('Sound Added', { url: newSoundUrl });
    } catch (error) {
      toast({
        title: "Error adding sound",
        description: "Please check the URL and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteSound(id);
      setSounds(sounds.filter(sound => sound.id !== id));
      toast({
        title: "Sound deleted",
        description: "The sound has been removed from your tracking list",
      });
      track('Sound Deleted', { sound_id: id });
    } catch (error) {
      toast({
        title: "Error deleting sound",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (url: string) => {
    window.open(url, '_blank');
    track('Sound Link Clicked', { url });
  };

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
      <div className="container mx-auto py-4 px-10 max-w-7xl">
        <PageHeader
          title="Dashboard"
          description="Track and monitor your TikTok sounds' performance."
        />
        <SoundsTable
          data={sounds}
          onRowClick={handleRowClick}
          onDelete={handleDelete}
          onAddSound={handleAddSound}
          isSubmitting={isSubmitting}
          newSoundUrl={newSoundUrl}
          setNewSoundUrl={setNewSoundUrl}
        />
        {/* <TestSoundsTable /> */}
      </div>
    </>
  );
};

export default withPageTracking(DashboardPage, 'Dashboard');
