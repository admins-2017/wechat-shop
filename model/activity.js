import { Http } from "../utils/http";
class Activity {
  static names = "a-2";
  static async getActivityEntranceImg() {
    return await Http.request({
      url: `/activity/name/${this.names}`,
    });
  }

  static async getActivityByName(name) {
    return await Http.request({
      url: `/activity/name/${name}/with_spu`,
    });
  }
}

export { Activity };
