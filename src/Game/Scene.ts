import { Application } from '@pixi/app';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { SpineManager } from './SpineManager';
import { ResourceManager } from './ResourceManager';

export class Scene {
  private app: Application;
  private spineManager: SpineManager;
  private container: Container;
  private resources: ResourceManager;

  constructor(app: Application) {
    this.app = app;
    this.spineManager = new SpineManager(app);
    this.resources = ResourceManager.getInstance();

    this.container = new Container();
    this.app.stage.addChild(this.container);
  }

  public async loadBackground(name: string) {
    await this.resources.loadBundle(name);
    const texture = this.resources.getData(name);
    console.log('Texture:', name, texture);
    const background = Sprite.from(texture);

    background.width = this.app.screen.width;
    background.height = this.app.screen.height;

    this.container.addChild(background);
  }

  public async loadSpineModel(
    name: string,
    x: number,
    y: number,
    scale: number,
    skins: string[] | null = null,
  ) {
    this.spineManager.loadAndPlaySpine(name, x, y, scale);
    const skinNames = this.spineManager.getSkinNames(name);
    this.spineManager.loadCustomSkin(name, 'custom', skins || skinNames);
    this.spineManager.playAllAnimations(name, true);
  }
}
