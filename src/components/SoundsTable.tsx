import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, ExternalLink, Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Sound } from "@/services/soundService"
import Sparkline from "./Sparkline"
import { AddSoundModal } from "./AddSoundModal"

interface SoundsTableProps {
  data: Sound[]
  onRowClick: (url: string) => void
  onDelete: (id: string, e: React.MouseEvent) => Promise<void>
  onAddSound: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  isSubmitting: boolean
  newSoundUrl: string
  setNewSoundUrl: (value: string) => void
}

const createColumns = (onDelete: (id: string, e: React.MouseEvent) => void): ColumnDef<Sound>[] => [
  {
    accessorKey: "sound_info",
    header: "Sound",
    cell: ({ row }) => {
      const sound = row.original
      const isImporting = sound.last_scrape === null
      return (
        <div className={`flex items-center space-x-3 ${isImporting ? 'opacity-70' : ''}`}>
          <img 
            src={sound.icon_url} 
            alt={sound.sound_name} 
            className="h-10 w-10 rounded-md object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="font-medium text-foreground truncate">{sound.sound_name}</div>
              {isImporting && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Importing</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>First data import in progress</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate">{sound.creator_name}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "video_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-right w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Videos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
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
        <div className="text-right font-medium">
          {formatNumber(row.original.video_count || 0)}
        </div>
      )
    },
  },
  {
    accessorKey: "pct_change_1d",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-right w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          1D Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.original.pct_change_1d;
      const history = row.original.view_history;
      if (value === null || !history?.length) return <div className="text-right">-</div>;
      
      const current = history[history.length - 1];
      const prev = history[history.length - 2];
      const prevPrev = history[history.length - 3];
      
      const currentDelta = current - prev;
      const prevDelta = prev - prevPrev;
      
      // Calculate relative change in growth
      const relativeChange = prevDelta === 0 
        ? (currentDelta > 0 ? Infinity : currentDelta < 0 ? -Infinity : 0)
        : ((currentDelta - prevDelta) / Math.abs(prevDelta)) * 100;
      
      const formattedValue = isFinite(relativeChange) ? relativeChange.toFixed(2) : '∞';
      const formattedDelta = Intl.NumberFormat('en-US', { 
        signDisplay: 'always',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(currentDelta);

      return (
        <div className={`flex flex-col items-end ${relativeChange >= 0 ? 'text-brand-teal' : 'text-brand-red'}`}>
          <div className="flex items-center gap-1">
            {relativeChange >= 0 ? '↑' : '↓'}
            <span>{formattedValue}%</span>
          </div>
          <div className="text-xs opacity-70">{formattedDelta}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "pct_change_1w",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-right w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          1W Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.original.pct_change_1w;
      const history = row.original.view_history;
      if (value === null || !history?.length) return <div className="text-right">-</div>;
      
      const current = history[history.length - 1];
      const prev = history[history.length - 8];
      const prevPrev = history[history.length - 15];
      
      const currentDelta = current - prev;
      const prevDelta = prev - prevPrev;
      
      // Calculate relative change in growth
      const relativeChange = prevDelta === 0 
        ? (currentDelta > 0 ? Infinity : currentDelta < 0 ? -Infinity : 0)
        : ((currentDelta - prevDelta) / Math.abs(prevDelta)) * 100;
      
      const formattedValue = isFinite(relativeChange) ? relativeChange.toFixed(2) : '∞';
      const formattedDelta = Intl.NumberFormat('en-US', { 
        signDisplay: 'always',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(currentDelta);

      return (
        <div className={`flex flex-col items-end ${relativeChange >= 0 ? 'text-brand-teal' : 'text-brand-red'}`}>
          <div className="flex items-center gap-1">
            {relativeChange >= 0 ? '↑' : '↓'}
            <span>{formattedValue}%</span>
          </div>
          <div className="text-xs opacity-70">{formattedDelta}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "pct_change_1m",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-right w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          1M Change
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.original.pct_change_1m;
      const history = row.original.view_history;
      if (value === null || !history?.length) return <div className="text-right">-</div>;
      
      // For monthly, split the history into two equal parts
      const midPoint = Math.floor(history.length / 2);
      
      const current = history[history.length - 1];
      const prev = history[midPoint];
      const start = history[0];
      
      const currentDelta = current - prev;
      const prevDelta = prev - start;
      
      // Calculate relative change in growth
      const relativeChange = prevDelta === 0 
        ? (currentDelta > 0 ? Infinity : currentDelta < 0 ? -Infinity : 0)
        : ((currentDelta - prevDelta) / Math.abs(prevDelta)) * 100;
      
      const formattedValue = isFinite(relativeChange) ? relativeChange.toFixed(2) : '∞';
      const formattedDelta = Intl.NumberFormat('en-US', { 
        signDisplay: 'always',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(currentDelta);

      return (
        <div className={`flex flex-col items-end ${relativeChange >= 0 ? 'text-brand-teal' : 'text-brand-red'}`}>
          <div className="flex items-center gap-1">
            {relativeChange >= 0 ? '↑' : '↓'}
            <span>{formattedValue}%</span>
          </div>
          <div className="text-xs opacity-70">{formattedDelta}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "trend",
    header: "Trend",
    cell: ({ row }) => (
      <div className="w-24 h-8 ml-auto">
        <Sparkline data={row.original.view_history} height={30} width={100} />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sound = row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                window.open(sound.url, '_blank', 'noopener,noreferrer')
              }}
              className="cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Sound
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete(sound.id, e as React.MouseEvent)
              }}
              className="cursor-pointer text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Sound
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function SoundsTable({ 
  data, 
  onRowClick, 
  onDelete, 
  onAddSound, 
  isSubmitting,
  newSoundUrl,
  setNewSoundUrl 
}: SoundsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "video_count", desc: true } // Default sort by video count descending
  ])
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredData = React.useMemo(() => {
    return data.filter(sound => 
      sound.sound_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sound.creator_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data, searchQuery])

  const columns = React.useMemo(
    () => createColumns(onDelete),
    [onDelete]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center md:justify-between gap-4 py-4">
        <div className="flex-1 min-w-0 md:flex-initial md:w-[384px]">
          <Input
            placeholder="Search sounds..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <form onSubmit={onAddSound} className="hidden md:flex gap-2">
            <Input
              placeholder="Enter TikTok sound URL"
              value={newSoundUrl}
              onChange={(e) => setNewSoundUrl(e.target.value)}
              className="w-[200px]"
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Sound"}
            </Button>
          </form>
          <AddSoundModal
            onSubmit={onAddSound}
            isSubmitting={isSubmitting}
            newSoundUrl={newSoundUrl}
            setNewSoundUrl={setNewSoundUrl}
          />
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className={`${header.column.id === 'sound_info' ? 'w-[200px] md:w-[300px]' : ''} px-2 md:px-4`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => onRowClick(row.original.url)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 md:px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground order-2 md:order-1">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2 order-1 md:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
} 