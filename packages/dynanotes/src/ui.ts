import express from 'express';
//import * as fs from 'fs-extra';
import * as path from 'path';
import klaw from 'klaw';

const nextFolder = path.join(process.cwd(), '.next');
const publicFolder = path.join(process.cwd(), 'public');

class Route {
  match: (url: string) => boolean;
  render: (req: express.Request, res: express.Response) => void;
}
const routes: Route[] = [];
let errorRoutes: { [ key: string ]: Route } = {};

function makeMatch(base: string) {
  if (base === '/index') {
    return (url: string) => url === '/';
  }
  const split = base.substr(1).split('/');
  let dynamic = false;
  for (const item of split) {
    if (item.startsWith('[')) {
      dynamic = true;
      break;
    }
  }
  if (dynamic) {
    return (url: string) => {
      const urlSplit = url.substr(1).split('/');
      if (split.length !== urlSplit.length) {
        return false;
      }
      for (let i = 0; i < split.length; ++i) {
        if (!split[i].startsWith('[') && split[i] !== urlSplit[i]) {
          return false;
        }
      }
      return true;
    };
  } else {
    return (url: string) => url === base;
  }
}

let ok = false;
let initializing = false;
let initialized = false;
const initResolves: any[] = [];
function init() {
  return new Promise<boolean>(async (resolve) => {
    if (initialized) {
      resolve(ok);
      return;
    }
    if (initializing) {
      initResolves.push(resolve);
      return;
    }
    initializing = true;
    await new Promise<void>((resolve, reject) => {
      const pages = path.join(nextFolder, 'serverless/pages');
      klaw(pages).on('data', (item) => {
        const local = item.path.substr(pages.length);
        const base = local.substr(0, local.length - path.extname(local).length);
        let match = makeMatch(base);
        if (local.endsWith('.html')) {
          routes.push({
            match,
            render: (_req, res) => res.sendFile(item.path),
          });
        } else if (local.endsWith('.js')) {
          const page = require(item.path);
          if (typeof page.render === 'function') {
            routes.push({
              match,
              render: page.render,
            });
          } else if (typeof page.default === 'function') {
            routes.push({
              match,
              render: page.default,
            });
          }
        }
      }).on('end', resolve).on('error', reject);
    });
    for (let i = 0; i < routes.length; ++i) {
      if (routes[i].match('/404')) {
        errorRoutes['404'] = routes[i];
        routes.splice(i, 1);
        --i;
      } else if (routes[i].match('/500')) {
        errorRoutes['500'] = routes[i];
        routes.splice(i, 1);
        --i;
      }
    }
    initialized = true;
    ok = true;
    for (const resolve of initResolves) {
      resolve(ok);
    }
    resolve(ok);
  });
}

export async function ui(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.url) {
    if (!await init()) {
      next();
      return;
    }
    express.static(publicFolder)(req, res, () => {
      const error = (type: string) => {
        if (errorRoutes[type]) {
          errorRoutes[type].render(req, res);
        } else {
          next();
        }
      };
      try {
        const url = req.url;
        for (const route of routes) {
          if (route.match(url)) {
            route.render(req, res);
            return;
          }
        }
        if (url.startsWith('/_next/static')) {
          req.url = req.url.substr(7);
          express.static(nextFolder)(req, res, error.bind(null, '404'));
          return;
        }
        error('404');
      } catch (err) {
        console.error(err);
        error('500');
      }
    });
  } else {
    next();
  }
}