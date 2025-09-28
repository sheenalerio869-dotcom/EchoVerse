// global.d.ts  (place at project root)
declare module '@react-native-community/slider' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  export interface SliderProps extends ViewProps {
    value?: number;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    disabled?: boolean;
    onValueChange?: (value: number) => void;
    onSlidingStart?: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
    minimumTrackTintColor?: string;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
    // add more props if you need them
  }

  export default class Slider extends Component<SliderProps> {}
}
