declare module "videojs-http-source-selector" {
  const plugin: any;
  export default plugin;
}

// Extend VideoJS Player type
declare module "video.js" {
  interface Player {
    httpSourceSelector: (options: any) => void;
    controlBar: any;
  }

  function videojs(element: HTMLVideoElement | string, options?: any): Player;
  export = videojs;
}
