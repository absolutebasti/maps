declare module "react-simple-maps" {
  import { ComponentType, CSSProperties, ReactNode } from "react";
  import { Feature, FeatureCollection, Geometry } from "geojson";

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: Record<string, unknown>;
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (event: { coordinates: [number, number]; zoom: number }) => void;
    onMoveEnd?: (event: { coordinates: [number, number]; zoom: number }) => void;
    onMove?: (event: { coordinates: [number, number]; zoom: number }) => void;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | FeatureCollection | Record<string, unknown>;
    parseGeographies?: (geographies: Feature[]) => Feature[];
    children: (data: { geographies: Feature[] }) => ReactNode;
  }

  export interface GeographyProps {
    geography: Feature<Geometry, Record<string, unknown>>;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onMouseMove?: (event: React.MouseEvent) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
    onMouseUp?: (event: React.MouseEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    className?: string;
    tabIndex?: number;
  }

  export interface AnnotationProps {
    subject: [number, number];
    dx?: number;
    dy?: number;
    curve?: number;
    connectorProps?: Record<string, unknown>;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Annotation: ComponentType<AnnotationProps>;
}

