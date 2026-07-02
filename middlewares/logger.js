export default function logger(req, res, next) {
  const start = Date.now(); // ⏱️ marca início da requisição

  res.on('finish', () => {
    const duration = Date.now() - start; // tempo total em ms
    const status = res.statusCode;       // status final da resposta
    const metodo = req.method;
    const url = req.originalUrl;
    const agora = new Date().toISOString();

    console.log(
      `[${agora}] ${metodo} ${url} ${status} - ${duration}ms`
    );
  });

  next();
}