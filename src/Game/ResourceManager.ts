import { Assets, AssetsManifest } from '@pixi/assets';
import { Resources } from './interfaces';

export class ResourceManager {
  private static instance: ResourceManager;
  private resources: Map<string, any>;

  private constructor() {
    this.resources = new Map();
  }

  public static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  public async init(resources: Resources): Promise<void> {
    const manifest: AssetsManifest = {
      bundles: resources,
    };
    await Assets.init({ manifest });
  }

  public async loadBundle(name: string): Promise<void> {
    const loadedResources = await Assets.loadBundle(name);
    console.log('Loaded resources:', loadedResources);
    Object.keys(loadedResources).forEach(name => {
      this.resources.set(name, loadedResources[name]);
    });
  }

  public getData(name: string) {
    return this.resources.get(name);
  }

  public getSpineAtlas(name: string) {
    return this.resources.get(`${name}Atlas`);
  }

  public getSpineTexture(name: string) {
    return this.resources.get(`${name}Texture`);
  }
}
