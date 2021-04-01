import { Http } from "../utils/http";
class Category {
  static async getGridByHome() {
    return await Http.request({
      url: "/category/grid/all",
    });
  }
}

export { Category };
