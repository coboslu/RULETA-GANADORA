/* global module */
// Contador interno digital para mantener la ventaja de la casa del 2.7%
class HouseEdgeCalculator {
  constructor() {
    // Configuración de apuestas y tamaño de ruletas
    // targetProbability mantiene la ventaja de la casa del 2.7%
    this.betOptions = [
      { amount: 1, prize: 10, targetProbability: 0.0973, numbers: 10 },
      { amount: 1, prize: 50, targetProbability: 0.01946, numbers: 50 },
      { amount: 1, prize: 100, targetProbability: 0.00973, numbers: 100 }
    ];
    
    // Contador interno para mantener la ventaja de la casa
    this.houseEdgeTracker = {
      totalBets: 0,
      totalWinnings: 0,
      totalLosses: 0,
      currentEdge: 0,
      targetEdge: 0.027 // 2.7%
    };
    
    // Historial de resultados para ajustar probabilidades
    this.recentResults = [];
    this.maxHistoryLength = 100;
  }
  
  // Calcular si el jugador debe ganar basado en la ventaja de la casa
  shouldPlayerWin(betType) {
    const betConfig = this.betOptions.find(opt => opt.prize === betType);
    if (!betConfig) return false;
    
    // Usar probabilidad base directamente (sin ajustes complejos por ahora)
    return Math.random() < betConfig.targetProbability;
  }
  
  // Procesar una apuesta y devolver el resultado
  processBet(betType) {
    const betConfig = this.betOptions.find(opt => opt.prize === betType);
    if (!betConfig) {
      throw new Error(`Tipo de apuesta inválido: ${betType}`);
    }
    
    // Determinar si el jugador debe ganar
    const shouldWin = this.shouldPlayerWin(betType);

    // Seleccionar número aleatorio dentro del rango de la ruleta correspondiente
    const winningNumber = Math.floor(Math.random() * betConfig.numbers) + 1;
    
    // Actualizar estadísticas
    this.houseEdgeTracker.totalBets += betConfig.amount;
    
    if (shouldWin) {
      this.houseEdgeTracker.totalWinnings += betConfig.prize;
      // El jugador gana el premio menos la apuesta
      const netWin = betConfig.prize - betConfig.amount;
      this.updateRecentResults(true, netWin);
    } else {
      this.houseEdgeTracker.totalLosses += betConfig.amount;
      this.updateRecentResults(false, -betConfig.amount);
    }
    
    // Calcular ventaja actual
    const totalRevenue = this.houseEdgeTracker.totalLosses - this.houseEdgeTracker.totalWinnings;
    this.houseEdgeTracker.currentEdge = totalRevenue / this.houseEdgeTracker.totalBets;
    
    return {
      number: winningNumber,
      isWin: shouldWin,
      prize: shouldWin ? betConfig.prize : 0,
      netResult: shouldWin ? (betConfig.prize - betConfig.amount) : -betConfig.amount,
      houseEdge: this.houseEdgeTracker.currentEdge,
      totalBets: this.houseEdgeTracker.totalBets
    };
  }
  
  // Actualizar historial de resultados recientes
  updateRecentResults(isWin, amount) {
    this.recentResults.push({ isWin, amount, timestamp: Date.now() });
    
    // Mantener solo los últimos N resultados
    if (this.recentResults.length > this.maxHistoryLength) {
      this.recentResults.shift();
    }
  }
  
  // Obtener estadísticas actuales
  getStats() {
    return {
      totalBets: this.houseEdgeTracker.totalBets,
      totalWinnings: this.houseEdgeTracker.totalWinnings,
      totalLosses: this.houseEdgeTracker.totalLosses,
      currentEdge: this.houseEdgeTracker.currentEdge,
      targetEdge: this.houseEdgeTracker.targetEdge,
      recentWinRate: this.calculateRecentWinRate()
    };
  }
  
  // Calcular tasa de victoria reciente
  calculateRecentWinRate() {
    if (this.recentResults.length === 0) return 0;
    
    const wins = this.recentResults.filter(result => result.isWin).length;
    return wins / this.recentResults.length;
  }
  
  // Resetear estadísticas (para testing)
  reset() {
    this.houseEdgeTracker = {
      totalBets: 0,
      totalWinnings: 0,
      totalLosses: 0,
      currentEdge: 0,
      targetEdge: 0.027
    };
    this.recentResults = [];
  }
}

// Exportar para uso en el navegador
if (typeof window !== 'undefined') {
  window.HouseEdgeCalculator = HouseEdgeCalculator;
}

// Exportar para Node.js (testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HouseEdgeCalculator;
}

