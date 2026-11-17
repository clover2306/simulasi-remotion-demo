import './index.css';
import {Composition} from 'remotion';
import {DemoVideo} from './DemoVideo';
import {FPS, TOTAL_FRAMES} from './demoPlan';
import {W, H} from './lib/tokens';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Demo"
      component={DemoVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
