export default {
  mounted (el) {
    if ('loading' in HTMLImageElement.prototype) {
      el.setAttribute('loading', 'lazy')
      return
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const dataSrc = el.getAttribute('data-src')
          if (dataSrc) {
            el.src = dataSrc
            el.removeAttribute('data-src')
          }
          obs.unobserve(el)
        }
      })
    })
    observer.observe(el)
  }
}
