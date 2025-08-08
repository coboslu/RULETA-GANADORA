import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CreditCard, Smartphone, Apple, Chrome, X } from 'lucide-react'
import { motion } from 'framer-motion'

const PaymentIntegration = ({ isOpen, onClose, onPaymentSuccess, amount }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null)

  if (!isOpen) return null

  // Simulación de Bizum
  const handleBizumPayment = async () => {
    setIsProcessing(true)
    setPaymentMethod('bizum')
    
    setTimeout(() => {
      const success = Math.random() > 0.1
      
      if (success) {
        onPaymentSuccess()
      } else {
        alert('Error en el pago con Bizum. Inténtalo de nuevo.')
        setIsProcessing(false)
        setPaymentMethod(null)
      }
    }, 3000)
  }

  // Simulación de Apple Pay
  const handleApplePayPayment = async () => {
    setIsProcessing(true)
    setPaymentMethod('apple-pay')

    setTimeout(() => {
      const success = Math.random() > 0.1
      
      if (success) {
        onPaymentSuccess()
      } else {
        alert('Error en el pago con Apple Pay. Inténtalo de nuevo.')
        setIsProcessing(false)
        setPaymentMethod(null)
      }
    }, 2500)
  }

  // Simulación de Google Pay
  const handleGooglePayPayment = async () => {
    setIsProcessing(true)
    setPaymentMethod('google-pay')

    setTimeout(() => {
      const success = Math.random() > 0.1
      
      if (success) {
        onPaymentSuccess()
      } else {
        alert('Error en el pago con Google Pay. Inténtalo de nuevo.')
        setIsProcessing(false)
        setPaymentMethod(null)
      }
    }, 2500)
  }

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <Card className="max-w-sm w-full bg-white/95 backdrop-blur border-gray-200 shadow-xl">
          <CardContent className="pt-8 pb-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h3 className="text-lg font-medium mb-3 text-gray-900">
              Procesando pago
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {paymentMethod === 'bizum' && 'Confirma el pago en tu app bancaria'}
              {paymentMethod === 'apple-pay' && 'Confirma con Touch ID o Face ID'}
              {paymentMethod === 'google-pay' && 'Confirma el pago en Google Pay'}
            </p>
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
              {amount}€
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/95 backdrop-blur rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-medium text-gray-900">Recargar saldo</h3>
            <p className="text-sm text-gray-600 mt-1">Añadir 1€ a tu cuenta</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Amount */}
        <div className="text-center mb-6">
          <Badge variant="outline" className="text-2xl font-semibold px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
            +{amount}€
          </Badge>
        </div>
        
        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {/* Bizum */}
          <Button 
            onClick={handleBizumPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-14 transition-all duration-200"
            disabled={isProcessing}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="font-medium">Bizum</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                Instantáneo
              </Badge>
            </div>
          </Button>

          {/* Apple Pay */}
          <Button 
            onClick={handleApplePayPayment}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-14 transition-all duration-200"
            disabled={isProcessing}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <Apple className="w-4 h-4" />
                </div>
                <span className="font-medium">Apple Pay</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                Touch ID
              </Badge>
            </div>
          </Button>

          {/* Google Pay */}
          <Button 
            onClick={handleGooglePayPayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-14 transition-all duration-200"
            disabled={isProcessing}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <Chrome className="w-4 h-4" />
                </div>
                <span className="font-medium">Google Pay</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                Seguro
              </Badge>
            </div>
          </Button>
        </div>

        {/* Security Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>🔒 Pagos seguros y encriptados</p>
          <p>💳 Sin comisiones adicionales</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PaymentIntegration

