import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

const OWNER = 'jorman-viafara';
const REPO = 'CRC_T'; // 🔁 Asegúrate de que este sea el nombre correcto del repo
const FILE_PATH = 'token.txt';

export async function POST(request: Request) {
  try {
    const { nuevoToken } = await request.json();

    const octokit = new Octokit({
      auth: process.env.GITHUB_PAT, // Tu token personal de GitHub
    });

    const sha = await obtenerShaArchivoActual(octokit);

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: FILE_PATH,
      message: 'Actualizar token desde app',
      content: Buffer.from(nuevoToken).toString('base64'),
      committer: {
        name: "App Bot",
        email: "bot@example.com",
      },
      author: {
        name: "App Bot",
        email: "bot@example.com",
      },
      sha, // ⚠️ Obligatorio para actualizar (no crear)
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error actualizando token en GitHub:", error);
    return NextResponse.json({ error: 'No se pudo actualizar el token' }, { status: 500 });
  }
}

// 🔁 Esta función obtiene el SHA actual del archivo para poder actualizarlo
async function obtenerShaArchivoActual(octokit: Octokit): Promise<string> {
  const { data } = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: FILE_PATH,
  });

  if (!('sha' in data)) {
    throw new Error('No se pudo obtener el SHA del archivo');
  }

  return data.sha;
}
