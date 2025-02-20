// Função mock, aqui tu muda pra implementação real
// Se nao for async, ta de boa, só coloquei async para simular o carregamento no front
export async function getBackCardFromText(text, language) {
    return new Promise((resolve) => {
        setTimeout(() => {
           resolve(language + " back card: " + text);
        }, 1500); // Delay de 1,5 segundos
    });
}
  