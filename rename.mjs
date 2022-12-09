import glob from "glob";
import fs from "node:fs/promises";

function findMetaJSON() {
  return new Promise((resolve, reject) => {
    glob("./**/*.json", {}, function (er, files) {
      if (er) reject(e);
      resolve(files.filter((v) => v.includes("meta")));
    });
  });
}

await findMetaJSON().then((files) => {
  files.forEach(async (file) => {
    fs.rename(file, `${file.replace('meta', '_meta')}`);
  });
});
