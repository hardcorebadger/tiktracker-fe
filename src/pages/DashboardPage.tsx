
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sparkline from '@/components/Sparkline';
import { getSounds, Sound, addSound, deleteSound } from '@/services/soundService';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash } from 'lucide-react';

type DisplayMetric = 'sparkline' | '1d' | '1w' | '1m';

const DashboardPage = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayMetric, setDisplayMetric] = useState<DisplayMetric>('sparkline');
  const [newSoundUrl, setNewSoundUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSounds = async () => {
    try {
      const data = await getSounds();
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

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
  };

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
      if (newSound) {
        setSounds(prev => [...prev, newSound]);
        setNewSoundUrl('');
        toast({
          title: "Success",
          description: "Sound added successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add sound. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding sound:', error);
      toast({
        title: "Error",
        description: "Failed to add sound. Please try again.",
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

  const renderMobileMetric = (sound: Sound) => {
    switch (displayMetric) {
      case '1d':
        return (
          <div className={`text-sm font-medium ${sound.pct_change_1d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {sound.pct_change_1d > 0 ? '+' : ''}{sound.pct_change_1d}%
          </div>
        );
      case '1w':
        return (
          <div className={`text-sm font-medium ${sound.pct_change_1w >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {sound.pct_change_1w > 0 ? '+' : ''}{sound.pct_change_1w}%
          </div>
        );
      case '1m':
        return (
          <div className={`text-sm font-medium ${sound.pct_change_1m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {sound.pct_change_1m > 0 ? '+' : ''}{sound.pct_change_1m}%
          </div>
        );
      default:
        return (
          <div className="w-20 h-8">
            <Sparkline data={sound.view_history} height={30} width={80} />
          </div>
        );
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">TikTok Sounds</h1>
          
          {isMobile && (
            <Select
              value={displayMetric}
              onValueChange={(value) => setDisplayMetric(value as DisplayMetric)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sparkline">Trend</SelectItem>
                <SelectItem value="1d">1D Change</SelectItem>
                <SelectItem value="1w">1W Change</SelectItem>
                <SelectItem value="1m">1M Change</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleAddSound} className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter TikTok sound URL"
                value={newSoundUrl}
                onChange={(e) => setNewSoundUrl(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Sound"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {sounds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              You haven't added any sounds yet. Add your first TikTok sound URL above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 sm:w-1/4">Sound</TableHead>
                  <TableHead className="text-right w-1/6">Total Views</TableHead>
                  {!isMobile && (
                    <>
                      <TableHead className="text-right">1D Change</TableHead>
                      <TableHead className="text-right">1W Change</TableHead>
                      <TableHead className="text-right">1M Change</TableHead>
                      <TableHead className="text-right pr-4">Trend</TableHead>
                    </>
                  )}
                  {isMobile && (
                    <TableHead className="text-right">
                      {displayMetric === 'sparkline' ? 'Trend' : 
                      displayMetric === '1d' ? '1D' : 
                      displayMetric === '1w' ? '1W' : '1M'}
                    </TableHead>
                  )}
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sounds.map((sound) => (
                  <TableRow 
                    key={sound.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(sound.url)}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center">
                        <img 
                          src={sound.icon_url} 
                          alt={sound.sound_name} 
                          className="h-10 w-10 rounded-md object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{sound.sound_name}</div>
                          <div className="text-sm text-gray-500">{sound.creator_name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatNumber(sound.total_views)}
                    </TableCell>
                    {!isMobile && (
                      <>
                        <TableCell className={`text-right font-medium ${sound.pct_change_1d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sound.pct_change_1d > 0 ? '+' : ''}{sound.pct_change_1d}%
                        </TableCell>
                        <TableCell className={`text-right font-medium ${sound.pct_change_1w >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sound.pct_change_1w > 0 ? '+' : ''}{sound.pct_change_1w}%
                        </TableCell>
                        <TableCell className={`text-right font-medium ${sound.pct_change_1m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sound.pct_change_1m > 0 ? '+' : ''}{sound.pct_change_1m}%
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <div className="w-24 h-8 ml-auto">
                            <Sparkline data={sound.view_history} height={30} width={100} />
                          </div>
                        </TableCell>
                      </>
                    )}
                    {isMobile && (
                      <TableCell className="text-right">
                        {renderMobileMetric(sound)}
                      </TableCell>
                    )}
                    <TableCell>
                      <button 
                        onClick={(e) => handleDeleteSound(sound.id, e)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
