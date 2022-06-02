import { useMemo } from "react";
import { getStorageData } from "../utils";
import useSettings from "./useSettings";
import { ISettings } from "../types/Settings";

function useUri() {
  const [settings] = useSettings();

  return useMemo(() => parseUri(settings), [settings]);
}

function parseUri(settings: ISettings | undefined) {
  return (
    settings?.hostname &&
    `${settings.secured ? "https" : "http"}://${settings.hostname}/graphql`
  );
}

export function getUri() {
  return getStorageData("settings").then((settings: any) => parseUri(settings));
}

export default useUri;
