import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, StaticRouterContext } from 'react-router';

import App from './App';

declare module 'fastify' {
  interface FastifyReply {
    view: (temlate: string, params?: Record<string, unknown>) => void;
  }
}

let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};

syncLoadAssets();

const server = fastify();

server.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs')
  }
});

server.register(fastifyStatic, {
  root: path.join(__dirname, 'public', 'static'),
  prefix: '/static/',
});

server.get('/favicon.ico', (_, reply) => {
  reply.sendFile('favicon.ico', path.join(__dirname, 'public'));
});

server.get('/robots.txt', (_, reply) => {
  reply.sendFile('robots.txt', path.join(__dirname, 'public'));
});

server.get('/*', (request, reply) => {
  const context: StaticRouterContext = {};

  const markup = renderToString(
    <StaticRouter context={context} location={request.raw.url}>
      <App />
    </StaticRouter>
  );

  if (context.url) {
    reply.redirect(context.url)
  } else {
    const template = '/public/index.ejs';
    reply.view(template, {markup, assets})
  }
});

export default server;
