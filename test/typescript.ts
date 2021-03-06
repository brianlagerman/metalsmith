﻿import * as Metalsmith from "..";

import * as assert from "assert";
import * as child_process from "child_process";
import * as fs from "fs";
import * as Mode from "stat-mode";
import * as path from "path";
import * as rm from "rimraf";

import Stats = fs.Stats;
import exec = child_process.exec;
import "mocha";

const equal = require("assert-dir-equal"); // tslint:disable-line
const noop = () => { }; // tslint:disable-line
const fixture = path.resolve.bind(path, __dirname, "fixtures");

describe("Metalsmith", () => {
    beforeEach(() => {
        rm.sync("test/tmp");
    });

    it("should expose a constructor", () => {
        assert.equal(typeof Metalsmith, "function");
    });

    it("should not require the `new` keyword", () => {
        const m = Metalsmith("test/tmp");
        assert(m instanceof Metalsmith);
    });

    it("should error without a working directory", () => {
        // Error TS2346 (TS) Supplied parameters do not match any signature of call target.
        // Metalsmith();
        const metalsmith = Metalsmith.bind(0);
        assert.throws(() => {
            metalsmith();
        }, /You must pass a working directory path\./);
    });

    it("should use `./src` as a default source directory", () => {
        const m = Metalsmith("test/tmp");
        assert.equal(m.source(), m.directory() + "\\src");
    });

    it("should use `./build` as a default destination directory", () => {
        const m = Metalsmith("test/tmp");
        assert.equal(m.destination(), m.directory() + "\\build");
    });

    it("should default clean to `true`", () => {
        const m = Metalsmith("test/tmp");
        assert.equal(m.clean(), true);
    });

    describe("#use", () => {
        it("should add a plugin to the plugins stack", () => {
            const m = Metalsmith("test/tmp");
            m.use(noop);
            // Leaving this out, 'plugins' property doesn't seem to be intentionally exposed.
            // assert.equal(m.plugins.length, 1);
            assert.ok(true, "'plugins' not exposed.");
        });
    });

    describe("#ignore", () => {
        it("should add an ignore file to the internal ignores list", () => {
            const m = Metalsmith("test/tmp");
            m.ignore("dirfile");
            assert(1 === m.ignore().length);
        });
    });

    describe("#directory", () => {
        it("should set a working directory", () => {
            const m = Metalsmith("test/tmp");
            m.directory("dir");
            assert(~m.directory().indexOf("dir"));
        });

        it("should get the working directory", () => {
            const m = Metalsmith("test/tmp");
            assert(~m.directory().indexOf(path.sep + path.join("test", "tmp")));
        });

        it("should be able to be absolute", () => {
            const m = Metalsmith("test/tmp");
            m.directory("/dir");
            assert.equal(m.directory(), path.resolve("/dir"));
        });

        it("should error on non-string", () => {
            // Error TS2345 (TS) Argument of type '0' is not assignable to parameter of type 'string'.
            // Metalsmith("test/tmp").directory(0);
            const directory = Metalsmith("test/tmp").directory.bind(0);
            assert.throws(() => {
                directory(0);
            }, /You must pass a directory path string\./);
        });
    });

    describe("#source", () => {
        it("should set a source directory", () => {
            const m = Metalsmith("test/tmp");
            m.source("dir");
            assert(~m.source().indexOf("dir"));
        });

        it("should get the full path to the source directory", () => {
            const m = Metalsmith("test/tmp");
            assert(~m.source().indexOf(path.resolve(path.join("test", "tmp", "src"))));
        });

        it("should be able to be absolute", () => {
            const m = Metalsmith("test/tmp");
            m.source("/dir");
            assert.equal(m.source(), path.resolve("/dir"));
        });

        it("should error on non-string", () => {
            // Error TS2345 (TS) Argument of type '0' is not assignable to parameter of type 'string'.
            // Metalsmith("test/tmp").source(0);
            const source = Metalsmith("test/tmp").source.bind(0);
            assert.throws(() => {
                source(0);
            }, /You must pass a source path string\./);
        }); 
    });

    describe("#destination", () => {
        it("should set a destination directory", () => {
            const m = Metalsmith("test/tmp");
            m.destination("dir");
            assert(~m.destination().indexOf("dir"));
        });

        it("should get the full path to the destination directory", () => {
            const m = Metalsmith("test/tmp");
            assert(~m.destination().indexOf(path.join("test", "tmp", "build")));
        });

        it("should be able to be absolute", () => {
            const m = Metalsmith("test/tmp");
            m.destination("/dir");
            assert.equal(m.destination(), path.resolve("/dir"));
        });

        it("should error on non-string", () => {
            // Error TS2345 (TS) Argument of type '0' is not assignable to parameter of type 'string'.
            // Metalsmith("test/tmp").destination(0);
            const destination = Metalsmith("test/tmp").destination.bind(0);
            assert.throws(() => {
                destination(0);
            }, /You must pass a destination path string\./);
        });
    });

    describe("#concurrency", () => {
        it("should set a max number for concurrency", () => {
            const m = Metalsmith("test/tmp");
            m.concurrency(15);
            assert.equal(m.concurrency(), 15);
        });

        it("should get the max number for concurrency", () => {
            const m = Metalsmith("test/tmp");
            m.concurrency(25);
            assert.equal(m.concurrency(), 25);
        });

        it("should be infinitely concurrent by default", () => {
            const m = Metalsmith("test/tmp");
            assert.equal(m.concurrency(), Infinity);
        });
    });

    describe("#clean", () => {
        it("should set the clean option", () => {
            const m = Metalsmith("test/tmp");
            m.clean(false);
            assert.equal(m.clean(), false);
        });

        it("should get the value of the clean option", () => {
            const m = Metalsmith("test/tmp");
            assert.equal(m.clean(), true);
        });

        it("should error on non-boolean", () => {
            // Error TS2345 (TS) Argument of type '0' is not assignable to parameter of type 'string'.
            // Metalsmith("test/tmp").clean(0);
            const clean = Metalsmith("test/tmp").clean.bind(0);
            assert.throws(() => {
                clean(0);
            }, /You must pass a boolean\./);
        });
    });

    describe("#frontmatter", () => {
        it("should set the frontmatter option", () => {
            const m = Metalsmith("test/tmp");
            m.frontmatter(false);
            assert.equal(m.frontmatter(), false);
        });

        it("should get the value of the frontmatter option", () => {
            const m = Metalsmith("test/tmp");
            assert.equal(m.frontmatter(), true);
        });

        it("should error on non-boolean", () => {
            // Error TS2345 (TS) Argument of type '0' is not assignable to parameter of type 'string'.
            // Metalsmith("test/tmp").frontmatter(0);
            const frontmatter = Metalsmith("test/tmp").frontmatter.bind(0);
            assert.throws(() => {
                frontmatter(0);
            }, /You must pass a boolean\./);
        });
    });

    describe("#metadata", () => {
        it("should get metadata", () => {
            const m = Metalsmith("test/tmp");
            assert.deepEqual(m.metadata(), {});
        });

        it("should set a clone of metadata", () => {
            const m = Metalsmith("test/tmp");
            const data = { property: true };
            m.metadata(data);
            assert.notEqual(m.metadata(), data);
            assert.deepEqual(m.metadata(), data);
        });

        it("should error on non-object", () => {
            // Error TS2345 (TS) Argument of type '0' is not assignable to parameter of type 'object'.
            // Metalsmith("test/tmp").metadata(0);
            const metadata = Metalsmith("test/tmp").metadata.bind(0);
            assert.throws(() => {
                metadata(0);
            }, /You must pass a metadata object\./);
        });
    });

    describe("#path", () => {
        it("should return a path relative to the working directory", () => {
            const m = Metalsmith("test/tmp");
            const actualPath = m.path("one", "two", "three");
            assert(~actualPath.indexOf(path.resolve("test/tmp/one/two/three")));
        });
    });

    describe("#read", () => {
        it("should read from a source directory", (done) => {
            const m = Metalsmith(fixture("read"));
            const stats = fs.statSync(fixture("read/src/index.md"));
            m.read((err, files) => {
                if (err) { return done(err); }
                assert.deepEqual(files, {
                    "index.md": {
                        contents: new Buffer("body"),
                        mode: stats.mode.toString(8).slice(-4),
                        stats,
                        title: "A Title",
                    },
                });
                done();
            });
        });

        it("should traverse a symbolic link to a directory", function(done) {
            // symbolic links are not really a thing on Windows
            if (process.platform === "win32") { this.skip(); }
            const m = Metalsmith(fixture("read-symbolic-link"));
            const stats = fs.statSync(fixture("read-symbolic-link/src/dir/index.md"));
            m.read((err, files) => {
                if (err) { return done(err); }
                assert.deepEqual(files, {
                    "dir/index.md": {
                        contents: new Buffer("body"),
                        mode: stats.mode.toString(8).slice(-4),
                        stats,
                        title: "A Title",
                    },
                });
                done();
            });
        });

        it("should read from a provided directory", (done) => {
            const m = Metalsmith(fixture("read-dir"));
            const stats = fs.statSync(fixture("read-dir/dir/index.md"));
            const dir = fixture("read-dir/dir");
            m.read(dir, (err, files) => {
                if (err) { return done(err); }
                assert.deepEqual(files, {
                    "index.md": {
                        contents: new Buffer("body"),
                        mode: stats.mode.toString(8).slice(-4),
                        stats,
                        title: "A Title",
                    },
                });
                done();
            });
        });

        it("should preserve an existing file mode", (done) => {
            const m = Metalsmith(fixture("read-mode"));
            const stats = fs.statSync(fixture("read-mode/src/bin"));
            m.read((err, files) => {
                if (err) { return done(err); }
                assert.deepEqual(files, {
                    bin: {
                        contents: new Buffer("echo test"),
                        mode: stats.mode.toString(8).slice(-4),
                        stats,
                    },
                });
                done();
            });
        });

        it("should expose the stats property in each file metadata", (done) => {
            const m = Metalsmith(fixture("expose-stat"));
            m.read((err, files) => {
                const file: any = files["index.md"];
                assert(isStats(file.stats));
                done();
            });
            function isStats(arg: any): arg is Stats {
                return arg.isFile !== undefined;
            }
        });

        it("should not parse frontmatter if frontmatter is false", (done) => {
            const m = Metalsmith(fixture("read-frontmatter"));
            m.frontmatter(false);
            m.read((err, files) => {
                if (err) { return done(err); }
                assert.equal(files["index.md"].thing, undefined);
                done();
            });
        });

        it("should still read all when concurrency is set", (done) => {
            const m = Metalsmith("test/fixtures/concurrency");
            m.concurrency(3);
            m.read((err, files) => {
                if (err) { return done(err); }
                assert.equal(Object.keys(files).length, 10);
                done();
            });
        });

        it("should ignore the files specified in ignores", (done) => {
            const stats = fs.statSync(path.join(__dirname, "fixtures/basic/src/index.md"));
            const m = Metalsmith("test/fixtures/basic");
            m.ignore("nested");
            m.read((err, files) => {
                if (err) { return done(err); }
                assert.deepEqual(files, {
                    "index.md": {
                        contents: new Buffer("body"),
                        date: new Date("2013-12-02"),
                        mode: stats.mode.toString(8).slice(-4),
                        stats,
                        title: "A Title",
                    },
                });
                done();
            });
        });

        it("should ignore the files specified in function-based ignores", (done) => {
            const stats = fs.statSync(path.join(__dirname, "fixtures/basic/src/index.md"));
            const m = Metalsmith("test/fixtures/basic");
            m.ignore((filepath: string, stats: Stats) => {
                return stats.isDirectory() && path.basename(filepath) === "nested";
            });
            m.read((err, files) => {
                if (err) { return done(err); }
                assert.deepEqual(files, {
                    "index.md": {
                        contents: new Buffer("body"),
                        date: new Date("2013-12-02"),
                        mode: stats.mode.toString(8).slice(-4),
                        stats,
                        title: "A Title",
                    },
                });
                done();
            });
        });
    });

    describe("#write", () => {
        it("should write to a destination directory", (done) => {
            const m = Metalsmith(fixture("write"));
            const files = { "index.md": { contents: new Buffer("body") } };
            m.write(files, (err) => {
                if (err) { return done(err); }
                equal(fixture("write/build"), fixture("write/expected"));
                done();
            });
        });

        it("should write to a provided directory", (done) => {
            const m = Metalsmith(fixture("write-dir"));
            const files = { "index.md": { contents: new Buffer("body") } };
            const dir = fixture("write-dir/out");
            m.write(files, dir, (err) => {
                if (err) { return done(err); }
                equal(fixture("write-dir/out"), fixture("write-dir/expected"));
                done();
            });
        });

        it("should chmod an optional mode from file metadata", function(done) {
            // chmod is not really working on windows https://github.com/nodejs/node-v0.x-archive/issues/4812#issue-11211650
            if (process.platform === "win32") { this.skip(); }
            const m = Metalsmith(fixture("write-mode"));
            const files = {
                "bin": {
                    contents: new Buffer("echo test"),
                    mode: "0777",
                },
            };

            m.write(files, (err) => {
                const stats = fs.statSync(fixture("write-mode/build/bin"));
                const mode = new Mode(stats).toOctal();
                assert.equal(mode, "0777");
                done();
            });
        });

        it("should still write all when concurrency is set", (done) => {
            const m = Metalsmith("test/fixtures/concurrency");
            m.read((err, files) => {
                if (err) { return done(err); }
                m.write(files, (err) => {
                    if (err) { return done(err); }
                    equal("test/fixtures/concurrency/build", "test/fixtures/concurrency/expected");
                    done();
                });
            });
        });
    });

    describe("#run", () => {
        it("should apply a plugin", (done) => {
            const m = Metalsmith("test/tmp");
            m.use(plugin);
            m.run({ one: "one" }, (err, files, metalsmith) => {
                assert.equal(files.one, "one");
                assert.equal(files.two, "two");
                done();
            });

            function plugin(files: { [index: string]: any }, metalsmith: Metalsmith, done: any) {
                assert.equal(files.one, "one");
                assert.equal(m, metalsmith);
                assert.equal(typeof done, "function");
                files.two = "two";
                done();
            }
        });

        it("should run with a provided plugin", (done) => {
            const m = Metalsmith("test/tmp");
            m.run({ one: "one" }, [plugin], (err, files, metalsmith) => {
                assert.equal(files.one, "one");
                assert.equal(files.two, "two");
                done();
            });

            function plugin(files: { [index: string]: any }, metalsmith: Metalsmith, done: any) {
                assert.equal(files.one, "one");
                assert.equal(m, metalsmith);
                assert.equal(typeof done, "function");
                files.two = "two";
                done();
            }
        });

        it("should support synchronous plugins", (done) => {
            const m = Metalsmith("test/tmp");
            m.use(plugin);
            m.run({ one: "one" }, (err, files, metalsmith) => {
                assert.equal(files.one, "one");
                assert.equal(files.two, "two");
                done();
            });

            function plugin(files: { [index: string]: any }, metalsmith: Metalsmith) {
                assert.equal(files.one, "one");
                assert.equal(m, metalsmith);
                files.two = "two";
            }
        });
    });

    describe("#process", () => {
        it("should return files object with no plugins", (done) => {
            Metalsmith(fixture("basic"))
                .process((err, files) => {
                    if (err) { return done(err); }
                    assert.equal(typeof files, "object");
                    assert.equal(typeof files["index.md"], "object");
                    assert.equal(files["index.md"].title, "A Title");
                    assert.equal(typeof files[path.join("nested", "index.md")], "object");
                    done();
                });
        });
        it("should apply a plugin", (done) => {
            Metalsmith(fixture("basic-plugin"))
                .use((files, metalsmith, done) => {
                    Object.keys(files).forEach((file) => {
                        const data = files[file];
                        data.contents = new Buffer(data.title);
                    });
                    done();
                })
                .process((err, files) => {
                    if (err) { return done(err); }
                    assert.equal(typeof files, "object");
                    assert.equal(Object.keys(files).length, 2);
                    assert.equal(typeof files["one.md"], "object");
                    assert.equal(files["one.md"].title, "one");
                    assert.equal(files["one.md"].contents.toString("utf8"), "one");
                    assert.equal(typeof files["two.md"], "object");
                    assert.equal(files["two.md"].title, "two");
                    assert.equal(files["two.md"].contents.toString("utf8"), "two");
                    done();
                });
        });
    });

    describe("#build", () => {
        it("should do a basic copy with no plugins", (done) => {
            Metalsmith(fixture("basic"))
                .build((err, files) => {
                    if (err) { return done(err); }
                    assert.equal(typeof files, "object");
                    equal(fixture("basic/build"), fixture("basic/expected"));
                    done();
                });
        });

        it("should preserve binary files", (done) => {
            Metalsmith(fixture("basic-images"))
                .build((err, files) => {
                    if (err) { return done(err); }
                    assert.equal(typeof files, "object");
                    equal(fixture("basic-images/build"), fixture("basic-images/expected"));
                    done();
                });
        });

        it("should apply a plugin", (done) => {
            Metalsmith(fixture("basic-plugin"))
                .use((files, metalsmith, done) => {
                    Object.keys(files).forEach((file) => {
                        const data = files[file];
                        data.contents = new Buffer(data.title);
                    });
                    done();
                })
                .build((err) => {
                    if (err) { return done(err); }
                    equal(fixture("basic-plugin/build"), fixture("basic-plugin/expected"));
                    done();
                });
        });

        it("should remove an existing destination directory", (done) => {
            const m = Metalsmith(fixture("build"));
            const dir = path.join("test", "fixtures", "build", "build");
            rm.sync(fixture("build/build"));
            fs.mkdirSync(fixture("build/build"));
            const cmd = process.platform === "win32"
                ? `type NUL > ${dir}\\empty.md`
                : "touch test/fixtures/build/build/empty.md";
            exec(cmd, (err: any) => {
                if (err) { return done(err); }
                const files = { "index.md": { contents: new Buffer("body") } };
                m.build((err) => {
                    if (err) { return done(err); }
                    equal(fixture("build/build"), fixture("build/expected"));
                    done();
                });
            });
        });

        it("should not remove existing destination directory if clean is false", (done) => {
            const dir = path.join("test", "fixtures", "build-noclean", "build");
            const cmd = process.platform === "win32"
                ? `if not exist ${dir} mkdir ${dir} & type NUL > ${dir}\\empty.md`
                : `mkdir -p ${dir} && touch ${dir}/empty.md`;
            const m = Metalsmith(fixture("build-noclean"));
            m.clean(false);
            exec(cmd, (err: any) => {
                if (err) { return done(err); }
                const files = { "index.md": { contents: new Buffer("body") } };
                m.build((err) => {
                    if (err) { return done(err); }
                    equal(fixture("build-noclean/build"), fixture("build-noclean/expected"));
                    done();
                });
            });
        });
    });
});

