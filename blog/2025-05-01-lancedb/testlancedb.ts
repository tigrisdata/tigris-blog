import * as lancedb from "@lancedb/lancedb";
import * as arrow from "apache-arrow";
import "@lancedb/lancedb/embedding/openai";
import { LanceSchema, getRegistry } from "@lancedb/lancedb/embedding";
import { EmbeddingFunction } from "@lancedb/lancedb/embedding";
import { glob } from "glob";
import { readFile } from "node:fs/promises";
import { chunkify } from "./markdownChunk";

const bucketName = process.env.BUCKET_NAME || "tigris-example";

interface Utterance {
  fname: string;
  heading: string;
  content: string;
  url: string;
}

const func = getRegistry()
  .get("openai")
  ?.create({ model: "text-embedding-3-small" }) as EmbeddingFunction;

const contentSchema = LanceSchema({
  text: func.sourceField(new arrow.Utf8()),
  vector: func.vectorField(),
  url: new arrow.Utf8(),
  heading: new arrow.Utf8(),
});

const fnameToURL = (fname) => {
  let ref = /\.\.\/\.\.\/(.*)\.md/.exec(fname)![1];
  if (ref.endsWith("/index")) {
    ref = ref.slice(0, -"index".length);
  }
  return `https://tigrisdata.com/docs/${ref}`;
};

// XXX(Xe): this would be top-level async statements, but this repo in particular
// doesn't really support that due to the hard constraints of docusarus. Imagine
// that this immediately-invoked-function-expression isn't here.
(async () => {
  const markdownFiles = glob.sync("../../**/*.md");
  const files = [...markdownFiles].filter(
    (fname) => !fname.endsWith("README.md")
  );
  files.sort();

  const utterances: Utterance[] = [];

  for (const fname of files) {
    const data = await readFile(fname, "utf-8");
    const chunks = await chunkify(data);

    chunks.forEach(({ heading, content }) => {
      utterances.push({
        fname,
        heading,
        content,
        url: fnameToURL(fname),
      });
    });
  }

  const db = await lancedb.connect(`s3://${bucketName}/docs-test`, {
    storageOptions: {
      endpoint: "https://fly.storage.tigris.dev",
      region: "auto",
    },
  });

  const tbl = await db.createEmptyTable("content", contentSchema, {
    mode: "create",
    existOk: true,
  });

  let docs: Record<string, string>[] = []; // temporary buffer so we don't block all the time
  const MAX_BUFFER_SIZE = 100;
  for (const utterance of utterances) {
    const { heading, content, url } = utterance;
    docs.push({
      heading,
      text: content,
      url,
    });

    if (docs.length >= MAX_BUFFER_SIZE) {
      console.log(`adding ${docs.length} documents`);
      await tbl.add(docs);
      docs = [];
    }
  }

  if (docs.length !== 0) {
    console.log(`adding ${docs.length} documents`);
    await tbl.add(docs);
  }

  await tbl.createIndex("vector");

  const query = "Tigris";
  const actual = await tbl.search(query).limit(10).toArray();
  console.log(
    actual.map(({ url, heading, text }) => {
      return { url, heading, text };
    })
  );
})();
