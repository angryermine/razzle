import { FastifyInstance } from 'fastify';

const PORT = process.env.PORT || 3000;

let app: FastifyInstance = require('./server').default;

function start(instance: FastifyInstance, callback?: (address: string) => void) {
  instance.listen(PORT, (err, address) => {
    if (err) {
      console.error(err);
    };

    callback?.(address);
  });
}

if (module.hot) {
  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      const hot = require('./server').default;
      app.server.close(() => start(hot));
      app = hot;
    } catch (error) {
      console.error(error);
    }
  });

  console.info('✅  Server-side HMR Enabled!');
}

export default start(app, (address) => {
  console.log(`> App started ${address}`);
});
