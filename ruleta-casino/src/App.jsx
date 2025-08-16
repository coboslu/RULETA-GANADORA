import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Wallet, Play, RotateCcw, Plus } from 'lucide-react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import PaymentIntegration from './components/PaymentIntegration.jsx'
import realisticRoulette from './assets/realistic-roulette.png'
import './App.css'

function App() {
  const [balance, setBalance] = useState(0) // Empezar con 0€
  const [selectedBet, setSelectedBet] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [showPayment, setShowPayment] = useState(false)
  const [rouletteAudio, setRouletteAudio] = useState(null)
  const [houseEdgeCalculator, setHouseEdgeCalculator] = useState(null)

  // Inicializar audio y contador interno al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.RouletteAudio) {
        const audio = new window.RouletteAudio();
        setRouletteAudio(audio);
      }
      
      if (window.HouseEdgeCalculator) {
        const calculator = new window.HouseEdgeCalculator();
        setHouseEdgeCalculator(calculator);
      }
    }
  }, [])

  // Función para activar audio (necesaria para algunos navegadores)
  const enableAudio = () => {
    if (rouletteAudio) {
      rouletteAudio.resumeAudio();
    }
  }

  // Configuración de apuestas simplificada: solo 1€ con diferentes premios
  const betOptions = [
    { amount: 1, prize: 10, color: 'from-emerald-500 to-emerald-600', probability: '9.73%' },
    { amount: 1, prize: 50, color: 'from-blue-500 to-blue-600', probability: '1.95%' },
    { amount: 1, prize: 100, color: 'from-purple-500 to-purple-600', probability: '0.97%' }
  ]

  // Números de la ruleta europea (0-36)
  const rouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]

  const spinRoulette = () => {
    if (!selectedBet || isSpinning || balance < selectedBet.amount || !houseEdgeCalculator) return

    // Activar audio si es necesario
    enableAudio()

    setIsSpinning(true)
    setResult(null)

    // Reproducir sonido de giro
    if (rouletteAudio) {
      rouletteAudio.playSpinSound()
    }

    // Usar el contador interno para determinar el resultado
    const gameResult = houseEdgeCalculator.processBet(selectedBet.prize)
    const winningNumber = gameResult.number
    const isWin = gameResult.isWin
    
    // Calcular rotación para que el número ganador quede exactamente bajo la flecha
    const degreesPerNumber = 360 / 37  // 9.73° por número
    const numberIndex = rouletteNumbers.indexOf(winningNumber)
    
    // Calcular cuántos grados necesitamos rotar para que el número ganador quede arriba
    const targetAngle = numberIndex * degreesPerNumber
    
    // Añadir varias vueltas completas para el efecto visual
    const spins = 8 + Math.random() * 4 // 8-12 vueltas para un giro más prolongado
    const baseRotation = spins * 360
    
    // La rotación final debe ser: vueltas base + rotación para alinear el número
    const finalRotation = baseRotation - targetAngle
    
    setRotation(prev => prev + finalRotation)

    setTimeout(() => {
      setResult({
        number: winningNumber,
        isWin,
        prize: isWin ? selectedBet.prize : 0
      })

      // Reproducir sonido de resultado
      if (rouletteAudio) {
        if (isWin) {
          rouletteAudio.playWinSound()
        } else {
          rouletteAudio.playLoseSound()
        }
      }

      // Actualizar balance
      if (isWin) {
        setBalance(prev => prev + selectedBet.prize - selectedBet.amount)
      } else {
        setBalance(prev => prev - selectedBet.amount)
      }

      setIsSpinning(false)
    }, 8000)
  }

  const resetGame = () => {
    setResult(null)
    setSelectedBet(null)
  }

  const handleRecharge = () => {
    setBalance(prev => prev + 1) // Recargar 1€
    setShowPayment(false)
  }

  // Verificar si el jugador necesita recargar
  const needsRecharge = balance < 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header minimalista */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎰</span>
            </div>
            <h1 className="text-2xl font-light text-slate-800">Roulette</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-lg font-medium">
              <Wallet className="w-4 h-4 mr-2" />
              {balance}€
            </Badge>
            {needsRecharge && (
              <Button 
                onClick={() => setShowPayment(true)}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Recargar 1€
              </Button>
            )}
          </div>
        </div>

        {/* Mensaje de recarga si es necesario */}
        {needsRecharge && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-center">
              💰 Necesitas recargar tu saldo para jugar. Recarga 1€ para continuar.
            </p>
          </div>
        )}

        {/* Ruleta realista */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <Motion.div
              className="w-[500px] h-[500px] relative"
              animate={{ rotate: rotation }}
              transition={{
                duration: isSpinning ? 8 : 0,
                ease: isSpinning ? "easeOut" : "linear"
              }}
              style={{
                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2))'
              }}
            >
              <img
                src={realisticRoulette}
                alt="Roulette Wheel"
                className="w-full h-full object-cover rounded-full"
              />
            </Motion.div>
            
            {/* Indicador de la ruleta mejorado - apuntando hacia adentro */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-2 z-10">
              <div className="flex flex-col items-center">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg"></div>
                <div className="w-1 h-6 bg-red-600 shadow-lg -mt-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <AnimatePresence>
          {result && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-center mb-8"
            >
              <Card className={`w-80 ${result.isWin ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">
                    {result.isWin ? '🎉' : '😔'}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${result.isWin ? 'text-green-700' : 'text-red-700'}`}>
                    {result.isWin ? 'Has ganado' : 'Has perdido'}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-slate-600">
                      <span className="font-medium">Número:</span> {result.number}
                    </p>
                    {result.isWin && (
                      <p className="text-green-600 font-semibold">
                        +{result.prize}€
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Opciones de apuesta minimalistas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {betOptions.map((bet, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedBet?.amount === bet.amount && selectedBet?.prize === bet.prize
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              } ${needsRecharge ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !needsRecharge && setSelectedBet(bet)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${bet.color} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-xl">{bet.amount}€</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Apuesta {bet.amount}€</h3>
                <p className="text-slate-600 mb-3">Gana {bet.prize}€</p>
                <Badge variant="secondary" className="text-xs">
                  Probabilidad: {bet.probability}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center gap-4 mb-8">
          {!result ? (
            <Button 
              onClick={spinRoulette}
              disabled={!selectedBet || isSpinning || needsRecharge}
              size="lg"
              className="px-8 py-3 text-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <Play className="w-5 h-5 mr-2" />
              {isSpinning ? 'Girando...' : needsRecharge ? 'Recarga para jugar' : 'Girar'}
            </Button>
          ) : (
            <Button 
              onClick={resetGame}
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Nuevo juego
            </Button>
          )}
        </div>

        {/* Información de probabilidades */}
        <div className="text-center text-sm text-slate-500 mb-8">
          <p>Ventaja de la casa: 2.7% • Juego justo y transparente</p>
          <p className="mt-1">Juega responsablemente</p>
        </div>

        {/* Modal de pago */}
        <PaymentIntegration 
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onPaymentSuccess={handleRecharge}
          amount={1}
        />
      </div>
    </div>
  )
}

export default App

