export function mockGraphApi(startPort = 5000) {
  const httpConns: Deno.HttpConn[] = [];
  const { server, port } = getServer(startPort);
  const requests: Request[] = [];

  (async () => {
    for await (const conn of server) {
      const httpConn = Deno.serveHttp(conn);
      httpConns.push(httpConn);
      for await (const { request, respondWith } of httpConn) {
        const rid = requests.push(request) - 1;
        const response = await getResponse(request);
        respondWith(new Response(
          JSON.stringify({ ...response, rid }),
          { headers: { 'content-type': 'application/json' } }
        ));
      }
    }
  })();

  async function close() {
    server!.close();
    for await (const conn of httpConns) {
      conn.close();
    }
  }

  function getRequest(rid: number) {
    return requests[rid];
  }

  return { port, close, getRequest };
}

function getServer(port: number) {
  let server: Deno.Listener | undefined
  while (!server) {
    try {
      server = Deno.listen({ port });
    } catch (error) {
      if (error instanceof Deno.errors.AddrInUse) {
        console.log(`Port ${port} is already in use. Trying next one...`);
        port++;
      }
    }
  }
  return { server, port };
}

async function getResponse(request: Request): Promise<Record<string, unknown>> {
  const { url, method } = request;
  const [_id, endpoint, ..._params] = url.split("/").slice(4);
  const response: Record<string, unknown> = {};
  if (method === "POST" && endpoint === 'media') {
    response.id = `${Math.round(Math.random() * 1000000000)}`;
    const file = (await request.formData()).get('file') as File;
    response.size = file?.size;
    response.type = file?.type;
    response.name = file?.name;
  }
  return response;
}