describe("CLI", () => {
    const bin = "node " + path.resolve(__dirname, "../bin/metalsmith");

    describe("build", () => {
        it("should error without a metalsmith.json", (done) => {
            exec(bin, { cwd: fixture("cli-no-config") }, (err, stdout) => {
                assert(err);
                assert(~err.message.indexOf("could not find a metalsmith.json configuration file."));
                done();
            });
        });
        it("should grab config from metalsmith.json", (done) => {
            exec(bin, { cwd: fixture("cli-json") }, (err, stdout) => {
                if (err) { return done(err); }
                equal(fixture("cli-json/destination"), fixture("cli-json/expected"));
                assert(~stdout.indexOf("successfully built to "));
                assert(~stdout.indexOf(fixture("cli-json/destination")));
                done();
            });
        });

        it("should grab config from a config.json", (done) => {
            exec(bin + " -c config.json", { cwd: fixture("cli-other-config") }, (err, stdout) => {
                if (err) { return done(err); }
                equal(fixture("cli-other-config/destination"), fixture("cli-other-config/expected"));
                assert(~stdout.indexOf("successfully built to "));
                assert(~stdout.indexOf(fixture("cli-other-config/destination")));
                done();
            });
        });

        it("should require a plugin", (done) => {
            exec(bin, { cwd: fixture("cli-plugin-object") }, (err, stdout, stderr) => {
                if (err) { return done(err); }
                equal(fixture("cli-plugin-object/build"), fixture("cli-plugin-object/expected"));
                assert(~stdout.indexOf("successfully built to "));
                assert(~stdout.indexOf(fixture("cli-plugin-object/build")));
                done();
            });
        });

        it("should require plugins as an array", (done) => {
            exec(bin, { cwd: fixture("cli-plugin-array") }, (err, stdout) => {
                if (err) { return done(err); }
                equal(fixture("cli-plugin-array/build"), fixture("cli-plugin-array/expected"));
                assert(~stdout.indexOf("successfully built to "));
                assert(~stdout.indexOf(fixture("cli-plugin-array/build")));
                done();
            });
        });

        it("should error when failing to require a plugin", (done) => {
            exec(bin, { cwd: fixture("cli-no-plugin") }, (err) => {
                assert(err);
                assert(~err.message.indexOf("failed to require plugin \"metalsmith-non-existant\"."));
                done();
            });
        });

        it("should error when failing to use a plugin", (done) => {
            exec(bin, { cwd: fixture("cli-broken-plugin") }, (err) =>  {
                assert(err);
                assert(~err.message.indexOf("error using plugin \"./plugin\"..."));
                assert(~err.message.indexOf("Break!"));
                assert(~err.message.indexOf("at module.exports"));
                done();
            });
        });

        it("should allow requiring a local plugin", (done) => {
            exec(bin, { cwd: fixture("cli-plugin-local") }, (err, stdout, stderr) => {
                equal(fixture("cli-plugin-local/build"), fixture("cli-plugin-local/expected"));
                assert(~stdout.indexOf("successfully built to "));
                assert(~stdout.indexOf(fixture("cli-plugin-local/build")));
                done();
            });
        });
    });
});
