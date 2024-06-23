import { Application } from '@pixi/app';
import { ResourceManager } from './ResourceManager';
import { ASSET_RESOURCES } from './resources';
import { Scene } from './Scene';

export class Game {
  app: Application;
  private scene: Scene;
  private resourceManager: ResourceManager;

  constructor(app: Application) {
    this.app = app;
    this.scene = new Scene(app);
    this.resourceManager = ResourceManager.getInstance();
  }

  public async loadResources(): Promise<void> {
    const resources = ASSET_RESOURCES;
    await this.resourceManager.init(resources);

    if (this.app && this.app.screen) {
      await this.scene.loadBackground('background1');

      await this.loadSpineModels();
    }
  }

  private async loadSpineModels() {
    this.loadSpineModel(
      'role1',
      this.app.screen.width / 4,
      this.app.screen.height,
      0.18,
    );
    this.loadSpineModel(
      'role2',
      this.app.screen.width / 2,
      this.app.screen.height,
      0.18,
    );

    this.loadSpineModel(
      'role3',
      (this.app.screen.width / 4) * 3,
      this.app.screen.height,
      0.18,
    );

    this.loadSpineModel(
      'role4',
      this.app.screen.width / 4,
      this.app.screen.height / 2,
      0.18,
    );

    const skins = [
      'nose/long',
      'skin-base',
      'eyes/eyes-blue',
      'hair/brown',
      'clothes/dress-green',
      'legs/pants-jeans',
      'accessories/bag',
      'accessories/hat-red-yellow',
      'eyelids/girly',
    ];

    this.loadSpineModel(
      'mix-and-match-pro',
      this.app.screen.width / 2,
      this.app.screen.height / 2,
      0.5,
      skins,
    );

    this.loadSpineModel(
      'boy',
      (this.app.screen.width / 4) * 3,
      this.app.screen.height / 2,
      0.5,
    );
  }

  private async loadSpineModel(
    name: string,
    x: number,
    y: number,
    scale: number,
    skins: string[] | null = null,
  ) {
    if (!this.resourceManager) throw new Error('Not load Resource Manager');

    await this.resourceManager.loadBundle(name);
    this.scene.loadSpineModel(name, x, y, scale, skins);
  }
}
