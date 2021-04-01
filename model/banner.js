//banner 模块的业务逻辑
import { Http } from "../utils/http";

class Banner {
  static LocationTop = "b-1";
  static LocationG="b-2";
  static async getHomeLocationTopBanner() {
    return await Http.request({
      url: `/banner/name/${this.LocationTop}`,
    });
  }

  static async getHomeLocationGBanner() {
    return await Http.request({
      url: `/banner/name/${this.LocationG}`,
    });
  }
}

export { Banner };
