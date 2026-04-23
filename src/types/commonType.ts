import { MediaType } from "./mediaType.type";

import type { JSX } from "react";

export type onHoverDisplayElementsType = {
  elementName: MediaType;
  element: JSX.Element;
}[];
