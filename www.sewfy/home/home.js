window.addEventListener("load", () => {
  const urlAnterior = localStorage.getItem("urlAnterior");
  
  if (urlAnterior && urlAnterior !== window.location.pathname) {
    localStorage.removeItem("urlAnterior");
    window.location.replace(urlAnterior);
  }
});