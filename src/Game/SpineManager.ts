import { Application } from '@pixi/app';
import { Spine, Skin } from '@esotericsoftware/spine-pixi';
import { Utils } from '../utils/Utils';
import '@pixi/interaction';
import '@pixi/events';

export class SpineManager {
  private app: Application;
  private spineInstances: Map<string, Spine> = new Map();
  private animationMap: Map<string, Map<string, any>> = new Map();
  private skinMap: Map<string, Map<string, any>> = new Map();

  constructor(app: Application) {
    this.app = app;
  }

  public loadAndPlaySpine(name: string, x: number, y: number, scale: number) {
    if (!name) throw new Error('No bundle loaded, need to load a bundle first');
    const spine = Spine.from(name, `${name}Atlas`, {
      scale,
    });

    spine.x = x;
    spine.y = y;

    this.generateAnimationMap(name, spine);
    this.generateSkinMap(name, spine);

    this.app.stage.addChild(spine);
    this.spineInstances.set(name, spine);

    this.addMouseEvents(spine, name);
  }

  public loadCustomSkin(
    spineName: string,
    name: string = 'custom',
    loadSkins: string[] | null,
  ) {
    const spine = this.spineInstances.get(spineName);
    if (!spine) throw new Error('No spine data found');

    const skeletonData = spine.skeleton.data;
    if (!skeletonData) throw new Error('No skeleton data found');

    const skin = new Skin(name);
    const skins = loadSkins;

    skins?.forEach(skinName => {
      const foundSkin = skeletonData.findSkin(skinName);
      if (foundSkin) {
        skin.addSkin(foundSkin);
      } else {
        console.warn(`Skin ${skinName} not found`);
      }
    });

    spine.skeleton.setSkin(skin);
    spine.skeleton.setSlotsToSetupPose();

    this.app.stage.addChild(spine);
  }

  private generateSkinMap(name: string, spine: Spine) {
    const skins = spine.skeleton.data.skins;
    const skinMap = new Map<string, Skin>();

    skins.forEach(skin => {
      skinMap.set(skin.name, skin);
    });

    this.skinMap.set(name, skinMap);
    console.log(`Skin map for ${name}:`, skinMap);
  }

  private generateAnimationMap(name: string, spine: Spine) {
    const animations = spine.state.data.skeletonData.animations;
    if (!animations) throw new Error('No animations found');

    const animationMap = new Map<string, any>();

    animations.forEach(animation => {
      animationMap.set(animation.name, animation);
    });

    this.animationMap.set(name, animationMap);
    console.log('Animation map:', this.animationMap);
  }

  public clearAnimationMap(name: string) {
    this.animationMap.get(name)!.clear();
  }

  public playAllAnimations(spineName: string, loop: boolean) {
    const animations = Array.from(
      this.animationMap.get(spineName)?.keys() || [],
    );
    console.log('Playing all animations:', animations);
    this.playSpecialAnimation(spineName, animations, 0, loop);
  }

  public playAnimation(spineName: string, name: string, loop: boolean = false) {
    const spine = this.spineInstances.get(spineName);
    if (!spine) throw new Error('No spine data found');

    spine.state.setAnimation(0, name, loop);
  }

  public playSpecialAnimation(
    spineName: string,
    animations: string[],
    currentAnimation: number,
    loop: boolean = false,
  ) {
    const spine = this.spineInstances.get(spineName);
    if (!spine) throw new Error('No spine data found');

    spine.state.setAnimation(0, animations[currentAnimation], false);

    const animationListener = {
      complete: () => {
        spine?.state.removeListener(animationListener);

        if (loop || currentAnimation + 1 < animations.length) {
          requestAnimationFrame(() => {
            const nextAnimation = (currentAnimation + 1) % animations.length;
            this.playSpecialAnimation(
              spineName,
              animations,
              nextAnimation,
              loop,
            );
            Utils.checkMemoryUsage(() => {
              // console.log('clear memory');
            });
          });
        }
      },
    };

    spine.state.addListener(animationListener);
  }

  public getAnimationNames(spineName: string) {
    return Array.from(this.animationMap.get(spineName)?.keys() || []);
  }

  public getSkinNames(spineName: string) {
    return Array.from(this.skinMap.get(spineName)?.keys() || []);
  }

  private addMouseEvents(spine: Spine, name: string) {
    spine.interactive = true;
    spine.buttonMode = true;
    spine.cursor = 'pointer';

    spine.on('pointerover', () => {
      // this.playAnimation(name, 'hover', true);
    });

    spine.on('pointerout', () => {
      this.playAnimation(name, 'idle', true);
    });

    spine.on('pointerdown', () => {
      // this.playAnimation(name, 'clicked', false);
    });

    spine.on('pointerup', () => {
      this.playAnimation(name, 'idle', true);
    });
  }
}
