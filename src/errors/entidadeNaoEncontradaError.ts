class EntidadeNaoEncontradaError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export default EntidadeNaoEncontradaError;