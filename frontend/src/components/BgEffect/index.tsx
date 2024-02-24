import { useLayoutEffect } from 'react';
import Effect from 'vanta/dist/vanta.clouds.min';
import './style.css';
import { useTheme } from '@mui/material';

const BgEffect = () => {
  const theme = useTheme();
  useLayoutEffect(() => {
    try {
      const opts =
        theme.palette.mode === 'light'
          ? {
              skyColor: '#d4edfd',
              cloudShadowColor: '#3d4a57',
            }
          : {
              skyColor: '#000000',
              cloudColor: '#353535',
              cloudShadowColor: '#000000',
              sunColor: '#121212',
              sunGlareColor: '#121212',
              sunlightColor: '#121212',
            };

      const vantaEffect = Effect({
        el: '#animated-bg',
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        speed: 1.25,
        ...opts,
      });
      return () => {
        vantaEffect.destroy();
      };
    } catch (e) {
      console.error(e);
    }
  }, [theme.palette.mode]);

  return <div id="animated-bg" />;
};

export default BgEffect;
