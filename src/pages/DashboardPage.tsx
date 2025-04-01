
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sparkline from '@/components/Sparkline';
import { getSounds, Sound } from '@/services/soundService';
import { useIsMobile } from '@/hooks/use-mobile';
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

type DisplayMetric = 'sparkline' | '1d' | '1w' | '1m';

const DashboardPage = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayMetric, setDisplayMetric] = useState<DisplayMetric>('sparkline');
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const data = await getSounds();
        setSounds(data);
      } catch (error) {
        console.error('Error fetching sounds:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSounds();
  }, []);

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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
