/** 矩阵操作类 */

class Matrix{
  m ;
  // 构造器
  constructor(matrix){
    this.m = matrix;
  }
 
  /** 
   * 普通遍历写法
   * 转置逻辑
   * 将二维数组进行重新排列成新的二维数组
   * 遍历规则 将列为外层循环 行为内层循环
   * 例： [[1,4,7],[2,5,8],[3,6,9]]
   * for( j=0; j<10;j++){
   *   for(i = 0 ; i <10 ; i++){
   *     a[i][j]
   *   }
   * }
   * 结果 [[1,2,3],[4,5,6],[7,8,9]]
   */ 
  forEach(callback){
    for(let j =0;j < this.closNumber;j++){
      for(let i = 0; i <this.rowsNumber; i++){
        // 获取二维数组中的每一个元素
        const element = this.m[i][j]
        callback(element,i,j)
      }
    }

  }

  // 获取当前矩阵的行数
  get rowsNumber(){
    //返回二维数组的长度
    return this.m.length
  }

  // 获取当前矩阵的列数
  get closNumber(){
    return this.m[0].length
  }

  // 矩阵转置写法
  transpose(){
    // 创建新的矩阵
    const desArr =[]
    for(let j =0;j < this.closNumber;j++){
      // 确定新矩阵的的行(元素个数) 创建子数组 desArr=[[],[],[],...]
      desArr[j]=[]
      for(let i = 0; i <this.rowsNumber; i++){
        // 元素颠倒 原始矩阵的[i][j]的元素 等于新矩阵的[j][i] 
        desArr[j][i] = this.m[i][j] 
      }
    }
    return desArr
  }
}

export{
  Matrix
}