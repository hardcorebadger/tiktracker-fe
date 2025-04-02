import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
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
        <div className={`flex items-center min-w-[300px] ${isImporting ? 'opacity-70' : ''}`}>
          <img 
            src={sound.icon_url} 
            alt={sound.sound_name} 
            className="h-10 w-10 rounded-md object-cover mr-3"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-medium text-foreground truncate">{sound.sound_name}</div>
              {isImporting && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="flex items-center gap-1">
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
      if (value === null) return <div className="text-right">-</div>;
      const formattedValue = value.toFixed(2);
      return (
        <div className={`flex items-center justify-end gap-1 ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {value >= 0 ? '↑' : '↓'}
          <span>{formattedValue}%</span>
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
      if (value === null) return <div className="text-right">-</div>;
      const formattedValue = value.toFixed(2);
      return (
        <div className={`flex items-center justify-end gap-1 ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {value >= 0 ? '↑' : '↓'}
          <span>{formattedValue}%</span>
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
      if (value === null) return <div className="text-right">-</div>;
      const formattedValue = value.toFixed(2);
      return (
        <div className={`flex items-center justify-end gap-1 ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {value >= 0 ? '↑' : '↓'}
          <span>{formattedValue}%</span>
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
    state: {
      sorting,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search sounds..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
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
    </div>
  )
} 