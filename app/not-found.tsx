import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Music } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-contemplative-50/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-2 border-contemplative/30 shadow-xl">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-contemplative to-reflective rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-contemplative mb-2">
            Pagina no encontrada
          </h1>
          
          <p className="text-muted-foreground mb-6">
            La pagina que buscas no existe o ha sido movida.
          </p>
          
          <Button asChild className="bg-gradient-to-r from-contemplative to-reflective hover:from-contemplative/90 hover:to-reflective/90">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Volver al Cancionero
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
