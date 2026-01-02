import { NextRequest, NextResponse } from 'next/server';

let tokenTemporal: string | null = null;

export const GET = async () => {
  try {
    if (tokenTemporal) {
      console.log('⚡ Usando token TEMPORAL desde memoria');
      return new NextResponse(tokenTemporal, { status: 200 });
    }

    const response = await fetch(
      'https://raw.githubusercontent.com/Bluelink-BPO/CRC_T/refs/heads/main/token.txt' + Date.now(),
      {
        cache: 'no-store',
        headers: {
          Accept: 'application/vnd.github.v3.raw',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
        },
      }
    );

    const token = (await response.text()).trim();

    if (!token || !token.includes('.')) {
      return NextResponse.json({ error: 'Token no válido.' }, { status: 400 });
    }

    console.log('✅ Token cargado desde GitHub');
    return new NextResponse(token, { status: 200 });

  } catch (error) {
    console.error('❌ Error al obtener token:', error);
    return NextResponse.json({ error: 'No se pudo obtener el token.' }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { nuevoToken } = await req.json();

    if (!nuevoToken || !nuevoToken.includes('.')) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
    }

    tokenTemporal = nuevoToken;
    console.log('✍️ Token temporal actualizado EN MEMORIA');

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('❌ Error al guardar token temporal:', error);
    return NextResponse.json({ error: 'Error técnico guardando token' }, { status: 500 });
  }
};
