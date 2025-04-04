import * as React from "react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Sparkline from "./Sparkline"

const demoData = [
  {
    id: 1,
    sound_name: "Easy",
    creator_name: "Commodores",
    icon_url: "/easy.png",
    video_count: 2800000,
    pct_change_1d: 4.23,
    pct_change_1w: 18.45,
    pct_change_1m: 154.32,
    view_history: [10, 15, 25, 32, 45, 52, 68, 85, 92, 100]
  },
  {
    id: 2,
    sound_name: "Fable",
    creator_name: "Gigi Perez",
    icon_url: "/fable.png",
    video_count: 1200000,
    pct_change_1d: 2.85,
    pct_change_1w: 12.34,
    pct_change_1m: 89.67,
    view_history: [20, 25, 35, 38, 45, 55, 62, 70, 75, 80]
  },
  {
    id: 3,
    sound_name: "Shake It Fast - FlyyMix",
    creator_name: "Dj Flyy",
    icon_url: "/shakeit.png",
    video_count: 3500000,
    pct_change_1d: 5.67,
    pct_change_1w: 22.43,
    pct_change_1m: 198.54,
    view_history: [30, 45, 55, 62, 75, 82, 88, 92, 96, 100]
  }
]

export function DemoTable() {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sound</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" className="text-right w-full">
                Videos
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">1D Change</TableHead>
            <TableHead className="text-right">1W Change</TableHead>
            <TableHead className="text-right">1M Change</TableHead>
            <TableHead className="text-right">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoData.map((row) => (
            <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center min-w-[300px]">
                  <img 
                    src={row.icon_url} 
                    alt={row.sound_name} 
                    className="h-10 w-10 rounded-md object-cover mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{row.sound_name}</div>
                    <div className="text-sm text-muted-foreground truncate">{row.creator_name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatNumber(row.video_count)}
              </TableCell>
              <TableCell>
                <div className={`flex items-center justify-end gap-1 ${row.pct_change_1d >= 0 ? 'text-brand-teal' : 'text-brand-red'}`}>
                  {row.pct_change_1d >= 0 ? '↑' : '↓'}
                  <span>{row.pct_change_1d.toFixed(2)}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className={`flex items-center justify-end gap-1 ${row.pct_change_1w >= 0 ? 'text-brand-teal' : 'text-brand-red'}`}>
                  {row.pct_change_1w >= 0 ? '↑' : '↓'}
                  <span>{row.pct_change_1w.toFixed(2)}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className={`flex items-center justify-end gap-1 ${row.pct_change_1m >= 0 ? 'text-brand-teal' : 'text-brand-red'}`}>
                  {row.pct_change_1m >= 0 ? '↑' : '↓'}
                  <span>{row.pct_change_1m.toFixed(2)}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="w-24 h-8 ml-auto">
                  <Sparkline data={row.view_history} height={30} width={100} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 