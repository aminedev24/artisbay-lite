// Promise.withResolvers polyfill (requires Node 22+, we're on v20)
if (!Promise.withResolvers) {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  };
}

// Windows: fs.readlink on a plain directory returns EISDIR instead of EINVAL.
// Webpack handles EINVAL (not a symlink) but throws on EISDIR, so we normalize it.
const fs = require('fs');

const patch = (err) => {
  if (err && err.code === 'EISDIR') err.code = 'EINVAL';
  return err;
};

const orig = fs.readlink.bind(fs);
fs.readlink = (path, opts, cb) => {
  if (typeof opts === 'function') { cb = opts; opts = undefined; }
  orig(path, opts, (err, val) => cb(patch(err), val));
};

const origSync = fs.readlinkSync.bind(fs);
fs.readlinkSync = (...a) => { try { return origSync(...a); } catch (e) { throw patch(e); } };

const p = fs.promises;
const origP = p.readlink.bind(p);
Object.defineProperty(p, 'readlink', {
  value: async (...a) => { try { return await origP(...a); } catch (e) { throw patch(e); } },
  writable: true, configurable: true,
});
