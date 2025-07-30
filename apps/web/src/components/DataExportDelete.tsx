'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Download, Trash2, AlertTriangle, Shield, CheckCircle } from 'lucide-react'

interface DataExportDeleteProps {
  className?: string
}

export function DataExportDelete({ className = '' }: DataExportDeleteProps) {
  const { user } = useAuth()
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const handleExportData = async () => {
    if (!user) return

    setIsExporting(true)
    try {
      const response = await fetch('/api/export-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `pomonest-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        setExportSuccess(true)
        setTimeout(() => setExportSuccess(false), 5000)
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Data export error:', error)
      alert('Failed to export data. Please try again or contact support.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteData = async () => {
    if (!user) return

    setIsDeleting(true)
    try {
      const response = await fetch('/api/delete-user-data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        setDeleteSuccess(true)
        setShowDeleteConfirm(false)
        // Optionally sign out the user after data deletion
        setTimeout(() => {
          alert('Your data has been deleted. You will be signed out.')
          // You might want to call signOut() here
        }, 2000)
      } else {
        throw new Error('Deletion failed')
      }
    } catch (error) {
      console.error('Data deletion error:', error)
      alert('Failed to delete data. Please try again or contact support.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Please sign in to manage your data privacy settings.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Data Privacy Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Exercise your data privacy rights under GDPR and CCPA. You can export or delete your personal data at any time.
        </p>

        {/* Export Data Section */}
        <div className="space-y-3">
          <h3 className="font-medium">Export Your Data</h3>
          <p className="text-sm text-muted-foreground">
            Download a complete copy of your personal data including account information, session history, and preferences.
          </p>
          
          {exportSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your data has been exported successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export My Data'}
          </Button>
        </div>

        {/* Delete Data Section */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-medium text-red-800">Delete Your Data</h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete all your personal data from our servers. This action cannot be undone.
          </p>

          {deleteSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your data has been successfully deleted.
              </AlertDescription>
            </Alert>
          )}

          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={deleteSuccess}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete My Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Confirm Data Deletion
                </DialogTitle>
                <DialogDescription>
                  Are you absolutely sure you want to delete all your data? This will permanently remove:
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Your account information</li>
                  <li>• All Pomodoro session history</li>
                  <li>• Streak data and statistics</li>
                  <li>• Personal preferences and settings</li>
                  <li>• Pro subscription information</li>
                </ul>

                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>This action cannot be undone.</strong> Consider exporting your data first if you want to keep a copy.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteData}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Information */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Data Processing:</strong> Export requests are processed immediately. 
            Data deletion requests are processed within 30 days and may take up to 90 days to propagate across all systems. 
            For questions, contact us at{' '}
            <a href="mailto:pomonest.legal@gmail.com" className="text-blue-600 hover:underline">
              pomonest.legal@gmail.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}