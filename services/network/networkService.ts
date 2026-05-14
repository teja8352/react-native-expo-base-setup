import * as Network from "expo-network";

import type { LoggerService } from "../logger";

export type NetworkListener = (state: Network.NetworkState) => void;

export type NetworkService = {
  getState(): Promise<Network.NetworkState>;
  subscribe(listener: NetworkListener): () => void;
};

export function createNetworkService(logger: LoggerService): NetworkService {
  return {
    async getState() {
      const state = await Network.getNetworkStateAsync();
      logger.debug("Network snapshot", {
        type: state.type,
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
      return state;
    },
    subscribe(listener: NetworkListener) {
      const subscription = Network.addNetworkStateListener((state) => {
        logger.debug("Network changed", {
          type: state.type,
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
        });
        listener(state);
      });
      return () => subscription.remove();
    },
  };
}
