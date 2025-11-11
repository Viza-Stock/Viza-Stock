// Utilidade simples para falar uma mensagem em pt-BR usando Web Speech API
// Chamadas devem ocorrer em resposta a interações do usuário para evitar bloqueios do navegador.
export function speak(message: string) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    const synth = window.speechSynthesis
    const utter = new SpeechSynthesisUtterance(message)
    utter.lang = 'pt-BR'
    utter.rate = 1
    utter.pitch = 1

    const assignVoice = () => {
      const voices = synth.getVoices()
      const brVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('pt-br'))
      if (brVoice) {
        utter.voice = brVoice
      }
    }

    // Algumas vezes getVoices() retorna vazio na primeira chamada
    assignVoice()
    if (!utter.voice) {
      synth.onvoiceschanged = () => assignVoice()
    }

    // Cancela qualquer fala em andamento e fala a nova mensagem
    synth.cancel()
    synth.speak(utter)
  } catch (e) {
    // Apenas loga em debug; não interrompe fluxo
    console.warn('Falha ao reproduzir voz:', e)
  }
}