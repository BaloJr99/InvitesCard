// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

import karmaJasmine from "karma-jasmine";
import karmaChromeLauncher from "karma-chrome-launcher";
import karmaJasmineHtmlReporter from "karma-jasmine-html-reporter";
import karmaCoverage from "karma-coverage";
import buildAngular from "@angular-devkit/build-angular/plugins/karma.js";
import path from "path";

export default function (config) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      karmaJasmine,
      karmaChromeLauncher,
      karmaJasmineHtmlReporter,
      karmaCoverage,
      buildAngular,
    ],
    client: {
      jasmine: {
        random: true,
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: path.join(__dirname, "./coverage/invites"),
      subdir: ".",
      reporters: [{ type: "html" }, { type: "text-summary" }],
    },
    reporters: ["progress", "kjhtml"],
    browsers: ["Chrome"],
    restartOnFileChange: true,
    captureTimeout: 60000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 60000,
    singleRun: false,
  });
}
