import prisma from '../prisma/client.js';

// select que omite senhaHash
const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
};

// GET /alunos
export async function listarAlunos(req, res) {
  const alunos = await prisma.aluno.findMany({
    select: selectSemSenha,
  });

  return res.json(alunos);
}

// GET /alunos/:id
export async function buscarAluno(req, res) {
  const { id } = req.params;

  const aluno = await prisma.aluno.findUnique({
    where: { id: Number(id) },
    select: selectSemSenha,
  });

  if (!aluno) {
    return res.status(404).json({
      erro: 'Aluno não encontrado',
    });
  }

  return res.json(aluno);
}

// POST /alunos
export async function criarAluno(req, res) {
  const {
    nome,
    email,
    senhaHash,
    cidade,
    frase,
    planosFuturos,
  } = req.body;

  try {
    const alunoCriado = await prisma.aluno.create({
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos,
      },
      select: selectSemSenha,
    });

    return res.status(201).json(alunoCriado);
  } catch (error) {
    // erro comum: email duplicado
    if (error.code === 'P2002') {
      return res.status(409).json({
        erro: 'Email já cadastrado',
      });
    }

    return res.status(400).json({
      erro: 'Erro ao criar aluno',
    });
  }
}

// PUT /alunos/:id
export async function atualizarAluno(req, res) {
  const { id } = req.params;

  const {
    nome,
    email,
    cidade,
    frase,
    planosFuturos,
    fotoUrl,
    role,
  } = req.body;

  try {
    const alunoAtualizado = await prisma.aluno.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        cidade,
        frase,
        planosFuturos,
        fotoUrl,
        role,
      },
      select: selectSemSenha,
    });

    return res.json(alunoAtualizado);
  } catch (error) {
    return res.status(404).json({
      erro: 'Aluno não encontrado',
    });
  }
}

// DELETE /alunos/:id
export async function deletarAluno(req, res) {
  const { id } = req.params;

  try {
    await prisma.aluno.delete({
      where: { id: Number(id) },
    });

    return res.status(204).end();
  } catch (error) {
    return res.status(404).json({
      erro: 'Aluno não encontrado',
    });
  }
}