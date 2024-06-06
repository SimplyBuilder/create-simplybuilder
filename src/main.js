'use strict';

const fs = require("node:fs");
const path = require("node:path");
const { fileURLToPath } = require("node:url");
const spawn = require("cross-spawn");
const minimist = require("minimist");
const prompts = require("prompts");
const {red, reset, yellow, blue, green} = require("kolorist");

// Avoids autoconversion to number of the project name by defining that the args
// non-associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist(process.argv.slice(2), { string: ["_"] });
const cwd = process.cwd();

const TEMPLATES_MODELS = [
    {
        name: "vanilla-project-landing-page",
        display: "Project Starter",
        color: yellow,
        variants: [
            {
                name: "vanilla-landing-page",
                display: "Landing Page",
                color: yellow
            },
            {
                name: "vanilla-spa",
                display: "Single-Page Application",
                color: green
            }
        ]
    }
];
const TEMPLATES = TEMPLATES_MODELS.map(f => (f.variants?.map(v => v.name)) || [f.name]).reduce((a, b) => a.concat(b), []);
const renameFiles = {
    _gitignore: ".gitignore"
};
const defaultTargetDir = "simplyBuilder-project-"+ Date.now();
const formatTargetDir = targetDir => targetDir?.trim().replace(/\/+$/g, "");
const isValidPackageName = projectName => /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
const toValidPackageName = projectName => projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
const emptyDir = dir => {
    if (!fs.existsSync(dir)) return;
    for (const file of fs.readdirSync(dir)) {
        if (file === ".git") continue;
        fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
    }
};
const isEmpty = path => {
    const files = fs.readdirSync(path);
    return files.length === 0 || (files.length === 1 && files[0] === ".git");
};
const copyDir = (srcDir, destDir) => {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        copy(srcFile, destFile);
    }
};
const copy = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        copyDir(src, dest);
    } else fs.copyFileSync(src, dest);
};
//
const pkgFromUserAgent = userAgent => {
    if (!userAgent) return undefined;
    const pkgSpec = userAgent.split(" ")[0];
    const pkgSpecArr = pkgSpec.split("/");
    return {name: pkgSpecArr[0], version: pkgSpecArr[1]};
};
const showFinishProcess = (pkgManager) => {
    const types = {
        "yarn": () => {
            console.log("  yarn");
            console.log("  yarn dev");
        },
        "default": () => {
            console.log(`  ${pkgManager} install`);
            console.log(`  ${pkgManager} run dev`);
        }
    };
    if(types[pkgManager]) {
        types[pkgManager]();
    } else types["default"]();
};
const showFinishFolder = (data) => {
    const {root, cdProjectName} = data;
    if (root !== cwd) {
        if (cdProjectName.includes(" ")) {
            console.log(' cd "'+ cdProjectName +'"');
        } else console.log(' cd '+ cdProjectName);
    }
};
const folderProcess = (data) => {
    const {overwrite, root} = data;
    if (overwrite === "yes") {
        emptyDir(root);
    } else if (!fs.existsSync(root)) {
        fs.mkdirSync(root, {recursive: true});
    }
};
//
const init = async () => {
    const argTargetDir = formatTargetDir(argv['_[0]']);
    const argTemplate = argv['template'] || argv.t;

    let targetDir = argTargetDir || defaultTargetDir;
    const getProjectName = () => targetDir === "." ? path.basename(path.resolve()) : targetDir;

    let result;

    prompts['override']({overwrite: argv.overwrite});

    try {
        // noinspection JSUnusedGlobalSymbols
        result = await prompts([
            {
                type: argTargetDir ? null : "text",
                name: "projectName",
                message: reset("Project name:"),
                initial: defaultTargetDir,
                onState: state => {
                    targetDir = formatTargetDir(state.value) || defaultTargetDir
                }
            },
            {
                type: () =>
                    !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "select",
                name: "overwrite",
                message: () =>
                    (targetDir === "."
                        ? "Current directory"
                        : `Target directory "${targetDir}"`) +
                    ` is not empty. Please choose how to proceed:`,
                initial: 0,
                choices: [
                    {
                        title: "Remove existing files and continue",
                        value: "yes"
                    },
                    {
                        title: "Cancel operation",
                        value: "no"
                    },
                    {
                        title: "Ignore files and continue",
                        value: "ignore"
                    }
                ]
            },
            {
                type: (_, {overwrite}) => {
                    if (overwrite === "no") {
                        throw new Error(red("✖") + " Operation cancelled")
                    }
                    return null
                },
                name: "overwriteChecker"
            },
            {
                type: () => (isValidPackageName(getProjectName()) ? null : "text"),
                name: "packageName",
                message: reset("Package name:"),
                initial: () => toValidPackageName(getProjectName()),
                validate: dir => isValidPackageName(dir) || "Invalid package.json name"
            },
            {
                type:
                    argTemplate && TEMPLATES.includes(argTemplate) ? null : "select",
                name: "framework",
                message:
                    typeof argTemplate === "string" && !TEMPLATES.includes(argTemplate)
                        ? reset(`"${argTemplate}" isn't a valid template. Please choose from below: `)
                        : reset("Select a framework:"),
                initial: 0,
                choices: TEMPLATES_MODELS.map(framework => {
                    const frameworkColor = framework.color;
                    return {title: frameworkColor(framework.display || framework.name), value: framework};
                })
            },
            {
                type: framework => framework?.variants ? "select" : null,
                name: "variant",
                message: reset("Select a variant:"),
                choices: framework => {
                    return framework.variants.map(variant => {
                        const variantColor = variant.color;
                        return {title: variantColor(variant.display || variant.name), value: variant.name};
                    })
                }
            }
        ], {
            onCancel: () => {
                throw new Error(red("✖") + " Operation cancelled")
            }
        });
    } catch (cancelled) {
        console.log(cancelled.message);
        return;
    }
    // user choice associated with prompts
    const {framework, overwrite, packageName, variant} = result;
    const root = path.join(cwd, targetDir);
    //
    folderProcess({overwrite, root});
    // determine template
    let template = variant || framework?.name || argTemplate;
    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
    const pkgManager = pkgInfo ? pkgInfo.name : "npm";
    const isYarn1 = pkgManager === "yarn" && pkgInfo?.version.startsWith("1.");

    const {customCommand} = TEMPLATES_MODELS.flatMap(f => f.variants).find(v => v.name === template) ?? {};

    if (customCommand) {
        const fullCustomCommand = customCommand
            .replace(/^npm create /, () => {
                // `bun create` uses it's own set of templates,
                // the closest alternative is using `bun x` directly on the package
                if (pkgManager === "bun") return "bun x create-";
                return `${pkgManager} create `;
            })
            // Only Yarn 1.x doesn't support `@version` in the `create` command
            .replace("@latest", () => (isYarn1 ? "" : "@latest"))
            .replace(/^npm exec/, () => {
                // Prefer `pnpm dlx`, `yarn dlx`, or `bun x`
                if (pkgManager === "pnpm") return "pnpm dlx";
                if (pkgManager === "yarn" && !isYarn1) return "yarn dlx";
                if (pkgManager === "bun") return "bun x";
                // Use `npm exec` in all other cases,
                // including Yarn 1.x and other custom npm clients.
                return "npm exec";
            })

        const [command, ...args] = fullCustomCommand.split(" ")
        // we replace TARGET_DIR here because targetDir may include a space
        const replacedArgs = args.map(arg => arg.replace("TARGET_DIR", targetDir))
        const {status} = spawn.sync(command, replacedArgs, {stdio: "inherit"});
        process.exit(status ?? 0);
    }

    console.log(`\nScaffolding project in ${root}...`);
    const templateDir = path.resolve(__dirname, "..", "templates", `template-${template}`);
    const write = (file, content) => {
        const targetPath = path.join(root, renameFiles[file] ?? file);
        if (content) {
            fs.writeFileSync(targetPath, content);
        } else copy(path.join(templateDir, file), targetPath);
    };
    const files = fs.readdirSync(templateDir);
    for (const file of files.filter(f => f !== "package.json")) {
        write(file);
    }
    const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), "utf-8"));
    pkg.name = packageName || getProjectName();
    write("package.json", JSON.stringify(pkg, null, 2) + "\n");
    const cdProjectName = path.relative(cwd, root);
    console.log(`\nDone. Now run:\n`);
    //
    showFinishFolder({root, cdProjectName});
    //
    showFinishProcess(pkgManager);
    //
};
init().catch(console.error);