'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-contemplative-50/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-2 border-destructive/30 shadow-xl">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-destructive to-destructive/80 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-destructive mb-2">
            Algo salio mal!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
          </p>
          
          <Button 
            onClick={reset}
            className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Intentar nuevamente
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
