import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { useImportArtistCSV } from '../../queries/resources'
import { useToast } from '../ui/toast'

interface ImportArtistDialogProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function ImportArtistDialog({ onSuccess, trigger }: ImportArtistDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const importMutation = useImportArtistCSV()
  const { showToast } = useToast()

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      showToast('Please select a CSV file', 'error')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit', 'error')
      return
    }

    setFile(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0])
    }
  }

  const handleImport = () => {
    if (!file) {
      showToast('Please select a file', 'error')
      return
    }

    importMutation.mutate(file, {
      onSuccess: (data) => {
        if (data.imported > 0) {
          showToast(
            `Successfully imported ${data.imported} artist${data.imported !== 1 ? 's' : ''}`,
            'success'
          )
        }

        if (data.errors && data.errors.length > 0) {
          const errorMessage = data.errors.slice(0, 3).join('\n')
          showToast(
            `Import completed with ${data.errors.length} error${data.errors.length !== 1 ? 's' : ''}:\n${errorMessage}${data.errors.length > 3 ? `\n... and ${data.errors.length - 3} more` : ''}`,
            'error'
          )
        }

        setOpen(false)
        setFile(null)
        onSuccess?.()
      },
      onError: (error) => {
        showToast(error instanceof Error ? error.message : 'Import failed', 'error')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button intent="secondary" className="gap-2">
             Import CSV
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="!p-0 max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Artists from CSV</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }
            `}
            style={{
              backgroundColor: isDragging ? 'var(--bg-primary-subtle)' : 'var(--bg-background)',
            }}
          >
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0])
                }
              }}
              className="hidden"
              id="csv-input"
            />
            {file ? (
              // Show selected file
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">CSV</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-default">{file.name}</p>
                      <p className="text-xs text-muted">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    intent="secondary"
                    onClick={() => document.getElementById('csv-input')?.click()}
                  >
                    Change File
                  </Button>
                </div>
                <p className="text-xs text-muted">Drag another CSV here or click "Change File" to replace it.</p>
              </div>
            ) : (
              // Show upload instructions
              <>
                <div className="text-3xl mx-auto mb-3">📤</div>
                <p className="text-sm font-medium text-default mb-2">
                  Drag and drop your CSV file here
                </p>
                <p className="text-xs text-muted mb-4">or</p>
                <Button
                  intent="secondary"
                  onClick={() => document.getElementById('csv-input')?.click()}
                >
                  Browse Files
                </Button>
              </>
            )}
          </div>

          {/* Instructions */}
          <div
            className="p-3 rounded-lg border border-border text-sm"
            style={{ backgroundColor: 'var(--bg-subtle)' }}
          >
            <p className="font-medium text-default mb-2">CSV Format Requirements:</p>
            <ul className="text-xs text-muted space-y-1 ml-4 list-disc">
              <li>Headers: Name, Gender (required), and optional: Date of Birth, Address, First Release Year, Albums Released</li>
              <li>Gender values: male, female, or other</li>
              <li>First Release Year: Must be between 1900 and current year</li>
              <li>Albums Released: Must be a non-negative number</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 p-6 border-t border-border">
          <DialogClose asChild>
            <Button intent="outline" disabled={importMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleImport}
            disabled={!file}
            isLoading={importMutation.isPending}
          >
            Import Artists
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
