const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Corpo da requisição inválido.' }, 400);
  }

  const { nome, email, mensagem, website } = data;

  if (website) {
    return json({ ok: false, error: 'Requisição rejeitada.' }, 400);
  }
  if (!nome || !email || !mensagem) {
    return json({ ok: false, error: 'Preencha todos os campos.' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'E-mail inválido.' }, 400);
  }
  if (mensagem.length > 2000) {
    return json({ ok: false, error: 'Mensagem muito longa (máximo de 2000 caracteres).' }, 400);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'RBS Tech Teach <contato@rbs.eng.br>',
      to: 'rbs@rbs.eng.br',
      subject: `[RBS Tech Teach] Nova mensagem de ${nome}`,
      text: `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`,
    }),
  });

  if (!res.ok) {
    return json({ ok: false, error: 'Falha ao enviar a mensagem.' }, 502);
  }
  return json({ ok: true });
}
