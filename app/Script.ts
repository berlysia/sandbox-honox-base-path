// copy and add some tweaks

import { PropsWithChildren } from "hono/jsx";
import { Fragment, jsx } from "hono/jsx/jsx-runtime";
import { Script as OriginalScript } from "honox/server";

// mock
const HasIslands = ({ children }: PropsWithChildren) => {
  return children;
};

const Script: typeof OriginalScript = (options) => {
  const src = options.src;
  if (options.prod ?? import.meta.env.PROD) {
    let manifest = options.manifest;
    if (!manifest) {
      const MANIFEST = import.meta.glob("/dist/.vite/manifest.json", {
        eager: true
      });
      for (const [, manifestFile] of Object.entries(MANIFEST)) {
        // @ts-expect-error
        if (manifestFile["default"]) {
          // @ts-expect-error
          manifest = manifestFile["default"];
          break;
        }
      }
    }
    if (manifest) {
      const scriptInManifest = manifest[src.replace(/^\//, "")];
      if (scriptInManifest) {
        return /* @__PURE__ */ jsx(HasIslands, { children: /* @__PURE__ */ jsx(
          "script",
          {
            type: "module",
            async: !!options.async,
            src: `/${scriptInManifest.file}`,
            nonce: options.nonce
          }
        ) });
      }
    }
    return /* @__PURE__ */ jsx(Fragment, {});
  } else {
    return /* @__PURE__ */ jsx("script", { type: "module", async: !!options.async, src, nonce: options.nonce });
  }
};
export {
  Script
};
