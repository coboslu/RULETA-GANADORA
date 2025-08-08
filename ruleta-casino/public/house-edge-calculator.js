// Contador interno digital para mantener la ventaja de la casa del 2.7%
class HouseEdgeCalculator {
  constructor() {
    // Configuración de apuestas: 1€ para ganar 10€, 50€ o 100€
    // Probabilidades calculadas matemáticamente para mantener exactamente 2.7% de ventaja de la casa
    this.betOptions = [
      { amount: 1, prize: 10, targetProbability: 0.0973 }, // 9.73% para ganar 10€ (ventaja casa: 2.7%)
      { amount: 1, prize: 50, targetProbability: 0.01946 }, // 1.946% para ganar 50€ (ventaja casa: 2.7%)
      { amount: 1, prize: 100, targetProbability: 0.00973 } // 0.973% para ganar 100€ (ventaja casa: 2.7%)
    ];
    
    // Números de la ruleta europea estándar (37 números: 0-36)
    this.rouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    
    // Números ganadores para cada tipo de apuesta (basado en probabilidades calculadas)
    this.winningNumbers = {
      10: [7, 17, 29, 35], // 4 números de 37 = 10.81% probabilidad
      50: [3], // 1 número de 37 = 2.7% probabilidad (ajustado dinámicamente)
      100: [26] // 1 número de 37 = 2.7% probabilidad (ajustado dinámicamente)
    };
    
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
  
  // Seleccionar número ganador específico
  selectWinningNumber(betType, shouldWin) {
    if (shouldWin) {
      // Seleccionar aleatoriamente de los números ganadores para este tipo de apuesta
      const winningOptions = this.winningNumbers[betType];
      return winningOptions[Math.floor(Math.random() * winningOptions.length)];
    } else {
      // Seleccionar un número que NO esté en los números ganadores
      const losingNumbers = this.rouletteNumbers.filter(num => 
        !this.winningNumbers[betType].includes(num)
      );
      return losingNumbers[Math.floor(Math.random() * losingNumbers.length)];
    }
  }
  
  // Procesar una apuesta y devolver el resultado
  processBet(betType) {
    const betConfig = this.betOptions.find(opt => opt.prize === betType);
    if (!betConfig) {
      throw new Error(`Tipo de apuesta inválido: ${betType}`);
    }
    
    // Determinar si el jugador debe ganar
    const shouldWin = this.shouldPlayerWin(betType);
    
    // Seleccionar el número específico
    const winningNumber = this.selectWinningNumber(betType, shouldWin);
    
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

