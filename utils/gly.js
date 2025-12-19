export default {
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  },
  
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    }
  },
  
  generateUserId() {
    return 'GLY' + Math.random().toString(36).substr(2, 9).toUpperCase()
  },
  
  generateInviteCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase()
  }
}
