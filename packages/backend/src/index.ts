import {
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
  notFoundHandler,
  SingleConnectionDatabaseManager,
  SingleHostDiscovery,
  UrlReaders,
  ServerTokenManager,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { PluginEnvironment } from './types';
import catalog from './plugins/catalog';
import scaffolder from './plugins/scaffolder';
import auth from './plugins/auth';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import argocd from './plugins/argocd';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = SingleHostDiscovery.fromConfig(config);
  const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
  const database = SingleConnectionDatabaseManager.fromConfig(config);
  const identity = DefaultIdentityClient.create({
    discovery,
  });

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const databaseManager = database.forPlugin(plugin);
    return {
      logger,
      database: databaseManager,
      config,
      reader,
      discovery,
      tokenManager,
      identity,
    };
  };
}

async function main() {
  const config = await loadBackendConfig({
    argv: process.argv,
    logger: getRootLogger(),
  });
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
  const argocdEnv = useHotMemoize(module, () => createEnv('argocd'));

  const apiRouter = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('/catalog', await catalog(catalogEnv))
    .addRouter('/scaffolder', await scaffolder(scaffolderEnv))
    .addRouter('/auth', await auth(authEnv))
    .addRouter('/techdocs', await techdocs(techdocsEnv))
    .addRouter('/proxy', await proxy(proxyEnv))
    .addRouter('/argocd', await argocd(argocdEnv));

  await apiRouter.start().catch(err => {
    getRootLogger().error(`Backend failed to start up: ${err}`);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error(`Backend failed to start: ${error}`);
  process.exit(1);
});
