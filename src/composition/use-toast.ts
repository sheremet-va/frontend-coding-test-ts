export default function useToast(msg: string, delay?: number) {
  const event = new CustomEvent('showtoast', {
    detail: {
      message: msg,
      delay,
    },
  })

  window.dispatchEvent(event)
}
