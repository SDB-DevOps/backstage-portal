import { DockerContainerRunner } from '@backstage/backend-common';
import {
  createRouter,
  Preparers,
  Generators,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
import Docker from 'dockerode';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const { config, discovery, logger } = env;

  const preparers = await Preparers.fromConfig(config, {
    logger,
    discovery,
  });

  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });

  const generators = await Generators.fromConfig(config, {
    logger,
    containerRunner,
  });

  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });

  return await createRouter({
    preparers,
    generators,
    publisher,
    logger,
    config,
    discovery,
  });
}
