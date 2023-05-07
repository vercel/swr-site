import { useId } from "react";
import useLocalesMap from "./use-locales-map";
import { type FeatureKey, featuresMap, titleMap } from "../translations/text";

import BackendAgnosticIcon from "./icons/backend-agnostic";
import LightweightIcon from "./icons/lightweight";
import PaginationIcon from "./icons/pagination";
import RealtimeIcon from "./icons/realtime";
import RemoteLocalIcon from "./icons/remote-local";
import RenderingStrategiesIcon from "./icons/rendering-strategies";
import SuspenseIcon from "./icons/suspense";
import TypeScriptIcon from "./icons/typescript";

type Icon = React.FC<React.SVGProps<SVGSVGElement>>;

const FEATURE_ICONS: Record<FeatureKey, Icon> = {
  lightweight: LightweightIcon,
  realtime: RealtimeIcon,
  suspense: SuspenseIcon,
  pagination: PaginationIcon,
  backendAgnostic: BackendAgnosticIcon,
  renderingStrategies: RenderingStrategiesIcon,
  typescript: TypeScriptIcon,
  remoteLocal: RemoteLocalIcon,
};

export default function Features() {
  const componentId = useId();
  const title = useLocalesMap(titleMap);
  const features = useLocalesMap(featuresMap);

  return (
    <div className="mx-auto max-w-full w-[880px] text-center px-4 mb-10">
      <p className="text-lg mb-2 text-gray-600 md:!text-2xl">{title}</p>
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-10 mx-0 mb-8 sm:grid-cols-4 md:gap-x-8">
        {Object.entries(FEATURE_ICONS).map(
          ([key, FeatureIcon]: [FeatureKey, Icon]) => (
            <div
              className="inline-flex justify-center items-center md:justify-start pl-0"
              key={componentId + key}
            >
              <FeatureIcon className="w-5 h-6 min-w-[20px] stroke-[2.5px] md:w-6" />
              <h4 className="text-sm my-0 mr-0 ml-2 font-bold whitespace-nowrap sm:text-[0.9rem] md:text-lg">
                {features[key]}
              </h4>
            </div>
          )
        )}
      </div>
    </div>
  );
}
