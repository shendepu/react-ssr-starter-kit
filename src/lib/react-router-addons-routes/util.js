const mergePatterns = (a, b) => {
  return a[a.length - 1] === '/' && b[0] === '/'
    ? `${a.slice(0, a.length - 1)}${b}` : `${a}${b}`
}

export {
  mergePatterns
}
