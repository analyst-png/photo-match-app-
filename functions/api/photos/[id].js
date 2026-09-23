// GET /api/photos        -> list every photo in the shared gallery
// POST /api/photos       -> add one photo { dataUrl, faces, addedAt, name }
// DELETE /api/photos     -> clear the entire gallery

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB
      .prepare("SELECT id, data_url AS dataUrl, faces, added_at AS addedAt, name FROM photos ORDER BY added_at DESC")
      .all();

    const photos = results.map((row) => ({
      ...row,
      faces: JSON.parse(row.faces),
    }));

    return Response.json(photos);
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const body = await request.json();
    const { dataUrl, faces, addedAt, name } = body || {};

    if (typeof dataUrl !== "string" || !Array.isArray(faces)) {
      return Response.json({ error: "invalid payload" }, { status: 400 });
    }

    const result = await env.DB
      .prepare("INSERT INTO photos (data_url, faces, added_at, name) VALUES (?, ?, ?, ?)")
      .bind(dataUrl, JSON.stringify(faces), addedAt || Date.now(), name || "")
      .run();

    return Response.json({ id: result.meta.last_row_id }, { status: 201 });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function onRequestDelete({ env }) {
  try {
    await env.DB.prepare("DELETE FROM photos").run();
    return new Response(null, { status: 204 });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
