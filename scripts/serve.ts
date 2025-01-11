import hander from "serve-handler";
import http from "http";
import getPort, { portNumbers } from "get-port";

import packageJson from "../package.json" with { type: "json" };

const givenBasePath = packageJson.name;

function ensureBothEndsSlash(path: string) {
  const hasStartSlash = path.startsWith("/");
  const hasEndSlash = path.endsWith("/");
  if (hasStartSlash && hasEndSlash) {
    return path;
  }
  if (hasStartSlash) {
    return `${path}/`;
  }
  if (hasEndSlash) {
    return `/${path}`;
  }
  return `/${path}/`;
}

function ensureStartsWithSlash(path: string) {
  if (path.startsWith("/")) {
    return path;
  }
  return `/${path}`;
}

const basePath = ensureBothEndsSlash(givenBasePath);

const server = http.createServer((request, response) => {
  console.log("Request URL: ", request.url);
  
  // request.urlがbasePathで始まる場合、basePathを削除してからserve-handlerに渡す
  if (request.url?.startsWith(basePath)) {
    request.url = ensureStartsWithSlash(request.url.slice(basePath.length));
    console.log("Rewrited URL", request.url);
  } else {
    // 404
    response.statusCode = 404;
    response.end("Not Found");
    return
  }

  return hander(request, response, {
    public: "dist",
    cleanUrls: true,
  });
});

const port = await getPort({ port: portNumbers(3000, 3100) });

server.listen(port, () => {
  console.log(`Running at http://localhost:${port}${basePath}`);
});
