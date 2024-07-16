import { create } from "zustand";

export const useLayersStore = create(() => ({
  selectedLayer: null,
  layers: [],
}));

export const addLayers = (layers) =>
  useLayersStore.setState((state) => ({
    layers: [...state.layers, ...layers],
  }));

export const selectLayer = (layer) =>
  useLayersStore.setState({ selectedLayer: layer });

export const removeAvatarLayer = () =>
  Promise.resolve(
    useLayersStore.setState((state) => ({
      layers: state.layers.filter((layer) => layer.name !== "Avatar"),
    })),
  );
