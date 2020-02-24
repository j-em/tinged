import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";

type Size = {
  width: number;
  height: number;
};

type Position = {
  x: number;
  y: number;
};

const Container = styled.div.attrs<{ width: number }>(props => ({
  style: { width: `${props.width}px` }
}))<{ width: number; type: "before" | "after"; height: number }>`
  position: absolute;
  height: ${props => `${props.height}px`};
  background-color: ${props => {
    switch (props.type) {
      case "before":
        return props.theme.colors.brand;
      case "after":
        return "";
    }
  }};
`;

type ThumbProps = {
  width: number;
  height: number;
  left: number;
  top: number;
};
const Thumb = styled.div.attrs<ThumbProps>(props => ({
  style: { top: "50%", left: props.left }
}))<ThumbProps>`
  transform: translateY(-50%);
  position: absolute;
  background-color: black;
  transition: 0.2s opacity;

  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
`;

type SliderProps = {
  value?: number;
  className?: string;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;

  sliding: boolean;
  onStartSliding?: () => void;
  onStopSliding?: () => void;

  hideThumb?: boolean;
  initialThumbSize?: Size;

  beforeThumbColor?: string;
  afterThumbColor?: string;

  disabled?: boolean;
};

const Slider: React.FC<SliderProps> = ({
  className,
  value = 0,
  min = 0,
  max = 100,

  onChange,
  initialThumbSize,
  onStartSliding,
  onStopSliding,
  sliding,
  disabled = false
}) => {
  const sliderRef = useRef<HTMLElement | null>(null);

  const {
    width: sliderWidth = 1,
    height: sliderHeight = 1
  } = useResizeObserver({ ref: sliderRef });

  const sliderLeft = useRef(0);

  const mapOffsetToValue = useCallback(
    (offset: number): number => {
      const ratio = offset / sliderWidth;
      const value = ratio * max;

      return value >= max ? max : value <= 0 ? 0 : value;
    },
    [sliderWidth, max]
  );

  const mapValueToOffset = useCallback(
    (v: number): number => {
      if (max === 0) {
        return 0;
      } else {
        const ratio = v / max;
        return ratio * sliderWidth;
      }
    },
    [sliderWidth, max]
  );

  const thumbSize: Size = initialThumbSize || {
    width: 10,
    height: sliderHeight
  };

  const [offset, setOffset] = useState(0);

  const updateOffset = useCallback(
    (offset: number): void => {
      const o = offset < 0 ? 0 : offset > sliderWidth ? sliderWidth : offset;

      setOffset(o);
    },
    [thumbSize.width, sliderWidth, setOffset]
  );

  const upListener = useCallback(() => onStopSliding && onStopSliding(), [
    onStopSliding
  ]);

  const moveListener = useCallback(
    ({ pageX: x, pageY: y }: MouseEvent) => {
      const offset = x - sliderLeft.current;
      updateOffset(offset);

      const updatedValue = mapOffsetToValue(offset);
      onChange?.(updatedValue);
    },
    [updateOffset, mapOffsetToValue, thumbSize, onChange]
  );

  useLayoutEffect(() => {
    updateOffset(mapValueToOffset(value));
  }, [mapValueToOffset, updateOffset, value]);

  useEffect(() => {
    if (sliding) {
      window.addEventListener("mouseup", upListener);
      window.addEventListener("mousemove", moveListener);

      return () => {
        window.removeEventListener("mouseup", upListener);
        window.removeEventListener("mousemove", moveListener);
      };
    }
  }, [sliding, upListener, moveListener]);

  return (
    <div
      ref={ref => {
        if (ref) {
          sliderRef.current = ref;
          sliderLeft.current = ref.getBoundingClientRect()?.left;
        }
      }}
      className={className}
      onMouseDown={({ pageX, pageY }) => {
        if (!disabled) {
          const offset = pageX - sliderLeft.current;

          updateOffset(offset);

          if (onChange) {
            onChange(mapOffsetToValue(offset));
          }

          if (onStartSliding) {
            onStartSliding();
          }
        }
      }}
    >
      <Container width={offset} height={sliderHeight} type="before" />

      <Thumb
        {...thumbSize}
        left={offset - thumbSize.width / 2}
        top={0}
        onMouseDown={ev => {
          if (!disabled) {
            if (onStartSliding) {
              onStartSliding();
            }

            ev.preventDefault();
          }
        }}
      />
    </div>
  );
};

const StyledSlider = styled(Slider)`
  position: relative;
  background-color: lightgray;

  ${Thumb} {
    opacity: ${props => (props.hideThumb ? 0 : 1)};
    cursor: ${props => (props.disabled ? "initial" : "pointer")};
  }
`;

export { Thumb };
export default StyledSlider;
