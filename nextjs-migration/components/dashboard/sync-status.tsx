"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface SyncStatusProps {
  status: {
    state: 'loading' | 'connected' | 'error' | 'offline'
    message: string
    lastSync?: string
  }
  onRefresh: () => void
}

export function SyncStatus({ status, onRefresh }: SyncStatusProps) {
  const getStatusIcon = () => {
    switch (status.state) {
      case 'loading':
        return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'offline':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = () => {
    switch (status.state) {
      case 'loading':
        return <Badge variant="secondary">Syncing...</Badge>
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'offline':
        return <Badge className="bg-yellow-100 text-yellow-800">Offline</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Data Sync Status</span>
                {getStatusBadge()}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {status.message}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {status.lastSync && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                {status.state === 'offline' ? (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Offline mode • {status.lastSync}
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Auto-sync • Last: {status.lastSync}
                  </>
                )}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={status.state === 'loading'}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${status.state === 'loading' ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}